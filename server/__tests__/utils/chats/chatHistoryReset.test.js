/* eslint-env jest, node */

/**
 * Chat history reset & visibility contract (#6230).
 *
 * A "reset" never deletes rows — it flips `include: false` on exactly the
 * scope being reset. Every read path (frontend listings, the developer API
 * listings, and recentChatHistory which feeds the model) must therefore
 * filter `include: true`, and every reset writer must only touch its own
 * scope: another session, user, thread, or workspace must keep its history.
 *
 * These tests run the REAL reset entry points and the REAL readers against
 * an in-memory workspace_chats table that mimics Prisma `where` semantics
 * (`undefined` = filter ignored, `null` = match NULL, else strict equal).
 * That matters because most reset clauses rely on `user?.id`/`thread?.id`
 * producing `undefined`, which Prisma treats as "match everything".
 *
 * Scopes covered, single-user (user: null) and multi-user (user: {id}):
 *   - API session   POST /v1/workspace/:slug/chat {reset, sessionId} (sync + stream)
 *   - API workspace POST /v1/workspace/:slug/chat {reset}
 *   - API thread    POST /v1/workspace/:slug/thread/:threadSlug/chat {reset}
 *   - UI /reset     workspace default thread and workspace threads
 */

jest.mock("../../../utils/prisma", () => {
  let rows = [];
  let autoId = 1;

  // Prisma where semantics for flat clauses: undefined filters are ignored,
  // null matches NULL, everything else is strict equality.
  const matches = (row, where = {}) =>
    Object.entries(where).every(([field, value]) =>
      value === undefined ? true : row[field] === value
    );

  return {
    workspace_chats: {
      findMany: jest.fn(async ({ where = {}, take, orderBy } = {}) => {
        let out = rows.filter((row) => matches(row, where));
        if (orderBy) {
          const [field, dir] = Object.entries(orderBy)[0];
          out = [...out].sort(
            (a, b) => (a[field] > b[field] ? 1 : -1) * (dir === "desc" ? -1 : 1)
          );
        }
        if (take !== undefined && take !== null) out = out.slice(0, take);
        return out;
      }),
      updateMany: jest.fn(async ({ where = {}, data = {} }) => {
        let count = 0;
        for (const row of rows) {
          if (!matches(row, where)) continue;
          Object.assign(row, data);
          count++;
        }
        return { count };
      }),
      findFirst: jest.fn(
        async ({ where = {} } = {}) =>
          rows.find((row) => matches(row, where)) || null
      ),
      deleteMany: jest.fn(async ({ where = {} } = {}) => {
        const keep = rows.filter((row) => !matches(row, where));
        const count = rows.length - keep.length;
        rows = keep;
        return { count };
      }),
      count: jest.fn(
        async ({ where = {} } = {}) =>
          rows.filter((row) => matches(row, where)).length
      ),
    },
    __table: {
      reset: () => {
        rows = [];
        autoId = 1;
      },
      insert: (row) => {
        const record = {
          id: autoId++,
          user_id: null,
          thread_id: null,
          api_session_id: null,
          include: true,
          feedbackScore: null,
          createdAt: new Date(2026, 0, autoId),
          response: JSON.stringify({ text: "response", sources: [] }),
          ...row,
        };
        rows.push(record);
        return record;
      },
      all: () => rows,
    },
  };
});

// Heavy dependency chains that the reset paths never reach — the reset
// branches exit before any LLM/vector/agent work happens.
jest.mock("../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  resolveProviderConnector: jest.fn(),
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
  generatedImageAttachments: jest.fn(() => []),
}));
jest.mock("../../../utils/agents/ephemeral", () => ({
  EphemeralAgentHandler: Object.assign(jest.fn(), {
    isAgentInvocation: jest.fn().mockReturnValue(false),
  }),
  EphemeralEventListener: jest.fn(),
}));
jest.mock("../../../utils/ImageGenerators", () => ({
  generateImageForWorkspace: jest.fn(),
  editImageForWorkspace: jest.fn(),
}));
jest.mock("../../../utils/router", () => ({
  ModelRouterService: { resetForWorkspace: jest.fn() },
}));

