const gmailLib = require("../lib.js");

module.exports.GmailMarkUnread = {
  name: "gmail-mark-unread",
  plugin: function () {
    return {
      name: "gmail-mark-unread",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Mark an email thread as unread in Gmail. " +
            "This will mark the thread as unread so it appears as a new message.",
          examples: [
            {
              prompt: "Mark thread 18abc123def as unread",
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
                description: "The Gmail thread ID to mark as unread.",
              },
            },
            required: ["threadId"],
            additionalProperties: false,
          },
          handler: async function ({ threadId }) {
            try {
              this.super.handlerProps.log(`Using the gmail-mark-unread tool.`);

              if (!threadId) {
                return "Error: 'threadId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { threadId },
                  description: `Mark Gmail thread "${threadId}" as unread`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Marking thread ${threadId} as unread`
              );

              const result = await gmailLib.markUnread(threadId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to mark thread as unread - ${result.error}`
                );
                return `Error marking thread as unread: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully marked thread ${threadId} as unread`
              );

              return `Successfully marked thread ${threadId} as unread.`;
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-mark-unread error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error marking thread as unread: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
