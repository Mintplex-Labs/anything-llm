const { workspace } = require("../workspace");
const { broadcast } = require("../broadcast");

const IDLE_THRESHOLD_MS = 60_000;
const IDLE_CHECK_INTERVAL_MS = 5_000;

// Fires when the hypervisor agent has been running but idle (no RPC events)
// for longer than IDLE_THRESHOLD_MS without calling ask_user.  Surfaces a
// prompt to the user so they can nudge or abort.
function checkAgentIdle() {
  if (!workspace.piProcess) return;
  if (workspace.pendingHelp) return;
  if (workspace.lastActivityTs === 0) return;
  if (Date.now() < workspace.idleSuppressedUntil) return;

  const idleMs = Date.now() - workspace.lastActivityTs;
  if (idleMs < IDLE_THRESHOLD_MS) return;

  const idleSec = Math.round(idleMs / 1000);
  const fakeId = `idle-${Date.now()}`;
  workspace.pendingHelp = { id: fakeId, method: "input" };

  broadcast({
    type: "ask_for_help",
    requestId: fakeId,
    method: "input",
    content: `The agent has been idle for ${idleSec}s — it may be stuck. Does it need help?`,
    title: "Agent Idle",
  });

  console.log(`[idle] Agent idle for ${idleSec}s — surfaced prompt to user`);
}

function startIdleDetector() {
  setInterval(checkAgentIdle, IDLE_CHECK_INTERVAL_MS);
}

module.exports = { checkAgentIdle, startIdleDetector };
