// `utils/http` reaches the auth stack on require; this suite exercises none of it.
jest.mock("jsonwebtoken", () => ({}));

jest.mock("../../../../models/workspace", () => ({
  Workspace: { get: jest.fn() },
}));
jest.mock("../../../../models/workspaceThread", () => ({
  WorkspaceThread: { get: jest.fn() },
}));
jest.mock("../../../../models/workspaceChats", () => ({ WorkspaceChats: {} }));
jest.mock("../../../../models/user", () => ({ User: { get: jest.fn() } }));
jest.mock("../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../../../utils/middleware/validApiKey", () => ({
  validApiKey: jest.fn(),
}));
jest.mock("../../../../utils/chats/stream", () => ({
  VALID_CHAT_MODE: ["chat", "query"],
}));
jest.mock("../../../../utils/chats/apiChatHandler", () => ({
  ApiChatHandler: { streamChat: jest.fn() },
}));
jest.mock("../../../../endpoints/utils", () => ({ getModelTag: () => "test" }));

// Modules in this import chain resolve storage paths at require time.
process.env.STORAGE_DIR = process.env.STORAGE_DIR || require("os").tmpdir();

const { Workspace } = require("../../../../models/workspace");
const { WorkspaceThread } = require("../../../../models/workspaceThread");
const { ApiChatHandler } = require("../../../../utils/chats/apiChatHandler");
const {
  apiWorkspaceThreadEndpoints,
} = require("../../../../endpoints/api/workspaceThread/index");

const ROUTE = "/v1/workspace/:slug/thread/:threadSlug/stream-chat";

function captureHandler() {
  const handlers = {};
  apiWorkspaceThreadEndpoints({
    post: (path, _middleware, handler) => {
      handlers[path] = handler;
    },
    get: () => {},
    delete: () => {},
  });
  return handlers[ROUTE];
}

// Records every call in order so a test can check what reached the client
// before the status was set.
function mockResponse() {
  const events = [];
  return {
    events,
    status: jest.fn(function (code) {
      events.push(["status", code]);
      return this;
    }),
    json: jest.fn(function (body) {
      events.push(["json", body]);
      return this;
    }),
    write: jest.fn(function (chunk) {
      events.push(["write", chunk]);
      return true;
    }),
    setHeader: jest.fn(function (name) {
      events.push(["setHeader", name]);
      return this;
    }),
    flushHeaders: jest.fn(function () {
      events.push(["flushHeaders"]);
    }),
    end: jest.fn(function () {
      events.push(["end"]);
      return this;
    }),
  };
}

const abortChunk = (error) => ({
  id: expect.any(String),
  type: "abort",
  textResponse: null,
  sources: [],
  close: true,
  error,
});

describe("POST /v1/workspace/:slug/thread/:threadSlug/stream-chat", () => {
  let handler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = captureHandler();
  });

  it("answers a missing workspace with the sync chat route's 404 abort chunk and never looks up the thread", async () => {
    Workspace.get.mockResolvedValue(null);
    WorkspaceThread.get.mockResolvedValue(null);
    const response = mockResponse();

    await handler(
      {
        params: { slug: "missing", threadSlug: "thread-a" },
        body: { message: "hello" },
      },
      response
    );

    expect(Workspace.get).toHaveBeenCalledWith({ slug: "missing" });
    expect(WorkspaceThread.get).not.toHaveBeenCalled();
    expect(ApiChatHandler.streamChat).not.toHaveBeenCalled();
    expect(response.events[0]).toEqual(["status", 404]);
    expect(response.write).not.toHaveBeenCalled();
    expect(response.flushHeaders).not.toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith(
      abortChunk("Workspace missing not found.")
    );
  });

  it("answers a missing thread on an existing workspace with the sync chat route's 404 abort chunk", async () => {
    Workspace.get.mockResolvedValue({ id: 7, slug: "ws", chatMode: "chat" });
    WorkspaceThread.get.mockResolvedValue(null);
    const response = mockResponse();

    await handler(
      {
        params: { slug: "ws", threadSlug: "thread-b" },
        body: { message: "hello" },
      },
      response
    );

    expect(WorkspaceThread.get).toHaveBeenCalledTimes(1);
    expect(WorkspaceThread.get).toHaveBeenCalledWith({
      slug: "thread-b",
      workspace_id: 7,
    });
    expect(ApiChatHandler.streamChat).not.toHaveBeenCalled();
    expect(response.events[0]).toEqual(["status", 404]);
    expect(response.write).not.toHaveBeenCalled();
    expect(response.flushHeaders).not.toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith(
      abortChunk("Thread thread-b not found.")
    );
  });
});
