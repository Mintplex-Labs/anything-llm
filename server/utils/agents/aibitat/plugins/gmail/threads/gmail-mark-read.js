const gmailLib = require("../lib.js");

module.exports.GmailMarkRead = {
  name: "gmail-mark-read",
  plugin: function () {
    return {
      name: "gmail-mark-read",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Mark an email thread as read in Gmail. " +
            "This will mark all messages in the thread as read.",
          examples: [
            {
              prompt: "Mark thread 18abc123def as read",
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
                description: "The Gmail thread ID to mark as read.",
              },
            },
            required: ["threadId"],
            additionalProperties: false,
          },
          handler: async function ({ threadId }) {
            try {
              this.super.handlerProps.log(`Using the gmail-mark-read tool.`);

              if (!threadId) {
                return "Error: 'threadId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { threadId },
                  description: `Mark Gmail thread "${threadId}" as read`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Marking thread ${threadId} as read`
              );

              const result = await gmailLib.markRead(threadId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to mark thread as read - ${result.error}`
                );
                return `Error marking thread as read: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully marked thread ${threadId} as read`
              );

              return `Successfully marked thread ${threadId} as read.`;
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-mark-read error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error marking thread as read: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
