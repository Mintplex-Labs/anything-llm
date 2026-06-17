/* eslint-env jest */
const {
  documentToCitationSource,
} = require("../../../../../utils/agents/aibitat/utils/parsedFileSources");

describe("documentToCitationSource", () => {
  test("builds a citation source for a parsed/uploaded document", () => {
    const doc = {
      id: "doc-123",
      title: "report.pdf",
      pageContent: "The quarterly revenue grew by 12%.",
      chunkSource: "",
    };

    expect(documentToCitationSource(doc, "Uploaded Document")).toEqual({
      id: "doc-123",
      title: "report.pdf",
      text: "The quarterly revenue grew by 12%....continued on in source document...",
      chunkSource: "",
      score: null,
    });
  });

  test("falls back to the provided title when the document has none", () => {
    const source = documentToCitationSource(
      { id: "doc-123", pageContent: "content" },
      "Uploaded Document"
    );
    expect(source.title).toBe("Uploaded Document");
  });

  test("falls back to nested metadata title for pinned documents", () => {
    const source = documentToCitationSource(
      { id: "pin-1", metadata: { title: "pinned.txt" }, pageContent: "content" },
      "Pinned Document"
    );
    expect(source.title).toBe("pinned.txt");
  });

  test("uses the fallback title as id when the document has no id", () => {
    const source = documentToCitationSource(
      { pageContent: "content" },
      "Uploaded Document"
    );
    expect(source.id).toBe("Uploaded Document");
  });

  test("truncates the citation text to the first 1000 characters", () => {
    const longContent = "a".repeat(5000);
    const source = documentToCitationSource(
      { id: "doc-123", title: "big.txt", pageContent: longContent },
      "Uploaded Document"
    );
    expect(source.text).toBe(
      "a".repeat(1000) + "...continued on in source document..."
    );
  });

  test("preserves the chunkSource so the frontend can resolve the source type", () => {
    const source = documentToCitationSource(
      {
        id: "doc-123",
        title: "page",
        pageContent: "content",
        chunkSource: "link://https://example.com",
      },
      "Uploaded Document"
    );
    expect(source.chunkSource).toBe("link://https://example.com");
  });

  test("handles missing/invalid pageContent without throwing", () => {
    const source = documentToCitationSource(
      { id: "doc-123", title: "empty" },
      "Uploaded Document"
    );
    expect(source.text).toBe("...continued on in source document...");
  });
});
