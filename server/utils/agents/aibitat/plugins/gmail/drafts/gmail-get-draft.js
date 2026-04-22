const gmailLib = require("../lib.js");

module.exports.GmailGetDraft = {
  name: "gmail-get-draft",
  plugin: function () {
    return {
      name: "gmail-get-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Retrieve a specific draft email by its ID. " +
            "Returns the draft details including recipient, subject, and body content.",
          examples: [
            {
              prompt: "Get the draft with ID r123456",
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
                description: "The Gmail draft ID to retrieve.",
              },
            },
            required: ["draftId"],
            additionalProperties: false,
          },
          handler: async function ({ draftId }) {
            try {
              this.super.handlerProps.log(`Using the gmail-get-draft tool.`);

              if (!draftId) {
                return "Error: 'draftId' is required.";
              }

              this.super.introspect(
                `${this.caller}: Retrieving Gmail draft ${draftId}`
              );

              const result = await gmailLib.getDraft(draftId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to get draft - ${result.error}`
                );
                return `Error retrieving Gmail draft: ${result.error}`;
              }

              const draft = result.data;
              this.super.introspect(
                `${this.caller}: Successfully retrieved draft (ID: ${draft.draftId})`
              );

              return (
                `Gmail Draft:\n` +
                `Draft ID: ${draft.draftId}\n` +
                `Message ID: ${draft.messageId}\n` +
                `To: ${draft.to}\n` +
                (draft.cc ? `CC: ${draft.cc}\n` : "") +
                (draft.bcc ? `BCC: ${draft.bcc}\n` : "") +
                `Subject: ${draft.subject}\n` +
                `Date: ${new Date(draft.date).toLocaleString()}\n` +
                `\n--- Body ---\n${draft.body}`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-get-draft error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error retrieving Gmail draft: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
