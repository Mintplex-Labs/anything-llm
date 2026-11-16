/* eslint-env jest */
const { marked } = require("marked");
const { JSDOM } = require("jsdom");
const docx = require("docx");
const {
  htmlToDocxElements,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/docx/utils.js");

// The numbering instance of each list paragraph, in document order.
async function listInstances(markdown) {
  const html = marked.parse(markdown);
  const elements = await htmlToDocxElements(html, { JSDOM, docx }, () => {});
  return elements
    .map((p) => p.properties?.numberingReferences?.[0]?.instance)
    .filter((instance) => instance !== undefined);
}

describe("htmlToDocxElements numbered lists", () => {
  test("keep counting after a code block, and restart for a new list", async () => {
    const [install, run, alpha] = await listInstances(
      "1. Install\n\n```\nnpm i\n```\n\n2. Run\n\nNext:\n\n1. Alpha"
    );
    expect(run).toBe(install);
    expect(alpha).not.toBe(install);
  });
});
