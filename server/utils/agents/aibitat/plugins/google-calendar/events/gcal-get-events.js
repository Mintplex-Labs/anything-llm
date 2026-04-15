const googleCalendarLib = require("../lib.js");

module.exports.GCalGetEvents = {
  name: "gcal-get-events",
  plugin: function () {
    return {
      name: "gcal-get-events",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get calendar events within a date range, optionally filtered by search query. " +
            "Returns event titles, times, and IDs. Use this for custom date ranges.",
          examples: [
            {
              prompt: "Find all meetings next week",
              call: JSON.stringify({
                startDate: "2025-01-20T00:00:00",
                endDate: "2025-01-27T23:59:59",
                query: "meeting",
                limit: 25,
              }),
            },
            {
              prompt: "Show events from January 1st to January 31st",
              call: JSON.stringify({
                startDate: "2025-01-01T00:00:00",
                endDate: "2025-01-31T23:59:59",
                limit: 50,
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              startDate: {
                type: "string",
                description: "Start of date range in ISO datetime format.",
              },
              endDate: {
                type: "string",
                description: "End of date range in ISO datetime format.",
              },
              query: {
                type: "string",
                description: "Optional text to search for in events.",
              },
              calendarId: {
                type: "string",
                description:
                  "Optional calendar ID. If omitted, uses the primary calendar.",
              },
              limit: {
                type: "number",
                description: "Max results to return (default 25, max 100).",
                default: 25,
              },
            },
            required: ["startDate", "endDate"],
            additionalProperties: false,
          },
          handler: async function ({
            startDate,
            endDate,
            query,
            calendarId,
            limit = 25,
          }) {
            try {
              this.super.handlerProps.log(`Using the gcal-get-events tool.`);
              this.super.introspect(
                `${this.caller}: Fetching events from ${startDate} to ${endDate}${query ? ` matching "${query}"` : ""}...`
              );

              const result = await googleCalendarLib.getEvents(
                startDate,
                endDate,
                calendarId,
                query,
                limit
              );

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to get events - ${result.error}`
                );
                return `Error getting events: ${result.error}`;
              }

              const { totalEvents, returnedEvents, events } = result.data;
              this.super.introspect(
                `${this.caller}: Found ${totalEvents} event(s), returning ${returnedEvents}`
              );

              if (totalEvents === 0) {
                return `No events found between ${startDate} and ${endDate}${query ? ` matching "${query}"` : ""}.`;
              }

              const summary = events
                .map((event, i) => {
                  let timeStr;
                  if (event.isAllDayEvent) {
                    timeStr = `All day (${new Date(event.startDate).toLocaleDateString()})`;
                  } else {
                    timeStr = `${new Date(event.startTime).toLocaleString()} - ${new Date(event.endTime).toLocaleString()}`;
                  }
                  return (
                    `${i + 1}. "${event.title}"\n` +
                    `   ${timeStr}\n` +
                    `   ID: ${event.eventId}` +
                    (event.location ? `\n   Location: ${event.location}` : "")
                  );
                })
                .join("\n\n");

              let response = `Found ${totalEvents} event(s)`;
              if (returnedEvents < totalEvents) {
                response += ` (showing ${returnedEvents})`;
              }
              response += `:\n\n${summary}`;

              return response;
            } catch (e) {
              this.super.handlerProps.log(
                `gcal-get-events error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error getting events: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
