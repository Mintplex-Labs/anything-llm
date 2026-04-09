const gmailLib = require("../lib.js");

module.exports.GmailReadMessage = {
  name: "gmail-read-message",
  plugin: function () {
    return {
      name: "gmail-read-message",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Read a single email message by its ID. Returns the message details " +
            "including sender, recipients, subject, body, date, and attachment information. " +
            "Use this when you need to read a specific message rather than a full thread.",
          examples: [
            {
              prompt: "Read the email message with ID 18abc123def456",
              call: JSON.stringify({
                messageId: "18abc123def456",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              messageId: {
                type: "string",
                description: "The Gmail message ID to read.",
              },
            },
            required: ["messageId"],
            additionalProperties: false,
          },
          handler: async function ({ messageId }) {
            try {
              this.super.handlerProps.log(`Using the gmail-read-message tool.`);

              if (!messageId) {
                return "Error: messageId is required.";
              }

              this.super.introspect(
                `${this.caller}: Reading Gmail message ${messageId}`
              );

              const result = await gmailLib.readMessage(messageId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to read message - ${result.error}`
                );
                return `Error reading Gmail message: ${result.error}`;
              }

              const msg = result.data;
              const attachmentInfo =
                msg.attachments?.length > 0
                  ? `\nAttachments:\n${msg.attachments.map((a) => `  - ${a.name} (${a.contentType}, ${(a.size / 1024).toFixed(1)}KB)`).join("\n")}`
                  : "";

              this.super.introspect(
                `${this.caller}: Successfully read message from ${msg.from}`
              );

              return (
                `Message ID: ${msg.id}\n` +
                `Thread ID: ${msg.threadId}\n` +
                `From: ${msg.from}\n` +
                `To: ${msg.to}\n` +
                (msg.cc ? `CC: ${msg.cc}\n` : "") +
                (msg.bcc ? `BCC: ${msg.bcc}\n` : "") +
                (msg.replyTo ? `Reply-To: ${msg.replyTo}\n` : "") +
                `Date: ${new Date(msg.date).toLocaleString()}\n` +
                `Subject: ${msg.subject}\n` +
                `Status: ${msg.isUnread ? "UNREAD" : "READ"}${msg.isStarred ? ", STARRED" : ""}${msg.isDraft ? ", DRAFT" : ""}\n` +
                `\n--- Body ---\n${msg.body}` +
                attachmentInfo
              );
            } catch (e) {
              this.super.handlerProps.log(`gmail-read-message error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error reading Gmail message: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
