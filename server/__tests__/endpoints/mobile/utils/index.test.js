jest.mock("../../../../utils/prisma", () => ({
  workspace_threads: { findFirst: jest.fn() },
}));
jest.mock("../../../../models/workspaceChats", () => ({
  WorkspaceChats: { markThreadHistoryInvalidV2: jest.fn() },
}));
jest.mock("../../../../models/workspace", () => ({
  Workspace: { get: jest.fn(), getWithUser: jest.fn() },
}));
jest.mock("../../../../models/workspaceThread", () => ({
  WorkspaceThread: { autoRenameThread: jest.fn() },
}));
jest.mock("../../../../models/mobileDevice", () => ({ MobileDevice: {} }));
jest.mock("../../../../utils/chats/apiChatHandler", () => ({
  ApiChatHandler: { streamChat: jest.fn() },
}));
jest.mock("../../../../endpoints/utils", () => ({ getModelTag: () => "test" }));

const prisma = require("../../../../utils/prisma");
const { WorkspaceChats } = require("../../../../models/workspaceChats");
const { Workspace } = require("../../../../models/workspace");
const { ApiChatHandler } = require("../../../../utils/chats/apiChatHandler");
const {
  handleMobileCommand,
} = require("../../../../endpoints/mobile/utils/index");

describe("handleMobileCommand: reset-chat", () => {
  const workspace = { id: 7, slug: "my-ws" };

  function mockResponse() {
    return {
      locals: { user: null },
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    Workspace.get.mockResolvedValue(workspace);
  });

  it("scopes the reset to the thread named by threadSlug", async () => {
    prisma.workspace_threads.findFirst.mockResolvedValue({ id: 42 });
    const response = mockResponse();

    await handleMobileCommand(
      {
        params: { command: "reset-chat" },
        body: { workspaceSlug: "my-ws", threadSlug: "thread-b" },
      },
      response
    );

    expect(WorkspaceChats.markThreadHistoryInvalidV2).toHaveBeenCalledWith({
      workspaceId: 7,
      thread_id: 42,
    });
  });

  it("rejects an unknown threadSlug instead of resetting the default thread", async () => {
    prisma.workspace_threads.findFirst.mockResolvedValue(null);
    const response = mockResponse();

    await handleMobileCommand(
      {
        params: { command: "reset-chat" },
        body: { workspaceSlug: "my-ws", threadSlug: "gone" },
      },
      response
    );

    // A stale slug must never fall through to the default thread - that
    // silently wipes history the user never asked to clear.
    expect(WorkspaceChats.markThreadHistoryInvalidV2).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "Thread not found" });
  });

  it("resets the default thread when no threadSlug is given", async () => {
    const response = mockResponse();

    await handleMobileCommand(
      {
        params: { command: "reset-chat" },
        body: { workspaceSlug: "my-ws" },
      },
      response
    );

    expect(prisma.workspace_threads.findFirst).not.toHaveBeenCalled();
    expect(WorkspaceChats.markThreadHistoryInvalidV2).toHaveBeenCalledWith({
      workspaceId: 7,
      thread_id: null,
    });
  });
});

describe("handleMobileCommand: stream-chat", () => {
  const workspace = { id: 7, slug: "my-ws" };

  beforeEach(() => {
    jest.clearAllMocks();
    Workspace.get.mockResolvedValue(workspace);
  });

  it("rejects an unknown threadSlug instead of chatting in the default thread", async () => {
    prisma.workspace_threads.findFirst.mockResolvedValue(null);
    const response = {
      locals: { user: null },
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      flushHeaders: jest.fn(),
    };

    await handleMobileCommand(
      {
        params: { command: "stream-chat" },
        body: { workspaceSlug: "my-ws", threadSlug: "gone", message: "hi" },
      },
      response
    );

    expect(response.flushHeaders).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "Thread not found" });
  });

  function streamResponse(user = null) {
    return {
      locals: { user },
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      flushHeaders: jest.fn(),
      end: jest.fn(),
    };
  }

  function streamChat(body, response) {
    return handleMobileCommand(
      { params: { command: "stream-chat" }, body },
      response
    );
  }

  it("chats in the workspace's configured mode", async () => {
    Workspace.get.mockResolvedValue({ ...workspace, chatMode: "automatic" });
    const response = streamResponse();

    await streamChat({ workspaceSlug: "my-ws", message: "hi" }, response);

    expect(ApiChatHandler.streamChat).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "automatic",
        message: "hi",
        thread: null,
      })
    );
    expect(response.end).toHaveBeenCalled();
  });

  it("uses the mode of the workspace resolved for the signed-in user", async () => {
    const user = { id: 3 };
    Workspace.getWithUser.mockResolvedValue({
      ...workspace,
      chatMode: "query",
    });
    const response = streamResponse(user);

    await streamChat({ workspaceSlug: 123, message: "hi" }, response);

    expect(Workspace.get).not.toHaveBeenCalled();
    expect(Workspace.getWithUser).toHaveBeenCalledWith(user, { slug: "123" });
    expect(ApiChatHandler.streamChat).toHaveBeenCalledWith(
      expect.objectContaining({ mode: "query", user })
    );
  });

  it.each([
    [{ workspaceSlug: "my-ws" }, "Message is required"],
    [{ workspaceSlug: "my-ws", message: "" }, "Message is required"],
    [{ message: "hi" }, "Workspace ID is required"],
  ])("rejects %j before opening the stream", async (body, error) => {
    const response = streamResponse();

    await streamChat(body, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error });
    expect(response.flushHeaders).not.toHaveBeenCalled();
    expect(ApiChatHandler.streamChat).not.toHaveBeenCalled();
  });

  it("propagates a chat handler failure to the route instead of ending the stream", async () => {
    ApiChatHandler.streamChat.mockRejectedValue(new Error("bad provider"));
    const response = streamResponse();

    await expect(
      streamChat({ workspaceSlug: "my-ws", message: "hi" }, response)
    ).rejects.toThrow("bad provider");
    expect(response.flushHeaders).toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
  });
});
