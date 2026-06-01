const outlookLib = require("../lib.js");
const { prepareAttachmentsWithValidation, handleSkillError } = outlookLib;

module.exports.OutlookSendEmail = {
  name: "outlook-send-email",
  plugin: function () {
    return {
      name: "outlook-send-email",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Send an email immediately through Outlook. " +
            "This action sends the email right away and cannot be undone. " +
            "Can also reply to an existing message by providing replyToMessageId. " +
            "For composing emails that need review before sending, use outlook-create-draft instead.",
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
              prompt: "Reply to message AAMkAGI2...",
              call: JSON.stringify({
                replyToMessageId: "AAMkAGI2...",
                body: "Thanks for the update. I'll review and get back to you.",
              }),
            },
            {
              prompt: "Reply all to message AAMkAGI2...",
              call: JSON.stringify({
                replyToMessageId: "AAMkAGI2...",
                body: "Thanks everyone for your input.",
                replyAll: true,
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              replyToMessageId: {
                type: "string",
                description:
                  "Message ID to reply to. If provided, sends a reply instead of a new email. " +
                  "When replying, 'to' and 'subject' are optional (inherited from original).",
              },
              replyAll: {
                type: "boolean",
                description:
                  "When replying, whether to reply to all recipients. Defaults to false.",
                default: false,
              },
              to: {
                type: "string",
                description:
                  "Recipient email address(es). Required for new emails, optional for replies.",
              },
              subject: {
                type: "string",
                description:
                  "Email subject line. Required for new emails, optional for replies.",
              },
              body: {
                type: "string",
                description: "Email body content.",
              },
              cc: {
                type: "string",
                description: "CC recipient email address(es). Optional.",
              },
              bcc: {
                type: "string",
                description: "BCC recipient email address(es). Optional.",
              },
              isHtml: {
                type: "boolean",
                description:
                  "Whether the body is HTML content. Defaults to false.",
                default: false,
              },
              attachments: {
                type: "array",
                items: { type: "string" },
                description:
                  "Array of absolute file paths to attach to the email.",
              },
            },
            required: ["body"],
            additionalProperties: false,
          },
          handler: async function ({
            replyToMessageId,
            replyAll = false,
            to,
            subject,
            body,
            cc,
            bcc,
            isHtml,
            attachments,
          }) {
            try {
              this.super.handlerProps.log(`Using the outlook-send-email tool.`);

              const isReply = !!replyToMessageId;

              if (!isReply && (!to || !subject)) {
                return "Error: 'to' and 'subject' are required for new emails. For replies, provide 'replyToMessageId'.";
              }

              if (!body) {
                return "Error: 'body' is required.";
              }

              const attachmentResult = await prepareAttachmentsWithValidation(
                this,
                attachments,
                { requireApprovalPerFile: true, recipientInfo: to }
              );
              if (!attachmentResult.success) {
                return `Error with attachment: ${attachmentResult.error}`;
              }
              const {
                attachments: preparedAttachments,
                summaries: attachmentSummaries,
              } = attachmentResult;

              if (this.super.requestToolApproval) {
                const attachmentNote =
                  preparedAttachments.length > 0
                    ? ` with ${preparedAttachments.length} attachment(s): ${attachmentSummaries.join(", ")}`
                    : "";
                const description = isReply
                  ? `Send ${replyAll ? "reply-all" : "reply"} to message ${replyToMessageId}${attachmentNote}? This will send immediately.`
                  : `Send email to "${to}" with subject "${subject}"${attachmentNote} - This will send immediately`;
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: isReply
                    ? { replyToMessageId, replyAll }
                    : {
                        to,
                        subject,
                        attachmentCount: preparedAttachments.length,
                      },
                  description,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              let result;
              if (isReply) {
                this.super.introspect(
                  `${this.caller}: Sending ${replyAll ? "reply-all" : "reply"} to message...`
                );
                result = await outlookLib.replyToMessage(
                  replyToMessageId,
                  body,
                  replyAll
                );
              } else {
                this.super.introspect(
                  `${this.caller}: Sending email to ${to}${preparedAttachments.length > 0 ? ` with ${preparedAttachments.length} attachment(s)` : ""}`
                );

                const options = { isHtml };
                if (cc) options.cc = cc;
                if (bcc) options.bcc = bcc;
                if (preparedAttachments.length > 0) {
                  options.attachments = preparedAttachments;
                }

                result = await outlookLib.sendEmail(to, subject, body, options);
              }

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to send - ${result.error}`
                );
                return `Error sending: ${result.error}`;
              }

              if (isReply) {
                this.super.introspect(
                  `${this.caller}: Successfully sent ${replyAll ? "reply-all" : "reply"}`
                );
                return `Successfully sent ${replyAll ? "reply-all" : "reply"} to message (ID: ${replyToMessageId}). The reply has been delivered.`;
              }

              this.super.introspect(
                `${this.caller}: Successfully sent email to ${to}`
              );

              return (
                `Successfully sent email:\n` +
                `To: ${to}\n` +
                `Subject: ${subject}\n` +
                (cc ? `CC: ${cc}\n` : "") +
                (preparedAttachments.length > 0
                  ? `Attachments: ${attachmentSummaries.join(", ")}\n`
                  : "") +
                `\nThe email has been sent.`
              );
            } catch (e) {
              return handleSkillError(this, "outlook-send-email", e);
            }
          },
        });
      },
    };
  },
};
