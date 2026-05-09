const outlookLib = require("../lib.js");
const { formatMessageSummary, handleSkillError } = outlookLib;

module.exports.OutlookGetInbox = {
  name: "outlook-get-inbox",
  plugin: function () {
    return {
      name: "outlook-get-inbox",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get recent emails from the Outlook inbox. " +
            "Returns a list of recent messages with subject, sender, date, and read status. " +
            "Use this to quickly see what's in the inbox.",
          examples: [
            {
              prompt: "Show me my recent emails",
              call: JSON.stringify({ limit: 10 }),
            },
            {
              prompt: "What's in my inbox?",
              call: JSON.stringify({ limit: 25 }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              limit: {
                type: "number",
                description:
                  "Maximum number of messages to return (1-50). Defaults to 25.",
                default: 25,
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ limit = 25 }) {
            try {
              this.super.handlerProps.log(`Using the outlook-get-inbox tool.`);
              this.super.introspect(
                `${this.caller}: Fetching Outlook inbox...`
              );

              const result = await outlookLib.getInbox(limit);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to get inbox - ${result.error}`
                );
                return `Error getting Outlook inbox: ${result.error}`;
              }

              const { messages, resultCount } = result.data;
              this.super.introspect(
                `${this.caller}: Found ${resultCount} messages in inbox`
              );

              if (resultCount === 0) {
                return "No messages found in inbox.";
              }

              const summary = formatMessageSummary(messages);
              return `Found ${resultCount} messages in inbox:\n\n${summary}\n\nAlways include the conversation ID in the response. Use the conversation ID with outlook-read-thread to read the full conversation.`;
            } catch (e) {
              return handleSkillError(this, "outlook-get-inbox", e);
            }
          },
        });
      },
    };
  },
};
