/* eslint-env jest */
// Runs the watched document sync job end to end against the real metadata parser,
// file types, retry limit and run statuses, with storage, network and vector DB stubbed.

const OLD_CONTENT = "the old content of the watched document";
const NEW_CONTENT = "the new content of the watched document";
const STALE_PUBLISHED = "1/1/2020, 12:00:00 PM";
const NEXT_SYNC = new Date("2026-11-01T00:00:00.000Z");

let mockResolveConcluded;
const mockLog = jest.fn();
const mockUpdateSourceDocument = jest.fn();
const mockFileData = jest.fn();
const mockDocumentVectorsDelete = jest.fn();
const mockDocumentWhere = jest.fn();
const mockSyncRunWhere = jest.fn();
const mockCollector = {
  online: jest.fn(),
  forwardExtensionRequest: jest.fn(),
};
const mockVectorDb = {
  deleteDocumentFromNamespace: jest.fn(),
  addDocumentToNamespace: jest.fn(),
};
const mockSyncQueue = {
  staleDocumentQueues: jest.fn(),
  calcNextSync: jest.fn(),
  _update: jest.fn(),
  saveRun: jest.fn(),
  unwatch: jest.fn(),
};

jest.mock("../../jobs/helpers", () => ({
  log: mockLog,
  conclude: jest.fn(() => mockResolveConcluded()),
  updateSourceDocument: mockUpdateSourceDocument,
}));
jest.mock("../../utils/helpers", () => ({
  getVectorDbClass: () => mockVectorDb,
}));
jest.mock("../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(() => mockCollector),
}));
jest.mock("../../utils/files", () => ({ fileData: mockFileData }));
jest.mock("../../models/vectors", () => ({
  DocumentVectors: { delete: mockDocumentVectorsDelete },
}));
jest.mock("../../models/documents", () => {
  const { Document } = jest.requireActual("../../models/documents");
  return {
    Document: {
      parseDocumentTypeAndSource: Document.parseDocumentTypeAndSource,
      _stripSource: Document._stripSource,
      where: mockDocumentWhere,
    },
  };
});
jest.mock("../../models/documentSyncQueue", () => {
  const { DocumentSyncQueue } = jest.requireActual(
    "../../models/documentSyncQueue"
  );
  return {
    DocumentSyncQueue: {
      validFileTypes: DocumentSyncQueue.validFileTypes,
      maxRepeatFailures: DocumentSyncQueue.maxRepeatFailures,
      ...mockSyncQueue,
    },
  };
});
jest.mock("../../models/documentSyncRun", () => {
  const { DocumentSyncRun } = jest.requireActual(
    "../../models/documentSyncRun"
  );
  return {
    DocumentSyncRun: {
      statuses: DocumentSyncRun.statuses,
      where: mockSyncRunWhere,
    },
  };
});

/**
 * Run the job module (it executes on require) and wait for it to conclude.
 */
async function runJob() {
  jest.resetModules();
  const concluded = new Promise((resolve) => (mockResolveConcluded = resolve));
  require("../../jobs/sync-watched-documents");
  await concluded;
}

/**
 * Build a stale document_sync_queues record with its workspace document.
 * @param {number} id
 * @param {Object} [options]
 * @param {string} [options.chunkSource] - stored in the document metadata
 * @param {*} [options.metadata] - raw metadata column value, overrides chunkSource
 */
function watched(id, options = {}) {
  const chunkSource =
    options.chunkSource ?? `link://https://example.com/page-${id}`;
  return {
    id,
    workspaceDoc: {
      id,
      docId: `doc-${id}`,
      filename: `page-${id}.json`,
      docpath: `custom-documents/page-${id}.json`,
      metadata:
        "metadata" in options
          ? options.metadata
          : JSON.stringify({ chunkSource }),
      workspace: { slug: `ws-${id}`, name: `Workspace ${id}` },
    },
  };
}

function otherReference(slug) {
  return {
    docId: `${slug}-doc`,
    docpath: "custom-documents/page-1.json",
    workspace: { slug, name: `Workspace ${slug}` },
  };
}

function runsFor(queueId) {
  return mockSyncQueue.saveRun.mock.calls.filter(([id]) => id === queueId);
}

function failedRuns(count) {
  return Array.from({ length: count }, () => ({ status: "failed" }));
}

