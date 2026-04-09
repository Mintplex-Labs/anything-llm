const gmailLib = require("../lib.js");

module.exports.GmailSendEmail = {
  name: "gmail-send-email",
  plugin: function () {
    return {
      name: "gmail-send-email",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Send an email immediately through Gmail. " +
            "This action sends the email right away and cannot be undone. " +
            "For composing emails that need review before sending, use gmail-create-draft instead.",
          examples: [
            {
              prompt: "Send an email to john@example.com about the project",
              call: JSON.stringify({
                to: "john@example.com",
                subject: "Project Update",
                body: "Hi John,\n\nHere's the latest update on the project.\n\nBest regards",
              }),
            },
            {
              prompt: "Send an email with CC recipients",
              call: JSON.stringify({
                to: "john@example.com",
                subject: "Meeting Notes",
                body: "Please find the meeting notes attached.",
                cc: "manager@example.com, team@example.com",
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
              replyTo: {
                type: "string",
                description: "Reply-to email address. Optional.",
              },
            },
            required: ["to", "subject", "body"],
            additionalProperties: false,
          },
          handler: async function ({ to, subject, body, cc, bcc, htmlBody, replyTo }) {
            try {
              this.super.handlerProps.log(`Using the gmail-send-email tool.`);

              if (!to || !subject) {
                return "Error: 'to' and 'subject' are required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { to, subject },
                  description: `Send email to "${to}" with subject "${subject}" - This will send immediately`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Sending email to ${to}`
              );

              const options = {};
              if (cc) options.cc = cc;
              if (bcc) options.bcc = bcc;
              if (htmlBody) options.htmlBody = htmlBody;
              if (replyTo) options.replyTo = replyTo;

              const result = await gmailLib.sendEmail(to, subject, body, options);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to send email - ${result.error}`
                );
                return `Error sending email: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully sent email to ${to}`
              );

              return (
                `Successfully sent email:\n` +
                `To: ${to}\n` +
                `Subject: ${subject}\n` +
                (cc ? `CC: ${cc}\n` : "") +
                `\nThe email has been sent.`
              );
            } catch (e) {
              this.super.handlerProps.log(`gmail-send-email error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error sending email: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
