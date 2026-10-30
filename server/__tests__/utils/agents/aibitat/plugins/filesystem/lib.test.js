/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

// With the collector offline, head/tail read the file in 1024-byte chunks.
jest.mock("../../../../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn().mockImplementation(() => ({
    online: async () => false,
  })),
}));

const filesystem = require("../../../../../../utils/agents/aibitat/plugins/filesystem/lib.js");

describe("FilesystemManager head/tail without the collector", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "anythingllm-fs-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test("headFile keeps a character split across the chunk boundary", async () => {
    // "é" is two bytes in UTF-8 and occupies bytes 1023 and 1024.
    const filePath = path.join(tmpDir, "head.txt");
    fs.writeFileSync(filePath, "a".repeat(1023) + "é\nsecond line\n");

    const head = await filesystem.headFile(filePath, 1);
    expect(head).toBe("a".repeat(1023) + "é");
  });

  test("tailFile keeps a character split across the chunk boundary", async () => {
    // The last chunk read starts 1024 bytes before the end of the file,
    // which falls between the two bytes of "é".
    const filePath = path.join(tmpDir, "tail.txt");
    fs.writeFileSync(filePath, "first line\ncafé" + "b".repeat(1022) + "\n");

    const tail = await filesystem.tailFile(filePath, 1);
    expect(tail).toBe("café" + "b".repeat(1022));
  });

  test("tailFile still drops CRLF line endings at the chunk boundary", async () => {
    const filePath = path.join(tmpDir, "crlf.txt");
    const lastLine = "z".repeat(1030);
    fs.writeFileSync(filePath, `one\r\ntwo\r\n${lastLine}\r\n`);

    const tail = await filesystem.tailFile(filePath, 2);
    expect(tail).toBe(`two\n${lastLine}`);
  });
});
