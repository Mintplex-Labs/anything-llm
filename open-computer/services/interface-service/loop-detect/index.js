const { settings } = require("../config");
const { workspace } = require("../workspace");
const { broadcast } = require("../broadcast");
const { setPendingInterrupt } = require("../interrupt");

// ─── State ─────────────────────────────────────────────────────────────────

const LOOP_DETECT = {
  recentTexts: [],       // { text, shingles }[] — sliding window for text repetition
  recentToolCalls: [],   // string[] — "name:argsHash" signatures
  turnsSinceToolCall: 0, // consecutive message turns with no tool use
  alertedAt: 0,          // timestamp of last alert (60s cooldown)

  MAX_NO_TOOL_TURNS: 15,
  MAX_TRACKED_TEXTS: 30,
  MAX_TRACKED_TOOLS: 30,
  SIMILARITY_THRESHOLD: 0.85,
  MIN_REPEATS: 8,
  MIN_TOOL_REPEATS: 4,
};

// ─── Text similarity helpers ───────────────────────────────────────────────

function textToShingles(text, k = 3) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const words = normalized.split(/\s+/);
  const shingles = new Set();
  for (let i = 0; i <= words.length - k; i++) {
    shingles.add(words.slice(i, i + k).join(" "));
  }
  return shingles;
}

function jaccardSimilarity(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const s of a) {
    if (b.has(s)) intersection++;
  }
  return intersection / (a.size + b.size - intersection);
}

// ─── Detection ────────────────────────────────────────────────────────────

/**
 * Returns true if the new text segment is suspiciously similar to recent
 * segments, or if the agent has gone too many turns without calling a tool.
 */
function checkForLoop(newText) {
  if (!newText || newText.length < 20) return false;
  if (LOOP_DETECT.alertedAt && Date.now() - LOOP_DETECT.alertedAt < 60_000)
    return false;

  const shingles = textToShingles(newText);
  LOOP_DETECT.recentTexts.push({ text: newText, shingles });
  if (LOOP_DETECT.recentTexts.length > LOOP_DETECT.MAX_TRACKED_TEXTS)
    LOOP_DETECT.recentTexts.shift();

  let similarCount = 0;
  for (let i = 0; i < LOOP_DETECT.recentTexts.length - 1; i++) {
    if (
      jaccardSimilarity(shingles, LOOP_DETECT.recentTexts[i].shingles) >=
      LOOP_DETECT.SIMILARITY_THRESHOLD
    )
      similarCount++;
  }

  if (similarCount >= LOOP_DETECT.MIN_REPEATS) return true;
  if (LOOP_DETECT.turnsSinceToolCall >= LOOP_DETECT.MAX_NO_TOOL_TURNS) return true;
  return false;
}

/**
 * Returns a description string (truthy) if the agent is repeating the same
 * tool-call cycle (length 1–3), or false if no loop is detected.
 */
function checkForToolLoop(toolName, argsJson) {
  if (LOOP_DETECT.alertedAt && Date.now() - LOOP_DETECT.alertedAt < 60_000)
    return false;

  const sig = `${toolName}:${argsJson || ""}`;
  LOOP_DETECT.recentToolCalls.push(sig);
  if (LOOP_DETECT.recentToolCalls.length > LOOP_DETECT.MAX_TRACKED_TOOLS)
    LOOP_DETECT.recentToolCalls.shift();

  const calls = LOOP_DETECT.recentToolCalls;
  for (let cycleLen = 1; cycleLen <= 3; cycleLen++) {
    if (calls.length < cycleLen * LOOP_DETECT.MIN_TOOL_REPEATS) continue;
    const tail = calls.slice(-cycleLen);
    let repeats = 0;
    for (let i = calls.length - cycleLen; i >= 0; i -= cycleLen) {
      const chunk = calls.slice(i, i + cycleLen);
      if (chunk.length < cycleLen) break;
      if (chunk.every((v, j) => v === tail[j])) repeats++;
      else break;
    }
    if (repeats >= LOOP_DETECT.MIN_TOOL_REPEATS) {
      const cycleDesc = tail.map((s) => s.split(":")[0]).join(" → ");
      return `tool cycle [${cycleDesc}] repeated ${repeats}x`;
    }
  }
  return false;
}

// ─── State management ─────────────────────────────────────────────────────

function resetLoopDetector() {
  LOOP_DETECT.recentTexts = [];
  LOOP_DETECT.recentToolCalls = [];
  LOOP_DETECT.turnsSinceToolCall = 0;
  LOOP_DETECT.alertedAt = 0;
}

/** Call whenever a tool execution starts to reset the no-tool-turn counter. */
function onToolCall() {
  LOOP_DETECT.turnsSinceToolCall = 0;
}

/** Call whenever a text message turn arrives (increments no-tool-turn counter). */
function onTextMessage() {
  LOOP_DETECT.turnsSinceToolCall++;
}

// ─── Intervention ─────────────────────────────────────────────────────────

/**
 * Injects a stop nudge into the LLM proxy interrupt queue and, if the proxy
 * is not in use, also writes directly to the pi RPC channel.  Surfaces an
 * ask_for_help event so the user can intervene if the nudge fails.
 */
function alertLoopingAgent(reason) {
  if (!workspace.piProcess) return;
  if (workspace.pendingHelp) return;

  console.warn(`[loop-detect] Suspected loop: ${reason}`);
  LOOP_DETECT.alertedAt = Date.now();

  const nudge =
    `STOP. You are stuck in a loop: ${reason}. ` +
    `The same tool calls are returning identical results. ` +
    `Do NOT repeat the same action. Try a completely different approach: ` +
    `use a different tool, navigate to a different URL, use curl instead of the browser, ` +
    `or move on to the next step of the task.`;

  if (settings.LLM_PROXY_TARGET) {
    setPendingInterrupt(nudge);
  }

  if (workspace.piRpc) {
    workspace.piRpc.write(
      JSON.stringify({
        id: `loop-nudge-${Date.now()}`,
        type: "prompt",
        message: nudge,
        streamingBehavior: "followUp",
      }) + "\n",
    );
  }

  console.log(`[loop-detect] Auto-interrupted: ${reason}`);
  broadcast({ type: "agent_log", content: `[loop-detect] Auto-interrupted: ${reason}` });

  const fakeId = `loop-${Date.now()}`;
  workspace.pendingHelp = { id: fakeId, method: "input" };
  broadcast({
    type: "ask_for_help",
    requestId: fakeId,
    method: "input",
    content:
      `The agent was stuck in a loop (${reason}). ` +
      `An automatic nudge was sent to break it out. ` +
      `If it keeps looping, you can abort or send a manual instruction.`,
    title: "Agent Loop Detected — Auto-Interrupted",
  });
}

module.exports = {
  checkForLoop,
  checkForToolLoop,
  resetLoopDetector,
  onToolCall,
  onTextMessage,
  alertLoopingAgent,
};
