jest.mock("pg", () => ({}), { virtual: true });
jest.mock("uuid", () => ({ v4: jest.fn() }), { virtual: true });
jest.mock("../../../../utils/helpers", () => ({
  toChunks: (values) => [values],
  getEmbeddingEngineSelection: () => ({
    embedChunks: async () => [[0.1, 0.2]],
  }),
}));
jest.mock("../../../../utils/TextSplitter", () => ({
  TextSplitter: class {
    static determineMaxChunkSize() {
      return 1000;
    }
    static buildHeaderMeta() {
      return null;
    }
    async splitText(text) {
      return [text];
    }
  },
}));
jest.mock("../../../../utils/chats", () => ({ sourceIdentifier: jest.fn() }));
jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: { getValueOrFallback: async () => 1000 },
}));
jest.mock("../../../../models/vectors", () => ({
  DocumentVectors: { bulkInsert: jest.fn() },
}));
jest.mock("../../../../utils/files", () => ({
  cachedVectorInformation: jest.fn(),
  storeVectorResult: jest.fn(),
}));

const { PGVector } = require("../../../../utils/vectorDbProviders/pgvector");
const { v4 } = require("uuid");
const { DocumentVectors } = require("../../../../models/vectors");
const {
  cachedVectorInformation,
  storeVectorResult,
} = require("../../../../utils/files");

describe.each([false, true])("PGVector embedding (cached: %s)", (cached) => {
  let provider;
  let connection;
  const document = { docId: "document-id", pageContent: "Document content" };
  const docpath = "custom-documents/report.json";

  beforeEach(() => {
    jest.clearAllMocks();
    v4.mockReturnValue("vector-id");
    cachedVectorInformation.mockResolvedValue({
      exists: cached,
      chunks: [
        [{ values: [0.1, 0.2], metadata: { text: document.pageContent } }],
      ],
    });
    connection = {
      query: jest.fn().mockResolvedValue({ rows: [] }),
      end: jest.fn().mockResolvedValue(undefined),
    };
    provider = new PGVector();
    jest.spyOn(provider, "connect").mockResolvedValue(connection);
    jest.spyOn(provider, "logger").mockImplementation(() => {});
  });

  it("records vectors and caches new embeddings only after a successful commit", async () => {
    const result = await provider.addDocumentToNamespace(
      "workspace",
      document,
      docpath
    );

    expect(result).toEqual({ vectorized: true, error: null });
    const statements = connection.query.mock.calls.map(([sql]) => sql);
    expect(statements).toEqual([
      provider.createExtensionSql,
      provider.createTableSql(2),
      "BEGIN",
      expect.stringMatching(/^INSERT INTO/),
      "COMMIT",
    ]);
    expect(DocumentVectors.bulkInsert).toHaveBeenCalledWith([
      { docId: document.docId, vectorId: "vector-id" },
    ]);
    expect(storeVectorResult).toHaveBeenCalledTimes(cached ? 0 : 1);
    if (!cached)
      expect(storeVectorResult).toHaveBeenCalledWith(
        [[expect.objectContaining({ id: "vector-id", values: [0.1, 0.2] })]],
        docpath
      );
    expect(connection.end).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["INSERT", false],
    ["COMMIT", false],
    ["INSERT", true],
    ["COMMIT", true],
  ])(
    "returns the %s error (rollback fails: %s)",
    async (statement, rollbackFails) => {
      const originalError = new Error(`${statement} rejected by PostgreSQL`);
      connection.query.mockImplementation(async (sql) => {
        if (sql.startsWith(statement)) throw originalError;
        if (sql === "ROLLBACK" && rollbackFails)
          throw new Error("Connection lost during rollback");
        return { rows: [] };
      });

      const result = await provider.addDocumentToNamespace(
        "workspace",
        document,
        docpath
      );

      expect(result).toEqual({
        vectorized: false,
        error: originalError.message,
      });
      expect(connection.query).toHaveBeenCalledWith("ROLLBACK");
      expect(DocumentVectors.bulkInsert).not.toHaveBeenCalled();
      expect(storeVectorResult).not.toHaveBeenCalled();
      expect(connection.end).toHaveBeenCalledTimes(1);
    }
  );
});
