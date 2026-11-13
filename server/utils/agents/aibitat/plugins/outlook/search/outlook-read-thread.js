const outlookLib = require("../lib.js");
const { handleAttachments, handleSkillError } = outlookLib;
const Provider = require("../../../providers/ai-provider");
const { summarizeContent } = require("../../../utils/summarize");
const { TokenManager } = require("../../../../../helpers/tiktoken");

// Share of the model's context window a thread may fill before its older
// messages are summarized, leaving the rest for the conversation and the reply.
const THREAD_CONTEXT_RATIO = 0.75;

function formatMessage(msg, i) {
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
    `To: ${msg.to}\n` +
    (msg.cc ? `CC: ${msg.cc}\n` : "") +
    `Date: ${new Date(msg.date).toLocaleString()}\n` +
    `Subject: ${msg.subject}\n` +
    `Status: ${msg.isRead ? "READ" : "UNREAD"}\n` +
    `\n${bodyContent}` +
    attachmentInfo
  );
}

/**
 * Returns the thread text sized for the model's context window. When the
 * messages (plus any parsed attachment text) exceed the budget, every message
 * but the latest is summarized; the latest stays verbatim and an index of all
 * messages keeps who wrote when.
 * @param {object} context - The tool handler's `this`
 * @param {object[]} messages - Thread messages, oldest first
 * @param {string[]} formatted - `messages` formatted by formatMessage
 * @param {string} attachmentContent - Parsed attachment text sent alongside
 * @returns {Promise<{text: string, summarized: boolean}>}
 */
async function fitThreadToContext(
  context,
  messages,
  formatted,
  attachmentContent = ""
) {
  const full = formatted.join("\n\n");
  if (messages.length < 2) return { text: full, summarized: false };

  const { provider, model } = context.super;
  const budget = Math.floor(
    Provider.contextLimit(provider, model) * THREAD_CONTEXT_RATIO
  );
  const tokens = new TokenManager(model).countFromString(
    full + attachmentContent
  );
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
            "Returns up to the 50 most recent messages with sender, recipients, subject, date, attachment information, and each message's own text (quoted replies removed). " +
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
                await handleAttachments(this, thread.messages);

              const formatted = thread.messages.map(formatMessage);
              const messagesFormatted = formatted.join("\n\n");

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
                parsedAttachmentContent
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
