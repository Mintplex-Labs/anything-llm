jest.mock("../../utils/prisma", () => ({
  workspace_threads: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  workspace_chats: {
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  },
}));

jest.mock("../../utils/middleware/multiUserProtected", () => ({
  ROLES: { admin: "admin" },
}));

const prisma = require("../../utils/prisma");
const { WorkspaceThread } = require("../../models/workspaceThread");
const { User } = require("../../models/user");

const user = { id: 1, role: "default", dailyMessageLimit: 2 };
let chats;

beforeEach(() => {
  jest.resetAllMocks();
  chats = [
    { id: 1, thread_id: 11, user_id: 1, include: true },
    { id: 2, thread_id: 12, user_id: 1, include: true },
    { id: 3, thread_id: 13, user_id: 2, include: true },
    { id: 4, thread_id: null, user_id: 2, include: true },
  ].map((chat) => ({ ...chat, createdAt: new Date() }));

  prisma.workspace_chats.count.mockImplementation(
    async ({ where }) =>
      chats.filter(
        (chat) =>
          chat.user_id === where.user_id &&
          chat.createdAt >= where.createdAt.gte &&
          (where.include === undefined || chat.include === where.include)
      ).length
  );
  prisma.workspace_chats.updateMany.mockImplementation(
    async ({ where, data }) => {
      const selected = chats.filter((chat) =>
        where.thread_id.in.includes(chat.thread_id)
      );
      selected.forEach((chat) => Object.assign(chat, data));
      return { count: selected.length };
    }
  );
  prisma.workspace_chats.deleteMany.mockImplementation(async ({ where }) => {
    const before = chats.length;
    chats = chats.filter(
      (chat) => !where.thread_id.in.includes(chat.thread_id)
    );
    return { count: before - chats.length };
  });
  prisma.workspace_threads.deleteMany.mockResolvedValue({ count: 1 });
});

test.each([
  ["single", { id: 11 }, [11]],
  [
    "bulk",
    { slug: { in: ["one", "two"] }, user_id: 1, workspace_id: 1 },
    [11, 12],
  ],
])(
  "%s deletion preserves quota and hides only selected chats",
  async (_, clause, ids) => {
    prisma.workspace_threads.findMany.mockResolvedValue(
      ids.map((id) => ({ id }))
    );
    const expected = chats.map((chat) => ({
      ...chat,
      include: ids.includes(chat.thread_id) ? false : chat.include,
    }));

    expect(await User.canSendChat(user)).toBe(false);
    expect(await WorkspaceThread.delete(clause)).toBe(true);
    expect(await User.canSendChat(user)).toBe(false);
    expect(chats).toEqual(expected);
    expect(prisma.workspace_chats.deleteMany).not.toHaveBeenCalled();
    expect(prisma.workspace_threads.findMany).toHaveBeenCalledWith({
      where: clause,
      select: { id: true },
    });
    expect(prisma.workspace_threads.deleteMany).toHaveBeenCalledWith({
      where: clause,
    });
  }
);

test("no matching threads leaves chats unchanged", async () => {
  prisma.workspace_threads.findMany.mockResolvedValue([]);
  const before = chats.map((chat) => ({ ...chat }));

  expect(await WorkspaceThread.delete({ id: 999 })).toBe(true);
  expect(chats).toEqual(before);
  expect(prisma.workspace_chats.updateMany).not.toHaveBeenCalled();
  expect(prisma.workspace_chats.deleteMany).not.toHaveBeenCalled();
});

test("a failed thread lookup returns false without deleting threads", async () => {
  prisma.workspace_threads.findMany.mockRejectedValue(
    new Error("Thread lookup failed")
  );
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    expect(await WorkspaceThread.delete({ id: 11 })).toBe(false);
    expect(log).toHaveBeenCalledWith("Thread lookup failed");
    expect(prisma.workspace_threads.deleteMany).not.toHaveBeenCalled();
    expect(prisma.workspace_chats.updateMany).not.toHaveBeenCalled();
  } finally {
    log.mockRestore();
  }
});
