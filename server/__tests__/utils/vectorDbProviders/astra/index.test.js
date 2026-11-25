process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";
process.env.SIG_KEY = "test-signing-key";
process.env.SIG_SALT = "test-signing-salt";

jest.mock("../../../../models/vectors", () => ({
  DocumentVectors: {
    where: jest.fn(),
    deleteIds: jest.fn(),
  },
}));

const {
  AstraDB: AstraDBClass,
} = require("../../../../utils/vectorDbProviders/astra");
const { DocumentVectors } = require("../../../../models/vectors");

describe("AstraDB.deleteDocumentFromNamespace", () => {
  const namespace = "my-workspace";
  const sanitizedNamespace = "ns_my_workspace";
  const docId = "doc-1";

  let astra;
  let client;
  let collection;

  beforeEach(() => {
    jest.clearAllMocks();

    collection = { deleteMany: jest.fn().mockResolvedValue({}) };
    client = { collection: jest.fn().mockResolvedValue(collection) };
    astra = new AstraDBClass();
    jest.spyOn(astra, "connect").mockResolvedValue({ client });
    jest.spyOn(astra, "namespaceExists").mockResolvedValue(true);
    jest.spyOn(astra, "logger").mockImplementation(() => {});
    DocumentVectors.where.mockResolvedValue([]);
    DocumentVectors.deleteIds.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("resolves without touching vectors when the namespace does not exist", async () => {
    astra.namespaceExists.mockResolvedValue(false);

    await expect(
      astra.deleteDocumentFromNamespace(namespace, docId)
    ).resolves.toBeUndefined();

    expect(astra.namespaceExists).toHaveBeenCalledWith(
      client,
      sanitizedNamespace
    );
    expect(astra.logger).toHaveBeenCalledWith(
      `deleteDocumentFromNamespace - namespace ${sanitizedNamespace} does not exist.`
    );
    expect(client.collection).not.toHaveBeenCalled();
    expect(DocumentVectors.where).not.toHaveBeenCalled();
    expect(DocumentVectors.deleteIds).not.toHaveBeenCalled();
  });

  it("deletes vectors by vectorId and clears the DocumentVectors rows when the namespace exists", async () => {
    DocumentVectors.where.mockResolvedValue([
      { id: 10, docId, vectorId: "vec-a" },
      { id: 11, docId, vectorId: "vec-b" },
    ]);

    await expect(
      astra.deleteDocumentFromNamespace(namespace, docId)
    ).resolves.toBe(true);

    expect(DocumentVectors.where).toHaveBeenCalledWith({ docId });
    expect(client.collection).toHaveBeenCalledWith(sanitizedNamespace);
    expect(collection.deleteMany).toHaveBeenCalledTimes(2);
    expect(collection.deleteMany).toHaveBeenNthCalledWith(1, { _id: "vec-a" });
    expect(collection.deleteMany).toHaveBeenNthCalledWith(2, { _id: "vec-b" });
    expect(DocumentVectors.deleteIds).toHaveBeenCalledWith([10, 11]);
  });

  it("resolves without vector deletes when the namespace exists but the document has no recorded vectors", async () => {
    await expect(
      astra.deleteDocumentFromNamespace(namespace, docId)
    ).resolves.toBeUndefined();

    expect(collection.deleteMany).not.toHaveBeenCalled();
    expect(DocumentVectors.deleteIds).not.toHaveBeenCalled();
  });

  it("sanitizes the namespace before the existence check", async () => {
    astra.namespaceExists.mockResolvedValue(false);

    await astra.deleteDocumentFromNamespace("My Workspace!", docId);

    expect(astra.namespaceExists).toHaveBeenCalledWith(
      client,
      "ns_My_Workspace_"
    );
  });
});
