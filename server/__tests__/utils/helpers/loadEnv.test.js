/* eslint-env jest */

/**
 * Every entry point that used to call `require("dotenv").config()` now goes
 * through loadEnv(), which also restores the line breaks dumpENV() escaped.
 *
 * The call sites are written as `require("...loadEnv")()` (the same shape as
 * `require("./utils/logger")()`), so this file pins down both the export shape
 * and the restore behaviour that the callers depend on.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

const SERVER_DIR = path.resolve(__dirname, "../../..");
const LOADER_PATH = path.join(SERVER_DIR, "utils", "helpers", "loadEnv.js");

const ENTRY_POINTS = [
  "index.js",
  "models/systemSettings.js",
  "utils/http/index.js",
  "endpoints/system.js",
];

const PREFIX_KEY = "GENERIC_OPEN_AI_EMBEDDING_QUERY_PREFIX";
const PREFIX_VALUE =
  "Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery: ";

describe("loadEnv", () => {
  const originalCwd = process.cwd();
  let tempDir;

  beforeEach(() => {
    jest.resetModules();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "anythingllm-loadenv-"));
  });

  afterEach(() => {
    process.chdir(originalCwd);
    delete process.env[PREFIX_KEY];
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("is callable the way the entry points require it", () => {
    expect(typeof require(LOADER_PATH)).toBe("function");
  });

  test("restores escaped line breaks from the ENV file", () => {
    const escaped = PREFIX_VALUE.replace(/\\/g, "\\\\").replace(/\n/g, "\\n");
    fs.writeFileSync(
      path.join(tempDir, ".env"),
      `${PREFIX_KEY}='${escaped}'\n`,
      "utf8"
    );
    // The value is not in the environment yet, so dotenv has to load it.
    delete process.env[PREFIX_KEY];
    process.chdir(tempDir);

    require(LOADER_PATH)();

    expect(process.env[PREFIX_KEY]).toBe(PREFIX_VALUE);
  });

  test("restores only once so a literal backslash is not decoded twice", () => {
    const literal = "D:\\\\new\\\\cert.pem"; // what the file holds for a value with \n
    fs.writeFileSync(
      path.join(tempDir, ".env"),
      `${PREFIX_KEY}='${literal}'\n`,
      "utf8"
    );
    delete process.env[PREFIX_KEY];
    process.chdir(tempDir);

    const loadEnv = require(LOADER_PATH);
    loadEnv();
    const afterFirst = process.env[PREFIX_KEY];
    loadEnv();

    expect(afterFirst).toBe("D:\\new\\cert.pem");
    expect(process.env[PREFIX_KEY]).toBe(afterFirst);
  });

  test("entry points load the ENV file through loadEnv()", () => {
    for (const relativePath of ENTRY_POINTS) {
      const source = fs.readFileSync(
        path.join(SERVER_DIR, relativePath),
        "utf8"
      );

      expect(source).not.toContain('require("dotenv")');
      expect(source).toMatch(/require\("[^"]*loadEnv"\)\(\);/);
    }
  });
});
