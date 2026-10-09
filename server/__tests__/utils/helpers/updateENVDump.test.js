/* eslint-env jest */

/**
 * dumpENV() rewrites server/.env on every settings save. A value that contains
 * a line break used to be truncated at the first line break, which breaks the
 * embedding prefixes that instruct models require - Qwen3-Embedding wants
 * "instruction\nQuery: " - and silently persists a different prefix than the
 * one the user saved in the UI.
 *
 * These tests exercise the real dumpENV() and read the file back with the real
 * dotenv parser, which is what the server uses on boot.
 */

jest.mock("../../../models/telemetry", () => ({
  Telemetry: { logEvent: jest.fn() },
}));
jest.mock("../../../utils/vectorStore/resetAllVectorStores", () => ({
  resetAllVectorStores: jest.fn(),
}));

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const { dumpENV } = require("../../../utils/helpers/updateENV");
const {
  restoreEscapedEnvValues,
} = require("../../../utils/helpers/envValueCodec");

const ENV_PATH = path.resolve(__dirname, "../../../.env");

const QUERY_PREFIX =
  "Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery: ";
const PASSAGE_PREFIX = "Passage:\n";

describe("dumpENV", () => {
  let originalEnvFile = null;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    originalEnvFile = fs.existsSync(ENV_PATH)
      ? fs.readFileSync(ENV_PATH, "utf8")
      : null;
    process.env.GENERIC_OPEN_AI_EMBEDDING_QUERY_PREFIX = QUERY_PREFIX;
    process.env.GENERIC_OPEN_AI_EMBEDDING_PASSAGE_PREFIX = PASSAGE_PREFIX;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    if (originalEnvFile === null) fs.rmSync(ENV_PATH, { force: true });
    else fs.writeFileSync(ENV_PATH, originalEnvFile);
  });

  const dumpedEnv = () => dotenv.parse(fs.readFileSync(ENV_PATH, "utf8"));

  test("a multi-line embedding prefix survives a dump/load round trip", () => {
    dumpENV();
    const env = restoreEscapedEnvValues(dumpedEnv());

    expect(env.GENERIC_OPEN_AI_EMBEDDING_QUERY_PREFIX).toBe(QUERY_PREFIX);
    expect(env.GENERIC_OPEN_AI_EMBEDDING_PASSAGE_PREFIX).toBe(PASSAGE_PREFIX);
  });

  test("writes one line per key so a value cannot inject another key", () => {
    process.env.GENERIC_OPEN_AI_EMBEDDING_QUERY_PREFIX = "safe'\nINJECTED=1";
    dumpENV();

    const contents = fs.readFileSync(ENV_PATH, "utf8");
    const env = dumpedEnv();
    // The quote terminates the value, so the trailing text is dropped and can
    // never become a key of its own.
    expect(env).not.toHaveProperty("INJECTED");
    expect(env.GENERIC_OPEN_AI_EMBEDDING_QUERY_PREFIX).toBe("safe");
    expect(
      contents.split("\n").filter((line) => line.includes("INJECTED"))
    ).toEqual([]);
  });
});
