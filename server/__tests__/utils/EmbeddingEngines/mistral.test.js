const mockCreate = jest.fn();

jest.mock(
  "openai",
  () => ({
    OpenAI: jest.fn().mockImplementation(() => ({
      embeddings: {
        create: mockCreate,
      },
    })),
  }),
  { virtual: true }
);

const { MistralEmbedder } = require("../../../utils/EmbeddingEngines/mistral");

describe("MistralEmbedder", () => {
  const originalApiKey = process.env.MISTRAL_API_KEY;
  const originalModel = process.env.EMBEDDING_MODEL_PREF;

  beforeEach(() => {
    process.env.MISTRAL_API_KEY = "test-key";
    process.env.EMBEDDING_MODEL_PREF = "mistral-embed";
    mockCreate.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    if (originalApiKey === undefined) delete process.env.MISTRAL_API_KEY;
    else process.env.MISTRAL_API_KEY = originalApiKey;

    if (originalModel === undefined) delete process.env.EMBEDDING_MODEL_PREF;
    else process.env.EMBEDDING_MODEL_PREF = originalModel;

    jest.restoreAllMocks();
  });

  it("throws when single input embedding fails", async () => {
    mockCreate.mockRejectedValueOnce(new Error("mistral down"));
    const embedder = new MistralEmbedder();

    await expect(embedder.embedTextInput("hello")).rejects.toThrow("mistral down");
  });

  it("throws when batch embedding fails instead of returning empty vectors", async () => {
    mockCreate.mockRejectedValueOnce(new Error("rate limited"));
    const embedder = new MistralEmbedder();

    await expect(embedder.embedChunks(["a", "b"])).rejects.toThrow(
      "Mistral Failed to embed: rate limited"
    );
  });

  it("throws when Mistral returns an empty batch", async () => {
    mockCreate.mockResolvedValueOnce({ data: [] });
    const embedder = new MistralEmbedder();

    await expect(embedder.embedChunks(["a"])).rejects.toThrow(
      "Mistral returned empty embeddings for batch"
    );
  });
});
