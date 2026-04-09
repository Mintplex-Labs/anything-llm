const gmailLib = require("../lib.js");

module.exports.GmailCreateDraft = {
  name: "gmail-create-draft",
  plugin: function () {
    return {
      name: "gmail-create-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a new draft email in Gmail. The draft will be saved but not sent. " +
            "You can optionally include CC, BCC recipients and HTML body content.",
          examples: [
            {
              prompt: "Create a draft email to john@example.com about the meeting",
              call: JSON.stringify({
                to: "john@example.com",
                subject: "Meeting Tomorrow",
                body: "Hi John,\n\nJust wanted to confirm our meeting tomorrow at 2pm.\n\nBest regards",
              }),
            },
            {
              prompt: "Draft an email with CC recipients",
              call: JSON.stringify({
                to: "john@example.com",
                subject: "Project Update",
                body: "Please see the attached project update.",
                cc: "manager@example.com",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
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
            required: ["to", "subject", "body"],
            additionalProperties: false,
          },
          handler: async function ({ to, subject, body, cc, bcc, htmlBody }) {
            try {
              this.super.handlerProps.log(`Using the gmail-create-draft tool.`);

              if (!to || !subject) {
                return "Error: 'to' and 'subject' are required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { to, subject },
                  description: `Create Gmail draft to "${to}" with subject "${subject}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Creating Gmail draft to ${to}`
              );

              const options = {};
              if (cc) options.cc = cc;
              if (bcc) options.bcc = bcc;
              if (htmlBody) options.htmlBody = htmlBody;

              const result = await gmailLib.createDraft(to, subject, body, options);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to create draft - ${result.error}`
                );
                return `Error creating Gmail draft: ${result.error}`;
              }

              const draft = result.data;
              this.super.introspect(
                `${this.caller}: Successfully created draft (ID: ${draft.draftId})`
              );

              return (
                `Successfully created Gmail draft:\n` +
                `Draft ID: ${draft.draftId}\n` +
                `Message ID: ${draft.messageId}\n` +
                `To: ${draft.to}\n` +
                `Subject: ${draft.subject}\n\n` +
                `The draft has been saved and can be edited or sent later.`
              );
            } catch (e) {
              this.super.handlerProps.log(`gmail-create-draft error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating Gmail draft: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
