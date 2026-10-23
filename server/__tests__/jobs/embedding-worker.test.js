/* eslint-env jest */
const prisma = require("../../utils/prisma");
const { getVectorDbClass } = require("../../utils/helpers");
const { fileData } = require("../../utils/files");
const { DocumentVectors } = require("../../models/vectors");

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

jest.mock("../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock("../../models/vectors", () => ({
  DocumentVectors: {
    delete: jest.fn(),
  },
}));

const waitFor = async (predicate, timeoutMs = 2000) => {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt > timeoutMs)
      throw new Error("Timed out waiting for worker output");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
};

describe("native embedding worker failure accounting", () => {
  const workerMessages = [];
  const originalSend = process.send;
  const originalExit = process.exit;

  beforeAll(() => {
    process.send = jest.fn((message) => workerMessages.push(message));
    process.exit = jest.fn();
    require("../../jobs/embedding-worker");
  });

  afterAll(() => {
    process.send = originalSend;
    process.exit = originalExit;
  });

  it("counts a document whose workspace row cannot be saved and rolls back its vectors", async () => {
    const VectorDb = {
      addDocumentToNamespace: jest
        .fn()
        .mockResolvedValue({ vectorized: true, error: null }),
      deleteDocumentFromNamespace: jest.fn().mockResolvedValue(true),
    };
    getVectorDbClass.mockReturnValue(VectorDb);
    fileData.mockImplementation(async (filePath) => ({
      title: filePath.split("/").pop(),
      pageContent: "document content",
    }));
    prisma.workspace_documents.create
      .mockResolvedValueOnce({ id: 1 })
      .mockRejectedValueOnce(new Error("database is locked"));

    process.emit("message", {
      type: "embed",
      files: ["custom-documents/good.json", "custom-documents/bad.json"],
      workspaceSlug: "test-workspace",
      workspaceId: 1,
      userId: null,
    });

    await waitFor(() => workerMessages.some((m) => m.type === "all_complete"));

    const complete = workerMessages.find((m) => m.type === "all_complete");
    expect(complete.embedded).toBe(1);
    expect(complete.failed).toBe(1);
    expect(complete.failedFiles).toEqual(["bad.json"]);
    expect(VectorDb.deleteDocumentFromNamespace).toHaveBeenCalledWith(
      "test-workspace",
      expect.any(String)
    );
    expect(DocumentVectors.delete).toHaveBeenCalledWith({
      docId: expect.any(String),
    });
  });

  it("contains a thrown file read to that document and continues the batch", async () => {
    const VectorDb = {
      addDocumentToNamespace: jest
        .fn()
        .mockResolvedValue({ vectorized: true, error: null }),
      deleteDocumentFromNamespace: jest.fn(),
    };
    getVectorDbClass.mockReturnValue(VectorDb);
    fileData
      .mockRejectedValueOnce(new Error("Unexpected end of JSON input"))
      .mockResolvedValueOnce({
        title: "healthy.json",
        pageContent: "document content",
      });
    prisma.workspace_documents.create.mockResolvedValue({ id: 2 });

    const completedBefore = workerMessages.filter(
      (m) => m.type === "all_complete"
    ).length;
    process.emit("message", {
      type: "embed",
      files: ["custom-documents/broken.json", "custom-documents/healthy.json"],
      workspaceSlug: "test-workspace",
      workspaceId: 1,
      userId: null,
    });

    await waitFor(
      () =>
        workerMessages.filter((m) => m.type === "all_complete").length >
        completedBefore
    );

    const complete = workerMessages
      .filter((m) => m.type === "all_complete")
      .at(-1);
    expect(complete.embedded).toBe(1);
    expect(complete.failed).toBe(1);
    expect(complete.failedFiles).toEqual(["broken.json"]);
  });
});
