jest.mock("../../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../../../utils/helpers/agents", () => ({
  skillIsAutoApproved: jest.fn(() => false),
}));
jest.mock("../../../../../models/agentSkillWhitelist", () => ({
  AgentSkillWhitelist: { isWhitelisted: jest.fn(async () => false) },
}));
const {
  httpSocket,
} = require("../../../../../utils/agents/aibitat/plugins/http-socket");
const { skillIsAutoApproved } = require("../../../../../utils/helpers/agents");
function setup(options = {}) {
  const agent = { onError() {}, onMessage() {}, onTerminate() {} };
  httpSocket
    .plugin({ handler: { send() {}, close() {} }, ...options })
    .setup(agent);
  return agent;
}
afterEach(() => jest.restoreAllMocks());
test("uses a channel callback after the normal auto-approval checks", async () => {
  const callback = jest.fn(async () => ({
    approved: true,
    message: "approved",
  }));
  const agent = setup({ requestToolApproval: callback });
  expect(
    await agent.requestToolApproval({
      skillName: "write",
      payload: { text: "a" },
    })
  ).toEqual({ approved: true, message: "approved" });
  expect(callback).toHaveBeenCalledWith({
    skillName: "write",
    payload: { text: "a" },
    description: null,
  });
  skillIsAutoApproved.mockReturnValueOnce(true);
  expect(
    (await agent.requestToolApproval({ skillName: "read" })).approved
  ).toBe(true);
  expect(callback).toHaveBeenCalledTimes(1);
});
test("preserves Telegram IPC fallback and removes its response listener", async () => {
  const previous = process.send;
  const sent = [];
  process.send = (message) => sent.push(message);
  const before = process.listenerCount("message");
  try {
    const agent = setup({ telegramChatId: 123 });
    const approval = agent.requestToolApproval({ skillName: "write" });
    await new Promise((resolve) => setImmediate(resolve));
    expect(sent[0]).toMatchObject({
      type: "toolApprovalRequest",
      chatId: 123,
      skillName: "write",
    });
    process.emit("message", {
      type: "toolApprovalResponse",
      requestId: sent[0].requestId,
      approved: true,
    });
    expect((await approval).approved).toBe(true);
    expect(process.listenerCount("message")).toBe(before);
  } finally {
    process.send = previous;
  }
});
