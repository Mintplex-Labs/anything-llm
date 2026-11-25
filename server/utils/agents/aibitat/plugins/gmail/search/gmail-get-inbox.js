const gmailLib = require("../lib.js");

module.exports.GmailGetInbox = {
  name: "gmail-get-inbox",
  plugin: function () {
    return {
      name: "gmail-get-inbox",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get the inbox emails from Gmail. Returns the inbox emails with the details of the email. " +
            "Supports optional query and limit parameters to filter the emails.",
          examples: [
            {
              prompt: "What's in my inbox?",
              call: JSON.stringify({
                query: "",
                limit: 10,
              }),
            },
            {
              prompt: "Check my inbox for any emails from John Doe",
              call: JSON.stringify({
                query: "from:john.doe@example.com",
                limit: 10,
              }),
            },
            {
              prompt: "Get my 5 most recent unread emails",
              call: JSON.stringify({
                query: "is:unread newer_than:1d",
                limit: 5,
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
                  "Optional Gmail search query. Use Gmail query syntax like 'is:inbox', 'is:unread', 'from:email', 'subject:keyword', etc.",
              },
              limit: {
                type: "number",
                description:
                  "Optional maximum number of results to return (1-50). Defaults to 10.",
                default: 10,
              },
            },
            required: [],
            additionalProperties: false,
          },
          handler: async function ({ query = "", limit = 10 }) {
            try {
              this.super.handlerProps.log(`Using the gmail-get-inbox tool.`);
              this.super.introspect(
                `${this.caller}: Searching Gmail with query "${query}"`
              );

              let searchQuery = `is:inbox`;
              if (query) searchQuery += ` ${query}`;
              const result = await gmailLib.search(searchQuery, limit);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Gmail get inbox failed - ${result.error}`
                );
                return `Error getting inbox from Gmail: ${result.error}`;
              }

              const { threads, resultCount } = result.data;
              this.super.introspect(
                `${this.caller}: Found ${resultCount} emails in inbox`
              );

              if (resultCount === 0) {
                return `No emails found in inbox.`;
              }

              const summary = threads
                .map(
                  (t, i) =>
                    `${i + 1}. [${t.isUnread ? "UNREAD" : "READ"}] "${t.subject}" (ID: ${t.id}, ${t.messageCount} messages, Last: ${new Date(t.lastMessageDate).toLocaleString()})`
                )
                .join("\n");

              return `Found ${resultCount} email threads:\n\n${summary}\n\nAlways include the full thread ID in the response. Use the thread ID with gmail-read-thread to read the full conversation.`;
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-get-inbox error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error getting inbox from Gmail: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
