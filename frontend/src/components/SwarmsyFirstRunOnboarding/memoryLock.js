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

export function buildMemoryLockStarterMessage(memoryLock) {
  const trimmedMemoryLock = `${memoryLock || ""}`.trim();
  if (!trimmedMemoryLock) return null;

  return `Continue this SWARMSY project from the memory lock below.

Do not restart the identity.
Do not rebuild the lore unless I explicitly ask.
New thread does not mean a new project.
Memory lock wins over fresh intake.
Combine memory lock + workspace docs + relevant SPARKY Wiki seed pack sections when they fit the task; seed packs add context only and do not replace the memory lock.
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
