const gmailLib = require("../lib.js");

module.exports.GmailUpdateDraft = {
  name: "gmail-update-draft",
  plugin: function () {
    return {
      name: "gmail-update-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Update an existing draft email in Gmail. " +
            "You must provide the draft ID and the new content for the draft.",
          examples: [
            {
              prompt: "Update draft r123456 with new content",
              call: JSON.stringify({
                draftId: "r123456",
                to: "john@example.com",
                subject: "Updated: Meeting Tomorrow",
                body: "Hi John,\n\nThe meeting has been rescheduled to 3pm.\n\nBest regards",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              draftId: {
                type: "string",
                description: "The Gmail draft ID to update.",
              },
              to: {
                type: "string",
                description: "Recipient email address(es). Multiple addresses can be comma-separated.",
              },
              subject: {
                type: "string",
                description: "Email subject line.",
              },
              body: {
                type: "string",
                description: "Plain text email body content.",
              },
              cc: {
                type: "string",
                description: "CC recipient email address(es). Optional.",
              },
              bcc: {
                type: "string",
                description: "BCC recipient email address(es). Optional.",
              },
              htmlBody: {
                type: "string",
                description: "HTML version of the email body. Optional.",
              },
            },
            required: ["draftId", "to", "subject", "body"],
            additionalProperties: false,
          },
          handler: async function ({ draftId, to, subject, body, cc, bcc, htmlBody }) {
            try {
              this.super.handlerProps.log(`Using the gmail-update-draft tool.`);

              if (!draftId || !to || !subject) {
                return "Error: 'draftId', 'to', and 'subject' are required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { draftId, to, subject },
                  description: `Update Gmail draft "${draftId}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Updating Gmail draft ${draftId}`
              );

              const options = {};
              if (cc) options.cc = cc;
              if (bcc) options.bcc = bcc;
              if (htmlBody) options.htmlBody = htmlBody;

              const result = await gmailLib.updateDraft(draftId, to, subject, body, options);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to update draft - ${result.error}`
                );
                return `Error updating Gmail draft: ${result.error}`;
              }

              const draft = result.data;
              this.super.introspect(
                `${this.caller}: Successfully updated draft (ID: ${draft.draftId})`
              );

              return (
                `Successfully updated Gmail draft:\n` +
                `Draft ID: ${draft.draftId}\n` +
                `Message ID: ${draft.messageId}\n` +
                `To: ${draft.to}\n` +
                `Subject: ${draft.subject}\n\n` +
                `The draft has been updated.`
              );
            } catch (e) {
              this.super.handlerProps.log(`gmail-update-draft error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error updating Gmail draft: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
