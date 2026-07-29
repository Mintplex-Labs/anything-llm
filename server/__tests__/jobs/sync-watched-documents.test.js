/* eslint-env jest */
const { sourceIdentifier } = require("../../utils/chats");

const STALE_PUBLISHED = "1/1/2020, 12:00:00 PM";
const OLD_CONTENT = "the old content of the watched document";
const NEW_CONTENT = "the new content of the watched document";

let mockResolveConcluded;
const concluded = new Promise((resolve) => (mockResolveConcluded = resolve));
const mockVectorDatabase = {
  deleteDocumentFromNamespace: jest.fn(),
  addDocumentToNamespace: jest.fn(),
};
const mockUpdateSourceDocument = jest.fn();

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
  fileData: jest.fn().mockResolvedValue({
    title: "watched-and-pinned.html",
    published: STALE_PUBLISHED,
    pageContent: OLD_CONTENT,
  }),
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
    _update: jest.fn(),
    saveRun: jest.fn(),
  },
}));
jest.mock("../../models/documentSyncRun", () => ({
  DocumentSyncRun: { statuses: { success: "success" } },
}));

// A pinned document is de-duplicated out of the RAG results by comparing the `sourceIdentifier` of
// the on-disk document against the identifier of every chunk returned by the vector database. A
// re-sync rewrites both of those, so if they drift apart the pinned document is also returned as
// chunks and gets injected into the context twice.
describe("watched document re-sync", () => {
  beforeAll(async () => {
    require("../../jobs/sync-watched-documents");
    await concluded;
  });

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

    expect(sourceIdentifier(bloomedPayload)).toBe(sourceIdentifier(diskPayload));
  });
});
