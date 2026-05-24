const { log, conclude } = require("./helpers/index.js");
const { SystemSettings } = require("../models/systemSettings.js");
const { Memory } = require("../models/memory.js");
const { WorkspaceChats } = require("../models/workspaceChats.js");
const { Workspace } = require("../models/workspace.js");
const truncate = require("truncate");
const {
  groupByUserWorkspace,
  loadLatestChats,
  resolveLLM,
  buildObserverUserMessage,
  runObserver,
  buildReflectorUserMessage,
  runReflector,
} = require("./helpers/memory-extraction-utils.js");

// 20 minutes default; 0 disables the idle check.
const IDLE_THRESHOLD_MS = Number(
  process.env.MEMORY_IDLE_THRESHOLD_MS ?? 20 * 60 * 1000
);

// Minimum chats required before processing memories for a user/workspace pair.
const MIN_CHATS_TO_PROCESS = 5;

(async () => {
  try {
    if (!(await SystemSettings.autoMemoriesEnabled())) {
      log("Automatic memory extraction is disabled. Exiting.");
      return;
    }

    // Discover (user, workspace) groups with unprocessed visible chats.
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
 * Process a single (user, workspace) group via two-phase extraction:
 *   Phase 1 (Observer)  — extract candidate facts from conversations
 *   Phase 2 (Reflector) — classify scope, deduplicate, filter against existing memories
 * Then apply the final memories and mark all chats as processed.
 * @param {object[]} groupChats - chats for this group, sorted asc.
 */
async function processGroup(groupChats) {
  const { user_id: userId, workspaceId } = groupChats[0];
  const tag = `user ${userId}, workspace ${workspaceId}`;

  if (groupChats.length < MIN_CHATS_TO_PROCESS) {
    log(
      `${tag} has only ${groupChats.length} chat(s). Need at least ${MIN_CHATS_TO_PROCESS}. Skipping.`
    );
    return;
  }

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

    const globalSlots = Memory.GLOBAL_LIMIT - globalMemories.length;
    if (
      globalSlots <= 0 &&
      workspaceMemories.length >= Memory.WORKSPACE_LIMIT
    ) {
      log(`${tag} is at max capacity. Skipping.`);
      return;
    }

    log(
      `Running Observer for ${tag} using ${llm.provider}/${llm.model} on ${chats.length} chat(s).`
    );
    const observerMessage = buildObserverUserMessage(chats);
    const { candidates, rawText: observerRaw } = await runObserver({
      ...llm,
      userMessage: observerMessage,
    });

    if (candidates === null || candidates.length === 0) {
      log(`Observer produced no candidates for ${tag}.`);
      if (observerRaw)
        log(`Observer raw response:\n${truncate(observerRaw, 2000)}`);
      if (candidates === null)
        log(
          `(Tool handler was never called — model may not have produced a tool call.)`
        );
      return;
    }
    log(`Observer produced ${candidates.length} candidate(s) for ${tag}:`);
    for (const c of candidates)
      log(`  [${c.confidence}] "${c.content}" — ${c.reasoning}`);

    log(`Running Reflector for ${tag} with ${candidates.length} candidate(s).`);
    const reflectorMessage = buildReflectorUserMessage(
      candidates,
      workspaceMemories,
      globalMemories,
      globalSlots
    );
    const { memories: finalMemories, rawText: reflectorRaw } =
      await runReflector({
        ...llm,
        userMessage: reflectorMessage,
      });

    if (finalMemories === null || finalMemories.length === 0) {
      log(`Reflector produced no actionable memories for ${tag}.`);
      if (reflectorRaw)
        log(`Reflector raw response:\n${truncate(reflectorRaw, 2000)}`);
      if (finalMemories === null)
        log(
          `(Tool handler was never called — model may not have produced a tool call.)`
        );
      return;
    }

    log(`Reflector approved ${finalMemories.length} memory/ies for ${tag}:`);
    for (const m of finalMemories)
      log(
        `  [${m.scope}/${m.action}${m.action === "update" ? `#${m.updateId}` : ""}] "${m.content}" — ${m.reasoning}`
      );

    const result = await Memory.applyExtractedMemories(
      userId,
      workspaceId,
      finalMemories,
      globalSlots
    );
    log(
      `Applied ${result.workspaceCount} workspace + ${result.globalCount} global + ${result.updatedCount} updated memories for ${tag} in "${workspace.name}". Reviewed ${chats.length} chat(s).`
    );
  } catch (error) {
    log(`Error processing ${tag}: ${error.message}`);
  } finally {
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
