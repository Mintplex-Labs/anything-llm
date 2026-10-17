/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

const filesystem = require("../../../../../../utils/agents/aibitat/plugins/filesystem/lib.js");

describe("FilesystemManager.applyFileEdits line endings", () => {
  let dir;
  let file;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "filesystem-edit-"));
    file = path.join(dir, "file.txt");
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("keeps a CRLF file's line endings", async () => {
    fs.writeFileSync(file, "a\r\nb\r\nc\r\n");
    await filesystem.applyFileEdits(file, [{ oldText: "b", newText: "x\ny" }]);
    expect(fs.readFileSync(file, "utf-8")).toBe("a\r\nx\r\ny\r\nc\r\n");
  });

  it("keeps a CRLF file's line endings when the edit spans lines", async () => {
    fs.writeFileSync(file, "  one\r\n  two\r\nthree\r\n");
    await filesystem.applyFileEdits(file, [
      { oldText: "one\ntwo", newText: "uno\n  dos" },
    ]);
    expect(fs.readFileSync(file, "utf-8")).toBe("  uno\r\n  dos\r\nthree\r\n");
  });

  it("keeps an LF file's line endings when newText uses CRLF", async () => {
    fs.writeFileSync(file, "a\nb\n");
    await filesystem.applyFileEdits(file, [{ oldText: "a", newText: "c\r\nd" }]);
    expect(fs.readFileSync(file, "utf-8")).toBe("c\nd\nb\n");
  });

  it("writes a mixed file with its predominant line ending", async () => {
    fs.writeFileSync(file, "a\r\nb\r\nc\n");
    await filesystem.applyFileEdits(file, [{ oldText: "a", newText: "z" }]);
    expect(fs.readFileSync(file, "utf-8")).toBe("z\r\nb\r\nc\r\n");
  });

  it("does not touch the file on a dry run", async () => {
    fs.writeFileSync(file, "a\r\nb\r\n");
    await filesystem.applyFileEdits(file, [{ oldText: "a", newText: "z" }], true);
    expect(fs.readFileSync(file, "utf-8")).toBe("a\r\nb\r\n");
  });
});
