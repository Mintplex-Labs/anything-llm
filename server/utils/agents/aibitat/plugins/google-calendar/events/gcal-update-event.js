const googleCalendarLib = require("../lib.js");

module.exports.GCalUpdateEvent = {
  name: "gcal-update-event",
  plugin: function () {
    return {
      name: "gcal-update-event",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Update an existing calendar event. " +
            "You can change the title, description, location, time, or guest list. " +
            "Only provide the fields you want to update.",
          examples: [
            {
              prompt: "Change the title of event abc123 to 'Updated Meeting'",
              call: JSON.stringify({
                eventId: "abc123",
                title: "Updated Meeting",
              }),
            },
            {
              prompt: "Move event xyz789 to 3pm",
              call: JSON.stringify({
                eventId: "xyz789",
                startTime: "2025-01-15T15:00:00",
                endTime: "2025-01-15T16:00:00",
              }),
            },
            {
              prompt: "Add a location to event abc123",
              call: JSON.stringify({
                eventId: "abc123",
                location: "Conference Room A",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              eventId: {
                type: "string",
                description: "The ID of the event to update.",
              },
              calendarId: {
                type: "string",
                description:
                  "Optional calendar ID. If omitted, uses the primary calendar.",
              },
              title: {
                type: "string",
                description: "New event title.",
              },
              description: {
                type: "string",
                description: "New event description.",
              },
              location: {
                type: "string",
                description: "New event location.",
              },
              startTime: {
                type: "string",
                description: "New start time in ISO datetime format.",
              },
              endTime: {
                type: "string",
                description: "New end time in ISO datetime format.",
              },
              guests: {
                type: "array",
                items: { type: "string" },
                description:
                  "New guest list (replaces existing guests). Array of email addresses.",
              },
            },
            required: ["eventId"],
            additionalProperties: false,
          },
          handler: async function ({
            eventId,
            calendarId,
            title,
            description,
            location,
            startTime,
            endTime,
            guests,
          }) {
            try {
              this.super.handlerProps.log(`Using the gcal-update-event tool.`);

              const updates = {};
              if (title !== undefined) updates.title = title;
              if (description !== undefined) updates.description = description;
              if (location !== undefined) updates.location = location;
              if (startTime !== undefined) updates.startTime = startTime;
              if (endTime !== undefined) updates.endTime = endTime;
              if (guests !== undefined) updates.guests = guests;

              if (this.super.requestToolApproval) {
                const updatedFields = Object.keys(updates).join(", ");
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    eventId,
                    updates,
                  },
                  description: `Update calendar event ${eventId} - changing: ${updatedFields}`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Updating event ${eventId}...`
              );

              const result = await googleCalendarLib.updateEvent(
                eventId,
                calendarId,
                updates
              );

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to update event - ${result.error}`
                );
                return `Error updating event: ${result.error}`;
              }

              const event = result.data.event;
              this.super.introspect(
                `${this.caller}: Updated event "${event.title}"`
              );

              let timeInfo;
              if (event.isAllDayEvent) {
                timeInfo = `All-day event on ${new Date(event.startDate).toLocaleDateString()}`;
              } else {
                timeInfo = `${new Date(event.startTime).toLocaleString()} - ${new Date(event.endTime).toLocaleString()}`;
              }

              const updatedFields = Object.keys(updates).join(", ");

              return (
                `Event updated successfully!\n\n` +
                `Updated fields: ${updatedFields}\n\n` +
                `Title: ${event.title}\n` +
                `${timeInfo}\n` +
                `Location: ${event.location || "(none)"}\n` +
                `Event ID: ${event.eventId}`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gcal-update-event error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error updating event: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
