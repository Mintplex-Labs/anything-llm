const googleCalendarLib = require("../lib.js");

module.exports.GCalCreateEvent = {
  name: "gcal-create-event",
  plugin: function () {
    return {
      name: "gcal-create-event",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a calendar event with full control over all event properties. " +
            "Supports timed events, all-day events, and recurring events. " +
            "For simple events, consider using gcal-quick-add instead.",
          examples: [
            {
              prompt:
                "Create a meeting called 'Team Standup' tomorrow from 9am to 9:30am",
              call: JSON.stringify({
                title: "Team Standup",
                startTime: "2025-01-16T09:00:00",
                endTime: "2025-01-16T09:30:00",
              }),
            },
            {
              prompt: "Create an all-day event for my birthday on March 15th",
              call: JSON.stringify({
                title: "My Birthday",
                allDay: true,
                date: "2025-03-15",
              }),
            },
            {
              prompt: "Create a weekly team meeting every Monday at 10am",
              call: JSON.stringify({
                title: "Weekly Team Meeting",
                startTime: "2025-01-20T10:00:00",
                endTime: "2025-01-20T11:00:00",
                recurrence: {
                  frequency: "weekly",
                  daysOfWeek: ["MONDAY"],
                },
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "The event title.",
              },
              startTime: {
                type: "string",
                description:
                  "Start time in ISO datetime format (for timed events).",
              },
              endTime: {
                type: "string",
                description:
                  "End time in ISO datetime format (for timed events).",
              },
              allDay: {
                type: "boolean",
                description: "Set to true for all-day events.",
              },
              date: {
                type: "string",
                description:
                  "Date in YYYY-MM-DD format (required for all-day events).",
              },
              endDate: {
                type: "string",
                description:
                  "End date for multi-day all-day events (YYYY-MM-DD).",
              },
              description: {
                type: "string",
                description: "Event description/notes.",
              },
              location: {
                type: "string",
                description: "Event location.",
              },
              guests: {
                type: "array",
                items: { type: "string" },
                description: "Array of guest email addresses.",
              },
              sendInvites: {
                type: "boolean",
                description: "Whether to send invite emails to guests.",
              },
              calendarId: {
                type: "string",
                description:
                  "Optional calendar ID. If omitted, uses the primary calendar.",
              },
              recurrence: {
                type: "object",
                description: "Recurrence configuration for recurring events.",
                properties: {
                  frequency: {
                    type: "string",
                    enum: ["daily", "weekly", "monthly", "yearly"],
                    description: "How often the event repeats.",
                  },
                  interval: {
                    type: "number",
                    description: "Repeat every N periods (default 1).",
                  },
                  count: {
                    type: "number",
                    description: "Number of occurrences.",
                  },
                  until: {
                    type: "string",
                    description: "ISO date to end recurrence.",
                  },
                  daysOfWeek: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "For weekly recurrence: days like ['MONDAY', 'WEDNESDAY'].",
                  },
                },
              },
            },
            required: ["title"],
            additionalProperties: false,
          },
          handler: async function (params) {
            try {
              this.super.handlerProps.log(`Using the gcal-create-event tool.`);

              if (this.super.requestToolApproval) {
                let timeInfo;
                if (params.allDay) {
                  timeInfo = `All-day event on ${params.date}`;
                  if (params.endDate) timeInfo += ` to ${params.endDate}`;
                } else {
                  timeInfo = `${params.startTime} - ${params.endTime}`;
                }
                const guestInfo =
                  params.guests?.length > 0
                    ? ` with ${params.guests.length} guest(s): ${params.guests.join(", ")}`
                    : "";
                const recurrenceInfo = params.recurrence
                  ? ` (recurring: ${params.recurrence.frequency})`
                  : "";

                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    title: params.title,
                    time: timeInfo,
                    guests: params.guests || [],
                    location: params.location,
                    recurrence: params.recurrence,
                  },
                  description: `Create calendar event "${params.title}" - ${timeInfo}${guestInfo}${recurrenceInfo}`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Creating event "${params.title}"...`
              );

              const result = await googleCalendarLib.createEvent(params);

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to create event - ${result.error}`
                );
                return `Error creating event: ${result.error}`;
              }

              const isRecurring = !!result.data.eventSeries;
              const eventData = result.data.event || result.data.eventSeries;

              this.super.introspect(
                `${this.caller}: Created ${isRecurring ? "recurring " : ""}event "${eventData.title}"`
              );

              let timeInfo;
              if (params.allDay) {
                timeInfo = `All-day event on ${params.date}`;
                if (params.endDate) {
                  timeInfo += ` to ${params.endDate}`;
                }
              } else {
                timeInfo = `${new Date(params.startTime).toLocaleString()} - ${new Date(params.endTime).toLocaleString()}`;
              }

              let response =
                `Event created successfully!\n\n` +
                `Title: ${eventData.title}\n` +
                `${timeInfo}\n` +
                `${isRecurring ? "Event Series" : "Event"} ID: ${isRecurring ? eventData.eventSeriesId : eventData.eventId}\n` +
                `Calendar ID: ${eventData.calendarId}`;

              if (params.location) {
                response += `\nLocation: ${params.location}`;
              }
              if (params.guests?.length > 0) {
                response += `\nGuests: ${params.guests.join(", ")}`;
              }
              if (isRecurring) {
                response += `\nRecurrence: ${params.recurrence.frequency}`;
              }

              return response;
            } catch (e) {
              this.super.handlerProps.log(
                `gcal-create-event error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating event: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
