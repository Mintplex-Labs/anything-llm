const gmailLib = require("../lib.js");

module.exports.GmailRemoveLabel = {
  name: "gmail-remove-label",
  plugin: function () {
    return {
      name: "gmail-remove-label",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Remove a label from an email thread in Gmail. " +
            "This only removes the label association, it does not delete the label itself.",
          examples: [
            {
              prompt: "Remove the 'Important' label from thread 18abc123def",
              call: JSON.stringify({
                threadId: "18abc123def",
                labelName: "Important",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              threadId: {
                type: "string",
                description: "The Gmail thread ID to remove the label from.",
              },
              labelName: {
                type: "string",
                description: "The name of the label to remove.",
              },
            },
            required: ["threadId", "labelName"],
            additionalProperties: false,
          },
          handler: async function ({ threadId, labelName }) {
            try {
              this.super.handlerProps.log(`Using the gmail-remove-label tool.`);

              if (!threadId || !labelName) {
                return "Error: 'threadId' and 'labelName' are required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { threadId, labelName },
                  description: `Remove label "${labelName}" from Gmail thread "${threadId}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Removing label "${labelName}" from thread ${threadId}`
              );

              const result = await gmailLib.removeLabel(threadId, labelName);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to remove label - ${result.error}`
                );
                return `Error removing label: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully removed label "${labelName}" from thread ${threadId}`
              );

              return `Successfully removed label "${labelName}" from thread ${threadId}.`;
            } catch (e) {
              this.super.handlerProps.log(`gmail-remove-label error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error removing label: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
