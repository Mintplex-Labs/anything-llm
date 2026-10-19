jest.mock("uuid", () => ({ v4: () => "telegram-agent-test" }), {
  virtual: true,
});
jest.mock("../../../utils/agents/ephemeral", () => ({
  EphemeralAgentHandler: jest.fn(),
}));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { new: jest.fn() },
}));
jest.mock("../../../utils/http", () => ({ safeJsonParse: JSON.parse }));
jest.mock("../../../utils/EncryptionManager", () => ({}));
jest.mock("../../../utils/telegramBot/utils/media", () => ({
  sendVoiceResponse: jest.fn(),
}));

const { EphemeralAgentHandler } = require("../../../utils/agents/ephemeral");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  handleAgentResponse,
} = require("../../../utils/telegramBot/chat/agent");

const longAnswer = "A".repeat(80) + "B".repeat(4900) + "THE END";

async function runAgent({
  chunks = [],
  finalResponse = "",
  configureBot,
} = {}) {
  const messages = new Map();
  let nextId = 1;
  const bot = {
    sendMessage: jest.fn(async (_chatId, text) => {
      if (text.length > 4096) throw new Error("message is too long");
      if (Buffer.from(text).toString("utf8") !== text)
        throw new Error("invalid Unicode");
      const message_id = nextId++;
      messages.set(message_id, text);
      return { message_id };
    }),
    editMessageText: jest.fn(async (text, { message_id }) => {
      if (text.length > 4096) throw new Error("message is too long");
      if (Buffer.from(text).toString("utf8") !== text)
        throw new Error("invalid Unicode");
      messages.set(message_id, text);
    }),
    deleteMessage: jest.fn(async (_chatId, messageId) => {
      messages.delete(messageId);
    }),
    sendChatAction: jest.fn(async () => {}),
  };
  configureBot?.(bot, messages);
  EphemeralAgentHandler.mockImplementation(() => ({
    aibitat: { _pendingOutputs: [] },
    async init() {
      return this;
    },
    async createAIbitat({ handler }) {
      this.handler = handler;
    },
    async startAgentCluster() {
      const emit = (type, content) =>
        this.handler.send(
          JSON.stringify({
            type: "reportStreamEvent",
            content: { type, content },
          })
        );
      for (const chunk of chunks) {
        emit("textResponseChunk", chunk);
        await new Promise(setImmediate);
      }
      if (finalResponse) emit("fullTextResponse", finalResponse);
    },
  }));
  const log = Object.assign(jest.fn(), {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  });

  await handleAgentResponse({ bot, log }, 123, { id: 1 }, null, "@agent test");
  return { bot, messages: [...messages.values()] };
}

beforeEach(() => jest.clearAllMocks());

