/* eslint-env jest, node */

jest.mock("../../../utils/prisma", () => ({
  workspace_chats: { create: jest.fn(), upsert: jest.fn() },
}));
jest.mock("../../../utils/http", () => ({ safeJsonParse: JSON.parse }));
jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: jest.fn().mockImplementation(() => ({
    pinnedDocs: async () => [],
  })),
}));
jest.mock("../../../models/workspaceParsedFiles", () => ({
  WorkspaceParsedFiles: { getContextFiles: async () => [] },
}));
jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: () => ({
    hasNamespace: async () => false,
    namespaceCount: async () => 0,
  }),
  resolveProviderConnector: jest.fn(),
}));
jest.mock("../../../utils/helpers/modelPricing", () => ({
  addChatCostToMetrics: (metrics) => metrics,
}));
jest.mock("../../../utils/helpers/abortSignals", () => ({
  abortConnectorOnClientDisconnect: jest.fn(),
}));
jest.mock("../../../utils/chats/agents", () => ({
  grepAgents: async () => false,
}));
jest.mock("../../../utils/chats/index", () => ({
  grepCommand: async (message) => message,
  VALID_COMMANDS: {},
  chatPrompt: async () => "",
  recentChatHistory: async () => ({ rawHistory: [], chatHistory: [] }),
}));
jest.mock("../../../utils/helpers/reasoningEffort", () => ({
  resolveReasoningEffort: async () => null,
  usesModelRouter: () => false,
}));
jest.mock("../../../utils/helpers/chat", () => ({
  fillSourceWindow: () => ({ contextTexts: [], sources: [] }),
}));

const prisma = require("../../../utils/prisma");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { resolveProviderConnector } = require("../../../utils/helpers");
const { streamChatWithWorkspace } = require("../../../utils/chats/stream");

// Keep the real WorkspaceChats model and SSE serializer: mocking the model's
// return value would hide a mismatch between Prisma's record and our wrapper.
describe("workspace chat completion IDs (#6874)", () => {
  const workspace = { id: 1, slug: "test-workspace" };
  const user = { id: 2 };
  const thread = { id: 3 };
  let connector;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    prisma.workspace_chats.create.mockImplementation(async ({ data }) => ({
      id: 42,
      ...data,
    }));
    prisma.workspace_chats.upsert.mockImplementation(
      async ({ where, update }) => ({
        id: where.id,
        ...update,
      })
    );
    connector = {
      promptWindowLimit: () => 8192,
      compressMessages: async () => [],
      streamingEnabled: () => true,
      streamGetChatCompletion: async () => ({ metrics: {} }),
      handleStream: async () => "Hello",
      getChatCompletion: async () => ({ textResponse: "Hello", metrics: {} }),
    };
    resolveProviderConnector.mockResolvedValue({ connector });
  });

  afterEach(() => jest.restoreAllMocks());

  async function completeChat() {
    const chunks = [];
    await streamChatWithWorkspace(
      { write: (chunk) => chunks.push(JSON.parse(chunk.slice(6))) },
      workspace,
      "Hi",
      "chat",
      user,
      thread
    );
    return chunks.find((chunk) => chunk.type === "finalizeResponseStream");
  }

  it.each([true, false])(
    "returns the saved ID when streamingEnabled is %s",
    async (streaming) => {
      connector.streamingEnabled = () => streaming;
      expect(await completeChat()).toMatchObject({ chatId: 42, error: false });
      expect(prisma.workspace_chats.create).toHaveBeenCalledTimes(1);
      const initial = prisma.workspace_chats.create.mock.calls[0][0].data;
      expect(initial.prompt).toBe("Hi");
      expect(JSON.parse(initial.response).text).toBe("");
      expect(prisma.workspace_chats.upsert).toHaveBeenCalledTimes(1);
      const { where, update } = prisma.workspace_chats.upsert.mock.calls[0][0];
      expect(where).toEqual({ id: 42, user_id: 2 });
      expect(update).toMatchObject({
        workspaceId: 1,
        thread_id: 3,
        include: true,
      });
      expect(JSON.parse(update.response).text).toBe("Hello");
    }
  );

  it("still creates the completed chat if the early save fails", async () => {
    prisma.workspace_chats.create.mockRejectedValueOnce(
      new Error("early save failed")
    );
    expect(await completeChat()).toMatchObject({ chatId: 42, error: false });
    expect(prisma.workspace_chats.create).toHaveBeenCalledTimes(2);
    expect(prisma.workspace_chats.upsert).not.toHaveBeenCalled();
  });

  it("returns the Prisma record in the model's chat wrapper", async () => {
    const result = await WorkspaceChats.upsert(42, {
      workspaceId: 1,
      response: { text: "Hello" },
      user,
      threadId: 3,
      include: true,
    });
    expect(result).toMatchObject({ chat: { id: 42 }, message: null });
  });

  it("preserves the model's error result when the update fails", async () => {
    prisma.workspace_chats.upsert.mockRejectedValueOnce(
      new Error("update failed")
    );
    expect(await WorkspaceChats.upsert(42, {})).toEqual({
      chat: null,
      message: "update failed",
    });
  });
});
