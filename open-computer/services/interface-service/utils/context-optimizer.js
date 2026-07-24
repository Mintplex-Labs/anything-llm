/**
 * Context Optimizer — message pruning + BM25 tool selection
 *
 * Sits between the pi agent and the LLM to keep the context window
 * lean for local models with limited capacity.
 */

// ── BM25 Tool Selector ──────────────────────────────────────────────

const BM25_K1 = 1.2;
const BM25_B = 0.75;

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function toolToText(tool) {
  const fn = tool.function || tool;
  const parts = [fn.name || "", fn.description || ""];
  if (fn.parameters?.properties) {
    for (const [key, prop] of Object.entries(fn.parameters.properties)) {
      parts.push(key);
      if (prop.description) parts.push(prop.description);
    }
  }
  return parts.join(" ");
}

const CORE_TOOLS = new Set([
  "bash",
  "read",
  "write",
  "edit",
  "ask_user",
  "save_deliverable",
]);

/**
 * Select the most relevant tools for the current query using BM25 scoring.
 *
 * @param {string} query - The user's current message/prompt
 * @param {Object[]} tools - Full tool array from the chat completions request
 * @param {Object} opts
 * @param {number} opts.topN - Max tools to return (default 12)
 * @param {string[]} opts.alwaysInclude - Tool names that are always kept
 * @returns {Object[]} Filtered tool array
 */
function selectTools(query, tools, opts = {}) {
  const {
    topN = parseInt(process.env.TOOL_SELECT_TOP_N) || 12,
    alwaysInclude = [...CORE_TOOLS],
  } = opts;

  if (!tools || tools.length <= topN) return tools;
  if (!query) return tools;

  const docs = tools.map((t) => tokenize(toolToText(t)));
  const N = docs.length;
  const avgDl = docs.reduce((s, d) => s + d.length, 0) / N;

  // Document frequency
  const df = {};
  for (const doc of docs) {
    const seen = new Set(doc);
    for (const term of seen) {
      df[term] = (df[term] || 0) + 1;
    }
  }

  const queryTerms = tokenize(query);

  const scores = docs.map((doc, i) => {
    const tf = {};
    for (const term of doc) tf[term] = (tf[term] || 0) + 1;

    let score = 0;
    for (const term of queryTerms) {
      if (!tf[term]) continue;
      const idf = Math.log(
        (N - (df[term] || 0) + 0.5) / ((df[term] || 0) + 0.5) + 1,
      );
      const tfNorm =
        (tf[term] * (BM25_K1 + 1)) /
        (tf[term] + BM25_K1 * (1 - BM25_B + (BM25_B * doc.length) / avgDl));
      score += idf * tfNorm;
    }
    return { index: i, score };
  });

  scores.sort((a, b) => b.score - a.score);

  const selected = new Set();
  const alwaysSet = new Set(alwaysInclude.map((n) => n.toLowerCase()));

  // Always include core tools
  for (let i = 0; i < tools.length; i++) {
    const name = (tools[i].function?.name || tools[i].name || "").toLowerCase();
    if (alwaysSet.has(name)) selected.add(i);
  }

  // Fill remaining slots with highest-scoring tools
  for (const { index } of scores) {
    if (selected.size >= topN) break;
    selected.add(index);
  }

  const result = [...selected].sort((a, b) => a - b).map((i) => tools[i]);

  const kept = result.map(
    (t) => t.function?.name || t.name || "?",
  );
  console.log(
    `[tool-select] ${tools.length} → ${result.length} tools: ${kept.join(", ")}`,
  );

  return result;
}

// ── Message Pruner ───────────────────────────────────────────────────

const FAILURE_PATTERNS = [
  "(not found)",
  "not found",
  "no element found",
  "no tab matching",
  "econnrefused",
  "no browser pages",
];

function isFailedToolResult(content) {
  if (!content) return false;
  const text = (typeof content === "string" ? content : "").toLowerCase();
  return FAILURE_PATTERNS.some((p) => text.includes(p));
}

