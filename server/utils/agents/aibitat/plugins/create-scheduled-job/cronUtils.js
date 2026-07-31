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

/**
 * Convert a local hour + minute to UTC hour + minute for a given IANA timezone.
 * @param {number} localHour
 * @param {number} localMinute
 * @param {string} timeZone
 * @returns {{ hour: number, minute: number }}
 */
function localToUtcHM(localHour, localMinute, timeZone) {
  const offset = tzOffsetMinutes(timeZone);
  let total = localHour * 60 + localMinute - offset;
  total = ((total % 1440) + 1440) % 1440;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/**
 * Convert the hour/minute fields of a 5-field cron expression from a user's
 * local timezone to UTC. Returns the original string unchanged if the pattern
 * has no specific hour (e.g. every-minute or every-N-hours schedules).
 *
 * @param {string} cron  - 5-field cron expression in local time.
 * @param {string} timeZone - IANA timezone (e.g. "America/New_York").
 * @returns {string} 5-field cron expression in UTC.
 */
function convertCronLocalToUtc(cron, timeZone) {
  if (!cron || typeof cron !== "string") return cron;
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return cron;

  const [minute, hour, dom, month, dow] = parts;

  // Only shift when both fields are plain integers (specific time, not a wildcard/step).
  if (!/^\d+$/.test(minute) || !/^\d+$/.test(hour)) return cron;

  const utc = localToUtcHM(Number(hour), Number(minute), timeZone);
  return `${utc.minute} ${utc.hour} ${dom} ${month} ${dow}`;
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
  convertCronLocalToUtc,
  catalogIdSet,
  readyToolsCatalog,
  renderCatalog,
  rejectedToolsMessage,
};
