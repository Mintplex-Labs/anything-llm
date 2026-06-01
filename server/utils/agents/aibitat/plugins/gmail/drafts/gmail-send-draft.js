const gmailLib = require("../lib.js");

module.exports.GmailSendDraft = {
  name: "gmail-send-draft",
  plugin: function () {
    return {
      name: "gmail-send-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Send an existing draft email from Gmail. " +
            "This will send the draft immediately and remove it from drafts. " +
            "This action cannot be undone.",
          examples: [
            {
              prompt: "Send the draft with ID r123456",
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
                description: "The Gmail draft ID to send.",
              },
            },
            required: ["draftId"],
            additionalProperties: false,
          },
          handler: async function ({ draftId }) {
            try {
              this.super.handlerProps.log(`Using the gmail-send-draft tool.`);

              if (!draftId) {
                return "Error: 'draftId' is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { draftId },
                  description: `Send Gmail draft "${draftId}" - This will send the email immediately`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Sending Gmail draft ${draftId}`
              );

              const result = await gmailLib.sendDraft(draftId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to send draft - ${result.error}`
                );
                return `Error sending Gmail draft: ${result.error}`;
              }

              const { messageId, threadId } = result.data;
              this.super.introspect(
                `${this.caller}: Successfully sent draft as message ${messageId}`
              );

              return (
                `Successfully sent Gmail draft:\n` +
                `Message ID: ${messageId}\n` +
                `Thread ID: ${threadId}\n\n` +
                `The email has been sent and removed from drafts.`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-send-draft error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error sending Gmail draft: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
