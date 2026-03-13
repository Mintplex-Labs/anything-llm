/* eslint-env jest */

const mockEmbeddingCreate = jest.fn();

jest.mock(
  "openai",
  () => ({
    OpenAI: jest.fn().mockImplementation(({ apiKey }) => ({
      embeddings: {
        create: (payload) => mockEmbeddingCreate(apiKey, payload),
      },
    })),
  }),
  { virtual: true }
);

describe("GeminiEmbedder", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    mockEmbeddingCreate.mockReset();
    process.env = {
      ...originalEnv,
      GEMINI_EMBEDDING_API_KEYS: "bad-embed,good-embed",
      EMBEDDING_MODEL_PREF: "gemini-embedding-2-preview",
    };
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test("supports gemini-embedding-2-preview with the preview input limit", () => {
    const { GeminiEmbedder } = require("../../../../utils/EmbeddingEngines/gemini");

    const embedder = new GeminiEmbedder();

    expect(embedder.model).toBe("gemini-embedding-2-preview");
    expect(embedder.embeddingMaxChunkLength).toBe(8192);
  });

  test("falls back to the next Gemini embedding key after a retryable failure", async () => {
    mockEmbeddingCreate.mockImplementation(async (apiKey, payload) => {
      if (apiKey === "bad-embed") {
        const error = new Error("API key not valid");
        error.status = 401;
        throw error;
      }
      return {
        data: payload.input.map(() => ({
          embedding: [0.1, 0.2, 0.3],
        })),
      };
    });

    const { GeminiEmbedder } = require("../../../../utils/EmbeddingEngines/gemini");

    const embedder = new GeminiEmbedder();
    const embedding = await embedder.embedTextInput("hello");

    expect(embedding).toEqual([0.1, 0.2, 0.3]);
    expect(mockEmbeddingCreate.mock.calls.map(([apiKey]) => apiKey)).toEqual([
      "bad-embed",
      "good-embed",
    ]);
    expect(process.env.GEMINI_EMBEDDING_API_KEY).toBe("good-embed");
  });
});
