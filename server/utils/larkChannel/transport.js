const path = require("node:path");
const { sanitizedError } = require("./config");

// The SDK defaults to 3,500 characters. Stay below that boundary so each
// fallback call maps to one ordered Lark message.
const LARK_MESSAGE_LIMIT = 3000;
const APPROVAL_UNAVAILABLE =
  "Tool approval is unavailable in Lark. Retry in the web UI.";
const STREAM_FALLBACK_ERRORS = new Set(["permission_denied", "format_error"]);

function splitLarkMarkdown(text, limit = LARK_MESSAGE_LIMIT) {
  const chunks = [];
  let remaining = String(text || "");
  while (remaining.length > limit) {
    let splitAt = remaining.lastIndexOf("\n\n", limit);
    if (splitAt > 0) splitAt += 2;
    else {
      splitAt = remaining.lastIndexOf("\n", limit);
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
  let accumulated = "";
  let completionPromise = null;

  async function sendBounded(text) {
    for (const chunk of splitLarkMarkdown(text)) {
      try {
        await channel.send(message.chatId, { markdown: chunk }, replyOptions);
      } catch (error) {
        if (sanitizedError(error).category !== "format_error")
          throw safeTransportError(error);
        try {
          await channel.send(message.chatId, { text: chunk }, replyOptions);
        } catch (fallbackError) {
          throw safeTransportError(fallbackError);
        }
      }
    }
  }

  async function start() {
    if (started) return;
    started = true;
    if (typeof channel.stream !== "function") return;
    try {
      streamPromise = Promise.resolve(
        channel.stream(
          message.chatId,
          {
            markdown: async (controller) => {
              for await (const event of queue.events()) {
                if (
                  event.type === "set" &&
                  typeof controller.setContent === "function"
                ) {
                  await controller.setContent(event.text);
                } else {
                  await controller.append(event.text);
                }
              }
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
    await start();
    const chunk = String(text || "");
    if (!chunk) return;
    accumulated += chunk;
    if (streamPromise) queue.push({ type: "append", text: chunk });
  }

  async function finish(result = {}) {
    await start();
    const finalText =
      typeof result.text === "string" ? result.text : accumulated;
    if (!streamPromise) return sendBounded(finalText);

    if (finalText && !accumulated)
      queue.push({ type: "append", text: finalText });
    else if (finalText !== accumulated)
      queue.push({ type: "set", text: finalText });
    queue.close();
    try {
      await streamPromise;
    } catch (error) {
      const { category } = sanitizedError(error);
      if (STREAM_FALLBACK_ERRORS.has(category)) return sendBounded(finalText);
      throw safeTransportError(error);
    }
  }

  async function complete(result) {
    completionPromise ||= finish(result);
    return completionPromise;
  }

  async function fail(publicMessage) {
    const text = String(publicMessage || "Sorry, something went wrong.");
    if (completionPromise) return sendBounded(text);
    try {
      completionPromise = finish({ text });
      return await completionPromise;
    } catch {
      return sendBounded(text);
    }
  }

  async function requestToolApproval(request) {
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
    } catch (error) {
      const { category } = sanitizedError(error);
      if (!STREAM_FALLBACK_ERRORS.has(category))
        throw safeTransportError(error);
      await sendBounded(APPROVAL_UNAVAILABLE);
      return { approved: false, message: APPROVAL_UNAVAILABLE };
    }
    try {
      return await onToolApproval(request);
    } catch {
      return { approved: false, message: APPROVAL_UNAVAILABLE };
    }
  }

  return {
    start,
    append,
    async status(text) {
      await sendBounded(String(text || ""));
    },
    async artifact(file) {
      await sendBounded(safeArtifactLabel(file));
    },
    complete,
    fail,
    requestToolApproval,
  };
}

module.exports = {
  APPROVAL_UNAVAILABLE,
  LARK_MESSAGE_LIMIT,
  createLarkTransport,
  splitLarkMarkdown,
};
