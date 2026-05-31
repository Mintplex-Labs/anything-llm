const { Prisma } = require("@prisma/client");
const { OllamaConnection } = require("../../models/ollamaConnection");
const prisma = require("../../utils/prisma");

describe("OllamaConnection.validations", () => {
  describe("name", () => {
    it("trims whitespace and accepts a normal string", () => {
      expect(OllamaConnection.validations.name("  Local Ollama  ")).toBe(
        "Local Ollama"
      );
    });

    it("rejects empty/non-string values", () => {
      expect(OllamaConnection.validations.name("")).toBeNull();
      expect(OllamaConnection.validations.name(null)).toBeNull();
      expect(OllamaConnection.validations.name(undefined)).toBeNull();
      expect(OllamaConnection.validations.name(123)).toBeNull();
      expect(OllamaConnection.validations.name({})).toBeNull();
    });

    it("truncates long names to 255 chars", () => {
      const long = "a".repeat(300);
      expect(OllamaConnection.validations.name(long)).toHaveLength(255);
    });
  });

  describe("basePath", () => {
    it("strips trailing slashes", () => {
      expect(
        OllamaConnection.validations.basePath("http://localhost:11434/")
      ).toBe("http://localhost:11434");
      expect(
        OllamaConnection.validations.basePath("http://localhost:11434///")
      ).toBe("http://localhost:11434");
    });

    it("leaves a clean URL unchanged", () => {
      expect(
        OllamaConnection.validations.basePath("http://localhost:11434")
      ).toBe("http://localhost:11434");
    });

    it("rejects empty/non-string values", () => {
      expect(OllamaConnection.validations.basePath("")).toBeNull();
      expect(OllamaConnection.validations.basePath(null)).toBeNull();
      expect(OllamaConnection.validations.basePath(undefined)).toBeNull();
      expect(OllamaConnection.validations.basePath(42)).toBeNull();
    });
  });

  describe("authToken", () => {
    it("returns the string as-is", () => {
      expect(OllamaConnection.validations.authToken("secret-token")).toBe(
        "secret-token"
      );
    });

    it("coerces empty/null/undefined to null", () => {
      expect(OllamaConnection.validations.authToken("")).toBeNull();
      expect(OllamaConnection.validations.authToken(null)).toBeNull();
      expect(OllamaConnection.validations.authToken(undefined)).toBeNull();
    });

    it("rejects non-string values", () => {
      expect(OllamaConnection.validations.authToken(123)).toBeNull();
      expect(OllamaConnection.validations.authToken({})).toBeNull();
    });
  });

  describe("keepAlive / responseTimeout", () => {
    const numericFields = ["keepAlive", "responseTimeout"];
    it.each(numericFields)("rounds and accepts positive numbers (%s)", (field) => {
      expect(OllamaConnection.validations[field]("300")).toBe(300);
      expect(OllamaConnection.validations[field](120.7)).toBe(121);
    });

    it.each(numericFields)("accepts zero (%s)", (field) => {
      expect(OllamaConnection.validations[field](0)).toBe(0);
    });

    it.each(numericFields)("rejects negative/NaN/empty (%s)", (field) => {
      expect(OllamaConnection.validations[field](-1)).toBeNull();
      expect(OllamaConnection.validations[field]("abc")).toBeNull();
      expect(OllamaConnection.validations[field]("")).toBeNull();
      expect(OllamaConnection.validations[field](null)).toBeNull();
      expect(OllamaConnection.validations[field](undefined)).toBeNull();
    });
  });
});

describe("OllamaConnection._sanitize", () => {
  it("only keeps writable keys", () => {
    const result = OllamaConnection._sanitize({
      name: "Prod",
      basePath: "http://prod:11434",
      authToken: "tok",
      keepAlive: "60",
      responseTimeout: "30000",
      id: 999, // not writable
      createdAt: new Date(), // not writable
      foo: "bar", // not writable
    });
    expect(result).toEqual({
      name: "Prod",
      basePath: "http://prod:11434",
      authToken: "tok",
      keepAlive: 60,
      responseTimeout: 30000,
    });
  });

  it("skips fields that are not provided", () => {
    const result = OllamaConnection._sanitize({ name: "Just name" });
    expect(result).toEqual({ name: "Just name" });
  });

  it("preserves nulls produced by failed validations so the caller can detect them", () => {
    const result = OllamaConnection._sanitize({
      name: "",
      basePath: "  http://x/  ",
    });
    expect(result).toEqual({ name: null, basePath: "http://x" });
  });
});

