const gmailLib = require("../lib.js");

module.exports.GmailDeleteDraft = {
  name: "gmail-delete-draft",
  plugin: function () {
    return {
      name: "gmail-delete-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Delete a draft email from Gmail. " +
            "This action is permanent and cannot be undone.",
          examples: [
            {
              prompt: "Delete the draft with ID r123456",
              call: JSON.stringify({
                draftId: "r123456",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              draftId: {
                type: "string",
                description: "The Gmail draft ID to delete.",
              },
            },
            required: ["draftId"],
            additionalProperties: false,
          },
          handler: async function ({ draftId }) {
            try {
              this.super.handlerProps.log(`Using the gmail-delete-draft tool.`);

              if (!draftId) {
                return "Error: 'draftId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { draftId },
                  description: `Delete Gmail draft "${draftId}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Deleting Gmail draft ${draftId}`
              );

              const result = await gmailLib.deleteDraft(draftId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to delete draft - ${result.error}`
                );
                return `Error deleting Gmail draft: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully deleted draft ${draftId}`
              );

              return `Successfully deleted Gmail draft (ID: ${draftId}).`;
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-delete-draft error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error deleting Gmail draft: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
