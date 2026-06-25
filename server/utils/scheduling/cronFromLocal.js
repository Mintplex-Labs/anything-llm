// Server-side local-time -> UTC cron builder for Scheduled Jobs.
//
// Scheduled jobs store their cron expression in UTC (`@breejs/later` is
// configured with `later.date.UTC()`), and the Scheduled Jobs frontend builder
// converts the user's local time to UTC via the browser's `moment()`. When the
// agent creates a job from chat we are server-side, where `moment().local()`
// reflects the SERVER timezone, not the user's. The server also does not ship
// `moment-timezone`/`luxon`, so we compute the target timezone's current UTC
// offset using the built-in `Intl.DateTimeFormat` and convert deterministically.
//
// This module intentionally emits ONLY the five cron shapes the frontend visual
// builder produces (see frontend/.../ScheduledJobs/utils/cron.js
// `buildCronFromBuilderState`). Keeping the shapes identical means agent-created
// jobs reverse-parse cleanly in the visual builder (no `wasFallback` warning).
//
// Known limitations (intentionally matched to the existing frontend behavior):
//   - DST: the offset is computed for "now", not for each future fire time, so a
//     schedule can drift by an hour across a DST boundary. This is identical to
//     the frontend's `moment()`-at-creation behavior and is accepted.
//   - Weekday rollover: when local->UTC pushes the hour across midnight, the
//     weekday list is NOT shifted. This mirrors the frontend builder exactly.

/**
 * Offset in minutes to ADD to a UTC instant to get the wall-clock time in
 * `timeZone`, computed at `at` (defaults to now). Negative for zones behind UTC.
 * Throws a RangeError if `timeZone` is not a valid IANA name (used as validation).
 * @param {string} timeZone - IANA timezone name (e.g. "America/New_York").
 * @param {Date} [at] - The instant at which to compute the offset.
 * @returns {number} Offset in minutes.
 */
function tzOffsetMinutes(timeZone, at = new Date()) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(
    dtf.formatToParts(at).map((part) => [part.type, part.value])
  );
  // Build a UTC timestamp from the wall-clock parts the zone reports for `at`.
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    // Intl can report hour "24" at midnight; normalize to 0.
    p.hour === "24" ? 0 : Number(p.hour),
    Number(p.minute),
    Number(p.second)
  );
  return Math.round((asUTC - at.getTime()) / 60000);
}

/**
 * Convert a local hour/minute in `timeZone` to the equivalent UTC hour/minute.
 * Mirrors the frontend `localTimeToUTC` semantics.
 * @param {number} localHour - Hour in local time (0-23).
 * @param {number} localMinute - Minute (0-59).
 * @param {string} timeZone - IANA timezone name.
 * @returns {{ hour: number, minute: number }} Hour and minute in UTC.
 */
function localToUtcHM(localHour, localMinute, timeZone) {
  const offset = tzOffsetMinutes(timeZone); // minutes to add to UTC for local time
  let total = localHour * 60 + localMinute - offset; // local -> UTC
  total = ((total % 1440) + 1440) % 1440; // wrap into [0, 1440)
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/**
 * Build a 5-field UTC cron expression from a structured local-time schedule.
 * Emits only the shapes the frontend visual builder produces so the job stays
 * visually editable.
 *
 * @param {Object} s
 * @param {"minute"|"hour"|"day"|"week"|"month"} s.frequency
 * @param {number} [s.minuteInterval] - For frequency=minute: run every N minutes.
 * @param {number} [s.minute] - Minute of the hour (frequency hour/day/week/month).
 * @param {number} [s.hour] - LOCAL hour in s.timezone (frequency day/week/month).
 * @param {number[]} [s.weekdays] - For frequency=week: 0=Sun..6=Sat.
 * @param {number} [s.dayOfMonth] - For frequency=month: 1-31.
 * @param {string} [s.timezone] - IANA timezone for hour/minute conversion.
 * @returns {string} A 5-field UTC cron expression.
 */
function buildUtcCronFromSchedule(s = {}) {
  const minute = Number.isInteger(s.minute) ? s.minute : 0;
  switch (s.frequency) {
    case "minute": {
      const n = s.minuteInterval || 1;
      // No timezone conversion needed - minute frequencies have no wall-clock hour.
      return n === 1 ? "* * * * *" : `*/${n} * * * *`;
    }
    case "hour":
      // At minute M of every hour. No timezone conversion needed.
      return `${minute} * * * *`;
    case "day": {
      const utc = localToUtcHM(s.hour, minute, s.timezone);
      return `${utc.minute} ${utc.hour} * * *`;
    }
    case "week": {
      const utc = localToUtcHM(s.hour, minute, s.timezone);
      // NOTE: weekday list is intentionally NOT shifted when the hour crosses
      // midnight in UTC - this matches the frontend builder behavior exactly.
      const days = [...new Set(s.weekdays?.length ? s.weekdays : [1])]
        .map((d) => ((d % 7) + 7) % 7)
        .sort((a, b) => a - b)
        .join(",");
      return `${utc.minute} ${utc.hour} * * ${days}`;
    }
    case "month": {
      const utc = localToUtcHM(s.hour, minute, s.timezone);
      return `${utc.minute} ${utc.hour} ${s.dayOfMonth || 1} * *`;
    }
    default:
      throw new Error(`Unsupported schedule frequency: ${s.frequency}`);
  }
}

module.exports = { tzOffsetMinutes, localToUtcHM, buildUtcCronFromSchedule };
