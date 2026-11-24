const AdmZip = require("adm-zip");
const docx = require("docx");
const { JSDOM } = require("jsdom");
const {
  htmlToDocxElements,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/docx/utils");

it.each([
  [
    '\n<a id="source"></a><p>First <strong>point</strong>.</p>\n<p>Second point.</p>\n<img>',
    ["First point.", "Second point."],
  ],
  [
    "Before <em>this</em><p>Quoted.</p>After.",
    ["Before this", "Quoted.", "After."],
  ],
])(
  "keeps paragraph boundaries when exporting <blockquote>%s</blockquote>",
  async (content, expected) => {
    const children = await htmlToDocxElements(
      `<blockquote id="34">${content}</blockquote>`,
      { docx, JSDOM },
      jest.fn()
    );
    const document = new docx.Document({ sections: [{ children }] });
    const zip = new AdmZip(await docx.Packer.toBuffer(document));
    const xml = new JSDOM(zip.readAsText("word/document.xml"), {
      contentType: "application/xml",
    });
    const paragraphs = xml.window.document.getElementsByTagName("w:p");
    expect(Array.from(paragraphs, (p) => p.textContent)).toEqual(expected);
  }
);
