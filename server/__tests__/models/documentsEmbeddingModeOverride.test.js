const addDocumentToNamespace = jest.fn();
const enqueueBatchDocuments = jest.fn();
const isBatchMode = jest.fn();
const emitProgress = jest.fn();

jest.mock("../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(() => ({ addDocumentToNamespace })),
}));

jest.mock("../../utils/prisma", () => ({
  workspace_documents: {
    create: jest.fn(async ({ data }) => data),
  },
}));

jest.mock("../../models/telemetry", () => ({
  Telemetry: {
    sendTelemetry: jest.fn(),
  },
}));

jest.mock("../../models/eventLogs", () => ({
  EventLogs: {
    logEvent: jest.fn(),
  },
}));

jest.mock("../../endpoints/utils", () => ({
  getModelTag: jest.fn(() => "test-model"),
}));

jest.mock("../../utils/files", () => ({
  fileData: jest.fn(async () => ({
    pageContent: "hello",
    title: "Test document",
    wordCount: 1,
  })),
}));

jest.mock("../../utils/EmbeddingWorkerManager", () => ({
  emitProgress,
}));

jest.mock("../../utils/DocumentEmbeddingBatch", () => ({
  isBatchMode,
  enqueueBatchDocuments,
}));

const { Document } = require("../../models/documents");

describe("Document.addDocuments embeddingModeOverride", () => {
  const workspace = { id: 1, slug: "test-workspace", name: "Test Workspace" };

  beforeEach(() => {
    jest.clearAllMocks();
    addDocumentToNamespace.mockResolvedValue({ vectorized: true, error: null });
    enqueueBatchDocuments.mockResolvedValue({
      failedToEmbed: [],
      errors: [],
      embedded: ["custom-documents/a.json"],
      batchJob: { jobId: "job-1" },
    });
    isBatchMode.mockImplementation((modeOverride) => modeOverride === "batch");
  });

  it("routes batch overrides through the embedding batch queue", async () => {
    const result = await Document.addDocuments(
      workspace,
      ["custom-documents/a.json"],
      7,
      { embeddingModeOverride: "batch" }
    );

    expect(isBatchMode).toHaveBeenCalledWith("batch");
    expect(enqueueBatchDocuments).toHaveBeenCalledWith({
      workspace,
      additions: ["custom-documents/a.json"],
      userId: 7,
    });
    expect(addDocumentToNamespace).not.toHaveBeenCalled();
    expect(result.batchJob.jobId).toBe("job-1");
  });

  it("routes direct overrides through direct vectorization", async () => {
    const result = await Document.addDocuments(
      workspace,
      ["custom-documents/a.json"],
      7,
      { embeddingModeOverride: "direct" }
    );

    expect(isBatchMode).toHaveBeenCalledWith("direct");
    expect(enqueueBatchDocuments).not.toHaveBeenCalled();
    expect(addDocumentToNamespace).toHaveBeenCalledWith(
      workspace.slug,
      expect.objectContaining({ pageContent: "hello" }),
      "custom-documents/a.json"
    );
    expect(result.embedded).toEqual(["custom-documents/a.json"]);
  });

  it("preserves default mode behavior when no override is supplied", async () => {
    await Document.addDocuments(workspace, ["custom-documents/a.json"], 7);

    expect(isBatchMode).toHaveBeenCalledWith(undefined);
  });
});
