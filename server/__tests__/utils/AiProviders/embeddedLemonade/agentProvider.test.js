// agents/index.js resolves storage paths from STORAGE_DIR at require time.
process.env.STORAGE_DIR = __dirname;

// agents/index.js loads the MCP SDK, whose dynamic import() crashes the Jest worker on Node 18.
jest.mock("../../../../utils/MCP", () =>
  jest.fn().mockImplementation(() => ({
    activeMCPServers: jest.fn().mockResolvedValue([]),
  }))
);

let mockEnabled = true;
jest.mock("../../../../utils/AiProviders/embeddedLemonade/config", () => ({
  ...jest.requireActual(
    "../../../../utils/AiProviders/embeddedLemonade/config"
  ),
  isEnabled: () => mockEnabled,
}));

const EmbeddedLemonadeProvider = require("../../../../utils/AiProviders/embeddedLemonade/agentProvider");
const {
  EmbeddedLemonadeLLM,
} = require("../../../../utils/AiProviders/embeddedLemonade");
const {
  EmbeddedLemonadeEngine,
} = require("../../../../utils/AiProviders/embeddedLemonade/engine");
const AgentHandler = require("../../../../utils/agents").AgentHandler;

/** An OpenAI-style chat completion stream of these chunks. */
function streamOf(chunks) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk;
    },
  };
}

/**
 * A provider whose model is loaded and whose client returns one completion (or stream) per call.
 * @param {{native: boolean, finishReason: string}} options
 */
function provider({ native, finishReason }) {
  const agent = new EmbeddedLemonadeProvider({ model: "m" });
  agent.preloaded = true;
  agent._supportsToolCalling = native;
  agent.providerLog = () => {};
  agent._client = {
    chat: {
      completions: {
        create: jest.fn(async (body) =>
          body.stream
            ? streamOf([
                {
                  choices: [{ delta: { content: "hi" }, finish_reason: null }],
                },
                {
                  choices: [{ delta: {}, finish_reason: finishReason }],
                  usage: { prompt_tokens: 1, completion_tokens: 1 },
                },
              ])
            : {
                choices: [
                  {
                    message: { content: "hi", tool_calls: null },
                    finish_reason: finishReason,
                  },
                ],
                usage: { prompt_tokens: 1, completion_tokens: 1 },
              }
        ),
      },
    },
  };
  return agent;
}

const MESSAGES = [{ role: "user", content: "hello" }];

beforeEach(() => {
  mockEnabled = true;
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("max output token limit", () => {
  describe.each([
    ["native tool calling", true],
    ["UnTooled", false],
  ])("with %s", (_, native) => {
    it.each(["stream", "complete"])(
      "flags a %s that stopped at the limit",
      async (method) => {
        const agent = provider({ native, finishReason: "length" });
        await agent[method](MESSAGES, [], () => {});
        expect(agent.getCumulativeUsage().truncated).toBe(true);
      }
    );

    it.each(["stream", "complete"])(
      "does not flag a %s that finished normally",
      async (method) => {
        const agent = provider({ native, finishReason: "stop" });
        await agent[method](MESSAGES, [], () => {});
        expect(agent.getCumulativeUsage().truncated).toBeUndefined();
      }
    );
  });

  it("checks each UnTooled completion against its own response", async () => {
    const agent = provider({ native: false, finishReason: "length" });
    await agent.complete(MESSAGES, []);
    expect(agent.getCumulativeUsage().truncated).toBe(true);

    agent._client.chat.completions.create.mockImplementation(async () => ({
      choices: [{ message: { content: "done" }, finish_reason: "stop" }],
    }));
    await agent.complete(MESSAGES, []);
    expect(agent.getCumulativeUsage().truncated).toBeUndefined();
  });

  it("passes the text through to UnTooled unchanged", async () => {
    const agent = provider({ native: false, finishReason: "stop" });
    await expect(agent.complete(MESSAGES, [])).resolves.toMatchObject({
      textResponse: "hi",
    });
  });
});

describe("model loading", () => {
  it.each(["stream", "complete"])(
    "surfaces why the model could not be loaded on %s",
    async (method) => {
      const agent = new EmbeddedLemonadeProvider({ model: "m" });
      jest
        .spyOn(EmbeddedLemonadeEngine, "bootOrContinue")
        .mockResolvedValue(true);
      jest
        .spyOn(EmbeddedLemonadeLLM, "loadModel")
        .mockRejectedValue(new Error("Could not load m: out of memory"));
      await expect(agent[method](MESSAGES, [], () => {})).rejects.toThrow(
        "Could not load m: out of memory"
      );
      expect(agent.preloaded).toBe(false);
    }
  );

  it("loads the model once per provider", async () => {
    const agent = new EmbeddedLemonadeProvider({ model: "m" });
    jest
      .spyOn(EmbeddedLemonadeEngine, "bootOrContinue")
      .mockResolvedValue(true);
    const load = jest
      .spyOn(EmbeddedLemonadeLLM, "loadModel")
      .mockResolvedValue(undefined);
    await agent.preloadModel();
    await agent.preloadModel();
    expect(load).toHaveBeenCalledTimes(1);
  });
});

describe("enabled check", () => {
  it("refuses to build the provider when the engine is not enabled", () => {
    mockEnabled = false;
    expect(() => new EmbeddedLemonadeProvider({ model: "m" })).toThrow(
      "The built-in LLM engine is not enabled."
    );
  });

  it("fails the agent setup check when the engine is not enabled", () => {
    const handler = { provider: "embedded_lemonade" };
    expect(() => AgentHandler.prototype.checkSetup.call(handler)).not.toThrow();
    mockEnabled = false;
    expect(() => AgentHandler.prototype.checkSetup.call(handler)).toThrow(
      "The built-in LLM engine is not enabled. Set ENABLE_BUILT_IN_LLM=true when starting the AnythingLLM Docker container."
    );
  });
});
