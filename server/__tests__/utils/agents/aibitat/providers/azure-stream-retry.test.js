/**
 * Streaming/non-streaming parse-failure retry contract on a representative
 * OpenAI-compatible provider (Azure), including the bounded retry budget.
 */
jest.mock("../../../../../utils/AiProviders/azureOpenAi/index.js", () => ({
  AzureOpenAiLLM: {
    formatBaseUrl: jest.fn(() => "https://stub.openai.azure.com"),
  },
}));

jest.mock(
  "../../../../../utils/agents/aibitat/providers/helpers/responsesTooled.js",
  () => ({
    responsesTooledStream: jest.fn(),
    responsesTooledComplete: jest.fn(),
  })
);

const AzureOpenAiProvider = require("../../../../../utils/agents/aibitat/providers/azure.js");
const {
  responsesTooledStream,
} = require("../../../../../utils/agents/aibitat/providers/helpers/responsesTooled.js");

const functions = [
  {
    name: "search",
    description: "Search the web",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
    },
  },
];

const PROSE = "I cannot search the web";
const ERROR_TEXT = `Failed to parse tool call arguments as JSON. Raw arguments: ${PROSE}`;

function proseStreamClient() {
  const create = jest.fn(async () =>
    (async function* () {
      yield {
        choices: [
          {
            delta: {
              tool_calls: [
                {
                  index: 0,
                  id: "call_1",
                  type: "function",
                  function: { name: "search", arguments: PROSE },
                },
              ],
            },
          },
        ],
      };
    })()
  );
  return { client: { chat: { completions: { create } } }, create };
}

function proseCompleteClient() {
  const create = jest.fn(async () => ({
    choices: [
      {
        message: {
          role: "assistant",
          content: null,
          tool_calls: [
            {
              id: "call_1",
              type: "function",
              function: { name: "search", arguments: PROSE },
            },
          ],
        },
      },
    ],
    usage: null,
  }));
  return { client: { chat: { completions: { create } } }, create };
}

function zeroArgStreamClient() {
  const create = jest.fn(async () =>
    (async function* () {
      yield {
        choices: [
          {
            delta: {
              tool_calls: [
                {
                  index: 0,
                  id: "call_1",
                  type: "function",
                  function: { name: "search" },
                },
              ],
            },
          },
        ],
      };
    })()
  );
  return { client: { chat: { completions: { create } } }, create };
}

describe("AzureOpenAiProvider retryWithError handling", () => {
  let provider;

  beforeEach(() => {
    delete process.env.AZURE_OPENAI_AGENT_API;
    process.env.AZURE_OPENAI_KEY = "test-key";
    provider = new AzureOpenAiProvider({ model: "gpt-4o" });
  });

  describe("stream()", () => {
    it("feeds the parse error back to the model and stops after the retry cap", async () => {
      const { client, create } = proseStreamClient();
      provider._client = client;

      const result = await provider.stream(
        [{ role: "user", content: "search the web" }],
        functions,
        null
      );

      expect(create).toHaveBeenCalledTimes(3);
      expect(JSON.stringify(create.mock.calls[1][0].messages)).toContain(
        ERROR_TEXT
      );
      expect(result.functionCall).toBeNull();
      expect(result.textResponse).toBe(ERROR_TEXT);
      expect(result.uuid).toBeDefined();
    });

    it("executes zero-argument tool calls without retrying", async () => {
      const { client, create } = zeroArgStreamClient();
      provider._client = client;

      const result = await provider.stream(
        [{ role: "user", content: "what time is it" }],
        functions,
        null
      );

      expect(create).toHaveBeenCalledTimes(1);
      expect(result.retryWithError).toBeUndefined();
      expect(result.functionCall.arguments).toEqual({});
    });

    it("passes streaming results through unchanged when the Responses API path is active", async () => {
      process.env.AZURE_OPENAI_AGENT_API = "responses";
      const responsesProvider = new AzureOpenAiProvider({ model: "gpt-4o" });
      responsesTooledStream.mockResolvedValueOnce({
        textResponse: "ok",
        functionCall: null,
      });
      const { client, create } = proseStreamClient();
      responsesProvider._client = client;

      const result = await responsesProvider.stream(
        [{ role: "user", content: "search the web" }],
        functions,
        null
      );

      expect(responsesTooledStream).toHaveBeenCalledTimes(1);
      expect(create).not.toHaveBeenCalled();
      expect(result).toEqual({ textResponse: "ok", functionCall: null });
    });
  });

  describe("complete()", () => {
    it("feeds the parse error back to the model and stops after the retry cap", async () => {
      const { client, create } = proseCompleteClient();
      provider._client = client;

      const result = await provider.complete(
        [{ role: "user", content: "search the web" }],
        functions
      );

      expect(create).toHaveBeenCalledTimes(3);
      expect(JSON.stringify(create.mock.calls[1][0].messages)).toContain(
        ERROR_TEXT
      );
      expect(result.functionCall).toBeNull();
      expect(result.textResponse).toBe(ERROR_TEXT);
    });
  });
});
