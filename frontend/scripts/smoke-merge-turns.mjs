import assert from "node:assert/strict";
import {
  createTurn,
  mergeServerHistoryIntoTurns,
} from "../src/utils/chat/turns.js";

const serverHistory = [
  {
    role: "user",
    content: "hello",
    chatId: 1,
    sentAt: 1,
    attachments: [],
  },
  {
    role: "assistant",
    content: "world",
    chatId: 1,
    sentAt: 1,
    sources: [{ title: "source" }],
    metrics: { prompt_tokens: 1 },
    agentEvents: [
      { type: "agent_thought", content: "thinking", uuid: "thought-1" },
      {
        type: "tool_call",
        uuid: "tool-1",
        toolName: "filesystem",
        content: "Tool call",
      },
    ],
  },
];

const first = mergeServerHistoryIntoTurns(serverHistory, []);
assert.equal(first.length, 2);
assert.equal(first[0].type, "user");
assert.equal(first[1].type, "assistant_turn");
assert.equal(first[1].finalContent, "world");
assert.equal(first[1].timeline.length, 2);

const second = mergeServerHistoryIntoTurns(serverHistory, first);
assert.equal(second.length, 2);
assert.equal(second[1].timeline.length, 2);

const local = createTurn({ prompt: "hello", attachments: [] });
const running = local.items;
const mergedRunning = mergeServerHistoryIntoTurns(serverHistory, running);
assert.equal(mergedRunning.length, 2);
assert.equal(mergedRunning[0].id, local.userMessage.id);
assert.equal(mergedRunning[1].turnId, local.turnId);
assert.equal(mergedRunning[1].chatId, 1);
assert.equal(mergedRunning[1].status, "completed");

console.log("mergeServerHistoryIntoTurns smoke passed");
