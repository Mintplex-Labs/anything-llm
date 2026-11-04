const { SambaNovaLLM } = require("../../../../utils/AiProviders/sambanova");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, SAMBANOVA_LLM_API_KEY: "test" };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("SambaNovaLLM.getChatCompletion metrics", () => {
  it("counts only completion tokens in outputTps", async () => {
    const llm = new SambaNovaLLM(null, "Meta-Llama-3.1-8B-Instruct");
    // usage reports both rates: total_tokens_per_sec also counts the prompt
    const usage = {
      prompt_tokens: 40,
      completion_tokens: 77,
      total_tokens: 117,
      completion_tokens_per_sec: 315.11,
      total_tokens_per_sec: 478.79,
    };
    llm.openai = {
      chat: {
        completions: {
          create: () =>
            Promise.resolve({
              choices: [{ message: { content: "hi" } }],
              usage,
            }),
        },
      },
    };

    const { metrics } = await llm.getChatCompletion([
      { role: "user", content: "hi" },
    ]);

    expect(metrics.outputTps).toBeCloseTo(77 / metrics.duration, 5);
  });
});
