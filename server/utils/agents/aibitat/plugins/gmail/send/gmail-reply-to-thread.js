const gmailLib = require("../lib.js");
const { prepareAttachment, MAX_TOTAL_ATTACHMENT_SIZE } = require("../lib.js");
const { humanFileSize } = require("../../../../../helpers");

module.exports.GmailReplyToThread = {
  name: "gmail-reply-to-thread",
  plugin: function () {
    return {
      name: "gmail-reply-to-thread",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Reply to an existing email thread immediately. " +
            "This action sends the reply right away and cannot be undone. " +
            "For composing replies that need review before sending, use gmail-create-draft-reply instead. " +
            "Supports file attachments via absolute file paths (max 20MB total for all attachments combined).",
          examples: [
            {
              prompt: "Reply to thread 18abc123def",
              call: JSON.stringify({
                threadId: "18abc123def",
                body: "Thank you for your email. I've reviewed the proposal and have some feedback.",
                replyAll: false,
              }),
            },
            {
              prompt: "Reply all to the thread",
              call: JSON.stringify({
                threadId: "18abc123def",
                body: "Thanks everyone. I agree with the proposed timeline.",
                replyAll: true,
              }),
            },
            {
              prompt: "Reply with an attachment",
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
                  "Array of absolute file paths to attach to the reply.",
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
                `Using the gmail-reply-to-thread tool.`
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

                  if (this.super.requestToolApproval) {
                    const approval = await this.super.requestToolApproval({
                      skillName: this.name,
                      payload: {
                        fileName: result.fileInfo.name,
                        fileSize: result.fileInfo.sizeFormatted,
                        filePath: result.fileInfo.path,
                      },
                      description:
                        `Attach file "${result.fileInfo.name}" (${result.fileInfo.sizeFormatted}) to reply? ` +
                        `This file will be sent immediately.`,
                    });

                    if (!approval.approved) {
                      this.super.introspect(
                        `${this.caller}: User rejected attaching "${result.fileInfo.name}"`
                      );
                      return `Attachment rejected by user: ${result.fileInfo.name}. ${approval.message || ""}`;
                    }
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
                  description: `Reply to thread "${threadId}"${replyAll ? " (reply all)" : ""}${attachmentNote} - This will send immediately`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Replying to thread ${threadId}${replyAll ? " (reply all)" : ""}${preparedAttachments.length > 0 ? ` with ${preparedAttachments.length} attachment(s)` : ""}`
              );

              const options = {};
              if (cc) options.cc = cc;
              if (bcc) options.bcc = bcc;
              if (htmlBody) options.htmlBody = htmlBody;
              if (preparedAttachments.length > 0) {
                options.attachments = preparedAttachments;
              }

              const result = await gmailLib.replyToThread(
                threadId,
                body,
                replyAll,
                options
              );

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to reply to thread - ${result.error}`
                );
                return `Error replying to thread: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully replied to thread ${threadId}`
              );

              return (
                `Successfully replied to thread:\n` +
                `Thread ID: ${threadId}\n` +
                `Reply Type: ${replyAll ? "Reply All" : "Reply"}\n` +
                (preparedAttachments.length > 0
                  ? `Attachments: ${attachmentSummaries.join(", ")}\n`
                  : "") +
                `\nThe reply has been sent.`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-reply-to-thread error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error replying to thread: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
