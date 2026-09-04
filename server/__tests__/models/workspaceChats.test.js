jest.mock("../../utils/prisma", () => ({
  workspace_chats: {
    update: jest.fn(),
  },
}));

jest.mock("../../utils/helpers/chat/responses", () => ({
  safeJSONStringify: jest.fn(),
}));

const prisma = require("../../utils/prisma");
const { WorkspaceChats } = require("../../models/workspaceChats");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("WorkspaceChats._update", () => {
  it("updates lastUpdatedAt when a workspace chat is updated", async () => {
    prisma.workspace_chats.update.mockResolvedValue({});

    const beforeUpdate = new Date();

    const result = await WorkspaceChats._update(123, {
      prompt: "Updated prompt",
    });

    const afterUpdate = new Date();

    expect(result).toBe(true);
    expect(prisma.workspace_chats.update).toHaveBeenCalledTimes(1);

    const updateCall = prisma.workspace_chats.update.mock.calls[0][0];

    expect(updateCall.where).toEqual({ id: 123 });
    expect(updateCall.data.prompt).toBe("Updated prompt");
    expect(updateCall.data.lastUpdatedAt).toBeInstanceOf(Date);

    expect(updateCall.data.lastUpdatedAt.getTime()).toBeGreaterThanOrEqual(
      beforeUpdate.getTime()
    );

    expect(updateCall.data.lastUpdatedAt.getTime()).toBeLessThanOrEqual(
      afterUpdate.getTime()
    );
  });
});
