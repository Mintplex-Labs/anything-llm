const mockPrisma = {
  $queryRawUnsafe: jest.fn(),
  $transaction: jest.fn(),
};
const mockTransaction = {
  $executeRawUnsafe: jest.fn(),
  $queryRawUnsafe: jest.fn(),
};

jest.mock("../../utils/prisma", () => mockPrisma);

const { SwarmsyMemoryLock } = require("../../models/swarmsyMemoryLock");

describe("SwarmsyMemoryLock", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction.$executeRawUnsafe.mockResolvedValue(1);
    mockPrisma.$transaction.mockImplementation(async (callback) =>
      callback(mockTransaction)
    );
  });

  it("lists active user locks for a workspace without same-workspace leakage", async () => {
    mockPrisma.$queryRawUnsafe.mockResolvedValue([
      {
        id: 1,
        workspace_id: 9,
        user_id: 12,
        is_active: true,
        version: 2,
        source: "pasted",
        content: "LOCK",
        archived_at: null,
        created_at: new Date("2026-07-12T00:00:00.000Z"),
        updated_at: new Date("2026-07-12T00:00:00.000Z"),
      },
    ]);

    await expect(
      SwarmsyMemoryLock.forUserWorkspace({ userId: 12, workspaceId: 9 })
    ).resolves.toEqual([
      expect.objectContaining({
        id: 1,
        workspaceId: 9,
        userId: 12,
        isActive: true,
        version: 2,
        content: "LOCK",
      }),
    ]);

    expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
      expect.stringContaining("WHERE workspace_id = ?"),
      9,
      12
    );
  });

  it("creates a new active lock version scoped to both user and workspace", async () => {
    mockTransaction.$queryRawUnsafe
      .mockResolvedValueOnce([{ version: 4 }])
      .mockResolvedValueOnce([{ id: 10 }]);
    mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([
      {
        id: 10,
        workspace_id: 9,
        user_id: 12,
        is_active: true,
        version: 5,
        source: "pasted",
        content: "LOCK",
        archived_at: null,
        created_at: new Date("2026-07-12T00:00:00.000Z"),
        updated_at: new Date("2026-07-12T00:00:00.000Z"),
      },
    ]);

    const { lock, message } = await SwarmsyMemoryLock.create({
      userId: 12,
      workspaceId: 9,
      content: "LOCK",
      source: "pasted",
      isActive: true,
    });

    expect(message).toBeNull();
    expect(lock).toEqual(
      expect.objectContaining({
        id: 10,
        workspaceId: 9,
        userId: 12,
        version: 5,
        isActive: true,
        source: "pasted",
        content: "LOCK",
      })
    );
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockTransaction.$queryRawUnsafe).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("SELECT version"),
      9,
      12
    );
    expect(mockTransaction.$executeRawUnsafe).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("INSERT INTO swarmsy_memory_locks"),
      9,
      12,
      true,
      5,
      "pasted",
      "LOCK"
    );
  });

  it("rejects a missing user before querying or writing locks", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { lock, message } = await SwarmsyMemoryLock.create({
      workspaceId: 9,
      content: "LOCK",
    });

    expect(lock).toBeNull();
    expect(message).toBe("userId is required.");
    expect(mockPrisma.$queryRawUnsafe).not.toHaveBeenCalled();
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("rejects empty imported Memory Lock content", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { lock, message } = await SwarmsyMemoryLock.create({
      userId: 12,
      workspaceId: 9,
      content: " ",
    });

    expect(lock).toBeNull();
    expect(message).toBe("Memory Lock content is required.");
    consoleErrorSpy.mockRestore();
  });
});
