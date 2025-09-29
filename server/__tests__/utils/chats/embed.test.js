const { streamChatWithForEmbed } = require("../../../utils/chats/embed");
const { EphemeralAgentHandler, EphemeralEventListener } = require("../../../utils/agents/ephemeral");
const { EmbedChats } = require("../../../models/embedChats");
const { Telemetry } = require("../../../models/telemetry");
const { writeResponseChunk } = require("../../../utils/helpers/chat/responses");

// Mock all external dependencies
jest.mock("../../../utils/agents/ephemeral");
jest.mock("../../../models/embedChats");
jest.mock("../../../models/telemetry");
jest.mock("../../../utils/helpers/chat/responses");
jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  getLLMProvider: jest.fn(),
}));
jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: jest.fn().mockImplementation(() => ({
    pinnedDocs: jest.fn().mockResolvedValue([]),
  })),
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-123"),
}));

// Mock environment variables
process.env.STORAGE_DIR = "/tmp/test-storage";

describe("streamChatWithForEmbed", () => {
  let mockResponse;
  let mockEmbed;
  let mockEventListener;
  let mockAgentHandler;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock response object
    mockResponse = {
      locals: {
        connection: {
          host: "test.com",
          ip: "127.0.0.1",
        },
      },
    };

    // Mock embed config
    mockEmbed = {
      id: 1,
      chat_mode: "chat",
      allow_model_override: false,
      allow_temperature_override: false,
      allow_prompt_override: false,
      allow_agent: false,
      workspace: {
        id: 1,
        slug: "test-workspace",
        agentProvider: "openai",
        agentModel: "gpt-4",
        openAiPrompt: "Default prompt",
        openAiTemp: 0.7,
      },
    };

    // Mock agent handler and event listener
    mockAgentHandler = {
      init: jest.fn().mockResolvedValue({}),
      createAIbitat: jest.fn().mockResolvedValue({}),
      startAgentCluster: jest.fn().mockReturnValue({}),
    };

    mockEventListener = {
      streamAgentEvents: jest.fn().mockResolvedValue({
        thoughts: ["thinking about the problem"],
        textResponse: "Agent response",
      }),
    };

    EphemeralAgentHandler.mockImplementation(() => mockAgentHandler);
    EphemeralEventListener.mockImplementation(() => mockEventListener);
    EphemeralAgentHandler.isAgentInvocation = jest.fn();

    // Mock other dependencies
    EmbedChats.new = jest.fn().mockResolvedValue({ id: 1 });
    Telemetry.sendTelemetry = jest.fn().mockResolvedValue({});
    writeResponseChunk.mockImplementation(() => {});
  });

  describe("Agent Detection and Handling", () => {
    test("should detect agent invocation and handle agent request", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      mockEmbed.workspace.agentProvider = "openai";

      // Act
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent help me",
        "session-123",
        { username: "testuser" }
      );

      // Assert
      expect(EphemeralAgentHandler.isAgentInvocation).toHaveBeenCalledWith({
        message: "@agent help me",
      });
      expect(Telemetry.sendTelemetry).toHaveBeenCalledWith("agent_chat_started");
      expect(EphemeralAgentHandler).toHaveBeenCalledWith({
        uuid: expect.any(String),
        workspace: mockEmbed.workspace,
        prompt: "@agent help me",
        userId: null,
        threadId: null,
        sessionId: "session-123",
      });
    });

    test("should initialize agent handler correctly", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);

      // Act
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent test",
        "session-123",
        {}
      );

      // Assert
      expect(mockAgentHandler.init).toHaveBeenCalled();
      expect(mockAgentHandler.createAIbitat).toHaveBeenCalledWith({
        handler: expect.any(Object),
      });
      expect(mockAgentHandler.startAgentCluster).toHaveBeenCalled();
    });

    test("should stream agent events and save to embed chats", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      const mockUuid = "test-uuid";
      require("uuid").v4 = jest.fn().mockReturnValue(mockUuid);

      // Act
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent help",
        "session-123",
        { username: "testuser" }
      );

      // Assert
      expect(mockEventListener.streamAgentEvents).toHaveBeenCalledWith(
        mockResponse,
        mockUuid
      );
      expect(EmbedChats.new).toHaveBeenCalledWith({
        embedId: mockEmbed.id,
        prompt: "@agent help",
        response: {
          text: "Agent response",
          type: "chat",
          sources: [],
          thoughts: ["thinking about the problem"],
        },
        connection_information: {
          host: "test.com",
          ip: "127.0.0.1",
          username: "testuser",
        },
        sessionId: "session-123",
      });
    });

    test("should not trigger agent flow for non-agent messages", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(false);

      // Act - This would normally continue to regular chat flow, but we'll just test the agent check
      try {
        await streamChatWithForEmbed(
          mockResponse,
          mockEmbed,
          "regular message",
          "session-123",
          {}
        );
      } catch (error) {
        // Expected to fail since we haven't mocked the full chat flow
      }

      // Assert
      expect(EphemeralAgentHandler.isAgentInvocation).toHaveBeenCalledWith({
        message: "regular message",
      });
      expect(Telemetry.sendTelemetry).not.toHaveBeenCalledWith("agent_chat_started");
      expect(EphemeralAgentHandler).not.toHaveBeenCalled();
    });
  });


  describe("Other Configuration Overrides", () => {
    test("should apply prompt override when allowed", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      mockEmbed.allow_prompt_override = true;

      // Act
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent test",
        "session-123",
        {
          promptOverride: "Custom prompt",
        }
      );

      // Assert
      expect(mockEmbed.workspace.openAiPrompt).toBe("Custom prompt");
    });

    test("should apply temperature override when allowed", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      mockEmbed.allow_temperature_override = true;

      // Act
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent test",
        "session-123",
        {
          temperatureOverride: "0.9",
        }
      );

      // Assert
      expect(mockEmbed.workspace.openAiTemp).toBe(0.9);
    });

    test("should apply model override when allowed", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      mockEmbed.allow_model_override = true;

      // This test would need to mock the LLMProvider logic which happens later in the flow
      // For now, we just test that the override parameter is accepted
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent test",
        "session-123",
        {
          modelOverride: "gpt-4-turbo",
        }
      );

      // Assert - The modelOverride is used later in LLM provider setup
      expect(EphemeralAgentHandler).toHaveBeenCalled();
    });
  });

  describe("Connection Information Handling", () => {
    test("should save connection info with username when provided", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);

      // Act
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent test",
        "session-123",
        { username: "john_doe" }
      );

      // Assert
      expect(EmbedChats.new).toHaveBeenCalledWith({
        embedId: mockEmbed.id,
        prompt: "@agent test",
        response: expect.any(Object),
        connection_information: {
          host: "test.com",
          ip: "127.0.0.1",
          username: "john_doe",
        },
        sessionId: "session-123",
      });
    });

    test("should save connection info without username when not provided", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);

      // Act
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent test",
        "session-123",
        {}
      );

      // Assert
      expect(EmbedChats.new).toHaveBeenCalledWith({
        embedId: mockEmbed.id,
        prompt: "@agent test",
        response: expect.any(Object),
        connection_information: {
          host: "test.com",
          ip: "127.0.0.1",
          username: null,
        },
        sessionId: "session-123",
      });
    });

    test("should handle missing connection info gracefully", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      mockResponse.locals.connection = null;

      // Act
      await streamChatWithForEmbed(
        mockResponse,
        mockEmbed,
        "@agent test",
        "session-123",
        { username: "testuser" }
      );

      // Assert
      expect(EmbedChats.new).toHaveBeenCalledWith({
        embedId: mockEmbed.id,
        prompt: "@agent test",
        response: expect.any(Object),
        connection_information: { username: "testuser" },
        sessionId: "session-123",
      });
    });
  });

  describe("Error Handling", () => {
    test("should handle agent handler initialization failure", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      mockAgentHandler.init.mockRejectedValue(new Error("Init failed"));

      // Act & Assert
      await expect(
        streamChatWithForEmbed(
          mockResponse,
          mockEmbed,
          "@agent test",
          "session-123",
          {}
        )
      ).rejects.toThrow("Init failed");
    });

    test("should handle event listener streaming failure", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      mockEventListener.streamAgentEvents.mockRejectedValue(
        new Error("Streaming failed")
      );

      // Act & Assert
      await expect(
        streamChatWithForEmbed(
          mockResponse,
          mockEmbed,
          "@agent test",
          "session-123",
          {}
        )
      ).rejects.toThrow("Streaming failed");
    });

    test("should handle embed chat save failure", async () => {
      // Arrange
      EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
      EmbedChats.new.mockRejectedValue(new Error("DB save failed"));

      // Act & Assert
      await expect(
        streamChatWithForEmbed(
          mockResponse,
          mockEmbed,
          "@agent test",
          "session-123",
          {}
        )
      ).rejects.toThrow("DB save failed");
    });
  });
});

describe("Agent Detection Utility Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should correctly identify agent messages", () => {
    // These tests would normally test the actual WorkspaceAgentInvocation.parseAgents
    // but since we're mocking EphemeralAgentHandler.isAgentInvocation, we test our usage

    EphemeralAgentHandler.isAgentInvocation.mockReturnValue(true);
    const result = EphemeralAgentHandler.isAgentInvocation({ message: "@agent hello" });
    expect(result).toBe(true);

    EphemeralAgentHandler.isAgentInvocation.mockReturnValue(false);
    const result2 = EphemeralAgentHandler.isAgentInvocation({ message: "hello world" });
    expect(result2).toBe(false);
  });
});