const prisma = require("../../../utils/prisma");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { ApiChatHandler } = require("../../../utils/chats/apiChatHandler");
const { recentChatHistory } = require("../../../utils/chats/index");
const { resetMemory } = require("../../../utils/chats/commands/reset");

const workspace = { id: 1, slug: "workspace-one", chatMode: "chat" };
const otherWorkspace = { id: 2, slug: "workspace-two", chatMode: "chat" };
const userA = { id: 10 };
const userB = { id: 20 };
const threadT5 = { id: 5 };
const threadT6 = { id: 6 };

/**
 * Every chat surface gets rows so each reset test can prove it left every
 * OTHER scope alone. `prompt` doubles as the row's label in assertions.
 */
function seedAllScopes() {
  prisma.__table.reset();
  const seed = (prompt, fields = {}) =>
    prisma.__table.insert({ workspaceId: workspace.id, prompt, ...fields });

  // Workspace default thread
  seed("ws-single-1");
  seed("ws-single-2");
  seed("ws-userA", { user_id: userA.id });
  seed("ws-userB", { user_id: userB.id });
  // Threads
  seed("t5-single", { thread_id: threadT5.id });
  seed("t5-userA", { thread_id: threadT5.id, user_id: userA.id });
  seed("t6-userA", { thread_id: threadT6.id, user_id: userA.id });
  // API sessions
  seed("sess-a-1", { api_session_id: "sess-a" });
  seed("sess-a-2", { api_session_id: "sess-a" });
  seed("sess-b", { api_session_id: "sess-b" });
  // Rows a previous reset already soft-deleted (#6230 regression)
  seed("ws-single-hidden", { include: false });
  seed("sess-a-hidden", { api_session_id: "sess-a", include: false });
  // A different workspace, including the SAME session id
  prisma.__table.insert({ workspaceId: otherWorkspace.id, prompt: "w2-ws" });
  prisma.__table.insert({
    workspaceId: otherWorkspace.id,
    prompt: "w2-sess-a",
    api_session_id: "sess-a",
  });
}

const labels = (rows) => rows.map((row) => row.prompt).sort();

/** What each reader currently sees, by scope, as sorted prompt labels. */
async function snapshot() {
  return {
    // GET /v1/workspace/:slug/chats?apiSessionId=... (developer API)
    apiSession: labels(
      await WorkspaceChats.forWorkspaceByApiSessionId(workspace.id, "sess-a")
    ),
    apiSessionB: labels(
      await WorkspaceChats.forWorkspaceByApiSessionId(workspace.id, "sess-b")
    ),
    // GET /v1/workspace/:slug/chats and single-user GET /workspace/:slug/chats
    workspaceListing: labels(await WorkspaceChats.forWorkspace(workspace.id)),
    // Multi-user GET /workspace/:slug/chats
    userAListing: labels(
      await WorkspaceChats.forWorkspaceByUser(workspace.id, userA.id)
    ),
    userBListing: labels(
      await WorkspaceChats.forWorkspaceByUser(workspace.id, userB.id)
    ),
    // GET /workspace/:slug/thread/:threadSlug/chats — clause mirrors
    // server/endpoints/workspaceThreads.js:147
    uiThreadSingle: labels(
      await WorkspaceChats.where({
        workspaceId: workspace.id,
        user_id: null,
        thread_id: threadT5.id,
        api_session_id: null,
        include: true,
      })
    ),
    uiThreadUserA: labels(
      await WorkspaceChats.where({
        workspaceId: workspace.id,
        user_id: userA.id,
        thread_id: threadT5.id,
        api_session_id: null,
        include: true,
      })
    ),
    // GET /v1/workspace/:slug/thread/:threadSlug/chats — clause mirrors
    // server/endpoints/api/workspaceThread/index.js:310
    apiThread: labels(
      await WorkspaceChats.where({
        workspaceId: workspace.id,
        thread_id: threadT5.id,
        api_session_id: null,
        include: true,
      })
    ),
    otherWorkspaceRows: labels(
      (await prisma.__table.all()).filter(
        (row) => row.workspaceId === otherWorkspace.id && row.include
      )
    ),
  };
}

