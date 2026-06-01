const googleCalendarLib = require("../lib.js");

module.exports.GCalListCalendars = {
  name: "gcal-list-calendars",
  plugin: function () {
    return {
      name: "gcal-list-calendars",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all Google Calendars the user owns or is subscribed to. " +
            "Returns calendar names, IDs, time zones, and ownership information. " +
            "Use this to discover available calendars before querying events.",
          examples: [
            {
              prompt: "What calendars do I have?",
              call: JSON.stringify({}),
            },
            {
              prompt: "Show me all my Google Calendars",
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
                `Using the gcal-list-calendars tool.`
              );
              this.super.introspect(
                `${this.caller}: Fetching list of Google Calendars...`
              );

              const result = await googleCalendarLib.listCalendars();

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to list calendars - ${result.error}`
                );
                return `Error listing calendars: ${result.error}`;
              }

              const { totalCalendars, calendars } = result.data;
              this.super.introspect(
                `${this.caller}: Found ${totalCalendars} calendar(s)`
              );

              if (totalCalendars === 0) {
                return "No calendars found.";
              }

              const summary = calendars
                .map(
                  (cal, i) =>
                    `${i + 1}. "${cal.name}"${cal.isPrimary ? " (Primary)" : ""}\n` +
                    `   ID: ${cal.calendarId}\n` +
                    `   Time Zone: ${cal.timeZone}\n` +
                    `   Owned by me: ${cal.isOwnedByMe ? "Yes" : "No"}`
                )
                .join("\n\n");

              return `Found ${totalCalendars} calendar(s):\n\n${summary}`;
            } catch (e) {
              this.super.handlerProps.log(
                `gcal-list-calendars error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error listing calendars: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
