jest.mock("../utils/prisma", () => ({
  local_ai_connections: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  workspaces: { count: jest.fn() },
  model_routers: { count: jest.fn() },
  model_router_rules: { count: jest.fn() },
}));

jest.mock("../utils/EncryptionManager", () => ({
  EncryptionManager: class EncryptionManager {
    encrypt(value) {
      return `encrypted:${value}`;
    }

    decrypt(value) {
      return value.replace("encrypted:", "");
    }
  },
}));

const prisma = require("../utils/prisma");
const { LocalAiConnection } = require("../models/localAiConnection");

const connection = {
  id: 1,
  name: "Local GPU",
  base_url: "http://localhost:8080/v1",
  api_key: "secret",
  model: "llama",
  token_limit: 8192,
};

beforeEach(() => jest.clearAllMocks());

describe("LocalAiConnection", () => {
  it("normalizes valid input and rejects invalid URLs", () => {
    expect(
      LocalAiConnection.validate({
        ...connection,
        base_url: "http://localhost:8080/v1/",
      }).data
    ).toMatchObject({
      base_url: "http://localhost:8080/v1",
      token_limit: 8192,
    });
    expect(
      LocalAiConnection.validate({ ...connection, base_url: "localhost" }).error
    ).toBe("Invalid base_url.");
  });

  it("never exposes API keys in connection summaries", async () => {
    prisma.local_ai_connections.findMany.mockResolvedValue([connection]);

    const connections = await LocalAiConnection.getAll();

    expect(connections).toEqual([
      expect.objectContaining({ id: 1, hasApiKey: true }),
    ]);
    expect(connections[0]).not.toHaveProperty("api_key");
  });

  it("encrypts API keys before persisting them", async () => {
    prisma.local_ai_connections.create.mockResolvedValue(connection);

    await LocalAiConnection.create(connection, 2);

    expect(prisma.local_ai_connections.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        api_key: "enc:encrypted:secret",
        created_by: 2,
      }),
    });
  });

  it("preserves an existing API key when an update omits it", async () => {
    prisma.local_ai_connections.update.mockResolvedValue(connection);

    await LocalAiConnection.update(1, { name: "Renamed" });

    expect(prisma.local_ai_connections.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.not.objectContaining({ api_key: expect.anything() }),
    });
  });

  it("prevents deleting a connection that is still referenced", async () => {
    prisma.workspaces.count.mockResolvedValue(1);
    prisma.model_routers.count.mockResolvedValue(0);
    prisma.model_router_rules.count.mockResolvedValue(0);

    await expect(LocalAiConnection.delete(1)).resolves.toEqual({
      success: false,
      error: "Connection is in use by a workspace or model router.",
    });
    expect(prisma.local_ai_connections.delete).not.toHaveBeenCalled();
  });
});
