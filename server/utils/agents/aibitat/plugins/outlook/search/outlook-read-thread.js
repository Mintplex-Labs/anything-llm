const outlookLib = require("../lib.js");
const { handleAttachments, handleSkillError } = outlookLib;
const Provider = require("../../../providers/ai-provider");
const { summarizeContent } = require("../../../utils/summarize");
const { TokenManager } = require("../../../../../helpers/tiktoken");

// Share of the model's context window a thread may fill before its older
// messages are summarized, leaving the rest for the conversation and the reply.
const THREAD_CONTEXT_RATIO = 0.75;

const RECIPIENT_FIELDS = [
  ["to", "To"],
  ["cc", "CC"],
  ["bcc", "BCC"],
];

/**
 * Everyone on a message (sender and To/CC/BCC), keyed by lowercased address.
 * @param {object} msg - A message from readThread
 * @returns {Map<string, {address: string, role: string}>}
 */
function participants(msg) {
  const people = new Map();
  const add = (list, role) => {
    for (const address of (list || "").split(",")) {
      const trimmed = address.trim();
      const key = trimmed.toLowerCase();
      if (trimmed && !people.has(key))
        people.set(key, { address: trimmed, role });
    }
  };
  add(msg.from, "From");
  for (const [field, role] of RECIPIENT_FIELDS) add(msg[field], role);
  return people;
}

/**
 * Formats a thread with its recipients rolled up: the first message's To/CC/BCC
 * are listed once in `header`, and each later message lists only the people
 * added to or dropped from the conversation since the previous message.
 * Comparing everyone on the message (sender included) means an ordinary
 * reply-all, which moves the sender into To, shows no change.
 * @param {object[]} messages - Thread messages, oldest first
 * @returns {{header: string, formatted: string[]}}
 */
function formatThread(messages) {
  const first = messages[0] || {};
  const header =
    `Recipients (message 1):\n` +
    RECIPIENT_FIELDS.filter(([field]) => first[field])
      .map(([field, role]) => `${role}: ${first[field]}`)
      .join("\n");

  let previous = participants(first);
  const formatted = messages.map((msg, i) => {
    const current = participants(msg);
    let changes = "";
    if (i > 0) {
      const added = [...current]
        .filter(([key]) => !previous.has(key))
        .map(([, p]) => `${p.address} (${p.role})`);
      const removed = [...previous]
        .filter(([key]) => !current.has(key))
        .map(([, p]) => p.address);
      if (added.length) changes += `Added: ${added.join(", ")}\n`;
      if (removed.length) changes += `Removed: ${removed.join(", ")}\n`;
    }
    previous = current;
    return formatMessage(msg, i, changes);
  });
  return { header, formatted };
}

function formatMessage(msg, i, recipientChanges = "") {
  let attachmentInfo = "";
  if (msg.attachments?.length > 0) {
    attachmentInfo = `\n   Attachments: ${msg.attachments.map((a) => `${a.name} (${a.contentType}, ${(a.size / 1024).toFixed(1)}KB)`).join(", ")}`;
  }

  const bodyContent =
    msg.bodyType === "html"
      ? msg.body
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : msg.body;

  return (
    `--- Message ${i + 1} ---\n` +
    `From: ${msg.fromName} <${msg.from}>\n` +
    recipientChanges +
    `Date: ${new Date(msg.date).toLocaleString()}\n` +
    `Subject: ${msg.subject}\n` +
    `Status: ${msg.isRead ? "READ" : "UNREAD"}\n` +
    `\n${bodyContent}` +
    attachmentInfo
  );
}

/**
 * Returns the thread text sized for the model's context window. When the
 * messages (plus the other text sent with them) exceed the budget, every
 * message but the latest is summarized; the latest stays verbatim and an index
 * of all messages keeps who wrote when.
 * @param {object} context - The tool handler's `this`
 * @param {object[]} messages - Thread messages, oldest first
 * @param {string[]} formatted - `messages` formatted by formatThread
 * @param {string} extraContent - Other text sent alongside (recipients, parsed attachments)
 * @returns {Promise<{text: string, summarized: boolean}>}
 */
