const gmailLib = require("../lib.js");
const { prepareAttachment, MAX_TOTAL_ATTACHMENT_SIZE } = require("../lib.js");
const { humanFileSize } = require("../../../../../helpers");

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
            "You must provide the draft ID and the new content for the draft. " +
            "Supports file attachments.",
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
            {
              prompt: "Update draft with an attachment",
              call: JSON.stringify({
                draftId: "r123456",
                to: "john@example.com",
                subject: "Report",
                body: "Please find the updated report attached.",
                attachments: ["/Users/me/Documents/report.pdf"],
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
            required: ["draftId", "to", "subject", "body"],
            additionalProperties: false,
          },
          handler: async function ({
            draftId,
            to,
            subject,
            body,
            cc,
            bcc,
            htmlBody,
            attachments,
          }) {
            try {
              this.super.handlerProps.log(`Using the gmail-update-draft tool.`);

              if (!draftId || !to || !subject) {
                return "Error: 'draftId', 'to', and 'subject' are required.";
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
                    draftId,
                    to,
                    subject,
                    attachmentCount: preparedAttachments.length,
                  },
                  description: `Update Gmail draft "${draftId}"${attachmentNote}`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Updating Gmail draft ${draftId}${preparedAttachments.length > 0 ? ` with ${preparedAttachments.length} attachment(s)` : ""}`
              );

              const options = {};
              if (cc) options.cc = cc;
              if (bcc) options.bcc = bcc;
              if (htmlBody) options.htmlBody = htmlBody;
              if (preparedAttachments.length > 0) {
                options.attachments = preparedAttachments;
              }

              const result = await gmailLib.updateDraft(
                draftId,
                to,
                subject,
                body,
                options
              );

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
                `Subject: ${draft.subject}\n` +
                (preparedAttachments.length > 0
                  ? `Attachments: ${attachmentSummaries.join(", ")}\n`
                  : "") +
                `\nThe draft has been updated.`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-update-draft error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error updating Gmail draft: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
