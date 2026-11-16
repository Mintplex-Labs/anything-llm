/* eslint-env jest */
const { marked } = require("marked");
const { JSDOM } = require("jsdom");
const docx = require("docx");
const {
  htmlToDocxElements,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/docx/utils.js");

// The text of a docx element, read from its <w:t> nodes.
function textOf(node) {
  if (!node || typeof node !== "object" || !Array.isArray(node.root)) return "";
  if (node.rootKey === "w:t")
    return node.root.filter((part) => typeof part === "string").join("");
  return node.root.map(textOf).join("");
}

describe("htmlToDocxElements list items", () => {
  test("keep the space between two inline elements", async () => {
    const html = marked.parse(
      "- **Command:** `npm install`\n- **Status:** *done*"
    );
    const elements = await htmlToDocxElements(html, { JSDOM, docx }, () => {});
    expect(elements.map(textOf)).toEqual([
      "Command: npm install",
      "Status: done",
    ]);
  });
});
