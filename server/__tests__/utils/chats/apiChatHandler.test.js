/* eslint-env jest, node */

/**
 * Persistence rules for API `@agent` chats (fixes #5060).
 *
 * Every read path scopes history by the exact triple
 * (user_id, thread_id, api_session_id) plus `include: true`:
 *   - recentChatHistory (LLM context for subsequent chats)
 *   - EphemeralAgentHandler.#chatHistory (agent memory)
 *   - GET /v1/workspace/:slug/thread/:threadSlug/chats
 *   - frontend thread/workspace history queries
 * So the agent save MUST persist the same triple it was invoked with,
 * exactly like the non-agent saves in the same file, or the turn is
 * invisible everywhere.
 *
 * The only parameter combinations the v1 endpoints can produce:
 *   POST /v1/workspace/:slug/chat & /stream-chat
 *     -> user: null, thread: null, sessionId: null | string
 *   POST /v1/workspace/:slug/thread/:threadSlug/chat & /stream-chat
 *     -> user: null | users, thread: workspace_threads, sessionId: never
 * Notably `user`/`thread` and `sessionId` are mutually exclusive — a
 * user-attributed row can never carry an api_session_id, which is what
 * keeps forWorkspaceByApiSessionId's `user_id: null` filter safe.
 */

jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: {
    new: jest.fn(),
    markThreadHistoryInvalidV2: jest.fn(),
  },
}));
jest.mock("../../../models/telemetry", () => ({
  Telemetry: {
    sendTelemetry: jest.fn(),
  },
}));
jest.mock("../../../utils/chats/index", () => ({
  chatPrompt: jest.fn(),
  sourceIdentifier: jest.fn(),
  recentChatHistory: jest.fn(),
  grepAllSlashCommands: jest.fn(async (message) => message),
}));
jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  resolveProviderConnector: jest.fn(),
}));
jest.mock("../../../utils/helpers/chat/responses", () => ({
  writeResponseChunk: jest.fn(),
}));
jest.mock("../../../utils/helpers/abortSignals", () => ({
  abortConnectorOnClientDisconnect: jest.fn(),
}));
jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: jest.fn(),
}));
jest.mock("../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(),
}));
jest.mock("../../../utils/files", () => ({
  hotdirPath: "/tmp/anything-llm-test-hotdir",
  normalizePath: jest.fn((filePath) => filePath),
  isWithin: jest.fn(() => true),
  sanitizeFileName: jest.fn((filename) => filename),
}));
jest.mock("../../../utils/agents/ephemeral", () => {
  const waitForClose = jest.fn();
  const streamAgentEvents = jest.fn();
  const EphemeralAgentHandler = jest.fn().mockImplementation(function (args) {
    this.args = args;
    this.init = jest.fn().mockResolvedValue();
    this.createAIbitat = jest.fn().mockResolvedValue();
    this.startAgentCluster = jest.fn();
    this.getPendingOutputs = jest.fn().mockReturnValue([]);
  });
  EphemeralAgentHandler.isAgentInvocation = jest.fn();

  const EphemeralEventListener = jest.fn().mockImplementation(function () {
    this.waitForClose = waitForClose;
    this.streamAgentEvents = streamAgentEvents;
  });

  return {
    EphemeralAgentHandler,
    EphemeralEventListener,
    __mocks: {
      waitForClose,
      streamAgentEvents,
    },
  };
});

const { ApiChatHandler } = require("../../../utils/chats/apiChatHandler");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  getVectorDbClass,
  resolveProviderConnector,
} = require("../../../utils/helpers");
const {
  writeResponseChunk,
} = require("../../../utils/helpers/chat/responses");
const {
  EphemeralAgentHandler,
  __mocks: ephemeralMocks,
} = require("../../../utils/agents/ephemeral");

