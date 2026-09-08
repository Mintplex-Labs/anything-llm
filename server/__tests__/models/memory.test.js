jest.mock("../../utils/prisma", () => ({
  memories: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
  },
  $transaction: jest.fn(),
}));

const prisma = require("../../utils/prisma");
const { Memory } = require("../../models/memory");

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Validations
// ---------------------------------------------------------------------------
describe("Memory.validations", () => {
  describe("id", () => {
    it("accepts an integer", () => {
      expect(Memory.validations.id(1)).toBe(1);
    });

    it("coerces a numeric string", () => {
      expect(Memory.validations.id("5")).toBe(5);
    });

    it("throws on non-integer", () => {
      expect(() => Memory.validations.id("abc")).toThrow();
      expect(() => Memory.validations.id(1.5)).toThrow();
    });
  });

  describe("userId", () => {
    it("returns null for null or undefined", () => {
      expect(Memory.validations.userId(null)).toBeNull();
      expect(Memory.validations.userId(undefined)).toBeNull();
      expect(Memory.validations.userId()).toBeNull();
    });

    it("coerces a valid value to int", () => {
      expect(Memory.validations.userId(3)).toBe(3);
      expect(Memory.validations.userId("7")).toBe(7);
    });
  });

  describe("workspaceId", () => {
    it("returns null for null or undefined", () => {
      expect(Memory.validations.workspaceId(null)).toBeNull();
      expect(Memory.validations.workspaceId(undefined)).toBeNull();
      expect(Memory.validations.workspaceId()).toBeNull();
    });

    it("coerces a valid value to int", () => {
      expect(Memory.validations.workspaceId(10)).toBe(10);
    });
  });

  describe("scope", () => {
    it("accepts valid scopes", () => {
      expect(Memory.validations.scope("workspace")).toBe("workspace");
      expect(Memory.validations.scope("global")).toBe("global");
    });

    it("defaults to workspace", () => {
      expect(Memory.validations.scope()).toBe("workspace");
    });

    it("throws on invalid scope", () => {
      expect(() => Memory.validations.scope("invalid")).toThrow();
    });
  });

  describe("content", () => {
    it("accepts a non-empty string", () => {
      expect(Memory.validations.content("hello")).toBe("hello");
    });

    it("throws on empty or whitespace-only string", () => {
      expect(() => Memory.validations.content("")).toThrow();
      expect(() => Memory.validations.content("   ")).toThrow();
    });

    it("throws on non-string", () => {
      expect(() => Memory.validations.content(123)).toThrow();
      expect(() => Memory.validations.content(null)).toThrow();
    });
  });
});

