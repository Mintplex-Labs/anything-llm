const mockDeleteDocumentFromNamespace = jest.fn();

jest.mock("../../utils/prisma", () => ({
  workspace_documents: {
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
  document_vectors: {
    deleteMany: jest.fn(),
  },
}));

jest.mock("../../utils/helpers", () => ({
  getVectorDbClass: () => ({
    deleteDocumentFromNamespace: mockDeleteDocumentFromNamespace,
  }),
}));

jest.mock("../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn().mockResolvedValue({}) },
}));

jest.mock("../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn().mockResolvedValue({}) },
}));

jest.mock("../../endpoints/utils", () => ({
  getModelTag: jest.fn(() => "test-model"),
}));

jest.mock("../../utils/http", () => ({
  safeJsonParse: (value, fallback = null) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },
}));

const prisma = require("../../utils/prisma");
const { Document } = require("../../models/documents");
const { EventLogs } = require("../../models/eventLogs");

describe("Document.removeDocuments", () => {
  const workspace = { id: 7, slug: "my-workspace", name: "My Workspace" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteDocumentFromNamespace.mockResolvedValue(undefined);
    prisma.workspace_documents.delete.mockResolvedValue({});
    prisma.document_vectors.deleteMany.mockResolvedValue({ count: 1 });
  });

  it("keeps removing later documents when the vector store treats a missing namespace as a no-op", async () => {
    const documentsByPath = {
      "a.md": { id: 1, docId: "doc-a" },
      "b.md": { id: 2, docId: "doc-b" },
    };
    prisma.workspace_documents.findFirst.mockImplementation(
      async ({ where }) => documentsByPath[where.docpath] ?? null
    );

    await expect(
      Document.removeDocuments(workspace, ["a.md", "b.md"], 3)
    ).resolves.toBe(true);

    expect(mockDeleteDocumentFromNamespace).toHaveBeenCalledTimes(2);
    expect(mockDeleteDocumentFromNamespace).toHaveBeenNthCalledWith(
      1,
      workspace.slug,
      "doc-a"
    );
    expect(mockDeleteDocumentFromNamespace).toHaveBeenNthCalledWith(
      2,
      workspace.slug,
      "doc-b"
    );

    expect(prisma.workspace_documents.delete).toHaveBeenCalledTimes(2);
    expect(prisma.workspace_documents.delete).toHaveBeenNthCalledWith(1, {
      where: { id: 1, workspaceId: workspace.id },
    });
    expect(prisma.workspace_documents.delete).toHaveBeenNthCalledWith(2, {
      where: { id: 2, workspaceId: workspace.id },
    });

    expect(prisma.document_vectors.deleteMany).toHaveBeenCalledTimes(2);
    expect(prisma.document_vectors.deleteMany).toHaveBeenNthCalledWith(1, {
      where: { docId: "doc-a" },
    });
    expect(prisma.document_vectors.deleteMany).toHaveBeenNthCalledWith(2, {
      where: { docId: "doc-b" },
    });

    expect(EventLogs.logEvent).toHaveBeenCalledWith(
      "workspace_documents_removed",
      { workspaceName: workspace.name, numberOfDocuments: 2 },
      3
    );
  });

  it("skips paths whose document record is already gone and keeps processing the rest", async () => {
    prisma.workspace_documents.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 2, docId: "doc-b" });

    await expect(
      Document.removeDocuments(workspace, ["missing.md", "b.md"])
    ).resolves.toBe(true);

    expect(mockDeleteDocumentFromNamespace).toHaveBeenCalledTimes(1);
    expect(mockDeleteDocumentFromNamespace).toHaveBeenCalledWith(
      workspace.slug,
      "doc-b"
    );
    expect(prisma.workspace_documents.delete).toHaveBeenCalledTimes(1);
    expect(prisma.document_vectors.deleteMany).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the removals list is empty", async () => {
    await Document.removeDocuments(workspace, []);

    expect(mockDeleteDocumentFromNamespace).not.toHaveBeenCalled();
    expect(prisma.workspace_documents.delete).not.toHaveBeenCalled();
  });
});
