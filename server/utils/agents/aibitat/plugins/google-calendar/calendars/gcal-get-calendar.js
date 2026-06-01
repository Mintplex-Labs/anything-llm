const googleCalendarLib = require("../lib.js");

module.exports.GCalGetCalendar = {
  name: "gcal-get-calendar",
  plugin: function () {
    return {
      name: "gcal-get-calendar",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get detailed information about a specific Google Calendar by its ID. " +
            "Returns calendar name, description, time zone, and settings.",
          examples: [
            {
              prompt: "Get details for my work calendar",
              call: JSON.stringify({
                calendarId: "work@group.calendar.google.com",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              calendarId: {
                type: "string",
                description:
                  "The calendar ID. If omitted, returns the primary calendar.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ calendarId }) {
            try {
              this.super.handlerProps.log(`Using the gcal-get-calendar tool.`);
              this.super.introspect(
                `${this.caller}: Fetching calendar details${calendarId ? ` for ${calendarId}` : " for primary calendar"}...`
              );

              const result = await googleCalendarLib.getCalendar(calendarId);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to get calendar - ${result.error}`
                );
                return `Error getting calendar: ${result.error}`;
              }

              const cal = result.data;
              this.super.introspect(
                `${this.caller}: Retrieved calendar "${cal.name}"`
              );

              return (
                `Calendar Details:\n` +
                `Name: ${cal.name}\n` +
                `ID: ${cal.calendarId}\n` +
                `Description: ${cal.description || "(none)"}\n` +
                `Time Zone: ${cal.timeZone}\n` +
                `Primary: ${cal.isPrimary ? "Yes" : "No"}\n` +
                `Owned by me: ${cal.isOwnedByMe ? "Yes" : "No"}\n` +
                `Hidden: ${cal.isHidden ? "Yes" : "No"}\n` +
                `Selected: ${cal.isSelected ? "Yes" : "No"}`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gcal-get-calendar error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error getting calendar: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