// ---------------------------------------------------------------------------
// forUserWorkspace
// ---------------------------------------------------------------------------
describe("Memory.forUserWorkspace", () => {
  it("queries workspace-scoped memories ordered by createdAt desc", async () => {
    const fakeMemories = [{ id: 2 }, { id: 1 }];
    prisma.memories.findMany.mockResolvedValue(fakeMemories);

    const result = await Memory.forUserWorkspace(1, 5);
    expect(result).toEqual(fakeMemories);
    expect(prisma.memories.findMany).toHaveBeenCalledWith({
      where: { userId: 1, workspaceId: 5, scope: "workspace" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns empty array on error", async () => {
    prisma.memories.findMany.mockRejectedValue(new Error("db error"));
    const result = await Memory.forUserWorkspace(1, 5);
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// globalForUser
// ---------------------------------------------------------------------------
describe("Memory.globalForUser", () => {
  it("queries global-scoped memories", async () => {
    const fakeMemories = [{ id: 1, scope: "global" }];
    prisma.memories.findMany.mockResolvedValue(fakeMemories);

    const result = await Memory.globalForUser(1);
    expect(result).toEqual(fakeMemories);
    expect(prisma.memories.findMany).toHaveBeenCalledWith({
      where: { userId: 1, scope: "global" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns empty array on error", async () => {
    prisma.memories.findMany.mockRejectedValue(new Error("db error"));
    const result = await Memory.globalForUser(1);
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// create
// ---------------------------------------------------------------------------
describe("Memory.create", () => {
  it("creates a workspace memory when under limit", async () => {
    prisma.memories.count.mockResolvedValue(0);
    const fakeMemory = { id: 1, content: "test", scope: "workspace" };
    prisma.memories.create.mockResolvedValue(fakeMemory);

    const { memory, message } = await Memory.create({
      userId: 1,
      workspaceId: 2,
      scope: "workspace",
      content: "test",
    });

    expect(memory).toEqual(fakeMemory);
    expect(message).toBeNull();
  });

  it("rejects when workspace limit is reached", async () => {
    prisma.memories.count.mockResolvedValue(Memory.WORKSPACE_LIMIT);

    const { memory, message } = await Memory.create({
      userId: 1,
      workspaceId: 2,
      scope: "workspace",
      content: "test",
    });

    expect(memory).toBeNull();
    expect(message).toMatch(/limit/i);
    expect(prisma.memories.create).not.toHaveBeenCalled();
  });

  it("rejects when global limit is reached", async () => {
    prisma.memories.count.mockResolvedValue(Memory.GLOBAL_LIMIT);

    const { memory, message } = await Memory.create({
      userId: 1,
      scope: "global",
      content: "test",
    });

    expect(memory).toBeNull();
    expect(message).toMatch(/limit/i);
    expect(prisma.memories.create).not.toHaveBeenCalled();
  });

  it("returns error message on prisma failure", async () => {
    prisma.memories.count.mockResolvedValue(0);
    prisma.memories.create.mockRejectedValue(new Error("unique constraint"));

    const { memory, message } = await Memory.create({
      userId: 1,
      workspaceId: 2,
      content: "test",
    });

    expect(memory).toBeNull();
    expect(message).toBe("unique constraint");
  });
});

// ---------------------------------------------------------------------------
// update
// ---------------------------------------------------------------------------
describe("Memory.update", () => {
  it("updates content by id", async () => {
    const updated = { id: 1, content: "new content" };
    prisma.memories.update.mockResolvedValue(updated);

    const { memory, message } = await Memory.update(1, {
      content: "new content",
    });

    expect(memory).toEqual(updated);
    expect(message).toBeNull();
    expect(prisma.memories.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({ content: "new content" }),
    });
  });

  it("returns error on invalid content", async () => {
    const { memory, message } = await Memory.update(1, { content: "" });
    expect(memory).toBeNull();
    expect(message).toBeTruthy();
  });

  it("returns error on prisma failure", async () => {
    prisma.memories.update.mockRejectedValue(new Error("not found"));
    const { memory, message } = await Memory.update(999, {
      content: "test",
    });
    expect(memory).toBeNull();
    expect(message).toBe("not found");
  });
});

// ---------------------------------------------------------------------------
// delete
// ---------------------------------------------------------------------------
describe("Memory.delete", () => {
  it("returns true on success", async () => {
    prisma.memories.delete.mockResolvedValue({});
    expect(await Memory.delete(1)).toBe(true);
    expect(prisma.memories.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("returns false on error", async () => {
    prisma.memories.delete.mockRejectedValue(new Error("not found"));
    expect(await Memory.delete(999)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// promoteToGlobal
// ---------------------------------------------------------------------------
describe("Memory.promoteToGlobal", () => {
  it("promotes a workspace memory to global", async () => {
    const existing = { id: 1, userId: 1, scope: "workspace" };
    prisma.memories.findUnique.mockResolvedValue(existing);
    prisma.memories.count.mockResolvedValue(0);
    const promoted = { ...existing, scope: "global", workspaceId: null };
    prisma.memories.update.mockResolvedValue(promoted);

    const { memory, message } = await Memory.promoteToGlobal(1);
    expect(memory.scope).toBe("global");
    expect(message).toBeNull();
  });

  it("returns message if memory not found", async () => {
    prisma.memories.findUnique.mockResolvedValue(null);
    const { memory, message } = await Memory.promoteToGlobal(999);
    expect(memory).toBeNull();
    expect(message).toMatch(/not found/i);
  });

  it("returns existing memory if already global", async () => {
    const existing = { id: 1, scope: "global" };
    prisma.memories.findUnique.mockResolvedValue(existing);

    const { memory, message } = await Memory.promoteToGlobal(1);
    expect(memory).toEqual(existing);
    expect(message).toMatch(/already global/i);
  });

  it("rejects when global limit is reached", async () => {
    const existing = { id: 1, userId: 1, scope: "workspace" };
    prisma.memories.findUnique.mockResolvedValue(existing);
    prisma.memories.count.mockResolvedValue(Memory.GLOBAL_LIMIT);

    const { memory, message } = await Memory.promoteToGlobal(1);
    expect(memory).toBeNull();
    expect(message).toMatch(/limit/i);
  });
});

// ---------------------------------------------------------------------------
// demoteToWorkspace
// ---------------------------------------------------------------------------
describe("Memory.demoteToWorkspace", () => {
  it("demotes a global memory to workspace scope", async () => {
    const existing = { id: 1, userId: 1, scope: "global" };
    prisma.memories.findUnique.mockResolvedValue(existing);
    prisma.memories.count.mockResolvedValue(0);
    const demoted = { ...existing, scope: "workspace", workspaceId: 5 };
    prisma.memories.update.mockResolvedValue(demoted);

    const { memory, message } = await Memory.demoteToWorkspace(1, 5);
    expect(memory.scope).toBe("workspace");
    expect(memory.workspaceId).toBe(5);
    expect(message).toBeNull();
  });

  it("returns message if memory not found", async () => {
    prisma.memories.findUnique.mockResolvedValue(null);
    const { memory, message } = await Memory.demoteToWorkspace(999, 5);
    expect(memory).toBeNull();
    expect(message).toMatch(/not found/i);
  });

  it("returns existing memory if already workspace-scoped", async () => {
    const existing = { id: 1, scope: "workspace" };
    prisma.memories.findUnique.mockResolvedValue(existing);

    const { memory, message } = await Memory.demoteToWorkspace(1, 5);
    expect(memory).toEqual(existing);
    expect(message).toMatch(/already workspace/i);
  });

  it("rejects when workspace limit is reached", async () => {
    const existing = { id: 1, userId: 1, scope: "global" };
    prisma.memories.findUnique.mockResolvedValue(existing);
    prisma.memories.count.mockResolvedValue(Memory.WORKSPACE_LIMIT);

    const { memory, message } = await Memory.demoteToWorkspace(1, 5);
    expect(memory).toBeNull();
    expect(message).toMatch(/limit/i);
  });
});

// ---------------------------------------------------------------------------
// updateLastUsed
// ---------------------------------------------------------------------------
describe("Memory.updateLastUsed", () => {
  it("updates lastUsedAt for the given ids", async () => {
    prisma.memories.updateMany.mockResolvedValue({ count: 2 });
    await Memory.updateLastUsed([1, 2]);
    expect(prisma.memories.updateMany).toHaveBeenCalledWith({
      where: { id: { in: [1, 2] } },
      data: expect.objectContaining({ lastUsedAt: expect.any(Date) }),
    });
  });

  it("no-ops on empty array", async () => {
    await Memory.updateLastUsed([]);
    expect(prisma.memories.updateMany).not.toHaveBeenCalled();
  });

  it("no-ops when called with no arguments", async () => {
    await Memory.updateLastUsed();
    expect(prisma.memories.updateMany).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// countForScope
// ---------------------------------------------------------------------------
describe("Memory.countForScope", () => {
  it("counts workspace-scoped memories with workspaceId", async () => {
    prisma.memories.count.mockResolvedValue(5);
    const count = await Memory.countForScope(1, 2, "workspace");
    expect(count).toBe(5);
    expect(prisma.memories.count).toHaveBeenCalledWith({
      where: { userId: 1, scope: "workspace", workspaceId: 2 },
    });
  });

  it("counts global-scoped memories without workspaceId", async () => {
    prisma.memories.count.mockResolvedValue(3);
    const count = await Memory.countForScope(1, null, "global");
    expect(count).toBe(3);
    expect(prisma.memories.count).toHaveBeenCalledWith({
      where: { userId: 1, scope: "global" },
    });
  });

  it("returns 0 on error", async () => {
    prisma.memories.count.mockRejectedValue(new Error("db error"));
    const count = await Memory.countForScope(1, 2, "workspace");
    expect(count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// replaceWorkspaceMemories
// ---------------------------------------------------------------------------
describe("Memory.replaceWorkspaceMemories", () => {
  let tx;
  beforeEach(() => {
    tx = {
      memories: {
        deleteMany: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({}),
      },
    };
    prisma.$transaction.mockImplementation((cb) => cb(tx));
  });

  it("deletes old memories and creates new ones in a transaction", async () => {
    const result = await Memory.replaceWorkspaceMemories(1, 2, [
      "fact one",
      "fact two",
    ]);
    expect(result).toBe(true);
    expect(tx.memories.deleteMany).toHaveBeenCalledWith({
      where: { userId: 1, workspaceId: 2, scope: "workspace" },
    });
    expect(tx.memories.create).toHaveBeenCalledTimes(2);
  });

  it("caps at WORKSPACE_LIMIT", async () => {
    const tooMany = Array.from({ length: 30 }, (_, i) => `fact ${i}`);
    await Memory.replaceWorkspaceMemories(1, 2, tooMany);
    expect(tx.memories.create).toHaveBeenCalledTimes(Memory.WORKSPACE_LIMIT);
  });

  it("filters out non-string and empty entries", async () => {
    await Memory.replaceWorkspaceMemories(1, 2, [
      "valid",
      "",
      "   ",
      123,
      null,
      "also valid",
    ]);
    expect(tx.memories.create).toHaveBeenCalledTimes(2);
  });

  it("returns false on transaction error", async () => {
    prisma.$transaction.mockRejectedValue(new Error("tx failed"));
    const result = await Memory.replaceWorkspaceMemories(1, 2, ["fact"]);
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// applyExtractedMemories
// ---------------------------------------------------------------------------
describe("Memory.applyExtractedMemories", () => {
  let tx;
  beforeEach(() => {
    tx = {
      memories: {
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    prisma.$transaction.mockImplementation((cb) => cb(tx));
  });

  it("creates workspace and global memories", async () => {
    prisma.memories.count.mockResolvedValue(0);

    const result = await Memory.applyExtractedMemories(1, 2, [
      { content: "ws fact", scope: "WORKSPACE", action: "create" },
      { content: "global fact", scope: "GLOBAL", action: "create" },
    ], Memory.GLOBAL_LIMIT);

    expect(result).toEqual({
      workspaceCount: 1,
      globalCount: 1,
      updatedCount: 0,
    });
    expect(tx.memories.create).toHaveBeenCalledTimes(2);
  });

  it("handles updates with updateId", async () => {
    prisma.memories.count.mockResolvedValue(0);

    const result = await Memory.applyExtractedMemories(1, 2, [
      { content: "revised", scope: "WORKSPACE", action: "update", updateId: 10 },
    ], Memory.GLOBAL_LIMIT);

    expect(result.updatedCount).toBe(1);
    expect(tx.memories.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: expect.objectContaining({ content: "revised" }),
    });
  });

  it("skips updates without a numeric updateId", async () => {
    prisma.memories.count.mockResolvedValue(0);

    const result = await Memory.applyExtractedMemories(1, 2, [
      { content: "bad update", scope: "WORKSPACE", action: "update" },
      { content: "also bad", scope: "WORKSPACE", action: "update", updateId: "abc" },
    ], Memory.GLOBAL_LIMIT);

    expect(result.updatedCount).toBe(0);
    expect(tx.memories.update).not.toHaveBeenCalled();
  });

  it("does not create workspace memories past the workspace limit", async () => {
    prisma.memories.count.mockResolvedValue(Memory.WORKSPACE_LIMIT - 1);

    const result = await Memory.applyExtractedMemories(1, 2, [
      { content: "First fact", scope: "WORKSPACE", action: "create" },
      { content: "Second fact", scope: "WORKSPACE", action: "create" },
      { content: "Third fact", scope: "WORKSPACE", action: "create" },
    ], Memory.GLOBAL_LIMIT);

    expect(tx.memories.create).toHaveBeenCalledTimes(1);
    expect(result.workspaceCount).toBe(1);
  });

  it("creates zero workspace memories when already at limit", async () => {
    prisma.memories.count.mockResolvedValue(Memory.WORKSPACE_LIMIT);

    const result = await Memory.applyExtractedMemories(1, 2, [
      { content: "rejected", scope: "WORKSPACE", action: "create" },
    ], Memory.GLOBAL_LIMIT);

    expect(result.workspaceCount).toBe(0);
  });

  it("respects globalSlots parameter", async () => {
    prisma.memories.count.mockResolvedValue(0);

    const result = await Memory.applyExtractedMemories(1, 2, [
      { content: "g1", scope: "GLOBAL", action: "create" },
      { content: "g2", scope: "GLOBAL", action: "create" },
      { content: "g3", scope: "GLOBAL", action: "create" },
    ], 1);

    expect(result.globalCount).toBe(1);
  });

  it("filters out malformed entries", async () => {
    prisma.memories.count.mockResolvedValue(0);

    const result = await Memory.applyExtractedMemories(1, 2, [
      null,
      { content: "", scope: "WORKSPACE", action: "create" },
      { content: "valid", scope: "INVALID", action: "create" },
      { content: "also valid", scope: "WORKSPACE", action: "bad" },
      { scope: "WORKSPACE", action: "create" },
      { content: "good", scope: "WORKSPACE", action: "create" },
    ], Memory.GLOBAL_LIMIT);

    expect(result.workspaceCount).toBe(1);
    expect(tx.memories.create).toHaveBeenCalledTimes(1);
  });

  it("handles non-array input gracefully", async () => {
    prisma.memories.count.mockResolvedValue(0);

    const result = await Memory.applyExtractedMemories(1, 2, null, 5);
    expect(result).toEqual({
      workspaceCount: 0,
      globalCount: 0,
      updatedCount: 0,
    });
  });
});

// ---------------------------------------------------------------------------
// migrateToMultiUser
// ---------------------------------------------------------------------------
describe("Memory.migrateToMultiUser", () => {
  it("reassigns unowned memories to the admin user", async () => {
    prisma.memories.updateMany.mockResolvedValue({ count: 3 });
    const result = await Memory.migrateToMultiUser(1);
    expect(result).toBe(true);
    expect(prisma.memories.updateMany).toHaveBeenCalledWith({
      where: { userId: null },
      data: { userId: 1 },
    });
  });

  it("returns false on error", async () => {
    prisma.memories.updateMany.mockRejectedValue(new Error("db error"));
    expect(await Memory.migrateToMultiUser(1)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// get
// ---------------------------------------------------------------------------
describe("Memory.get", () => {
  it("returns the first matching memory", async () => {
    const fake = { id: 1, content: "test" };
    prisma.memories.findFirst.mockResolvedValue(fake);

    const result = await Memory.get({ id: 1 });
    expect(result).toEqual(fake);
    expect(prisma.memories.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("returns null when no match found", async () => {
    prisma.memories.findFirst.mockResolvedValue(null);
    expect(await Memory.get({ id: 999 })).toBeNull();
  });

  it("returns null on error", async () => {
    prisma.memories.findFirst.mockRejectedValue(new Error("db error"));
    expect(await Memory.get({ id: 1 })).toBeNull();
  });
});
