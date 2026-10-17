/* eslint-env jest, node */

jest.mock("../../../../../utils/agents/aibitat/providers", () => ({}));
jest.mock("../../../../../utils/helpers", () => ({}));
jest.mock("../../../../../utils/agents/aibitat/utils/toolReranker", () => ({}));
jest.mock("../../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../../../models/workspaceChats", () => ({
  WorkspaceChats: { new: jest.fn(), upsert: jest.fn() },
}));
jest.mock("../../../../../models/workspaceThread", () => ({
  WorkspaceThread: {},
}));
jest.mock("../../../../../models/user", () => ({
  User: { releaseChatQuotaReservation: jest.fn() },
}));

const AIbitat = require("../../../../../utils/agents/aibitat");
const {
  chatHistory,
} = require("../../../../../utils/agents/aibitat/plugins/chat-history");
const { WorkspaceChats } = require("../../../../../models/workspaceChats");
const { User } = require("../../../../../models/user");

function setup() {
  const agent = new AIbitat({ provider: "openai", model: "unused" });
  agent.handlerProps = {
    invocation: {
      workspace_id: 1,
      user_id: 2,
      quota_reservation_id: "initial",
    },
  };
  agent.chat = jest.fn().mockResolvedValue();
  chatHistory.plugin().setup(agent);
  return agent;
}

beforeEach(() => {
  jest.resetAllMocks();
  User.releaseChatQuotaReservation.mockResolvedValue();
});

test.each(["start", "continue"])(
  "%s waits for durable usage before the model and reservation release",
  async (operation) => {
    let save;
    WorkspaceChats.new.mockImplementation(
      () =>
        new Promise((resolve) => {
          save = resolve;
        })
    );
    const agent = setup();
    if (operation === "continue") {
      agent._chats.push({ from: "USER", to: "agent", state: "interrupt" });
      agent._chatQuotaReservationId = "followup";
    }
    const running =
      operation === "start"
        ? agent.start({ from: "USER", to: "agent", content: "hello" })
        : agent.continue("hello");
    expect(agent.chat).not.toHaveBeenCalled();
    expect(User.releaseChatQuotaReservation).not.toHaveBeenCalled();
    save({ chat: { id: 123 } });
    await running;
    expect(agent.trackedChatId).toBe(123);
    expect(agent.chat).toHaveBeenCalledTimes(1);
    expect(User.releaseChatQuotaReservation).toHaveBeenCalledWith(
      operation === "start" ? "initial" : "followup"
    );
    expect(WorkspaceChats.new).toHaveBeenCalledWith(
      expect.objectContaining({ include: false, user: { id: 2 } })
    );
  }
);

test("does not run an unaccounted model request if chat persistence fails", async () => {
  WorkspaceChats.new.mockResolvedValue({
    chat: null,
    message: "database unavailable",
  });
  const agent = setup();
  await expect(
    agent.start({ from: "USER", to: "agent", content: "hello" })
  ).rejects.toThrow("Could not record chat usage");
  expect(agent.chat).not.toHaveBeenCalled();
  expect(User.releaseChatQuotaReservation).not.toHaveBeenCalled();
});