/** The model's memory for a scope — must always agree with the listings. */
async function modelMemory({ user = null, thread = null, apiSessionId = null }) {
  const { rawHistory } = await recentChatHistory({
    user,
    workspace,
    thread,
    apiSessionId,
    messageLimit: 20,
  });
  return labels(rawHistory);
}

const BASELINE = {
  apiSession: ["sess-a-1", "sess-a-2"],
  apiSessionB: ["sess-b"],
  workspaceListing: ["ws-single-1", "ws-single-2", "ws-userA", "ws-userB"],
  userAListing: ["ws-userA"],
  userBListing: ["ws-userB"],
  uiThreadSingle: ["t5-single"],
  uiThreadUserA: ["t5-userA"],
  apiThread: ["t5-single", "t5-userA"],
  otherWorkspaceRows: ["w2-sess-a", "w2-ws"],
};

/** Assert only the named scopes changed from baseline. */
async function expectOnlyChanged(changes) {
  expect(await snapshot()).toEqual({ ...BASELINE, ...changes });
}

/** Resets flip `include` — nothing is ever deleted. */
function expectNothingDeleted() {
  expect(prisma.__table.all()).toHaveLength(14);
}

beforeEach(() => {
  jest.clearAllMocks();
  seedAllScopes();
});

describe("baseline: every reader sees exactly its own active scope", () => {
  test("listings scope by session/user/thread/workspace and exclude include:false rows", async () => {
    // ws-single-hidden and sess-a-hidden exist but appear nowhere (#6230)
    expect(await snapshot()).toEqual(BASELINE);
  });

  test("model memory (recentChatHistory) scopes identically to the listings", async () => {
    expect(await modelMemory({ apiSessionId: "sess-a" })).toEqual([
      "sess-a-1",
      "sess-a-2",
    ]);
    expect(await modelMemory({})).toEqual(["ws-single-1", "ws-single-2"]);
    expect(await modelMemory({ user: userA })).toEqual(["ws-userA"]);
    expect(await modelMemory({ thread: threadT5 })).toEqual(["t5-single"]);
    expect(await modelMemory({ user: userA, thread: threadT5 })).toEqual([
      "t5-userA",
    ]);
  });
});

describe("API session reset — POST /v1/workspace/:slug/chat { reset: true, sessionId }", () => {
  test("sync: clears only that session's history and listing agrees with model memory", async () => {
    const result = await ApiChatHandler.chatSync({
      workspace,
      message: null,
      mode: "chat",
      user: null,
      thread: null,
      sessionId: "sess-a",
      reset: true,
    });

    expect(result.textResponse).toBe("Chat history was reset!");
    await expectOnlyChanged({ apiSession: [] });
    expect(await modelMemory({ apiSessionId: "sess-a" })).toEqual([]);
    expectNothingDeleted();
  });

  test("stream: clears only that session's history", async () => {
    const response = { write: jest.fn(), writableEnded: false, destroyed: false };
    await ApiChatHandler.streamChat({
      response,
      workspace,
      message: null,
      mode: "chat",
      user: null,
      thread: null,
      sessionId: "sess-a",
      reset: true,
    });

    expect(response.write).toHaveBeenCalledWith(
      expect.stringContaining("Chat history was reset!")
    );
    await expectOnlyChanged({ apiSession: [] });
    expectNothingDeleted();
  });
});

