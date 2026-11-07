/* eslint-env jest */
jest.mock("../../../../../models/workspaceChats", () => ({
  WorkspaceChats: {
    new: jest.fn(),
    upsert: jest.fn(),
  },
}));
jest.mock("../../../../../models/workspaceThread", () => ({
  WorkspaceThread: {
    get: jest.fn(),
    autoRenameThread: jest.fn(),
  },
}));

const { WorkspaceChats } = require("../../../../../models/workspaceChats");
const {
  chatHistory,
} = require("../../../../../utils/agents/aibitat/plugins/chat-history.js");

const flushPromises = () => new Promise(setImmediate);

function makeAibitat(overrides = {}) {
  const messageListeners = [];
  const aibitat = {
    _chats: [],
    _aborted: false,
    trackedChatId: null,
    handlerProps: {},
    _pendingCitations: [],
    _pendingOutputs: [],
    onMessage: (fn) => messageListeners.push(fn),
    onAbort: () => {},
    registerChatId: (id) => {
      aibitat.trackedChatId = Number(id);
    },
    clearTrackedChatId: () => {
      aibitat.trackedChatId = null;
    },
    clearCitations: () => {
      aibitat._pendingCitations = [];
    },
    clearClarifyingQuestionSurveys: () => {
      aibitat._pendingClarifyingQuestionSurveys = [];
    },
    socket: { send: jest.fn() },
    providerInstance: { getCumulativeUsage: () => ({}) },
    ...overrides,
  };
  aibitat.chats = aibitat._chats;
  chatHistory.plugin.call(chatHistory).setup(aibitat);
  return { aibitat, messageListeners };
}

describe("chat-history plugin onMessage error handling", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("pre-registers a workspace chat for a USER message", async () => {
    WorkspaceChats.new.mockResolvedValue({ chat: { id: 42 }, message: null });
    const { aibitat, messageListeners } = makeAibitat({
      handlerProps: {
        invocation: { workspace_id: 7, user_id: 2, thread_id: null },
      },
    });

    await messageListeners[0]({ from: "USER", content: "hello" });

    expect(WorkspaceChats.new).toHaveBeenCalledWith(
      expect.objectContaining({ workspaceId: 7, prompt: "hello" })
    );
    expect(aibitat.trackedChatId).toBe(42);
    expect(aibitat.socket.send).toHaveBeenCalledWith("reportStreamEvent", {
      type: "promptChatId",
      chatId: 42,
    });
  });

  it("does not surface a listener TypeError as an unhandled rejection", async () => {
    // Missing `invocation` makes the parameter access chain throw a TypeError
    // inside the async listener. emit() drops the listener's promise, so this
    // would previously escape as an unhandledRejection and kill the process.
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { messageListeners } = makeAibitat({ handlerProps: {} });
    const unhandled = jest.fn();
    process.on("unhandledRejection", unhandled);

    try {
      messageListeners[0]({ from: "USER", content: "hello" });
      await flushPromises();

      expect(unhandled).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledWith(
        "[chat-history] Failed to pre-register workspace chat:",
        expect.any(TypeError)
      );
    } finally {
      process.off("unhandledRejection", unhandled);
    }
  });

  it("persists the reply and cleans pending state", async () => {
    WorkspaceChats.upsert.mockResolvedValue({
      chat: { id: 42 },
      message: null,
    });
    const { aibitat, messageListeners } = makeAibitat({
      trackedChatId: 42,
      handlerProps: {
        invocation: { workspace_id: 7, user_id: 2, thread_id: 9 },
      },
      _chats: [
        { from: "USER", content: "hello" },
        { from: "agent", content: "hi there" },
      ],
    });

    await messageListeners[1]();

    expect(WorkspaceChats.upsert).toHaveBeenCalledWith(
      42,
      expect.objectContaining({ workspaceId: 7, prompt: "hello", threadId: 9 })
    );
    expect(aibitat.trackedChatId).toBeNull();
  });

  it("logs and contains save failures instead of failing silently", async () => {
    WorkspaceChats.upsert.mockRejectedValue(new Error("db down"));
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { messageListeners } = makeAibitat({
      trackedChatId: 42,
      handlerProps: { invocation: { workspace_id: 7 } },
      _chats: [
        { from: "USER", content: "hello" },
        { from: "agent", content: "hi" },
      ],
    });
    const unhandled = jest.fn();
    process.on("unhandledRejection", unhandled);

    try {
      await messageListeners[1]();
      await flushPromises();

      expect(unhandled).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledWith(
        "[chat-history] Failed to persist chat reply:",
        expect.any(Error)
      );
    } finally {
      process.off("unhandledRejection", unhandled);
    }
  });

  it("skips saving when the session is aborted", async () => {
    const { messageListeners } = makeAibitat({
      _aborted: true,
      trackedChatId: 42,
      handlerProps: { invocation: { workspace_id: 7 } },
      _chats: [
        { from: "USER", content: "hello" },
        { from: "agent", content: "hi" },
      ],
    });

    await messageListeners[1]();

    expect(WorkspaceChats.upsert).not.toHaveBeenCalled();
  });
});
