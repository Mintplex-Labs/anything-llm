const { v4: uuidv4 } = require("uuid");
const AgentPlugins = require("../agents/aibitat/plugins");
const { EphemeralEventListener } = require("../agents/ephemeral");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { skillIsAutoApproved } = require("../helpers/agents");
const { AgentSkillWhitelist } = require("../../models/agentSkillWhitelist");
const {
  toolApprovalTimeoutMs,
} = require("../agents/aibitat/plugins/websocket");

/**
 * Lets the browser extension's side panel take part in an agent run that
 * streams over HTTP. The developer API shares the same agent handler, so
 * everything the extension adds on top lives here: card events are written
 * to the stream as they happen, and tool approvals and clarifying questions
 * wait for the panel to answer through `POST /browser-extension/agent-reply`.
 */

const TOOL_APPROVAL_TIMEOUT_MS = toolApprovalTimeoutMs();
// Same limits as the in-app websocket agent.
const CLARIFICATION_TIMEOUT_MS = 120 * 1_000;
// Once the user starts answering they should not race the clock.
const CLARIFICATION_ENGAGED_TIMEOUT_MS = 15 * 60 * 1_000;

// Agent events that render as cards in the panel.
const CARD_EVENTS = [
  "toolApprovalRequest",
  "clarificationRequest",
  "rechartVisualize",
  "scheduledJobCreated",
  "imageGenerationPending",
];

// Questions the agent asked wait here until the panel answers or the timeout passes.
const pendingClientReplies = new Map();

/**
 * Waits for the panel to answer a request sent over the stream. The first
 * `{ hold: true }` reply means the user started answering, so the wait is
 * extended once to `holdTimeoutMs`.
 * @param {string} requestId
 * @param {number} timeoutMs
 * @param {{holdTimeoutMs?: number, owner?: number|null}} [options] - owner is the user id the answer must come from (null in single-user mode)
 * @returns {Promise<object|null>} the reply, or null on timeout
 */
function waitForClientReply(
  requestId,
  timeoutMs,
  { holdTimeoutMs = timeoutMs, owner = null } = {}
) {
  return new Promise((resolve) => {
    let held = false;
    const expire = () => {
      pendingClientReplies.delete(requestId);
      resolve(null);
    };
    let timeout = setTimeout(expire, timeoutMs);
    const settle = (reply) => {
      if (reply?.hold) {
        if (held) return;
        held = true;
        clearTimeout(timeout);
        timeout = setTimeout(expire, holdTimeoutMs);
        return;
      }
      clearTimeout(timeout);
      pendingClientReplies.delete(requestId);
      resolve(reply);
    };
    pendingClientReplies.set(requestId, { settle, owner });
  });
}

/**
 * Delivers the panel's answer to a waiting request.
 * @param {string} requestId
 * @param {object|null} reply - null counts as no answer, like a timeout
 * @param {number|null} [owner] - user id of the caller, must match the request's owner
 * @returns {boolean} false when no request with that id is waiting for this owner
 */
function resolveClientReply(requestId, reply, owner = null) {
  const pending = pendingClientReplies.get(requestId);
  if (!pending || pending.owner !== owner) return false;
  pending.settle(reply);
  return true;
}

/**
 * Event listener for the extension's stream. Card events are written to the
 * response right away under `content` (a chart's own `type` field would
 * otherwise clobber the event type) and kept away from the base listener,
 * which only knows how to relay text.
 */
class BrowserExtensionEventListener extends EphemeralEventListener {
  /**
   * @param {import("express").Response} response
   */
  constructor(response) {
    super();
    this.response = response;
  }

