const path = require("node:path");
const { sanitizedError } = require("./config");

// The SDK defaults to 3,500 characters. Stay below that boundary so each
// fallback call maps to one ordered Lark message.
const LARK_MESSAGE_LIMIT = 3000;
const APPROVAL_UNAVAILABLE =
  "Tool approval is unavailable in Lark. Retry in the web UI.";
const STREAM_FALLBACK_ERRORS = new Set(["permission_denied", "format_error"]);

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

function createEventQueue() {
  const buffered = [];
  const waiting = [];
  let closed = false;

  return {
    push(event) {
      if (closed) return;
      const waiter = waiting.shift();
      if (waiter) waiter({ value: event, done: false });
      else buffered.push(event);
    },
    close() {
      if (closed) return;
      closed = true;
      for (const waiter of waiting.splice(0)) waiter({ done: true });
    },
    async *events() {
      while (true) {
        if (buffered.length) {
          yield buffered.shift();
          continue;
        }
        if (closed) return;
        const next = await new Promise((resolve) => waiting.push(resolve));
        if (next.done) return;
        yield next.value;
      }
    },
  };
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
  const queue = createEventQueue();
  const replyOptions =
    message?.chatType === "group" && message?.messageId
      ? { replyTo: message.messageId }
      : {};
  let started = false;
  let streamPromise = null;
  let streamOpened = false;
  let accumulated = "";
  let completionPromise = null;
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

  async function start() {
    if (started || cancelled) return;
    started = true;
    if (typeof channel.stream !== "function") return;
    try {
      streamPromise = Promise.resolve(
        channel.stream(
          message.chatId,
          {
            card: {
              initial: streamingCard(""),
              producer: async (controller) => {
                streamOpened = true;
                let latest = null;
                for await (const event of queue.events()) {
                  latest = event;
                }
                // SDK 1.74.0 does not expose failures from timer-driven card
                // patches: update() resolves after scheduling `void doFire()`.
                // Submit only the latest cumulative snapshot as the producer
                // closes, so completeTerminal() owns and propagates the patch.
                if (!cancelled && latest)
                  await controller.update(streamingCard(latest.text));
              },
            },
          },
          replyOptions
        )
      );
    } catch (error) {
      streamPromise = Promise.reject(error);
    }
    // Completion owns this rejection. Observe it now so an early SDK failure
    // cannot become an unhandled rejection while inference is still running.
    streamPromise.catch(() => {});
  }

  async function append(text) {
    if (cancelled) return;
    await start();
    if (cancelled) return;
    const chunk = String(text || "");
    if (!chunk) return;
    accumulated += chunk;
    if (streamPromise) queue.push({ text: accumulated });
  }

  async function finish(result = {}) {
    if (cancelled) return cancellationPromise;
    await start();
    if (cancelled) return cancellationPromise;
    const finalText =
      typeof result.text === "string" ? result.text : accumulated;
    if (!streamPromise) return sendBounded(finalText);

    if (finalText && (!accumulated || finalText !== accumulated))
      queue.push({ text: finalText });
    queue.close();
    try {
      await streamPromise;
      if (cancelled) return cancellationPromise;
    } catch (error) {
      if (cancelled) return cancellationPromise;
      const { category } = sanitizedError(error);
      if (streamOpened || STREAM_FALLBACK_ERRORS.has(category))
        return sendBounded(finalText);
      throw safeTransportError(error);
    }
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
    queue.close();
    cancellationPromise = (async () => {
      if (!streamPromise) return;
      try {
        await streamPromise;
      } catch {
        // Cancellation is terminal and must not trigger replacement output.
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
