import {
  CalendarBlank,
  CalendarCheck,
  CalendarPlus,
  UserCircleGear,
} from "@phosphor-icons/react";
export { filterSkillCategories } from "../utils";

export const getGoogleCalendarSkills = (t) => ({
  calendars: {
    title: t("agent.skill.googleCalendar.categories.calendars.title"),
    description: t(
      "agent.skill.googleCalendar.categories.calendars.description"
    ),
    icon: CalendarBlank,
    skills: [
      {
        name: "gcal-list-calendars",
        title: t("agent.skill.googleCalendar.skills.listCalendars.title"),
        description: t(
          "agent.skill.googleCalendar.skills.listCalendars.description"
        ),
      },
      {
        name: "gcal-get-calendar",
        title: t("agent.skill.googleCalendar.skills.getCalendar.title"),
        description: t(
          "agent.skill.googleCalendar.skills.getCalendar.description"
        ),
      },
    ],
  },
  readEvents: {
    title: t("agent.skill.googleCalendar.categories.readEvents.title"),
    description: t(
      "agent.skill.googleCalendar.categories.readEvents.description"
    ),
    icon: CalendarCheck,
    skills: [
      {
        name: "gcal-get-event",
        title: t("agent.skill.googleCalendar.skills.getEvent.title"),
        description: t(
          "agent.skill.googleCalendar.skills.getEvent.description"
        ),
      },
      {
        name: "gcal-get-events-for-day",
        title: t("agent.skill.googleCalendar.skills.getEventsForDay.title"),
        description: t(
          "agent.skill.googleCalendar.skills.getEventsForDay.description"
        ),
      },
      {
        name: "gcal-get-events",
        title: t("agent.skill.googleCalendar.skills.getEvents.title"),
        description: t(
          "agent.skill.googleCalendar.skills.getEvents.description"
        ),
      },
      {
        name: "gcal-get-upcoming-events",
        title: t("agent.skill.googleCalendar.skills.getUpcomingEvents.title"),
        description: t(
          "agent.skill.googleCalendar.skills.getUpcomingEvents.description"
        ),
      },
    ],
  },
  writeEvents: {
    title: t("agent.skill.googleCalendar.categories.writeEvents.title"),
    description: t(
      "agent.skill.googleCalendar.categories.writeEvents.description"
    ),
    icon: CalendarPlus,
    skills: [
      {
        name: "gcal-quick-add",
        title: t("agent.skill.googleCalendar.skills.quickAdd.title"),
        description: t(
          "agent.skill.googleCalendar.skills.quickAdd.description"
        ),
      },
      {
        name: "gcal-create-event",
        title: t("agent.skill.googleCalendar.skills.createEvent.title"),
        description: t(
          "agent.skill.googleCalendar.skills.createEvent.description"
        ),
      },
      {
        name: "gcal-update-event",
        title: t("agent.skill.googleCalendar.skills.updateEvent.title"),
        description: t(
          "agent.skill.googleCalendar.skills.updateEvent.description"
        ),
      },
    ],
  },
  rsvp: {
    title: t("agent.skill.googleCalendar.categories.rsvp.title"),
    description: t("agent.skill.googleCalendar.categories.rsvp.description"),
    icon: UserCircleGear,
    skills: [
      {
        name: "gcal-set-my-status",
        title: t("agent.skill.googleCalendar.skills.setMyStatus.title"),
        description: t(
          "agent.skill.googleCalendar.skills.setMyStatus.description"
        ),
      },
    ],
  },
});
