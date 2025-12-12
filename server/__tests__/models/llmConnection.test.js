// Set up environment variables for tests
process.env.STORAGE_DIR = "test-storage"; // needed for tests to run

const { LLMConnection } = require("../../models/llmConnection");
const prisma = require("../../utils/prisma");
const { LLMConfigEncryption } = require("../../utils/LLMConfigEncryption");

// Mock Prisma
jest.mock("../../utils/prisma", () => ({
  llm_connections: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  workspaces: {
    count: jest.fn(),
  },
}));

describe("LLMConnection Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a connection with encrypted API key", async () => {
      const mockConfig = {
        basePath: "http://test.com",
        apiKey: "sk-test-123",
        defaultModel: "gpt-3.5-turbo",
      };

      const mockCreatedConnection = {
        id: 1,
        name: "Test LiteLLM",
        provider: "litellm",
        config: JSON.stringify({
          basePath: "http://test.com",
          apiKey: "encrypted-value",
          apiKey_encrypted: true,
          defaultModel: "gpt-3.5-turbo",
        }),
        isDefault: false,
        isActive: true,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      prisma.llm_connections.create.mockResolvedValue(mockCreatedConnection);
      prisma.llm_connections.updateMany.mockResolvedValue({ count: 0 });

      const { connection, error } = await LLMConnection.create({
        name: "Test LiteLLM",
        provider: "litellm",
        config: mockConfig,
      });

      expect(error).toBeNull();
      expect(connection).toBeDefined();
      expect(connection.name).toBe("Test LiteLLM");
      expect(prisma.llm_connections.create).toHaveBeenCalled();

      // Verify config was encrypted before saving
      const createCall = prisma.llm_connections.create.mock.calls[0][0];
      const savedConfig = JSON.parse(createCall.data.config);
      expect(savedConfig.apiKey).not.toBe("sk-test-123");
    });

    it("should unset other defaults when creating a default connection", async () => {
      prisma.llm_connections.create.mockResolvedValue({
        id: 2,
        name: "Default LiteLLM",
        provider: "litellm",
        config: JSON.stringify({ basePath: "http://default.com" }),
        isDefault: true,
        isActive: true,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      });
      prisma.llm_connections.updateMany.mockResolvedValue({ count: 1 });

      await LLMConnection.create({
        name: "Default LiteLLM",
        provider: "litellm",
        config: { basePath: "http://default.com" },
        isDefault: true,
      });

      expect(prisma.llm_connections.updateMany).toHaveBeenCalledWith({
        where: { provider: "litellm", isDefault: true },
        data: { isDefault: false },
      });
    });

    it("should fail when required fields are missing", async () => {
      const { connection, error } = await LLMConnection.create({
        name: "Test",
      });

      expect(connection).toBeNull();
      expect(error).toContain("Name, provider, and config are required");
    });
  });

  describe("get", () => {
    it("should retrieve and decrypt a connection", async () => {
      const mockConnection = {
        id: 1,
        name: "Test LiteLLM",
        provider: "litellm",
        config: JSON.stringify({
          basePath: "http://test.com",
          apiKey: "encrypted-value",
          apiKey_encrypted: true,
          defaultModel: "gpt-3.5-turbo",
        }),
        isDefault: false,
        isActive: true,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      prisma.llm_connections.findUnique.mockResolvedValue(mockConnection);

      const connection = await LLMConnection.get(1);

      expect(connection).toBeDefined();
      expect(connection.id).toBe(1);
      expect(connection.name).toBe("Test LiteLLM");
      expect(prisma.llm_connections.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null when connection not found", async () => {
      prisma.llm_connections.findUnique.mockResolvedValue(null);

      const connection = await LLMConnection.get(999);

      expect(connection).toBeNull();
    });
  });

  describe("getDefault", () => {
    it("should retrieve the default connection for a provider", async () => {
      const mockConnection = {
        id: 1,
        name: "Default LiteLLM",
        provider: "litellm",
        config: JSON.stringify({ basePath: "http://default.com" }),
        isDefault: true,
        isActive: true,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      prisma.llm_connections.findFirst.mockResolvedValue(mockConnection);

      const connection = await LLMConnection.getDefault("litellm");

      expect(connection).toBeDefined();
      expect(connection.isDefault).toBe(true);
      expect(prisma.llm_connections.findFirst).toHaveBeenCalledWith({
        where: { provider: "litellm", isDefault: true, isActive: true },
      });
    });

    it("should return null when no default exists", async () => {
      prisma.llm_connections.findFirst.mockResolvedValue(null);

      const connection = await LLMConnection.getDefault("ollama");

      expect(connection).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a connection", async () => {
      const mockExisting = {
        id: 1,
        name: "Test LiteLLM",
        provider: "litellm",
        config: JSON.stringify({ basePath: "http://old.com" }),
        isDefault: false,
        isActive: true,
      };

      const mockUpdated = {
        ...mockExisting,
        name: "Updated LiteLLM",
        lastUpdatedAt: new Date(),
      };

      prisma.llm_connections.findUnique.mockResolvedValue(mockExisting);
      prisma.llm_connections.update.mockResolvedValue(mockUpdated);

      const { connection, error } = await LLMConnection.update(1, {
        name: "Updated LiteLLM",
      });

      expect(error).toBeNull();
      expect(connection.name).toBe("Updated LiteLLM");
      expect(prisma.llm_connections.update).toHaveBeenCalled();
    });

    it("should encrypt config when updating", async () => {
      const mockExisting = {
        id: 1,
        provider: "litellm",
        config: JSON.stringify({ basePath: "http://old.com" }),
      };

      prisma.llm_connections.findUnique.mockResolvedValue(mockExisting);
      prisma.llm_connections.update.mockResolvedValue({
        ...mockExisting,
        config: JSON.stringify({
          basePath: "http://new.com",
          apiKey: "encrypted-new",
          apiKey_encrypted: true,
        }),
      });

      const { connection, error } = await LLMConnection.update(1, {
        config: {
          basePath: "http://new.com",
          apiKey: "sk-new-key",
        },
      });

      expect(error).toBeNull();
      const updateCall = prisma.llm_connections.update.mock.calls[0][0];
      const savedConfig = JSON.parse(updateCall.data.config);
      expect(savedConfig.apiKey).not.toBe("sk-new-key");
    });
  });

  describe("delete", () => {
    it("should soft delete a connection not in use", async () => {
      prisma.workspaces.count
        .mockResolvedValueOnce(0) // chatConnectionId count
        .mockResolvedValueOnce(0); // agentConnectionId count

      prisma.llm_connections.update.mockResolvedValue({
        id: 1,
        isActive: false,
      });

      const { success, error } = await LLMConnection.delete(1);

      expect(success).toBe(true);
      expect(error).toBeNull();
      expect(prisma.llm_connections.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ isActive: false }),
      });
    });

    it("should prevent deletion of connection in use", async () => {
      prisma.workspaces.count
        .mockResolvedValueOnce(2) // chatConnectionId count
        .mockResolvedValueOnce(0); // agentConnectionId count

      const { success, error } = await LLMConnection.delete(1);

      expect(success).toBe(false);
      expect(error).toContain("in use by 2 workspace");
      expect(prisma.llm_connections.update).not.toHaveBeenCalled();
    });
  });

  describe("setAsDefault", () => {
    it("should set a connection as default and unset others", async () => {
      const mockConnection = {
        id: 1,
        provider: "litellm",
      };

      prisma.llm_connections.findUnique.mockResolvedValue(mockConnection);
      prisma.llm_connections.updateMany.mockResolvedValue({ count: 1 });
      prisma.llm_connections.update.mockResolvedValue({
        ...mockConnection,
        isDefault: true,
      });

      const { success, error } = await LLMConnection.setAsDefault(1);

      expect(success).toBe(true);
      expect(error).toBeNull();
      expect(prisma.llm_connections.updateMany).toHaveBeenCalledWith({
        where: {
          provider: "litellm",
          isDefault: true,
          id: { not: 1 },
        },
        data: { isDefault: false },
      });
      expect(prisma.llm_connections.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ isDefault: true }),
      });
    });
  });

  describe("where", () => {
    it("should retrieve multiple connections with decrypted configs", async () => {
      const mockConnections = [
        {
          id: 1,
          name: "Test 1",
          provider: "litellm",
          config: JSON.stringify({ basePath: "http://test1.com" }),
          isDefault: false,
          isActive: true,
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
        },
        {
          id: 2,
          name: "Test 2",
          provider: "ollama",
          config: JSON.stringify({ baseUrl: "http://test2.com" }),
          isDefault: true,
          isActive: true,
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
        },
      ];

      prisma.llm_connections.findMany.mockResolvedValue(mockConnections);

      const connections = await LLMConnection.where({ isActive: true });

      expect(connections).toHaveLength(2);
      expect(connections[0].name).toBe("Test 1");
      expect(connections[1].name).toBe("Test 2");
    });
  });

  describe("count", () => {
    it("should count connections matching a clause", async () => {
      prisma.llm_connections.count.mockResolvedValue(5);

      const count = await LLMConnection.count({ provider: "litellm" });

      expect(count).toBe(5);
      expect(prisma.llm_connections.count).toHaveBeenCalledWith({
        where: { provider: "litellm" },
      });
    });
  });
});