describe("OllamaConnection.create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a connection when name + basePath are valid", async () => {
    const fakeRow = {
      id: 1,
      name: "Local",
      basePath: "http://localhost:11434",
      authToken: null,
      keepAlive: null,
      responseTimeout: null,
    };
    prisma.ollama_connections.create = jest.fn().mockResolvedValue(fakeRow);

    const result = await OllamaConnection.create({
      name: "Local",
      basePath: "http://localhost:11434/",
      authToken: "",
    });

    expect(result).toEqual({ connection: fakeRow, error: null });
    expect(prisma.ollama_connections.create).toHaveBeenCalledWith({
      data: {
        name: "Local",
        basePath: "http://localhost:11434",
        authToken: null,
      },
    });
  });

  it("rejects when name is missing", async () => {
    prisma.ollama_connections.create = jest.fn();
    const result = await OllamaConnection.create({
      basePath: "http://localhost:11434",
    });
    expect(result).toEqual({
      connection: null,
      error: "Name is required.",
    });
    expect(prisma.ollama_connections.create).not.toHaveBeenCalled();
  });

  it("rejects when basePath is missing", async () => {
    prisma.ollama_connections.create = jest.fn();
    const result = await OllamaConnection.create({ name: "Local" });
    expect(result).toEqual({
      connection: null,
      error: "Base path is required.",
    });
    expect(prisma.ollama_connections.create).not.toHaveBeenCalled();
  });

  it("returns a friendly error on unique-constraint violation", async () => {
    const err = new Prisma.PrismaClientKnownRequestError("duplicate", {
      code: "P2002",
      clientVersion: "test",
    });
    prisma.ollama_connections.create = jest.fn().mockRejectedValue(err);
    // Silence the model's console.error for cleaner test output.
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await OllamaConnection.create({
      name: "Dup",
      basePath: "http://x:11434",
    });

    expect(result).toEqual({
      connection: null,
      error: "A connection with that name already exists.",
    });
    errorSpy.mockRestore();
  });
});

describe("OllamaConnection.update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects when no id is provided", async () => {
    await expect(OllamaConnection.update(null, { name: "x" })).rejects.toThrow(
      "No ollama connection id provided for update"
    );
  });

  it("rejects when name is explicitly emptied", async () => {
    prisma.ollama_connections.update = jest.fn();
    const result = await OllamaConnection.update(1, { name: "" });
    expect(result).toEqual({
      connection: null,
      error: "Name cannot be empty.",
    });
    expect(prisma.ollama_connections.update).not.toHaveBeenCalled();
  });

  it("rejects when basePath is explicitly emptied", async () => {
    prisma.ollama_connections.update = jest.fn();
    const result = await OllamaConnection.update(1, { basePath: "" });
    expect(result).toEqual({
      connection: null,
      error: "Base path cannot be empty.",
    });
    expect(prisma.ollama_connections.update).not.toHaveBeenCalled();
  });

  it("returns a no-op when no writable fields are provided", async () => {
    prisma.ollama_connections.update = jest.fn();
    const result = await OllamaConnection.update(1, { iddqd: true });
    expect(result).toEqual({
      connection: { id: 1 },
      error: "No valid fields to update.",
    });
    expect(prisma.ollama_connections.update).not.toHaveBeenCalled();
  });

  it("forwards sanitized partial updates with a bumped lastUpdatedAt", async () => {
    const fakeRow = {
      id: 1,
      name: "Renamed",
      basePath: "http://x:11434",
    };
    prisma.ollama_connections.update = jest.fn().mockResolvedValue(fakeRow);

    const result = await OllamaConnection.update(1, {
      name: "Renamed",
      keepAlive: "120",
    });

    expect(result).toEqual({ connection: fakeRow, error: null });
    const callArgs = prisma.ollama_connections.update.mock.calls[0][0];
    expect(callArgs.where).toEqual({ id: 1 });
    expect(callArgs.data).toMatchObject({ name: "Renamed", keepAlive: 120 });
    expect(callArgs.data.lastUpdatedAt).toBeInstanceOf(Date);
  });

  it("returns a friendly error on unique-constraint violation", async () => {
    const err = new Prisma.PrismaClientKnownRequestError("duplicate", {
      code: "P2002",
      clientVersion: "test",
    });
    prisma.ollama_connections.update = jest.fn().mockRejectedValue(err);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await OllamaConnection.update(1, { name: "Dup" });

    expect(result).toEqual({
      connection: null,
      error: "A connection with that name already exists.",
    });
    errorSpy.mockRestore();
  });
});

