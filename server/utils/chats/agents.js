const pluralize = require("pluralize");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { Workspace } = require("../../models/workspace");

/**
 * Most entries each invocation cache may hold. Entries are deleted as soon as
 * the agent websocket reads them, so the caches only grow when a websocket
 * never connects. The cap bounds that growth while staying far above the
 * number of handshakes that can be in flight at once.
 */
const MAX_PENDING_INVOCATIONS = 100;

/**
 * Store a value for an invocation, evicting the oldest entry once the cache
 * exceeds MAX_PENDING_INVOCATIONS. Map iterates in insertion order, so the
 * first key is always the oldest.
 * @param {Map<string, any>} cache
 * @param {string} uuid - The invocation UUID
 * @param {any} value
 */
function setPendingInvocationValue(cache, uuid, value) {
  cache.set(uuid, value);
  if (cache.size > MAX_PENDING_INVOCATIONS)
    cache.delete(cache.keys().next().value);
}

/**
 * In-memory cache for attachments associated with agent invocations.
 * Attachments are stored here when grepAgents creates an invocation,
 * then retrieved by AgentHandler when the websocket connects.
 * @type {Map<string, Array>}
 */
const invocationAttachmentsCache = new Map();

/**
 * Store attachments for an invocation UUID
 * @param {string} uuid - The invocation UUID
 * @param {Array} attachments - The attachments array
 */
function cacheInvocationAttachments(uuid, attachments = []) {
  if (attachments.length > 0)
    setPendingInvocationValue(invocationAttachmentsCache, uuid, attachments);
}

/**
 * Retrieve and remove attachments for an invocation UUID
 * @param {string} uuid - The invocation UUID
 * @returns {Array} The attachments array (empty if none cached)
 */
function getAndClearInvocationAttachments(uuid) {
  const attachments = invocationAttachmentsCache.get(uuid) || [];
  invocationAttachmentsCache.delete(uuid);
  return attachments;
}

/**
 * Reasoning effort chosen for the chat session that started an invocation,
 * kept until AgentHandler picks it up when the websocket connects.
 * @type {Map<string, string>}
 */
const invocationReasoningEffortCache = new Map();

/**
 * Retrieve and remove the session reasoning effort for an invocation UUID
 * @param {string} uuid - The invocation UUID
 * @returns {string|null}
 */
function getAndClearInvocationReasoningEffort(uuid) {
  const reasoningEffort = invocationReasoningEffortCache.get(uuid) ?? null;
  invocationReasoningEffortCache.delete(uuid);
  return reasoningEffort;
}

async function grepAgents({
  uuid,
  response,
  message,
  workspace,
  user = null,
  thread = null,
  attachments = [],
  reasoningEffort = null,
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

    // Cache attachments for the websocket handler to retrieve later
    cacheInvocationAttachments(newInvocation.uuid, attachments);
    if (reasoningEffort)
      setPendingInvocationValue(
        invocationReasoningEffortCache,
        newInvocation.uuid,
        reasoningEffort
      );

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

module.exports = {
  grepAgents,
  getAndClearInvocationAttachments,
  getAndClearInvocationReasoningEffort,
};
