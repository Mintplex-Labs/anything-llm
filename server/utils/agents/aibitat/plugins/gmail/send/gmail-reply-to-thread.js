const gmailLib = require("../lib.js");

module.exports.GmailReplyToThread = {
  name: "gmail-reply-to-thread",
  plugin: function () {
    return {
      name: "gmail-reply-to-thread",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Reply to an existing email thread immediately. " +
            "This action sends the reply right away and cannot be undone. " +
            "For composing replies that need review before sending, use gmail-create-draft-reply instead.",
          examples: [
            {
              prompt: "Reply to thread 18abc123def",
              call: JSON.stringify({
                threadId: "18abc123def",
                body: "Thank you for your email. I've reviewed the proposal and have some feedback.",
                replyAll: false,
              }),
            },
            {
              prompt: "Reply all to the thread",
              call: JSON.stringify({
                threadId: "18abc123def",
                body: "Thanks everyone. I agree with the proposed timeline.",
                replyAll: true,
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              threadId: {
                type: "string",
                description: "The Gmail thread ID to reply to.",
              },
              body: {
                type: "string",
                description: "Plain text reply body content.",
              },
              replyAll: {
                type: "boolean",
                description: "Whether to reply to all recipients. Defaults to false (reply to sender only).",
                default: false,
              },
              cc: {
                type: "string",
                description: "Additional CC recipient email address(es). Optional.",
              },
              bcc: {
                type: "string",
                description: "BCC recipient email address(es). Optional.",
              },
              htmlBody: {
                type: "string",
                description: "HTML version of the reply body. Optional.",
              },
            },
            required: ["threadId", "body"],
            additionalProperties: false,
          },
          handler: async function ({ threadId, body, replyAll = false, cc, bcc, htmlBody }) {
            try {
              this.super.handlerProps.log(`Using the gmail-reply-to-thread tool.`);

              if (!threadId || !body) {
                return "Error: 'threadId' and 'body' are required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { threadId, replyAll },
                  description: `Reply to thread "${threadId}"${replyAll ? " (reply all)" : ""} - This will send immediately`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Replying to thread ${threadId}${replyAll ? " (reply all)" : ""}`
              );

              const options = {};
              if (cc) options.cc = cc;
              if (bcc) options.bcc = bcc;
              if (htmlBody) options.htmlBody = htmlBody;

              const result = await gmailLib.replyToThread(threadId, body, replyAll, options);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to reply to thread - ${result.error}`
                );
                return `Error replying to thread: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully replied to thread ${threadId}`
              );

              return (
                `Successfully replied to thread:\n` +
                `Thread ID: ${threadId}\n` +
                `Reply Type: ${replyAll ? "Reply All" : "Reply"}\n\n` +
                `The reply has been sent.`
              );
            } catch (e) {
              this.super.handlerProps.log(`gmail-reply-to-thread error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error replying to thread: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
