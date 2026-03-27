const { Memory } = require("../../models/memory");
const { SystemSettings } = require("../../models/systemSettings");

const INJECTED_WORKSPACE_LIMIT = 5;

/**
 * Fetches and formats relevant memories for injection into the system prompt.
 * Returns global memories (up to 5) + top 5 workspace memories (reranked if >5 exist).
 * @param {number|null} userId
 * @param {number} workspaceId
 * @param {string} prompt - The current user message
 * @param {object[]} rawHistory - Recent chat history objects with .prompt field
 * @returns {Promise<string>} Formatted memory section or empty string
 */
async function getMemoriesForPrompt(userId, workspaceId, prompt, rawHistory) {
  try {
    const enabled = await SystemSettings.getValueOrFallback(
      { label: "memory_enabled" },
      "off"
    );
    if (enabled !== "on") return "";

    const globalMemories = await Memory.globalForUser(userId ?? null);
    const workspaceMemories = await Memory.forUserWorkspace(
      userId ?? null,
      workspaceId
    );

    if (globalMemories.length === 0 && workspaceMemories.length === 0)
      return "";

    let selectedWorkspace = workspaceMemories;
    if (workspaceMemories.length > INJECTED_WORKSPACE_LIMIT) {
      // Skip reranking when there's no query context (agent calls)
      const hasContext = prompt?.trim() || rawHistory?.length > 0;
      selectedWorkspace = hasContext
        ? await rerankMemories(workspaceMemories, prompt, rawHistory)
        : workspaceMemories.slice(0, INJECTED_WORKSPACE_LIMIT);
    }

    const injectedIds = [
      ...globalMemories.map((m) => m.id),
      ...selectedWorkspace.map((m) => m.id),
    ];
    Memory.updateLastUsed(injectedIds);

    return formatMemories(globalMemories, selectedWorkspace);
  } catch (error) {
    console.error("[Memory Injection] Error:", error.message);
    return "";
  }
}

/**
 * Reranks workspace memories against the current prompt + recent history.
 * Falls back to most recently created memories if reranker fails.
 * @param {object[]} memories
 * @param {string} prompt
 * @param {object[]} rawHistory
 * @returns {Promise<object[]>}
 */
async function rerankMemories(memories, prompt, rawHistory) {
  try {
    const {
      NativeEmbeddingReranker,
    } = require("../EmbeddingRerankers/native/index.js");
    const reranker = new NativeEmbeddingReranker();

    const recentMessages = (rawHistory || [])
      .slice(-3)
      .map((m) => m.prompt)
      .filter(Boolean)
      .join(" ");
    const query = `${prompt} ${recentMessages}`.trim();
    const documents = memories.map((m) => ({ text: m.content }));

    const reranked = await reranker.rerank(query, documents, {
      topK: INJECTED_WORKSPACE_LIMIT,
    });

    return reranked.map((r) => memories[r.rerank_corpus_id]);
  } catch (error) {
    console.error(
      "[Memory Injection] Reranker failed, falling back to recent:",
      error.message
    );
    return memories.slice(0, INJECTED_WORKSPACE_LIMIT);
  }
}

/**
 * Formats global and workspace memories into a prompt section string.
 * @param {object[]} globalMemories
 * @param {object[]} workspaceMemories
 * @returns {string}
 */
function formatMemories(globalMemories, workspaceMemories) {
  const lines = [];
  for (const m of globalMemories) lines.push(`- ${m.content}`);
  for (const m of workspaceMemories) lines.push(`- ${m.content}`);
  if (lines.length === 0) return "";
  return `## Things I Remember About You\n${lines.join("\n")}`;
}

/**
 * Appends any relevant memories onto a base system prompt.
 * @param {Object} opts
 * @param {string} opts.systemPrompt - The base system prompt
 * @param {number|null} opts.userId
 * @param {number} opts.workspaceId
 * @param {string} [opts.prompt] - Current user message (used for reranking)
 * @param {object[]} [opts.rawHistory] - Recent chat history (used for reranking)
 * @returns {Promise<string>} The system prompt with memories appended (if any)
 */
async function promptWithMemories({
  systemPrompt,
  userId,
  workspaceId,
  prompt = "",
  rawHistory = [],
}) {
  const memoriesContext = await getMemoriesForPrompt(
    userId,
    workspaceId,
    prompt,
    rawHistory
  );
  return memoriesContext
    ? `${systemPrompt}\n\n${memoriesContext}`
    : systemPrompt;
}

module.exports = { promptWithMemories };
