const mockMultiUserMode = jest.fn();
const mockReqBody = jest.fn();
const mockUserFromSession = jest.fn();
const mockStreamChatWithWorkspace = jest.fn();
const mockWriteResponseChunk = jest.fn();
const mockApplyRuntimeSelectionToWorkspace = jest.fn();

jest.mock("../../utils/http", () => ({
  reqBody: mockReqBody,
  userFromSession: mockUserFromSession,
  multiUserMode: mockMultiUserMode,
}));

jest.mock("../../utils/chats/stream", () => ({
  streamChatWithWorkspace: mockStreamChatWithWorkspace,
}));

jest.mock("../../utils/helpers/chat/responses", () => ({
  writeResponseChunk: mockWriteResponseChunk,
}));

jest.mock("../../utils/swarmsy/runtimeSelection", () => ({
  applyRuntimeSelectionToWorkspace: mockApplyRuntimeSelectionToWorkspace,
}));

jest.mock("../../utils/middleware/validatedRequest", () => ({
  validatedRequest: jest.fn(),
}));

jest.mock("../../utils/middleware/multiUserProtected", () => ({
  ROLES: { all: "<all>" },
  flexUserRoleValid: jest.fn(() => jest.fn()),
}));

jest.mock("../../utils/middleware/validWorkspace", () => ({
  validWorkspaceSlug: jest.fn(),
  validWorkspaceAndThreadSlug: jest.fn(),
}));

jest.mock("../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn().mockResolvedValue(null) },
}));

jest.mock("../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn().mockResolvedValue(null) },
}));

