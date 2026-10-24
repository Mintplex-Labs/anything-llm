/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

const mockCollectorApi = { online: jest.fn(), parseDocument: jest.fn() };
jest.mock("../../../../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn().mockImplementation(() => mockCollectorApi),
}));

const filesystem = require("../../../../../../utils/agents/aibitat/plugins/filesystem/lib.js");

describe("FilesystemManager.tailFile", () => {
  let tmpDir;

  /** Writes a log file and returns its path. */
  function writeLog(content) {
    const filePath = path.join(tmpDir, "app.log");
    fs.writeFileSync(filePath, content);
    return filePath;
  }

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "fs-tail-"));
    jest.clearAllMocks();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("when the collector parses the file", () => {
    function parseAs(content) {
      mockCollectorApi.online.mockResolvedValue(true);
      mockCollectorApi.parseDocument.mockResolvedValue({
        success: true,
        content,
      });
    }

    test("returns the last N lines of a file that ends with a newline", async () => {
      const content = "line 1\nline 2\nline 3\n";
      parseAs(content);
      const filePath = writeLog(content);

      expect(await filesystem.tailFile(filePath, 1)).toBe("line 3");
      expect(await filesystem.tailFile(filePath, 2)).toBe("line 2\nline 3");
    });

    test("returns the last N lines of a file without a trailing newline", async () => {
      const content = "line 1\nline 2\nline 3";
      parseAs(content);
      const filePath = writeLog(content);

      expect(await filesystem.tailFile(filePath, 2)).toBe("line 2\nline 3");
    });
  });

  describe("when the collector is offline", () => {
    beforeEach(() => {
      mockCollectorApi.online.mockResolvedValue(false);
    });

    test("returns the last N lines of a file that ends with a newline", async () => {
      const filePath = writeLog("line 1\r\nline 2\r\nline 3\r\n");

      expect(await filesystem.tailFile(filePath, 1)).toBe("line 3");
      expect(await filesystem.tailFile(filePath, 2)).toBe("line 2\nline 3");
    });

    test("returns the last N lines when the file spans several read chunks", async () => {
      const lines = Array.from({ length: 500 }, (_, i) => `log entry ${i + 1}`);
      const filePath = writeLog(lines.join("\n") + "\n");

      expect(await filesystem.tailFile(filePath, 3)).toBe(
        "log entry 498\nlog entry 499\nlog entry 500"
      );
    });

    test("returns the last N lines of a file without a trailing newline", async () => {
      const filePath = writeLog("line 1\nline 2\nline 3");

      expect(await filesystem.tailFile(filePath, 2)).toBe("line 2\nline 3");
    });
  });
});
