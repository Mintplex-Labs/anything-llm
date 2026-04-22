const outlookLib = require("../lib.js");
const { handleSkillError } = outlookLib;

module.exports.OutlookSendDraft = {
  name: "outlook-send-draft",
  plugin: function () {
    return {
      name: "outlook-send-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Send an existing draft email from Outlook. " +
            "This action sends the email immediately and cannot be undone.",
          examples: [
            {
              prompt: "Send the draft with ID AAMkAGI2...",
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
                description: "The ID of the draft to send.",
              },
            },
            required: ["draftId"],
            additionalProperties: false,
          },
          handler: async function ({ draftId }) {
            try {
              this.super.handlerProps.log(`Using the outlook-send-draft tool.`);

              if (!draftId) {
                return "Error: 'draftId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { draftId },
                  description: `Send draft ${draftId}? This will send the email immediately.`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Sending draft ${draftId}...`
              );

              const result = await outlookLib.sendDraft(draftId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to send draft - ${result.error}`
                );
                return `Error sending draft: ${result.error}`;
              }

              this.super.introspect(`${this.caller}: Successfully sent draft`);

              return `Successfully sent draft (ID: ${draftId}). The email has been delivered.`;
            } catch (e) {
              return handleSkillError(this, "outlook-send-draft", e);
            }
          },
        });
      },
    };
  },
};
