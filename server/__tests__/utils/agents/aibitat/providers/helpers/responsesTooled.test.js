const OpenAI = require("openai");
const {
  responsesTooledStream,
  responsesTooledComplete,
} = require("../../../../../../utils/agents/aibitat/providers/helpers/responsesTooled.js");

describe("temperature forwarding on the Responses API", () => {
  const messages = [{ role: "user", content: "hi" }];

  function fakeClient({ stream = false } = {}) {
    const create = jest.fn(async () => {
      if (!stream) return { output: [], usage: null };
      return (async function* () {
        yield { type: "response.output_text.delta", delta: "ok" };
      })();
    });
    return { client: { responses: { create } }, create };
  }

  it("sends the provider temperature on complete and stream", async () => {
    const complete = fakeClient();
    await responsesTooledComplete(complete.client, "m", messages, [], {
      provider: { temperature: 0.3 },
    });
    expect(complete.create.mock.calls[0][0].temperature).toBe(0.3);

    const streamed = fakeClient({ stream: true });
    await responsesTooledStream(streamed.client, "m", messages, [], null, {
      provider: { temperature: 0 },
    });
    expect(streamed.create.mock.calls[0][0].temperature).toBe(0);
  });

  it("omits temperature entirely when the provider has none", async () => {
    const complete = fakeClient();
    await responsesTooledComplete(complete.client, "m", messages, [], {
      provider: {},
    });
    expect(complete.create.mock.calls[0][0]).not.toHaveProperty("temperature");

    const streamed = fakeClient({ stream: true });
    await responsesTooledStream(streamed.client, "m", messages, [], null, {
      provider: {},
    });
    expect(streamed.create.mock.calls[0][0]).not.toHaveProperty("temperature");
  });
});

describe("Responses API stream failures", () => {
  const messages = [{ role: "user", content: "hi" }];

  function clientForEvents(events) {
    return new OpenAI({
      apiKey: "test",
      maxRetries: 0,
      fetch: async () =>
        new Response(
          events
            .map(
              (event) =>
                `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`
            )
            .join(""),
          { headers: { "Content-Type": "text/event-stream" } }
        ),
    });
  }

  it.each([
    ["before output", []],
    [
      "after partial text",
      [{ type: "response.output_text.delta", delta: "Hi" }],
    ],
    [
      "after a partial tool call",
      [
        {
          type: "response.output_item.added",
          item: {
            type: "function_call",
            name: "search",
            call_id: "call_1",
            arguments: "",
          },
        },
        {
          type: "response.function_call_arguments.delta",
          delta: '{"query":',
        },
      ],
    ],
  ])("rejects a failed response %s", async (_label, precedingEvents) => {
    const client = clientForEvents([
      ...precedingEvents,
      {
        type: "response.failed",
        response: {
          status: "failed",
          error: {
            code: "server_error",
            message: "Upstream generation failed",
          },
        },
      },
    ]);

    await expect(responsesTooledStream(client, "m", messages)).rejects.toThrow(
      "Upstream generation failed"
    );
  });

  it("reports a failed response without an error message", async () => {
    const client = clientForEvents([
      { type: "response.failed", response: { status: "failed", error: null } },
    ]);

    await expect(responsesTooledStream(client, "m", messages)).rejects.toThrow(
      "Responses API request failed"
    );
  });

  it("still rejects standalone SDK error events", async () => {
    const client = clientForEvents([
      { type: "error", code: "server_error", message: "Stream error" },
    ]);

    await expect(responsesTooledStream(client, "m", messages)).rejects.toThrow(
      "Stream error"
    );
  });

  it("returns a completed response and records its usage", async () => {
    const usage = { input_tokens: 2, output_tokens: 1, total_tokens: 3 };
    const provider = { recordUsage: jest.fn() };
    const client = clientForEvents([
      { type: "response.output_text.delta", delta: "ok" },
      { type: "response.completed", response: { status: "completed", usage } },
    ]);

    const result = await responsesTooledStream(
      client,
      "m",
      messages,
      [],
      null,
      {
        provider,
      }
    );

    expect(result.textResponse).toBe("ok");
    expect(result.functionCall).toBeNull();
    expect(provider.recordUsage).toHaveBeenCalledWith(usage);
  });
});
