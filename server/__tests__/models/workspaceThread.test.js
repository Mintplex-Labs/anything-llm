/* eslint-env jest, node */

jest.mock("../../utils/prisma", () => ({
  workspace_threads: { update: jest.fn() },
}));
jest.mock("../../models/workspaceChats", () => ({
  WorkspaceChats: { count: jest.fn() },
}));

const prisma = require("../../utils/prisma");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { WorkspaceThread } = require("../../models/workspaceThread");

describe("WorkspaceThread.autoRenameThread", () => {
  const workspace = { id: 7 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("leaves a thread alone once it has a name of its own", async () => {
    const thread = { id: 42, name: "Holiday plans" };

    const result = await WorkspaceThread.autoRenameThread({
      workspace,
      thread,
      prompt: "What is the capital of France?",
    });

    expect(result).toBe(false);
    expect(WorkspaceChats.count).not.toHaveBeenCalled();
    expect(prisma.workspace_threads.update).not.toHaveBeenCalled();
  });

  it("names a default thread after its first message, truncated", async () => {
    const thread = { id: 42, name: WorkspaceThread.defaultName };
    const onRename = jest.fn();
    WorkspaceChats.count.mockResolvedValue(1);
    prisma.workspace_threads.update.mockImplementation(async ({ data }) => ({
      ...thread,
      ...data,
    }));

    const result = await WorkspaceThread.autoRenameThread({
      workspace,
      thread,
      user: null,
      prompt: "What is the capital of France?",
      onRename,
    });

    expect(result).toBe(true);
    expect(WorkspaceChats.count).toHaveBeenCalledWith({
      workspaceId: 7,
      user_id: null,
      thread_id: 42,
    });
    expect(prisma.workspace_threads.update).toHaveBeenCalledWith({
      where: { id: 42 },
      data: { name: "What is the capital of…" },
    });
    expect(onRename).toHaveBeenCalledWith(
      expect.objectContaining({ id: 42, name: "What is the capital of…" })
    );
  });

  it("does not rename a default thread that already has history", async () => {
    const thread = { id: 42, name: WorkspaceThread.defaultName };
    WorkspaceChats.count.mockResolvedValue(2);

    const result = await WorkspaceThread.autoRenameThread({
      workspace,
      thread,
      prompt: "Second message",
    });

    expect(result).toEqual({ renamed: false, thread });
    expect(prisma.workspace_threads.update).not.toHaveBeenCalled();
  });
});
