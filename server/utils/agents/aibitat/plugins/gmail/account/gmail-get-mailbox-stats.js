const gmailLib = require("../lib.js");

module.exports.GmailGetMailboxStats = {
  name: "gmail-get-mailbox-stats",
  plugin: function () {
    return {
      name: "gmail-get-mailbox-stats",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Used for general account information. Reports Gmail mailbox statistics including unread counts for inbox, " +
            "priority inbox, starred messages, and spam folder.",
          examples: [
            {
              prompt: "How much of my mailbox quota is remaining?",
              call: JSON.stringify({}),
            },
            {
              prompt: "Show me my mailbox statistics",
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
              this.super.handlerProps.log(
                `Using the gmail-get-mailbox-stats tool.`
              );

              this.super.introspect(
                `${this.caller}: Getting Gmail mailbox statistics`
              );

              const result = await gmailLib.getMailboxStats();

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to get mailbox stats - ${result.error}`
                );
                return `Error getting mailbox statistics: ${result.error}`;
              }

              const stats = result.data;
              this.super.introspect(
                `${this.caller}: Successfully retrieved mailbox statistics`
              );

              return (
                `Gmail Mailbox Statistics:\n\n` +
                `Inbox Unread: ${stats.inboxUnreadCount}\n` +
                `Priority Inbox Unread: ${stats.priorityInboxUnreadCount}\n` +
                `Starred Unread: ${stats.starredUnreadCount}\n` +
                `Spam Unread: ${stats.spamUnreadCount}\n\n` +
                `Use gmail-search to find and read specific emails.`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gmail-get-mailbox-stats error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error getting mailbox statistics: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
