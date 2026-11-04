jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn(async () => ({ id: 1, name: "Docs" })) },
}));
jest.mock("../../../models/workspaceThread", () => ({
  WorkspaceThread: { get: jest.fn(async () => null) },
}));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { where: jest.fn() },
}));

const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  handleHistory,
} = require("../../../utils/telegramBot/utils/commands/handlers/handleHistory");

function chat(id, prompt, text) {
  return {
    id,
    prompt,
    response: JSON.stringify({ text, sources: [], type: "chat" }),
    createdAt: new Date(),
  };
}

async function runHistory(chats) {
  WorkspaceChats.where.mockResolvedValue(chats);
  const sent = [];
  const bot = {
    sendMessage: jest.fn(async (_chatId, text) => {
      if (text.length > 4096) throw new Error("message is too long");
      if (Buffer.from(text).toString("utf8") !== text)
        throw new Error("invalid Unicode");
      sent.push(text);
      return { message_id: sent.length };
    }),
  };
  const ctx = {
    bot,
    getState: () => ({ workspaceSlug: "docs", threadSlug: null }),
  };
  await handleHistory(ctx, 1, "/history");
  return sent;
}

describe("handleHistory", () => {
  test("sends history that contains a reply longer than a Telegram message", async () => {
    const longReply = "word ".repeat(1200);
    const sent = await runHistory([
      chat(2, "and now?", "Short answer."),
      chat(1, "tell me everything", longReply),
    ]);

    expect(sent.length).toBeGreaterThan(0);
    expect(sent.join("\n")).toContain("Short answer.");
    expect(sent.join("\n")).toContain("…");
  });

  test("does not split an emoji when cutting a long message", async () => {
    const reply = "a".repeat(1499) + "😀".repeat(10);
    const sent = await runHistory([chat(1, "hi", reply)]);

    expect(sent.join("\n")).toContain("a😀…");
  });
});
