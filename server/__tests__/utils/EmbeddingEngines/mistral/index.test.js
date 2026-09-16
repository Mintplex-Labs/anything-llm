/**
 * The Mistral embedder was the only engine that sent a document's chunks to the provider
 * in a single request and declared neither of the two properties the rest of the pipeline
 * reads off an engine. These cover the request shape, the declarations, and the failure
 * contract #5513 established.
 */

const ORIGINAL_ENV = process.env;

function loadEmbedder(env = {}) {
  process.env = { ...ORIGINAL_ENV, MISTRAL_API_KEY: "test-key", ...env };
  const {
    MistralEmbedder,
  } = require("../../../../utils/EmbeddingEngines/mistral");
  return new MistralEmbedder();
}

/** Replace the SDK call and record the `input` of every request it receives. */
function captureRequests(embedder, respond) {
  const inputs = [];
  embedder.openai.embeddings.create = jest.fn(async ({ input }) => {
    inputs.push(input);
    return respond(input);
  });
  return inputs;
}

const embeddingsFor = (input) => ({
  data: input.map((text) => ({ embedding: [text.length] })),
});

beforeEach(() => {
  jest.resetModules();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe("MistralEmbedder", () => {
  it("declares the batch size and the chunk length the pipeline reads", () => {
    const embedder = loadEmbedder();

    expect(embedder.maxConcurrentChunks).toBe(500);
    expect(embedder.embeddingMaxChunkLength).toBe(1000);
  });

  it("takes the chunk length from EMBEDDING_MODEL_MAX_CHUNK_LENGTH", () => {
    expect(
      loadEmbedder({ EMBEDDING_MODEL_MAX_CHUNK_LENGTH: "4096" })
        .embeddingMaxChunkLength
    ).toBe(4096);
  });

  it("splits a document into requests of at most maxConcurrentChunks inputs", async () => {
    const embedder = loadEmbedder();
    const inputs = captureRequests(embedder, embeddingsFor);
    const chunks = Array.from({ length: 1200 }, (_, i) => "c".repeat(i + 1));

    await embedder.embedChunks(chunks);

    expect(inputs.map((input) => input.length)).toEqual([500, 500, 200]);
  });

  it("returns the embeddings in the order the chunks were given", async () => {
    const embedder = loadEmbedder();
    // Resolve the later batch first, so an implementation that races would reorder.
    let firstBatch;
    embedder.openai.embeddings.create = jest.fn(async ({ input }) => {
      if (!firstBatch) {
        firstBatch = new Promise((resolve) =>
          setTimeout(() => resolve(embeddingsFor(input)), 10)
        );
        return firstBatch;
      }
      return embeddingsFor(input);
    });
    const chunks = Array.from({ length: 600 }, (_, i) => "c".repeat(i + 1));

    const embeddings = await embedder.embedChunks(chunks);

    expect(embeddings).toEqual(chunks.map((chunk) => [chunk.length]));
  });

  it("surfaces a failed batch instead of returning a partial document", async () => {
    const embedder = loadEmbedder();
    let call = 0;
    embedder.openai.embeddings.create = jest.fn(async ({ input }) => {
      if (++call === 2) throw new Error("429 rate limit");
      return embeddingsFor(input);
    });

    await expect(
      embedder.embedChunks(Array.from({ length: 1200 }, () => "chunk"))
    ).rejects.toThrow("Mistral Failed to embed: 429 rate limit");
  });

  it("treats an empty response as a failure", async () => {
    const embedder = loadEmbedder();
    captureRequests(embedder, () => ({ data: [] }));

    await expect(embedder.embedChunks(["chunk"])).rejects.toThrow(
      "Mistral returned empty embeddings for batch"
    );
  });

  it("embeds a single string through the same path", async () => {
    const embedder = loadEmbedder();
    const inputs = captureRequests(embedder, embeddingsFor);

    expect(await embedder.embedTextInput("hello")).toEqual([5]);
    expect(inputs).toEqual([["hello"]]);
  });
});
