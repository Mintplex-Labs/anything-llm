const fs = require("fs");
const os = require("os");
const path = require("path");
process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "purge-folder-test-")
);

jest.mock("../../../models/workspace", () => ({
  Workspace: { where: jest.fn(async () => [{ id: 1, slug: "my-workspace" }]) },
}));
jest.mock("../../../models/documents", () => ({
  Document: { removeDocuments: jest.fn(async () => true) },
}));

const { Document } = require("../../../models/documents");
const {
  documentsPath,
  storeVectorResult,
  cachedVectorInformation,
} = require("../../../utils/files");
const { purgeFolder } = require("../../../utils/files/purgeDocument");

describe("purgeFolder", () => {
  // Workspace documents and vector-cache files are keyed by the
  // `folder/file.json` docpath on every OS, never by an absolute path.
  const docpath = "my-folder/notes.txt-1234.json";

  beforeEach(async () => {
    fs.mkdirSync(path.join(documentsPath, "my-folder"), { recursive: true });
    fs.writeFileSync(
      path.join(documentsPath, docpath),
      JSON.stringify({ title: "notes.txt" })
    );
    await storeVectorResult([], docpath);
  });

  afterAll(() => {
    fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true });
  });

  it("removes the folder's documents from workspaces by docpath", async () => {
    await purgeFolder("my-folder");
    expect(Document.removeDocuments).toHaveBeenCalledWith(
      { id: 1, slug: "my-workspace" },
      [docpath]
    );
  });

  it("purges the vector cache and deletes the folder", async () => {
    await purgeFolder("my-folder");
    expect(await cachedVectorInformation(docpath, true)).toBe(false);
    expect(fs.existsSync(path.join(documentsPath, "my-folder"))).toBe(false);
  });
});
