jest.mock("../../../../../models/vectors", () => ({
  DocumentVectors: {
    where: jest.fn(),
    deleteIds: jest.fn(),
  },
}));

const { DocumentVectors } = require("../../../../../models/vectors");
const { LanceDb } = require("../../../../../utils/vectorDbProviders/lance");
const { PGVector } = require("../../../../../utils/vectorDbProviders/pgvector");
const { QDrant } = require("../../../../../utils/vectorDbProviders/qdrant");

describe("deleteDocumentFromNamespace cleans document_vectors rows", () => {
  const knownDocuments = [
    { id: 1, vectorId: "v-1" },
    { id: 2, vectorId: "v-2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    DocumentVectors.where.mockResolved(knownDocuments);
    DocumentVectors.deleteIds.mockResolved(true);
  });

  it("Lance deletes DocumentVectors row ids after removing vectors", async () => {
    const lance = new LanceDb();
    const table = { delete: jest.fn().mockResolved(undefined) };
    lance.connect = jest.fn().mockResolved({

      client: { openTable: jest.fn().mockResolved(table) },
    });
    lance.namespaceExists = jest.fn().mockResolved(true);

    await lance.deleteDocumentFromNamespace("ws", "doc-1");

    expect(table.delete).toHaveBeenCalled();
    expect(DocumentVectors.deleteIds).toHaveBeenCalledWith([1, 2]);
  });

  it("PGVector deletes DocumentVectors row ids after removing vectors", async () => {
    const pg = new PGVector();
    const connection = {
      query: jest.fn().mockResolved(undefined),
      end: jest.fn().mockResolved(undefined),
    };
    pg.connect = jest.fn().mockResolved(connection);
    pg.namespaceExists = jest.fn().mockResolved(true);
    pg.logger = jest.fn();

    await pg.deleteDocumentFromNamespace("ws", "doc-1");

    expect(DocumentVectors.deleteIds).toHaveBeenCalledWith([1, 2]);
  });

  it("QDrant still deletes DocumentVectors row ids (parity baseline)", async () => {
    const qdrant = new QDrant();
    const client = { delete: jest.fn().mockResolved(undefined) };
    qdrant.connect = jest.fn().mockResolved({ client });
    qdrant.namespaceExists = jest.fn().mockResolved(true);

    await qdrant.deleteDocumentFromNamespace("ws", "doc-1");

    expect(client.delete).toHaveBeenCalled();
    expect(DocumentVectors.deleteIds).toHaveBeenCalledWith([1, 2]);
  });
});