function isRedundantPageState(msg, prevStates) {
  if (msg.role !== "assistant" || !msg.tool_calls) return false;
  for (const tc of msg.tool_calls) {
    const name = tc.function?.name || "";
    if (name === "page_state" || name === "page_read") {
      const args = tc.function?.arguments || "{}";
      const key = `${name}:${args}`;
      if (prevStates.has(key)) return true;
      prevStates.add(key);
    }
  }
  return false;
}

/**
 * Estimate token count from a message array (rough: 1 token ≈ 4 chars).
 */
function estimateMessageTokens(messages) {
  let chars = 0;
  for (const msg of messages) {
    if (typeof msg.content === "string") {
      chars += msg.content.length;
    } else if (Array.isArray(msg.content)) {
      for (const part of msg.content) {
        if (part.text) chars += part.text.length;
      }
    }
    if (msg.tool_calls) {
      chars += JSON.stringify(msg.tool_calls).length;
    }
  }
  return Math.ceil(chars / 4);
}

/**
 * Build a tool-call signature from an assistant message's tool_calls.
 * Returns a string like "page_click:{...}|page_state:{...}" that can
 * be compared for equality to detect repeating cycles.
 */
function toolCallSignature(msg) {
  if (!msg.tool_calls || msg.tool_calls.length === 0) return null;
  return msg.tool_calls
    .map((tc) => `${tc.function?.name || "?"}:${tc.function?.arguments || ""}`)
    .join("|");
}

/**
 * Collapse repeating tool-call cycles in a message array.
 * When a sequence like [A, resultA, B, resultB, A, resultA, B, resultB, ...]
 * repeats 3+ times, replace with: first occurrence + a summary assistant
 * message warning the model it was stuck.
 *
 * Returns { messages, loopsCollapsed }.
 */
function collapseToolLoops(messages, minRepeats = 3) {
  if (!messages || messages.length < 6) return { messages, loopsCollapsed: 0 };

  let loopsCollapsed = 0;

  // Build signature list for assistant messages with tool_calls
  // Index maps: sigIdx → original message index
  const sigs = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === "assistant" && msg.tool_calls) {
      sigs.push({ sig: toolCallSignature(msg), idx: i });
    }
  }

  if (sigs.length < minRepeats) return { messages, loopsCollapsed: 0 };

  // Find runs of identical signatures
  const dropRanges = []; // [startMsgIdx, endMsgIdx) to remove
  let runStart = 0;

  while (runStart < sigs.length) {
    let runEnd = runStart + 1;
    while (runEnd < sigs.length && sigs[runEnd].sig === sigs[runStart].sig) {
      runEnd++;
    }

    // Also check 2-element cycles: A,B,A,B,A,B...
    let cycleLen = 1;
    if (runEnd - runStart < minRepeats && runStart + 1 < sigs.length) {
      // Check for AB cycle
      let pairRepeats = 1;
      let j = runStart + 2;
      while (
        j + 1 < sigs.length &&
        sigs[j].sig === sigs[runStart].sig &&
        sigs[j + 1].sig === sigs[runStart + 1].sig
      ) {
        pairRepeats++;
        j += 2;
      }
      if (pairRepeats >= minRepeats) {
        cycleLen = 2;
        runEnd = runStart + pairRepeats * 2;
      }
    }

    const repeats = cycleLen === 1
      ? runEnd - runStart
      : Math.floor((runEnd - runStart) / cycleLen);

    if (repeats >= minRepeats) {
      // Keep first cycle, drop the rest
      const keepEnd = sigs[runStart + cycleLen - 1].idx;
      const dropStart = keepEnd + 1;

      // Find the end of the last repeated cycle's tool results
      let dropEnd = sigs[runEnd - 1].idx;
      // Include tool result messages that follow the last assistant msg
      while (dropEnd + 1 < messages.length && messages[dropEnd + 1].role === "tool") {
        dropEnd++;
      }

      // Also skip tool results after the kept first cycle
      const actualDropStart = keepEnd + 1;
      // But we need to keep the tool results for the first cycle
      let firstCycleResultEnd = keepEnd;
      while (
        firstCycleResultEnd + 1 < messages.length &&
        messages[firstCycleResultEnd + 1].role === "tool"
      ) {
        firstCycleResultEnd++;
      }

      if (firstCycleResultEnd + 1 <= dropEnd) {
        dropRanges.push({
          start: firstCycleResultEnd + 1,
          end: dropEnd + 1,
          repeats,
          toolName: sigs[runStart].sig.split(":")[0],
        });
        loopsCollapsed++;
      }
    }

    runStart = runEnd;
  }

  if (dropRanges.length === 0) return { messages, loopsCollapsed: 0 };

  // Build new message array, replacing dropped ranges with warnings
  const dropSet = new Set();
  const warnings = new Map(); // insertAtIdx → warning text

  for (const range of dropRanges) {
    for (let i = range.start; i < range.end; i++) {
      dropSet.add(i);
    }
    const warning =
      `[LOOP DETECTED] You called ${range.toolName} ${range.repeats} times in a row with the same arguments and got the same result each time. ` +
      `The repeated calls have been removed from context. Try a DIFFERENT approach — use a different tool, different arguments, or move on to another step.`;
    warnings.set(range.start, warning);
  }

  const result = [];
  for (let i = 0; i < messages.length; i++) {
    if (warnings.has(i)) {
      result.push({ role: "user", content: warnings.get(i) });
    }
    if (!dropSet.has(i)) {
      result.push(messages[i]);
    }
  }

  console.log(
    `[prune] Collapsed ${loopsCollapsed} tool-call loop(s), removed ${dropSet.size} messages`,
  );

  return { messages: result, loopsCollapsed };
}

