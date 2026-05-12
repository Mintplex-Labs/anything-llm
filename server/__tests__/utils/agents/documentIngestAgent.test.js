const fs = require("fs");
const os = require("os");
const path = require("path");

function makeStorage() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "anythingllm-ingest-"));
  const docsDir = path.join(dir, "documents", "custom-documents");
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(
    path.join(docsDir, "a.json"),
    JSON.stringify({
      pageContent: "hello",
      title: "a.json",
      wordCount: 1,
    })
  );
  return dir;
}

function loadDocumentIngestAgent({
  storageDir,
  addDocuments = jest.fn(),
  where = jest.fn(),
  parsedWhere = jest.fn().mockResolvedValue([]),
  parsedDelete = jest.fn(),
}) {
  jest.resetModules();
  process.env.NODE_ENV = "production";
  process.env.STORAGE_DIR = storageDir;

  jest.doMock("../../../models/documents", () => ({
    Document: {
      addDocuments,
      where,
    },
  }));
  jest.doMock("../../../models/workspaceParsedFiles", () => ({
    WorkspaceParsedFiles: {
      where: parsedWhere,
      delete: parsedDelete,
    },
  }));

  return require("../../../utils/agents/aibitat/plugins/document-ingest-agent");
}

function setupTool(documentIngestAgent, requestToolApproval = jest.fn()) {
  let tool = null;
  const aibitat = {
    handlerProps: {
      invocation: {
        workspace: { id: 1, slug: "test-workspace" },
        user_id: 7,
      },
      log: jest.fn(),
    },
    requestToolApproval,
    function: (definition) => {
      tool = definition;
    },
  };
  documentIngestAgent.plugin().setup(aibitat);
  return { tool, aibitat };
}

describe("document-ingest-agent", () => {
  const originalEnv = { ...process.env };
  let storageDir;

  beforeEach(() => {
    storageDir = makeStorage();
  });

  afterEach(() => {
    fs.rmSync(storageDir, { recursive: true, force: true });
    process.env = { ...originalEnv };
    jest.dontMock("../../../models/documents");
    jest.dontMock("../../../models/workspaceParsedFiles");
  });

  it("rejects unsafe absolute paths before ingesting", async () => {
    const addDocuments = jest.fn();
    const {
      documentIngestAgent,
      _private: { resolveDocumentIdentifiers },
    } = loadDocumentIngestAgent({ storageDir, addDocuments });

    const result = await resolveDocumentIdentifiers({
      workspace: { id: 1 },
      userId: 7,
      identifiers: ["/etc/passwd"],
    });

    expect(documentIngestAgent.name).toBe("document-ingest-agent");
    expect(result.errors).toEqual([
      { identifier: "/etc/passwd", error: "invalid_document_identifier" },
    ]);
    expect(addDocuments).not.toHaveBeenCalled();
  });

  it("returns a clear error for unknown filenames", async () => {
    const {
      _private: { resolveDocumentIdentifiers },
    } = loadDocumentIngestAgent({ storageDir });

    const result = await resolveDocumentIdentifiers({
      workspace: { id: 1 },
      userId: 7,
      identifiers: ["missing.pdf"],
    });

    expect(result.errors).toEqual([
      { identifier: "missing.pdf", error: "document_not_found" },
    ]);
  });

  it("returns batch_not_supported_for_provider when approved batch cannot run", async () => {
    process.env.EMBEDDING_ENGINE = "openai";
    const addDocuments = jest.fn();
    const { documentIngestAgent } = loadDocumentIngestAgent({
      storageDir,
      addDocuments,
    });
    const { tool } = setupTool(
      documentIngestAgent,
      jest.fn().mockResolvedValue({ approved: true })
    );

    const result = JSON.parse(
      await tool.handler.call(tool, { document_identifier: "a.json" })
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("batch_not_supported_for_provider");
    expect(addDocuments).not.toHaveBeenCalled();
  });

  it("uses direct ingest when the approval request is rejected", async () => {
    const addDocuments = jest.fn().mockResolvedValue({
      failedToEmbed: [],
      errors: [],
      embedded: ["custom-documents/a.json"],
    });
    const where = jest.fn().mockResolvedValue([
      {
        docId: "doc-1",
        docpath: "custom-documents/a.json",
        embeddingStatus: "completed",
      },
    ]);
    const { documentIngestAgent } = loadDocumentIngestAgent({
      storageDir,
      addDocuments,
      where,
    });
    const { tool } = setupTool(
      documentIngestAgent,
      jest.fn().mockResolvedValue({ approved: false })
    );

    const result = JSON.parse(
      await tool.handler.call(tool, { document_identifier: "a.json" })
    );

    expect(addDocuments).toHaveBeenCalledWith(
      { id: 1, slug: "test-workspace" },
      ["custom-documents/a.json"],
      7,
      { embeddingModeOverride: "direct" }
    );
    expect(result).toEqual({
      success: true,
      documents: [{ docId: "doc-1", path: "custom-documents/a.json" }],
      embeddingStatus: "completed",
      message:
        "Documents were ingested directly and are available for immediate retrieval.",
    });
  });
});
