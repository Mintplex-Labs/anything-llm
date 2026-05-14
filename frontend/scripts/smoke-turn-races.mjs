import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import {
  TURN_STATUSES,
  appendTimelineEventToItems,
  createTurn,
  findAssistantTurn,
  mergeServerHistoryIntoTurns,
  updateAssistantTurnInItems,
} from "../src/utils/chat/turns.js";

function loadHandleChat() {
  let src = fs.readFileSync(
    new URL("../src/utils/chat/index.js", import.meta.url),
    "utf8"
  );
  src = src.replace(/import[^\n]+\n/, "");
  src = src.replace(
    "export const ABORT_STREAM_EVENT",
    "const ABORT_STREAM_EVENT"
  );
  src = src.replace(
    "export function dispatchThreadRename",
    "function dispatchThreadRename"
  );
  src = src.replace(
    "export default function handleChat",
    "function handleChat"
  );
  src = src.slice(0, src.indexOf("export function getWorkspaceSystemPrompt"));
  src += "\nresult = handleChat;";
  const sandbox = {
    result: null,
    window: { dispatchEvent() {} },
    CustomEvent: function CustomEvent() {},
  };
  vm.runInNewContext(src, sandbox);
  return sandbox.result;
}

function loadHandleSocketResponse() {
  let src = fs.readFileSync(
    new URL("../src/utils/chat/agent.js", import.meta.url),
    "utf8"
  );
  src = src.replace(/^import[^\n]+\n/gm, "");
  src = src.replace(
    "export const AGENT_SESSION_START",
    "const AGENT_SESSION_START"
  );
  src = src.replace(
    "export const AGENT_SESSION_END",
    "const AGENT_SESSION_END"
  );
  src = src.replace("export function websocketURI", "function websocketURI");
  src = src.replace(
    "export default function handleSocketResponse",
    "function handleSocketResponse"
  );
  src = src.replace(
    "import.meta.env.VITE_API_BASE",
    '"http://localhost:3001"'
  );
  src = src.slice(0, src.indexOf("let _agentSessionActive"));
  src += "\nresult = handleSocketResponse;";
  const sandbox = {
    API_BASE: "/api",
    result: null,
    safeJsonParse: (value, fallback) => {
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    },
    window: {
      location: { protocol: "http:", host: "localhost:3000" },
      dispatchEvent() {},
    },
    CustomEvent: function CustomEvent() {},
  };
  vm.runInNewContext(src, sandbox);
  return sandbox.result;
}

function completeTurn(draft, turnId, patch = {}) {
  const turn = findAssistantTurn(draft.items, turnId);
  assert.ok(turn, "target turn should exist before completion");
  return {
    ...draft,
    items: updateAssistantTurnInItems(draft.items, turnId, {
      ...patch,
      finalContent: patch.finalContent ?? turn.finalContent,
      status: TURN_STATUSES.completed,
      error: null,
    }),
    activeTurnId: draft.activeTurnId === turnId ? null : draft.activeTurnId,
    isStreaming: false,
    isAgentRunning: false,
    activeToolCall: null,
    pendingApproval: null,
  };
}

function failTurn(draft, turnId, reason = "failed") {
  return {
    ...draft,
    items: updateAssistantTurnInItems(draft.items, turnId, {
      status: TURN_STATUSES.failed,
      error: reason,
    }),
    activeTurnId: draft.activeTurnId === turnId ? null : draft.activeTurnId,
    isStreaming: false,
    isAgentRunning: false,
    activeToolCall: null,
    pendingApproval: null,
  };
}

function applyDeltaIfRunning(draft, turnId, content) {
  const turn = findAssistantTurn(draft.items, turnId);
  if (!turn || turn.status !== TURN_STATUSES.running) return draft;
  return {
    ...draft,
    items: updateAssistantTurnInItems(draft.items, turnId, {
      status: TURN_STATUSES.running,
      finalContent: `${turn.finalContent || ""}${content || ""}`,
    }),
    activeTurnId: turnId,
    isStreaming: true,
  };
}

const handleChat = loadHandleChat();
const handleSocketResponse = loadHandleSocketResponse();
const closedChunk = handleChat({
  type: "textResponseChunk",
  textResponse: "done",
  close: true,
  uuid: "u1",
});
assert.equal(closedChunk.type, "assistant_final");
assert.equal(closedChunk.content, "done");

function socketMessage(payload) {
  return handleSocketResponse({}, { data: JSON.stringify(payload) });
}

const closedSocketChunk = socketMessage({
  type: "reportStreamEvent",
  content: {
    type: "textResponseChunk",
    uuid: "ws-close",
    content: "done",
    close: true,
    chatId: 11,
    sources: [{ title: "source" }],
    metrics: { total_tokens: 3 },
  },
});
assert.equal(closedSocketChunk.type, "assistant_final");
assert.equal(closedSocketChunk.content, "done");
assert.equal(closedSocketChunk.chatId, 11);
assert.equal(closedSocketChunk.closed, true);
assert.deepEqual(closedSocketChunk.sources, [{ title: "source" }]);
assert.deepEqual(closedSocketChunk.metrics, { total_tokens: 3 });

