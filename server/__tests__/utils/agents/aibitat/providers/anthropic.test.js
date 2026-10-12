// Keep network/metadata integrations out of these protocol regression tests.
jest.mock(
  "@anthropic-ai/sdk",
  () =>
    class Anthropic {
      constructor() {
        this.messages = { create: jest.fn() };
      }
    },
  { virtual: true }
);
jest.mock("uuid", () => ({ v4: require("crypto").randomUUID }), {
  virtual: true,
});
jest.mock("../../../../../utils/AiProviders/anthropic", () => ({
  AnthropicLLM: { fetchModelMaxTokens: jest.fn().mockResolvedValue(4096) },
}));
jest.mock("../../../../../endpoints/utils", () => ({
  getAnythingLLMUserAgent: () => "test",
}));
jest.mock("../../../../../utils/http", () => ({
  safeJsonParse: (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },
}));
jest.mock("../../../../../utils/helpers", () => ({}));
jest.mock("../../../../../utils/helpers/modelPricing", () => ({}));
jest.mock("../../../../../utils/agents/aibitat/providers/index", () => ({}));
jest.mock("../../../../../utils/agents/aibitat/utils/toolReranker", () => ({}));
jest.mock("../../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock(
  "../../../../../utils/agents/aibitat/providers/ai-provider",
  () =>
    // The base provider's integrations and usage accounting are independent of
    // the native provider's request formatting and the real AIbitat loop.
    class Provider {
      constructor(client) {
        this.client = client;
      }
      resetUsage() {}
      recordUsage() {}
      resetCumulativeUsage() {}
      getCumulativeUsage() {
        return {};
      }
      getUsage() {
        return {};
      }
    }
);

const AIbitat = require("../../../../../utils/agents/aibitat");
const AnthropicProvider = require("../../../../../utils/agents/aibitat/providers/anthropic");
const {
  anthropicTooledStream,
  anthropicTooledComplete,
} = require("../../../../../utils/agents/aibitat/providers/helpers/anthropicTooled");

const tools = ["fetch_london", "fetch_tokyo"].map((name) => ({
  name,
  parameters: { type: "object", properties: {} },
}));
const messages = () => [
  { role: "user", content: "Get London and Tokyo weather" },
];

async function* streamContent(content) {
  for (const [index, block] of content.entries()) {
    yield { type: "content_block_start", index, content_block: block };
    if (block.type === "tool_use") {
      yield {
        type: "content_block_delta",
        index,
        delta: { type: "input_json_delta", partial_json: "{}" },
      };
    }
    yield { type: "content_block_stop", index };
  }
}

const variants = [
  ["native streaming", true, true],
  ["native non-streaming", true, false],
  ["Bedrock helper streaming", false, true],
  ["Bedrock helper non-streaming", false, false],
];

function makeProvider(native, streaming) {
  const provider = new AnthropicProvider({ reasoningEffort: "high" });
  const client = provider.client;
  if (!native) {
    provider.stream = (history, functions, eventHandler) =>
      anthropicTooledStream(
        client,
        provider.model,
        4096,
        history,
        functions,
        eventHandler,
        { provider }
      );
    provider.complete = (history, functions) =>
      anthropicTooledComplete(
        client,
        provider.model,
        4096,
        history,
        functions,
        { provider }
      );
  }
  return {
    provider,
    create: client.messages.create,
    invoke: (functions) =>
      streaming
        ? provider.stream(messages(), functions)
        : provider.complete(messages(), functions),
  };
}

describe.each(variants)("%s serial tool calling", (_, native, streaming) => {
  test("requests at most one tool without forcing tool use", async () => {
    const { create, invoke } = makeProvider(native, streaming);
    const content = [{ type: "text", text: "ok" }];
    create.mockResolvedValue(
      streaming ? streamContent(content) : { content, stop_reason: "end_turn" }
    );

    await invoke(tools);

    expect(create.mock.calls[0][0]).toMatchObject({
      tool_choice: { type: "auto", disable_parallel_tool_use: true },
      tools: tools.map(({ name, parameters }) => ({
        name,
        input_schema: parameters,
      })),
    });
    if (native)
      expect(create.mock.calls[0][0].output_config).toEqual({ effort: "high" });
  });

  test("does not send tool_choice when no tools are available", async () => {
    const { create, invoke } = makeProvider(native, streaming);
    const content = [{ type: "text", text: "ok" }];
    create.mockResolvedValue(
      streaming ? streamContent(content) : { content, stop_reason: "end_turn" }
    );

    await invoke([]);

    expect(create.mock.calls[0][0]).not.toHaveProperty("tool_choice");
    expect(create.mock.calls[0][0]).not.toHaveProperty("tools");
  });

  test("executes both requested tools across successive AIbitat turns", async () => {
    const { provider, create } = makeProvider(native, streaming);
    const executed = [];
    create.mockImplementation(async (request) => {
      const results = request.messages.flatMap((message) =>
        Array.isArray(message.content)
          ? message.content.filter((block) => block.type === "tool_result")
          : []
      );
      const remaining = tools.slice(results.length);
      // Model fixture honors Anthropic's serial option. Without it the first
      // reply contains two legal tool_use blocks, reproducing dropped calls.
      const requested = request.tool_choice?.disable_parallel_tool_use
        ? remaining.slice(0, 1)
        : results.length === 0
          ? remaining
          : [];
      const content = requested.length
        ? requested.map(({ name }) => ({
            type: "tool_use",
            id: `call_${name}`,
            name,
            input: {},
          }))
        : [{ type: "text", text: "Both cities checked" }];
      return streaming
        ? streamContent(content)
        : { content, stop_reason: requested.length ? "tool_use" : "end_turn" };
    });
    const agent = new AIbitat();
    agent.providerInstance = provider;
    for (const { name } of tools)
      agent.functions.set(name, {
        handler: async () => {
          executed.push(name);
          return `${name} result`;
        },
      });

    const answer = streaming
      ? await agent.handleAsyncExecution(messages(), tools)
      : await agent.handleExecution(messages(), tools);

    expect(executed).toEqual(["fetch_london", "fetch_tokyo"]);
    expect(answer).toBe("Both cities checked");
    expect(create).toHaveBeenCalledTimes(3);
    const finalResults = create.mock.calls[2][0].messages
      .flatMap((message) => message.content)
      .filter((block) => block.type === "tool_result");
    expect(finalResults.map((block) => block.tool_use_id)).toEqual([
      "call_fetch_london",
      "call_fetch_tokyo",
    ]);
  });
});
