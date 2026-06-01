const outlookLib = require("../lib.js");
const { handleSkillError } = outlookLib;

module.exports.OutlookUpdateDraft = {
  name: "outlook-update-draft",
  plugin: function () {
    return {
      name: "outlook-update-draft",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Update an existing draft email in Outlook. " +
            "You can modify the recipients, subject, or body of the draft.",
          examples: [
            {
              prompt: "Update the draft subject",
              call: JSON.stringify({
                draftId: "AAMkAGI2...",
                subject: "Updated Meeting - Tomorrow at 3pm",
              }),
            },
            {
              prompt: "Change the draft body and add CC",
              call: JSON.stringify({
                draftId: "AAMkAGI2...",
                body: "Updated content here.",
                cc: "manager@example.com",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              draftId: {
                type: "string",
                description: "The ID of the draft to update.",
              },
              to: {
                type: "string",
                description: "New recipient email address(es). Optional.",
              },
              subject: {
                type: "string",
                description: "New email subject. Optional.",
              },
              body: {
                type: "string",
                description: "New email body content. Optional.",
              },
              cc: {
                type: "string",
                description: "New CC recipient email address(es). Optional.",
              },
              isHtml: {
                type: "boolean",
                description:
                  "Whether the body is HTML content. Defaults to false.",
                default: false,
              },
            },
            required: ["draftId"],
            additionalProperties: false,
          },
          handler: async function ({ draftId, to, subject, body, cc, isHtml }) {
            try {
              this.super.handlerProps.log(
                `Using the outlook-update-draft tool.`
              );

              if (!draftId) {
                return "Error: 'draftId' is required.";
              }

              if (!to && !subject && !body && !cc) {
                return "Error: At least one field to update (to, subject, body, cc) is required.";
              }

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { draftId, hasChanges: { to, subject, body, cc } },
                  description: `Update draft ${draftId}`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Updating draft ${draftId}...`
              );

              const updates = { isHtml };
              if (to) updates.to = to;
              if (subject) updates.subject = subject;
              if (body) updates.body = body;
              if (cc) updates.cc = cc;

              const result = await outlookLib.updateDraft(draftId, updates);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to update draft - ${result.error}`
                );
                return `Error updating draft: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: Successfully updated draft`
              );

              return (
                `Successfully updated draft:\n` +
                `Draft ID: ${result.data.draftId}\n` +
                `Subject: ${result.data.subject}\n` +
                `\nThe draft has been updated.`
              );
            } catch (e) {
              return handleSkillError(this, "outlook-update-draft", e);
            }
          },
        });
      },
    };
  },
};
