const { WorkspaceChats } = require("../../models/workspaceChats.js");
const { safeJsonParse } = require("../../utils/http/index.js");
const { getBaseLLMProviderModel } = require("../../utils/helpers/index.js");
const AIbitat = require("../../utils/agents/aibitat/index.js");
const truncate = require("truncate");

// Cap per-group chat review so a long-dormant user can't trigger a 500-chat summarization.
const CHATS_PER_RUN_LIMIT = 20;

// Per-message cap — we keep 20 chats of context but truncate each prompt/response
// so a single huge message doesn't blow the LLM's context window.
const MAX_CHARS_PER_MESSAGE = 1500;

// Hard ceiling on candidates the Observer can return per run.
const MAX_CANDIDATES_PER_RUN = 3;

const OBSERVER_SYSTEM_PROMPT = `You are a memory observer for a personalized AI assistant. Your job is to identify facts about the user that are worth remembering for future conversations.

You will be shown recent conversations between a user and an AI assistant. Extract candidate observations — factual statements about the user that would help personalize future responses.

RULES:
- Maximum ${MAX_CANDIDATES_PER_RUN} observations per batch.
- Each observation must be a single, concise factual statement (1 sentence max).
- Assign a confidence level: "high" for explicitly stated facts, "medium" for strongly implied facts, "low" for inferences.
- If the user shares their name, that is ALWAYS worth extracting.
- If nothing useful is found, return an empty list — but look carefully first.

WHAT TO EXTRACT:
- The user's name, role, company, or team
- What the user is working on or their goals
- Preferences the user has stated (communication style, tools, formats)
- Expertise areas or technical background
- Constraints or requirements the user mentioned

WHAT TO SKIP:
- The assistant's opinions or assessments about the user
- Emotional states or motivational commentary
- Generic politeness ("thanks", "sounds good", willingness to continue)
- Information that only the assistant stated, not the user

When finished you MUST call the submit-observations tool.`;

const REFLECTOR_SYSTEM_PROMPT = `You are a memory reflector for a personalized AI assistant. You review candidate observations and decide which ones should actually be saved as memories.

You will be shown:
1. Candidate observations from recent conversations (with confidence levels)
2. All existing GLOBAL memories for this user
3. All existing WORKSPACE memories for this workspace

Your job:
1. CLASSIFY SCOPE — For each candidate, ask: "Would knowing this help the assistant in a completely different workspace/project?"
   - YES → GLOBAL (e.g., "User's name is Tim", "User prefers concise responses", "User is a senior engineer")
   - NO  → WORKSPACE (e.g., "Working on a math conjectures project", "Prefers visual aids for this project")

2. DEDUPLICATE — Drop any candidate that overlaps with an existing memory, even if worded differently. Do NOT create near-duplicates.

3. CONSOLIDATE — If a candidate updates or refines an existing WORKSPACE memory, return it as an "update" action with the ID of the memory to update, rather than creating a new one. GLOBAL memories are never updated — only new ones are appended.

4. FILTER — Drop "low" confidence candidates unless they are clearly a user identity fact (name, role, company). Drop "medium" confidence candidates unless they are strong persistent preferences.

When finished you MUST call the save-memories tool. An empty list is correct if all candidates were duplicates or low-value. That is a good outcome.`;

/**
 * Group chats by (user_id, workspaceId).
 * @param {object[]} chats
 * @returns {Map<string, object[]>}
 */