describe("API workspace reset — POST /v1/workspace/:slug/chat { reset: true }", () => {
  test("clears the default thread (all attributions) but never threads, sessions, or other workspaces", async () => {
    await ApiChatHandler.chatSync({
      workspace,
      message: null,
      mode: "chat",
      user: null,
      thread: null,
      sessionId: null,
      reset: true,
    });

    // The API workspace listing (forWorkspace) shows every user's default-thread
    // rows, so the matching reset clears them all.
    await expectOnlyChanged({
      workspaceListing: [],
      userAListing: [],
      userBListing: [],
    });
    expect(await modelMemory({})).toEqual([]);
    expectNothingDeleted();
  });
});

describe("API thread reset — POST /v1/workspace/:slug/thread/:threadSlug/chat { reset: true }", () => {
  test("single-user (no userId): clears the whole thread, matching the API thread listing", async () => {
    await ApiChatHandler.chatSync({
      workspace,
      message: null,
      mode: "chat",
      user: null,
      thread: threadT5,
      sessionId: null,
      reset: true,
    });

    await expectOnlyChanged({
      apiThread: [],
      uiThreadSingle: [],
      uiThreadUserA: [],
    });
    expect(await modelMemory({ thread: threadT5 })).toEqual([]);
    expectNothingDeleted();
  });

  test("multi-user (userId given): clears only that user's rows in the thread", async () => {
    await ApiChatHandler.chatSync({
      workspace,
      message: null,
      mode: "chat",
      user: userA,
      thread: threadT5,
      sessionId: null,
      reset: true,
    });

    await expectOnlyChanged({
      apiThread: ["t5-single"],
      uiThreadUserA: [],
    });
    expect(await modelMemory({ user: userA, thread: threadT5 })).toEqual([]);
    expect(await modelMemory({ thread: threadT5 })).toEqual(["t5-single"]);
    expectNothingDeleted();
  });
});

describe("UI /reset — workspace default thread", () => {
  test("single-user: clears the default thread but never API sessions or threads", async () => {
    const result = await resetMemory(workspace, "/reset", "uuid", null, null);

    expect(result.textResponse).toBe("Chat memory was reset!");
    // No user filter in single-user mode, so user-attributed rows clear too —
    // but API session history must survive a UI reset.
    await expectOnlyChanged({
      workspaceListing: [],
      userAListing: [],
      userBListing: [],
    });
    expect(await modelMemory({})).toEqual([]);
    expectNothingDeleted();
  });

  test("multi-user: clears only that user's default-thread history", async () => {
    await resetMemory(workspace, "/reset", "uuid", userA, null);

    await expectOnlyChanged({
      workspaceListing: ["ws-single-1", "ws-single-2", "ws-userB"],
      userAListing: [],
    });
    expect(await modelMemory({ user: userA })).toEqual([]);
    expect(await modelMemory({})).toEqual(["ws-single-1", "ws-single-2"]);
    expectNothingDeleted();
  });
});

describe("UI /reset — workspace thread", () => {
  test("single-user: clears the whole thread and nothing else", async () => {
    await resetMemory(workspace, "/reset", "uuid", null, threadT5);

    await expectOnlyChanged({
      apiThread: [],
      uiThreadSingle: [],
      uiThreadUserA: [],
    });
    expect(await modelMemory({ thread: threadT5 })).toEqual([]);
    expectNothingDeleted();
  });

  test("multi-user: clears only that user's rows in that thread", async () => {
    await resetMemory(workspace, "/reset", "uuid", userA, threadT5);

    await expectOnlyChanged({
      apiThread: ["t5-single"],
      uiThreadUserA: [],
    });
    expect(await modelMemory({ user: userA, thread: threadT5 })).toEqual([]);
    // The user's other thread is untouched
    expect(await modelMemory({ user: userA, thread: threadT6 })).toEqual([
      "t6-userA",
    ]);
    expectNothingDeleted();
  });
});
