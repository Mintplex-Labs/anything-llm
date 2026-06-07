process.env.STORAGE_DIR = "test-storage";

const mockBuildIdentityEmpireRetrievalPlan = jest.fn();
const mockVectorDb = {
  hasNamespace: jest.fn(),
  namespaceCount: jest.fn(),
  performSimilaritySearch: jest.fn(),
};
const mockLLMConnector = {
  promptWindowLimit: jest.fn(() => 4000),
  compressMessages: jest.fn(async () => []),
  getChatCompletion: jest.fn(async () => ({
    textResponse: "Mock response",
    metrics: {},
  })),
  streamingEnabled: jest.fn(() => false),
  defaultTemp: 0.7,
};

jest.mock("../../../utils/swarmsy/identityEmpireRetrieval", () => ({
  buildIdentityEmpireRetrievalPlan: mockBuildIdentityEmpireRetrievalPlan,
}));

jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(() => mockVectorDb),
  resolveProviderConnector: jest.fn(async () => ({
    connector: mockLLMConnector,
    routingMetadata: null,
    prefetchedContext: null,
  })),
}));

jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: class {
    pinnedDocs = jest.fn(async () => []);
  },
}));

jest.mock("../../../models/workspaceParsedFiles", () => ({
  WorkspaceParsedFiles: {
    getContextFiles: jest.fn(async () => []),
  },
}));

jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: {
    new: jest.fn(async () => ({ chat: { id: 123 } })),
    markThreadHistoryInvalidV2: jest.fn(),
  },
}));

jest.mock("../../../utils/helpers/chat/responses", () => ({
  writeResponseChunk: jest.fn(),
}));

jest.mock("../../../utils/helpers/chat", () => ({
  fillSourceWindow: jest.fn(({ searchResults = [] }) => ({
    sources: searchResults,
    contextTexts: searchResults.map((source) => source.text),
  })),
}));

jest.mock("../../../utils/chats/agents", () => ({
  grepAgents: jest.fn(async () => false),
}));

jest.mock("../../../utils/chats/index", () => ({
  grepCommand: jest.fn(async (message) => message),
  grepAllSlashCommands: jest.fn(async (message) => message),
  VALID_COMMANDS: {},
  chatPrompt: jest.fn(async () => "system prompt"),
  recentChatHistory: jest.fn(async () => ({ rawHistory: [], chatHistory: [] })),
  sourceIdentifier: jest.fn((doc) => doc.title || "source"),
}));

jest.mock("../../../utils/agents/ephemeral", () => ({
  EphemeralAgentHandler: {
    isAgentInvocation: jest.fn(async () => false),
  },
  EphemeralEventListener: jest.fn(),
}));

jest.mock("../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));

jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(),
}));

jest.mock("../../../utils/files", () => ({
  hotdirPath: "/tmp/hotdir",
  normalizePath: jest.fn((value) => value),
  isWithin: jest.fn(() => true),
  sanitizeFileName: jest.fn((value) => value),
}));

const { streamChatWithWorkspace } = require("../../../utils/chats/stream");
const { ApiChatHandler } = require("../../../utils/chats/apiChatHandler");
const {
  buildIdentityEmpireRetrievalPlan,
} = require("../../../utils/swarmsy/identityEmpireRetrieval");

const workspace = {
  id: 1,
  slug: "test-workspace",
  chatMode: "chat",
  topN: 4,
};

function resetVectorDb({ embeddingsCount }) {
  mockVectorDb.hasNamespace.mockResolvedValue(embeddingsCount > 0);
  mockVectorDb.namespaceCount.mockResolvedValue(embeddingsCount);
  mockVectorDb.performSimilaritySearch.mockResolvedValue({
    contextTexts: [],
    sources: [],
    message: null,
  });
}

function responseStub() {
  return {
    write: jest.fn(),
    end: jest.fn(),
  };
}

describe("Identity Empire chat retrieval gating", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLLMConnector.streamingEnabled.mockReturnValue(false);
    mockBuildIdentityEmpireRetrievalPlan.mockResolvedValue({
      retrievalInput: "Identity Empire boosted query",
    });
  });

  it("stream chat path does not build an Identity Empire plan when embeddingsCount is 0", async () => {
    resetVectorDb({ embeddingsCount: 0 });

    await streamChatWithWorkspace(
      responseStub(),
      workspace,
      "Build my identity empire from nothing.",
      "chat"
    );

    expect(buildIdentityEmpireRetrievalPlan).not.toHaveBeenCalled();
    expect(mockVectorDb.performSimilaritySearch).not.toHaveBeenCalled();
  });

  it("sync API chat path does not build an Identity Empire plan when embeddingsCount is 0", async () => {
    resetVectorDb({ embeddingsCount: 0 });

    await ApiChatHandler.chatSync({
      workspace,
      message: "Build my PR angle.",
      mode: "chat",
    });

    expect(buildIdentityEmpireRetrievalPlan).not.toHaveBeenCalled();
    expect(mockVectorDb.performSimilaritySearch).not.toHaveBeenCalled();
  });

  it("streaming API chat path does not build an Identity Empire plan when embeddingsCount is 0", async () => {
    resetVectorDb({ embeddingsCount: 0 });

    await ApiChatHandler.streamChat({
      response: responseStub(),
      workspace,
      message: "Create my 30-day launch plan.",
      mode: "chat",
    });

    expect(buildIdentityEmpireRetrievalPlan).not.toHaveBeenCalled();
    expect(mockVectorDb.performSimilaritySearch).not.toHaveBeenCalled();
  });

  it("builds the plan and uses retrievalInput when embeddingsCount is greater than 0", async () => {
    resetVectorDb({ embeddingsCount: 3 });

    await ApiChatHandler.chatSync({
      workspace,
      message: "Build my digital wall distribution plan.",
      mode: "chat",
    });

    expect(buildIdentityEmpireRetrievalPlan).toHaveBeenCalledWith({
      workspace,
      prompt: "Build my digital wall distribution plan.",
    });
    expect(mockVectorDb.performSimilaritySearch).toHaveBeenCalledWith(
      expect.objectContaining({ input: "Identity Empire boosted query" })
    );
  });
});
