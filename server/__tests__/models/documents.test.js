/* eslint-env jest */
const prisma = require("../../utils/prisma");
const { getVectorDbClass } = require("../../utils/helpers");
const { fileData } = require("../../utils/files");
const { emitProgress } = require("../../utils/EmbeddingWorkerManager");
const { DocumentVectors } = require("../../models/vectors");
const { Workspace } = require("../../models/workspace");
const { Document } = require("../../models/documents");

jest.mock("../../utils/prisma", () => ({
  workspace_documents: {
    create: jest.fn(),
  },
}));

jest.mock("../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
}));

jest.mock("../../utils/files", () => ({
  fileData: jest.fn(),
}));

jest.mock("../../utils/EmbeddingWorkerManager", () => ({
  emitProgress: jest.fn(),
}));

jest.mock("../../models/vectors", () => ({
  DocumentVectors: {
    delete: jest.fn(),
  },
}));

jest.mock("../../models/workspace", () => ({
  Workspace: {
    where: jest.fn(),
  },
}));

jest.mock("../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));

jest.mock("../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));

jest.mock("../../endpoints/utils", () => ({
  getModelTag: jest.fn(() => "test-model"),
}));

describe("Document.addDocuments failure reporting", () => {
  const workspace = { id: 1, slug: "test-workspace", name: "Test Workspace" };
  let VectorDb;

  beforeEach(() => {
    jest.clearAllMocks();
    VectorDb = {
      addDocumentToNamespace: jest.fn().mockResolvedValue({
        vectorized: true,
        error: null,
      }),
      deleteDocumentFromNamespace: jest.fn().mockResolvedValue(true),
    };
    getVectorDbClass.mockReturnValue(VectorDb);
    fileData.mockResolvedValue({
      pageContent: "document content",
      title: "document",
    });
    prisma.workspace_documents.create.mockResolvedValue({ id: 1 });
    Workspace.where.mockResolvedValue([workspace]);
  });

  afterEach(() => jest.restoreAllMocks());

  it("reports a file that cannot be loaded instead of silently skipping it", async () => {
    fileData.mockResolvedValueOnce(null);

    const result = await Document.addDocuments(workspace, [
      "custom-documents/missing.json",
    ]);

    expect(result.embedded).toEqual([]);
    expect(result.failedToEmbed).toEqual(["missing.json"]);
    expect(result.errors).toEqual(["Failed to load file data"]);
    expect(VectorDb.addDocumentToNamespace).not.toHaveBeenCalled();
    expect(emitProgress).toHaveBeenCalledWith(
      workspace.slug,
      expect.objectContaining({ type: "doc_failed", error: "Failed to load file data" })
    );
  });

  it("contains a thrown file-read error to that file and continues the batch", async () => {
    fileData
      .mockRejectedValueOnce(new Error("Unexpected end of JSON input"))
      .mockResolvedValueOnce({
        pageContent: "document content",
        title: "good-document",
      });

    const result = await Document.addDocuments(workspace, [
      "custom-documents/broken.json",
      "custom-documents/good.json",
    ]);

    expect(result.failedToEmbed).toEqual(["broken.json"]);
    expect(result.errors).toContain("Unexpected end of JSON input");
    expect(result.embedded).toEqual(["custom-documents/good.json"]);
  });

  it("contains a thrown vectorization error to that file and continues the batch", async () => {
    fileData
      .mockResolvedValueOnce({ pageContent: "first document" })
      .mockResolvedValueOnce({ pageContent: "second document" });
    VectorDb.addDocumentToNamespace
      .mockRejectedValueOnce(new Error("vector database is offline"))
      .mockResolvedValueOnce({ vectorized: true, error: null });

    const result = await Document.addDocuments(workspace, [
      "custom-documents/first.json",
      "custom-documents/second.json",
    ]);

    expect(result.failedToEmbed).toEqual(["first.json"]);
    expect(result.errors).toContain("vector database is offline");
    expect(result.embedded).toEqual(["custom-documents/second.json"]);
  });

  it("rolls back vectors and reports failure when the document record cannot be saved", async () => {
    prisma.workspace_documents.create.mockRejectedValueOnce(
      new Error("database is locked")
    );

    const result = await Document.addDocuments(workspace, [
      "custom-documents/file.json",
    ]);

    expect(result.embedded).toEqual([]);
    expect(result.failedToEmbed).toEqual(["file.json"]);
    expect(result.errors).toContain("database is locked");
    expect(VectorDb.deleteDocumentFromNamespace).toHaveBeenCalledWith(
      workspace.slug,
      expect.any(String)
    );
    expect(DocumentVectors.delete).toHaveBeenCalledWith({
      docId: expect.any(String),
    });
  });

  it("still reports a document as embedded when vectorization and the record save succeed", async () => {
    const result = await Document.addDocuments(workspace, [
      "custom-documents/file.json",
    ]);

    expect(result.embedded).toEqual(["custom-documents/file.json"]);
    expect(result.failedToEmbed).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it("returns a failure from the API embed helper instead of reporting success", async () => {
    jest.spyOn(Document, "addDocuments").mockResolvedValueOnce({
      failedToEmbed: ["file.json"],
      errors: ["embedder rejected the request"],
      embedded: [],
    });

    const result = await Document.api.uploadToWorkspace(
      workspace.slug,
      "custom-documents/file.json"
    );

    expect(result).toEqual({
      success: false,
      error: `Failed to embed document into workspace ${workspace.slug}: embedder rejected the request`,
    });
  });

  it("returns success from the API embed helper only after every workspace is embedded", async () => {
    jest
      .spyOn(Document, "addDocuments")
      .mockResolvedValueOnce({ failedToEmbed: [], errors: [], embedded: [] });

    const result = await Document.api.uploadToWorkspace(
      workspace.slug,
      "custom-documents/file.json"
    );

    expect(result).toEqual({ success: true, error: null });
    expect(Document.addDocuments).toHaveBeenCalledWith(
      workspace,
      ["custom-documents/file.json"]
    );
  });
});
