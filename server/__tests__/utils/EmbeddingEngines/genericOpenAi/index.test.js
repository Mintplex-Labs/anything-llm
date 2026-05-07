/* eslint-env jest, node */

/**
 * Tests for GenericOpenAiEmbedder query/passage prefix support.
 *
 * Verifies that EMBEDDING_QUERY_PREFIX is applied only to inputs going through
 * embedTextInput (the query path) and EMBEDDING_PASSAGE_PREFIX only to inputs
 * going through embedChunks (the ingest path), with empty-string defaults that
 * preserve pre-existing behavior.
 *
 * Related issue: https://github.com/Mintplex-Labs/anything-llm/issues/5403
 */

const capturedRequests = [];

jest.mock(
  "openai",
  () => {
    return {
      OpenAI: class FakeOpenAI {
        constructor() {
          this.embeddings = {
            create: jest.fn(async ({ model, input }) => {
              capturedRequests.push({ model, input });
              const inputs = Array.isArray(input) ? input : [input];
              return {
                data: inputs.map(() => ({ embedding: [0.1, 0.2, 0.3] })),
              };
            }),
          };
        }
      },
    };
  },
  { virtual: true }
);

describe("GenericOpenAiEmbedder query/passage prefix", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    capturedRequests.length = 0;
    process.env = { ...ORIGINAL_ENV };
    process.env.EMBEDDING_BASE_PATH = "http://127.0.0.1:9999/v1";
    process.env.EMBEDDING_MODEL_PREF = "test-embed-model";
    delete process.env.EMBEDDING_QUERY_PREFIX;
    delete process.env.EMBEDDING_PASSAGE_PREFIX;
    delete process.env.GENERIC_OPEN_AI_EMBEDDING_API_DELAY_MS;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function loadEmbedder() {
    const {
      GenericOpenAiEmbedder,
    } = require("../../../../utils/EmbeddingEngines/genericOpenAi");
    return new GenericOpenAiEmbedder();
  }

  test("defaults: no prefix is applied to either path (backwards compatible)", async () => {
    const e = loadEmbedder();

    await e.embedTextInput("what is the snow load on a barn roof");
    await e.embedChunks([
      "Section 7.3.2 specifies a ground snow load of 30 psf.",
    ]);

    expect(capturedRequests).toHaveLength(2);
    expect(capturedRequests[0].input).toEqual([
      "what is the snow load on a barn roof",
    ]);
    expect(capturedRequests[1].input).toEqual([
      "Section 7.3.2 specifies a ground snow load of 30 psf.",
    ]);
  });

  test("EMBEDDING_QUERY_PREFIX is applied only to the query path", async () => {
    process.env.EMBEDDING_QUERY_PREFIX =
      "Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery:";
    const e = loadEmbedder();

    await e.embedTextInput("what is the snow load on a barn roof");
    await e.embedChunks([
      "Section 7.3.2 specifies a ground snow load of 30 psf.",
    ]);

    expect(capturedRequests[0].input).toEqual([
      "Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery:what is the snow load on a barn roof",
    ]);
    // Passage path stays raw when only the query prefix is set.
    expect(capturedRequests[1].input).toEqual([
      "Section 7.3.2 specifies a ground snow load of 30 psf.",
    ]);
  });

  test("EMBEDDING_PASSAGE_PREFIX is applied only to the ingest path", async () => {
    process.env.EMBEDDING_PASSAGE_PREFIX = "passage: ";
    const e = loadEmbedder();

    await e.embedTextInput("what is the snow load");
    await e.embedChunks(["chunk one", "chunk two"]);

    // Query path stays raw when only the passage prefix is set.
    expect(capturedRequests[0].input).toEqual(["what is the snow load"]);
    expect(capturedRequests[1].input).toEqual([
      "passage: chunk one",
      "passage: chunk two",
    ]);
  });

  test("query prefix does not leak into the passage path even when both are set", async () => {
    process.env.EMBEDDING_QUERY_PREFIX = "QPFX:";
    process.env.EMBEDDING_PASSAGE_PREFIX = "PPFX:";
    const e = loadEmbedder();

    await e.embedChunks(["doc-a", "doc-b"]);

    expect(capturedRequests[0].input).toEqual(["PPFX:doc-a", "PPFX:doc-b"]);
    expect(capturedRequests[0].input.every((s) => !s.includes("QPFX:"))).toBe(
      true
    );
  });

  test("embedTextInput accepts an array input and prefixes each element", async () => {
    process.env.EMBEDDING_QUERY_PREFIX = "Q:";
    const e = loadEmbedder();

    await e.embedTextInput(["alpha", "beta"]);

    expect(capturedRequests[0].input).toEqual(["Q:alpha", "Q:beta"]);
  });
});
