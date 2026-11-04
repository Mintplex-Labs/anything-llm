process.env.STORAGE_DIR = __dirname;

const {
  normalizeFolderName,
  isFolderFilePath,
} = require("../../../utils/files");

describe("normalizeFolderName", () => {
  it.each(["reports", "reports-2026", "my folder", "  padded  "])(
    "accepts single-level name %p",
    (name) => {
      expect(normalizeFolderName(name)).toBe(name.trim());
    }
  );

  it.each(["reports/2026", "/sample/sam", "sample/", "reports\\2026"])(
    "rejects nested name %p",
    (name) => {
      expect(() => normalizeFolderName(name)).toThrow(
        "Folder name cannot contain path separators."
      );
    }
  );

  it.each(["", "   ", ".", "..", "/", undefined, null])(
    "rejects empty or relative name %p",
    (name) => {
      expect(() => normalizeFolderName(name)).toThrow();
    }
  );
});

describe("isFolderFilePath", () => {
  it.each(["custom-documents/file.json", "reports/a.json"])(
    "accepts folder/file path %p",
    (p) => {
      expect(isFolderFilePath(p)).toBe(true);
    }
  );

  it.each([
    "reports/2026/file.json",
    "file.json",
    "/file.json",
    "reports/",
    "reports\\2026\\file.json",
    "",
    undefined,
  ])("rejects path %p", (p) => {
    expect(isFolderFilePath(p)).toBe(false);
  });
});
