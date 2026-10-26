/* eslint-env jest, node */
process.env.STORAGE_DIR = "test-storage";
const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("../../utils/files", () => ({
  ...jest.requireActual("../../utils/files"),
  writeToServerDocuments: jest.fn(({ data }) => data),
}));

const { processSingleFile } = require("../../processSingleFile");

describe("processSingleFile extensionless files", () => {
  let tempDir;

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "anythingllm-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  function writeFile(dir, name, content) {
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, name);
    fs.writeFileSync(filePath, content);
    return filePath;
  }

  test("parses an extensionless text file when a parent folder has a dot in its name", async () => {
    const filePath = writeFile(
      path.join(tempDir, "john.doe", "project"),
      "Makefile",
      "build:\n\tnode index.js\n"
    );
    const result = await processSingleFile("Makefile", {
      absolutePath: filePath,
      parseOnly: true,
    });
    expect(result.success).toBe(true);
    expect(result.documents[0].pageContent).toBe("build:\n\tnode index.js\n");
  });

  test("still rejects a dotfile that has no extension", async () => {
    const filePath = writeFile(tempDir, ".env", "KEY=value\n");
    const result = await processSingleFile(".env", {
      absolutePath: filePath,
      parseOnly: true,
    });
    expect(result).toEqual({
      success: false,
      reason: "No file extension found. This file cannot be processed.",
      documents: [],
    });
  });
});
