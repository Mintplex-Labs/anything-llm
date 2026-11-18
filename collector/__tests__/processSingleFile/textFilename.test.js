const fs = require("fs");
const os = require("os");
const path = require("path");

const storage = fs.mkdtempSync(path.join(os.tmpdir(), "anythingllm-text-"));
process.env.STORAGE_DIR = storage;
const { processSingleFile } = require("../../processSingleFile");

afterAll(() => fs.rmSync(storage, { recursive: true, force: true }));

test.each([
  ["a 213-byte filename", "a".repeat(209) + ".txt"],
  ["a 214-byte filename", "a".repeat(210) + ".txt"],
  ["a short filename whose slug expands", "%".repeat(31) + ".txt"],
])("imports %s and retains the full title", async (_, filename) => {
  const absolutePath = path.join(storage, filename);
  fs.writeFileSync(absolutePath, "hello\n");

  const { success, documents } = await processSingleFile(filename, {
    absolutePath,
  });

  expect(success).toBe(true);
  expect(documents).toHaveLength(1);
  const [{ id, location }] = documents;
  const basename = path.basename(location);
  expect(Buffer.byteLength(basename)).toBeLessThanOrEqual(255);
  expect(basename.endsWith(`-${id}.json`)).toBe(true);
  if (filename.length === 213) expect(basename).toBe(`${filename}-${id}.json`);

  const saved = JSON.parse(
    fs.readFileSync(path.join(storage, "documents", location), "utf8")
  );
  expect(saved).toMatchObject({ id, title: filename, pageContent: "hello\n" });
});
