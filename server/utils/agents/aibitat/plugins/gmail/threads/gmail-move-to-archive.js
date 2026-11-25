const gmailLib = require("../lib.js");

module.exports.GmailMoveToArchive = {
  name: "gmail-move-to-archive",
  plugin: function () {
    return {
      name: "gmail-move-to-archive",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Archive an email thread in Gmail. " +
            "The thread will be removed from inbox but can still be found in All Mail or by searching.",
          examples: [
            {
              prompt: "Archive thread 18abc123def",
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
                description: "The Gmail thread ID to archive.",
              },
            },
            required: ["threadId"],
            additionalProperties: false,
          },
          handler: async function ({ threadId }) {
            try {
              this.super.handlerProps.log(
                `Using the gmail-move-to-archive tool.`
              );

              if (!threadId) {
                return "Error: 'threadId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { threadId },
                  description: `Archive Gmail thread "${threadId}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Archiving thread ${threadId}`
              );

              const result = await gmailLib.moveToArchive(threadId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to archive thread - ${result.error}`
                );
                return `Error archiving thread: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully archived thread ${threadId}`
              );

              return `Successfully archived thread ${threadId}. It can still be found in All Mail or by searching.`;
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-move-to-archive error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error archiving thread: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
