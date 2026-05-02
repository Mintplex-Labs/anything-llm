const { log, conclude } = require("./helpers/index.js");
const { SystemSettings } = require("../models/systemSettings.js");
const { Memory } = require("../models/memory.js");
const { WorkspaceChats } = require("../models/workspaceChats.js");
const { Workspace } = require("../models/workspace.js");
const { safeJsonParse } = require("../utils/http/index.js");
const { getBaseLLMProviderModel } = require("../utils/helpers/index.js");
const AIbitat = require("../utils/agents/aibitat/index.js");
const truncate = require("truncate");

// 20 minutes default; 0 disables the idle check.
const IDLE_THRESHOLD_MS = Number(
  process.env.MEMORY_IDLE_THRESHOLD_MS ?? 20 * 60 * 1000
);

// Cap per-group chat review so a long-dormant user can't trigger a 500-chat summarization.
const CHATS_PER_RUN_LIMIT = 20;

// Per-message cap — we keep 20 chats of context but truncate each prompt/response
// so a single huge message doesn't blow the LLM's context window.
const MAX_CHARS_PER_MESSAGE = 1500;
const EXTRACTION_SYSTEM_PROMPT = `You are a memory extraction system for a personalized AI assistant. Your job is to accumulate useful memories about the user over time.

You will be shown:
1. Existing GLOBAL memories — established facts about the user (for context, do NOT duplicate or modify these)
2. Current WORKSPACE memories — can be revised, consolidated, or replaced as the project evolves
3. Recent conversations to extract new information from

Instructions:
- Extract genuinely useful facts, preferences, or context from the conversations
- Quality over quantity — only add memories that are clearly valuable for future personalization
- Each memory should be a single, concise statement (1 sentence max)
- Focus on: names, preferences, projects, deadlines, relationships, expertise, communication style
- Skip small talk, pleasantries, and anything not useful for future personalization
- Return an empty list if nothing worth saving — that's perfectly fine

Memory Scopes:

WORKSPACE memories are flexible — return an updated set that reflects the current project state:
- You may revise, consolidate, or remove outdated workspace memories
- Examples: "Working on a React dashboard for client X", "Current sprint deadline is March 15th"

GLOBAL memories are append-only — only add NEW facts not already captured:
- Do NOT return existing global memories (they're already saved)
- Only return new global facts discovered in the conversations
- Examples: "User's name is Alex", "Works as a senior software engineer", "Prefers concise responses"

When finished you MUST call the save-memories tool. An empty list is fine if nothing new was found.`;

(async () => {
  try {
    if (!(await SystemSettings.memoriesEnabled())) {
      log("Memory extraction is disabled. Exiting.");
      return;
    }

    // Phase 1 — discover (user, workspace) groups with unprocessed visible chats.
    // include:true filters out chats deleted via /reset — they must never be summarized.
    const allUnprocessed = await WorkspaceChats.where(
      { memoryProcessed: null, include: true },
      null,
      { createdAt: "asc" }
    );
    if (allUnprocessed.length === 0) {
      log("No unprocessed chats found. Exiting.");
      return;
    }

    const groups = groupByUserWorkspace(allUnprocessed);
    log(`Found ${groups.size} user/workspace pair(s) with unprocessed chats.`);

    for (const group of groups.values()) await processGroup(group);

    log("Memory extraction complete.");
  } catch (e) {
    console.error(e);
    log(`errored with ${e.message}`);
  } finally {
    conclude();
  }
})();

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
 * Process a single (user, workspace) group — summarize recent chats, save new memories,
 * and mark every unprocessed chat as processed so the backlog cannot grow.
 * Active groups are skipped entirely (left unmarked for next run).
 * @param {object[]} groupChats - phase-1 chats for this group, sorted asc.
 */
