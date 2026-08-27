/* eslint-env jest */

jest.mock("../../../../utils/prisma", () => ({
  document_vectors: {
    deleteMany: jest.fn(),
    create: jest.fn(),
    $transaction: (...args) => Promise.resolve(args),
  },
}));

jest.mock("../../../../utils/TextSplitter", () => ({
  TextSplitter: class {
    static determineMaxChunkSize = jest.fn(() => 1000);
    static buildHeaderMeta = jest.fn((metadata) => metadata);
    constructor() {}
    splitText(text) {
      return Promise.resolve([text]);
    }
  },
}));

jest.mock("../../../../models/documents", () => ({
  Document: {
    forWorkspace: jest.fn(),
  },
}));

jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: {
    getValueOrFallback: jest.fn().mockResolvedValue(1),
  },
}));

jest.mock("../../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  getEmbeddingEngineSelection: () => ({
    embedChunks: jest.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
    embeddingMaxChunkLength: 512,
  }),
  cachedVectorInformation: jest.fn().mockResolvedValue({ exists: false }),
  storeVectorResult: jest.fn().mockResolvedValue(),
}));

jest.mock("chromadb", () => ({
  ChromaClient: jest.fn(),
  Collection: jest.fn(),
}));

const { Chroma } = require("../../../../utils/vectorDbProviders/chroma");

describe("Chroma.addDocumentToNamespace - metadata retention", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("retains docId in metadata for novel (non-cached) documents", async () => {
    const mockCollection = {
      add: jest.fn().mockResolvedValue(),
      count: jest.fn().mockResolvedValue(1),
    };

    const chroma = new Chroma();
    chroma.connect = jest.fn().mockResolvedValue({ client: { getOrCreateCollection: jest.fn().mockResolvedValue(mockCollection) } });
    chroma.smartAdd = jest.fn();

    const documentData = {
      pageContent: "This is test content",
      docId: "test-doc-123",
      title: "Test Document",
      source: "upload",
    };

    const result = await chroma.addDocumentToNamespace(
      "test-workspace",
      documentData,
      "/fake/path.pdf",
      true
    );

    expect(result.vectorized).toBe(true);
    expect(chroma.smartAdd).toHaveBeenCalled();
    const callArgs = chroma.smartAdd.mock.calls[0];
    const submission = callArgs[1];
    expect(submission.metadatas[0]).toHaveProperty("docId", "test-doc-123");
    expect(submission.metadatas[0]).toHaveProperty("title", "Test Document");
    expect(submission.metadatas[0]).toHaveProperty("source", "upload");
  });
});
