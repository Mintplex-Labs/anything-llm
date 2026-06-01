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

  // If the workspace uses a model router, clear the sticky route and LLM
  // classification cache so the router re-evaluates from scratch.
  const { ModelRouterService } = require("../../router");
  ModelRouterService.resetForWorkspace(workspace, user, thread);

  return {
    uuid: msgUUID,
    type: "textResponse",
    textResponse: "Chat memory was reset!",
    sources: [],
    close: true,
    error: false,
    action: "reset_chat",
  };
}

module.exports = {
  resetMemory,
};