const workspace = { id: 1, slug: "workspace", chatMode: "chat" };
const attachments = [
  {
    name: "image.png",
    mime: "image/png",
    contentString: "data:image/png;base64,abc123",
  },
];
const agentResult = {
  thoughts: ["Look up the requested data"],
  textResponse: "Agent result",
  outputs: [],
  metrics: {},
  citations: [],
};

/**
 * Every (user, thread, sessionId) combination a v1 endpoint can actually
 * send into chatSync/streamChat. If an endpoint ever adds a new combination
 * it belongs in this table.
 */
const REAL_WORLD_CASES = [
  {
    name: "workspace chat, no sessionId (POST /v1/workspace/:slug/[stream-]chat)",
    user: null,
    thread: null,
    sessionId: null,
  },
  {
    name: "workspace chat with sessionId (POST /v1/workspace/:slug/[stream-]chat + sessionId)",
    user: null,
    thread: null,
    sessionId: "external-session",
  },
  {
    name: "thread chat, single-user (POST /v1/workspace/:slug/thread/:threadSlug/[stream-]chat)",
    user: null,
    thread: { id: 3 },
    sessionId: null,
  },
  {
    name: "thread chat, attributed user (POST /v1/workspace/:slug/thread/:threadSlug/[stream-]chat + userId)",
    user: { id: 2 },
    thread: { id: 3 },
    sessionId: null,
  },
];

/** The invocation args every case must hand to the ephemeral agent. */
function expectedAgentArgs({ user, thread, sessionId }) {
  return expect.objectContaining({
    workspace,
    prompt: "@agent summarize this",
    userId: user?.id || null,
    threadId: thread?.id || null,
    sessionId,
    attachments,
  });
}

/**
 * The persistence contract: identical scoping triple to the non-agent
 * saves, `include: true`, and the full agent response payload.
 */
function expectedSavePayload({ user, thread, sessionId }) {
  return expect.objectContaining({
    workspaceId: workspace.id,
    prompt: "@agent summarize this",
    include: true,
    threadId: thread?.id || null,
    apiSessionId: sessionId,
    user,
    response: expect.objectContaining({
      text: agentResult.textResponse,
      sources: agentResult.citations,
      attachments,
      type: "chat",
      thoughts: agentResult.thoughts,
    }),
  });
}

