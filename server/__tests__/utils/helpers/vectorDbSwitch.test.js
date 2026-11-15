jest.mock("../../../models/telemetry", () => ({ Telemetry: {} }));
jest.mock("../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../../models/workspace", () => ({
  Workspace: {
    where: jest.fn().mockResolvedValue([{ slug: "docs" }, { slug: "notes" }]),
  },
}));
jest.mock("../../../models/documents", () => ({
  Document: { delete: jest.fn().mockResolvedValue(true) },
}));
jest.mock("../../../models/vectors", () => ({
  DocumentVectors: { delete: jest.fn().mockResolvedValue(true) },
}));
jest.mock("../../../utils/files", () => ({
  purgeEntireVectorCache: jest.fn(),
}));

const mockDeleteCollection = jest.fn().mockResolvedValue(true);
jest.mock("chromadb", () => ({
  ChromaClient: jest.fn().mockImplementation(() => ({
    heartbeat: jest.fn().mockResolvedValue(1),
    getCollection: jest.fn(async ({ name }) => ({
      name,
      count: async () => 3,
    })),
    deleteCollection: mockDeleteCollection,
  })),
  CloudClient: jest.fn(),
}));

const { updateENV } = require("../../../utils/helpers/updateENV");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    VECTOR_DB: "chroma",
    CHROMA_ENDPOINT: "http://localhost:8000",
  };
  mockDeleteCollection.mockClear();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe("switching the vector database", () => {
  it("deletes the previous remote provider's workspace namespaces", async () => {
    const { error } = await updateENV({ VectorDB: "lancedb" });

    expect(error).toBe(false);
    expect(process.env.VECTOR_DB).toBe("lancedb");
    expect(mockDeleteCollection).toHaveBeenCalledWith({ name: "docs" });
    expect(mockDeleteCollection).toHaveBeenCalledWith({ name: "notes" });
    expect(console.error).not.toHaveBeenCalledWith(
      "Chroma::Invalid ENV settings"
    );
  });
});