async function fitThreadToContext(
  context,
  messages,
  formatted,
  extraContent = ""
) {
  const full = formatted.join("\n\n");
  if (messages.length < 2) return { text: full, summarized: false };

  const { provider, model } = context.super;
  const budget = Math.floor(
    Provider.contextLimit(provider, model) * THREAD_CONTEXT_RATIO
  );
  const tokens = new TokenManager(model).countFromString(full + extraContent);
  if (tokens <= budget) return { text: full, summarized: false };

  context.super.introspect(
    `${context.caller}: Thread is ~${tokens} tokens, over the ~${budget} token budget. Summarizing all but the latest message.`
  );
  const summary = await summarizeContent({
    provider,
    model,
    content: formatted.slice(0, -1).join("\n\n"),
    aibitat: context.super,
  });

  const index = messages
    .map(
      (m, i) =>
        `${i + 1}. ${new Date(m.date).toLocaleString()} - ${m.fromName || m.from}`
    )
    .join("\n");
  return {
    text:
      `Message index:\n${index}\n\n` +
      `--- Summary of messages 1-${messages.length - 1} ---\n${summary}\n\n` +
      formatted[formatted.length - 1],
    summarized: true,
  };
}

module.exports.OutlookReadThread = {
  name: "outlook-read-thread",
  plugin: function () {
    return {
      name: "outlook-read-thread",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Read a full email conversation thread by its conversation ID. " +
            "Returns up to the 50 most recent messages with sender, recipients, subject, date, attachment information, and each message's own text (quoted replies removed; forwards include the forwarded content). " +
            "If the thread is too long for the context window, all but the latest message are summarized. " +
            "Use this after searching to read the full conversation.",
          examples: [
            {
              prompt: "Read the email thread with conversation ID AAQkAGI2...",
              call: JSON.stringify({
                conversationId: "AAQkAGI2...",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              conversationId: {
                type: "string",
                description: "The Outlook conversation ID to read.",
              },
            },
            required: ["conversationId"],
            additionalProperties: false,
          },
          handler: async function ({ conversationId }) {
            try {
              this.super.handlerProps.log(
                `Using the outlook-read-thread tool.`
              );

              if (!conversationId) {
                return "Error: conversationId is required.";
              }

              this.super.introspect(
                `${this.caller}: Reading Outlook conversation...`
              );

              const result = await outlookLib.readThread(conversationId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to read thread - ${result.error}`
                );
                return `Error reading Outlook thread: ${result.error}`;
              }

              const thread = result.data;

              const { allAttachments, parsedContent: parsedAttachmentContent } =
                await handleAttachments(this, thread.messages, (att) =>
                  outlookLib.getAttachmentContent(att.messageId, att.id)
                );

              const { header, formatted } = formatThread(thread.messages);
              const messagesFormatted = `${header}\n\n${formatted.join("\n\n")}`;

              this.super.introspect(
                `${this.caller}: Successfully read thread with ${thread.messageCount} messages`
              );

              // Report citation for the thread (without attachments)
              this.super.addCitation?.({
                id: `outlook-thread-${thread.conversationId}`,
                title: thread.subject,
                text: `Subject: "${thread.subject}"\n\n${messagesFormatted}`,
                chunkSource: `outlook-thread://${thread.permalink}`,
                score: null,
              });

              const { text, summarized } = await fitThreadToContext(
                this,
                thread.messages,
                formatted,
                header + parsedAttachmentContent
              );

              const count = thread.messageCount;
              return (
                `Thread: "${thread.subject}"\n` +
                `Conversation ID: ${thread.conversationId}\n` +
                `Messages: ${count}` +
                (thread.truncated
                  ? ` (the ${count} most recent; older messages were not read)`
                  : "") +
                "\n" +
                (summarized
                  ? `Messages 1-${count - 1} are summarized to fit the context window; message ${count} is shown in full.\n`
                  : "") +
                `Total Attachments: ${allAttachments.length}\n\n` +
                `${header}\n\n` +
                text +
                parsedAttachmentContent
              );
            } catch (e) {
              return handleSkillError(this, "outlook-read-thread", e);
            }
          },
        });
      },
    };
  },
};
