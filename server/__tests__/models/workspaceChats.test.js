/* eslint-env jest, node */

jest.mock("../../utils/prisma", () => ({
  workspace_chats: { upsert: jest.fn() },
}));

const prisma = require("../../utils/prisma");
const { WorkspaceChats } = require("../../models/workspaceChats");

describe("WorkspaceChats.upsert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    prisma.workspace_chats.upsert.mockImplementation(
      async ({ where, update }) => ({ id: where.id, ...update })
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it("returns the Prisma record in the model's chat wrapper", async () => {
    const result = await WorkspaceChats.upsert(42, {
      workspaceId: 1,
      response: { text: "Hello" },
      user: { id: 2 },
      threadId: 3,
      include: true,
    });
    expect(result).toMatchObject({ chat: { id: 42 }, message: null });
  });

  it("preserves the model's error result when the update fails", async () => {
    prisma.workspace_chats.upsert.mockRejectedValueOnce(
      new Error("update failed")
    );
    expect(await WorkspaceChats.upsert(42, {})).toEqual({
      chat: null,
      message: "update failed",
    });
  });
});
