/* eslint-env jest, node */
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: {
    new: jest.fn(),
    markThreadHistoryInvalidV2: jest.fn(),
  },
}));
jest.mock("../../../models/telemetry", () => ({
  Telemetry: {
    sendTelemetry: jest.fn(),
  },
}));
jest.mock("../../../utils/chats/index", () => ({
  chatPrompt: jest.fn(),
  sourceIdentifier: jest.fn(),
  recentChatHistory: jest.fn(),
  grepAllSlashCommands: jest.fn(async (message) => message),
}));
jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  getLLMProvider: jest.fn(),
}));
jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: jest.fn(),
}));
jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(),
}));
jest.mock("../../../utils/files", () => ({
  hotdirPath: "/tmp/anything-llm-test-hotdir",
  normalizePath: jest.fn((filePath) => filePath),
  isWithin: jest.fn(() => true),
  sanitizeFileName: jest.fn((filename) => filename),
}));
jest.mock("../../../utils/agents/ephemeral", () => {
  const waitForClose = jest.fn();
  const streamAgentEvents = jest.fn();
  const EphemeralAgentHandler = jest.fn().mockImplementation(function (args) {
    this.args = args;
    this.init = jest.fn().mockResolvedValue();
    this.createAIbitat = jest.fn().mockResolvedValue();
    this.startAgentCluster = jest.fn();
  });
  EphemeralAgentHandler.isAgentInvocation = jest.fn();

  const EphemeralEventListener = jest.fn().mockImplementation(function () {
    this.waitForClose = waitForClose;
    this.streamAgentEvents = streamAgentEvents;
  });

  return {
    EphemeralAgentHandler,
    EphemeralEventListener,
    __mocks: {
      waitForClose,
      streamAgentEvents,
    },
  };
});

const { ApiChatHandler } = require("../../../utils/chats/apiChatHandler");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  EphemeralAgentHandler,
  __mocks: ephemeralMocks,
} = require("../../../utils/agents/ephemeral");

describe("ApiChatHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    EphemeralAgentHandler.isAgentInvocation.mockResolvedValue(true);
    WorkspaceChats.new.mockResolvedValue({ chat: { id: 123 } });
    ephemeralMocks.waitForClose.mockResolvedValue({
      thoughts: ["Look up the requested data"],
      textResponse: "Agent result",
    });
  });

  describe("chatSync", () => {
    test("persists agent chats to the target API thread history", async () => {
      const workspace = { id: 1, slug: "workspace", chatMode: "chat" };
      const user = { id: 2 };
      const thread = { id: 3 };
      const attachments = [
        {
          name: "image.png",
          mime: "image/png",
          contentString: "data:image/png;base64,abc123",
        },
      ];

      const result = await ApiChatHandler.chatSync({
        workspace,
        message: "@agent summarize this",
        mode: "chat",
        user,
        thread,
        sessionId: "external-session",
        attachments,
      });

      expect(EphemeralAgentHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          workspace,
          prompt: "@agent summarize this",
          userId: user.id,
          threadId: thread.id,
          sessionId: "external-session",
          attachments,
        })
      );
      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceId: workspace.id,
          prompt: "@agent summarize this",
          include: true,
          threadId: thread.id,
          apiSessionId: "external-session",
          user,
          response: expect.objectContaining({
            text: "Agent result",
            attachments,
            type: "chat",
            thoughts: ["Look up the requested data"],
          }),
        })
      );
      expect(result).toEqual(
        expect.objectContaining({
          chatId: 123,
          textResponse: "Agent result",
          thoughts: ["Look up the requested data"],
        })
      );
    });
  });
});
