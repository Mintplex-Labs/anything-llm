const fs = require("fs");

test("documents both platforms and required long-connection setup", () => {
  const text = fs.readFileSync("docs/channels/lark.md", "utf8");
  expect(text).toContain("open.larksuite.com");
  expect(text).toContain("open.feishu.cn");
  expect(text).toContain("im.message.receive_v1");
  expect(text).toContain("WebSocket");
  expect(text).toContain("im:message:send_as_bot");
});
