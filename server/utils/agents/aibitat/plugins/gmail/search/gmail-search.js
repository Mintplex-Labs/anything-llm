const gmailLib = require("../lib.js");

module.exports.GmailSearch = {
  name: "gmail-search",
  plugin: function () {
    return {
      name: "gmail-search",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Search emails in Gmail using Gmail query syntax. " +
            "Supports full Gmail search including keywords and operators combined. " +
            "Common operators: 'is:inbox', 'is:unread', 'is:starred', 'from:email', 'to:email', " +
            "'subject:word', 'has:attachment', 'newer_than:7d', 'older_than:1m'. " +
            "Combine with search terms: 'is:inbox meeting notes' finds inbox emails containing 'meeting notes'. " +
            "Returns thread summaries with ID, subject, date, and unread status.",
          examples: [
            {
              prompt: "Search for unread emails in my inbox about the project",
              call: JSON.stringify({
                query: "is:inbox is:unread project update",
                limit: 10,
              }),
            },
            {
              prompt: "Find emails from john@example.com about meetings",
              call: JSON.stringify({
                query: "from:john@example.com meeting",
                limit: 20,
              }),
            },
            {
              prompt:
                "Search for emails with attachments from last week about invoices",
              call: JSON.stringify({
                query: "has:attachment newer_than:7d invoice",
                limit: 15,
              }),
            },
            {
              prompt: "Find starred emails about budget",
              call: JSON.stringify({
                query: "is:starred budget",
                limit: 10,
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
                  "Gmail search query. Use Gmail query syntax like 'is:inbox', 'is:unread', 'from:email', 'subject:keyword', etc.",
              },
              limit: {
                type: "number",
                description:
                  "Maximum number of results to return (1-50). Defaults to 10.",
                default: 10,
              },
              start: {
                type: "number",
                description: "Starting offset for pagination. Defaults to 0.",
                default: 0,
              },
            },
            required: ["query"],
            additionalProperties: false,
          },
          handler: async function ({
            query = "is:inbox",
            limit = 10,
            start = 0,
          }) {
            try {
              this.super.handlerProps.log(`Using the gmail-search tool.`);
              this.super.introspect(
                `${this.caller}: Searching Gmail with query "${query}"`
              );

              const result = await gmailLib.search(query, limit, start);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Gmail search failed - ${result.error}`
                );
                return `Error searching Gmail: ${result.error}`;
              }

              const { threads, resultCount } = result.data;
              this.super.introspect(
                `${this.caller}: Found ${resultCount} email threads matching query`
              );

              if (resultCount === 0) {
                return `No emails found matching query "${query}".`;
              }

              const summary = threads
                .map(
                  (t, i) =>
                    `${i + 1}. [${t.isUnread ? "UNREAD" : "READ"}] "${t.subject}" (ID: ${t.id}, ${t.messageCount} messages, Last: ${new Date(t.lastMessageDate).toLocaleString()})`
                )
                .join("\n");

              return `Found ${resultCount} email threads:\n\n${summary}\n\nAlways include the full thread ID in the response. Use the thread ID with gmail-read-thread to read the full conversation.`;
            } catch (e) {
              this.super.handlerProps.log(`gmail-search error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error searching Gmail: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
