const outlookLib = require("../lib.js");
const { handleAttachments, handleSkillError } = outlookLib;

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
            "Returns all messages in the thread including sender, recipients, subject, body, date, and attachment information. " +
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

              const messagesFormatted = thread.messages
                .map((msg, i) => {
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
                })
                .join("\n\n");

              this.super.introspect(
                `${this.caller}: Successfully read thread with ${thread.messageCount} messages`
              );

              // Report citation for the thread (without attachments)
              this.super.addCitation?.({
                id: `outlook-thread-${thread.conversationId}`,
                title: thread.subject,
                text: `Subject: "${thread.subject}"\n\n${messagesFormatted}`,
                chunkSource: `outlook-thread://${this._generatePermalink(thread.conversationId)}`,
                score: null,
              });

              return (
                `Thread: "${thread.subject}"\n` +
                `Conversation ID: ${thread.conversationId}\n` +
                `Messages: ${thread.messageCount}\n` +
                `Total Attachments: ${allAttachments.length}\n\n` +
                messagesFormatted +
                parsedAttachmentContent
              );
            } catch (e) {
              return handleSkillError(this, "outlook-read-thread", e);
            }
          },
          _generatePermalink: function (conversationId) {
            if (!conversationId) return null;
            let encodedId = encodeURIComponent(conversationId);
            // For outlook, this needs to be specifically encoded
            // as the webpage does not respect it like traditional URL encoding
            encodedId = encodedId.replace(/-/g, "%2F");
            return `https://outlook.live.com/mail/inbox/id/${encodedId}`;
          },
        });
      },
    };
  },
};
