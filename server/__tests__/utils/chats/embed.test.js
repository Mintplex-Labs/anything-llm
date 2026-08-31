// `utils/http` reaches the auth stack on require; this suite exercises none of it.
jest.mock("jsonwebtoken", () => ({}));

// Force resolveLLMConnectorForEmbed into its catch branch so the function returns
// right after applying the overrides, which is the behavior under test.
jest.mock("../../../models/embedChats", () => ({
  EmbedChats: {
    forEmbedByUser: jest.fn().mockRejectedValue(new Error("no router in test")),
    count: jest.fn().mockResolvedValue(0),
  },
}));

// Modules in this import chain resolve storage paths at require time.
process.env.STORAGE_DIR = process.env.STORAGE_DIR || require("os").tmpdir();

const { streamChatWithForEmbed } = require("../../../utils/chats/embed");

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

const fakeResponse = () => ({ write: jest.fn() });

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
