process.env.STORAGE_DIR = __dirname;

const mockCollector = {
  online: jest.fn(),
  processLink: jest.fn(),
  log: jest.fn(),
};
const mockSendTelemetry = jest.fn();
const mockLogEvent = jest.fn();
const mockUploadToWorkspace = jest.fn();

jest.mock("../../../models/telemetry", () => ({
  Telemetry: {
    sendTelemetry: mockSendTelemetry,
  },
}));

jest.mock("../../../utils/middleware/validApiKey", () => ({
  validApiKey: jest.fn(),
}));

jest.mock("../../../utils/files/multer", () => ({
  handleAPIFileUpload: jest.fn(),
}));

jest.mock("../../../utils/files", () => ({
  findDocumentInDocuments: jest.fn(),
  getDocumentsByFolder: jest.fn(),
  normalizePath: jest.fn(),
  isWithin: jest.fn(),
  moveProcessedDocsToFolder: jest.fn(),
  viewLocalFiles: jest.fn(),
}));

jest.mock("../../../utils/http", () => ({
  reqBody: (request) => request.body || {},
  safeJsonParse: (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  queryParams: jest.fn(),
}));

jest.mock("../../../models/eventLogs", () => ({
  EventLogs: {
    logEvent: mockLogEvent,
  },
}));

jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(() => mockCollector),
}));

jest.mock("../../../models/documents", () => ({
  Document: {
    api: {
      uploadToWorkspace: mockUploadToWorkspace,
    },
  },
}));

jest.mock("../../../utils/files/purgeDocument", () => ({
  purgeFolder: jest.fn(),
}));

jest.mock("../../../utils/agents/aibitat/plugins/create-files/lib", () => ({}));

const { apiDocumentEndpoints } = require("../../../endpoints/api/document");

function getUploadLinkHandler() {
  const app = {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  apiDocumentEndpoints(app);

  const route = app.post.mock.calls.find(
    ([path]) => path === "/v1/document/upload-link"
  );
  return route.at(-1);
}

function createResponse() {
  const response = {};
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  response.end = jest.fn().mockReturnValue(response);
  response.sendStatus = jest.fn().mockReturnValue(response);
  return response;
}

describe("POST /v1/document/upload-link", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCollector.online.mockReset().mockResolvedValue(true);
    mockCollector.processLink.mockReset();
  });

  it("keeps accepting a single link string", async () => {
    const document = {
      location: "custom-documents/example.json",
    };
    mockCollector.processLink.mockResolvedValue({
      success: true,
      reason: null,
      documents: [document],
    });

    const handler = getUploadLinkHandler();
    const response = createResponse();

    await handler(
      {
        body: {
          link: "https://example.com",
        },
      },
      response
    );

    expect(mockCollector.processLink).toHaveBeenCalledWith(
      "https://example.com",
      {},
      {}
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      error: null,
      documents: [document],
    });
  });

  it("processes multiple links and aggregates their documents", async () => {
    const firstDocument = {
      location: "custom-documents/first.json",
    };
    const secondDocument = {
      location: "custom-documents/second.json",
    };

    mockCollector.processLink
      .mockResolvedValueOnce({
        success: true,
        reason: null,
        documents: [firstDocument],
      })
      .mockResolvedValueOnce({
        success: true,
        reason: null,
        documents: [secondDocument],
      });

    const handler = getUploadLinkHandler();
    const response = createResponse();

    await handler(
      {
        body: {
          link: [
            "https://example.com",
            "https://www.iana.org/domains/reserved",
          ],
          addToWorkspaces: "workspace-one",
        },
      },
      response
    );

    expect(mockCollector.processLink).toHaveBeenCalledTimes(2);
    expect(mockCollector.processLink).toHaveBeenNthCalledWith(
      1,
      "https://example.com",
      {},
      {}
    );
    expect(mockCollector.processLink).toHaveBeenNthCalledWith(
      2,
      "https://www.iana.org/domains/reserved",
      {},
      {}
    );

    expect(mockUploadToWorkspace).toHaveBeenNthCalledWith(
      1,
      "workspace-one",
      firstDocument.location
    );
    expect(mockUploadToWorkspace).toHaveBeenNthCalledWith(
      2,
      "workspace-one",
      secondDocument.location
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      error: null,
      documents: [firstDocument, secondDocument],
    });
  });

  it.each([
    undefined,
    [],
    ["https://example.com", 123],
    ["https://example.com", ""],
  ])("rejects invalid link input: %p", async (link) => {
    const handler = getUploadLinkHandler();
    const response = createResponse();

    await handler({ body: { link } }, response);

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error:
        "link must be a non-empty string or an array of non-empty strings.",
      documents: [],
    });
    expect(mockCollector.processLink).not.toHaveBeenCalled();
  });

  it("reports failed links and preserves successful documents", async () => {
    const document = {
      location: "custom-documents/first.json",
    };

    mockCollector.processLink
      .mockResolvedValueOnce({
        success: true,
        reason: null,
        documents: [document],
      })
      .mockResolvedValueOnce({
        success: false,
        reason: "URL could not be processed.",
        documents: [],
      });

    const handler = getUploadLinkHandler();
    const response = createResponse();

    await handler(
      {
        body: {
          link: ["https://example.com", "https://invalid.example"],
        },
      },
      response
    );

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: "https://invalid.example: URL could not be processed.",
      documents: [document],
    });
    expect(mockUploadToWorkspace).not.toHaveBeenCalled();
  });

  it("preserves the existing error response for a single link", async () => {
    mockCollector.processLink.mockResolvedValue({
      success: false,
      reason: "URL could not be processed.",
      documents: [],
    });

    const handler = getUploadLinkHandler();
    const response = createResponse();

    await handler(
      {
        body: {
          link: "https://invalid.example",
        },
      },
      response
    );

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: "URL could not be processed.",
      documents: [],
    });
  });
});
