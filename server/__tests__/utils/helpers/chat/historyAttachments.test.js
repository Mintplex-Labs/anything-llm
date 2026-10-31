process.env.STORAGE_DIR = "test-storage";

jest.mock("../../../../utils/AiProviders/modelMap", () => ({
  MODEL_MAP: { get: () => 2000 },
}));

const { OpenAiLLM } = require("../../../../utils/AiProviders/openAi");
const {
  GenericOpenAiLLM,
} = require("../../../../utils/AiProviders/genericOpenAi");
const { OllamaAILLM } = require("../../../../utils/AiProviders/ollama");
const { LlmmanLLM } = require("../../../../utils/AiProviders/llmman");
const { CohereLLM } = require("../../../../utils/AiProviders/cohere");
const { GeminiLLM } = require("../../../../utils/AiProviders/gemini");
const { AWSBedrockLLM } = require("../../../../utils/AiProviders/bedrock");
const {
  convertToPromptHistory,
} = require("../../../../utils/helpers/chat/responses");

const imageData =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jG1cAAAAASUVORK5CYII=";
const image = {
  name: "square.png",
  mime: "image/png",
  contentString: `data:image/png;base64,${imageData}`,
};

beforeEach(() => {
  jest.replaceProperty(process, "env", {
    ...process.env,
    OPEN_AI_KEY: "test-only",
    GENERIC_OPEN_AI_API_KEY: "test-only",
    GENERIC_OPEN_AI_BASE_PATH: "http://localhost:1234/v1",
    OLLAMA_BASE_PATH: "http://localhost:11434",
    LLMMAN_BASE_PATH: "http://localhost:11435",
    COHERE_API_KEY: "test-only",
    GEMINI_API_KEY: "test-only",
    AWS_BEDROCK_LLM_API_KEY: "test-only",
    AWS_BEDROCK_LLM_REGION: "us-east-1",
  });
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(OllamaAILLM, "cacheContextWindows").mockResolvedValue();
  jest.spyOn(LlmmanLLM, "cacheContextWindows").mockResolvedValue();
});

afterEach(() => jest.restoreAllMocks());

describe.each([
  ["OpenAI", OpenAiLLM, "gpt-4o", "responses"],
  ["Generic OpenAI", GenericOpenAiLLM, "vision-model", "chat"],
  ["Ollama", OllamaAILLM, "vision-model", "images"],
  ["llmman", LlmmanLLM, "vision-model", "images"],
  ["Cohere", CohereLLM, "command-r", "text"],
  ["Bedrock", AWSBedrockLLM, "vision-model", "bedrock"],
  ["Gemini", GeminiLLM, "gemini-2.0-flash", "chat"],
  ["Gemini without system prompts", GeminiLLM, "gemma-3-4b-it", "chat"],
])("%s compressed history", (_name, Provider, model, format) => {
  test.each([false, true])(
    "keeps provider-specific attachment formatting (truncate history: %s)",
    async (truncateHistory) => {
      const llm = new Provider({}, model);
      llm.promptWindowLimit = () => 2000;
      llm.limits = { history: 300, system: 300, user: 1400 };
      const prompt = truncateHistory
        ? `Describe ${"the square ".repeat(1000)}please.`
        : "Describe the square.";
      const history = [
        {
          prompt,
          response: JSON.stringify({
            text: "It is red.",
            attachments: [image],
          }),
        },
      ];
      const messages = await llm.compressMessages(
        {
          systemPrompt: "Instructions ".repeat(2000),
          chatHistory: convertToPromptHistory(history),
          userPrompt: "What color was it?",
        },
        history
      );
      const user = messages[1];
      const text = truncateHistory
        ? expect.stringContaining("--prompt truncated for brevity--")
        : prompt;

      if (format === "responses") {
        expect(user).toEqual({
          role: "user",
          content: [
            { type: "input_text", text },
            { type: "input_image", image_url: image.contentString },
          ],
        });
      } else if (format === "chat" || format === "bedrock") {
        expect(user).toEqual({
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "image_url",
              image_url: {
                url: image.contentString,
                ...(format === "chat" ? { detail: "high" } : {}),
              },
            },
          ],
        });
      } else if (format === "images") {
        expect(user).toEqual({
          role: "user",
          content: text,
          images: [imageData],
        });
      } else {
        expect(user).toEqual({ role: "user", content: text });
      }
      expect(messages.slice(2)).toEqual([
        { role: "assistant", content: "It is red." },
        { role: "user", content: "What color was it?" },
      ]);
    }
  );
});
