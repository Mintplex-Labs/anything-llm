const googleCalendarLib = require("../lib.js");

module.exports.GCalSetMyStatus = {
  name: "gcal-set-my-status",
  plugin: function () {
    return {
      name: "gcal-set-my-status",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Set your RSVP status for a calendar event. " +
            "Use this to accept, decline, or tentatively accept meeting invitations.",
          examples: [
            {
              prompt: "Accept the meeting invitation for event abc123",
              call: JSON.stringify({ eventId: "abc123", status: "YES" }),
            },
            {
              prompt: "Decline event xyz789",
              call: JSON.stringify({ eventId: "xyz789", status: "NO" }),
            },
            {
              prompt: "Mark myself as maybe for event def456",
              call: JSON.stringify({ eventId: "def456", status: "MAYBE" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              eventId: {
                type: "string",
                description: "The ID of the event to RSVP to.",
              },
              status: {
                type: "string",
                enum: ["YES", "NO", "MAYBE", "INVITED"],
                description:
                  "Your RSVP status: YES (accept), NO (decline), MAYBE (tentative), or INVITED (reset to invited).",
              },
              calendarId: {
                type: "string",
                description:
                  "Optional calendar ID. If omitted, uses the primary calendar.",
              },
            },
            required: ["eventId", "status"],
            additionalProperties: false,
          },
          handler: async function ({ eventId, status, calendarId }) {
            try {
              this.super.handlerProps.log(`Using the gcal-set-my-status tool.`);

              const statusActions = {
                YES: "accept",
                NO: "decline",
                MAYBE: "tentatively accept",
                INVITED: "reset to invited",
              };

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    eventId,
                    status,
                  },
                  description: `Set RSVP status to ${status} (${statusActions[status] || status}) for event ${eventId}`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Setting RSVP status to ${status} for event ${eventId}...`
              );

              const result = await googleCalendarLib.setMyStatus(
                eventId,
                status,
                calendarId
              );

              if (!result.success) {
                this.super.introspect(
                  `${this.caller}: Failed to set status - ${result.error}`
                );
                return `Error setting RSVP status: ${result.error}`;
              }

              this.super.introspect(
                `${this.caller}: RSVP status set to ${result.data.newStatus}`
              );

              const statusMessages = {
                YES: "accepted",
                NO: "declined",
                MAYBE: "marked as tentative",
                INVITED: "reset to invited",
              };

              return (
                `RSVP status updated!\n\n` +
                `Event ID: ${result.data.eventId}\n` +
                `Status: ${result.data.newStatus} (${statusMessages[result.data.newStatus] || result.data.newStatus})`
              );
            } catch (e) {
              this.super.handlerProps.log(
                `gcal-set-my-status error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error setting RSVP status: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
