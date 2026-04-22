const googleCalendarLib = require("../lib.js");

/**
 * Helper to compute date ranges for common time periods.
 * @param {string} period - "today", "week", or "month"
 * @returns {{startDate: string, endDate: string, label: string}}
 */
function getDateRangeForPeriod(period) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startDate, endDate, label;

  switch (period.toLowerCase()) {
    case "today":
      startDate = new Date(today);
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
      label = "today";
      break;

    case "tomorrow":
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() + 1);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      label = "tomorrow";
      break;

    case "week":
    case "this week":
      startDate = new Date(today);
      endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 7);
      endDate.setHours(23, 59, 59, 999);
      label = "the next 7 days";
      break;

    case "next week":
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() + 7);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      endDate.setHours(23, 59, 59, 999);
      label = "next week";
      break;

    case "month":
    case "this month":
      startDate = new Date(today);
      endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);
      label = "the next 30 days";
      break;

    case "next month":
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() + 30);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);
      label = "next month";
      break;

    default:
      throw new Error(
        `Invalid period: "${period}". Use "today", "tomorrow", "week", "this week", "next week", "month", "this month", or "next month".`
      );
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    label,
  };
}

module.exports.GCalGetUpcomingEvents = {
  name: "gcal-get-upcoming-events",
  plugin: function () {
    return {
      name: "gcal-get-upcoming-events",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get upcoming calendar events using simple time period keywords. " +
            "This is the preferred tool for common queries like 'what's on my calendar today?' " +
            "Supports periods: 'today', 'tomorrow', 'week' (next 7 days), 'month' (next 30 days), " +
            "'next week', and 'next month'. " +
            "Automatically calculates the correct date range so you don't need to know the current date.",
          examples: [
            {
              prompt: "What's on my calendar today?",
              call: JSON.stringify({ period: "today" }),
            },
            {
              prompt: "What meetings do I have this week?",
              call: JSON.stringify({ period: "week", query: "meeting" }),
            },
            {
              prompt: "Show me my schedule for the month",
              call: JSON.stringify({ period: "month", limit: 50 }),
            },
            {
              prompt: "What do I have tomorrow?",
              call: JSON.stringify({ period: "tomorrow" }),
            },
            {
              prompt: "Find all project events next week",
              call: JSON.stringify({ period: "next week", query: "project" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              period: {
                type: "string",
                description:
                  "Time period to query. Options: 'today', 'tomorrow', 'week' (next 7 days), 'this week', 'next week', 'month' (next 30 days), 'this month', 'next month'.",
                enum: [
                  "today",
                  "tomorrow",
                  "week",
                  "this week",
                  "next week",
                  "month",
                  "this month",
                  "next month",
                ],
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
            required: ["period"],
            additionalProperties: false,
          },
          handler: async function ({ period, query, calendarId, limit = 25 }) {
            try {
              this.super.handlerProps.log(
                `Using the gcal-get-upcoming-events tool.`
              );

              const { startDate, endDate, label } =
                getDateRangeForPeriod(period);

              this.super.introspect(
                `${this.caller}: Fetching events for ${label}${query ? ` matching "${query}"` : ""}...`
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
                `${this.caller}: Found ${totalEvents} event(s) for ${label}`
              );

              if (totalEvents === 0) {
                return `No events scheduled for ${label}${query ? ` matching "${query}"` : ""}.`;
              }

              const summaries = [];
              const citations = [];
              events.forEach((event, i) => {
                let timeStr;
                if (event.isAllDayEvent) {
                  timeStr = `All day (${new Date(event.startDate).toLocaleDateString()})`;
                } else {
                  const startTime = new Date(event.startTime);
                  const endTime = new Date(event.endTime);
                  const dateStr = startTime.toLocaleDateString();
                  const startTimeStr = startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const endTimeStr = endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  timeStr = `${dateStr} ${startTimeStr} - ${endTimeStr}`;
                }
                const eventDetails =
                  `${i + 1}. "${event.title}"\n` +
                  `   ${timeStr}\n` +
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

              let response = `Events for ${label}`;
              if (returnedEvents < totalEvents) {
                response += ` (${returnedEvents} of ${totalEvents})`;
              } else {
                response += ` (${totalEvents} total)`;
              }
              response += `:\n\n${summary}`;

              return response;
            } catch (e) {
              this.super.handlerProps.log(
                `gcal-get-upcoming-events error: ${e.message}`
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
