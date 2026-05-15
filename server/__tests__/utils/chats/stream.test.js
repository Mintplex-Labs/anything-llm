/* eslint-env jest, node */
const { streamChatWithWorkspace } = require("../../../utils/chats/stream");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../../../utils/helpers");

// Mock dependencies
jest.mock("../../../models/workspaceChats");
jest.mock("../../../utils/helpers");
jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: class {
    constructor() {
      this.pinnedDocs = jest.fn().mockResolvedValue([]);
    }
  },
}));
jest.mock("../../../models/workspaceParsedFiles", () => ({
  WorkspaceParsedFiles: {
    getContextFiles: jest.fn().mockResolvedValue([]),
  },
}));
jest.mock("../../../utils/chats/index", () => ({
  grepCommand: jest.fn((msg) => msg),
  VALID_COMMANDS: {},
  chatPrompt: jest.fn().mockResolvedValue("System prompt"),
  recentChatHistory: jest.fn().mockResolvedValue({
    rawHistory: [],
    chatHistory: [],
  }),
  sourceIdentifier: jest.fn(() => "source-id"),
}));
jest.mock("../../../utils/chats/agents", () => ({
  grepAgents: jest.fn().mockResolvedValue(false),
}));

describe("streamChatWithWorkspace", () => {
  let mockResponse;
  let mockWorkspace;
  let mockLLMConnector;
  let mockVectorDb;

  beforeEach(() => {
    jest.clearAllMocks();

    mockResponse = {
      writable: true,
      destroyed: false,
      write: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
      end: jest.fn(),
    };

    mockWorkspace = {
      id: 1,
      slug: "test-workspace",
      chatMode: "chat",
      chatProvider: "openai",
      chatModel: "gpt-4",
      openAiHistory: 20,
      openAiTemp: 0.7,
    };

    mockLLMConnector = {
      promptWindowLimit: jest.fn().mockReturnValue(4000),
      compressMessages: jest.fn().mockResolvedValue([]),
      streamingEnabled: jest.fn().mockReturnValue(true),
      streamGetChatCompletion: jest.fn().mockResolvedValue({
        metrics: { completion_tokens: 10 },
      }),
      handleStream: jest.fn().mockResolvedValue("Complete response text"),
      defaultTemp: 0.7,
    };

    mockVectorDb = {
      hasNamespace: jest.fn().mockResolvedValue(true),
      namespaceCount: jest.fn().mockResolvedValue(1),
      performSimilaritySearch: jest.fn().mockResolvedValue({
        contextTexts: [],
        sources: [],
        message: null,
      }),
    };

    getLLMProvider.mockReturnValue(mockLLMConnector);
    getVectorDbClass.mockReturnValue(mockVectorDb);
    WorkspaceChats.new.mockResolvedValue({ chat: { id: 1 }, message: null });
  });

  test("should pass persistContext to handleStream", async () => {
    const thread = { id: 5, slug: "test-thread" };
    const user = { id: 2 };

    await streamChatWithWorkspace(
      mockResponse,
      mockWorkspace,
      "Hello",
      "chat",
      user,
      thread,
      []
    );

    expect(mockLLMConnector.handleStream).toHaveBeenCalledWith(
      mockResponse,
      expect.anything(),
      expect.objectContaining({
        persistContext: expect.objectContaining({
          workspaceId: 1,
          prompt: "Hello",
          threadId: 5,
          user,
          chatMode: "chat",
          attachments: [],
        }),
      })
    );
  });

  test("should persist response when handleStream returns text", async () => {
    mockLLMConnector.handleStream.mockResolvedValue("Complete response");

    await streamChatWithWorkspace(
      mockResponse,
      mockWorkspace,
      "Hello",
      "chat",
      null,
      null,
      []
    );

    expect(WorkspaceChats.new).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: 1,
        prompt: "Hello",
        response: expect.objectContaining({
          text: "Complete response",
          type: "chat",
        }),
      })
    );
  });

  test("should NOT persist when handleStream returns empty string (client disconnected)", async () => {
    mockLLMConnector.handleStream.mockResolvedValue("");

    await streamChatWithWorkspace(
      mockResponse,
      mockWorkspace,
      "Hello",
      "chat",
      null,
      null,
      []
    );

    expect(WorkspaceChats.new).not.toHaveBeenCalled();
  });

  test("should handle null thread correctly in persistContext", async () => {
    await streamChatWithWorkspace(
      mockResponse,
      mockWorkspace,
      "Hello",
      "chat",
      null,
      null,
      []
    );

    expect(mockLLMConnector.handleStream).toHaveBeenCalledWith(
      mockResponse,
      expect.anything(),
      expect.objectContaining({
        persistContext: expect.objectContaining({
          threadId: null,
        }),
      })
    );
  });

  test("should NOT persist when handleStream returns null (defensive fallback to empty string)", async () => {
    mockLLMConnector.handleStream.mockResolvedValue(null);

    await streamChatWithWorkspace(
      mockResponse,
      mockWorkspace,
      "Hello",
      "chat",
      null,
      null,
      []
    );

    // null || "" results in "", so length > 0 is false, should not persist
    expect(WorkspaceChats.new).not.toHaveBeenCalled();
  });

  test("should NOT persist when handleStream returns undefined", async () => {
    mockLLMConnector.handleStream.mockResolvedValue(undefined);

    await streamChatWithWorkspace(
      mockResponse,
      mockWorkspace,
      "Hello",
      "chat",
      null,
      null,
      []
    );

    // undefined || "" results in "", should not persist
    expect(WorkspaceChats.new).not.toHaveBeenCalled();
  });
});
