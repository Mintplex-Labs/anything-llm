/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { v5: uuidv5 } = require("uuid");

// The vector-cache helpers resolve their storage directory from STORAGE_DIR at
// require-time (when NODE_ENV !== "development"), so point it at an isolated
// temp directory before importing the module under test.
const STORAGE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "allm-vector-cache-"));
process.env.NODE_ENV = "test";
process.env.STORAGE_DIR = STORAGE_DIR;

// Avoid pulling Prisma-backed models (and a real DB connection) into the test.
jest.mock("../../../models/documents", () => ({ Document: {} }));
jest.mock("../../../models/documentSyncQueue", () => ({ DocumentSyncQueue: {} }));

const {
  storeVectorResult,
  cachedVectorInformation,
} = require("../../../utils/files");

const vectorCacheDir = path.resolve(STORAGE_DIR, "vector-cache");
const cacheFileFor = (filename) =>
  path.resolve(vectorCacheDir, `${uuidv5(filename, uuidv5.URL)}.json`);

const makeChunk = (i) => ({
  id: `chunk-${i}`,
  values: [i, i + 0.1, i + 0.2],
  metadata: { text: `content ${i}`, source: "unit-test" },
});

beforeEach(() => fs.rmSync(vectorCacheDir, { recursive: true, force: true }));
afterAll(() => fs.rmSync(STORAGE_DIR, { recursive: true, force: true }));

describe("vector-cache storeVectorResult / cachedVectorInformation", () => {
  test("writes the cache as JSON-lines (header + one JSON value per line)", async () => {
    const filename = "documents/flat.json";
    const data = [makeChunk(1), makeChunk(2), makeChunk(3)];

    await storeVectorResult(data, filename);

    const lines = fs
      .readFileSync(cacheFileFor(filename), "utf8")
      .split("\n")
      .filter((line) => line.trim().length > 0);

    // A header line + one line per chunk - never a single serialized array.
    expect(lines).toHaveLength(data.length + 1);
    expect(JSON.parse(lines[0]).__cacheType).toBe("vector-cache");
    lines.slice(1).forEach((line, idx) => {
      expect(JSON.parse(line)).toEqual(data[idx]);
    });
  });

  test("reads back a JSON-lines cache file written by storeVectorResult", async () => {
    const filename = "documents/roundtrip.json";
    const data = [makeChunk(10), makeChunk(11), makeChunk(12)];

    await storeVectorResult(data, filename);
    const { exists, chunks } = await cachedVectorInformation(filename);

    expect(exists).toBe(true);
    expect(chunks).toEqual(data);
  });

  test("round-trips nested array-of-arrays chunk batches (Chroma layout)", async () => {
    const filename = "documents/batched.json";
    // Some vector DBs (e.g. Chroma) cache `toChunks(vectors, 500)`, so each
    // array element is itself an array of records.
    const data = [
      [makeChunk(1), makeChunk(2)],
      [makeChunk(3), makeChunk(4)],
    ];

    await storeVectorResult(data, filename);
    const { chunks } = await cachedVectorInformation(filename);

    expect(chunks).toEqual(data);
  });

  test("still reads legacy single-array cache files for backwards compatibility", async () => {
    const filename = "documents/legacy.json";
    const data = [makeChunk(7), makeChunk(8)];

    // Reproduce a cache file written by the previous implementation.
    fs.mkdirSync(vectorCacheDir, { recursive: true });
    fs.writeFileSync(cacheFileFor(filename), JSON.stringify(data), "utf8");

    const { exists, chunks } = await cachedVectorInformation(filename);

    expect(exists).toBe(true);
    expect(chunks).toEqual(data);
  });

  test("checkOnly reports existence without reading file contents", async () => {
    const filename = "documents/exists.json";
    expect(await cachedVectorInformation(filename, true)).toBe(false);

    await storeVectorResult([makeChunk(1)], filename);
    expect(await cachedVectorInformation(filename, true)).toBe(true);
  });

  test("returns an empty result when no filename is provided", async () => {
    expect(await cachedVectorInformation(null)).toEqual({
      exists: false,
      chunks: [],
    });
    expect(await cachedVectorInformation(null, true)).toBe(false);
  });
});
