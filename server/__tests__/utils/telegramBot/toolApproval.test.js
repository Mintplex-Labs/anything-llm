/* eslint-env jest */
const {
  toolApprovalMessage,
} = require("../../../utils/telegramBot/utils/format");

describe("toolApprovalMessage", () => {
  test("escapes HTML in the description and parameters", () => {
    const text = toolApprovalMessage({
      skillName: "filesystem-write-text-file",
      description: "Write a file if a < b & c > d",
      payload: { path: "index.html", content: "<h1>Hi</h1>" },
    });

    expect(text).toContain(
      "<b>filesystem-write-text-file</b>\nWrite a file if a &lt; b &amp; c &gt; d"
    );
    expect(text).toContain("&lt;h1&gt;Hi&lt;/h1&gt;");
    expect(text).not.toContain("<h1>");
  });

  test("shortens long parameters to stay within Telegram's message limit", () => {
    const text = toolApprovalMessage({
      skillName: "filesystem-write-text-file",
      payload: { path: "notes.txt", content: "x".repeat(10000) },
    });

    expect(text.length).toBeLessThan(4096);
    expect(text).toContain("…</code>");
  });

  test("leaves out the parameters section when there are none", () => {
    const text = toolApprovalMessage({
      skillName: "web-browsing",
      payload: {},
    });

    expect(text).not.toContain("Parameters");
    expect(text).toContain("<b>web-browsing</b>");
  });
});
