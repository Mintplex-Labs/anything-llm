/* eslint-env jest, node */
// utils/files resolves its documents path from STORAGE_DIR at require time.
process.env.STORAGE_DIR = __dirname;
const { Weaviate } = require("../../../../utils/vectorDbProviders/weaviate");

// Weaviate rejects any class name that does not match this pattern.
const VALID_CLASS_NAME = /^[A-Z][_0-9A-Za-z]*$/;

function weaviateWithFakeClient() {
  const names = [];
  const client = {
    collections: {
      exists: jest.fn(async (name) => {
        names.push(name);
        return false;
      }),
      delete: jest.fn(async (name) => names.push(name)),
    },
  };
  const db = new Weaviate();
  db.connect = jest.fn(async () => ({ client }));
  return { db, client, names };
}

describe("Weaviate class names", () => {
  test.each([
    ["2024-report"],
    ["3f2a9c1e-7b2d-4c1a-9e3f-1a2b3c4d5e6f"],
    ["my-docs"],
  ])("uses a valid class name for the %s namespace", async (namespace) => {
    const { db, names } = weaviateWithFakeClient();
    await db.hasNamespace(namespace);
    expect(names[0]).toMatch(VALID_CLASS_NAME);
  });

  test("keeps the existing class name of a namespace that starts with a letter", async () => {
    const { db, names } = weaviateWithFakeClient();
    await db.hasNamespace("my-docs");
    expect(names[0]).toBe("MyDocs");
  });

  test("uses the same class name to create, find and delete a namespace", async () => {
    const { db, client, names } = weaviateWithFakeClient();
    await db.hasNamespace("2024-report");
    await db.deleteVectorsInNamespace(client, "2024-report");
    expect(new Set(names).size).toBe(1);
  });
});
