/* eslint-env jest */
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { where: jest.fn(async () => []), new: jest.fn() },
}));
jest.mock("../../../models/slashCommandsPresets", () => ({
  SlashCommandPresets: {
    getUserPresets: jest.fn(async () => [
      { command: "/tldr", prompt: "Summarize this in three bullet points:" },
    ]),
  },
}));
jest.mock("../../../models/systemPromptVariables", () => ({
  SystemPromptVariables: {
    expandSystemPromptVariables: jest.fn(async (prompt) => prompt),
  },
}));
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { saneDefaultSystemPrompt: "You are a helpful assistant." },
}));
jest.mock("../../../utils/memories", () => ({
  promptWithMemories: jest.fn(async ({ systemPrompt }) => systemPrompt),
}));
jest.mock("../../../utils/chats/commands/reset", () => ({}));
jest.mock("../../../utils/chats/commands/img", () => ({}));
jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  resolveProviderConnector: jest.fn(),
}));
jest.mock("../../../utils/helpers/modelPricing", () => ({
  addChatCostToMetrics: jest.fn((metrics) => metrics),
}));
jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: jest.fn(() => ({ pinnedDocs: async () => [] })),
}));
jest.mock("../../../utils/agents", () => ({
  AgentHandler: { isAgentInvocation: jest.fn() },
}));
jest.mock("../../../utils/telegramBot/chat/agent", () => ({
  handleAgentResponse: jest.fn(),
}));
jest.mock("../../../utils/telegramBot/utils", () => ({
  editMessage: jest.fn(),
  sendFormattedMessage: jest.fn(),
}));
jest.mock("../../../utils/telegramBot/utils/media", () => ({
  sendVoiceResponse: jest.fn(),
}));

const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  getVectorDbClass,
  resolveProviderConnector,
} = require("../../../utils/helpers");
const { AgentHandler } = require("../../../utils/agents");
const {
  handleAgentResponse,
} = require("../../../utils/telegramBot/chat/agent");
const { streamResponse } = require("../../../utils/telegramBot/chat/stream");

const workspace = { id: 1, slug: "my-workspace", chatMode: "chat" };
const expanded = "Summarize this in three bullet points: the meeting notes";

function buildCtx() {
  return {
    bot: {
      sendChatAction: jest.fn(async () => {}),
      sendMessage: jest.fn(async () => ({ message_id: 1 })),
    },
    log: jest.fn(),
  };
}

function buildConnector() {
  return {
    promptWindowLimit: () => 8192,
    compressMessages: jest.fn(async () => []),
    streamingEnabled: () => false,
    getChatCompletion: jest.fn(async () => ({
      textResponse: "Here is the summary.",
      metrics: {},
    })),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  getVectorDbClass.mockReturnValue({ namespaceCount: async () => 0 });
});

describe("Telegram streamResponse slash command presets", () => {
  test("sends the preset prompt to the LLM and stores the message as typed", async () => {
    const connector = buildConnector();
    resolveProviderConnector.mockResolvedValue({ connector });
    AgentHandler.isAgentInvocation.mockResolvedValue(false);

    await streamResponse({
      ctx: buildCtx(),
      chatId: 123,
      workspace,
      message: "/tldr the meeting notes",
    });

    expect(resolveProviderConnector.mock.calls[0][0].prompt).toBe(expanded);
    expect(connector.compressMessages.mock.calls[0][0].userPrompt).toBe(
      expanded
    );
    expect(WorkspaceChats.new.mock.calls[0][0].prompt).toBe(
      "/tldr the meeting notes"
    );
  });

  test("sends the preset prompt to the agent", async () => {
    AgentHandler.isAgentInvocation.mockResolvedValue(true);

    await streamResponse({
      ctx: buildCtx(),
      chatId: 123,
      workspace,
      message: "/tldr the meeting notes",
    });

    expect(AgentHandler.isAgentInvocation.mock.calls[0][0].message).toBe(
      expanded
    );
    expect(handleAgentResponse.mock.calls[0][4]).toBe(expanded);
  });
});
