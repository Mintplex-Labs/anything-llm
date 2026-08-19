jest.mock("../../utils/prisma", () => ({
  memories: {
    count: jest.fn(),
  },
  $transaction: jest.fn(),
}));

const prisma = require("../../utils/prisma");
const { Memory } = require("../../models/memory");

describe("Memory.applyExtractedMemories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not create workspace memories past the workspace limit", async () => {
    prisma.memories.count.mockResolvedValue(Memory.WORKSPACE_LIMIT - 1);
    const tx = {
      memories: {
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    prisma.$transaction.mockImplementation((callback) => callback(tx));

    const newMemories = [
      { content: "First fact", scope: "WORKSPACE", action: "create" },
      { content: "Second fact", scope: "WORKSPACE", action: "create" },
      { content: "Third fact", scope: "WORKSPACE", action: "create" },
    ];

    const result = await Memory.applyExtractedMemories(
      1,
      2,
      newMemories,
      Memory.GLOBAL_LIMIT
    );

    expect(prisma.memories.count).toHaveBeenCalledWith({
      where: { userId: 1, workspaceId: 2, scope: "workspace" },
    });
    expect(tx.memories.create).toHaveBeenCalledTimes(1);
    expect(tx.memories.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        workspaceId: 2,
        scope: "workspace",
        content: "First fact",
      },
    });
    expect(result).toEqual({
      workspaceCount: 1,
      globalCount: 0,
      updatedCount: 0,
    });
  });
});
