/* eslint-env jest */
let mockResolveConcluded;
let mockQueues = [];
const mockFileData = jest.fn();
const mockSaveRun = jest.fn().mockResolvedValue(null);
const mockUpdateQueue = jest.fn().mockResolvedValue(true);
const mockUnwatch = jest.fn().mockResolvedValue(true);
const mockAddDocument = jest.fn();
const mockDeleteDocument = jest.fn().mockResolvedValue(true);
const mockUpdateSourceDocument = jest.fn(() => true);
const mockWhere = jest.fn().mockResolvedValue([]);

jest.mock("../../jobs/helpers", () => ({
  log: jest.fn(),
  conclude: jest.fn(() => mockResolveConcluded()),
  updateSourceDocument: mockUpdateSourceDocument,
}));

jest.mock("../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(() => ({
    addDocumentToNamespace: mockAddDocument,
    deleteDocumentFromNamespace: mockDeleteDocument,
  })),
}));

jest.mock("../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(() => ({
    online: jest.fn().mockResolvedValue(true),
    forwardExtensionRequest: jest
      .fn()
      .mockResolvedValue({ content: "the new content" }),
  })),
}));

jest.mock("../../utils/files", () => ({
  fileData: mockFileData,
}));

jest.mock("../../models/vectors", () => ({
  DocumentVectors: { delete: jest.fn() },
}));

jest.mock("../../models/documents", () => ({
  Document: {
    parseDocumentTypeAndSource: jest.fn((document) => {
      if (document.filename === "bad-metadata.json")
        throw new Error("missing chunkSource");
      return {
        metadata: { chunkSource: "link://example.com" },
        type: "link",
        source: "https://example.com",
      };
    }),
    where: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("../../models/documentSyncRun", () => ({
  DocumentSyncRun: {
    statuses: { success: "success", failed: "failed", exited: "exited" },
    where: mockWhere,
  },
}));

jest.mock("../../models/documentSyncQueue", () => ({
  DocumentSyncQueue: {
    maxRepeatFailures: 5,
    validFileTypes: ["link"],
    staleDocumentQueues: jest.fn(() => Promise.resolve(mockQueues)),
    calcNextSync: jest.fn(() => new Date("2026-11-01T00:00:00.000Z")),
    _update: mockUpdateQueue,
    saveRun: mockSaveRun,
    unwatch: mockUnwatch,
  },
}));

async function runJob() {
  jest.resetModules();
  const concluded = new Promise((resolve) => (mockResolveConcluded = resolve));
  require("../../jobs/sync-watched-documents");
  await concluded;
}

function queue(id, filename) {
  return {
    id,
    workspaceDoc: {
      id,
      docId: `doc-${id}`,
      docpath: `custom-documents/${filename}`,
      filename,
      workspace: {
        slug: `workspace-${id}`,
        name: `Workspace ${id}`,
      },
    },
  };
}

describe("watched document sync isolation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWhere.mockResolvedValue([]);
    mockQueues = [];
    mockUpdateSourceDocument.mockReturnValue(true);
    mockAddDocument.mockResolvedValue({ vectorized: true, error: null });
    mockFileData.mockResolvedValue({
      title: "watched document",
      pageContent: "the old content",
    });
  });

  it("continues with later documents when one source file cannot be read", async () => {
    mockQueues = [
      queue(1, "missing.json"),
      queue(2, "healthy.json"),
    ];
    mockFileData.mockImplementation(async (docpath) =>
      docpath.includes("missing")
        ? null
        : { title: "healthy", pageContent: "the old content" }
    );

    await runJob();

    expect(mockAddDocument).toHaveBeenCalledTimes(1);
    expect(mockAddDocument.mock.calls[0][0]).toBe("workspace-2");
    expect(mockSaveRun).toHaveBeenCalledWith(
      1,
      "failed",
      expect.objectContaining({
        filename: "missing.json",
        reason: expect.stringContaining("source document"),
      })
    );
    expect(mockSaveRun).toHaveBeenCalledWith(
      2,
      "success",
      expect.objectContaining({ filename: "healthy.json" })
    );
  });

  it("removes a document with unparseable metadata and continues the run", async () => {
    mockQueues = [
      queue(1, "bad-metadata.json"),
      queue(2, "healthy.json"),
    ];

    await runJob();

    expect(mockUnwatch).toHaveBeenCalledWith(mockQueues[0].workspaceDoc);
    expect(mockAddDocument).toHaveBeenCalledTimes(1);
    expect(mockAddDocument.mock.calls[0][0]).toBe("workspace-2");
  });
});
