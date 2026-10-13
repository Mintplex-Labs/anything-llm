/**
 * UTC offset in minutes for a given IANA timezone at a specific instant.
 * Throws RangeError if `timeZone` is not a valid IANA identifier.
 * @param {string} timeZone
 * @param {Date} [at]
 * @returns {number} Minutes to add to UTC to get wall-clock time in the zone.
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
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    p.hour === "24" ? 0 : Number(p.hour),
    Number(p.minute),
    Number(p.second)
  );
  return Math.round((asUTC - at.getTime()) / 60000);
}

const WEEKDAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/**
 * Expand a cron minute or hour field into its sorted values. Supports numbers,
 * ranges, steps and lists of those.
 * @param {string} field
 * @param {number} min
 * @param {number} max
 * @returns {number[]|null} null when the field has any other syntax or a value outside min-max.
 */
function expandField(field, min, max) {
  const values = new Set();
  for (const part of field.split(",")) {
    const match = /^(?:\*|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(part);
    if (!match) return null;
    const [, from, to, step] = match;
    let start = min;
    let end = max;
    if (from !== undefined) {
      start = Number(from);
      end = to !== undefined ? Number(to) : step !== undefined ? max : start;
    }
    const increment = step !== undefined ? Number(step) : 1;
    if (start < min || end > max || start > end || increment < 1) return null;
    for (let v = start; v <= end; v += increment) values.add(v);
  }
  return [...values].sort((a, b) => a - b);
}

/**
 * Write sorted values back as a cron field: "*", a step, or a list of
 * numbers and ranges.
 * @param {number[]} values
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
function compressField(values, min, max) {
  if (values.length === max - min + 1) return "*";
  const step = values[1] - values[0];
  if (
    values.length >= 3 &&
    step > 1 &&
    values.every((v, i) => v === values[0] + i * step)
  ) {
    const last = values[values.length - 1];
    return values[0] === min && last + step > max
      ? `*/${step}`
      : `${values[0]}-${last}/${step}`;
  }
  const parts = [];
  for (let i = 0; i < values.length; ) {
    let j = i;
    while (values[j + 1] === values[j] + 1) j++;
    if (j - i >= 2) parts.push(`${values[i]}-${values[j]}`);
    else for (let k = i; k <= j; k++) parts.push(String(values[k]));
    i = j + 1;
  }
  return parts.join(",");
}

/**
 * Move a day-of-month field by whole days. Only a single day moves, and only
 * when both the old and the new day are within 1-28, which every month has.
 * Other values stay as they are.
 */
function shiftDayOfMonth(dom, dayShift) {
  const shifted = Number(dom) + dayShift;
  return /^\d+$/.test(dom) &&
    Math.min(Number(dom), shifted) >= 1 &&
    Math.max(Number(dom), shifted) <= 28
    ? String(shifted)
    : dom;
}

/**
 * Move a weekday field by whole days. Weekday lists and ranges ("1-5", "0,6",
 * "MON-FRI") become an explicit shifted list. Other values stay as they are.
 */
function shiftWeekdays(dow, dayShift) {
  const numericDow = dow.replace(
    /[a-z]+/gi,
    // Unknown names become -1, which fails the pattern check below.
    (name) => WEEKDAY_NAMES.indexOf(name.toUpperCase())
  );
  if (!/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(numericDow)) return dow;
  const days = new Set();
  for (const part of numericDow.split(",")) {
    const [from, to = from] = part.split("-").map(Number);
    for (let d = from; d <= to; d++) days.add((((d + dayShift) % 7) + 7) % 7);
  }
  return [...days].sort((a, b) => a - b).join(",");
}

/**
 * Move every run of a 5-field cron expression by a number of minutes.
 *
 * Cron runs at every combination of its minute and hour values, so the moved
 * runs must form such a combination too. In zones with a 30 or 45 minute
 * offset, "0,30 9-17 * * *" does not: its :00 and :30 runs land in different
 * sets of hours. Runs that cross midnight also need the day fields to move by
 * the same number of days, which is impossible when some runs cross and some
 * do not (e.g. "0 * * * 1"). Both cases return null.
 *
 * Month fields never move. Day fields move by the rules of shiftDayOfMonth
 * and shiftWeekdays.
 *
 * @param {string} cron - 5-field cron expression.
 * @param {number} shiftMinutes - Minutes to add to every run.
 * @returns {string|null} The moved expression, the input unchanged when it is
 *   not a 5-field string, or null when no single expression has the moved runs.
 */
function shiftCron(cron, shiftMinutes) {
  if (!cron || typeof cron !== "string") return cron;
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return cron;

  const [minute, hour, dom, month, dow] = parts;
  const minutes = expandField(minute, 0, 59);
  const hours = expandField(hour, 0, 23);
  if (!minutes || !hours) return null;

  const movedMinutes = new Set();
  const movedHours = new Set();
  const dayShifts = new Set();
  for (const h of hours) {
    for (const m of minutes) {
      const total = h * 60 + m + shiftMinutes;
      const minuteOfDay = ((total % 1440) + 1440) % 1440;
      movedHours.add(Math.floor(minuteOfDay / 60));
      movedMinutes.add(minuteOfDay % 60);
      dayShifts.add(Math.floor(total / 1440));
    }
  }

  // Every run moves to a distinct minute of the day, so the moved runs fill
  // all hour/minute combinations exactly when the counts match.
  if (movedHours.size * movedMinutes.size !== hours.length * minutes.length)
    return null;

  const daysRestricted = !["*", "?"].includes(dom) || !["*", "?"].includes(dow);
  if (dayShifts.size > 1 && daysRestricted) return null;
  const dayShift = dayShifts.size === 1 ? [...dayShifts][0] : 0;

  // Keep the original text of a field whose values did not change.
  const rewrite = (field, values, moved, max) =>
    values.length === moved.size && values.every((v) => moved.has(v))
      ? field
      : compressField(
          [...moved].sort((a, b) => a - b),
          0,
          max
        );

  return [
    rewrite(minute, minutes, movedMinutes, 59),
    rewrite(hour, hours, movedHours, 23),
    dayShift ? shiftDayOfMonth(dom, dayShift) : dom,
    month,
    dayShift ? shiftWeekdays(dow, dayShift) : dow,
  ].join(" ");
}

/**
 * Convert a 5-field cron expression from a user's local timezone to UTC,
 * using the zone's current offset.
 *
 * @param {string} cron  - 5-field cron expression in local time.
 * @param {string} timeZone - IANA timezone (e.g. "America/New_York").
 * @returns {string|null} 5-field cron expression in UTC, or null when no
 *   single UTC expression runs at the same times (see shiftCron).
 */
function convertCronLocalToUtc(cron, timeZone) {
  if (!cron || typeof cron !== "string") return cron;
  return shiftCron(cron, -tzOffsetMinutes(timeZone));
}

/**
 * Flatten the Scheduled Jobs tool catalog into a single Set of valid tool IDs.
 * @param {Awaited<ReturnType<import('../../../../../models/scheduledJob').ScheduledJob.availableTools>>} catalog
 * @returns {Set<string>}
 */
function catalogIdSet(catalog) {
  const ids = new Set();
  for (const category of catalog) {
    for (const item of category.items || []) ids.add(item.id);
  }
  return ids;
}

/**
 * Filter the catalog down to tools that are configured and ready to use,
 * dropping anything still requiring setup (e.g. Gmail/Calendar/Outlook with no
 * credentials, SQL with no connection). This mirrors the manual Scheduled Jobs
 * UI, which disables selection of `requiresSetup` tools. A tool is treated as
 * not-ready if either the item or its category is flagged `requiresSetup`.
 */
function readyToolsCatalog(catalog) {
  return catalog
    .map((category) => ({
      ...category,
      items: (category.items || []).filter(
        (item) => !item.requiresSetup && !category.requiresSetup
      ),
    }))
    .filter((category) => category.items.length > 0);
}

/**
 * Render the tool catalog as a readable, grouped text block for the agent.
 * @param {ReturnType<typeof readyToolsCatalog>} catalog
 * @returns {string}
 */
function renderCatalog(catalog) {
  if (!catalog?.length) return "No tools are available for scheduled jobs.";
  return catalog
    .map((category) => {
      const lines = (category.items || []).map((item) => {
        const setup = item.requiresSetup ? " [requires setup]" : "";
        const desc = item.description ? ` - ${item.description}` : "";
        return `  - ${item.id}${setup}${desc}`;
      });
      return `${category.name}:\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

/**
 * Build an actionable correction message when the agent passes tool IDs that
 * can't be used. Separates tools that exist but still need setup from IDs that
 * don't exist at all, then lists the ready-to-use catalog to choose from.
 * @param {string[]} rejected
 * @param {ReturnType<typeof readyToolsCatalog>} fullCatalog
 * @param {ReturnType<typeof readyToolsCatalog>} readyCatalog
 * @returns {string}
 */
function rejectedToolsMessage(rejected, fullCatalog, readyCatalog) {
  const allIds = catalogIdSet(fullCatalog);
  const needsSetup = rejected.filter((id) => allIds.has(id));
  const unknown = rejected.filter((id) => !allIds.has(id));

  const lines = [];
  if (needsSetup.length > 0)
    lines.push(
      `These tools exist but are not configured yet, so they can't be added to a job: ${needsSetup.join(
        ", "
      )}. The user must set them up first in Settings > Agent Skills.`
    );
  if (unknown.length > 0)
    lines.push(`These tool IDs are not valid: ${unknown.join(", ")}.`);

  return `${lines.join(
    "\n"
  )}\n\nCall this tool with \`listTools: true\` to see valid IDs, or choose only from these ready-to-use tools:\n\n${renderCatalog(
    readyCatalog
  )}`;
}

module.exports = {
  shiftCron,
  convertCronLocalToUtc,
  catalogIdSet,
  readyToolsCatalog,
  renderCatalog,
  rejectedToolsMessage,
};
