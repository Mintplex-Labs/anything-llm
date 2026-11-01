const AzureOpenAiProvider = require("../../../../../utils/agents/aibitat/providers/azure.js");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    AZURE_OPENAI_ENDPOINT: "https://example.openai.azure.com",
    AZURE_OPENAI_KEY: "test-key",
  };
  delete process.env.AZURE_OPENAI_MODEL_TYPE;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

const messages = [{ role: "user", content: "@agent run my flow" }];
const functions = [
  {
    name: "flow_my_flow",
    description: "Runs the my-flow agent flow",
    parameters: { type: "object", properties: {} },
  },
];

async function* events(items) {
  yield* items;
}

/**
 * Builds the provider and stubs both APIs on its own SDK client so the test
 * can see which endpoint a request is sent to and with what body.
 */
function buildProvider() {
  const provider = new AzureOpenAiProvider({ model: "gpt-6.1-terra" });
  const responsesCreate = jest
    .spyOn(provider.client.responses, "create")
    .mockImplementation(async (body) => {
      if (body.stream)
        return events([
          { type: "response.output_text.delta", delta: "done" },
        ]);
      return {
        output: [
          { type: "message", content: [{ type: "output_text", text: "done" }] },
        ],
      };
    });
  const chatCreate = jest
    .spyOn(provider.client.chat.completions, "create")
    .mockImplementation(async (body) => {
      if (body.stream)
        return events([{ choices: [{ delta: { content: "done" } }] }]);
      return { choices: [{ message: { content: "done" } }] };
    });
  return { provider, responsesCreate, chatCreate };
}

describe("AzureOpenAiProvider reasoning deployments", () => {
  beforeEach(() => {
    process.env.AZURE_OPENAI_MODEL_TYPE = "reasoning";
  });

  it("streams tool calls through the Responses API, not Chat Completions", async () => {
    const { provider, responsesCreate, chatCreate } = buildProvider();
    const result = await provider.stream(messages, functions);

    expect(result.textResponse).toBe("done");
    expect(chatCreate).not.toHaveBeenCalled();
    expect(responsesCreate).toHaveBeenCalledTimes(1);

    const body = responsesCreate.mock.calls[0][0];
    expect(body.model).toBe("gpt-6.1-terra");
    expect(body.stream).toBe(true);
    expect(body.tools).toEqual([
      {
        type: "function",
        name: "flow_my_flow",
        description: "Runs the my-flow agent flow",
        parameters: { type: "object", properties: {} },
        strict: false,
      },
    ]);
    expect(body).not.toHaveProperty("reasoning_effort");
    expect(body).not.toHaveProperty("messages");
  });

  it("completes tool calls through the Responses API, not Chat Completions", async () => {
    const { provider, responsesCreate, chatCreate } = buildProvider();
    const result = await provider.complete(messages, functions);

    expect(result.textResponse).toBe("done");
    expect(chatCreate).not.toHaveBeenCalled();
    expect(responsesCreate).toHaveBeenCalledTimes(1);

    const body = responsesCreate.mock.calls[0][0];
    expect(body.stream).toBe(false);
    expect(body.tools.map((tool) => tool.name)).toEqual(["flow_my_flow"]);
    expect(body).not.toHaveProperty("reasoning_effort");
  });
});

describe("AzureOpenAiProvider default deployments", () => {
  it("keeps using Chat Completions with tools", async () => {
    const { provider, responsesCreate, chatCreate } = buildProvider();
    await provider.stream(messages, functions);
    await provider.complete(messages, functions);

    expect(responsesCreate).not.toHaveBeenCalled();
    expect(chatCreate).toHaveBeenCalledTimes(2);
    for (const [body] of chatCreate.mock.calls) {
      expect(body.model).toBe("gpt-6.1-terra");
      expect(body.tools).toEqual([
        {
          type: "function",
          function: {
            name: "flow_my_flow",
            description: "Runs the my-flow agent flow",
            parameters: { type: "object", properties: {} },
          },
        },
      ]);
    }
  });
});
