process.env.STORAGE_DIR = __dirname;

const fs = require("fs");
const os = require("os");
const path = require("path");
const { moveProcessedDocsToFolder } = require("../../../utils/files");

describe("moveProcessedDocsToFolder", () => {
  let basePath;

  function writeProcessedDoc(location) {
    const fullPath = path.join(basePath, location);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify({ title: "test" }));
    return { location, name: path.basename(location) };
  }

  beforeEach(() => {
    basePath = fs.mkdtempSync(path.join(os.tmpdir(), "docs-test-"));
  });

  afterEach(() => {
    fs.rmSync(basePath, { recursive: true, force: true });
  });

  it("creates a missing folder and moves documents into it", () => {
    const doc = writeProcessedDoc("custom-documents/readme.md-abc123.json");
    const folder = moveProcessedDocsToFolder([doc], "my-vault", basePath);

    expect(folder).toBe("my-vault");
    expect(
      fs.existsSync(path.join(basePath, "my-vault/readme.md-abc123.json"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(basePath, "custom-documents/readme.md-abc123.json"))
    ).toBe(false);
    expect(doc.location).toBe(path.join("my-vault", "readme.md-abc123.json"));
    expect(doc.name).toBe("readme.md-abc123.json");
  });

  it("merges documents into an existing folder", () => {
    fs.mkdirSync(path.join(basePath, "my-vault"));
    fs.writeFileSync(
      path.join(basePath, "my-vault/existing.md-xyz789.json"),
      JSON.stringify({ title: "existing" })
    );
    const doc = writeProcessedDoc("custom-documents/new.md-abc123.json");

    expect(() =>
      moveProcessedDocsToFolder([doc], "my-vault", basePath)
    ).not.toThrow();
    expect(
      fs.existsSync(path.join(basePath, "my-vault/existing.md-xyz789.json"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(basePath, "my-vault/new.md-abc123.json"))
    ).toBe(true);
  });

  it("moves multiple documents and updates each in-place", () => {
    const docs = [
      writeProcessedDoc("custom-documents/a.md-111.json"),
      writeProcessedDoc("custom-documents/b.md-222.json"),
    ];
    moveProcessedDocsToFolder(docs, "notes", basePath);

    for (const doc of docs) {
      expect(fs.existsSync(path.join(basePath, doc.location))).toBe(true);
      expect(path.dirname(doc.location)).toBe("notes");
    }
  });

  it("leaves documents already in the target folder untouched", () => {
    const doc = writeProcessedDoc("my-vault/readme.md-abc123.json");
    moveProcessedDocsToFolder([doc], "my-vault", basePath);

    expect(
      fs.existsSync(path.join(basePath, "my-vault/readme.md-abc123.json"))
    ).toBe(true);
    expect(doc.location).toBe("my-vault/readme.md-abc123.json");
  });

  // Document storage is exactly two segments (`folder/file.json`) and the
  // picker, docpath and embedding pipeline all rely on that. Nested names
  // would create documents none of them can reach, so they are rejected even
  // though /v1/document/upload/:folderName historically tolerated them via a
  // URL-encoded separator.
  it("rejects nested folder names", () => {
    const doc = writeProcessedDoc("custom-documents/readme.md-abc123.json");

    expect(() => moveProcessedDocsToFolder([doc], "a/b", basePath)).toThrow(
      /path separators/
    );
    expect(() =>
      moveProcessedDocsToFolder([doc], "a\\b", basePath)
    ).toThrow(/path separators/);
    expect(fs.existsSync(path.join(basePath, "a"))).toBe(false);
    // The document is left exactly where it was.
    expect(
      fs.existsSync(
        path.join(basePath, "custom-documents/readme.md-abc123.json")
      )
    ).toBe(true);
  });

  it("neutralizes path traversal attempts", () => {
    const doc = writeProcessedDoc("custom-documents/readme.md-abc123.json");
    const folder = moveProcessedDocsToFolder([doc], "../evil", basePath);

    // normalizePath strips the leading "../" so the folder lands inside
    // the base path — nothing is written outside of it.
    expect(folder).toBe("evil");
    expect(
      fs.existsSync(path.join(basePath, "evil/readme.md-abc123.json"))
    ).toBe(true);
    expect(fs.existsSync(path.join(path.dirname(basePath), "evil"))).toBe(
      false
    );
  });

  it("rejects traversal that would still be nested after normalization", () => {
    const doc = writeProcessedDoc("custom-documents/readme.md-abc123.json");
    expect(() =>
      moveProcessedDocsToFolder([doc], "../../etc/passwd", basePath)
    ).toThrow(/path separators/);
  });

  it("throws on empty or invalid folder names", () => {
    const doc = writeProcessedDoc("custom-documents/readme.md-abc123.json");
    expect(() => moveProcessedDocsToFolder([doc], "", basePath)).toThrow();
    expect(() => moveProcessedDocsToFolder([doc], ".", basePath)).toThrow();
  });

  it("does nothing when given no documents", () => {
    const folder = moveProcessedDocsToFolder([], "empty-folder", basePath);
    expect(folder).toBe("empty-folder");
    expect(fs.existsSync(path.join(basePath, "empty-folder"))).toBe(true);
  });
});
