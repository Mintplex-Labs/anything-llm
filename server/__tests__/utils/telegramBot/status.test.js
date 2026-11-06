/* eslint-env jest */
jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn() },
}));
jest.mock("../../../models/workspaceThread", () => ({
  WorkspaceThread: { get: jest.fn() },
}));
jest.mock("../../../utils/EncryptionManager", () => ({}));
jest.mock(
  "../../../utils/agents/aibitat",
  () =>
    class {
      getProviderForConfig() {
        return { supportsNativeToolCalling: async () => true };
      }
    }
);

const { Workspace } = require("../../../models/workspace");
const { WorkspaceThread } = require("../../../models/workspaceThread");
const {
  handleStatus,
} = require("../../../utils/telegramBot/utils/commands/handlers/handleStatus");

const CHAT_ID = 123;

function makeContext(state) {
  return {
    bot: { sendMessage: jest.fn(async () => ({ message_id: 1 })) },
    config: {},
    getState: () => state,
    setState: (_chatId, updates) => Object.assign(state, updates),
    log: jest.fn(),
  };
}

beforeEach(() => jest.clearAllMocks());

describe("Telegram /status", () => {
  test("escapes HTML characters in the workspace and thread names", async () => {
    Workspace.get.mockResolvedValue({
      id: 7,
      slug: "docs",
      name: "Docs <internal>",
      chatProvider: "openai",
      chatModel: "gpt-4o",
      chatMode: "chat",
    });
    // A thread is named after its first prompt, cut to 22 characters.
    WorkspaceThread.get.mockResolvedValue({
      id: 3,
      slug: "t1",
      name: "what does <br> do in h",
    });
    const ctx = makeContext({ workspaceSlug: "docs", threadSlug: "t1" });

    await handleStatus(ctx, CHAT_ID);

    expect(ctx.bot.sendMessage).toHaveBeenCalledTimes(1);
    const [, text, opts] = ctx.bot.sendMessage.mock.calls[0];
    expect(opts).toEqual({ parse_mode: "HTML" });
    expect(text).toContain("<b>Workspace:</b>\nDocs &lt;internal&gt;");
    expect(text).toContain(
      "<b>Thread:</b>\n<i>what does &lt;br&gt; do in h</i>"
    );
  });
});
