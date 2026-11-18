// `utils/http` reaches the auth stack on require; this suite exercises none of it.
jest.mock("jsonwebtoken", () => ({}));

// Force resolveLLMConnectorForEmbed into its catch branch so the function returns
// right after applying the overrides, which is the behavior under test.
jest.mock("../../../models/embedChats", () => ({
  EmbedChats: {
    new: jest.fn().mockResolvedValue({ chat: { id: 1 }, message: null }),
    forEmbedByUser: jest.fn().mockRejectedValue(new Error("no router in test")),
    count: jest.fn().mockResolvedValue(0),
  },
}));

// Stub the provider, vector database and prompt so a chat can reach the save.
jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  resolveProviderConnector: jest.fn(),
}));
jest.mock("../../../utils/chats/index", () => ({
  chatPrompt: jest.fn(),
  sourceIdentifier: jest.fn(),
}));

// Modules in this import chain resolve storage paths at require time.
process.env.STORAGE_DIR = process.env.STORAGE_DIR || require("os").tmpdir();

const {
  streamChatWithForEmbed,
  invalidateActiveReplies,
} = require("../../../utils/chats/embed");
const { EmbedChats } = require("../../../models/embedChats");
const {
  getVectorDbClass,
  resolveProviderConnector,
} = require("../../../utils/helpers");

function embedConfig(overrides = {}) {
  return {
    id: 1,
    chat_mode: "chat",
    allow_prompt_override: true,
    allow_temperature_override: true,
    workspace: { slug: "ws", openAiPrompt: "Configured prompt.", openAiTemp: 0.3 },
    ...overrides,
  };
}

const fakeResponse = () => ({ write: jest.fn(), on: jest.fn(), locals: {} });

describe("streamChatWithForEmbed overrides", () => {
  it("keeps the workspace prompt and temperature when the request sends none", async () => {
    const embed = embedConfig();

    await streamChatWithForEmbed(fakeResponse(), embed, "hello", "session", {
      promptOverride: null,
      temperatureOverride: null,
    });

    expect(embed.workspace.openAiPrompt).toBe("Configured prompt.");
    expect(embed.workspace.openAiTemp).toBe(0.3);
  });

  it("applies the overrides the request does send", async () => {
    const embed = embedConfig();

    await streamChatWithForEmbed(fakeResponse(), embed, "hello", "session", {
      promptOverride: "Overridden prompt.",
      temperatureOverride: "0.9",
    });

    expect(embed.workspace.openAiPrompt).toBe("Overridden prompt.");
    expect(embed.workspace.openAiTemp).toBe(0.9);
  });

  it("applies an empty prompt override and a zero temperature", async () => {
    const embed = embedConfig();

    await streamChatWithForEmbed(fakeResponse(), embed, "hello", "session", {
      promptOverride: "",
      temperatureOverride: "0",
    });

    expect(embed.workspace.openAiPrompt).toBe("");
    expect(embed.workspace.openAiTemp).toBe(0);
  });

  it("ignores overrides the embed is not permitted to accept", async () => {
    const embed = embedConfig({
      allow_prompt_override: false,
      allow_temperature_override: false,
    });

    await streamChatWithForEmbed(fakeResponse(), embed, "hello", "session", {
      promptOverride: "Overridden prompt.",
      temperatureOverride: "0.9",
    });

    expect(embed.workspace.openAiPrompt).toBe("Configured prompt.");
    expect(embed.workspace.openAiTemp).toBe(0.3);
  });
});

describe("streamChatWithForEmbed saving the chat", () => {
  async function chatWithReply(
    textResponse,
    { streaming = true, whileStreaming } = {}
  ) {
    const response = fakeResponse();
    EmbedChats.forEmbedByUser.mockResolvedValueOnce([]);
    getVectorDbClass.mockReturnValue({
      hasNamespace: async () => false,
      namespaceCount: async () => 0,
    });
    resolveProviderConnector.mockResolvedValue({
      connector: {
        compressMessages: async () => [],
        streamingEnabled: () => streaming,
        streamGetChatCompletion: async () => ({ metrics: {} }),
        handleStream: async () => {
          whileStreaming?.();
          return textResponse;
        },
        getChatCompletion: async () => ({ textResponse, metrics: {} }),
      },
      routingMetadata: null,
      prefetchedContext: { pinnedDocs: [] },
    });
    await streamChatWithForEmbed(
      response,
      embedConfig(),
      "hello",
      "session",
      {}
    );
    return response;
  }

  const sentChatId = (response) =>
    response.write.mock.calls.some(([chunk]) =>
      chunk.includes("finalizeResponseStream")
    );

  beforeEach(() => EmbedChats.new.mockClear());

  it("saves the reply the model streamed", async () => {
    await chatWithReply("An answer.");
    expect(EmbedChats.new).toHaveBeenCalledTimes(1);
    expect(EmbedChats.new.mock.calls[0][0].response.text).toBe("An answer.");
  });

  it("sends the saved chat id once the reply is stored", async () => {
    const response = await chatWithReply("An answer.");
    expect(EmbedChats.new.mock.calls[0][0].include).toBe(true);
    expect(sentChatId(response)).toBe(true);
  });

  it("stores the reply as invalidated when its session is reset mid-stream", async () => {
    const response = await chatWithReply("An answer.", {
      whileStreaming: () => invalidateActiveReplies(1, "session"),
    });
    expect(EmbedChats.new.mock.calls[0][0].include).toBe(false);
    expect(sentChatId(response)).toBe(false);
  });

  it("keeps the reply when another session is reset mid-stream", async () => {
    await chatWithReply("An answer.", {
      whileStreaming: () => invalidateActiveReplies(1, "other-session"),
    });
    expect(EmbedChats.new.mock.calls[0][0].include).toBe(true);
  });

  it("saves nothing when the stream produced no text", async () => {
    await chatWithReply("");
    expect(EmbedChats.new).not.toHaveBeenCalled();
  });

  it("saves nothing when a non-streaming reply is empty", async () => {
    await chatWithReply("", { streaming: false });
    expect(EmbedChats.new).not.toHaveBeenCalled();
  });
});

describe("streamChatWithForEmbed chat history", () => {
  beforeEach(() => EmbedChats.forEmbedByUser.mockClear());

  it("loads the embed's message history limit when the model router is used", async () => {
    EmbedChats.forEmbedByUser.mockResolvedValueOnce([]);
    getVectorDbClass.mockReturnValue({
      hasNamespace: async () => false,
      namespaceCount: async () => 0,
    });
    // A prefetched context is what the model router hands back.
    resolveProviderConnector.mockResolvedValue({
      connector: {
        compressMessages: async () => [],
        streamingEnabled: () => true,
        streamGetChatCompletion: async () => ({ metrics: {} }),
        handleStream: async () => "",
      },
      routingMetadata: null,
      prefetchedContext: { pinnedDocs: [] },
    });

    const embed = embedConfig({ message_limit: 5 });
    embed.workspace.openAiHistory = 30;
    await streamChatWithForEmbed(fakeResponse(), embed, "hello", "session", {});

    expect(EmbedChats.forEmbedByUser).toHaveBeenCalledTimes(1);
    expect(EmbedChats.forEmbedByUser.mock.calls[0][2]).toBe(5);
  });
});
