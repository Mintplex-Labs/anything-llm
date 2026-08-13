const { workspace, currentAgentStatus } = require("../workspace");
const { broadcast, vmLogBuffer } = require("../broadcast");

function registerEventsWebSocket(server, streamWss) {
  streamWss.on("connection", (ws) => {
    workspace.streamClients.add(ws);

    // Send current state snapshot on connect
    ws.send(
      JSON.stringify({
        type: "connected",
        workspace_id: workspace.id,
        name: workspace.name,
        agent_status: currentAgentStatus(),
        last_exit_code: workspace.lastExitCode,
      }),
    );

    // Replay buffered events so late-connecting clients catch up
    if (workspace.logBuffer.length > 0) {
      ws.send(
        JSON.stringify({ type: "log_replay", entries: workspace.logBuffer }),
      );
    }

    ws.send(
      JSON.stringify({ type: "vm_log_replay", entries: vmLogBuffer }),
    );

    console.log(
      `[ws:events] Client connected (replayed ${workspace.logBuffer.length} log entries)`,
    );

    ws.on("close", () => {
      workspace.streamClients.delete(ws);
    });
  });
}

module.exports = { registerEventsWebSocket };
