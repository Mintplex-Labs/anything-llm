const {
  documentEmbeddingMode,
  isBatchMode,
  isTransientBatchError,
  retryDelayMs,
  buildWorkspaceDocumentRecord,
} = require("../../../utils/DocumentEmbeddingBatch");

describe("DocumentEmbeddingBatch mode selection", () => {
  const originalMode = process.env.DOCUMENT_EMBEDDING_MODE;

  afterEach(() => {
    if (originalMode === undefined) delete process.env.DOCUMENT_EMBEDDING_MODE;
    else process.env.DOCUMENT_EMBEDDING_MODE = originalMode;
  });

  it("uses DOCUMENT_EMBEDDING_MODE when no per-call override is provided", () => {
    process.env.DOCUMENT_EMBEDDING_MODE = "batch";
    expect(documentEmbeddingMode()).toBe("batch");
    expect(isBatchMode()).toBe(true);

    process.env.DOCUMENT_EMBEDDING_MODE = "direct";
    expect(documentEmbeddingMode()).toBe("direct");
    expect(isBatchMode()).toBe(false);
  });

  it("uses the per-call override without mutating the global mode", () => {
    process.env.DOCUMENT_EMBEDDING_MODE = "direct";

    expect(documentEmbeddingMode("batch")).toBe("batch");
    expect(isBatchMode("batch")).toBe(true);
    expect(process.env.DOCUMENT_EMBEDDING_MODE).toBe("direct");

    process.env.DOCUMENT_EMBEDDING_MODE = "batch";
    expect(documentEmbeddingMode("direct")).toBe("direct");
    expect(isBatchMode("direct")).toBe(false);
    expect(process.env.DOCUMENT_EMBEDDING_MODE).toBe("batch");
  });
});

describe("DocumentEmbeddingBatch retry classification", () => {
  const originalBase = process.env.EMBEDDING_BATCH_RETRY_BASE_SECONDS;
  const originalMax = process.env.EMBEDDING_BATCH_RETRY_MAX_SECONDS;

  afterEach(() => {
    if (originalBase === undefined)
      delete process.env.EMBEDDING_BATCH_RETRY_BASE_SECONDS;
    else process.env.EMBEDDING_BATCH_RETRY_BASE_SECONDS = originalBase;
    if (originalMax === undefined)
      delete process.env.EMBEDDING_BATCH_RETRY_MAX_SECONDS;
    else process.env.EMBEDDING_BATCH_RETRY_MAX_SECONDS = originalMax;
  });

  it("treats network, rate-limit, and 5xx errors as transient", () => {
    expect(isTransientBatchError(new Error("Connection error."))).toBe(true);
    expect(isTransientBatchError(new Error("fetch failed"))).toBe(true);
    expect(isTransientBatchError({ message: "ECONNRESET" })).toBe(true);
    expect(isTransientBatchError({ status: 429 })).toBe(true);
    expect(isTransientBatchError({ response: { status: 503 } })).toBe(true);
  });

  it("does not treat provider terminal batch states as transient", () => {
    expect(isTransientBatchError(new Error("DashScope batch failed"))).toBe(
      false
    );
    expect(isTransientBatchError(new Error("Batch manifest missing"))).toBe(
      false
    );
  });

  it("backs off exponentially and caps retries", () => {
    process.env.EMBEDDING_BATCH_RETRY_BASE_SECONDS = "2";
    process.env.EMBEDDING_BATCH_RETRY_MAX_SECONDS = "10";

    expect(retryDelayMs(1)).toBe(2_000);
    expect(retryDelayMs(2)).toBe(4_000);
    expect(retryDelayMs(10)).toBe(10_000);
  });
});

describe("DocumentEmbeddingBatch manifest recovery", () => {
  it("can rebuild a workspace document record from a saved manifest", () => {
    const record = buildWorkspaceDocumentRecord({
      docId: "doc-1",
      job: { jobId: "job-1", workspaceId: 7 },
      docManifest: {
        docpath: "custom-documents/example.json",
        data: {
          title: "Example",
          pageContent: "should not be stored in metadata",
          wordCount: 10,
        },
      },
    });

    expect(record).toEqual({
      docId: "doc-1",
      filename: "example.json",
      docpath: "custom-documents/example.json",
      workspaceId: 7,
      metadata: JSON.stringify({ title: "Example", wordCount: 10 }),
      embeddingStatus: "processing",
      embeddingError: null,
      embeddingBatchJobId: "job-1",
    });
  });
});
