const gmailLib = require("../lib.js");
const { prepareAttachment, MAX_TOTAL_ATTACHMENT_SIZE } = require("../lib.js");
const { humanFileSize } = require("../../../../../helpers");

module.exports.GmailCreateDraftReply = {
  name: "gmail-create-draft-reply",
  plugin: function () {
    return {
      name: "gmail-create-draft-reply",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a draft reply to an existing email thread in Gmail. " +
            "The draft will be saved but not sent. You can choose to reply to all recipients or just the sender. " +
            "Supports file attachments.",
          examples: [
            {
              prompt: "Create a draft reply to thread 18abc123def",
              call: JSON.stringify({
                threadId: "18abc123def",
                body: "Thank you for your email. I will review this and get back to you shortly.",
                replyAll: false,
              }),
            },
            {
              prompt: "Draft a reply-all response to the thread",
              call: JSON.stringify({
                threadId: "18abc123def",
                body: "Thanks everyone for your input. Here are my thoughts...",
                replyAll: true,
              }),
            },
            {
              prompt: "Create a draft reply with an attachment",
              call: JSON.stringify({
                threadId: "18abc123def",
                body: "Please find the requested document attached.",
                attachments: ["/Users/me/Documents/document.pdf"],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              threadId: {
                type: "string",
                description: "The Gmail thread ID to reply to.",
              },
              body: {
                type: "string",
                description: "Plain text reply body content.",
              },
              replyAll: {
                type: "boolean",
                description:
                  "Whether to reply to all recipients. Defaults to false (reply to sender only).",
                default: false,
              },
              cc: {
                type: "string",
                description:
                  "Additional CC recipient email address(es). Optional.",
              },
              bcc: {
                type: "string",
                description: "BCC recipient email address(es). Optional.",
              },
              htmlBody: {
                type: "string",
                description: "HTML version of the reply body. Optional.",
              },
              attachments: {
                type: "array",
                items: { type: "string" },
                description:
                  "Array of absolute file paths to attach to the draft reply.",
              },
            },
            required: ["threadId", "body"],
            additionalProperties: false,
          },
          handler: async function ({
            threadId,
            body,
            replyAll = false,
            cc,
            bcc,
            htmlBody,
            attachments,
          }) {
            try {
              this.super.handlerProps.log(
                `Using the gmail-create-draft-reply tool.`
              );

              if (!threadId || !body) {
                return "Error: 'threadId' and 'body' are required.";
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
                    threadId,
                    replyAll,
                    attachmentCount: preparedAttachments.length,
                  },
                  description: `Create Gmail draft reply to thread "${threadId}"${replyAll ? " (reply all)" : ""}${attachmentNote}`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Creating draft reply to thread ${threadId}${replyAll ? " (reply all)" : ""}${preparedAttachments.length > 0 ? ` with ${preparedAttachments.length} attachment(s)` : ""}`
              );

              const options = {};
              if (cc) options.cc = cc;
              if (bcc) options.bcc = bcc;
              if (htmlBody) options.htmlBody = htmlBody;
              if (preparedAttachments.length > 0) {
                options.attachments = preparedAttachments;
              }

              const result = await gmailLib.createDraftReply(
                threadId,
                body,
                replyAll,
                options
              );

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to create draft reply - ${result.error}`
                );
                return `Error creating Gmail draft reply: ${result.error}`;
              }

              const draft = result.data;
              this.super.introspect(
                `${this.caller}: Successfully created draft reply (ID: ${draft.draftId})`
              );

              return (
                `Successfully created Gmail draft reply:\n` +
                `Draft ID: ${draft.draftId}\n` +
                `Message ID: ${draft.messageId}\n` +
                `To: ${draft.to}\n` +
                `Subject: ${draft.subject}\n` +
                `Reply Type: ${replyAll ? "Reply All" : "Reply"}\n` +
                (preparedAttachments.length > 0
                  ? `Attachments: ${attachmentSummaries.join(", ")}\n`
                  : "") +
                `\nThe draft reply has been saved and can be edited or sent later.`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-create-draft-reply error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating Gmail draft reply: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
