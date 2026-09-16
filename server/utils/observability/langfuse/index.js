const crypto = require("crypto");

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
   * Records a completed LLM interaction as a trace with a nested generation
   * observation and optional child spans. All timing is retrospective - the
   * trace is written after the response has already been sent to the user.
   * @param {import("../index").ChatTraceEvent} event
   */
  traceChat(event) {
    console.log(`\x1b[32m[Observability]\x1b[0m Trace queued - ${event.name}`, {
      userId: event.userId || null,
      sessionId: event.sessionId || null,
      model: event.model || null,
    });
    const endTime = Date.now();
    const duration = Number(event?.metrics?.duration) || 0;
    const startTime = endTime - duration * 1000;
    const traceId = crypto.randomBytes(16).toString("hex");
    const rootSpanId = crypto.randomBytes(8).toString("hex");

    const spans = [
      this.#span({
        traceId,
        spanId: rootSpanId,
        name: event.name,
        startTime,
        endTime,
        attributes: {
          "langfuse.observation.type": "span",
          "langfuse.observation.input": asJSON(event.input),
          "langfuse.observation.output": asJSON(event.output),
          "langfuse.trace.input": asJSON(event.input),
          "langfuse.trace.output": asJSON(event.output),
          "langfuse.user.id": event.userId || undefined,
          "langfuse.session.id": event.sessionId || undefined,
          "langfuse.trace.tags": event.tags,
          "langfuse.trace.metadata": asJSON(event.metadata),
        },
      }),
      this.#span({
        traceId,
        spanId: crypto.randomBytes(8).toString("hex"),
        parentSpanId: rootSpanId,
        name: "completion",
        startTime,
        endTime,
        attributes: {
          "langfuse.observation.type": "generation",
          "langfuse.observation.input": asJSON(
            this.#sanitizeMessages(event.messages) ?? event.input
          ),
          "langfuse.observation.output": asJSON(event.output),
          "langfuse.observation.model.name": event.model || undefined,
          "gen_ai.usage.input_tokens": event?.metrics?.prompt_tokens,
          "gen_ai.usage.output_tokens": event?.metrics?.completion_tokens,
          "langfuse.observation.cost_details": costDetails(event.metrics),
          "langfuse.observation.metadata": asJSON(event.metrics),
        },
      }),
      ...(event.spans || []).map((span) =>
        this.#span({
          traceId,
          spanId: crypto.randomBytes(8).toString("hex"),
          parentSpanId: rootSpanId,
          name: span.name,
          startTime,
          endTime: startTime,
          attributes: {
            "langfuse.observation.type": "span",
            "langfuse.observation.input": asJSON(span.input),
            "langfuse.observation.output": asJSON(span.output),
            "langfuse.observation.metadata": asJSON(span.metadata),
          },
        })
      ),
    ];
    this.#enqueue(spans);
  }

  /**
   * Records a standalone non-chat event (eg: embedding batch) as a single-span trace.
   * @param {import("../index").TraceEvent} event
   */
  traceEvent(event) {
    console.log(
      `\x1b[32m[Observability]\x1b[0m Event queued - ${event.name}`,
      event.metadata || {}
    );
    const now = Date.now();
    const duration = Number(event?.metadata?.duration) || 0;
    this.#enqueue([
      this.#span({
        traceId: crypto.randomBytes(16).toString("hex"),
        spanId: crypto.randomBytes(8).toString("hex"),
        name: event.name,
        startTime: now - duration * 1000,
        endTime: now,
        attributes: {
          "langfuse.observation.type": event.observationType || "span",
          "langfuse.observation.model.name": event.model || undefined,
          "gen_ai.usage.input_tokens": event?.metrics?.prompt_tokens,
          "gen_ai.usage.output_tokens": event?.metrics?.completion_tokens,
          "langfuse.observation.cost_details": costDetails(event.metrics),
          "langfuse.observation.input": asJSON(event.input),
          "langfuse.observation.output": asJSON(event.output),
          "langfuse.observation.metadata": asJSON(event.metadata),
          "langfuse.trace.input": asJSON(event.input),
          "langfuse.trace.output": asJSON(event.output),
          "langfuse.user.id": event.userId || undefined,
          "langfuse.session.id": event.sessionId || undefined,
          "langfuse.trace.tags": event.tags,
          "langfuse.trace.metadata": asJSON(event.metadata),
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
      status: {},
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
