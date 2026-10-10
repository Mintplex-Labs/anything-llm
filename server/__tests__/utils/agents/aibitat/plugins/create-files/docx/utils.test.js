/* eslint-env jest */
const AdmZip = require("adm-zip");
const docx = require("docx");
const { JSDOM } = require("jsdom");
const { marked } = require("marked");
const {
  htmlToDocxElements,
  DEFAULT_NUMBERING_CONFIG,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/docx/utils.js");

/**
 * Builds a document the way create-docx-file does and returns the XML parts
 * Word reads to number the lists.
 */
async function packMarkdown(markdown) {
  marked.setOptions({ gfm: true, breaks: true });
  const elements = await htmlToDocxElements(
    marked.parse(markdown),
    { JSDOM, docx },
    () => {},
    null
  );
  const doc = new docx.Document({
    numbering: DEFAULT_NUMBERING_CONFIG,
    sections: [{ children: elements }],
  });
  const zip = new AdmZip(await docx.Packer.toBuffer(doc));
  return {
    documentXml: zip.readAsText("word/document.xml"),
    numberingXml: zip.readAsText("word/numbering.xml"),
  };
}

/** Numbered paragraphs of document.xml as { text, numId, ilvl }. */
function numberedParagraphs(documentXml) {
  return (documentXml.match(/<w:p>.*?<\/w:p>/g) || [])
    .map((paragraph) => ({
      text: (paragraph.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [])
        .map((run) => run.replace(/<[^>]+>/g, ""))
        .join(""),
      numId: paragraph.match(/<w:numId w:val="(\d+)"\/>/)?.[1] ?? null,
      ilvl: paragraph.match(/<w:ilvl w:val="(\d+)"\/>/)?.[1] ?? null,
    }))
    .filter((paragraph) => paragraph.numId !== null);
}

describe("htmlToDocxElements ordered lists", () => {
  test("each top-level ordered list restarts its numbering instead of continuing the previous one", async () => {
    const { documentXml, numberingXml } = await packMarkdown(
      "## Setup\n\n1. one\n2. two\n3. three\n\n## Usage\n\n1. alpha\n2. beta\n"
    );
    const paragraphs = numberedParagraphs(documentXml);
    expect(paragraphs.map((p) => p.text)).toEqual([
      "one",
      "two",
      "three",
      "alpha",
      "beta",
    ]);

    const [first, second] = [paragraphs.slice(0, 3), paragraphs.slice(3)];
    expect(new Set(first.map((p) => p.numId)).size).toBe(1);
    expect(new Set(second.map((p) => p.numId)).size).toBe(1);
    // Word treats every paragraph with the same numId as one list, so the
    // second list only starts at 1 again when it gets a numId of its own.
    expect(second[0].numId).not.toBe(first[0].numId);

    for (const numId of [first[0].numId, second[0].numId]) {
      const numDefinition = numberingXml.match(
        new RegExp(`<w:num w:numId="${numId}">.*?</w:num>`)
      )?.[0];
      expect(numDefinition).toContain('<w:startOverride w:val="1"/>');
    }
  });

  test("nested bullet items are written once, at their own level", async () => {
    const { documentXml } = await packMarkdown("- one\n  - inner\n- two\n");
    expect(
      numberedParagraphs(documentXml).map((p) => [p.text, p.ilvl])
    ).toEqual([
      ["one", "0"],
      ["inner", "1"],
      ["two", "0"],
    ]);
  });

  test("a nested ordered list keeps numbering with its parent list", async () => {
    const { documentXml } = await packMarkdown(
      "1. one\n   1. inner one\n   2. inner two\n2. two\n"
    );
    const paragraphs = numberedParagraphs(documentXml);
    expect(paragraphs.map((p) => [p.text, p.ilvl])).toEqual([
      ["one", "0"],
      ["inner one", "1"],
      ["inner two", "1"],
      ["two", "0"],
    ]);
    expect(new Set(paragraphs.map((p) => p.numId)).size).toBe(1);
  });
});
