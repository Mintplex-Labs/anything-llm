const { AWSBedrockLLM } = require("../../../../utils/AiProviders/bedrock");
const {
  LLMPerformanceMonitor,
} = require("../../../../utils/helpers/chat/LLMPerformanceMonitor");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    AWS_BEDROCK_LLM_API_KEY: "test-key",
    AWS_BEDROCK_LLM_REGION: "us-east-1",
    AWS_BEDROCK_LLM_MODEL_PREFERENCE: "meta.llama3-1-8b-instruct-v1:0",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe("AWSBedrockLLM non-streaming metrics", () => {
  it("reports output tokens per second from a duration in seconds", async () => {
    const llm = new AWSBedrockLLM();
    llm.openai = {
      chat: {
        completions: {
          create: () =>
            Promise.resolve({
              choices: [{ message: { content: "hi" } }],
              usage: {
                prompt_tokens: 10,
                completion_tokens: 100,
                total_tokens: 110,
              },
            }),
        },
      },
    };
    // measureAsyncFunction reports the duration in seconds
    jest
      .spyOn(LLMPerformanceMonitor, "measureAsyncFunction")
      .mockImplementation(async (promise) => ({
        output: await promise,
        duration: 2,
      }));

    const { metrics } = await llm.getChatCompletion([
      { role: "user", content: "hi" },
    ]);

    expect(metrics.duration).toBe(2);
    expect(metrics.outputTps).toBe(50);
  });
});
