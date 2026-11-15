const {
  transcriptSegmentsToText,
} = require("../../../../utils/extensions/YoutubeTranscript/YoutubeLoader");

describe("transcriptSegmentsToText", () => {
  it("decodes the twice-escaped entities in YouTube caption text", () => {
    // youtube-transcript-plus returns the <text> body of YouTube's caption XML
    // as-is, where an apostrophe arrives as &amp;#39;
    const segments = [
      { text: "and that&amp;#39;s cool", offset: 0, duration: 1 },
      { text: "Q&amp;amp;A at the end", offset: 1, duration: 1 },
      { text: "she said &amp;quot;hello&amp;quot;", offset: 2, duration: 1 },
      { text: "x &amp;lt; y", offset: 3, duration: 1 },
    ];
    expect(transcriptSegmentsToText(segments)).toBe(
      `and that's cool Q&A at the end she said "hello" x < y`
    );
  });

  it("joins plain segments and collapses whitespace", () => {
    expect(
      transcriptSegmentsToText(["hello\nthere", { text: "  general " }, {}])
    ).toBe("hello there general");
  });
});
