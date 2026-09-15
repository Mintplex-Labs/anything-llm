jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn(), where: jest.fn() },
}));
jest.mock("../../../models/workspaceThread", () => ({
  WorkspaceThread: { get: jest.fn(), where: jest.fn(), new: jest.fn() },
}));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { markThreadHistoryInvalidV2: jest.fn() },
}));
jest.mock("../../../utils/helpers", () => ({
  getBaseLLMProviderModel: jest.fn(),
}));

const { Workspace } = require("../../../models/workspace");
const { WorkspaceThread } = require("../../../models/workspaceThread");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { getBaseLLMProviderModel } = require("../../../utils/helpers");
const {
  parseLarkCommand,
  handleLarkCommand,
} = require("../../../utils/larkChannel/commands");

test.each([
  ["/workspace research", { name: "workspace", args: "research" }],
  ["/thread paper", { name: "thread", args: "paper" }],
  ["/new quarterly notes", { name: "new", args: "quarterly notes" }],
  ["/reset", { name: "reset", args: "" }],
  ["/status", { name: "status", args: "" }],
  ["/help", { name: "help", args: "" }],
])("parses %s", (input, expected) => {
  expect(parseLarkCommand(input)).toEqual(expected);
});

test("returns null for normal chat text", () => {
  expect(parseLarkCommand("explain this document")).toBeNull();
});

test("returns null for unsupported slash commands", () => {
  expect(parseLarkCommand("/unknown detail")).toBeNull();
});