function groupByUserWorkspace(chats) {
  const groups = new Map();
  for (const chat of chats) {
    const key = `${chat.user_id}:${chat.workspaceId}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(chat);
  }
  return groups;
}

/**
 * Requery at summarize time so we reflect the current state (new chats, deletions).
 * Drop chats that died mid-stream / are pending, then reverse to chronological order.
 * @returns {Promise<object[]>}
 */
async function loadLatestChats(userId, workspaceId) {
  const latest = await WorkspaceChats.where(
    { user_id: userId, workspaceId, include: true },
    CHATS_PER_RUN_LIMIT,
    { createdAt: "desc" }
  );
  return latest
    .filter((c) => {
      const parsed = safeJsonParse(c.response);
      return typeof parsed?.text === "string" && parsed.text.length > 0;
    })
    .reverse();
}

/**
 * Pick a provider/model: workspace chat → workspace agent → system default.
 * @returns {{provider: string, model: string}|null}
 */
function resolveLLM(workspace) {
  if (workspace.chatProvider && workspace.chatModel)
    return { provider: workspace.chatProvider, model: workspace.chatModel };
  if (workspace.agentProvider && workspace.agentModel)
    return { provider: workspace.agentProvider, model: workspace.agentModel };
  const provider = process.env.LLM_PROVIDER;
  const model = provider ? getBaseLLMProviderModel({ provider }) : null;
  if (provider && model) return { provider, model };
  return null;
}

// ── Phase 1: Observer ────────────────────────────────────────────────

function buildObserverUserMessage(chats) {
  const formattedChats = chats
    .map((chat) => {
      const lines = [`User: ${truncate(chat.prompt, MAX_CHARS_PER_MESSAGE)}`];
      const parsed = safeJsonParse(chat.response);
      if (parsed?.text)
        lines.push(
          `Assistant: ${truncate(parsed.text, MAX_CHARS_PER_MESSAGE)}`
        );
      return lines.join("\n");
    })
    .join("\n\n");

  return `Recent conversations to analyze:\n${formattedChats}`;
}

/**
 * Phase 1: Observer agent — extracts candidate facts from conversations.
 * Returns {candidates, rawText} where candidates is an array or null,
 * and rawText is whatever the model said (for debugging when the tool isn't called).
 */
async function runObserver({ provider, model, userMessage }) {
  let candidates = null;
  let rawText = "";
  const aibitat = new AIbitat({ provider, model, maxRounds: 3 });

  aibitat.onMessage((msg) => {
    if (msg.from === "OBSERVER" && msg.content) rawText = msg.content;
  });

  aibitat
    .function({
      name: "submit-observations",
      description:
        "Submit candidate observations extracted from the conversations. An empty list is correct if nothing worth remembering was found.",
      parameters: {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          observations: {
            type: "array",
            maxItems: MAX_CANDIDATES_PER_RUN,
            items: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description:
                    "A single factual statement about the user (1 sentence max).",
                },
                confidence: {
                  type: "string",
                  enum: ["high", "medium", "low"],
                  description:
                    "high = explicitly stated, medium = strongly implied, low = inferred.",
                },
                reasoning: {
                  type: "string",
                  description:
                    "Brief justification for why this is worth remembering.",
                },
              },
              required: ["content", "confidence", "reasoning"],
              additionalProperties: false,
            },
            description: `Candidate observations, max ${MAX_CANDIDATES_PER_RUN} items. Empty list is fine.`,
          },
        },
        required: ["observations"],
        additionalProperties: false,
      },
      handler: function (args) {
        const { observations } = args;
        candidates = Array.isArray(observations)
          ? observations
              .filter(
                (o) =>
                  typeof o === "object" &&
                  o !== null &&
                  typeof o.content === "string" &&
                  o.content.trim().length > 0 &&
                  ["high", "medium", "low"].includes(o.confidence)
              )
              .slice(0, MAX_CANDIDATES_PER_RUN)
          : null;
        aibitat.skipHandleExecution = true;
        return "Observations submitted.";
      },
    })
    .agent("USER", { role: "Provides conversations for observation." })
    .agent("OBSERVER", {
      role: OBSERVER_SYSTEM_PROMPT,
      functions: ["submit-observations"],
    });

  await aibitat.start({
    from: "USER",
    to: "OBSERVER",
    content: userMessage,
  });

  return { candidates, rawText };
}

// ── Phase 2: Reflector ───────────────────────────────────────────────

function buildReflectorUserMessage(
  candidates,
  workspaceMemories,
  globalMemories,
  globalSlots
) {
  const formatMemoryList = (memories) => {
    if (memories.length === 0) return "None.";
    return memories.map((m) => `- [ID: ${m.id}] ${m.content}`).join("\n");
  };

  const formatCandidates = (obs) =>
    obs
      .map(
        (o, i) =>
          `${i + 1}. "${o.content}" (confidence: ${o.confidence}) — ${o.reasoning}`
      )
      .join("\n");

  const sections = [];

  sections.push(
    `Candidate observations from the Observer:\n${formatCandidates(candidates)}`
  );

  sections.push(
    `Existing GLOBAL memories:\n${formatMemoryList(globalMemories)}`
  );
  if (globalSlots > 0) sections.push(`Available GLOBAL slots: ${globalSlots}`);
  else sections.push(`GLOBAL is full — do not return any GLOBAL memories.`);

  sections.push(
    `Existing WORKSPACE memories:\n${formatMemoryList(workspaceMemories)}`
  );

  return sections.join("\n\n");
}

/**
 * Phase 2: Reflector agent — classifies scope, deduplicates, and filters
 * candidates against existing memories.
 * Returns {memories, rawText} where memories is an array or null.
 */
async function runReflector({ provider, model, userMessage }) {
  let finalMemories = null;
  let rawText = "";
  const aibitat = new AIbitat({ provider, model, maxRounds: 3 });

  aibitat.onMessage((msg) => {
    if (msg.from === "REFLECTOR" && msg.content) rawText = msg.content;
  });

  aibitat
    .function({
      name: "save-memories",
      description:
        "Save the final list of memories after classification, deduplication, and filtering. An empty list is correct if all candidates were filtered out.",
      parameters: {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          memories: {
            type: "array",
            maxItems: MAX_CANDIDATES_PER_RUN,
            items: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "The memory statement (1 sentence max).",
                },
                scope: {
                  type: "string",
                  enum: ["WORKSPACE", "GLOBAL"],
                  description:
                    "GLOBAL for facts useful across all workspaces, WORKSPACE for project-specific facts.",
                },
                action: {
                  type: "string",
                  enum: ["create", "update", "skip"],
                  description:
                    "create = new memory, update = revise an existing workspace memory, skip = do not save.",
                },
                updateId: {
                  type: "number",
                  description:
                    "The ID of the existing WORKSPACE memory to update. Required when action is 'update'.",
                },
                reasoning: {
                  type: "string",
                  description:
                    "Brief justification for the scope classification and action decision.",
                },
              },
              required: ["content", "scope", "action", "reasoning"],
              additionalProperties: false,
            },
            description: `Final memories to save, max ${MAX_CANDIDATES_PER_RUN} items. Empty list is fine.`,
          },
        },
        required: ["memories"],
        additionalProperties: false,
      },
      handler: function (args) {
        const { memories } = args;
        finalMemories = Array.isArray(memories)
          ? memories
              .filter(
                (m) =>
                  typeof m === "object" &&
                  m !== null &&
                  typeof m.content === "string" &&
                  m.content.trim().length > 0 &&
                  ["WORKSPACE", "GLOBAL"].includes(m.scope) &&
                  ["create", "update", "skip"].includes(m.action)
              )
              .filter((m) => m.action !== "skip")
              .slice(0, MAX_CANDIDATES_PER_RUN)
          : null;
        aibitat.skipHandleExecution = true;
        return "Memories saved.";
      },
    })
    .agent("USER", { role: "Provides candidate observations for reflection." })
    .agent("REFLECTOR", {
      role: REFLECTOR_SYSTEM_PROMPT,
      functions: ["save-memories"],
    });

  await aibitat.start({
    from: "USER",
    to: "REFLECTOR",
    content: userMessage,
  });

  return { memories: finalMemories, rawText };
}

module.exports = {
  groupByUserWorkspace,
  loadLatestChats,
  resolveLLM,
  buildObserverUserMessage,
  runObserver,
  buildReflectorUserMessage,
  runReflector,
};