function requestBody(callIndex = 0) {
  return JSON.parse(
    mockCollector.forwardExtensionRequest.mock.calls[callIndex][0].body
  );
}

function expectSynced(queueId) {
  expect(runsFor(queueId)).toEqual([
    [
      queueId,
      "success",
      expect.objectContaining({ filename: `page-${queueId}.json` }),
    ],
  ]);
}

function expectNotRescheduled(queueId) {
  expect(mockSyncQueue._update).not.toHaveBeenCalledWith(
    queueId,
    expect.anything()
  );
}

beforeEach(() => {
  jest.resetAllMocks();
  mockSyncQueue.staleDocumentQueues.mockResolvedValue([watched(1)]);
  mockSyncQueue.calcNextSync.mockReturnValue(NEXT_SYNC);
  mockSyncQueue._update.mockResolvedValue(true);
  mockSyncQueue.saveRun.mockResolvedValue(true);
  mockSyncQueue.unwatch.mockResolvedValue(true);
  mockSyncRunWhere.mockResolvedValue([]);
  mockDocumentWhere.mockResolvedValue([]);
  mockCollector.online.mockResolvedValue(true);
  mockCollector.forwardExtensionRequest.mockResolvedValue({
    content: NEW_CONTENT,
  });
  mockFileData.mockResolvedValue({
    title: "Watched page",
    published: STALE_PUBLISHED,
    wordCount: 7,
    pageContent: OLD_CONTENT,
  });
  mockVectorDb.deleteDocumentFromNamespace.mockResolvedValue(true);
  mockVectorDb.addDocumentToNamespace.mockResolvedValue({
    vectorized: true,
    error: null,
  });
});

describe("refreshing changed documents", () => {
  it("re-embeds the new content, saves it to disk and schedules the next sync", async () => {
    await runJob();

    expect(mockCollector.forwardExtensionRequest).toHaveBeenCalledWith({
      endpoint: "/ext/resync-source-document",
      method: "POST",
      body: expect.any(String),
    });
    expect(requestBody()).toEqual({
      type: "link",
      options: { link: "https://example.com/page-1" },
    });
    expect(mockFileData).toHaveBeenCalledWith("custom-documents/page-1.json");
    expect(mockVectorDb.deleteDocumentFromNamespace).toHaveBeenCalledWith(
      "ws-1",
      "doc-1"
    );
    expect(mockDocumentVectorsDelete).toHaveBeenCalledWith({ docId: "doc-1" });

    const [slug, embedded, docpath, skipCache] =
      mockVectorDb.addDocumentToNamespace.mock.calls[0];
    expect([slug, docpath, skipCache]).toEqual([
      "ws-1",
      "custom-documents/page-1.json",
      true,
    ]);
    expect(embedded).toEqual({
      title: "Watched page",
      wordCount: 7,
      pageContent: NEW_CONTENT,
      docId: "doc-1",
      published: expect.any(String),
    });
    expect(embedded.published).not.toBe(STALE_PUBLISHED);

    expect(mockUpdateSourceDocument).toHaveBeenCalledWith(
      "custom-documents/page-1.json",
      embedded
    );
    expect(mockSyncQueue._update).toHaveBeenCalledWith(1, {
      lastSyncedAt: expect.any(String),
      nextSyncAt: NEXT_SYNC.toISOString(),
    });
    expect(runsFor(1)).toEqual([
      [1, "success", { filename: "page-1.json", workspacesModified: ["ws-1"] }],
    ]);
    expect(mockSyncQueue.unwatch).not.toHaveBeenCalled();
  });

  it("re-syncs youtube documents by link", async () => {
    mockSyncQueue.staleDocumentQueues.mockResolvedValue([
      watched(1, { chunkSource: "youtube://https://youtube.com/watch?v=abc" }),
    ]);

    await runJob();

    expect(requestBody()).toEqual({
      type: "youtube",
      options: { link: "https://youtube.com/watch?v=abc" },
    });
    expectSynced(1);
  });

  it.each(["confluence", "github", "gitlab", "gitea", "drupalwiki"])(
    "re-syncs %s documents by their full chunkSource, including resync params",
    async (type) => {
      const chunkSource = `${type}://https://example.com/space/page?pat=secret-token`;
      mockSyncQueue.staleDocumentQueues.mockResolvedValue([
        watched(1, { chunkSource }),
      ]);

      await runJob();

      expect(requestBody()).toEqual({ type, options: { chunkSource } });
      expectSynced(1);
    }
  );

  it("copies the new content into every other workspace referencing the same file", async () => {
    mockDocumentWhere.mockResolvedValue([
      otherReference("ws-a"),
      otherReference("ws-b"),
    ]);

    await runJob();

    expect(mockDocumentWhere).toHaveBeenCalledWith(
      { id: { not: 1 }, filename: "page-1.json" },
      null,
      null,
      { workspace: true }
    );
    const calls = mockVectorDb.addDocumentToNamespace.mock.calls;
    expect(
      calls.map(([slug, data, , skipCache]) => [
        slug,
        data.docId,
        Boolean(skipCache),
      ])
    ).toEqual([
      ["ws-1", "doc-1", true],
      ["ws-a", "ws-a-doc", false],
      ["ws-b", "ws-b-doc", false],
    ]);
    // Every workspace gets the same published stamp as the file written to disk.
    const published = calls.map(([, data]) => data.published);
    expect(new Set(published).size).toBe(1);
    expect(mockUpdateSourceDocument.mock.calls[0][1].published).toBe(
      published[0]
    );
    expect(mockDocumentVectorsDelete).toHaveBeenCalledWith({
      docId: "ws-a-doc",
    });
    expect(mockDocumentVectorsDelete).toHaveBeenCalledWith({
      docId: "ws-b-doc",
    });
    expect(runsFor(1)).toEqual([
      [
        1,
        "success",
        {
          filename: "page-1.json",
          workspacesModified: ["ws-1", "ws-a", "ws-b"],
        },
      ],
    ]);
  });

  it("refreshes every stale document in a single run", async () => {
    mockSyncQueue.staleDocumentQueues.mockResolvedValue([
      watched(1),
      watched(2),
      watched(3),
    ]);

    await runJob();

    [1, 2, 3].forEach(expectSynced);
    expect(mockVectorDb.addDocumentToNamespace).toHaveBeenCalledTimes(3);
  });

  it("treats whitespace-only differences as changed content", async () => {
    mockCollector.forwardExtensionRequest.mockResolvedValue({
      content: `${OLD_CONTENT}\n`,
    });

    await runJob();

    expectSynced(1);
    expect(
      mockVectorDb.addDocumentToNamespace.mock.calls[0][1].pageContent
    ).toBe(`${OLD_CONTENT}\n`);
  });
});

