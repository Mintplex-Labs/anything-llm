const gmailLib = require("../lib.js");

module.exports.GmailListDrafts = {
  name: "gmail-list-drafts",
  plugin: function () {
    return {
      name: "gmail-list-drafts",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all draft emails in Gmail. " +
            "Returns a summary of each draft including ID, recipient, subject, and date.",
          examples: [
            {
              prompt: "List my email drafts",
              call: JSON.stringify({
                limit: 25,
              }),
            },
            {
              prompt: "Show me the first 10 drafts",
              call: JSON.stringify({
                limit: 10,
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              limit: {
                type: "number",
                description:
                  "Maximum number of drafts to return (1-100). Defaults to 25.",
                default: 25,
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ limit = 25 }) {
            try {
              this.super.handlerProps.log(`Using the gmail-list-drafts tool.`);

              this.super.introspect(
                `${this.caller}: Listing Gmail drafts (limit: ${limit})`
              );

              const result = await gmailLib.listDrafts(limit);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to list drafts - ${result.error}`
                );
                return `Error listing Gmail drafts: ${result.error}`;
              }

              const { totalDrafts, returned, drafts } = result.data;
              this.super.introspect(
                `${this.caller}: Found ${totalDrafts} total drafts, returning ${returned}`
              );

              if (totalDrafts === 0) {
                return "No drafts found in Gmail.";
              }

              const summary = drafts
                .map(
                  (d, i) =>
                    `${i + 1}. Draft ID: ${d.draftId}\n` +
                    `   To: ${d.to || "(no recipient)"}\n` +
                    `   Subject: ${d.subject || "(no subject)"}\n` +
                    `   Date: ${new Date(d.date).toLocaleString()}`
                )
                .join("\n\n");

              return (
                `Gmail Drafts (${returned} of ${totalDrafts} total):\n\n${summary}\n\n` +
                `Use the draft ID with gmail-get-draft to view full content, ` +
                `gmail-update-draft to edit, gmail-delete-draft to remove, ` +
                `or gmail-send-draft to send.`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-list-drafts error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error listing Gmail drafts: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