jest.mock("../../models/workspaceThread", () => ({
  WorkspaceThread: {
    autoRenameThread: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock("../../models/user", () => ({
  User: { canSendChat: jest.fn().mockResolvedValue(true) },
}));

jest.mock("../../endpoints/utils", () => ({
  getModelTag: jest.fn().mockReturnValue("ollama/llama3.1:8b"),
}));

const { chatEndpoints } = require("../../endpoints/chat");
const { Telemetry } = require("../../models/telemetry");

function buildResponse({ isMultiUser = false, workspace = null } = {}) {
  const res = {
    locals: { multiUserMode: isMultiUser, workspace: workspace || {} },
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    end: jest.fn(),
  };
  return res;
}

function buildRequest() {
  return {};
}

describe("chat endpoint runtime gating", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStreamChatWithWorkspace.mockResolvedValue(null);
  });

  describe("workspace stream-chat", () => {
    it("does not apply runtime override in multi-user mode", async () => {
      const workspace = {
        id: 1,
        slug: "test-hive",
        chatProvider: "openai",
        chatModel: "gpt-4o-mini",
        chatMode: "chat",
      };
      const response = buildResponse({ isMultiUser: true, workspace });
      const runtime = { provider: "ollama", mode: "local_user", model: "llama3.1:8b" };

      mockMultiUserMode.mockReturnValue(true);
      mockUserFromSession.mockResolvedValue({ id: 42 });
      mockReqBody.mockReturnValue({
        message: "hello",
        attachments: [],
        runtime,
      });

      // Register the routes
      const routeHandlers = {};
      const app = {
        post: jest.fn((path, _mw, handler) => {
          routeHandlers[path] = handler;
        }),
      };
      chatEndpoints(app);

      await routeHandlers["/workspace/:slug/stream-chat"](
        buildRequest(),
        response
      );

      // applyRuntimeSelectionToWorkspace must NOT be called in multi-user mode
      expect(mockApplyRuntimeSelectionToWorkspace).not.toHaveBeenCalled();
      // chat must proceed with the original workspace (not overridden)
      expect(mockStreamChatWithWorkspace).toHaveBeenCalledWith(
        response,
        workspace,
        "hello",
        workspace.chatMode,
        { id: 42 },
        null,
        []
      );
      expect(Telemetry.sendTelemetry).toHaveBeenCalledWith(
        "sent_chat",
        expect.objectContaining({
          LLMSelection: workspace.chatProvider,
          LLMModel: workspace.chatModel,
        })
      );
    });

    it("applies runtime override in single-user mode", async () => {
      const workspace = {
        id: 1,
        slug: "test-hive",
        chatProvider: "openai",
        chatModel: "gpt-4o-mini",
        chatMode: "chat",
      };
      const runtimeWorkspace = {
        ...workspace,
        chatProvider: "ollama",
        chatModel: "llama3.1:8b",
      };
      const response = buildResponse({ isMultiUser: false, workspace });
      const runtime = { provider: "ollama", mode: "local_user", model: "llama3.1:8b" };

      mockMultiUserMode.mockReturnValue(false);
      mockUserFromSession.mockResolvedValue({ id: 42 });
      mockReqBody.mockReturnValue({
        message: "hello",
        attachments: [],
        runtime,
      });
      mockApplyRuntimeSelectionToWorkspace.mockReturnValue({
        workspace: runtimeWorkspace,
        runtimeSelection: { provider: "ollama", mode: "local_user", model: "llama3.1:8b" },
      });

      const routeHandlers = {};
      const app = {
        post: jest.fn((path, _mw, handler) => {
          routeHandlers[path] = handler;
        }),
      };
      chatEndpoints(app);

      await routeHandlers["/workspace/:slug/stream-chat"](
        buildRequest(),
        response
      );

      expect(mockApplyRuntimeSelectionToWorkspace).toHaveBeenCalledWith(
        workspace,
        runtime
      );
      expect(mockStreamChatWithWorkspace).toHaveBeenCalledWith(
        response,
        runtimeWorkspace,
        "hello",
        runtimeWorkspace.chatMode,
        { id: 42 },
        null,
        []
      );
      expect(Telemetry.sendTelemetry).toHaveBeenCalledWith(
        "sent_chat",
        expect.objectContaining({
          LLMSelection: runtimeWorkspace.chatProvider,
          LLMModel: runtimeWorkspace.chatModel,
        })
      );
    });
  });

  describe("thread stream-chat", () => {
    it("does not apply runtime override in multi-user mode", async () => {
      const workspace = {
        id: 1,
        slug: "test-hive",
        chatProvider: "openai",
        chatModel: "gpt-4o-mini",
        chatMode: "chat",
      };
      const thread = { id: 10, name: "thread-1" };
      const response = buildResponse({ isMultiUser: true, workspace });
      response.locals.thread = thread;
      const runtime = { provider: "ollama", mode: "local_user", model: "llama3.1:8b" };

      mockMultiUserMode.mockReturnValue(true);
      mockUserFromSession.mockResolvedValue({ id: 42 });
      mockReqBody.mockReturnValue({
        message: "hello",
        attachments: [],
        runtime,
      });

      const routeHandlers = {};
      const app = {
        post: jest.fn((path, _mw, handler) => {
          routeHandlers[path] = handler;
        }),
      };
      chatEndpoints(app);

      await routeHandlers["/workspace/:slug/thread/:threadSlug/stream-chat"](
        buildRequest(),
        response
      );

      expect(mockApplyRuntimeSelectionToWorkspace).not.toHaveBeenCalled();
      // Workspace provider/model must be unchanged (original workspace passed)
      expect(mockStreamChatWithWorkspace).toHaveBeenCalledWith(
        response,
        workspace,
        "hello",
        workspace.chatMode,
        { id: 42 },
        thread,
        []
      );
      expect(Telemetry.sendTelemetry).toHaveBeenCalledWith(
        "sent_chat",
        expect.objectContaining({
          LLMSelection: workspace.chatProvider,
          LLMModel: workspace.chatModel,
        })
      );
    });

    it("applies runtime override in single-user mode", async () => {
      const workspace = {
        id: 1,
        slug: "test-hive",
        chatProvider: "openai",
        chatModel: "gpt-4o-mini",
        chatMode: "chat",
      };
      const runtimeWorkspace = {
        ...workspace,
        chatProvider: "ollama",
        chatModel: "llama3.1:8b",
      };
      const thread = { id: 10, name: "thread-1" };
      const response = buildResponse({ isMultiUser: false, workspace });
      response.locals.thread = thread;
      const runtime = { provider: "ollama", mode: "local_user", model: "llama3.1:8b" };

      mockMultiUserMode.mockReturnValue(false);
      mockUserFromSession.mockResolvedValue({ id: 42 });
      mockReqBody.mockReturnValue({
        message: "hello",
        attachments: [],
        runtime,
      });
      mockApplyRuntimeSelectionToWorkspace.mockReturnValue({
        workspace: runtimeWorkspace,
        runtimeSelection: { provider: "ollama", mode: "local_user", model: "llama3.1:8b" },
      });

      const routeHandlers = {};
      const app = {
        post: jest.fn((path, _mw, handler) => {
          routeHandlers[path] = handler;
        }),
      };
      chatEndpoints(app);

      await routeHandlers["/workspace/:slug/thread/:threadSlug/stream-chat"](
        buildRequest(),
        response
      );

      expect(mockApplyRuntimeSelectionToWorkspace).toHaveBeenCalledWith(
        workspace,
        runtime
      );
      expect(mockStreamChatWithWorkspace).toHaveBeenCalledWith(
        response,
        runtimeWorkspace,
        "hello",
        runtimeWorkspace.chatMode,
        { id: 42 },
        thread,
        []
      );
      expect(Telemetry.sendTelemetry).toHaveBeenCalledWith(
        "sent_chat",
        expect.objectContaining({
          LLMSelection: runtimeWorkspace.chatProvider,
          LLMModel: runtimeWorkspace.chatModel,
        })
      );
    });
  });
});
