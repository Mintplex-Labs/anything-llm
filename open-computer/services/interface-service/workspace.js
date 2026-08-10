const { AGENT_NAME } = require("./config");

// Single shared workspace state for the active session.
// Sessions are top-level and idempotent — they do not interact with one another.
// Each session has one hypervisor (the main pi agent) and zero or more child
// subagents managed through the session/subagent-run module.
const workspace = {
  id: `ws_${AGENT_NAME}`,
  name: AGENT_NAME,

  // Connected WebSocket event stream clients
  streamClients: new Set(),

  // Overall service health (not the agent state)
  status: "running",

  // ── Hypervisor (main pi agent) ──
  piProcess: null,      // ChildProcess | null
  piRpc: null,          // piProcess.stdin | null — write JSON-lines to send RPC messages

  // ── Planning phase (plan-first mode) ──
  planningProcess: null, // ChildProcess running the planning pi
  pendingPlan: null,     // { id, prompt, title, reason, items, questions, attempt } | null

  // ── Subagent run (sequential child agents) ──
  subagentRun: null,     // SubagentRun object | null (see session/subagent-run.js)
  subagentContext: null, // Saved context for follow-up prompts after a subagent run

  // ── User interaction ──
  pendingHelp: null,     // { id, method, rpc?, runId? } | null — active ask_for_help request

  // ── Event log ──
  logBuffer: [],         // Capped ring of broadcast messages for late-connecting clients

  // ── Activity / idle tracking ──
  lastExitCode: undefined,
  _textBuf: "",          // Accumulates streaming text deltas between sentence boundaries
  lastActivityTs: 0,
  lastAgentText: "",
  idleSuppressedUntil: 0,
};

function currentAgentStatus() {
  if (workspace.piProcess || workspace.planningProcess || workspace.subagentRun)
    return "running";
  return workspace.lastExitCode !== undefined ? "done" : "idle";
}

module.exports = { workspace, currentAgentStatus };
