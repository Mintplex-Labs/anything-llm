/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";

// Mock the network boundary (the TwelveLabs SDK) so these tests run offline and
// exercise our loader's orchestration, not the SDK's HTTP calls.
const mockState = {};
jest.mock("twelvelabs-js", () => {
  return {
    TwelveLabs: jest.fn().mockImplementation(() => ({
      indexes: {
        // list() is consumed via `for await`, so return an async iterable.
        list: jest.fn(async () => ({
          async *[Symbol.asyncIterator]() {
            for (const i of mockState.existingIndexes || []) yield i;
          },
        })),
        create: jest.fn(async (args) => {
          mockState.createCalledWith = args;
          return { id: "new-index-id" };
        }),
        indexedAssets: {
          create: jest.fn(async () => ({ id: "video-id", status: "ready" })),
          retrieve: jest.fn(async () => ({ id: "video-id", status: "ready" })),
        },
      },
      assets: {
        create: jest.fn(async () => ({ id: "asset-id", status: "ready" })),
        retrieve: jest.fn(async () => ({ id: "asset-id", status: "ready" })),
      },
      analyze: jest.fn(async ({ prompt }) => {
        mockState.analyzePrompt = prompt;
        return { data: "A cat plays piano in a sunny living room." };
      }),
    })),
  };
});

// runtimeSettings is required transitively by the url validator.
jest.mock("../../../../utils/runtimeSettings", () => {
  const instance = { get: jest.fn(() => false), set: jest.fn() };
  return jest.fn().mockImplementation(() => instance);
});

const {
  fetchVideoAnalysisContent,
  loadTwelveLabsVideo,
} = require("../../../../utils/extensions/TwelveLabs");

describe("fetchVideoAnalysisContent", () => {
  const validUrl = "https://example.com/video.mp4";

  beforeEach(() => {
    for (const k of Object.keys(mockState)) delete mockState[k];
    delete process.env.TWELVELABS_API_KEY;
  });

  test("fails clearly when no API key is available", async () => {
    const res = await fetchVideoAnalysisContent({ url: validUrl });
    expect(res.success).toBe(false);
    expect(res.reason).toMatch(/API key/i);
  });

  test("rejects an invalid URL before calling the API", async () => {
    const res = await fetchVideoAnalysisContent({
      url: "not-a-url",
      apiKey: "test-key",
    });
    expect(res.success).toBe(false);
    expect(res.reason).toMatch(/Invalid URL/i);
  });

  test("reuses an existing index that matches by name", async () => {
    mockState.existingIndexes = [
      { id: "existing-id", indexName: "anythingllm-pegasus" },
    ];
    const res = await fetchVideoAnalysisContent({
      url: validUrl,
      apiKey: "test-key",
    });
    expect(res.success).toBe(true);
    expect(res.metadata.videoId).toBe("video-id");
    // create() must NOT be called when a matching index exists.
    expect(mockState.createCalledWith).toBeUndefined();
  });

  test("creates a Pegasus index when none matches the name", async () => {
    mockState.existingIndexes = [{ id: "other", indexName: "something-else" }];
    const res = await fetchVideoAnalysisContent({
      url: validUrl,
      apiKey: "test-key",
      indexName: "my-index",
    });
    expect(res.success).toBe(true);
    expect(mockState.createCalledWith.indexName).toBe("my-index");
    expect(mockState.createCalledWith.models[0].modelName).toBe("pegasus1.2");
  });

  test("forwards a custom prompt to analyze()", async () => {
    mockState.existingIndexes = [
      { id: "existing-id", indexName: "anythingllm-pegasus" },
    ];
    await fetchVideoAnalysisContent({
      url: validUrl,
      apiKey: "test-key",
      prompt: "Just the transcript please.",
    });
    expect(mockState.analyzePrompt).toBe("Just the transcript please.");
  });

  test("falls back to the TWELVELABS_API_KEY env var", async () => {
    process.env.TWELVELABS_API_KEY = "env-key";
    mockState.existingIndexes = [
      { id: "existing-id", indexName: "anythingllm-pegasus" },
    ];
    const res = await fetchVideoAnalysisContent({ url: validUrl });
    expect(res.success).toBe(true);
  });
});

describe("loadTwelveLabsVideo", () => {
  const validUrl = "https://example.com/video.mp4";

  beforeEach(() => {
    for (const k of Object.keys(mockState)) delete mockState[k];
    mockState.existingIndexes = [
      { id: "existing-id", indexName: "anythingllm-pegasus" },
    ];
  });

  test("parseOnly returns inline content without persisting a document", async () => {
    const res = await loadTwelveLabsVideo(
      { url: validUrl, apiKey: "test-key" },
      { parseOnly: true }
    );
    expect(res.success).toBe(true);
    expect(res.documents).toEqual([]);
    expect(res.content).toMatch(/cat plays piano/);
  });

  test("persists a document with the expected chunkSource and metadata", async () => {
    const res = await loadTwelveLabsVideo({ url: validUrl, apiKey: "test-key" });
    expect(res.success).toBe(true);
    expect(res.documents).toHaveLength(1);
    const doc = res.documents[0];
    expect(doc.chunkSource).toBe(`twelvelabs://${validUrl}`);
    expect(doc.docAuthor).toBe("TwelveLabs Pegasus");
    expect(doc.pageContent).toMatch(/cat plays piano/);
    expect(typeof doc.token_count_estimate).toBe("number");
  });
});
