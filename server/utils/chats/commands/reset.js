const { WorkspaceChats } = require("../../../models/workspaceChats");

async function resetMemory(
  workspace,
  _message,
  msgUUID,
  user = null,
  thread = null
) {
  // If thread is present we are wanting to reset this specific thread. Not the whole workspace.
  thread
    ? await WorkspaceChats.markThreadHistoryInvalid(
        workspace.id,
        user,
        thread.id
      )
    : await WorkspaceChats.markHistoryInvalid(workspace.id, user);

  return {
    uuid: msgUUID,
    type: "textResponse",
    textResponse: "FYI, I deleted this chat from my memory!",
    sources: [],
    close: true,
    error: false,
    action: "reset_chat",
  };
}

module.exports = {
  resetMemory,
};
