const gmailLib = require("../lib.js");

module.exports.GmailListLabels = {
  name: "gmail-list-labels",
  plugin: function () {
    return {
      name: "gmail-list-labels",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all user-created labels in Gmail. " +
            "Returns the label names and their unread message counts.",
          examples: [
            {
              prompt: "Show me all my Gmail labels",
              call: JSON.stringify({}),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          handler: async function () {
            try {
              this.super.handlerProps.log(`Using the gmail-list-labels tool.`);

              this.super.introspect(
                `${this.caller}: Listing Gmail labels`
              );

              const result = await gmailLib.listLabels();

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to list labels - ${result.error}`
                );
                return `Error listing Gmail labels: ${result.error}`;
              }

              const labels = result.data;
              this.super.introspect(
                `${this.caller}: Found ${labels.length} labels`
              );

              if (labels.length === 0) {
                return "No user-created labels found in Gmail.";
              }

              const summary = labels
                .map(
                  (l, i) =>
                    `${i + 1}. ${l.name}${l.unreadCount > 0 ? ` (${l.unreadCount} unread)` : ""}`
                )
                .join("\n");

              return (
                `Gmail Labels (${labels.length} total):\n\n${summary}\n\n` +
                `Use gmail-add-label or gmail-remove-label to manage labels on threads.`
              );
            } catch (e) {
              this.super.handlerProps.log(`gmail-list-labels error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error listing Gmail labels: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
