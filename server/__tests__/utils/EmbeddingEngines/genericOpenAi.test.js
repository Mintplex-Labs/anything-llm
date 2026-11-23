const mockCreate = jest.fn();

jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    embeddings: { create: mockCreate },
  })),
}));

const {
  GenericOpenAiEmbedder,
} = require("../../../utils/EmbeddingEngines/genericOpenAi");

describe("GenericOpenAiEmbedder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    process.env.EMBEDDING_BASE_PATH = "http://localhost:1234/v1";
    process.env.EMBEDDING_MODEL_PREF = "test-embed-model";
    delete process.env.GENERIC_OPEN_AI_EMBEDDING_MAX_CONCURRENT_CHUNKS;
    delete process.env.GENERIC_OPEN_AI_EMBEDDING_API_DELAY_MS;
    delete global.__embeddingProgress;
    mockCreate.mockResolvedValue({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.EMBEDDING_BASE_PATH;
    delete process.env.EMBEDDING_MODEL_PREF;
  });

  const lastBody = () => mockCreate.mock.calls.at(-1)[0];

  it("requests encoding_format float explicitly", async () => {
    const embedder = new GenericOpenAiEmbedder();
    await embedder.embedChunks(["hello"]);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(lastBody()).toMatchObject({
      model: "test-embed-model",
      input: ["hello"],
      encoding_format: "float",
    });
  });

  it("returns plain float arrays as-is without corruption", async () => {
    const embedding = [0.1, -0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    mockCreate.mockResolvedValue({
      data: [{ embedding }, { embedding }],
    });

    const embedder = new GenericOpenAiEmbedder();
    const result = await embedder.embedChunks(["a", "b"]);

    expect(result).toEqual([embedding, embedding]);
    expect(result[0]).toHaveLength(8);
  });

  it("pins encoding_format and dimensions across batches", async () => {
    process.env.GENERIC_OPEN_AI_EMBEDDING_MAX_CONCURRENT_CHUNKS = "1";
    const embedding = [0.1, 0.2, 0.3];
    mockCreate.mockResolvedValue({
      data: [{ embedding }],
    });

    const embedder = new GenericOpenAiEmbedder();
    const result = await embedder.embedChunks(["a", "b", "c"]);

    expect(mockCreate).toHaveBeenCalledTimes(3);
    for (const call of mockCreate.mock.calls) {
      expect(call[0]).toMatchObject({ encoding_format: "float" });
    }
    expect(result).toEqual([embedding, embedding, embedding]);
  });

  it("embedTextInput preserves the embedding dimensions", async () => {
    const embedding = [0.1, 0.2, 0.3, 0.4];
    mockCreate.mockResolvedValue({
      data: [{ embedding }],
    });

    const embedder = new GenericOpenAiEmbedder();
    const result = await embedder.embedTextInput("what is AnythingLLM?");

    expect(lastBody()).toMatchObject({ encoding_format: "float" });
    expect(result).toEqual(embedding);
    expect(result).toHaveLength(4);
  });
});
