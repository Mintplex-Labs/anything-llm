const googleCalendarLib = require("../lib.js");

module.exports.GCalGetEvent = {
  name: "gcal-get-event",
  plugin: function () {
    return {
      name: "gcal-get-event",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get detailed information about a specific calendar event by its ID. " +
            "Returns event title, time, location, description, guests, and RSVP status.",
          examples: [
            {
              prompt: "Get details for event abc123",
              call: JSON.stringify({ eventId: "abc123" }),
            },
            {
              prompt: "Show me the meeting details for event xyz789",
              call: JSON.stringify({ eventId: "xyz789" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              eventId: {
                type: "string",
                description: "The event ID to retrieve.",
              },
              calendarId: {
                type: "string",
                description:
                  "Optional calendar ID. If omitted, uses the primary calendar.",
              },
            },
            required: ["eventId"],
            additionalProperties: false,
          },
          handler: async function ({ eventId, calendarId }) {
            try {
              this.super.handlerProps.log(`Using the gcal-get-event tool.`);
              this.super.introspect(
                `${this.caller}: Fetching event ${eventId}...`
              );

              const result = await googleCalendarLib.getEvent(
                eventId,
                calendarId
              );

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to get event - ${result.error}`
                );
                return `Error getting event: ${result.error}`;
              }

              const event = result.data;
              this.super.introspect(
                `${this.caller}: Retrieved event "${event.title}"`
              );

              let timeInfo;
              if (event.isAllDayEvent) {
                timeInfo = `All-day event: ${new Date(event.startDate).toLocaleDateString()}`;
                if (event.endDate) {
                  timeInfo += ` to ${new Date(event.endDate).toLocaleDateString()}`;
                }
              } else {
                timeInfo = `Time: ${new Date(event.startTime).toLocaleString()} - ${new Date(event.endTime).toLocaleString()}`;
              }

              const guestList =
                event.guests?.length > 0
                  ? event.guests
                      .map((g) => `  - ${g.name || g.email} (${g.status})`)
                      .join("\n")
                  : "  (none)";

              const eventDetails =
                `Event Details:\n` +
                `Title: ${event.title}\n` +
                `Event ID: ${event.eventId}\n` +
                `Calendar ID: ${event.calendarId}\n` +
                `${timeInfo}\n` +
                `Location: ${event.location || "(none)"}\n` +
                `Description: ${event.description || "(none)"}\n` +
                `Recurring: ${event.isRecurringEvent ? "Yes" : "No"}\n` +
                `My Status: ${event.myStatus}\n` +
                `Owned by me: ${event.isOwnedByMe ? "Yes" : "No"}\n` +
                `Guests:\n${guestList}\n` +
                `Created: ${new Date(event.dateCreated).toLocaleString()}\n` +
                `Last Updated: ${new Date(event.lastUpdated).toLocaleString()}`;

              this.super.addCitation?.({
                id: `google-calendar-${event.eventId}`,
                title: event.title,
                text: eventDetails,
                chunkSource: `google-calendar://${event.eventId}`,
                score: null,
              });
              return eventDetails;
            } catch (e) {
              this.super.handlerProps.log(`gcal-get-event error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error getting event: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
