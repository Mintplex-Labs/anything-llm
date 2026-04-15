const googleCalendarLib = require("../lib.js");

module.exports.GCalGetEventsForDay = {
  name: "gcal-get-events-for-day",
  plugin: function () {
    return {
      name: "gcal-get-events-for-day",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get all calendar events for a specific day. " +
            "Returns event titles, times, and IDs for the specified date.",
          examples: [
            {
              prompt: "What events do I have on January 15th, 2025?",
              call: JSON.stringify({ date: "2025-01-15" }),
            },
            {
              prompt: "Show my schedule for March 20th",
              call: JSON.stringify({ date: "2025-03-20" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              date: {
                type: "string",
                description: "The date to query in ISO format (YYYY-MM-DD).",
              },
              calendarId: {
                type: "string",
                description:
                  "Optional calendar ID. If omitted, uses the primary calendar.",
              },
            },
            required: ["date"],
            additionalProperties: false,
          },
          handler: async function ({ date, calendarId }) {
            try {
              this.super.handlerProps.log(
                `Using the gcal-get-events-for-day tool.`
              );
              this.super.introspect(
                `${this.caller}: Fetching events for ${date}...`
              );

              const result = await googleCalendarLib.getEventsForDay(
                date,
                calendarId
              );

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to get events - ${result.error}`
                );
                return `Error getting events: ${result.error}`;
              }

              const { eventCount, events } = result.data;
              this.super.introspect(
                `${this.caller}: Found ${eventCount} event(s) for ${date}`
              );

              if (eventCount === 0) return `No events scheduled for ${date}.`;

              const summaries = [];
              const citations = [];
              events.forEach((event, i) => {
                let timeStr;
                if (event.isAllDayEvent) {
                  timeStr = "All day";
                } else {
                  const start = new Date(event.startTime).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  );
                  const end = new Date(event.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  timeStr = `${start} - ${end}`;
                }
                const eventDetails =
                  `${i + 1}. "${event.title}" (${timeStr})\n` +
                  `   ID: ${event.eventId}` +
                  (event.location ? `\n   Location: ${event.location}` : "");

                summaries.push(eventDetails);
                citations.push({
                  id: `google-calendar-${event.eventId}`,
                  title: event.title,
                  text: eventDetails,
                  chunkSource: `google-calendar://${event.eventId}`,
                  score: null,
                });
              });

              const summary = summaries.join("\n\n");
              citations.forEach((c) => this.super.addCitation?.(c));
              return `Events for ${date} (${eventCount} total):\n\n${summary}`;
            } catch (e) {
              this.super.handlerProps.log(
                `gcal-get-events-for-day error: ${e.message}`
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