async function processGroup(groupChats) {
  const { user_id: userId, workspaceId } = groupChats[0];
  const tag = `user ${userId}, workspace ${workspaceId}`;

  if (isGroupActive(groupChats)) {
    log(`${tag} is still active. Skipping.`);
    return;
  }

  const unprocessedIds = groupChats.map((c) => c.id);
  try {
    const workspace = await Workspace.get({ id: workspaceId });
    if (!workspace) {
      log(`Workspace ${workspaceId} not found. Marking processed.`);
      return;
    }

    const chats = await loadLatestChats(userId, workspaceId);
    if (chats.length === 0) {
      log(`No summarizable chats for ${tag}. Marking processed.`);
      return;
    }

    const llm = resolveLLM(workspace);
    if (!llm) {
      log(`No LLM configured for workspace ${workspaceId}. Marking processed.`);
      return;
    }

    const workspaceMemories = await Memory.forUserWorkspace(
      userId,
      workspaceId
    );
    const globalMemories = await Memory.globalForUser(userId);

    // Early exit if global is full (workspace can always be revised)
    const globalSlots = Memory.GLOBAL_LIMIT - globalMemories.length;
    if (
      globalSlots <= 0 &&
      workspaceMemories.length >= Memory.WORKSPACE_LIMIT
    ) {
      log(`${tag} is at max capacity. Skipping.`);
      return;
    }

    const userMessage = buildExtractionUserMessage(
      workspaceMemories,
      globalMemories,
      globalSlots,
      chats
    );
    const memories = await extractMemoriesViaAgent({ ...llm, userMessage });

    console.log("memories", JSON.stringify(memories, null, 2));
    if (memories && memories.length > 0) {
      const result = await Memory.applyExtractedMemories(
        userId,
        workspaceId,
        memories,
        globalSlots
      );
      log(
        `Applied ${result.workspaceCount} workspace + ${result.globalCount} global memories for ${tag} in "${workspace.name}". Reviewed ${chats.length} chat(s).`
      );
    } else {
      log(`No new memories extracted for ${tag}. Marking processed.`);
    }
  } catch (error) {
    log(`Error processing ${tag}: ${error.message}`);
  } finally {
    // Every non-active path ends here so we mark once. Poison-pill chats and
    // unsummarizable groups alike get flipped to processed so they don't recur.
    await WorkspaceChats.markMemoryProcessed(unprocessedIds);
  }
}

/**
 * True if the user has chatted too recently for extraction to be safe.
 * Chats are sorted asc, so the last element is the most recent.
 */
function isGroupActive(groupChats) {
  const last = groupChats[groupChats.length - 1];
  return Date.now() - new Date(last.createdAt).getTime() < IDLE_THRESHOLD_MS;
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

function buildExtractionUserMessage(
  workspaceMemories,
  globalMemories,
  globalSlots,
  chats
) {
  const formatMemoryList = (memories) => {
    if (memories.length === 0) return "None.";
    return memories.map((m, i) => `${i + 1}. ${m.content}`).join("\n");
  };

  const sections = [];

  // Global memories (append-only, shown for context)
  sections.push(
    `Existing GLOBAL memories (do NOT duplicate these, only add new facts):\n${formatMemoryList(globalMemories)}`
  );
  if (globalSlots > 0) sections.push(`Available GLOBAL slots: ${globalSlots}`);
  else sections.push(`GLOBAL is full — do not return any GLOBAL memories.`);

  // Workspace memories (flexible, can be revised)
  sections.push(
    `Current WORKSPACE memories (return updated set as needed):\n${formatMemoryList(workspaceMemories)}`
  );

  // Conversations
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
  sections.push(`Recent conversations:\n${formattedChats}`);

  return sections.join("\n\n");
}

/**
 * One-shot AIbitat agent with a single internal `save-memories` tool. Native tool
 * calling is used when the provider supports it; AIbitat falls back to its
 * Untooled prompt flow otherwise. The tool handler captures the result via closure.
 * @returns {Promise<string[]|null>}
 */
async function extractMemoriesViaAgent({ provider, model, userMessage }) {
  let extractedMemories = null;
  const aibitat = new AIbitat({ provider, model, maxRounds: 3 });

  aibitat
    .function({
      name: "save-memories",
      description:
        "Save the final updated list of memories extracted from the user's conversations.",
      parameters: {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          memories: {
            type: "array",
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
                    "WORKSPACE for task/project-specific items, GLOBAL for universal user traits and preferences.",
                },
              },
              required: ["content", "scope"],
              additionalProperties: false,
            },
            description: "Updated memory objects, max 20 items.",
          },
        },
        required: ["memories"],
        additionalProperties: false,
      },
      handler: function ({ memories }) {
        extractedMemories = Array.isArray(memories)
          ? memories.filter(
              (m) =>
                typeof m === "object" &&
                m !== null &&
                typeof m.content === "string" &&
                m.content.trim().length > 0 &&
                ["WORKSPACE", "GLOBAL"].includes(m.scope)
            )
          : null;
        // We only need the tool's input — short-circuit AIbitat's follow-up
        // model call that would otherwise reason about the tool's return value.
        aibitat.skipHandleExecution = true;
        return "Memories saved.";
      },
    })
    .agent("USER", { role: "Provides conversations for memory extraction." })
    .agent("EXTRACTOR", {
      role: EXTRACTION_SYSTEM_PROMPT,
      functions: ["save-memories"],
    });

  await aibitat.start({
    from: "USER",
    to: "EXTRACTOR",
    content: userMessage,
  });

  return extractedMemories;
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
