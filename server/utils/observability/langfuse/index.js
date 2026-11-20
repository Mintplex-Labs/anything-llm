const FLUSH_INTERVAL_MS = 10_000;
const FLUSH_AT = 20;
const MAX_QUEUE = 1_000;
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Langfuse observability provider.
 * Ships traces as OTLP/JSON to Langfuse's OpenTelemetry endpoint
 * (`/api/public/otel/v1/traces`) so it works with Langfuse Cloud and both v3
 * and v4 self-hosted servers without any SDK dependency. Spans are queued in
 * memory and flushed in the background - network failures are logged and
 * dropped, never surfaced to a chat request.
 */
class LangfuseProvider {
  name = "langfuse";

  constructor(config = {}) {
    this.valid = !!config.publicKey && !!config.secretKey;
    if (!this.valid) return;
    const host = (config.host || "https://cloud.langfuse.com").replace(
      /\/$/,
      ""
    );
    this.endpoint = `${host}/api/public/otel/v1/traces`;
    this.authHeader = `Basic ${Buffer.from(
      `${config.publicKey}:${config.secretKey}`
    ).toString("base64")}`;
    this.queue = [];
    this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
    this.flushTimer.unref();
  }

  /**
   * Queues one completed observation as an OTLP span. Trace roots also carry
   * the trace-level user, session, tags and metadata.
   * @param {import("../index").ExportedObservation} observation
   */
  export(observation) {
    const { trace } = observation;
    if (trace)
      console.log(`[32m[Observability][0m Trace queued - ${observation.name}`, {
        userId: trace.userId,
        sessionId: trace.sessionId,
      });
    const input =
      observation.type === "generation"
        ? this.#sanitizeMessages(observation.input) ?? observation.input
        : observation.input;

    this.#enqueue([
      this.#span({
        traceId: observation.traceId,
        spanId: observation.spanId,
        parentSpanId: observation.parentSpanId,
        name: observation.name,
        startTime: observation.startTime,
        endTime: observation.endTime,
        error: observation.error,
        attributes: {
          "langfuse.observation.type": observation.type,
          "langfuse.observation.input": asJSON(input),
          "langfuse.observation.output": asJSON(observation.output),
          "langfuse.observation.model.name": observation.model || undefined,
          "langfuse.observation.metadata": asJSON(observation.metadata),
          "langfuse.observation.level": observation.error ? "ERROR" : undefined,
          "langfuse.observation.status_message": observation.error || undefined,
          "gen_ai.usage.input_tokens": observation.usage?.prompt_tokens,
          "gen_ai.usage.output_tokens": observation.usage?.completion_tokens,
          "langfuse.observation.cost_details": costDetails(observation.usage),
          ...(trace
            ? {
                "langfuse.trace.input": asJSON(trace.input),
                "langfuse.trace.output": asJSON(trace.output),
                "langfuse.user.id": trace.userId || undefined,
                "langfuse.session.id": trace.sessionId || undefined,
                "langfuse.trace.tags": trace.tags,
                "langfuse.trace.metadata": asJSON(trace.metadata),
              }
            : {}),
        },
      }),
    ]);
  }

  /** Flush any queued spans and stop the background timer. */
  async shutdown() {
    clearInterval(this.flushTimer);
    await this.flush();
  }

  async flush() {
    if (!this.queue.length) return;
    const spans = this.queue.splice(0, this.queue.length);
    const body = JSON.stringify({
      resourceSpans: [
        {
          resource: {
            attributes: [
              {
                key: "service.name",
                value: { stringValue: "anythingllm" },
              },
            ],
          },
          scopeSpans: [{ scope: { name: "anythingllm" }, spans }],
        },
      ],
    });

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.authHeader,
        },
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok)
        console.error(
          `[Observability] Langfuse ingestion failed (${response.status}): ${await response.text().catch(() => "")}`
        );
    } catch (error) {
      console.error(`[Observability] Langfuse unreachable`, error.message);
    }
  }

  /**
   * Reduces messages to plain text so attachments (base64 data URIs) and
   * provider-specific content blocks are never shipped to the trace endpoint.
   * @param {Array<{role: string, content: string|Array}>} [messages]
   * @returns {Array<{role: string, content: string}>|undefined}
   */
  #sanitizeMessages(messages) {
    if (!Array.isArray(messages)) return undefined;
    return messages.map((message) => ({
      role: message.role,
      content: Array.isArray(message.content)
        ? message.content
            .map((block) =>
              block?.type === "text"
                ? block.text
                : `[${block?.type || "media"}]`
            )
            .join("\n")
        : typeof message.content === "string"
          ? message.content
          : "[non-text content]",
    }));
  }

  #enqueue(spans) {
    if (this.queue.length + spans.length > MAX_QUEUE) return;
    this.queue.push(...spans);
    if (this.queue.length >= FLUSH_AT) this.flush();
  }

  #span({
    traceId,
    spanId,
    parentSpanId = undefined,
    name,
    startTime,
    endTime,
    error = null,
    attributes = {},
  }) {
    return {
      traceId,
      spanId,
      ...(parentSpanId ? { parentSpanId } : {}),
      name,
      kind: 1,
      startTimeUnixNano: `${Math.round(startTime)}000000`,
      endTimeUnixNano: `${Math.round(endTime)}000000`,
      attributes: Object.entries(attributes)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => ({ key, value: otelValue(value) })),
      status: error ? { code: 2, message: error } : {},
    };
  }
}

function costDetails(metrics = {}) {
  if (typeof metrics?.totalCost !== "number") return undefined;
  return JSON.stringify({
    input: metrics.inputCost ?? 0,
    output: metrics.outputCost ?? 0,
    total: metrics.totalCost,
  });
}

function asJSON(value) {
  if (value === undefined || value === null) return undefined;
  try {
    return typeof value === "string" ? value : JSON.stringify(value);
  } catch {
    return undefined;
  }
}

function otelValue(value) {
  if (typeof value === "number")
    return Number.isInteger(value)
      ? { intValue: value }
      : { doubleValue: value };
  if (typeof value === "boolean") return { boolValue: value };
  if (Array.isArray(value))
    return { arrayValue: { values: value.map((v) => otelValue(v)) } };
  return { stringValue: String(value) };
}

module.exports = { LangfuseProvider };