/**
 * Prune the conversation to remove bloat from failed/redundant tool calls.
 *
 * Strategy:
 *  0. Collapse repeating tool-call loops (click→state→click→state…)
 *  1. Always keep: system msg, first user msg, last N messages
 *  2. Middle section: remove failed tool call+result pairs,
 *     collapse redundant page_state calls, truncate oversized results
 *  3. If still over budget, aggressively summarize old tool results
 *
 * @param {Object[]} messages - The full message array
 * @param {Object} opts
 * @param {number} opts.keepRecent - How many recent messages to always keep (default 10)
 * @param {number} opts.maxResultChars - Max chars per tool result in the middle section (default 800)
 * @param {number} opts.targetTokens - Target token budget; if exceeded, applies aggressive truncation
 * @returns {Object[]} Pruned message array
 */
function pruneMessages(messages, opts = {}) {
  const {
    keepRecent = parseInt(process.env.PRUNE_KEEP_RECENT) || 10,
    maxResultChars = parseInt(process.env.PRUNE_MAX_RESULT_CHARS) || 800,
    targetTokens = parseInt(process.env.PRUNE_TARGET_TOKENS) || 0,
  } = opts;

  if (!messages || messages.length <= keepRecent + 2) return messages;

  // Pass 0: collapse tool-call loops before any other pruning
  const { messages: delooped } = collapseToolLoops(messages);

  const systemMsgs = [];
  let firstUserIdx = -1;

  for (let i = 0; i < delooped.length; i++) {
    if (delooped[i].role === "system") {
      systemMsgs.push(delooped[i]);
    } else if (delooped[i].role === "user" && firstUserIdx === -1) {
      firstUserIdx = i;
      break;
    }
  }

  const splitPoint = delooped.length - keepRecent;
  const middleStart = firstUserIdx === -1 ? systemMsgs.length : firstUserIdx + 1;

  if (splitPoint <= middleStart) return delooped;

  const middle = delooped.slice(middleStart, splitPoint);
  const recent = delooped.slice(splitPoint);

  // Pass 1: identify failed tool results and their corresponding tool_call IDs
  const failedToolCallIds = new Set();
  for (const msg of middle) {
    if (msg.role === "tool" && isFailedToolResult(msg.content)) {
      failedToolCallIds.add(msg.tool_call_id);
    }
  }

  // Pass 2: build pruned middle — remove failed pairs, truncate results, collapse redundant calls
  const prevStates = new Set();
  const prunedMiddle = [];

  for (const msg of middle) {
    // Skip tool results for failed calls
    if (msg.role === "tool" && failedToolCallIds.has(msg.tool_call_id)) {
      continue;
    }

    // For assistant messages with tool_calls, filter out failed ones
    if (msg.role === "assistant" && msg.tool_calls) {
      const surviving = msg.tool_calls.filter(
        (tc) => !failedToolCallIds.has(tc.id),
      );
      if (surviving.length === 0) continue;

      // Skip if all remaining calls are redundant page_state
      const clone = { ...msg, tool_calls: surviving };
      if (isRedundantPageState(clone, prevStates)) continue;

      prunedMiddle.push(clone);
      continue;
    }

    // Truncate oversized tool results
    if (
      msg.role === "tool" &&
      typeof msg.content === "string" &&
      msg.content.length > maxResultChars
    ) {
      prunedMiddle.push({
        ...msg,
        content:
          msg.content.slice(0, maxResultChars) + "\n[...truncated...]",
      });
      continue;
    }

    prunedMiddle.push(msg);
  }

  let result = [
    ...systemMsgs,
    ...(firstUserIdx >= 0 ? [delooped[firstUserIdx]] : []),
    ...prunedMiddle,
    ...recent,
  ];

  // Pass 3: if we have a target token budget and we're over it,
  // aggressively trim old tool results to 200 chars
  if (targetTokens > 0) {
    let est = estimateMessageTokens(result);
    if (est > targetTokens) {
      const aggressiveMax = 200;
      for (
        let i = systemMsgs.length + 1;
        i < result.length - keepRecent;
        i++
      ) {
        if (
          result[i].role === "tool" &&
          typeof result[i].content === "string" &&
          result[i].content.length > aggressiveMax
        ) {
          result[i] = {
            ...result[i],
            content:
              result[i].content.slice(0, aggressiveMax) +
              "\n[...aggressively truncated...]",
          };
        }
      }
      est = estimateMessageTokens(result);

      // If still over, drop oldest middle messages in pairs
      while (
        est > targetTokens &&
        result.length > systemMsgs.length + 1 + keepRecent + 2
      ) {
        const dropIdx = systemMsgs.length + 1;
        result.splice(dropIdx, 1);
        est = estimateMessageTokens(result);
      }
    }
  }

  const origTokens = estimateMessageTokens(messages);
  const newTokens = estimateMessageTokens(result);
  const pctSaved = origTokens > 0
    ? Math.round(((origTokens - newTokens) / origTokens) * 100)
    : 0;

  console.log(
    `[prune] ${messages.length} → ${result.length} msgs | ~${origTokens.toLocaleString()} → ~${newTokens.toLocaleString()} tokens (${pctSaved}% reduction)`,
  );

  return result;
}

