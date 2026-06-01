const outlookLib = require("../lib.js");
const { handleSkillError } = outlookLib;

module.exports.OutlookListDrafts = {
  name: "outlook-list-drafts",
  plugin: function () {
    return {
      name: "outlook-list-drafts",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all draft emails in Outlook. " +
            "Returns a summary of each draft including ID, subject, recipients, and last modified date.",
          examples: [
            {
              prompt: "Show me my draft emails",
              call: JSON.stringify({ limit: 25 }),
            },
            {
              prompt: "List drafts",
              call: JSON.stringify({ limit: 10 }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              limit: {
                type: "number",
                description:
                  "Maximum number of drafts to return (1-50). Defaults to 25.",
                default: 25,
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ limit = 25 }) {
            try {
              this.super.handlerProps.log(
                `Using the outlook-list-drafts tool.`
              );
              this.super.introspect(
                `${this.caller}: Listing Outlook drafts...`
              );

              const result = await outlookLib.listDrafts(limit);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to list drafts - ${result.error}`
                );
                return `Error listing drafts: ${result.error}`;
              }

              const { drafts, count } = result.data;
              this.super.introspect(`${this.caller}: Found ${count} drafts`);

              if (count === 0) {
                return "No drafts found.";
              }

              const summary = drafts
                .map(
                  (d, i) =>
                    `${i + 1}. "${d.subject || "(No Subject)"}" to ${d.to || "(No Recipients)"}\n   ID: ${d.id}\n   Last Modified: ${new Date(d.lastModified).toLocaleString()}\n   Preview: ${d.preview?.substring(0, 100) || "(No preview)"}...`
                )
                .join("\n\n");

              return `Found ${count} drafts:\n\n${summary}\n\nUse the draft ID with outlook-get-draft to see full content, outlook-update-draft to modify, or outlook-send-draft to send.`;
            } catch (e) {
              return handleSkillError(this, "outlook-list-drafts", e);
            }
          },
        });
      },
    };
  },
};
