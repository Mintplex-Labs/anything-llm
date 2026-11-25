const gmailLib = require("../lib.js");

module.exports.GmailMoveToInbox = {
  name: "gmail-move-to-inbox",
  plugin: function () {
    return {
      name: "gmail-move-to-inbox",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Move an email thread back to inbox in Gmail. " +
            "Use this to unarchive a thread or move it from other locations to inbox.",
          examples: [
            {
              prompt: "Move thread 18abc123def to inbox",
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
                description: "The Gmail thread ID to move to inbox.",
              },
            },
            required: ["threadId"],
            additionalProperties: false,
          },
          handler: async function ({ threadId }) {
            try {
              this.super.handlerProps.log(
                `Using the gmail-move-to-inbox tool.`
              );

              if (!threadId) {
                return "Error: 'threadId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { threadId },
                  description: `Move Gmail thread "${threadId}" to inbox`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Moving thread ${threadId} to inbox`
              );

              const result = await gmailLib.moveToInbox(threadId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to move thread to inbox - ${result.error}`
                );
                return `Error moving thread to inbox: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully moved thread ${threadId} to inbox`
              );

              return `Successfully moved thread ${threadId} to inbox.`;
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-move-to-inbox error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error moving thread to inbox: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
