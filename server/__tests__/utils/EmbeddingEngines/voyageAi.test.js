/* eslint-env jest */
const mockEmbedDocuments = jest.fn();

// The LangChain client would call the Voyage API; stand in for it.
jest.mock(
  "@langchain/community/embeddings/voyage",
  () => ({
    VoyageEmbeddings: jest.fn().mockImplementation(() => ({
      embedDocuments: mockEmbedDocuments,
    })),
  }),
  { virtual: true }
);

// `utils/helpers` pulls in the whole server on require. This suite only needs
// the batching helper and the progress reporter.
const mockReportEmbeddingProgress = jest.fn();
jest.mock("../../../utils/helpers", () => ({
  toChunks: (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
      arr.slice(i * size, i * size + size)
    ),
  reportEmbeddingProgress: (...args) => mockReportEmbeddingProgress(...args),
}));

const {
  VoyageAiEmbedder,
} = require("../../../utils/EmbeddingEngines/voyageAi");

describe("VoyageAiEmbedder.embedChunks", () => {
  let embedder;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.VOYAGEAI_API_KEY = "test-key";
    // One vector per input, tagged with the input so ordering can be checked.
    mockEmbedDocuments.mockImplementation(async (batch) =>
      batch.map((text) => [text.length, Number(text.replace("chunk-", ""))])
    );
    embedder = new VoyageAiEmbedder();
  });

  const makeChunks = (count) =>
    Array.from({ length: count }, (_v, i) => `chunk-${i}`);

  test("reports progress as each batch of 128 completes, ending at the total", async () => {
    await embedder.embedChunks(makeChunks(300));

    expect(mockEmbedDocuments).toHaveBeenCalledTimes(3);
    expect(
      mockReportEmbeddingProgress.mock.calls.map(([done]) => done)
    ).toEqual([128, 256, 300]);
    for (const [, total] of mockReportEmbeddingProgress.mock.calls) {
      expect(total).toBe(300);
    }
  });

  test("returns embeddings in the same order as the input chunks", async () => {
    const chunks = makeChunks(300);

    const embeddings = await embedder.embedChunks(chunks);

    expect(embeddings).toHaveLength(300);
    expect(embeddings.map(([, index]) => index)).toEqual(
      chunks.map((_text, index) => index)
    );
  });

  test("returns an empty list and reports nothing for no chunks", async () => {
    await expect(embedder.embedChunks([])).resolves.toEqual([]);
    expect(mockEmbedDocuments).not.toHaveBeenCalled();
    expect(mockReportEmbeddingProgress).not.toHaveBeenCalled();
  });

  test("still surfaces the rate limit message for the empty-response error", async () => {
    mockEmbedDocuments.mockRejectedValueOnce(
      new Error("Cannot read properties of undefined (reading '0')")
    );
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(embedder.embedChunks(makeChunks(3))).rejects.toThrow(
      "Voyage AI failed to embed: Rate limit reached"
    );
  });
});
