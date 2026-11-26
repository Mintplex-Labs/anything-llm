// utils/files resolves its storage paths from STORAGE_DIR at require time.
process.env.STORAGE_DIR = __dirname;

jest.mock(
  "weaviate-client",
  () => ({
    default: {
      connectToCustom: jest.fn(),
      connectToWeaviateCloud: jest.fn(),
      ApiKey: jest.fn(),
    },
  }),
  { virtual: true }
);

const { Weaviate } = require("../../../../utils/vectorDbProviders/weaviate");

describe("Weaviate vector counting", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      VECTOR_DB: "weaviate",
      WEAVIATE_ENDPOINT: "http://localhost:8080",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("totalVectors counts collections by exact listed name without re-applying className", async () => {
    const collections = new Map([
      [Weaviate.className("2025-report"), 12],
      [Weaviate.className("12345678-abcd-ef00-1234-567890abcdef"), 7],
      [Weaviate.className("my-workspace"), 5],
      ["FAQ", 3],
      ["Custom_Collection", 2],
    ]);

    const getCollection = jest.fn((name) => ({
      length: jest.fn(async () => {
        if (!collections.has(name)) {
          throw new Error(`Collection "${name}" does not exist`);
        }
        return collections.get(name);
      }),
    }));

    const mockClient = {
      collections: {
        listAll: jest.fn(async () =>
          Array.from(collections.keys()).map((name) => ({ name }))
        ),
        get: getCollection,
      },
    };

    const weaviate = new Weaviate();
    jest.spyOn(weaviate, "connect").mockResolvedValue({ client: mockClient });

    expect(await weaviate.namespaceCount("2025-report")).toBe(12);
    expect(
      await weaviate.namespaceCount("12345678-abcd-ef00-1234-567890abcdef")
    ).toBe(7);
    expect(await weaviate.namespaceCount("my-workspace")).toBe(5);

    const total = await weaviate.totalVectors();
    expect(total).toBe(29);
    expect(getCollection).not.toHaveBeenCalledWith("AnythingLlm2025Report");
    expect(getCollection).not.toHaveBeenCalledWith("Faq");
    expect(getCollection).not.toHaveBeenCalledWith("CustomCollection");
  });

  it("totalVectors skips collections whose length lookup fails", async () => {
    const mockClient = {
      collections: {
        listAll: jest.fn(async () => [
          { name: "AnythingLLM2025Report" },
          { name: "BrokenCollection" },
          { name: "MyWorkspace" },
        ]),
        get: jest.fn((name) => ({
          length: jest.fn(async () => {
            if (name === "BrokenCollection") {
              throw new Error("read timeout");
            }
            return name === "AnythingLLM2025Report" ? 10 : 4;
          }),
        })),
      },
    };

    const weaviate = new Weaviate();
    jest.spyOn(weaviate, "connect").mockResolvedValue({ client: mockClient });

    expect(await weaviate.totalVectors()).toBe(14);
  });

  it("totalVectors returns 0 when no collections exist", async () => {
    const mockClient = {
      collections: {
        listAll: jest.fn(async () => []),
        get: jest.fn(),
      },
    };

    const weaviate = new Weaviate();
    jest.spyOn(weaviate, "connect").mockResolvedValue({ client: mockClient });

    expect(await weaviate.totalVectors()).toBe(0);
    expect(mockClient.collections.get).not.toHaveBeenCalled();
  });

  it("namespaceCount returns 0 when namespace is null", async () => {
    const mockClient = {
      collections: {
        get: jest.fn(),
      },
    };

    const weaviate = new Weaviate();
    jest.spyOn(weaviate, "connect").mockResolvedValue({ client: mockClient });

    expect(await weaviate.namespaceCount(null)).toBe(0);
  });
});
