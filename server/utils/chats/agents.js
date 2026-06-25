const pluralize = require("pluralize");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { Workspace } = require("../../models/workspace");

/**
 * In-memory cache for per-invocation context that the browser sends over HTTP
 * (the /stream-chat request) but which is only needed later when the agent
 * websocket connects. Keyed by the invocation UUID. Currently carries the
 * uploaded attachments and the user's IANA timezone (used by tools like
 * create-scheduled-job to convert local time to UTC). Entries are stored when
 * grepAgents creates the invocation and cleared when AgentHandler retrieves
 * them.
 * @type {Map<string, { attachments: Array, timezone: string|null }>}
 */
const invocationContextCache = new Map();

/**
 * Store context for an invocation UUID.
 * @param {string} uuid - The invocation UUID
 * @param {{ attachments?: Array, timezone?: string|null }} context
 */
function cacheInvocationContext(
  uuid,
  { attachments = [], timezone = null } = {}
) {
  // Only cache when there is something worth carrying across the handover.
  if (attachments.length > 0 || timezone) {
    invocationContextCache.set(uuid, { attachments, timezone });
  }
}

/**
 * Retrieve and remove the context for an invocation UUID.
 * @param {string} uuid - The invocation UUID
 * @returns {{ attachments: Array, timezone: string|null }} Defaults when none cached.
 */
function getAndClearInvocationContext(uuid) {
  const context = invocationContextCache.get(uuid) || {
    attachments: [],
    timezone: null,
  };
  invocationContextCache.delete(uuid);
  return context;
}

async function grepAgents({
  uuid,
  response,
  message,
  workspace,
  user = null,
  thread = null,
  attachments = [],
  timezone = null,
}) {
  let nativeToolingEnabled = false;

  // If the workspace is in automatic mode, check if the workspace supports native tooling
  // to determine if the agent flow should be used or not.
  if (workspace?.chatMode === "automatic")
    nativeToolingEnabled = await Workspace.supportsNativeToolCalling(workspace);

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
        textResponse: `${pluralize(
          "Agent",
          agentHandles.length
        )} ${agentHandles.join(
          ", "
        )} could not be called. Chat will be handled as default chat.`,
        sources: [],
        close: true,
        animate: false,
        error: null,
      });
      return;
    }

    // Cache context (attachments + timezone) for the websocket handler to
    // retrieve later when the agent session connects.
    cacheInvocationContext(newInvocation.uuid, { attachments, timezone });

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
        "@agent: Swapping over to agent chat. Type /exit to exit agent execution loop early.",
      sources: [],
      close: true,
      error: null,
      animate: true,
    });
    return true;
  }

  return false;
}

module.exports = { grepAgents, getAndClearInvocationContext };