describe("Telegram agent final-answer delivery", () => {
  test("keeps a short streamed answer complete", async () => {
    const answer = "A short answer.";
    const { messages } = await runAgent({
      chunks: [answer],
      finalResponse: answer,
    });
    expect(messages).toEqual([answer]);
  });

  test("does not overwrite the final streamed chunk with the full answer", async () => {
    const { messages } = await runAgent({
      chunks: [longAnswer.slice(0, 80), longAnswer.slice(80)],
      finalResponse: longAnswer,
    });
    expect(messages.join("")).toBe(longAnswer);
    expect(WorkspaceChats.new.mock.calls[0][0].response.text).toBe(longAnswer);
  });

  test("splits a long answer when no streaming chunks were emitted", async () => {
    const answer = "A".repeat(12000) + "THE END";
    const { messages } = await runAgent({ finalResponse: answer });
    expect(messages.join("")).toBe(answer);
    expect(messages.every((text) => text.length <= 4096)).toBe(true);
  });

  test("delivers the accumulated text when there is no full-response event", async () => {
    const answer = "A".repeat(12000) + "THE END";
    const { messages } = await runAgent({
      chunks: [answer.slice(0, 80), answer.slice(80)],
    });
    expect(messages.join("")).toBe(answer);
  });

  test.each([4000, 4001, 8000, 8001])(
    "preserves an answer of %i characters at message boundaries",
    async (length) => {
      const answer = "A".repeat(length);
      const { messages } = await runAgent({ finalResponse: answer });
      expect(messages.join("")).toBe(answer);
      expect(messages.every((text) => text.length <= 4096)).toBe(true);
    }
  );

  test("waits for an outstanding initial send before finalizing", async () => {
    const { messages } = await runAgent({
      chunks: [longAnswer.slice(0, 80), longAnswer.slice(80)],
      finalResponse: longAnswer,
      configureBot(bot) {
        const send = bot.sendMessage.getMockImplementation();
        bot.sendMessage.mockImplementationOnce(async (...args) => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return send(...args);
        });
      },
    });
    expect(messages.join("")).toBe(longAnswer);
  });

  test("finishes pending preview edits before writing the final answer", async () => {
    const { messages } = await runAgent({
      chunks: [longAnswer.slice(0, 80), longAnswer.slice(80)],
      finalResponse: longAnswer,
      configureBot(bot) {
        const edit = bot.editMessageText.getMockImplementation();
        bot.editMessageText.mockImplementationOnce(async (...args) => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return edit(...args);
        });
      },
    });
    expect(messages.join("")).toBe(longAnswer);
  });

  test("replaces a longer streamed draft with the final answer", async () => {
    const answer = "The final answer is shorter than the draft.";
    const { messages } = await runAgent({
      chunks: [longAnswer.slice(0, 80), longAnswer.slice(80)],
      finalResponse: answer,
    });
    expect(messages).toEqual([answer]);
  });

  test("preserves formatting for a short Markdown answer", async () => {
    const { messages } = await runAgent({
      chunks: ["**Answer**"],
      finalResponse: "**Answer**",
    });
    expect(messages).toEqual(["<b>Answer</b>"]);
  });

  test("uses plain text rather than truncating expanded HTML", async () => {
    const answer = "&".repeat(4000) + "THE END";
    const { messages } = await runAgent({
      chunks: [answer.slice(0, 80), answer.slice(80)],
      finalResponse: answer,
    });
    expect(messages.join("")).toBe(answer);
  });

  test("does not split an emoji's surrogate pair between messages", async () => {
    const answer = "A".repeat(3999) + "😀THE END";
    const { messages } = await runAgent({ finalResponse: answer });
    expect(messages.join("")).toBe(answer);
    expect(
      messages.every((text) => Buffer.from(text).toString("utf8") === text)
    ).toBe(true);
  });

  test("sends the complete final answer when preview edits fail", async () => {
    const { messages } = await runAgent({
      chunks: [longAnswer.slice(0, 80), longAnswer.slice(80)],
      finalResponse: longAnswer,
      configureBot(bot) {
        bot.editMessageText.mockRejectedValue(
          new Error("message to edit not found")
        );
      },
    });
    expect(messages.join("")).toBe(longAnswer);
  });

  test("keeps chunks ordered when an early preview cannot be edited", async () => {
    const { messages } = await runAgent({
      chunks: [longAnswer.slice(0, 80), longAnswer.slice(80)],
      finalResponse: longAnswer,
      configureBot(bot) {
        const edit = bot.editMessageText.getMockImplementation();
        bot.editMessageText
          .mockImplementationOnce(edit)
          .mockRejectedValueOnce(new Error("temporary edit failure"));
      },
    });
    expect(messages.join("")).toBe(longAnswer);
  });

  test("retries an invalid HTML edit as plain text in the same message", async () => {
    const answer = "**a *b** c*";
    const { bot, messages } = await runAgent({
      chunks: [answer],
      finalResponse: answer,
      configureBot(bot) {
        const edit = bot.editMessageText.getMockImplementation();
        bot.editMessageText.mockImplementation(async (text, opts) => {
          if (opts.parse_mode === "HTML")
            throw new Error("can't parse entities");
          return edit(text, opts);
        });
      },
    });
    expect(messages).toEqual([answer]);
    expect(bot.sendMessage).toHaveBeenCalledTimes(1);
  });

  test("does not resend an already-finalized message", async () => {
    const answer = "An unchanged answer.";
    const { bot, messages } = await runAgent({
      chunks: [answer],
      finalResponse: answer,
      configureBot(bot, messages) {
        bot.editMessageText.mockImplementation(async (text, { message_id }) => {
          messages.set(message_id, text);
          throw new Error("message is not modified");
        });
      },
    });
    expect(messages).toEqual([answer]);
    expect(bot.sendMessage).toHaveBeenCalledTimes(1);
  });

  test("propagates a failed final send rather than silently dropping the answer", async () => {
    await expect(
      runAgent({
        finalResponse: longAnswer,
        configureBot(bot) {
          bot.sendMessage.mockRejectedValue(new Error("Telegram unavailable"));
        },
      })
    ).rejects.toThrow("Telegram unavailable");
  });
});