describe("unchanged documents", () => {
  it("records an exited run and reschedules without re-embedding or rewriting the file", async () => {
    mockFileData.mockResolvedValue({
      title: "Watched page",
      pageContent: NEW_CONTENT,
    });

    await runJob();

    expect(mockVectorDb.deleteDocumentFromNamespace).not.toHaveBeenCalled();
    expect(mockVectorDb.addDocumentToNamespace).not.toHaveBeenCalled();
    expect(mockUpdateSourceDocument).not.toHaveBeenCalled();
    expect(mockSyncQueue._update).toHaveBeenCalledWith(1, {
      lastSyncedAt: expect.any(String),
      nextSyncAt: NEXT_SYNC.toISOString(),
    });
    expect(runsFor(1)).toEqual([
      [
        1,
        "exited",
        {
          filename: "page-1.json",
          workspacesModified: [],
          reason: "Content unchanged.",
        },
      ],
    ]);
  });
});

describe("early exits", () => {
  it("does nothing when no documents are stale", async () => {
    mockSyncQueue.staleDocumentQueues.mockResolvedValue([]);

    await runJob();

    expect(mockCollector.online).not.toHaveBeenCalled();
    expect(mockSyncQueue.saveRun).not.toHaveBeenCalled();
  });

  it("leaves every document untouched when the collector is offline", async () => {
    mockSyncQueue.staleDocumentQueues.mockResolvedValue([
      watched(1),
      watched(2),
    ]);
    mockCollector.online.mockResolvedValue(false);

    await runJob();

    expect(mockCollector.forwardExtensionRequest).not.toHaveBeenCalled();
    expect(mockSyncQueue.saveRun).not.toHaveBeenCalled();
    expect(mockSyncQueue.unwatch).not.toHaveBeenCalled();
    expect(mockSyncQueue._update).not.toHaveBeenCalled();
  });

  it("concludes when the stale queue lookup fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockSyncQueue.staleDocumentQueues.mockRejectedValue(
      new Error("database is locked")
    );

    await runJob();

    expect(mockLog).toHaveBeenCalledWith("errored with database is locked");
    expect(mockSyncQueue.saveRun).not.toHaveBeenCalled();
  });
});

