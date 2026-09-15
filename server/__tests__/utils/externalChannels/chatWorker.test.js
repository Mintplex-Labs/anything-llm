jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn() },
}));
jest.mock("../../../models/workspaceThread", () => ({
  WorkspaceThread: { get: jest.fn() },
}));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { new: jest.fn() },
}));
jest.mock("../../../utils/helpers", () => ({
  resolveProviderConnector: jest.fn(),
  getVectorDbClass: jest.fn(),
}));
jest.mock("../../../utils/helpers/modelPricing", () => ({
  addChatCostToMetrics: (metrics) => metrics,
}));
jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: jest.fn(() => ({ pinnedDocs: async () => [] })),
}));
jest.mock("../../../utils/chats", () => ({
  recentChatHistory: jest.fn(),
  chatPrompt: async () => "system",
  sourceIdentifier: (doc) => doc.id,
}));
jest.mock("../../../utils/helpers/chat", () => ({
  fillSourceWindow: () => ({ contextTexts: [] }),
}));
jest.mock("../../../utils/agents", () => ({
  AgentHandler: { isAgentInvocation: jest.fn() },
}));
jest.mock("../../../utils/agents/ephemeral", () => ({
  EphemeralAgentHandler: jest.fn(),
}));
const { Workspace } = require("../../../models/workspace");
const { WorkspaceThread } = require("../../../models/workspaceThread");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  resolveProviderConnector,
  getVectorDbClass,
} = require("../../../utils/helpers");
const { recentChatHistory } = require("../../../utils/chats");
const { AgentHandler } = require("../../../utils/agents");
const { EphemeralAgentHandler } = require("../../../utils/agents/ephemeral");
const {
  runExternalChannelChat,
} = require("../../../jobs/handle-external-channel-chat");
const payload = {
  conversationId: "channel:conversation",
  workspaceSlug: "general",
  threadSlug: "thread",
  message: "hello",
  attachments: [{ name: "image.png" }],
};
let events, connector;
beforeEach(() => {
  jest.clearAllMocks();
  events = [];
  Workspace.get.mockResolvedValue({ id: 1, slug: "general", chatMode: "chat" });
  WorkspaceThread.get.mockResolvedValue({ id: 2 });
  recentChatHistory.mockResolvedValue({ rawHistory: [], chatHistory: [] });
  AgentHandler.isAgentInvocation.mockResolvedValue(false);
  getVectorDbClass.mockReturnValue({ namespaceCount: async () => 0 });
  connector = {
    streamingEnabled: () => false,
    promptWindowLimit: () => 1000,
    compressMessages: jest.fn(async () => []),
    getChatCompletion: async () => ({
      textResponse: "hello world",
      metrics: { tokens: 3 },
    }),
  };
  resolveProviderConnector.mockResolvedValue({ connector });
});
test("nonstreaming completion persists once with thread, metrics, attachments and emits complete", async () => {
  await runExternalChannelChat(payload, (event) => events.push(event));
  expect(WorkspaceChats.new).toHaveBeenCalledTimes(1);
  expect(WorkspaceChats.new).toHaveBeenCalledWith({
    workspaceId: 1,
    prompt: "hello",
    threadId: 2,
    response: {
      text: "hello world",
      sources: [],
      type: "chat",
      metrics: { tokens: 3 },
      attachments: [{ name: "image.png" }],
    },
  });
  expect(events.map((event) => event.type)).toEqual(["ready", "complete"]);
  expect(events[1].result.text).toBe("hello world");
});
test("streaming forwards tokens and persists only the final response", async () => {
  connector.streamingEnabled = () => true;
  connector.streamGetChatCompletion = async () => ({ metrics: { tokens: 4 } });
  connector.handleStream = async (handler) => {
    handler.write('data: {"textResponse":"hello"}\n\n');
    handler.write('data: {"close":true}\n\n');
    return "hello";
  };
  await runExternalChannelChat(payload, (event) => events.push(event));
  expect(events.map((event) => event.type)).toEqual([
    "ready",
    "textChunk",
    "complete",
  ]);
  expect(WorkspaceChats.new).toHaveBeenCalledTimes(1);
});
test("missing workspace and empty completion never persist", async () => {
  Workspace.get.mockResolvedValue(null);
  await runExternalChannelChat(payload, (event) => events.push(event));
  expect(events[0]).toMatchObject({
    type: "failed",
    message: "No workspace configured. Use /switch to select one.",
  });
  expect(WorkspaceChats.new).not.toHaveBeenCalled();
});
test("agent emits status, artifacts and approvals and persists streamed fallback once", async () => {
  AgentHandler.isAgentInvocation.mockResolvedValue(true);
  let options;
  const approval = jest.fn(async () => ({ approved: true }));
  const agent = {
    aibitat: { _pendingOutputs: [{ type: "file", payload: "a" }] },
    init: async function () {
      return this;
    },
    createAIbitat: async (args) => {
      options = args;
    },
    startAgentCluster: async () => {
      options.handler.send(
        JSON.stringify({ type: "statusResponse", content: "thinking" })
      );
      options.handler.send(
        JSON.stringify({
          type: "fileDownloadCard",
          content: { filename: "a.txt" },
        })
      );
      options.handler.send(
        JSON.stringify({
          type: "reportStreamEvent",
          content: { type: "textResponseChunk", content: "answer" },
        })
      );
      await options.requestToolApproval({ skillName: "write" });
      options.handler.close();
    },
  };
  EphemeralAgentHandler.mockImplementation(() => agent);
  await runExternalChannelChat(payload, (event) => events.push(event), {
    requestToolApproval: approval,
  });
  expect(approval).toHaveBeenCalledWith({ skillName: "write" });
  expect(events.map((event) => event.type)).toEqual([
    "ready",
    "status",
    "textChunk",
    "closeInvocation",
    "artifact",
    "complete",
  ]);
  expect(WorkspaceChats.new).toHaveBeenCalledTimes(1);
  expect(WorkspaceChats.new.mock.calls[0][0].response).toMatchObject({
    text: "answer",
    outputs: [{ type: "file", payload: "a" }],
  });
});
test("approval IPC correlates responses and removes listeners after response or timeout", async () => {
  jest.useFakeTimers();
  const { EventEmitter } = require("events");
  const {
    createApprovalRequester,
  } = require("../../../jobs/handle-external-channel-chat");
  const ipc = new EventEmitter();
  const sent = [];
  const request = createApprovalRequester((event) => sent.push(event), ipc);
  const approval = request({ skillName: "write" });
  await Promise.resolve();
  ipc.emit("message", {
    type: "toolApprovalResponse",
    requestId: "other",
    approved: true,
  });
  expect(ipc.listenerCount("message")).toBe(1);
  ipc.emit("message", {
    type: "toolApprovalResponse",
    requestId: sent[0].requestId,
    approved: false,
  });
  expect((await approval).approved).toBe(false);
  expect(ipc.listenerCount("message")).toBe(0);
  const expired = request({ skillName: "write" });
  await Promise.resolve();
  jest.advanceTimersByTime(120000);
  expect((await expired).approved).toBe(false);
  expect(ipc.listenerCount("message")).toBe(0);
  jest.useRealTimers();
});
test("provider setup failures preserve the Telegram generic error and never persist", async () => {
  resolveProviderConnector.mockRejectedValue(
    new Error("provider configuration detail")
  );
  await runExternalChannelChat(payload, (event) => events.push(event));
  expect(events.at(-1)).toMatchObject({
    type: "failed",
    message: "Sorry, something went wrong. Please try again.",
  });
  expect(WorkspaceChats.new).not.toHaveBeenCalled();
});
test("generation failures preserve the Telegram streaming error and never persist", async () => {
  connector.getChatCompletion = async () => {
    throw new Error("provider failed");
  };
  await runExternalChannelChat(payload, (event) => events.push(event));
  expect(events.at(-1)).toMatchObject({
    type: "failed",
    message: "An error occurred while streaming the response.",
  });
  expect(WorkspaceChats.new).not.toHaveBeenCalled();
});