describe("handleLarkCommand", () => {
  let channel, stateStore;

  beforeEach(() => {
    jest.clearAllMocks();
    channel = { send: jest.fn().mockResolvedValue({ messageId: "om_reply" }) };
    stateStore = {
      get: jest.fn().mockReturnValue({
        workspaceSlug: "general",
        threadSlug: "paper",
      }),
      set: jest.fn().mockResolvedValue(undefined),
    };
    Workspace.get.mockResolvedValue({
      id: 1,
      slug: "general",
      name: "General",
      chatProvider: "openai",
      chatModel: "gpt-4o",
    });
    Workspace.where.mockResolvedValue([
      { id: 1, slug: "general", name: "General" },
      { id: 2, slug: "research", name: "Research" },
    ]);
    WorkspaceThread.get.mockResolvedValue({
      id: 3,
      slug: "paper",
      name: "Paper",
      workspace_id: 1,
    });
    WorkspaceThread.where.mockResolvedValue([
      { id: 3, slug: "paper", name: "Paper" },
    ]);
    WorkspaceThread.new.mockResolvedValue({
      thread: { id: 4, slug: "quarterly-notes", name: "Quarterly notes" },
      message: null,
    });
    getBaseLLMProviderModel.mockReturnValue("default-model");
  });

  const handle = (
    command,
    args = "",
    message = { chatId: "oc_1", messageId: "om_1", chatType: "p2p" }
  ) =>
    handleLarkCommand({
      command,
      args,
      userId: "ou_approved",
      chatId: "oc_1",
      stateStore,
      channel,
      message,
    });

  test.each([
    ["workspace", ""],
    ["thread", ""],
    ["new", "New thread"],
    ["reset", ""],
    ["status", ""],
    ["help", ""],
  ])("replies to the source group message for /%s", async (command, args) => {
    await handle(command, args, {
      chatId: "oc_1",
      messageId: "om_source",
      chatType: "group",
    });

    expect(channel.send.mock.calls.at(-1)[2]).toEqual({
      replyTo: "om_source",
    });
  });

  test("uses an explicit non-reply option for direct commands", async () => {
    await handle("help");

    expect(channel.send.mock.calls.at(-1)[2]).toEqual({});
  });

  test("rejects users missing from channel state before reading workspace data", async () => {
    stateStore.get.mockReturnValue(null);

    await handle("workspace");

    expect(Workspace.where).not.toHaveBeenCalled();
    expect(Workspace.get).not.toHaveBeenCalled();
    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { text: "Access denied." },
      {}
    );
  });

  test("lists numbered workspaces with slug-based usage", async () => {
    await handle("workspace");

    expect(Workspace.where).toHaveBeenCalledWith({});
    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      {
        text: [
          "Available workspaces:",
          "1. General (`general`)",
          "2. Research (`research`)",
          "",
          "Usage: /workspace <slug>",
        ].join("\n"),
      },
      {}
    );
  });

  test("selects an exact workspace slug and clears the active thread", async () => {
    Workspace.get.mockResolvedValue({
      id: 2,
      slug: "research",
      name: "Research",
    });

    await handle("workspace", "research");

    expect(Workspace.get).toHaveBeenCalledWith({ slug: "research" });
    expect(stateStore.set).toHaveBeenCalledWith("ou_approved", {
      workspaceSlug: "research",
      threadSlug: null,
    });
    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { text: 'Workspace set to "Research".' },
      {}
    );
  });

  test("turns state persistence failures into a generic command error", async () => {
    Workspace.get.mockResolvedValue({
      id: 2,
      slug: "research",
      name: "Research",
    });
    stateStore.set.mockRejectedValue(
      new Error("database response containing private configuration")
    );

    await expect(handle("workspace", "research")).resolves.toBeDefined();

    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { text: "Unable to update channel state." },
      {}
    );
    expect(JSON.stringify(channel.send.mock.calls)).not.toContain(
      "private configuration"
    );
  });

  test("does not expose workspace details when an exact slug is unavailable", async () => {
    Workspace.get.mockResolvedValue(null);

    await handle("workspace", "private-workspace");

    expect(stateStore.set).not.toHaveBeenCalled();
    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { text: "Workspace not found." },
      {}
    );
  });

  test("lists only threads in the active workspace", async () => {
    await handle("thread");

    expect(WorkspaceThread.where).toHaveBeenCalledWith({ workspace_id: 1 });
    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      {
        text: [
          'Threads in "General":',
          "1. Paper (`paper`)",
          "",
          "Usage: /thread <slug>",
        ].join("\n"),
      },
      {}
    );
  });

  test("selects a thread only when its exact slug belongs to the active workspace", async () => {
    await handle("thread", "paper");

    expect(WorkspaceThread.get).toHaveBeenCalledWith({
      slug: "paper",
      workspace_id: 1,
    });
    expect(stateStore.set).toHaveBeenCalledWith("ou_approved", {
      threadSlug: "paper",
    });
  });

  test("creates a named thread in the active workspace and selects it", async () => {
    await handle("new", "Quarterly notes");

    expect(WorkspaceThread.new).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
      null,
      { name: "Quarterly notes" }
    );
    expect(stateStore.set).toHaveBeenCalledWith("ou_approved", {
      threadSlug: "quarterly-notes",
    });
    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { text: 'New thread "Quarterly notes" created and selected.' },
      {}
    );
  });

  test("resets only the active workspace and active scoped thread history", async () => {
    await handle("reset");

    expect(WorkspaceThread.get).toHaveBeenCalledWith({
      slug: "paper",
      workspace_id: 1,
    });
    expect(WorkspaceChats.markThreadHistoryInvalidV2).toHaveBeenCalledWith({
      workspaceId: 1,
      user_id: null,
      thread_id: 3,
      api_session_id: null,
    });
  });

  test("does not broaden a reset when the saved thread cannot be resolved", async () => {
    WorkspaceThread.get.mockResolvedValue(null);

    await handle("reset");

    expect(WorkspaceChats.markThreadHistoryInvalidV2).not.toHaveBeenCalled();
    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { text: "Thread not found." },
      {}
    );
  });

  test("reports workspace, thread, and the resolved model", async () => {
    await handle("status");

    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { text: "Workspace: General\nThread: Paper\nModel: gpt-4o" },
      {}
    );
  });

  test("falls back to the provider default when status has no selected model", async () => {
    Workspace.get.mockResolvedValue({
      id: 1,
      slug: "general",
      name: "General",
      chatProvider: "openai",
    });

    await handle("status");

    expect(getBaseLLMProviderModel).toHaveBeenCalledWith({
      provider: "openai",
    });
    expect(channel.send).toHaveBeenCalledWith(
      "oc_1",
      { text: "Workspace: General\nThread: Paper\nModel: default-model" },
      {}
    );
  });

  test("help lists all supported text commands", async () => {
    await handle("help");

    const text = channel.send.mock.calls[0][1].text;
    for (const command of [
      "/workspace",
      "/thread",
      "/new",
      "/reset",
      "/status",
      "/help",
    ]) {
      expect(text).toContain(command);
    }
  });
});
