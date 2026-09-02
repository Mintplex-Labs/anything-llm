/* eslint-env jest, node */
const os = require("os");
const path = require("path");
const fs = require("fs");

process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "anythingllm-search-")
);

// Search does not read the database for the assertions below; stub the two
// model requires so the test needs no Prisma client.
jest.mock("../../../models/documents", () => ({
  Document: { where: jest.fn().mockResolvedValue([]) },
}));
jest.mock("../../../models/documentSyncQueue", () => ({
  DocumentSyncQueue: { enabled: jest.fn().mockResolvedValue(false) },
}));

const { searchDocuments } = require("../../../utils/files");

const FOLDER = path.join(process.env.STORAGE_DIR, "documents", "custom");

function writeDoc(name, pageContent) {
  fs.writeFileSync(
    path.join(FOLDER, name),
    JSON.stringify({
      id: name,
      url: `file://${name}`,
      title: name,
      docAuthor: "author",
      description: "description",
      docSource: "source",
      chunkSource: "chunk",
      published: "2026-01-01",
      wordCount: pageContent.split(" ").length,
      token_count_estimate: 10,
      pageContent,
    })
  );
}

function names(results) {
  return results.flatMap((folder) => folder.items.map((item) => item.title));
}

describe("searchDocuments content matching", () => {
  beforeAll(() => {
    fs.mkdirSync(FOLDER, { recursive: true });
    writeDoc("quarterly.json", "Total price (2024) was five dollars.");
    writeDoc("unrelated.json", "Nothing about pricing here at all.");
  });

  it("matches a term containing parentheses", async () => {
    // "(2024)" is a capture group when the term is treated as a pattern, so
    // the literal text in the document does not match itself.
    const results = await searchDocuments("price (2024)");
    expect(names(results)).toContain("quarterly.json");
  });

  it("does not match documents lacking a bracketed term", async () => {
    // "[pricing]" as a pattern is a character class and matches almost
    // anything; as a literal it appears in neither document.
    const results = await searchDocuments("[pricing]");
    expect(names(results)).toEqual([]);
  });

  it("still matches an ordinary term", async () => {
    const results = await searchDocuments("price");
    expect(names(results)).toContain("quarterly.json");
  });
});
