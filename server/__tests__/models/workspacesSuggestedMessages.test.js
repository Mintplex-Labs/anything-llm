jest.mock("../../utils/prisma", () => ({
  workspaces: {
    findUnique: jest.fn(),
  },
  workspace_suggested_messages: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn(),
}));

const prisma = require("../../utils/prisma");
const {
  WorkspaceSuggestedMessages,
} = require("../../models/workspacesSuggestedMessages");

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// saveAll
// ---------------------------------------------------------------------------
describe("WorkspaceSuggestedMessages.saveAll", () => {
  const fakeWorkspace = { id: 7, slug: "my-workspace" };

  let tx;
  beforeEach(() => {
    tx = {
      workspace_suggested_messages: {
        deleteMany: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({}),
      },
    };
    prisma.workspaces.findUnique.mockResolvedValue(fakeWorkspace);
    prisma.$transaction.mockImplementation((cb) => cb(tx));
  });

  it("deletes old messages and creates new ones in a transaction", async () => {
    const result = await WorkspaceSuggestedMessages.saveAll(
      [
        { heading: "Hello", message: "First" },
        { heading: "World", message: "Second" },
      ],
      "my-workspace"
    );

    expect(result).toBe(true);
    expect(tx.workspace_suggested_messages.deleteMany).toHaveBeenCalledWith({
      where: { workspaceId: 7 },
    });
    expect(tx.workspace_suggested_messages.create).toHaveBeenCalledTimes(2);
    expect(tx.workspace_suggested_messages.create).toHaveBeenNthCalledWith(1, {
      data: { workspaceId: 7, heading: "Hello", message: "First" },
    });
    expect(tx.workspace_suggested_messages.create).toHaveBeenNthCalledWith(2, {
      data: { workspaceId: 7, heading: "World", message: "Second" },
    });
  });

  it("returns false when a create fails mid-write", async () => {
    tx.workspace_suggested_messages.create
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("db error"));

    const result = await WorkspaceSuggestedMessages.saveAll(
      [
        { heading: "Hello", message: "First" },
        { heading: "Bad", message: "Second" },
      ],
      "my-workspace"
    );

    expect(result).toBe(false);
    expect(tx.workspace_suggested_messages.create).toHaveBeenCalledTimes(2);
  });

  it("returns false when the transaction itself fails", async () => {
    prisma.$transaction.mockRejectedValue(new Error("tx failed"));

    const result = await WorkspaceSuggestedMessages.saveAll(
      [{ heading: "Hello", message: "First" }],
      "my-workspace"
    );

    expect(result).toBe(false);
  });

  it("returns false when the workspace does not exist", async () => {
    prisma.workspaces.findUnique.mockResolvedValue(null);

    const result = await WorkspaceSuggestedMessages.saveAll(
      [{ heading: "Hello", message: "First" }],
      "missing-workspace"
    );

    expect(result).toBe(false);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
