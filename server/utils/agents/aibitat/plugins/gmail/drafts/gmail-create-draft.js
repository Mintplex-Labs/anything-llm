const gmailLib = require("../lib.js");
const { prepareAttachment, MAX_TOTAL_ATTACHMENT_SIZE } = require("../lib.js");
const { humanFileSize } = require("../../../../../helpers");

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
            "You can optionally include CC, BCC recipients, HTML body content, and file attachments.",
          examples: [
            {
              prompt:
                "Create a draft email to john@example.com about the meeting",
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
            {
              prompt: "Create a draft with an attachment",
              call: JSON.stringify({
                to: "john@example.com",
                subject: "Report",
                body: "Please find the report attached.",
                attachments: ["/Users/me/Documents/report.pdf"],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              to: {
                type: "string",
                description:
                  "Recipient email address(es). Multiple addresses can be comma-separated.",
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
              attachments: {
                type: "array",
                items: { type: "string" },
                description:
                  "Array of absolute file paths to attach to the draft.",
              },
            },
            required: ["to", "subject", "body"],
            additionalProperties: false,
          },
          handler: async function ({
            to,
            subject,
            body,
            cc,
            bcc,
            htmlBody,
            attachments,
          }) {
            try {
              this.super.handlerProps.log(`Using the gmail-create-draft tool.`);

              if (!to || !subject || !body) {
                return "Error: 'to', 'subject', and 'body' are required.";
              }

              const preparedAttachments = [];
              const attachmentSummaries = [];
              let totalAttachmentSize = 0;

              if (Array.isArray(attachments) && attachments.length > 0) {
                this.super.introspect(
                  `${this.caller}: Validating ${attachments.length} attachment(s)...`
                );

                for (const filePath of attachments) {
                  const result = prepareAttachment(filePath);
                  if (!result.success) {
                    this.super.introspect(
                      `${this.caller}: Attachment validation failed - ${result.error}`
                    );
                    return `Error with attachment: ${result.error}`;
                  }

                  totalAttachmentSize += result.fileInfo.size;
                  if (totalAttachmentSize > MAX_TOTAL_ATTACHMENT_SIZE) {
                    const totalFormatted = humanFileSize(
                      totalAttachmentSize,
                      true
                    );
                    this.super.introspect(
                      `${this.caller}: Total attachment size (${totalFormatted}) exceeds 20MB limit`
                    );
                    return `Error: Total attachment size (${totalFormatted}) exceeds the 20MB limit. Please reduce the number or size of attachments.`;
                  }

                  preparedAttachments.push(result.attachment);
                  attachmentSummaries.push(
                    `${result.fileInfo.name} (${result.fileInfo.sizeFormatted})`
                  );
                  this.super.introspect(
                    `${this.caller}: Prepared attachment "${result.fileInfo.name}"`
                  );
                }
              }

              if (this.super.requestToolApproval) {
                const attachmentNote =
                  preparedAttachments.length > 0
                    ? ` with ${preparedAttachments.length} attachment(s): ${attachmentSummaries.join(", ")}`
                    : "";
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    to,
                    subject,
                    attachmentCount: preparedAttachments.length,
                  },
                  description: `Create Gmail draft to "${to}" with subject "${subject}"${attachmentNote}`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Creating Gmail draft to ${to}${preparedAttachments.length > 0 ? ` with ${preparedAttachments.length} attachment(s)` : ""}`
              );

              const options = {};
              if (cc) options.cc = cc;
              if (bcc) options.bcc = bcc;
              if (htmlBody) options.htmlBody = htmlBody;
              if (preparedAttachments.length > 0) {
                options.attachments = preparedAttachments;
              }

              const result = await gmailLib.createDraft(
                to,
                subject,
                body,
                options
              );

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
                `Subject: ${draft.subject}\n` +
                (preparedAttachments.length > 0
                  ? `Attachments: ${attachmentSummaries.join(", ")}\n`
                  : "") +
                `\nThe draft has been saved and can be edited or sent later.`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-create-draft error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating Gmail draft: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
