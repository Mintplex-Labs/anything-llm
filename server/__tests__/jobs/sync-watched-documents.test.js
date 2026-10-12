/* eslint-env jest */
const { sourceIdentifier } = require("../../utils/chats");

const STALE_PUBLISHED = "1/1/2020, 12:00:00 PM";
const OLD_CONTENT = "the old content of the watched document";
const NEW_CONTENT = "the new content of the watched document";

let mockResolveConcluded;
let mockContent = OLD_CONTENT;
const mockVectorDatabase = {
  deleteDocumentFromNamespace: jest.fn(),
  addDocumentToNamespace: jest.fn(),
};
const mockUpdateSourceDocument = jest.fn();
const mockSaveRun = jest.fn();
const mockUpdateQueue = jest.fn();

jest.mock("../../jobs/helpers", () => ({
  log: jest.fn(),
  conclude: jest.fn(() => mockResolveConcluded()),
  updateSourceDocument: mockUpdateSourceDocument,
}));
jest.mock("../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(() => mockVectorDatabase),
}));
jest.mock("../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(() => ({
    online: jest.fn().mockResolvedValue(true),
    forwardExtensionRequest: jest
      .fn()
      .mockResolvedValue({ content: NEW_CONTENT }),
  })),
}));
jest.mock("../../utils/files", () => ({
  fileData: jest.fn(async () => ({
    title: "watched-and-pinned.html",
    published: STALE_PUBLISHED,
    pageContent: mockContent,
  })),
}));
jest.mock("../../models/vectors", () => ({
  DocumentVectors: { delete: jest.fn() },
}));
jest.mock("../../models/documents", () => ({
  Document: {
    parseDocumentTypeAndSource: jest.fn(() => ({
      metadata: { chunkSource: "link://example.com" },
      type: "link",
      source: "https://example.com",
    })),
    where: jest.fn().mockResolvedValue([
      {
        docId: "other-workspace-doc-id",
        docpath: "custom-documents/watched-and-pinned.json",
        workspace: { slug: "other-workspace", name: "Other Workspace" },
      },
      {
        docId: "third-workspace-doc-id",
        docpath: "custom-documents/watched-and-pinned.json",
        workspace: { slug: "third-workspace", name: "Third Workspace" },
      },
    ]),
  },
}));
jest.mock("../../models/documentSyncQueue", () => ({
  DocumentSyncQueue: {
    validFileTypes: ["link"],
    staleDocumentQueues: jest.fn().mockResolvedValue([
      {
        id: 1,
        workspaceDoc: {
          id: 1,
          docId: "workspace-doc-id",
          docpath: "custom-documents/watched-and-pinned.json",
          filename: "watched-and-pinned.json",
          workspace: { slug: "workspace", name: "Workspace" },
        },
      },
    ]),
    calcNextSync: jest.fn(() => new Date()),
    _update: mockUpdateQueue,
    saveRun: mockSaveRun,
  },
}));
jest.mock("../../models/documentSyncRun", () => ({
  DocumentSyncRun: {
    statuses: { success: "success", failed: "failed", exited: "exited" },
  },
}));

async function runJob() {
  jest.resetModules();
  const concluded = new Promise((resolve) => (mockResolveConcluded = resolve));
  require("../../jobs/sync-watched-documents");
  await concluded;
}

// A pinned document is de-duplicated out of the RAG results by comparing the `sourceIdentifier` of
// the on-disk document against the identifier of every chunk returned by the vector database. A
// re-sync rewrites both of those, so if they drift apart the pinned document is also returned as
// chunks and gets injected into the context twice.
describe("watched document re-sync", () => {
  beforeAll(runJob);

  it("stamps the workspace vectors with the source identifier written to disk", () => {
    const [, vectorPayload] =
      mockVectorDatabase.addDocumentToNamespace.mock.calls[0];
    const [, diskPayload] = mockUpdateSourceDocument.mock.calls[0];

    expect(diskPayload.published).not.toBe(STALE_PUBLISHED);
    expect(sourceIdentifier(vectorPayload)).toBe(sourceIdentifier(diskPayload));
  });

  it("stamps the vectors of every other workspace referencing the document with that same identifier", () => {
    const [, bloomedPayload] =
      mockVectorDatabase.addDocumentToNamespace.mock.calls[1];
    const [, diskPayload] = mockUpdateSourceDocument.mock.calls[0];

    expect(sourceIdentifier(bloomedPayload)).toBe(
      sourceIdentifier(diskPayload)
    );
  });
});

it.each(["workspace", "other-workspace"])(
  "records a failed update to %s without retrying it",
  async (failedWorkspace) => {
    jest.clearAllMocks();
    mockContent = OLD_CONTENT;
    mockUpdateSourceDocument.mockImplementation((_, data) => {
      mockContent = data.pageContent;
    });
    mockVectorDatabase.addDocumentToNamespace.mockImplementation(
      async (slug) => ({
        vectorized: slug !== failedWorkspace,
        error: "write failed",
      })
    );
    await runJob();
    expect(
      mockVectorDatabase.addDocumentToNamespace.mock.calls.map(([slug]) => slug)
    ).toEqual(["workspace", "other-workspace", "third-workspace"]);
    expect(mockContent).toBe(NEW_CONTENT);
    expect(mockUpdateQueue).toHaveBeenCalledTimes(1);
    expect(mockSaveRun).toHaveBeenLastCalledWith(1, "failed", {
      filename: "watched-and-pinned.json",
      workspacesModified: [
        "workspace",
        "other-workspace",
        "third-workspace",
      ].filter((slug) => slug !== failedWorkspace),
      reason: `Failed to embed the new content into: ${failedWorkspace} (write failed)`,
    });

    mockVectorDatabase.addDocumentToNamespace.mockClear();
    await runJob();
    expect(mockVectorDatabase.addDocumentToNamespace).not.toHaveBeenCalled();
    expect(mockSaveRun).toHaveBeenLastCalledWith(
      1,
      "exited",
      expect.any(Object)
    );
  }
);