  /**
   * @param {string} jsonData - event from the agent, as the websocket would receive it
   */
  send(jsonData) {
    const data = JSON.parse(jsonData);
    if (CARD_EVENTS.includes(data.type))
      return writeResponseChunk(this.response, {
        id: uuidv4(),
        type: data.type,
        content: data.content ?? null,
        close: false,
        error: null,
      });
    if (
      data.type === "reportStreamEvent" &&
      data.content?.type === "modelRouteNotification"
    )
      return writeResponseChunk(this.response, {
        id: uuidv4(),
        type: "modelRouteNotification",
        routedTo: data.content.routedTo ?? null,
        close: false,
        error: null,
      });
    super.send(jsonData);
  }
}

/**
 * Makes an agent run answerable from the panel: approvals and clarifying
 * questions go out as card events and wait for the user's reply, and the
 * clarifying question tool is loaded when the admin enabled it.
 * @param {import("../agents/ephemeral").EphemeralAgentHandler} agentHandler
 * @param {BrowserExtensionEventListener} listener
 * @param {number|null} userId - null in single-user mode
 */
function makeAgentInteractive(agentHandler, listener, userId) {
  const aibitat = agentHandler.aibitat;
  const ask = (type, content, timeoutMs, holdTimeoutMs) => {
    const requestId = uuidv4();
    listener.send(
      JSON.stringify({ type, content: { requestId, ...content, timeoutMs } })
    );
    return awaitClientReply(aibitat, requestId, timeoutMs, {
      holdTimeoutMs,
      owner: userId,
    });
  };

  aibitat.requestToolApproval = async function ({
    skillName,
    payload = {},
    description = null,
  }) {
    if (
      skillIsAutoApproved({ skillName }) ||
      (await AgentSkillWhitelist.isWhitelisted(skillName, userId))
    )
      return { approved: true, message: "Skill is auto-approved." };

    aibitat.introspect(
      `Requesting approval to execute: ${skillName}${description ? ` - ${description}` : ""}`
    );
    const reply = await ask(
      "toolApprovalRequest",
      { skillName, payload, description },
      TOOL_APPROVAL_TIMEOUT_MS
    );
    if (!reply)
      return {
        approved: false,
        message:
          "Tool approval request timed out. User did not respond in time.",
      };
    return reply.approved === true
      ? { approved: true, message: "User approved the tool execution." }
      : { approved: false, message: "Tool call was rejected by the user." };
  };

  aibitat.requestUserClarification = async function ({
    questions = [],
    allowSkip = true,
    timeoutMs = CLARIFICATION_TIMEOUT_MS,
  }) {
    const reply = await ask(
      "clarificationRequest",
      { questions, allowSkip },
      timeoutMs,
      CLARIFICATION_ENGAGED_TIMEOUT_MS
    );
    const unanswered = questions.map(() => ({ skipped: true, answer: null }));
    if (!reply) return { skipped: false, timedOut: true, answers: unanswered };
    if (reply.skipped)
      return { skipped: true, timedOut: false, answers: unanswered };
    const answers = Array.isArray(reply.answers) ? reply.answers : [];
    return {
      skipped: false,
      timedOut: false,
      answers: questions.map((_, i) => ({
        skipped: !!answers[i]?.skipped,
        answer: answers[i]?.answer ?? null,
      })),
    };
  };

  // The plugins were attached before requestUserClarification existed, so the
  // clarifying question tool skipped itself. The workspace agent only exposes
  // it when the admin enabled clarifying questions, so attaching it is safe.
  const [askUser] = AgentPlugins.requestUserInput.plugin;
  aibitat.use(askUser.plugin());
}

/**
 * Parks until the panel answers, the timeout passes, or the agent session
 * aborts (panel disconnected), whichever comes first.
 */
async function awaitClientReply(aibitat, requestId, timeoutMs, options) {
  const onAbort = () => resolveClientReply(requestId, null, options.owner);
  aibitat.emitter.once("abort", onAbort);
  const reply = await waitForClientReply(requestId, timeoutMs, options);
  aibitat.emitter.removeListener("abort", onAbort);
  return reply;
}

module.exports = {
  BrowserExtensionEventListener,
  makeAgentInteractive,
  waitForClientReply,
  resolveClientReply,
};
