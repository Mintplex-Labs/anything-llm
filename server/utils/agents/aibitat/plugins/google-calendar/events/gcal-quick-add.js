const googleCalendarLib = require("../lib.js");

module.exports.GCalQuickAdd = {
  name: "gcal-quick-add",
  plugin: function () {
    return {
      name: "gcal-quick-add",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a calendar event from a natural language description. " +
            "Google Calendar will parse the description to extract the event title, date, and time. " +
            "Examples: 'Meeting with John tomorrow at 3pm', 'Dentist appointment on Friday at 10am'.",
          examples: [
            {
              prompt: "Add a meeting with John tomorrow at 3pm",
              call: JSON.stringify({
                description: "Meeting with John tomorrow at 3pm",
              }),
            },
            {
              prompt: "Schedule lunch with Sarah next Tuesday at noon",
              call: JSON.stringify({
                description: "Lunch with Sarah next Tuesday at noon",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              description: {
                type: "string",
                description:
                  "Natural language description of the event including title, date, and time.",
              },
              calendarId: {
                type: "string",
                description:
                  "Optional calendar ID. If omitted, uses the primary calendar.",
              },
            },
            required: ["description"],
            additionalProperties: false,
          },
          handler: async function ({ description, calendarId }) {
            try {
              this.super.handlerProps.log(`Using the gcal-quick-add tool.`);

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    description,
                    calendarId,
                  },
                  description: `Create calendar event from: "${description}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Creating event from "${description}"...`
              );

              const result = await googleCalendarLib.quickAdd(
                description,
                calendarId
              );

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to create event - ${result.error}`
                );
                return `Error creating event: ${result.error}`;
              }

              const event = result.data.event;
              this.super.introspect(
                `${this.caller}: Created event "${event.title}"`
              );

              let timeInfo;
              if (event.isAllDayEvent) {
                timeInfo = `All-day event on ${new Date(event.startDate).toLocaleDateString()}`;
              } else {
                timeInfo = `${new Date(event.startTime).toLocaleString()} - ${new Date(event.endTime).toLocaleString()}`;
              }

              return (
                `Event created successfully!\n\n` +
                `Title: ${event.title}\n` +
                `${timeInfo}\n` +
                `Event ID: ${event.eventId}\n` +
                `Calendar ID: ${event.calendarId}`
              );
            } catch (e) {
              this.super.handlerProps.log(`gcal-quick-add error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating event: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
