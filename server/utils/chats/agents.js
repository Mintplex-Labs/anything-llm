const pluralize = require("pluralize");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { Workspace } = require("../../models/workspace");

/**
 * How long an agent invocation handoff entry remains valid after it is
 * written. The frontend normally opens the agent websocket immediately
 * after receiving the handshake chunk, so this only needs to cover
 * brief scheduling and network delays.
 */
const INVOCATION_CACHE_TTL_MS = 60 * 1000;

/**
 * How often expired but unconsumed handoff entries are swept in the
 * background. Expired entries are also dropped lazily on read.
 */
const INVOCATION_CACHE_SWEEP_INTERVAL_MS = 60 * 1000;

/**
 * In-memory cache for attachments associated with agent invocations.
 * Attachments are stored here when grepAgents creates an invocation,
 * then retrieved by AgentHandler when the websocket connects.
 * Entries expire if the agent websocket never connects.
 * @type {Map<string, {value: Array, expiresAt: number}>}
 */
const invocationAttachmentsCache = new Map();

/**
 * Reasoning effort chosen for the chat session that started an invocation,
 * kept until AgentHandler picks it up when the websocket connects.
 * Entries expire if the agent websocket never connects.
 * @type {Map<string, {value: string, expiresAt: number}>}
 */
const invocationReasoningEffortCache = new Map();

let invocationCacheSweeper = null;

/**
 * Remove entries whose handoff window has elapsed. Expired entries are
 * unreachable by consumers, so dropping them reclaims memory that would
 * otherwise remain for the lifetime of the process.
 * @param {Map<string, {value: any, expiresAt: number}>} cache
 * @param {number} [now]
 */
function evictExpiredInvocationCacheEntries(cache, now = Date.now()) {
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt) cache.delete(key);
  }
}

/**
 * Stop the background sweeper when both caches are idle. The sweeper is
 * restarted on the next write, so no activity means no timer runs.
 */
function stopInvocationCacheSweeperIfIdle() {
  if (
    invocationCacheSweeper &&
    invocationAttachmentsCache.size === 0 &&
    invocationReasoningEffortCache.size === 0
  ) {
    clearInterval(invocationCacheSweeper);
    invocationCacheSweeper = null;
  }
}

/**
 * Start the background sweeper once, if it has not started already.
 * The timer is unrefed so cache maintenance never keeps the Node
 * process (or test runner) alive on its own.
 */
function ensureInvocationCacheSweeper() {
  if (invocationCacheSweeper) return;

  invocationCacheSweeper = setInterval(() => {
    evictExpiredInvocationCacheEntries(invocationAttachmentsCache);
    evictExpiredInvocationCacheEntries(invocationReasoningEffortCache);
    stopInvocationCacheSweeperIfIdle();
  }, INVOCATION_CACHE_SWEEP_INTERVAL_MS);

  if (typeof invocationCacheSweeper.unref === "function")
    invocationCacheSweeper.unref();
}

/**
 * Store a value in an invocation cache with an expiration timestamp.
 * @param {Map<string, {value: any, expiresAt: number}>} cache
 * @param {string} uuid - The invocation UUID
 * @param {any} value
 */
function setInvocationCacheValue(cache, uuid, value) {
  cache.set(uuid, {
    value,
    expiresAt: Date.now() + INVOCATION_CACHE_TTL_MS,
  });
  ensureInvocationCacheSweeper();
}

/**
 * Remove an entry and return its cached value if it has not expired.
 * Each value can be taken at most once.
 * @param {Map<string, {value: any, expiresAt: number}>} cache
 * @param {string} uuid - The invocation UUID
 * @returns {any|null} null when missing or expired
 */
function takeInvocationCacheValue(cache, uuid) {
  const entry = cache.get(uuid);
  cache.delete(uuid);

  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.value;
}

/**
 * Store attachments for an invocation UUID
 * @param {string} uuid - The invocation UUID
 * @param {Array} attachments - The attachments array
 */
function cacheInvocationAttachments(uuid, attachments = []) {
  if (attachments.length > 0)
    setInvocationCacheValue(invocationAttachmentsCache, uuid, attachments);
}

/**
 * Retrieve and remove attachments for an invocation UUID
 * @param {string} uuid - The invocation UUID
 * @returns {Array} The attachments array (empty if none cached or expired)
 */
function getAndClearInvocationAttachments(uuid) {
  return takeInvocationCacheValue(invocationAttachmentsCache, uuid) || [];
}

/**
 * Retrieve and remove the session reasoning effort for an invocation UUID
 * @param {string} uuid - The invocation UUID
 * @returns {string|null}
 */
function getAndClearInvocationReasoningEffort(uuid) {
  return takeInvocationCacheValue(invocationReasoningEffortCache, uuid);
}

/**
 * Clear both invocation caches and stop the background sweeper.
 * Intended for test isolation only; the business flow never clears
 * caches out-of-band.
 */
function clearInvocationCaches() {
  invocationAttachmentsCache.clear();
  invocationReasoningEffortCache.clear();
  if (invocationCacheSweeper) {
    clearInterval(invocationCacheSweeper);
    invocationCacheSweeper = null;
  }
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

    // Cache attachments and session effort for the websocket handler to
    // retrieve later. Entries expire if the websocket never connects.
    cacheInvocationAttachments(newInvocation.uuid, attachments);
    if (reasoningEffort)
      setInvocationCacheValue(
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
  clearInvocationCaches,
};
