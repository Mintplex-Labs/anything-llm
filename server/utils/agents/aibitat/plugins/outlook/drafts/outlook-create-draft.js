const outlookLib = require("../lib.js");
const { prepareAttachmentsWithValidation, handleSkillError } = outlookLib;

module.exports.OutlookCreateDraft = {
  name: "outlook-create-draft",
  plugin: function () {
    return {
      name: "outlook-create-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a new draft email in Outlook. The draft will be saved but not sent. " +
            "Can also create a draft reply to an existing message by providing replyToMessageId. " +
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
              prompt: "Create a draft reply to message AAMkAGI2...",
              call: JSON.stringify({
                replyToMessageId: "AAMkAGI2...",
                body: "Thanks for the update. I'll review and get back to you.",
              }),
            },
            {
              prompt: "Create a draft reply-all to message AAMkAGI2...",
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
                  "Message ID to reply to. If provided, creates a draft reply instead of a new draft. " +
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
                  "Recipient email address(es). Required for new drafts, optional for replies.",
              },
              subject: {
                type: "string",
                description:
                  "Email subject line. Required for new drafts, optional for replies.",
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
                  "Array of absolute file paths to attach to the draft.",
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
              this.super.handlerProps.log(
                `Using the outlook-create-draft tool.`
              );

              const isReply = !!replyToMessageId;

              if (!isReply && (!to || !subject)) {
                return "Error: 'to' and 'subject' are required for new drafts. For draft replies, provide 'replyToMessageId'.";
              }

              if (!body) {
                return "Error: 'body' is required.";
              }

              const attachmentResult = await prepareAttachmentsWithValidation(
                this,
                attachments
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
                  ? `Create draft ${replyAll ? "reply-all" : "reply"} to message ${replyToMessageId}${attachmentNote}`
                  : `Create Outlook draft to "${to}" with subject "${subject}"${attachmentNote}`;
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
                  `${this.caller}: Creating draft ${replyAll ? "reply-all" : "reply"} to message...`
                );
                result = await outlookLib.createDraftReply(
                  replyToMessageId,
                  body,
                  replyAll
                );
              } else {
                this.super.introspect(
                  `${this.caller}: Creating Outlook draft to ${to}${preparedAttachments.length > 0 ? ` with ${preparedAttachments.length} attachment(s)` : ""}`
                );

                const options = { isHtml };
                if (cc) options.cc = cc;
                if (bcc) options.bcc = bcc;
                if (preparedAttachments.length > 0) {
                  options.attachments = preparedAttachments;
                }

                result = await outlookLib.createDraft(
                  to,
                  subject,
                  body,
                  options
                );
              }

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to create draft - ${result.error}`
                );
                return `Error creating draft: ${result.error}`;
              }

              const draft = result.data;
              this.super.introspect(
                `${this.caller}: Successfully created draft (ID: ${draft.draftId})`
              );

              if (isReply) {
                return (
                  `Successfully created draft ${replyAll ? "reply-all" : "reply"}:\n` +
                  `Draft ID: ${draft.draftId}\n` +
                  `Subject: ${draft.subject}\n` +
                  `Type: ${replyAll ? "Reply All" : "Reply"}\n` +
                  `\nThe draft reply has been saved and can be edited or sent later.`
                );
              }

              return (
                `Successfully created Outlook draft:\n` +
                `Draft ID: ${draft.draftId}\n` +
                `To: ${to}\n` +
                `Subject: ${subject}\n` +
                (preparedAttachments.length > 0
                  ? `Attachments: ${attachmentSummaries.join(", ")}\n`
                  : "") +
                `\nThe draft has been saved and can be edited or sent later.`
              );
            } catch (e) {
              return handleSkillError(this, "outlook-create-draft", e);
            }
          },
        });
      },
    };
  },
};