const fullTextResponse = socketMessage({
  type: "reportStreamEvent",
  content: {
    type: "fullTextResponse",
    uuid: "ws-final",
    content: "final",
    chatId: 12,
  },
});
assert.equal(fullTextResponse.type, "assistant_final");
assert.equal(fullTextResponse.content, "final");
assert.equal(fullTextResponse.chatId, 12);

const reportChatId = socketMessage({
  type: "reportStreamEvent",
  content: { type: "chatId", uuid: "ws-chat", chatId: 13 },
});
assert.equal(reportChatId.type, "assistant_final");
assert.equal(reportChatId.chatId, 13);

const topLevelChatId = socketMessage({
  type: "chatId",
  content: { uuid: "top-chat", chatId: 14 },
});
assert.equal(topLevelChatId.type, "assistant_final");
assert.equal(topLevelChatId.chatId, 14);

const wssFailure = socketMessage({
  type: "wssFailure",
  content: "socket failed",
});
assert.equal(wssFailure.type, "assistant_error");
assert.equal(wssFailure.error, "socket failed");

const first = createTurn({ prompt: "first", chatKey: "ws:default" });
let draft = {
  items: first.items,
  activeTurnId: first.turnId,
  isStreaming: true,
  isAgentRunning: false,
};
draft = completeTurn(draft, first.turnId, {
  finalContent: closedChunk.content,
});
const completed = findAssistantTurn(draft.items, first.turnId);
assert.equal(completed.status, TURN_STATUSES.completed);
assert.equal(completed.finalContent, "done");
assert.equal(draft.activeTurnId, null);
assert.equal(draft.isStreaming, false);

const beforeLateDelta = completed.finalContent;
draft = applyDeltaIfRunning(draft, first.turnId, " late");
assert.equal(findAssistantTurn(draft.items, first.turnId).status, "completed");
assert.equal(findAssistantTurn(draft.items, first.turnId).finalContent, beforeLateDelta);

const failedTurn = createTurn({ prompt: "fail", chatKey: "ws:default" });
let failedDraft = {
  items: failedTurn.items,
  activeTurnId: failedTurn.turnId,
  isStreaming: false,
  isAgentRunning: true,
};
failedDraft = failTurn(
  failedDraft,
  failedTurn.turnId,
  "Agent websocket closed before a final response."
);
assert.equal(
  findAssistantTurn(failedDraft.items, failedTurn.turnId).status,
  TURN_STATUSES.failed
);
assert.equal(failedDraft.activeTurnId, null);
assert.equal(failedDraft.isAgentRunning, false);

const oldTurn = createTurn({ prompt: "old", chatKey: "ws:default" });
const newTurn = createTurn({ prompt: "new", chatKey: "ws:default" });
let lateDraft = {
  items: [...oldTurn.items, ...newTurn.items],
  activeTurnId: newTurn.turnId,
};
lateDraft.items = appendTimelineEventToItems(lateDraft.items, oldTurn.turnId, {
  type: "thought",
  content: "late event from old socket",
});
assert.deepEqual(
  findAssistantTurn(lateDraft.items, oldTurn.turnId).timeline.map(
    (event) => event.content
  ),
  ["late event from old socket"]
);
assert.deepEqual(
  findAssistantTurn(lateDraft.items, newTurn.turnId).timeline,
  []
);

const persistedTurn = createTurn({
  prompt: "persisted",
  chatKey: "ws:default",
  chatId: 101,
});
let persistedDraft = completeTurn(
  {
    items: persistedTurn.items,
    activeTurnId: persistedTurn.turnId,
    isStreaming: true,
    isAgentRunning: false,
  },
  persistedTurn.turnId,
  { finalContent: "local", chatId: 101 }
);
persistedDraft = {
  ...persistedDraft,
  items: mergeServerHistoryIntoTurns(
    [
      { role: "user", chatId: 101, content: "persisted", sentAt: 1 },
      { role: "assistant", chatId: 101, content: "server", sentAt: 2 },
    ],
    persistedDraft.items,
    { chatKey: "ws:default" }
  ),
};
assert.equal(
  findAssistantTurn(persistedDraft.items, persistedTurn.turnId).status,
  TURN_STATUSES.completed
);
assert.equal(persistedDraft.activeTurnId, null);
assert.equal(persistedDraft.isStreaming, false);

for (const file of [
  "../src/models/workspace.js",
  "../src/models/workspaceThread.js",
]) {
  const src = fs.readFileSync(new URL(file, import.meta.url), "utf8");
  const adds = [...src.matchAll(/addEventListener\(ABORT_STREAM_EVENT/g)]
    .length;
  const removes = [...src.matchAll(/removeEventListener\(ABORT_STREAM_EVENT/g)]
    .length;
  assert.equal(adds, removes, `${file} abort listener add/remove mismatch`);
}

console.log("turn race smoke passed");
