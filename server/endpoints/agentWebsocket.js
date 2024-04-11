const { AgentHandler } = require("../utils/agents");

// Setup listener for incoming messages to relay to socket so it can be handled by agent plugin.
function relayToSocket(message) {
  this?.handleFeedback?.(message);
}

function alertClosed() {
  console.log("Socket has been closed!");
  return;
}

function agentWebsocket(app) {
  if (!app) return;

  app.ws("/agent-invocation/:uuid", async function (socket, request) {
    try {
      const agentHandler = await new AgentHandler({
        uuid: String(request.params.uuid),
      }).init();

      if (!agentHandler.invocation) {
        socket.close();
        return;
      }

      socket.on("message", relayToSocket);
      socket.on("close", alertClosed);
      await agentHandler.createAbitat({ socket });
      await agentHandler.startAgentCluster();
    } catch (e) {
      console.error(e);
      socket?.send(JSON.stringify({ type: "wssFailure", content: e.message }));
      socket?.close();
    }
  });
}

module.exports = { agentWebsocket };