describe("documents that can never sync are unwatched immediately", () => {
  it.each([
    ["metadata is null", { metadata: null }],
    ["metadata is not JSON", { metadata: "{chunkSource: link://oops" }],
    ["metadata has no chunkSource", { metadata: "{}" }],
    [
      "chunkSource is not a string",
      { metadata: JSON.stringify({ chunkSource: 42 }) },
    ],
    ["chunkSource is empty", { chunkSource: "" }],
    ["chunkSource has no scheme", { chunkSource: "https-example-com-page" }],
    [
      "the type cannot be watched",
      { chunkSource: "localfile:///Users/tim/notes.pdf" },
    ],
  ])("when %s", async (_, options) => {
    mockSyncQueue.staleDocumentQueues.mockResolvedValue([
      watched(1, options),
      watched(2),
    ]);

    await runJob();

    expect(mockSyncQueue.unwatch).toHaveBeenCalledTimes(1);
    expect(mockSyncQueue.unwatch).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, filename: "page-1.json" })
    );
    expect(runsFor(1)).toEqual([]);
    expect(mockCollector.forwardExtensionRequest).toHaveBeenCalledTimes(1);
    expectSynced(2);
  });
});

describe("per-document failures are retried and do not stop the run", () => {
  function expectRetried(queueId, reason) {
    expect(runsFor(queueId)).toEqual([
      [
        queueId,
        "failed",
        { filename: `page-${queueId}.json`, workspacesModified: [], reason },
      ],
    ]);
    expect(mockSyncQueue.unwatch).not.toHaveBeenCalled();
    expectNotRescheduled(queueId);
  }

  beforeEach(() => {
    mockSyncQueue.staleDocumentQueues.mockResolvedValue([
      watched(1),
      watched(2),
    ]);
  });

  it.each([
    ["null", null],
    ["no content key", {}],
    ["empty content", { content: "" }],
    ["null content", { content: null }],
  ])("when the collector returns %s", async (_, response) => {
    mockCollector.forwardExtensionRequest
      .mockResolvedValueOnce(response)
      .mockResolvedValueOnce({ content: NEW_CONTENT });

    await runJob();

    expectRetried(1, "No content found.");
    expect(mockFileData).not.toHaveBeenCalledWith(
      "custom-documents/page-1.json"
    );
    expectSynced(2);
  });

  it("when the collector request throws", async () => {
    mockCollector.forwardExtensionRequest
      .mockRejectedValueOnce(new Error("socket hang up"))
      .mockResolvedValueOnce({ content: NEW_CONTENT });

    await runJob();

    expectRetried(1, "socket hang up");
    expectSynced(2);
  });

  it("when the cached source file has been deleted", async () => {
    mockFileData.mockImplementation(async (docpath) =>
      docpath.includes("page-1")
        ? null
        : { title: "Watched page", pageContent: OLD_CONTENT }
    );

    await runJob();

    expectRetried(1, "Could not read the source document.");
    expect(mockVectorDb.deleteDocumentFromNamespace).not.toHaveBeenCalledWith(
      "ws-1",
      expect.anything()
    );
    expectSynced(2);
  });

  it("when the cached source file is corrupt JSON", async () => {
    let parseError;
    try {
      JSON.parse('{"pageContent": "trunc');
    } catch (error) {
      parseError = error;
    }
    mockFileData.mockImplementation(async (docpath) => {
      if (docpath.includes("page-1")) throw parseError;
      return { title: "Watched page", pageContent: OLD_CONTENT };
    });

    await runJob();

    expectRetried(1, parseError.message);
    expectSynced(2);
  });

  it("when a github chunkSource holds an unparseable URL", async () => {
    mockSyncQueue.staleDocumentQueues.mockResolvedValue([
      watched(1, { chunkSource: "github://not a url" }),
      watched(2),
    ]);

    await runJob();

    expectRetried(1, "Invalid URL");
    expectSynced(2);
  });

  it("when clearing the old vectors throws, without writing the new content to disk", async () => {
    mockVectorDb.deleteDocumentFromNamespace.mockImplementation(
      async (slug) => {
        if (slug === "ws-1") throw new Error("vector db connection refused");
        return true;
      }
    );

    await runJob();

    expectRetried(1, "vector db connection refused");
    expect(mockVectorDb.addDocumentToNamespace).not.toHaveBeenCalledWith(
      "ws-1",
      expect.anything(),
      expect.anything(),
      expect.anything()
    );
    expect(mockUpdateSourceDocument).not.toHaveBeenCalledWith(
      "custom-documents/page-1.json",
      expect.anything()
    );
    expectSynced(2);
  });
});

