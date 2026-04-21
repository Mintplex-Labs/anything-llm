const outlookLib = require("../lib.js");
const { formatMessageSummary, handleSkillError } = outlookLib;

module.exports.OutlookSearch = {
  name: "outlook-search",
  plugin: function () {
    return {
      name: "outlook-search",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Search emails in Outlook using Microsoft Search syntax. " +
            "Supports searching by keywords, sender, subject, and more. " +
            "Common search terms: 'from:email', 'subject:word', 'hasAttachments:true'. " +
            "Returns message summaries with ID, subject, date, and read status.",
          examples: [
            {
              prompt: "Search for emails about the project",
              call: JSON.stringify({
                query: "project update",
                limit: 10,
              }),
            },
            {
              prompt: "Find emails from john@example.com",
              call: JSON.stringify({
                query: "from:john@example.com",
                limit: 20,
              }),
            },
            {
              prompt: "Search for emails with attachments about invoices",
              call: JSON.stringify({
                query: "hasAttachments:true invoice",
                limit: 15,
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "Search query. Use Microsoft Search syntax like 'from:email', 'subject:keyword', etc.",
              },
              limit: {
                type: "number",
                description:
                  "Maximum number of results to return (1-50). Defaults to 10.",
                default: 10,
              },
              skip: {
                type: "number",
                description:
                  "Number of results to skip for pagination. Defaults to 0.",
                default: 0,
              },
            },
            required: ["query"],
            additionalProperties: false,
          },
          handler: async function ({ query, limit = 10, skip = 0 }) {
            try {
              this.super.handlerProps.log(`Using the outlook-search tool.`);
              this.super.introspect(
                `${this.caller}: Searching Outlook with query "${query}"`
              );

              const result = await outlookLib.search(query, limit, skip);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Outlook search failed - ${result.error}`
                );
                return `Error searching Outlook: ${result.error}`;
              }

              const { messages, resultCount } = result.data;
              this.super.introspect(
                `${this.caller}: Found ${resultCount} messages matching query`
              );

              if (resultCount === 0) {
                return `No emails found matching query "${query}".`;
              }

              const summary = formatMessageSummary(messages);
              return `Found ${resultCount} messages:\n\n${summary}\n\nAlways include the conversation ID in the response. Use the conversation ID with outlook-read-thread to read the full conversation.`;
            } catch (e) {
              return handleSkillError(this, "outlook-search", e);
            }
          },
        });
      },
    };
  },
};
