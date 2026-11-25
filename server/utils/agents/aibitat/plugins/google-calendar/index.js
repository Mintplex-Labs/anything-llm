const { GCalListCalendars } = require("./calendars/gcal-list-calendars.js");
const { GCalGetCalendar } = require("./calendars/gcal-get-calendar.js");
const { GCalGetEvent } = require("./events/gcal-get-event.js");
const { GCalGetEventsForDay } = require("./events/gcal-get-events-for-day.js");
const { GCalGetEvents } = require("./events/gcal-get-events.js");
const {
  GCalGetUpcomingEvents,
} = require("./events/gcal-get-upcoming-events.js");
const { GCalQuickAdd } = require("./events/gcal-quick-add.js");
const { GCalCreateEvent } = require("./events/gcal-create-event.js");
const { GCalUpdateEvent } = require("./events/gcal-update-event.js");
const { GCalSetMyStatus } = require("./events/gcal-set-my-status.js");

const googleCalendarAgent = {
  name: "google-calendar-agent",
  startupConfig: {
    params: {},
  },
  plugin: [
    // Calendars (read-only)
    GCalListCalendars,
    GCalGetCalendar,

    // Events - Read (read-only)
    GCalGetEvent,
    GCalGetEventsForDay,
    GCalGetEvents,
    GCalGetUpcomingEvents,

    // Events - Write (modifying)
    GCalQuickAdd,
    GCalCreateEvent,
    GCalUpdateEvent,
    GCalSetMyStatus,
  ],
};

module.exports = {
  googleCalendarAgent,
};
