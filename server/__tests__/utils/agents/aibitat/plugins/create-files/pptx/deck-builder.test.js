/* eslint-env jest */
const {
  decodeHtmlEntities,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/deck-builder.js");

describe("decodeHtmlEntities", () => {
  test("decodes named entities", () => {
    expect(
      decodeHtmlEntities("&lt;a&gt; &amp; &quot;b&quot; &apos;c&apos;")
    ).toBe(`<a> & "b" 'c'`);
  });

  test("decodes decimal and hex entities", () => {
    expect(decodeHtmlEntities("it&#39;s &#34;x&#34; it&#x27;s &#X27;")).toBe(
      `it's "x" it's '`
    );
  });

  test("leaves unknown and out-of-range entities untouched", () => {
    expect(decodeHtmlEntities("&nope; &#99999999; & plain")).toBe(
      "&nope; &#99999999; & plain"
    );
  });
});
