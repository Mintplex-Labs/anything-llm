const gmailLib = require("../lib.js");

module.exports.GmailMoveToTrash = {
  name: "gmail-move-to-trash",
  plugin: function () {
    return {
      name: "gmail-move-to-trash",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Move an email thread to trash in Gmail. " +
            "The thread can be recovered from trash within 30 days.",
          examples: [
            {
              prompt: "Move thread 18abc123def to trash",
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
                description: "The Gmail thread ID to move to trash.",
              },
            },
            required: ["threadId"],
            additionalProperties: false,
          },
          handler: async function ({ threadId }) {
            try {
              this.super.handlerProps.log(
                `Using the gmail-move-to-trash tool.`
              );

              if (!threadId) {
                return "Error: 'threadId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { threadId },
                  description: `Move Gmail thread "${threadId}" to trash`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Moving thread ${threadId} to trash`
              );

              const result = await gmailLib.moveToTrash(threadId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to move thread to trash - ${result.error}`
                );
                return `Error moving thread to trash: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully moved thread ${threadId} to trash`
              );

              return `Successfully moved thread ${threadId} to trash. It can be recovered within 30 days.`;
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-move-to-trash error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error moving thread to trash: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
