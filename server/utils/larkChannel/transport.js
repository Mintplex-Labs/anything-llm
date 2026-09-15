const path = require("node:path");
const { sanitizedError } = require("./config");

// The SDK defaults to 3,500 characters. Stay below that boundary so each
// fallback call maps to one ordered Lark message.
const LARK_MESSAGE_LIMIT = 3000;
const APPROVAL_UNAVAILABLE =
  "Tool approval is unavailable in Lark. Retry in the web UI.";
const STREAM_FALLBACK_ERRORS = new Set(["permission_denied", "format_error"]);
const STREAM_UPDATE_INTERVAL_MS = 100;
const STREAM_UPDATE_CHAR_THRESHOLD = 50;
const STREAM_CANCELLED = "Generation cancelled.";

function streamingCard(text) {
  return {
    schema: "2.0",
    body: {
      elements: [{ tag: "markdown", content: text || "Thinking..." }],
    },
  };
}

function splitLarkMarkdown(text, limit = LARK_MESSAGE_LIMIT) {
  const chunks = [];
  let remaining = String(text || "");
  while (remaining.length > limit) {
    let splitAt = remaining.lastIndexOf("\n\n", limit - 2);
    if (splitAt > 0) splitAt += 2;
    else {
      splitAt = remaining.lastIndexOf("\n", limit - 1);
      if (splitAt > 0) splitAt += 1;
      else splitAt = limit;
    }
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt);
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function safeTransportError(error) {
  const { category } = sanitizedError(error);
  return Object.assign(new Error(category), { code: category });
}

function approvalCard(request) {
  const skillName = String(request?.skillName || "a tool")
    .replace(/[\r\n\t]/g, " ")
    .slice(0, 100);
  const requestId = String(request?.requestId || "").slice(0, 100);
  return {
    schema: "2.0",
    header: {
      title: { tag: "plain_text", content: "Tool approval required" },
    },
    body: {
      elements: [
        {
          tag: "markdown",
          content: `The agent wants to use **${skillName}**. Approve only if you trust this action.`,
        },
        {
          tag: "action",
          actions: [
            {
              tag: "button",
              text: { tag: "plain_text", content: "Approve" },
              type: "primary",
              value: { action: "approve", requestId },
            },
            {
              tag: "button",
              text: { tag: "plain_text", content: "Deny" },
              value: { action: "deny", requestId },
            },
          ],
        },
      ],
    },
  };
}

function safeArtifactLabel(file) {
  const candidate = file?.filename || file?.title || file?.name;
  if (!candidate) return "Generated artifact available in the web UI.";
  const label = path.basename(String(candidate)).replace(/[\r\n\t]/g, " ");
  return `Generated artifact: ${label.slice(0, 200)}`;
}

function createLarkTransport({ channel, message, onToolApproval }) {
  const replyOptions =
    message?.chatType === "group" && message?.messageId
      ? { replyTo: message.messageId }
      : {};
  const supportsCardUpdates = typeof channel.updateCard === "function";
  let startPromise = null;
  let cardMessageId = null;
  let startFailure = null;
  let cardFailure = null;
  let accumulated = "";
  let lastUpdated = null;
  let pendingChars = 0;
  let updateTimer = null;
  let updateTimerImmediate = false;
  let updateChain = Promise.resolve();
  let completionPromise = null;
  let fallbackPromise = null;
  let cancelled = false;
  let cancellationPromise = null;

  async function sendBounded(text) {
    for (const chunk of splitLarkMarkdown(text)) {
      if (cancelled) return;
      try {
        await channel.send(message.chatId, { markdown: chunk }, replyOptions);
        if (cancelled) return;
      } catch (error) {
        if (cancelled) return;
        if (sanitizedError(error).category !== "format_error")
          throw safeTransportError(error);
        if (cancelled) return;
        try {
          await channel.send(message.chatId, { text: chunk }, replyOptions);
          if (cancelled) return;
        } catch (fallbackError) {
          if (cancelled) return;
          throw safeTransportError(fallbackError);
        }
      }
    }
  }

  function clearUpdateTimer() {
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = null;
    updateTimerImmediate = false;
  }

  function rememberCardFailure(error) {
    if (!cardFailure) cardFailure = sanitizedError(error).category;
    clearUpdateTimer();
  }

  function enqueueCardUpdate(text) {
    updateChain = updateChain
      .then(async () => {
        if (cancelled || cardFailure || !cardMessageId || text === lastUpdated)
          return;
        await channel.updateCard(cardMessageId, streamingCard(text));
        lastUpdated = text;
      })
      .catch((error) => {
        if (!cancelled) rememberCardFailure(error);
      });
    // Every scheduled update remains reachable through updateChain and cannot
    // reject: failures are converted to sanitized transport state above.
    return updateChain;
  }

  function fireScheduledUpdate() {
    updateTimer = null;
    updateTimerImmediate = false;
    if (cancelled || cardFailure || !cardMessageId) return;
    const snapshot = accumulated;
    pendingChars = 0;
    enqueueCardUpdate(snapshot);
  }

  function scheduleCardUpdate() {
    if (cancelled || cardFailure || !cardMessageId) return;
    const immediate = pendingChars >= STREAM_UPDATE_CHAR_THRESHOLD;
    if (updateTimer) {
      if (!immediate || updateTimerImmediate) return;
      clearUpdateTimer();
    }
    updateTimerImmediate = immediate;
    updateTimer = setTimeout(
      fireScheduledUpdate,
      immediate ? 0 : STREAM_UPDATE_INTERVAL_MS
    );
  }

  async function start() {
    if (cancelled) return cancellationPromise;
    if (startPromise) return startPromise;
    if (!supportsCardUpdates) return;
    startPromise = (async () => {
      try {
        const result = await channel.send(
          message.chatId,
          { card: streamingCard("") },
          replyOptions
        );
        if (!result?.messageId) {
          startFailure = "format_error";
          return;
        }
        cardMessageId = result.messageId;
      } catch (error) {
        startFailure = sanitizedError(error).category;
      }
    })();
    return startPromise;
  }

  async function append(text) {
    if (cancelled || completionPromise) return;
    await start();
    if (cancelled || completionPromise) return;
    const chunk = String(text || "");
    if (!chunk) return;
    accumulated += chunk;
    pendingChars += chunk.length;
    scheduleCardUpdate();
  }

  async function recallFailedCard() {
    if (!cardMessageId || typeof channel.recallMessage !== "function") return;
    try {
      await channel.recallMessage(cardMessageId);
    } catch {
      // Cleanup is best effort and must never hide the complete fallback.
    }
  }

  async function sendCompleteFallback(text) {
    fallbackPromise ||= (async () => {
      if (cancelled) return;
      await recallFailedCard();
      if (cancelled) return;
      await sendBounded(text);
    })();
    return fallbackPromise;
  }

  async function finish(result = {}) {
    if (cancelled) return cancellationPromise;
    await start();
    if (cancelled) return cancellationPromise;
    const finalText =
      typeof result.text === "string" ? result.text : accumulated;
    accumulated = finalText;
    clearUpdateTimer();
    await updateChain;
    if (cancelled) return cancellationPromise;

    if (!cardMessageId) {
      if (startFailure && !STREAM_FALLBACK_ERRORS.has(startFailure))
        throw safeTransportError({ code: startFailure });
      return sendBounded(finalText);
    }
    if (!cardFailure) await enqueueCardUpdate(finalText);
    if (cancelled) return cancellationPromise;
    if (cardFailure) return sendCompleteFallback(finalText);
  }

  async function complete(result) {
    if (cancelled) return cancellationPromise;
    completionPromise ||= finish(result);
    return completionPromise;
  }

  async function fail(publicMessage) {
    if (cancelled) return cancellationPromise;
    const text = String(publicMessage || "Sorry, something went wrong.");
    if (completionPromise) return sendBounded(text);
    try {
      completionPromise = finish({ text });
      return await completionPromise;
    } catch {
      if (cancelled) return cancellationPromise;
      return sendBounded(text);
    }
  }

  async function requestToolApproval(request) {
    if (cancelled) return { approved: false, message: APPROVAL_UNAVAILABLE };
    if (typeof onToolApproval !== "function") {
      await sendBounded(APPROVAL_UNAVAILABLE);
      return { approved: false, message: APPROVAL_UNAVAILABLE };
    }
    try {
      await channel.send(
        message.chatId,
        { card: approvalCard(request) },
        replyOptions
      );
      if (cancelled) return { approved: false, message: APPROVAL_UNAVAILABLE };
    } catch (error) {
      if (cancelled) return { approved: false, message: APPROVAL_UNAVAILABLE };
      const { category } = sanitizedError(error);
      if (!STREAM_FALLBACK_ERRORS.has(category))
        throw safeTransportError(error);
      await sendBounded(APPROVAL_UNAVAILABLE);
      return { approved: false, message: APPROVAL_UNAVAILABLE };
    }
    if (cancelled) return { approved: false, message: APPROVAL_UNAVAILABLE };
    try {
      const result = await onToolApproval(request);
      if (cancelled) return { approved: false, message: APPROVAL_UNAVAILABLE };
      return result;
    } catch {
      return { approved: false, message: APPROVAL_UNAVAILABLE };
    }
  }

  async function cancel() {
    if (cancellationPromise) return cancellationPromise;
    cancelled = true;
    clearUpdateTimer();
    cancellationPromise = (async () => {
      if (startPromise) await startPromise;
      await updateChain;
      if (!cardMessageId) return;
      try {
        await channel.updateCard(
          cardMessageId,
          streamingCard(STREAM_CANCELLED)
        );
      } catch {
        // Cancellation finalization is best effort and must not emit fallback.
      }
    })();
    return cancellationPromise;
  }

  return {
    start,
    append,
    async status(text) {
      if (cancelled) return;
      await sendBounded(String(text || ""));
    },
    async artifact(file) {
      if (cancelled) return;
      await sendBounded(safeArtifactLabel(file));
    },
    complete,
    fail,
    requestToolApproval,
    cancel,
  };
}

module.exports = {
  APPROVAL_UNAVAILABLE,
  LARK_MESSAGE_LIMIT,
  createLarkTransport,
  splitLarkMarkdown,
};
