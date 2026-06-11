/* eslint-env jest, node */
const prisma = require("../../utils/prisma");
const {
  WorkspaceMessageAdjustments,
} = require("../../models/workspaceMessageAdjustments");

jest.mock("../../utils/prisma", () => ({
  workspace_message_adjustments: {
    create: jest.fn(),
    aggregate: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

describe("WorkspaceMessageAdjustments.new - validation", () => {
  beforeEach(() => jest.clearAllMocks());

  test("rejects non-integer amounts", async () => {
    for (const amount of [1.5, "10", NaN, Infinity, null, undefined]) {
      const { adjustment, message } = await WorkspaceMessageAdjustments.new({
        workspaceId: 1,
        amount,
      });
      expect(adjustment).toBeNull();
      expect(message).toMatch(/integer/);
    }
    expect(prisma.workspace_message_adjustments.create).not.toHaveBeenCalled();
  });

  test("rejects amount of 0", async () => {
    const { adjustment, message } = await WorkspaceMessageAdjustments.new({
      workspaceId: 1,
      amount: 0,
    });
    expect(adjustment).toBeNull();
    expect(message).toMatch(/non-zero/);
  });

  test("rejects amounts beyond the sanity cap in both directions", async () => {
    for (const amount of [1_000_001, -1_000_001]) {
      const { adjustment, message } = await WorkspaceMessageAdjustments.new({
        workspaceId: 1,
        amount,
      });
      expect(adjustment).toBeNull();
      expect(message).toMatch(/between/);
    }
  });

  test("accepts amounts exactly at the cap", async () => {
    prisma.workspace_message_adjustments.create.mockResolvedValue({
      id: 1,
      workspaceId: 1,
      amount: 1_000_000,
      reason: null,
      createdAt: new Date(),
    });
    const { adjustment, message } = await WorkspaceMessageAdjustments.new({
      workspaceId: 1,
      amount: 1_000_000,
    });
    expect(message).toBeNull();
    expect(adjustment).not.toBeNull();
  });

  test("rejects non-string reasons and over-long reasons", async () => {
    const nonString = await WorkspaceMessageAdjustments.new({
      workspaceId: 1,
      amount: 10,
      reason: { note: "x" },
    });
    expect(nonString.adjustment).toBeNull();
    expect(nonString.message).toMatch(/string/);

    const tooLong = await WorkspaceMessageAdjustments.new({
      workspaceId: 1,
      amount: 10,
      reason: "x".repeat(501),
    });
    expect(tooLong.adjustment).toBeNull();
    expect(tooLong.message).toMatch(/500/);
  });

  test("creates a deduction with coerced workspaceId and null reason fallback", async () => {
    prisma.workspace_message_adjustments.create.mockResolvedValue({
      id: 7,
      workspaceId: 3,
      amount: 250,
      reason: null,
      createdAt: new Date(),
    });
    const { adjustment } = await WorkspaceMessageAdjustments.new({
      workspaceId: "3",
      amount: 250,
      reason: "",
    });
    expect(adjustment.id).toBe(7);
    expect(prisma.workspace_message_adjustments.create).toHaveBeenCalledWith({
      data: { workspaceId: 3, amount: 250, reason: null },
    });
  });

  test("negative amounts (credits) are accepted", async () => {
    prisma.workspace_message_adjustments.create.mockResolvedValue({
      id: 8,
      workspaceId: 3,
      amount: -50,
      reason: "Storno",
      createdAt: new Date(),
    });
    const { adjustment, message } = await WorkspaceMessageAdjustments.new({
      workspaceId: 3,
      amount: -50,
      reason: "Storno",
    });
    expect(message).toBeNull();
    expect(adjustment.amount).toBe(-50);
  });

  test("returns error message instead of throwing on DB failure", async () => {
    prisma.workspace_message_adjustments.create.mockRejectedValue(
      new Error("db locked")
    );
    const { adjustment, message } = await WorkspaceMessageAdjustments.new({
      workspaceId: 1,
      amount: 10,
    });
    expect(adjustment).toBeNull();
    expect(message).toBe("db locked");
  });
});

describe("WorkspaceMessageAdjustments.sumAmount / sumForWorkspaceInDateRange", () => {
  beforeEach(() => jest.clearAllMocks());

  test("coalesces empty result set (null sum) to 0", async () => {
    prisma.workspace_message_adjustments.aggregate.mockResolvedValue({
      _sum: { amount: null },
    });
    expect(await WorkspaceMessageAdjustments.sumAmount({})).toBe(0);
  });

  test("returns the aggregated sum", async () => {
    prisma.workspace_message_adjustments.aggregate.mockResolvedValue({
      _sum: { amount: 230 },
    });
    expect(
      await WorkspaceMessageAdjustments.sumForWorkspaceInDateRange(
        5,
        new Date("2026-06-01"),
        new Date("2026-06-30")
      )
    ).toBe(230);
    expect(
      prisma.workspace_message_adjustments.aggregate
    ).toHaveBeenCalledWith({
      _sum: { amount: true },
      where: {
        workspaceId: 5,
        createdAt: {
          gte: new Date("2026-06-01"),
          lte: new Date("2026-06-30"),
        },
      },
    });
  });

  test("degrades gracefully to 0 on DB failure (missing table must never break chats)", async () => {
    prisma.workspace_message_adjustments.aggregate.mockRejectedValue(
      new Error("no such table: workspace_message_adjustments")
    );
    expect(
      await WorkspaceMessageAdjustments.sumForWorkspaceInDateRange(
        5,
        new Date(),
        new Date()
      )
    ).toBe(0);
  });
});

describe("WorkspaceMessageAdjustments.where / count", () => {
  beforeEach(() => jest.clearAllMocks());

  test("lists newest first with pagination", async () => {
    prisma.workspace_message_adjustments.findMany.mockResolvedValue([]);
    await WorkspaceMessageAdjustments.where({ workspaceId: 1 }, 100, 20);
    expect(prisma.workspace_message_adjustments.findMany).toHaveBeenCalledWith(
      {
        where: { workspaceId: 1 },
        take: 100,
        skip: 20,
        orderBy: { createdAt: "desc" },
      }
    );
  });

  test("returns [] / 0 on DB failure", async () => {
    prisma.workspace_message_adjustments.findMany.mockRejectedValue(
      new Error("boom")
    );
    prisma.workspace_message_adjustments.count.mockRejectedValue(
      new Error("boom")
    );
    expect(await WorkspaceMessageAdjustments.where({})).toEqual([]);
    expect(await WorkspaceMessageAdjustments.count({})).toBe(0);
  });
});