// ── Extract user query from messages ─────────────────────────────────

function extractUserQuery(messages) {
  // Walk backwards to find the most recent user message
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "user") continue;
    if (typeof msg.content === "string") return msg.content;
    if (Array.isArray(msg.content)) {
      const text = msg.content
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join(" ");
      if (text) return text;
    }
  }
  return "";
}

// ── Emergency Compression ─────────────────────────────────────────────
//
// Used when the upstream LLM returns a context-window error.  Collapses
// the entire middle section (everything between the system message and the
// last `keepRecent` messages) into a single synthetic summary note, and
// keeps a hard cap on tool results everywhere.
//
// This is intentionally more aggressive than pruneMessages — we'd rather
// lose some history than have the agent fail silently.

/**
 * Extract a 1-line synopsis of an assistant or tool message for the summary.
 */
function summariseMsg(msg) {
  if (msg.role === "tool") {
    const raw =
      typeof msg.content === "string"
        ? msg.content
        : (msg.content || []).map((p) => p.text || "").join("");
    return `  • tool result (${msg.tool_call_id || "?"}): ${raw.slice(0, 120).replace(/\n/g, " ")}`;
  }
  if (msg.role === "assistant") {
    const text =
      typeof msg.content === "string"
        ? msg.content
        : (msg.content || []).map((p) => p.text || "").join("");
    const calls = (msg.tool_calls || [])
      .map((tc) => tc.function?.name || "?")
      .join(", ");
    if (calls) return `  • assistant called: ${calls}`;
    return `  • assistant: ${text.slice(0, 120).replace(/\n/g, " ")}`;
  }
  return null;
}

/**
 * Emergency compression: keep system + first user + summary note + last N messages.
 *
 * @param {Object[]} messages
 * @param {Object}   opts
 * @param {number}   opts.keepRecent    Messages to keep verbatim from the tail (default 6)
 * @param {number}   opts.maxToolChars  Hard cap on each tool result in the kept tail (default 400)
 * @returns {Object[]}
 */
