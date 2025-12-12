const { Workspace } = require("../../models/workspace");
const prisma = require("../../utils/prisma");

// Mock Prisma
jest.mock("../../utils/prisma", () => ({
  workspaces: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock WorkspaceUser to prevent issues in create
jest.mock("../../models/workspaceUsers", () => ({
  WorkspaceUser: {
    create: jest.fn(),
  },
}));

describe("Workspace Model - Connection/Provider Mutual Exclusion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Chat LLM Configuration Mutual Exclusion", () => {
    it("should clear legacy chatProvider fields when setting chatConnectionId", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatProvider: null,
        chatModel: null,
        chatConnectionId: 5,
        chatModelOverride: null,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatConnectionId: 5,
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatConnectionId: 5,
          chatProvider: null, // Should be cleared
          chatModel: null, // Should be cleared
        },
      });
    });

    it("should clear chatConnectionId fields when setting legacy chatProvider", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatProvider: "openai",
        chatModel: "gpt-4",
        chatConnectionId: null,
        chatModelOverride: null,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatProvider: "openai",
        chatModel: "gpt-4",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatProvider: "openai",
          chatModel: "gpt-4",
          chatConnectionId: null, // Should be cleared
          chatModelOverride: null, // Should be cleared
        },
      });
    });

    it("should NOT clear fields when chatConnectionId is null", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatConnectionId: null,
        name: "Updated Name",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatConnectionId: null,
          name: "Updated Name",
          // Should NOT clear chatProvider/chatModel since connectionId is null
        },
      });
    });

    it("should NOT clear fields when chatConnectionId is undefined", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        name: "Updated Name",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: "Updated Name",
          // Should NOT add any clearing logic
        },
      });
    });

    it("should handle switching from connection to 'default' chatProvider", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatProvider: null,
        chatModel: null,
        chatConnectionId: null,
        chatModelOverride: null,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatProvider: "default", // This is treated as unsetting
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatProvider: null, // "default" gets converted to null
          chatModel: null, // Should be cleared when unsetting provider
          // chatConnectionId and chatModelOverride should NOT be cleared for "default"
        },
      });
    });
  });

  describe("Agent LLM Configuration Mutual Exclusion", () => {
    it("should clear legacy agentProvider fields when setting agentConnectionId", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        agentProvider: null,
        agentModel: null,
        agentConnectionId: 7,
        agentModelOverride: null,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        agentConnectionId: 7,
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          agentConnectionId: 7,
          agentProvider: null, // Should be cleared
          agentModel: null, // Should be cleared
        },
      });
    });

    it("should clear agentConnectionId fields when setting legacy agentProvider", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        agentProvider: "anthropic",
        agentModel: "claude-3-opus",
        agentConnectionId: null,
        agentModelOverride: null,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        agentProvider: "anthropic",
        agentModel: "claude-3-opus",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          agentProvider: "anthropic",
          agentModel: "claude-3-opus",
          agentConnectionId: null, // Should be cleared
          agentModelOverride: null, // Should be cleared
        },
      });
    });

    it("should NOT clear fields when agentConnectionId is null", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        agentConnectionId: null,
        name: "Updated Name",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          agentConnectionId: null,
          name: "Updated Name",
          // Should NOT clear agentProvider/agentModel since connectionId is null
        },
      });
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle updating both chat and agent configurations simultaneously", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatProvider: null,
        chatModel: null,
        chatConnectionId: 5,
        chatModelOverride: null,
        agentProvider: "anthropic",
        agentModel: "claude-3-opus",
        agentConnectionId: null,
        agentModelOverride: null,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatConnectionId: 5, // Switch chat to connection
        agentProvider: "anthropic", // Switch agent to legacy provider
        agentModel: "claude-3-opus",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatConnectionId: 5,
          chatProvider: null, // Cleared because of chatConnectionId
          chatModel: null, // Cleared because of chatConnectionId
          agentProvider: "anthropic",
          agentModel: "claude-3-opus",
          agentConnectionId: null, // Cleared because of agentProvider
          agentModelOverride: null, // Cleared because of agentProvider
        },
      });
    });

    it("should handle empty string chatProvider correctly", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatProvider: "", // Empty string should be treated as null
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      // Empty string gets validated to null, which shouldn't trigger clearing
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatProvider: null,
          // Should NOT clear connectionId fields
        },
      });
    });

    it("should handle updating only chatModel without changing chatProvider", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatModel: "gpt-4-turbo",
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatModel: "gpt-4-turbo",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatModel: "gpt-4-turbo",
          // Should NOT clear any fields
        },
      });
    });

    it("should handle updating chatModelOverride without changing chatConnectionId", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatModelOverride: "gpt-4o",
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatModelOverride: "gpt-4o",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatModelOverride: "gpt-4o",
          // Should NOT clear any fields
        },
      });
    });

    it("should handle switching from connection to connection (updating ID)", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatConnectionId: 10,
        chatProvider: null,
        chatModel: null,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatConnectionId: 10, // Switching to different connection
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatConnectionId: 10,
          chatProvider: null, // Still cleared (defensive)
          chatModel: null, // Still cleared (defensive)
        },
      });
    });

    it("should validate and filter invalid fields before applying exclusion logic", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatConnectionId: 5,
        invalidField: "should be ignored",
        anotherInvalid: 123,
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatConnectionId: 5,
          chatProvider: null,
          chatModel: null,
          // Invalid fields should NOT be present
        },
      });

      // Verify invalid fields were not included
      const callArgs = prisma.workspaces.update.mock.calls[0][0];
      expect(callArgs.data).not.toHaveProperty("invalidField");
      expect(callArgs.data).not.toHaveProperty("anotherInvalid");
    });
  });

  describe("Edge Cases", () => {
    it("should handle no updates gracefully", async () => {
      const updates = {};

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toEqual({ id: 1 });
      expect(message).toBe("No valid fields to update!");
      expect(prisma.workspaces.update).not.toHaveBeenCalled();
    });

    it("should handle only invalid fields gracefully", async () => {
      const updates = {
        invalidField: "test",
        anotherInvalid: 123,
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toEqual({ id: 1 });
      expect(message).toBe("No valid fields to update!");
      expect(prisma.workspaces.update).not.toHaveBeenCalled();
    });

    it("should throw error when id is not provided", async () => {
      const updates = { chatConnectionId: 5 };

      await expect(Workspace.update(null, updates)).rejects.toThrow(
        "No workspace id provided for update"
      );
      expect(prisma.workspaces.update).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      prisma.workspaces.update.mockRejectedValue(dbError);

      const updates = { chatConnectionId: 5 };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeNull();
      expect(message).toBe("Database connection failed");
    });

    it("should handle chatProvider = 'none' correctly", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatProvider: null,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatProvider: "none", // Should be validated to null
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatProvider: null, // "none" gets converted to null
        },
      });
    });
  });

  describe("Type Validation", () => {
    it("should parse chatConnectionId as integer", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
        chatConnectionId: 42,
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatConnectionId: "42", // String should be parsed to int
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatConnectionId: 42, // Should be number
          chatProvider: null,
          chatModel: null,
        },
      });
    });

    it("should handle invalid chatConnectionId gracefully", async () => {
      const mockWorkspace = {
        id: 1,
        name: "Test Workspace",
        slug: "test-workspace",
      };

      prisma.workspaces.update.mockResolvedValue(mockWorkspace);

      const updates = {
        chatConnectionId: "not-a-number", // Invalid number
        name: "Updated Name",
      };

      const { workspace, message } = await Workspace.update(1, updates);

      expect(workspace).toBeDefined();
      expect(message).toBeNull();
      expect(prisma.workspaces.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          chatConnectionId: null, // Invalid parsed to null
          name: "Updated Name",
          // Should NOT trigger clearing since it's null
        },
      });
    });
  });
});