describe("ApiChatHandler @agent persistence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    EphemeralAgentHandler.isAgentInvocation.mockResolvedValue(true);
    WorkspaceChats.new.mockResolvedValue({ chat: { id: 123 } });
    ephemeralMocks.waitForClose.mockResolvedValue(agentResult);
    ephemeralMocks.streamAgentEvents.mockResolvedValue(agentResult);
  });

  describe.each(REAL_WORLD_CASES)("$name", ({ user, thread, sessionId }) => {
    test("chatSync persists the agent turn with the invocation's scoping triple", async () => {
      const result = await ApiChatHandler.chatSync({
        workspace,
        message: "@agent summarize this",
        mode: "chat",
        user,
        thread,
        sessionId,
        attachments,
      });

      expect(EphemeralAgentHandler).toHaveBeenCalledWith(
        expectedAgentArgs({ user, thread, sessionId })
      );
      expect(WorkspaceChats.new).toHaveBeenCalledTimes(1);
      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expectedSavePayload({ user, thread, sessionId })
      );
      expect(result).toEqual(
        expect.objectContaining({
          type: "textResponse",
          textResponse: agentResult.textResponse,
          thoughts: agentResult.thoughts,
          close: true,
          error: null,
        })
      );
    });

    test("streamChat persists the agent turn with the invocation's scoping triple", async () => {
      const response = {}; // express response — writeResponseChunk is mocked
      await ApiChatHandler.streamChat({
        response,
        workspace,
        message: "@agent summarize this",
        mode: "chat",
        user,
        thread,
        sessionId,
        attachments,
      });

      expect(EphemeralAgentHandler).toHaveBeenCalledWith(
        expectedAgentArgs({ user, thread, sessionId })
      );
      expect(WorkspaceChats.new).toHaveBeenCalledTimes(1);
      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expectedSavePayload({ user, thread, sessionId })
      );
      expect(writeResponseChunk).toHaveBeenCalledWith(
        response,
        expect.objectContaining({
          type: "finalizeResponseStream",
          textResponse: agentResult.textResponse,
          thoughts: agentResult.thoughts,
          close: true,
          error: false,
        })
      );
    });
  });

  describe("query-mode refusal, no embeddings", () => {
    // Same contract as the agent saves above: a refusal row is still a turn,
    // and must carry the scoping triple it was invoked with or it is orphaned.
    test.each(REAL_WORLD_CASES)(
      "chatSync keeps the scoping triple on the refusal row ($name)",
      async ({ user, thread, sessionId }) => {
        EphemeralAgentHandler.isAgentInvocation.mockResolvedValue(false);
        resolveProviderConnector.mockResolvedValue({
          connector: { promptWindowLimit: () => 8000 },
          routingMetadata: null,
        });
        getVectorDbClass.mockReturnValue({
          hasNamespace: jest.fn().mockResolvedValue(false),
          namespaceCount: jest.fn().mockResolvedValue(0),
        });

        await ApiChatHandler.chatSync({
          workspace,
          message: "anything",
          mode: "query",
          user,
          thread,
          sessionId,
        });

        expect(WorkspaceChats.new).toHaveBeenCalledWith(
          expect.objectContaining({
            workspaceId: workspace.id,
            include: false,
            threadId: thread?.id || null,
            apiSessionId: sessionId,
            user,
          })
        );
      }
    );
  });

  describe("cross-cutting rules", () => {
    test("agent chats are never saved with include: false", async () => {
      for (const c of REAL_WORLD_CASES) {
        await ApiChatHandler.chatSync({
          workspace,
          message: "@agent summarize this",
          mode: "chat",
          user: c.user,
          thread: c.thread,
          sessionId: c.sessionId,
          attachments,
        });
      }
      expect(WorkspaceChats.new).toHaveBeenCalledTimes(
        REAL_WORLD_CASES.length
      );
      for (const call of WorkspaceChats.new.mock.calls) {
        expect(call[0].include).toBe(true);
      }
    });

    test("a user-attributed save never carries an apiSessionId (multi-user vs session scoping)", async () => {
      for (const c of REAL_WORLD_CASES) {
        await ApiChatHandler.chatSync({
          workspace,
          message: "@agent summarize this",
          mode: "chat",
          user: c.user,
          thread: c.thread,
          sessionId: c.sessionId,
          attachments,
        });
      }
      for (const call of WorkspaceChats.new.mock.calls) {
        const { user, apiSessionId } = call[0];
        expect(Boolean(user && apiSessionId)).toBe(false);
      }
    });

    test("agent outputs from pending outputs are merged into the saved response", async () => {
      const pendingOutput = { type: "file", payload: { name: "report.csv" } };
      ephemeralMocks.waitForClose.mockResolvedValue({
        ...agentResult,
        outputs: [{ type: "text", payload: "inline" }],
      });
      EphemeralAgentHandler.mockImplementationOnce(function (args) {
        this.args = args;
        this.init = jest.fn().mockResolvedValue();
        this.createAIbitat = jest.fn().mockResolvedValue();
        this.startAgentCluster = jest.fn();
        this.getPendingOutputs = jest.fn().mockReturnValue([pendingOutput]);
      });

      await ApiChatHandler.chatSync({
        workspace,
        message: "@agent summarize this",
        mode: "chat",
        user: null,
        thread: null,
        sessionId: null,
        attachments,
      });

      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expect.objectContaining({
          response: expect.objectContaining({
            outputs: [{ type: "text", payload: "inline" }, pendingOutput],
          }),
        })
      );
    });
  });
});