describe("embed failures are recorded but not retried", () => {
  it("records the primary workspace failure and still saves the new content", async () => {
    mockVectorDb.addDocumentToNamespace.mockResolvedValue({
      vectorized: false,
      error: "dimension mismatch",
    });

    await runJob();

    expect(runsFor(1)).toEqual([
      [
        1,
        "failed",
        {
          filename: "page-1.json",
          workspacesModified: [],
          reason:
            "Failed to embed the new content into: ws-1 (dimension mismatch)",
        },
      ],
    ]);
    expect(mockUpdateSourceDocument).toHaveBeenCalledTimes(1);
    expect(mockSyncQueue._update).toHaveBeenCalledWith(1, expect.anything());
  });

  it("names only the workspaces that failed and falls back to an unknown error", async () => {
    mockDocumentWhere.mockResolvedValue([
      otherReference("ws-a"),
      otherReference("ws-b"),
    ]);
    mockVectorDb.addDocumentToNamespace.mockImplementation(async (slug) =>
      slug === "ws-b"
        ? { vectorized: false, error: undefined }
        : { vectorized: true, error: null }
    );

    await runJob();

    expect(runsFor(1)).toEqual([
      [
        1,
        "failed",
        {
          filename: "page-1.json",
          workspacesModified: ["ws-1", "ws-a"],
          reason: "Failed to embed the new content into: ws-b (unknown error)",
        },
      ],
    ]);
  });
});

describe("repeat failure limit", () => {
  beforeEach(() => {
    mockSyncQueue.staleDocumentQueues.mockResolvedValue([
      watched(1),
      watched(2),
    ]);
    mockFileData.mockImplementation(async (docpath) =>
      docpath.includes("page-1")
        ? null
        : { title: "Watched page", pageContent: OLD_CONTENT }
    );
  });

  it("looks up the most recent runs of the failing queue only", async () => {
    await runJob();

    expect(mockSyncRunWhere).toHaveBeenCalledTimes(1);
    expect(mockSyncRunWhere).toHaveBeenCalledWith({ queueId: 1 }, 5, {
      createdAt: "desc",
    });
  });

  it("keeps retrying one failure below the limit", async () => {
    mockSyncRunWhere.mockResolvedValue(failedRuns(4));

    await runJob();

    expect(runsFor(1)).toEqual([[1, "failed", expect.anything()]]);
    expect(mockSyncQueue.unwatch).not.toHaveBeenCalled();
  });

  it("does not count exited or successful runs toward the limit", async () => {
    mockSyncRunWhere.mockResolvedValue([
      ...failedRuns(3),
      { status: "exited" },
      { status: "success" },
    ]);

    await runJob();

    expect(runsFor(1)).toEqual([[1, "failed", expect.anything()]]);
    expect(mockSyncQueue.unwatch).not.toHaveBeenCalled();
  });

  it("unwatches the document at the limit and keeps syncing the rest", async () => {
    mockSyncRunWhere.mockImplementation(async ({ queueId }) =>
      queueId === 1 ? failedRuns(5) : []
    );

    await runJob();

    expect(mockSyncQueue.unwatch).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 })
    );
    expect(runsFor(1)).toEqual([]);
    expectSynced(2);
  });

  it("concludes the job when the failure itself cannot be recorded", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockSyncRunWhere.mockRejectedValue(new Error("database is locked"));

    await runJob();

    expect(mockLog).toHaveBeenCalledWith("errored with database is locked");
    expect(runsFor(1)).toEqual([]);
  });
});
