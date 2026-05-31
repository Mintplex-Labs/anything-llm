jest.mock("../../../models/documents", () => ({
  Document: {
    addDocuments: jest.fn(),
    forWorkspace: jest.fn(),
  },
}));

jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(),
}));

jest.mock("../../../utils/swarmsy/requiredDocs", () => ({
  getSwarmsyRequiredDocsStatus: jest.fn(),
}));

const { Document } = require("../../../models/documents");
const { CollectorApi } = require("../../../utils/collectorApi");
const {
  getSwarmsyRequiredDocsStatus,
} = require("../../../utils/swarmsy/requiredDocs");
const {
  getRequiredLoadableDocs,
  ingestSwarmsyRequiredDocs,
} = require("../../../utils/swarmsy/ingestRequiredDocs");

describe("swarmsy required docs ingestion helper", () => {
  let collector;

  beforeEach(() => {
    jest.clearAllMocks();
    Document.forWorkspace.mockResolvedValue([]);

    collector = {
      online: jest.fn(),
      forwardExtensionRequest: jest.fn(),
    };
    CollectorApi.mockImplementation(() => collector);
  });

  it("filters to required doctrine docs only", () => {
    const result = getRequiredLoadableDocs({
      groups: [
        {
          required: true,
          files: [
            { path: "docs/swarmsy/required-a.md", loadable: true },
            {
              path: "docs/swarmsy/required-b.md",
              loadable: false,
              error: "missing",
            },
          ],
        },
        {
          required: false,
          files: [{ path: "docs/swarmsy/optional.md", loadable: true }],
        },
      ],
    });

    expect(result).toEqual({
      loadablePaths: ["docs/swarmsy/required-a.md"],
      unavailablePaths: [
        {
          path: "docs/swarmsy/required-b.md",
          reason: "not_loadable",
          error: "missing",
        },
      ],
    });
  });

  it("returns collector offline without attempting ingestion", async () => {
    collector.online.mockResolvedValue(false);

    const result = await ingestSwarmsyRequiredDocs({
      workspace: { id: 1, slug: "swarmsy-hive", name: "SWARMSY HIVE" },
      userId: 12,
    });

    expect(result).toEqual({
      success: false,
      errorCode: "COLLECTOR_OFFLINE",
      message: "Document processing API is not online.",
    });
    expect(getSwarmsyRequiredDocsStatus).not.toHaveBeenCalled();
    expect(Document.addDocuments).not.toHaveBeenCalled();
  });

  it("ingests required docs, skips attached docs, and ignores optional docs", async () => {
    collector.online.mockResolvedValue(true);
    getSwarmsyRequiredDocsStatus.mockReturnValue({
      docsRoot: "/repo",
      groups: [
        {
          required: true,
          files: [
            { path: "docs/swarmsy/required-a.md", loadable: true },
            { path: "docs/swarmsy/required-b.md", loadable: true },
          ],
        },
        {
          required: false,
          files: [{ path: "docs/swarmsy/optional.md", loadable: true }],
        },
      ],
    });
    collector.forwardExtensionRequest.mockResolvedValue({
      success: true,
      documents: [{ location: "custom-documents/required-b.json" }],
    });
    Document.addDocuments.mockResolvedValue({
      failedToEmbed: [],
      errors: [],
      embedded: ["custom-documents/required-b.json"],
    });

    Document.forWorkspace.mockResolvedValue([
      {
        metadata: JSON.stringify({
          chunkSource: "swarmsy-required://docs/swarmsy/required-a.md",
        }),
      },
    ]);

    const result = await ingestSwarmsyRequiredDocs({
      workspace: {
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      userId: 12,
    });

    expect(collector.forwardExtensionRequest).toHaveBeenCalledTimes(1);
    expect(collector.forwardExtensionRequest).toHaveBeenCalledWith({
      endpoint: "/process",
      method: "POST",
      body: {
        filename: "required-b.md",
        options: {
          absolutePath: "/repo/docs/swarmsy/required-b.md",
        },
        metadata: {
          title: "required-b.md",
          docSource: "SWARMSY required doctrine docs",
          description: "docs/swarmsy/required-b.md",
          chunkSource: "swarmsy-required://docs/swarmsy/required-b.md",
        },
      },
    });
    expect(Document.addDocuments).toHaveBeenCalledWith(
      {
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      ["custom-documents/required-b.json"],
      12
    );
    expect(result).toEqual({
      success: true,
      workspace: {
        exists: true,
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      ingested: [{ path: "docs/swarmsy/required-b.md" }],
      skipped: [
        {
          path: "docs/swarmsy/required-a.md",
          reason: "already_attached",
          error: null,
        },
      ],
      failed: [],
      partial: false,
      message: "SWARMSY required docs ingested successfully.",
    });
  });

  it("returns partial success when collection or embedding fails", async () => {
    collector.online.mockResolvedValue(true);
    getSwarmsyRequiredDocsStatus.mockReturnValue({
      docsRoot: "/repo",
      groups: [
        {
          required: true,
          files: [
            { path: "docs/swarmsy/required-a.md", loadable: true },
            { path: "docs/swarmsy/required-b.md", loadable: true },
          ],
        },
      ],
    });
    collector.forwardExtensionRequest
      .mockResolvedValueOnce({
        success: false,
        reason: "collector failed",
        documents: [],
      })
      .mockResolvedValueOnce({
        success: true,
        documents: [{ location: "custom-documents/required-b.json" }],
      });
    Document.addDocuments.mockResolvedValue({
      failedToEmbed: ["required-b.md"],
      errors: ["embed failed"],
      embedded: [],
    });

    const result = await ingestSwarmsyRequiredDocs({
      workspace: {
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
        documents: [],
      },
      userId: 12,
    });

    expect(result).toEqual({
      success: true,
      workspace: {
        exists: true,
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      ingested: [],
      skipped: [],
      failed: [
        {
          path: "docs/swarmsy/required-a.md",
          stage: "collect",
          error: "collector failed",
        },
        {
          path: "docs/swarmsy/required-b.md",
          stage: "embed",
          error: "embed failed",
        },
      ],
      partial: true,
      message: "SWARMSY required docs ingestion completed with partial failures.",
    });
  });

  it("serializes ingestion requests and refreshes docs before duplicate checks", async () => {
    collector.online.mockResolvedValue(true);
    getSwarmsyRequiredDocsStatus.mockReturnValue({
      docsRoot: "/repo",
      groups: [
        {
          required: true,
          files: [{ path: "docs/swarmsy/required-a.md", loadable: true }],
        },
      ],
    });

    let releaseFirstCollect;
    const firstCollect = new Promise((resolve) => {
      releaseFirstCollect = resolve;
    });

    Document.forWorkspace
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          metadata: JSON.stringify({
            chunkSource: "swarmsy-required://docs/swarmsy/required-a.md",
          }),
        },
      ]);

    collector.forwardExtensionRequest
      .mockImplementationOnce(() => firstCollect)
      .mockResolvedValueOnce({
        success: true,
        documents: [{ location: "custom-documents/required-a.json" }],
      });

    Document.addDocuments.mockResolvedValue({
      failedToEmbed: [],
      errors: [],
      embedded: ["custom-documents/required-a.json"],
    });

    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [],
    };

    const firstRequest = ingestSwarmsyRequiredDocs({ workspace, userId: 12 });
    const secondRequest = ingestSwarmsyRequiredDocs({ workspace, userId: 12 });

    releaseFirstCollect({
      success: true,
      documents: [{ location: "custom-documents/required-a.json" }],
    });

    const [firstResult, secondResult] = await Promise.all([
      firstRequest,
      secondRequest,
    ]);

    expect(Document.forWorkspace).toHaveBeenCalledTimes(2);
    expect(collector.forwardExtensionRequest).toHaveBeenCalledTimes(1);
    expect(Document.addDocuments).toHaveBeenCalledTimes(1);
    expect(firstResult.partial).toBe(false);
    expect(secondResult.partial).toBe(false);
    expect(secondResult.ingested).toEqual([]);
    expect(secondResult.skipped).toEqual([
      {
        path: "docs/swarmsy/required-a.md",
        reason: "already_attached",
        error: null,
      },
    ]);
  });
});
