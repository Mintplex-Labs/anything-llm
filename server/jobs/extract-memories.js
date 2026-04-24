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

const EXTRACTION_SYSTEM_PROMPT = `You are a memory extraction system for a personalized AI assistant. You manage a list of memories about the user that will be injected into future conversations to provide personalized responses.

Instructions:
- Review the conversations and extract any useful facts, preferences, or context about the user
- Return an updated list of memories (max 20) that combines existing memories with any new information
- If new information contradicts an old memory, keep only the updated version
- If an existing memory is still relevant, keep it
- Each memory should be a single, concise statement (1 sentence max)
- Focus on: names, preferences, projects, deadlines, relationships, expertise, communication style
- Skip small talk, pleasantries, and anything not useful for future personalization
- If nothing worth remembering was said, return the existing memories unchanged

When finished you MUST call the save-memories tool with your final list. Do not respond with free-form text — always use the tool.`;

(async () => {
  try {
    if (!(await SystemSettings.memoriesEnabled())) {
      log("Memory extraction is disabled. Exiting.");
      return;
    }

    // Phase 1 — discover (user, workspace) groups with unprocessed visible chats.
    // include:true filters out chats deleted via /reset — they must never be summarized.
    const allUnprocessed = await WorkspaceChats.where(
      { memoryProcessed: false, include: true },
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

    const currentMemories = await Memory.forUserWorkspace(userId, workspaceId);
    const userMessage = buildExtractionUserMessage(currentMemories, chats);
    const memories = await extractMemoriesViaAgent({ ...llm, userMessage });

    if (memories) {
      await Memory.replaceWorkspaceMemories(userId, workspaceId, memories);
      log(
        `Extracted ${memories.length} memories for ${tag} in "${workspace.name}". Reviewed ${chats.length} chat(s).`
      );
    } else {
      log(`Extraction returned no memories for ${tag}. Marking processed.`);
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

function buildExtractionUserMessage(currentMemories, chats) {
  const memoriesList =
    currentMemories.length > 0
      ? currentMemories.map((m, i) => `${i + 1}. ${m.content}`).join("\n")
      : "None yet.";

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

  return `Current memories for this workspace:\n${memoriesList}\n\nRecent conversations:\n${formattedChats}`;
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
            items: { type: "string" },
            description:
              "Updated memory statements, one sentence each, max 20 items.",
          },
        },
        required: ["memories"],
        additionalProperties: false,
      },
      handler: function ({ memories }) {
        extractedMemories = Array.isArray(memories)
          ? memories.filter((m) => typeof m === "string" && m.trim().length > 0)
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
