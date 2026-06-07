export const MEMORY_LOCK_EMPTY_ERROR = "Paste a memory lock before continuing.";

export const MEMORY_LOCK_BLOCKED_MESSAGE =
  "Create and load your SWARMSY HIVE before continuing from a memory lock.";

export function canContinueFromMemoryLock(status) {
  return Boolean(
    status?.workspace?.exists &&
      status?.workspace?.ready &&
      status?.workspace?.slug &&
      status?.doctrine?.statusAvailable === true &&
      status?.doctrine?.docsRootAvailable === true &&
      Number(status?.doctrine?.requiredMissing || 0) === 0 &&
      Number(status?.doctrine?.requiredNonLoadable || 0) === 0
  );
}

export function buildMemoryLockStarterMessage(
  memoryLock,
  { identityEmpireAvailable = false } = {}
) {
  const trimmedMemoryLock = `${memoryLock || ""}`.trim();
  if (!trimmedMemoryLock) return null;

  const identityEmpireContext = identityEmpireAvailable
    ? "Identity Empire knowledge available: combine memory lock + current workspace memory + workspace docs + imported SPARKY Wiki Identity Empire sections as supporting local context. Use relevant audit, relaunch, offer, campaign, PR, hidden/public boundary, measurement, and next-move sections only when they fit. Do not overwrite Memory Lock or existing identity/template structure unless I explicitly confirm. Do not use web/API unless Use API is explicitly enabled for this message. Use Ollama/local-first behavior and never require online lookup."
    : "No Identity Empire knowledge added yet; continue from memory lock + current workspace memory + workspace docs without blocking on a pack picker or online lookup.";

  return `Continue this SWARMSY project from the memory lock below.

Do not restart the identity.
Do not rebuild the lore unless I explicitly ask.
New thread does not mean a new project.
Memory lock wins over fresh intake.
${identityEmpireContext}
Do not invent missing memory.
If the memory lock is unclear, ask for clarification before changing project state.
First summarize the locked project state, then show:
1. Current Priority
2. Blocked Tasks
3. Proof Gaps
4. Next Best Action
5. What I should ignore today

Memory Lock:
${trimmedMemoryLock}`;
}
