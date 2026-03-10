const pluralize = require("pluralize");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { Workspace } = require("../../models/workspace");
const { writeResponseChunk } = require("../helpers/chat/responses");

// This cache only works for a single server process.
// The HTTP stream creates the invocation and the websocket-side agent handler
// consumes the cached attachments immediately after connecting.
const invocationAttachmentsCache = new Map();

function cacheInvocationAttachments(uuid, attachments = []) {
  if (attachments.length > 0) {
    invocationAttachmentsCache.set(uuid, attachments);
  }
}

function getAndClearInvocationAttachments(uuid) {
  const attachments = invocationAttachmentsCache.get(uuid) || [];
  invocationAttachmentsCache.delete(uuid);
  return attachments;
}

async function grepAgents({
  uuid,
  response,
  message,
  workspace,
  user = null,
  thread = null,
  attachments = [],
}) {
  let nativeToolingEnabled = false;
  if (workspace?.chatMode === "automatic") {
    nativeToolingEnabled = await Workspace.supportsNativeToolCalling(workspace);
  }

  const agentHandles = WorkspaceAgentInvocation.parseAgents(message);
  if (agentHandles.length > 0 || nativeToolingEnabled) {
    const { invocation: newInvocation } = await WorkspaceAgentInvocation.new({
      prompt: message,
      workspace: workspace,
      user: user,
      thread: thread,
    });

    if (!newInvocation) {
      writeResponseChunk(response, {
        id: uuid,
        type: "statusResponse",
        textResponse:
          agentHandles.length > 0
            ? `${pluralize("Agent", agentHandles.length)} ${agentHandles.join(
                ", "
              )} could not be called. Chat will be handled as default chat.`
            : "Automatic agent mode could not be started. Chat will be handled as default chat.",
        sources: [],
        close: true,
        animate: false,
        error: null,
      });
      return;
    }

    cacheInvocationAttachments(newInvocation.uuid, attachments);

    writeResponseChunk(response, {
      id: uuid,
      type: "agentInitWebsocketConnection",
      textResponse: null,
      sources: [],
      close: false,
      error: null,
      websocketUUID: newInvocation.uuid,
    });

    // Close HTTP stream-able chunk response method because we will swap to agents now.
    writeResponseChunk(response, {
      id: uuid,
      type: "statusResponse",
      textResponse:
        agentHandles.length > 0
          ? `${pluralize("Agent", agentHandles.length)} ${agentHandles.join(
              ", "
            )} invoked.\nSwapping over to agent chat. Type /exit to exit agent execution loop early.`
          : "Automatic agent mode invoked.\nSwapping over to agent chat. Type /exit to exit agent execution loop early.",
      sources: [],
      close: true,
      error: null,
      animate: true,
    });
    return true;
  }

  return false;
}

module.exports = { grepAgents, getAndClearInvocationAttachments };
