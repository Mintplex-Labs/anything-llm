const outlookLib = require("../lib.js");
const { handleSkillError } = outlookLib;

module.exports.OutlookGetMailboxStats = {
  name: "outlook-get-mailbox-stats",
  plugin: function () {
    return {
      name: "outlook-get-mailbox-stats",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get Outlook mailbox statistics including folder counts and user profile information. " +
            "Returns the total and unread counts for inbox, drafts, sent items, and deleted items.",
          examples: [
            {
              prompt: "How many unread emails do I have?",
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
                `Using the outlook-get-mailbox-stats tool.`
              );
              this.super.introspect(
                `${this.caller}: Getting Outlook mailbox statistics...`
              );

              const result = await outlookLib.getMailboxStats();

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to get mailbox stats - ${result.error}`
                );
                return `Error getting mailbox statistics: ${result.error}`;
              }

              const { email, displayName, folders } = result.data;
              this.super.introspect(
                `${this.caller}: Successfully retrieved mailbox statistics`
              );

              let folderStats = "";
              if (folders.inbox)
                folderStats += `\nInbox: ${folders.inbox.total} total, ${folders.inbox.unread} unread`;
              if (folders.drafts)
                folderStats += `\nDrafts: ${folders.drafts.total} total`;
              if (folders.sentitems)
                folderStats += `\nSent Items: ${folders.sentitems.total} total`;
              if (folders.deleteditems)
                folderStats += `\nDeleted Items: ${folders.deleteditems.total} total`;

              return (
                `Outlook Mailbox Statistics:\n` +
                `\nAccount: ${displayName} (${email})\n` +
                `\nFolder Statistics:${folderStats}`
              );
            } catch (e) {
              return handleSkillError(this, "outlook-get-mailbox-stats", e);
            }
          },
        });
      },
    };
  },
};
