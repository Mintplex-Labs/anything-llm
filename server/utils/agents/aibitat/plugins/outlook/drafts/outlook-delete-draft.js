const outlookLib = require("../lib.js");
const { handleSkillError } = outlookLib;

module.exports.OutlookDeleteDraft = {
  name: "outlook-delete-draft",
  plugin: function () {
    return {
      name: "outlook-delete-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Delete a draft email from Outlook. " +
            "This permanently removes the draft and cannot be undone.",
          examples: [
            {
              prompt: "Delete the draft with ID AAMkAGI2...",
              call: JSON.stringify({
                draftId: "AAMkAGI2...",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              draftId: {
                type: "string",
                description: "The ID of the draft to delete.",
              },
            },
            required: ["draftId"],
            additionalProperties: false,
          },
          handler: async function ({ draftId }) {
            try {
              this.super.handlerProps.log(
                `Using the outlook-delete-draft tool.`
              );

              if (!draftId) {
                return "Error: 'draftId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { draftId },
                  description: `Delete draft ${draftId}? This cannot be undone.`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Deleting draft ${draftId}...`
              );

              const result = await outlookLib.deleteDraft(draftId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to delete draft - ${result.error}`
                );
                return `Error deleting draft: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully deleted draft`
              );

              return `Successfully deleted draft (ID: ${draftId}).`;
            } catch (e) {
              return handleSkillError(this, "outlook-delete-draft", e);
            }
          },
        });
      },
    };
  },
};