describe("OllamaConnection.get / where", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("get returns the row when found", async () => {
    const row = { id: 7, name: "Local", basePath: "http://x:11434" };
    prisma.ollama_connections.findFirst = jest.fn().mockResolvedValue(row);
    await expect(OllamaConnection.get({ id: 7 })).resolves.toBe(row);
    expect(prisma.ollama_connections.findFirst).toHaveBeenCalledWith({
      where: { id: 7 },
    });
  });

  it("get returns null when not found", async () => {
    prisma.ollama_connections.findFirst = jest.fn().mockResolvedValue(null);
    await expect(OllamaConnection.get({ id: 404 })).resolves.toBeNull();
  });

  it("where returns rows ordered by name asc", async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    prisma.ollama_connections.findMany = jest.fn().mockResolvedValue(rows);
    await expect(OllamaConnection.where({})).resolves.toBe(rows);
    expect(prisma.ollama_connections.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { name: "asc" },
    });
  });

  it("where applies a limit when provided", async () => {
    prisma.ollama_connections.findMany = jest.fn().mockResolvedValue([]);
    await OllamaConnection.where({}, 5);
    expect(prisma.ollama_connections.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { name: "asc" },
      take: 5,
    });
  });

  it("get returns null and swallows errors", async () => {
    prisma.ollama_connections.findFirst = jest
      .fn()
      .mockRejectedValue(new Error("db down"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(OllamaConnection.get({ id: 1 })).resolves.toBeNull();
    errorSpy.mockRestore();
  });

  it("where returns [] and swallows errors", async () => {
    prisma.ollama_connections.findMany = jest
      .fn()
      .mockRejectedValue(new Error("db down"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(OllamaConnection.where({})).resolves.toEqual([]);
    errorSpy.mockRestore();
  });
});

describe("OllamaConnection.delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns false when no id is provided", async () => {
    await expect(OllamaConnection.delete(null)).resolves.toBe(false);
  });

  it("deletes the row and detaches workspaces", async () => {
    prisma.ollama_connections.delete = jest.fn().mockResolvedValue({ id: 1 });
    prisma.workspaces.updateMany = jest
      .fn()
      .mockResolvedValue({ count: 3 });

    await expect(OllamaConnection.delete(1)).resolves.toBe(true);
    expect(prisma.ollama_connections.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.workspaces.updateMany).toHaveBeenCalledWith({
      where: { ollamaConnectionId: 1 },
      data: { ollamaConnectionId: null },
    });
  });

  it("returns false and swallows errors", async () => {
    prisma.ollama_connections.delete = jest
      .fn()
      .mockRejectedValue(new Error("nope"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(OllamaConnection.delete(1)).resolves.toBe(false);
    errorSpy.mockRestore();
  });
});

describe("OllamaConnection.workspaceCount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the count for a given connection id", async () => {
    prisma.workspaces.count = jest.fn().mockResolvedValue(4);
    await expect(OllamaConnection.workspaceCount(2)).resolves.toBe(4);
    expect(prisma.workspaces.count).toHaveBeenCalledWith({
      where: { ollamaConnectionId: 2 },
    });
  });

  it("returns 0 and swallows errors", async () => {
    prisma.workspaces.count = jest
      .fn()
      .mockRejectedValue(new Error("db down"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(OllamaConnection.workspaceCount(2)).resolves.toBe(0);
    errorSpy.mockRestore();
  });
});
