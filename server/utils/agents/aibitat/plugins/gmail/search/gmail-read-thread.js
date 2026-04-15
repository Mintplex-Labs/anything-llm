const gmailLib = require("../lib.js");
const { handleAttachments } = require("../lib.js");

module.exports.GmailReadThread = {
  name: "gmail-read-thread",
  plugin: function () {
    return {
      name: "gmail-read-thread",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Read a full email thread by its ID. Returns all messages in the thread " +
            "including sender, recipients, subject, body, date, and attachment information. " +
            "Use this after searching to read the full conversation.",
          examples: [
            {
              prompt: "Read the email thread with ID 18abc123def",
              call: JSON.stringify({
                threadId: "18abc123def",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              threadId: {
                type: "string",
                description: "The Gmail thread ID to read.",
              },
            },
            required: ["threadId"],
            additionalProperties: false,
          },
          handler: async function ({ threadId }) {
            try {
              this.super.handlerProps.log(`Using the gmail-read-thread tool.`);

              if (!threadId) {
                return "Error: threadId is required.";
              }

              this.super.introspect(
                `${this.caller}: Reading Gmail thread ${threadId}`
              );

              const result = await gmailLib.readThread(threadId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to read thread - ${result.error}`
                );
                return `Error reading Gmail thread: ${result.error}`;
              }

              const thread = result.data;
              const labels = thread.labels?.length
                ? `Labels: ${thread.labels.join(", ")}`
                : "No labels";

              const { allAttachments, parsedContent: parsedAttachmentContent } =
                await handleAttachments(this, thread.messages);

              const messagesFormatted = thread.messages
                .map((msg, i) => {
                  let attachmentInfo = "";
                  if (msg.attachments?.length > 0) {
                    attachmentInfo = `\n   Attachments: ${msg.attachments.map((a) => `${a.name} (${a.contentType}, ${(a.size / 1024).toFixed(1)}KB)`).join(", ")}`;
                  }
                  return (
                    `--- Message ${i + 1} ---\n` +
                    `From: ${msg.from}\n` +
                    `To: ${msg.to}\n` +
                    (msg.cc ? `CC: ${msg.cc}\n` : "") +
                    `Date: ${new Date(msg.date).toLocaleString()}\n` +
                    `Subject: ${msg.subject}\n` +
                    `Status: ${msg.isUnread ? "UNREAD" : "READ"}${msg.isStarred ? ", STARRED" : ""}\n` +
                    `\n${msg.body}` +
                    attachmentInfo
                  );
                })
                .join("\n\n");

              this.super.introspect(
                `${this.caller}: Successfully read thread with ${thread.messageCount} messages`
              );

              this.super.addCitation?.({
                id: `gmail-thread-${thread.id}`,
                title: thread.subject,
                text: messagesFormatted,
                chunkSource: `gmail-thread://${thread.permalink}`,
                score: null,
              });

              return (
                `Thread: "${thread.subject}"\n` +
                `Thread ID: ${thread.id}\n` +
                `Messages: ${thread.messageCount}\n` +
                `Total Attachments: ${allAttachments.length}\n` +
                `Status: ${thread.isUnread ? "UNREAD" : "READ"}${thread.isImportant ? ", IMPORTANT" : ""}${thread.hasStarredMessages ? ", HAS STARRED" : ""}\n` +
                `Location: ${thread.isInInbox ? "Inbox" : ""}${thread.isInSpam ? "Spam" : ""}${thread.isInTrash ? "Trash" : ""}\n` +
                `${labels}\n` +
                `Permalink: ${thread.permalink}\n\n` +
                messagesFormatted +
                parsedAttachmentContent
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-read-thread error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error reading Gmail thread: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
