jest.mock("../../utils/prisma", () => ({
  workspace_documents: { findFirst: jest.fn(), delete: jest.fn() },
  document_vectors: { deleteMany: jest.fn() },
}));
jest.mock("../../utils/helpers", () => ({ getVectorDbClass: jest.fn() }));
jest.mock("../../models/telemetry", () => ({}));
jest.mock("../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../endpoints/utils", () => ({}));
jest.mock("../../utils/TextSplitter", () => ({}));
jest.mock("../../utils/chats", () => ({}));
jest.mock("../../models/vectors", () => ({
  DocumentVectors: { where: jest.fn() },
}));

const prisma = require("../../utils/prisma");
const { getVectorDbClass } = require("../../utils/helpers");
const { Document } = require("../../models/documents");
const { DocumentVectors } = require("../../models/vectors");
const { EventLogs } = require("../../models/eventLogs");
const { PGVector } = require("../../utils/vectorDbProviders/pgvector");

const workspace = { id: 1, slug: "test", name: "Test" };
const document = {
  id: 2,
  workspaceId: 1,
  docId: "doc-1",
  docpath: "custom-documents/test.json",
};
let provider;

beforeEach(() => {
  jest.resetAllMocks();
  provider = { deleteDocumentFromNamespace: jest.fn().mockResolvedValue(true) };
  getVectorDbClass.mockReturnValue(provider);
  prisma.workspace_documents.findFirst.mockResolvedValue(document);
});

describe("Document.removeDocuments", () => {
  it.each([true, undefined])(
    "cleans up after provider result %p",
    async (result) => {
      provider.deleteDocumentFromNamespace.mockResolvedValue(result);
      await expect(
        Document.removeDocuments(workspace, [document.docpath], 7)
      ).resolves.toBe(true);
      expect(provider.deleteDocumentFromNamespace).toHaveBeenCalledWith(
        workspace.slug,
        document.docId
      );
      expect(prisma.workspace_documents.delete).toHaveBeenCalledWith({
        where: { id: 2, workspaceId: 1 },
      });
      expect(prisma.document_vectors.deleteMany).toHaveBeenCalledWith({
        where: { docId: "doc-1" },
      });
      expect(EventLogs.logEvent).toHaveBeenCalledWith(
        "workspace_documents_removed",
        {
          workspaceName: "Test",
          numberOfDocuments: 1,
        },
        7
      );
    }
  );

  it("preserves records and stops the batch when the provider returns false", async () => {
    provider.deleteDocumentFromNamespace.mockResolvedValue(false);
    await expect(
      Document.removeDocuments(workspace, [document.docpath, "other.json"])
    ).rejects.toThrow("Failed to remove document");
    expect(provider.deleteDocumentFromNamespace).toHaveBeenCalledTimes(1);
    expect(prisma.workspace_documents.delete).not.toHaveBeenCalled();
    expect(prisma.document_vectors.deleteMany).not.toHaveBeenCalled();
    expect(EventLogs.logEvent).not.toHaveBeenCalled();
  });

  it("continues propagating thrown provider errors without deleting records", async () => {
    const error = new Error("Vector database offline");
    provider.deleteDocumentFromNamespace.mockRejectedValue(error);
    await expect(
      Document.removeDocuments(workspace, [document.docpath])
    ).rejects.toBe(error);
    expect(prisma.workspace_documents.delete).not.toHaveBeenCalled();
    expect(prisma.document_vectors.deleteMany).not.toHaveBeenCalled();
    expect(EventLogs.logEvent).not.toHaveBeenCalled();
  });

  it("skips documents that are not in the workspace", async () => {
    prisma.workspace_documents.findFirst.mockResolvedValue(null);
    await Document.removeDocuments(workspace, [document.docpath]);
    expect(prisma.workspace_documents.findFirst).toHaveBeenCalledWith({
      where: { docpath: document.docpath, workspaceId: 1 },
    });
    expect(provider.deleteDocumentFromNamespace).not.toHaveBeenCalled();
    expect(prisma.workspace_documents.delete).not.toHaveBeenCalled();
  });

  it("does nothing for an empty removal list", async () => {
    await Document.removeDocuments(workspace, []);
    expect(prisma.workspace_documents.findFirst).not.toHaveBeenCalled();
    expect(EventLogs.logEvent).not.toHaveBeenCalled();
  });

  it.each(["connection", "delete"])(
    "can retry after a PGVector %s failure",
    async (failure) => {
      // Exercise the real provider and model together, controlling only database I/O.
      const pg = new PGVector();
      pg.logger = jest.fn();
      pg.namespaceExists = jest.fn().mockResolvedValue(true);
      let storedDocument = document;
      let mappings = [{ docId: document.docId, vectorId: "v-1" }];
      const vectors = new Set(["v-1"]);
      const connection = {
        query: jest.fn(async (sql, params) => {
          if (sql.startsWith("DELETE")) vectors.delete(params[0]);
        }),
        end: jest.fn(),
      };
      pg.connect = jest.fn().mockResolvedValue(connection);
      if (failure === "connection")
        pg.connect.mockRejectedValueOnce(new Error("ECONNREFUSED"));
      else
        connection.query
          .mockResolvedValueOnce(undefined)
          .mockRejectedValueOnce(new Error("lock timeout"));
      getVectorDbClass.mockReturnValue(pg);
      prisma.workspace_documents.findFirst.mockImplementation(
        async () => storedDocument
      );
      prisma.workspace_documents.delete.mockImplementation(async () => {
        storedDocument = null;
      });
      prisma.document_vectors.deleteMany.mockImplementation(async () => {
        mappings = [];
      });
      DocumentVectors.where.mockImplementation(async () => mappings);

      await expect(
        Document.removeDocuments(workspace, [document.docpath])
      ).rejects.toThrow("Failed to remove document");
      expect(storedDocument).toBe(document);
      expect(mappings).toHaveLength(1);
      expect(vectors.has("v-1")).toBe(true);
      expect(EventLogs.logEvent).not.toHaveBeenCalled();
      if (failure === "delete") {
        expect(connection.query).toHaveBeenCalledWith("ROLLBACK");
        expect(connection.end).toHaveBeenCalledTimes(1);
      }

      await expect(
        Document.removeDocuments(workspace, [document.docpath])
      ).resolves.toBe(true);
      expect(storedDocument).toBeNull();
      expect(mappings).toHaveLength(0);
      expect(vectors.size).toBe(0);
      expect(connection.query).toHaveBeenCalledWith("COMMIT");
      expect(EventLogs.logEvent).toHaveBeenCalledTimes(1);
    }
  );
});
