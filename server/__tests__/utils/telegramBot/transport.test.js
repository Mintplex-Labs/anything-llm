jest.mock("node-telegram-bot-api", () => jest.fn());
jest.mock("chartjs-node-canvas", () => ({
  ChartJSNodeCanvas: jest.fn(() => ({
    renderToBuffer: async () => Buffer.from("chart"),
  })),
}));
jest.mock("../../../jobs/helpers", () => ({
  log: jest.fn(),
  conclude: jest.fn(),
}));
jest.mock("../../../models/workspace", () => ({}));
jest.mock("../../../models/workspaceThread", () => ({}));
jest.mock("../../../models/workspaceChats", () => ({}));
jest.mock("../../../utils/helpers", () => ({}));
jest.mock("../../../utils/helpers/modelPricing", () => ({}));
jest.mock("../../../utils/DocumentManager", () => ({}));
jest.mock("../../../utils/chats", () => ({}));
jest.mock("../../../utils/helpers/chat", () => ({}));
jest.mock("../../../utils/agents", () => ({}));
jest.mock("../../../utils/agents/ephemeral", () => ({}));
jest.mock("../../../jobs/handle-external-channel-chat", () => ({
  runExternalChannelChat: jest.fn(),
  createApprovalRequester: jest.fn(),
}));
jest.mock("../../../utils/telegramBot/utils/media", () => ({
  sendVoiceResponse: jest.fn(async () => {}),
}));
jest.mock("../../../utils/agents/aibitat/plugins/create-files/lib", () => ({
  getGeneratedFile: async () => ({ buffer: Buffer.from("file") }),
  getMimeType: () => "text/plain",
}));
const {
  createTelegramTransport,
} = require("../../../jobs/handle-telegram-chat");
const { sendVoiceResponse } = require("../../../utils/telegramBot/utils/media");
let bot;
beforeEach(() => {
  jest.clearAllMocks();
  bot = {
    sendChatAction: jest.fn(async () => {}),
    sendMessage: jest.fn(async () => ({ message_id: 10 })),
    editMessageText: jest.fn(async () => {}),
    sendDocument: jest.fn(async () => {}),
    sendPhoto: jest.fn(async () => {}),
  };
});
test("streams and formats text, delivers voice then generated files, and cleans timers", async () => {
  const transport = createTelegramTransport({ bot, log() {} }, 123, {
    voiceResponse: true,
  });
  await transport.start();
  await transport.append("**hello**");
  await transport.artifact({
    kind: "file",
    filename: "a.txt",
    storageFilename: "a.txt",
  });
  await transport.complete({ text: "**hello**", sources: [], agent: true });
  expect(bot.sendChatAction).toHaveBeenCalledWith(123, "typing");
  expect(bot.editMessageText).toHaveBeenCalledWith(
    "<b>hello</b>",
    expect.objectContaining({ chat_id: 123, parse_mode: "HTML" })
  );
  expect(sendVoiceResponse).toHaveBeenCalledWith(bot, 123, "**hello**");
  expect(bot.sendDocument).toHaveBeenCalledWith(
    123,
    Buffer.from("file"),
    { caption: "a.txt" },
    { filename: "a.txt", contentType: "text/plain" }
  );
  expect(sendVoiceResponse.mock.invocationCallOrder[0]).toBeLessThan(
    bot.sendDocument.mock.invocationCallOrder[0]
  );
});
test("formats nonstreaming completion and relays approval requests unchanged", async () => {
  const requestToolApproval = jest.fn(async () => ({ approved: true }));
  const transport = createTelegramTransport({ bot, log() {} }, 123, {
    requestToolApproval,
  });
  await transport.start();
  expect(
    await transport.requestToolApproval({ requestId: "a", skillName: "write" })
  ).toEqual({ approved: true });
  await transport.complete({ text: "**hello**", sources: [] });
  expect(bot.sendMessage).toHaveBeenCalledWith(123, "<b>hello</b>", {
    parse_mode: "HTML",
  });
  expect(requestToolApproval).toHaveBeenCalledWith({
    requestId: "a",
    skillName: "write",
  });
});
test("uses the final agent text when it differs from streamed text", async () => {
  const transport = createTelegramTransport({ bot, log() {} }, 123);
  await transport.append("draft");
  await transport.complete({ text: "final answer", agent: true });
  expect(bot.editMessageText).toHaveBeenLastCalledWith(
    "final answer",
    expect.objectContaining({ parse_mode: "HTML" })
  );
});
test("preserves all text when a final chunk exceeds the message limit", async () => {
  const transport = createTelegramTransport({ bot, log() {} }, 123);
  const text = "a".repeat(9000);
  await transport.append(text);
  await transport.complete({ text });
  const finalMessages = bot.editMessageText.mock.calls
    .filter(([, opts]) => opts.parse_mode === "HTML")
    .map(([text]) => text);
  expect(finalMessages.join("")).toBe(text);
  expect(
    bot.sendMessage.mock.calls.every(([, text]) => text.length <= 4096)
  ).toBe(true);
});
test("completes thought formatting, renders charts before response, and clears timers", async () => {
  jest.useFakeTimers();
  try {
    const transport = createTelegramTransport({ bot, log() {} }, 123);
    await transport.start();
    await transport.status("Checking <source>");
    await jest.advanceTimersByTimeAsync(1500);
    await transport.artifact({
      kind: "chart",
      type: "bar",
      title: "Sales",
      dataset: '[{"name":"Jan","value":3}]',
    });
    await transport.complete({ text: "answer", agent: true });
    expect(
      bot.editMessageText.mock.calls.some(
        ([text]) =>
          text.includes("Agent completed:") && text.includes("&lt;source&gt;")
      )
    ).toBe(true);
    expect(bot.sendPhoto).toHaveBeenCalledWith(
      123,
      Buffer.from("chart"),
      { caption: "Sales" },
      { filename: "chart.png", contentType: "image/png", knownLength: 5 }
    );
    expect(bot.sendPhoto.mock.invocationCallOrder[0]).toBeLessThan(
      bot.sendMessage.mock.invocationCallOrder.at(-1)
    );
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    jest.useRealTimers();
  }
});
test("failure clears typing and edit timers and sends the error message", async () => {
  jest.useFakeTimers();
  try {
    const transport = createTelegramTransport({ bot, log() {} }, 123);
    await transport.start();
    await transport.status("thinking");
    await transport.append("a");
    await transport.append("b");
    await transport.fail("No response generated.");
    expect(bot.sendMessage).toHaveBeenLastCalledWith(
      123,
      "No response generated."
    );
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    jest.useRealTimers();
  }
});
