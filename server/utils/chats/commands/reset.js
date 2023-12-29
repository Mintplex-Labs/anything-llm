const { ThreadChats } = require("../../../models/threadChats");

async function resetMemory(workspace, thread, _message, msgUUID, user = null) {
  await ThreadChats.markHistoryInvalid(workspace.id, thread);
  return {
    uuid: msgUUID,
    type: "textResponse",
    textResponse: "Workspace chat memory was reset!",
    sources: [],
    close: true,
    error: false,
  };
}

module.exports = {
  resetMemory,
};