function emergencyCompress(messages, opts = {}) {
  const { keepRecent = 6, maxToolChars = 400 } = opts;

  if (!messages || messages.length <= keepRecent + 2) return messages;

  const system = messages.filter((m) => m.role === "system");
  const nonSystem = messages.filter((m) => m.role !== "system");

  // First user message
  const firstUserIdx = nonSystem.findIndex((m) => m.role === "user");
  const firstUser = firstUserIdx >= 0 ? nonSystem[firstUserIdx] : null;

  // Middle section to collapse
  const afterFirst = firstUserIdx >= 0 ? nonSystem.slice(firstUserIdx + 1) : nonSystem;
  const middle = afterFirst.slice(0, Math.max(0, afterFirst.length - keepRecent));
  const recent = afterFirst.slice(Math.max(0, afterFirst.length - keepRecent));

  // Cap tool results in the recent tail
  const cappedRecent = recent.map((m) => {
    if (
      m.role === "tool" &&
      typeof m.content === "string" &&
      m.content.length > maxToolChars
    ) {
      return { ...m, content: m.content.slice(0, maxToolChars) + "\n[...truncated for context]" };
    }
    return m;
  });

  if (middle.length === 0) {
    return [...system, ...(firstUser ? [firstUser] : []), ...cappedRecent];
  }

  // Build a compact summary of what was dropped
  const lines = middle
    .map(summariseMsg)
    .filter(Boolean)
    .slice(0, 40);  // cap summary length

  const summaryNote = {
    role: "user",
    content:
      `[Context compressed — ${middle.length} earlier messages summarised to fit context window]\n` +
      `Key history:\n${lines.join("\n") || "  (no salient content)"}\n` +
      `[End of summary — recent messages follow]`,
  };

  const result = [
    ...system,
    ...(firstUser ? [firstUser] : []),
    summaryNote,
    ...cappedRecent,
  ];

  const origEst = estimateMessageTokens(messages);
  const newEst  = estimateMessageTokens(result);
  console.log(
    `[emergency-compress] ${messages.length} → ${result.length} msgs | ` +
    `~${origEst.toLocaleString()} → ~${newEst.toLocaleString()} tokens`,
  );

  return result;
}

// ── Main optimize function ───────────────────────────────────────────

/**
 * Collect tool names that appear in recent assistant tool_calls so
 * they stay available even if BM25 wouldn't rank them highly.
 */
function extractRecentToolNames(messages, lookback = 6) {
  const names = new Set();
  const start = Math.max(0, messages.length - lookback);
  for (let i = start; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === "assistant" && msg.tool_calls) {
      for (const tc of msg.tool_calls) {
        const name = tc.function?.name;
        if (name) names.add(name);
      }
    }
  }
  return [...names];
}

/**
 * Optimize a chat completions request body by pruning messages and
 * selecting relevant tools.
 *
 * @param {Object} body - The incoming /v1/chat/completions request body
 * @param {Object} opts
 * @param {number} opts.contextWindow - Total context window size for the model
 * @returns {Object} Modified request body
 */
function optimizeRequest(body, opts = {}) {
  const { contextWindow = 32000 } = opts;

  const query = extractUserQuery(body.messages || []);

  // Prune messages — reserve ~25% of context for the response
  const targetTokens = Math.floor(contextWindow * 0.75);
  const prunedMessages = pruneMessages(body.messages || [], { targetTokens });

  // Select tools — keep any tool the agent recently called so it can
  // continue multi-step workflows without losing access mid-chain
  const recentTools = extractRecentToolNames(body.messages || []);
  const alwaysInclude = [...CORE_TOOLS, ...recentTools];

  const selectedTools =
    body.tools && body.tools.length > 0
      ? selectTools(query, body.tools, { alwaysInclude })
      : body.tools;

  return {
    ...body,
    messages: prunedMessages,
    tools: selectedTools,
  };
}

module.exports = {
  selectTools,
  pruneMessages,
  emergencyCompress,
  optimizeRequest,
  extractUserQuery,
  estimateMessageTokens,
};
