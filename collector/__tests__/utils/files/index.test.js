process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
const fs = require("fs");
const os = require("os");
const path = require("path");
const { isTextType } = require("../../../utils/files");

describe("isTextType", () => {
  let dir;
  beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "istexttype-"));
  });
  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  const write = (name, content) => {
    const file = path.join(dir, name);
    fs.writeFileSync(file, content);
    return file;
  };

  test.each([
    ".gif",
    ".bmp",
    ".tiff",
    ".heic",
    ".heif",
    ".tif",
    ".doc",
    ".xls",
    ".ppt",
    ".rar",
    ".7z",
    ".exe",
    ".zip",
  ])("rejects %s binary files with no converter", (ext) => {
    const file = write(`binary${ext}`, Buffer.from([0, 1, 2, 3, 255, 254, 0]));
    expect(isTextType(file)).toBe(false);
  });

  test.each([".txt", ".py", ".svg", ".log"])(
    "still accepts %s as text",
    (ext) => {
      const file = write(`text${ext}`, "hello world");
      expect(isTextType(file)).toBe(true);
    }
  );

  test("returns false for a missing file", () => {
    expect(isTextType(path.join(dir, "missing.txt"))).toBe(false);
  });
});
