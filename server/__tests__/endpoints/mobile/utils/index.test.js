jest.mock("../../../../utils/prisma", () => ({
  workspace_threads: { findFirst: jest.fn() },
}));
jest.mock("../../../../models/workspaceChats", () => ({
  WorkspaceChats: { markThreadHistoryInvalidV2: jest.fn() },
}));
jest.mock("../../../../models/workspace", () => ({
  Workspace: { get: jest.fn(), getWithUser: jest.fn() },
}));
jest.mock("../../../../models/workspaceThread", () => ({ WorkspaceThread: {} }));
jest.mock("../../../../models/mobileDevice", () => ({ MobileDevice: {} }));
jest.mock("../../../../utils/chats/apiChatHandler", () => ({
  ApiChatHandler: {},
}));
jest.mock("../../../../endpoints/utils", () => ({ getModelTag: () => "test" }));

const prisma = require("../../../../utils/prisma");
const { WorkspaceChats } = require("../../../../models/workspaceChats");
const { Workspace } = require("../../../../models/workspace");
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

  it("rejects an unknown threadSlug instead of clearing anything", async () => {
    prisma.workspace_threads.findFirst.mockResolvedValue(null);
    const response = mockResponse();

    await handleMobileCommand(
      {
        params: { command: "reset-chat" },
        body: { workspaceSlug: "my-ws", threadSlug: "gone" },
      },
      response
    );

    // A slug that resolves to nothing must not be retargeted at the default
    // thread: that is a second silent data-loss path.
    expect(WorkspaceChats.markThreadHistoryInvalidV2).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
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
