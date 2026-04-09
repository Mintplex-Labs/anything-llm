const gmailLib = require("../lib.js");

module.exports.GmailAddLabel = {
  name: "gmail-add-label",
  plugin: function () {
    return {
      name: "gmail-add-label",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Add a label to an email thread in Gmail. " +
            "The label must already exist in Gmail.",
          examples: [
            {
              prompt: "Add the 'Important' label to thread 18abc123def",
              call: JSON.stringify({
                threadId: "18abc123def",
                labelName: "Important",
              }),
            },
            {
              prompt: "Label thread 18abc123def as 'Work/Projects'",
              call: JSON.stringify({
                threadId: "18abc123def",
                labelName: "Work/Projects",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              threadId: {
                type: "string",
                description: "The Gmail thread ID to add the label to.",
              },
              labelName: {
                type: "string",
                description: "The name of the label to add. Must be an existing label.",
              },
            },
            required: ["threadId", "labelName"],
            additionalProperties: false,
          },
          handler: async function ({ threadId, labelName }) {
            try {
              this.super.handlerProps.log(`Using the gmail-add-label tool.`);

              if (!threadId || !labelName) {
                return "Error: 'threadId' and 'labelName' are required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { threadId, labelName },
                  description: `Add label "${labelName}" to Gmail thread "${threadId}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Adding label "${labelName}" to thread ${threadId}`
              );

              const result = await gmailLib.addLabel(threadId, labelName);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to add label - ${result.error}`
                );
                return `Error adding label: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully added label "${labelName}" to thread ${threadId}`
              );

              return `Successfully added label "${labelName}" to thread ${threadId}.`;
            } catch (e) {
              this.super.handlerProps.log(`gmail-add-label error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error adding label: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
