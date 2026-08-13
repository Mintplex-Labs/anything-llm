const { LOG_BUFFER_MAX, VM_LOG_BUFFER_MAX } = require("./config");
const { workspace } = require("./workspace");
const { logChatMessage } = require("./session/chat-log");

// Ring buffer of VM-level log lines (server stdout/stderr) replayed to new
// WebSocket clients on connect.
const vmLogBuffer = [];

function broadcastVmLog(line) {
  const ts = new Date().toISOString();
  vmLogBuffer.push({ ts, line });
  if (vmLogBuffer.length > VM_LOG_BUFFER_MAX)
    vmLogBuffer.splice(0, vmLogBuffer.length - VM_LOG_BUFFER_MAX);
  const payload = JSON.stringify({ type: "vm_log", ts, content: line });
  for (const client of workspace.streamClients) {
    if (client.readyState === 1) client.send(payload);
  }
}

// Patch console so every log line is also broadcast to connected clients.
// This runs as a side effect on first require so all subsequent console calls
// are captured, including those from submodules loaded after this one.
const _origLog = console.log;
const _origWarn = console.warn;
const _origError = console.error;
console.log = (...args) => {
  _origLog(...args);
  broadcastVmLog(args.map(String).join(" "));
};
console.warn = (...args) => {
  _origWarn(...args);
  broadcastVmLog("[warn] " + args.map(String).join(" "));
};
console.error = (...args) => {
  _origError(...args);
  broadcastVmLog("[error] " + args.map(String).join(" "));
};

function broadcast(message) {
  const msgObj =
    typeof message === "string" ? { type: "raw", content: message } : message;
  const payload =
    typeof message === "string" ? message : JSON.stringify(message);

  // Persist chat messages (user + assistant turns) to the session log.
  if (msgObj.type === "chat_message" && msgObj.role && msgObj.content) {
    logChatMessage({ role: msgObj.role, content: msgObj.content });
  }

  // Transient events that update the UI in real-time but carry no useful
  // state for late-joining clients.  Skip buffering to keep the log lean.
  const TRANSIENT_TYPES = new Set(["llm_status", "proxy_usage"]);

  const ts = new Date().toISOString();
  if (!TRANSIENT_TYPES.has(msgObj.type)) {
    workspace.logBuffer.push({ ...msgObj, _ts: ts });
    if (workspace.logBuffer.length > LOG_BUFFER_MAX) {
      workspace.logBuffer = workspace.logBuffer.slice(-LOG_BUFFER_MAX);
    }
  }

  for (const client of workspace.streamClients) {
    if (client.readyState === 1) client.send(payload);
  }
}

module.exports = { broadcast, broadcastVmLog, vmLogBuffer };
