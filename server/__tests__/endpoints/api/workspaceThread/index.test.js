/* eslint-env jest, node */

jest.mock("../../../../models/workspaceThread", () => ({
  WorkspaceThread: { get: jest.fn(), autoRenameThread: jest.fn() },
}));
jest.mock("../../../../models/workspace", () => ({
  Workspace: { get: jest.fn() },
}));
jest.mock("../../../../utils/middleware/validApiKey", () => ({
  validApiKey: (_request, _response, next) => next(),
}));
jest.mock("../../../../utils/http", () => ({
  reqBody: (request) => request.body,
  multiUserMode: () => false,
}));
jest.mock("../../../../utils/chats/stream", () => ({
  VALID_CHAT_MODE: ["chat", "query", "automatic"],
}));
jest.mock("../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../../../utils/helpers/chat/responses", () => ({
  writeResponseChunk: jest.fn(),
  convertToChatHistory: jest.fn(),
}));
jest.mock("../../../../models/workspaceChats", () => ({
  WorkspaceChats: {},
}));
jest.mock("../../../../models/user", () => ({
  User: { get: jest.fn() },
}));
jest.mock("../../../../utils/chats/apiChatHandler", () => ({
  ApiChatHandler: { chatSync: jest.fn(), streamChat: jest.fn() },
}));
jest.mock("../../../../endpoints/utils", () => ({
  getModelTag: () => "test",
}));

const { WorkspaceThread } = require("../../../../models/workspaceThread");
const { Workspace } = require("../../../../models/workspace");
const { ApiChatHandler } = require("../../../../utils/chats/apiChatHandler");
const {
  apiWorkspaceThreadEndpoints,
} = require("../../../../endpoints/api/workspaceThread");

// Collect the route handlers so each can be driven directly, without express.
const routes = {};
apiWorkspaceThreadEndpoints({
  get: (path, _middleware, handler) => (routes[`GET ${path}`] = handler),
  post: (path, _middleware, handler) => (routes[`POST ${path}`] = handler),
  delete: (path, _middleware, handler) => (routes[`DELETE ${path}`] = handler),
});

describe("thread chat endpoints auto-name the thread on its first message", () => {
  const workspace = { id: 7, slug: "my-ws", chatMode: "chat" };
  const thread = { id: 42, slug: "thread-b", name: "Thread" };

  function mockResponse() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      flushHeaders: jest.fn(),
      end: jest.fn(),
    };
  }

  function request(body = { message: "hi" }) {
    return { params: { slug: "my-ws", threadSlug: "thread-b" }, body };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    Workspace.get.mockResolvedValue(workspace);
    WorkspaceThread.get.mockResolvedValue(thread);
    ApiChatHandler.chatSync.mockResolvedValue({ textResponse: "hello" });
    ApiChatHandler.streamChat.mockResolvedValue(undefined);
  });

  it("renames after a /chat message has been handled", async () => {
    const response = mockResponse();
    await routes["POST /v1/workspace/:slug/thread/:threadSlug/chat"](
      request(),
      response
    );

    expect(WorkspaceThread.autoRenameThread).toHaveBeenCalledWith({
      thread,
      workspace,
      user: null,
      prompt: "hi",
    });
    expect(
      WorkspaceThread.autoRenameThread.mock.invocationCallOrder[0]
    ).toBeGreaterThan(ApiChatHandler.chatSync.mock.invocationCallOrder[0]);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("renames after a /stream-chat message has been handled", async () => {
    const response = mockResponse();
    await routes["POST /v1/workspace/:slug/thread/:threadSlug/stream-chat"](
      request(),
      response
    );

    expect(WorkspaceThread.autoRenameThread).toHaveBeenCalledWith({
      thread,
      workspace,
      user: null,
      prompt: "hi",
    });
    expect(
      WorkspaceThread.autoRenameThread.mock.invocationCallOrder[0]
    ).toBeGreaterThan(ApiChatHandler.streamChat.mock.invocationCallOrder[0]);
    expect(response.end).toHaveBeenCalled();
  });

  it("does not rename when the message is rejected before being handled", async () => {
    const response = mockResponse();
    await routes["POST /v1/workspace/:slug/thread/:threadSlug/chat"](
      request({ message: "" }),
      response
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(ApiChatHandler.chatSync).not.toHaveBeenCalled();
    expect(WorkspaceThread.autoRenameThread).not.toHaveBeenCalled();
  });
});
