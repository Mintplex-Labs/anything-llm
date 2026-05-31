import cronstrue from "cronstrue/i18n";
import moment from "moment";

/**
 * Convert a local hour and minute to UTC using moment.js.
 * Handles DST and timezone edge cases properly.
 * @param {number} localHour - Hour in local time (0-23).
 * @param {number} localMinute - Minute (0-59).
 * @returns {{ hour: number, minute: number }} Hour and minute in UTC.
 */
export function localTimeToUTC(localHour, localMinute = 0) {
  const local = moment().hour(localHour).minute(localMinute).second(0);
  const utc = local.clone().utc();
  return { hour: utc.hour(), minute: utc.minute() };
}

/**
 * Convert a UTC hour and minute to local time using moment.js.
 * Handles DST and timezone edge cases properly.
 * @param {number} utcHour - Hour in UTC (0-23).
 * @param {number} utcMinute - Minute (0-59).
 * @returns {{ hour: number, minute: number }} Hour and minute in local time.
 */
export function utcTimeToLocal(utcHour, utcMinute = 0) {
  const utc = moment.utc().hour(utcHour).minute(utcMinute).second(0);
  const local = utc.clone().local();
  return { hour: local.hour(), minute: local.minute() };
}

/**
 * Get the user's timezone abbreviation for display.
 * @returns {string} Timezone abbreviation (e.g., "PST", "EST", "UTC").
 */
export function getTimezoneAbbreviation() {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value || "local time";
  } catch {
    return "local time";
  }
}

/**
 * Humanize a cron expression for display in the user's local timezone.
 * The cron is stored in UTC, so we convert it to local time for display.
 * @param {string} cron - The cron expression (in UTC).
 * @param {string} locale - The locale.
 * @returns {string} The humanized cron expression with timezone indicator.
 */
export function humanizeCron(cron, locale) {
  if (!cron) return "";
  try {
    const localCron = convertCronToLocalTime(cron);
    const humanized = cronstrue.toString(localCron, {
      throwExceptionOnParseError: false,
      locale: toCronstrueLocale(locale),
    });
    return `${humanized} ${getTimezoneAbbreviation()}`;
  } catch {
    return cron;
  }
}

/**
 * Convert a UTC cron expression to local time for display purposes.
 * Only converts the hour field for patterns that have a specific hour.
 * @param {string} cron - The cron expression in UTC.
 * @returns {string} The cron expression adjusted to local time.
 */
function convertCronToLocalTime(cron) {
  if (!cron || typeof cron !== "string") return cron;
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return cron;

  const [minute, hour, dom, mon, dow] = parts;

  // Only convert if hour is a specific number (not * or */n)
  if (/^\d+$/.test(hour) && /^\d+$/.test(minute)) {
    const local = utcTimeToLocal(parseInt(hour, 10), parseInt(minute, 10));
    return `${local.minute} ${local.hour} ${dom} ${mon} ${dow}`;
  }

  return cron;
}

/**
 * Convert a locale code to a cronstrue locale code.
 * i18next uses BCP-47-ish codes like "zh-tw"; cronstrue's i18n bundle
 * uses "zh_TW". Convert "xx-yy" → "xx_YY" so region-tagged locales resolve
 * instead of silently falling back to English.
 * @param {string} locale - The locale code.
 * @returns {string} The cronstrue locale code.
 */
function toCronstrueLocale(locale) {
  if (!locale) return undefined;
  const [lang, region] = locale.split("-");
  return region ? `${lang}_${region.toUpperCase()}` : lang;
}

/**
 * Default state for the visual builder. Used when an incoming cron expression
 * cannot be reverse-parsed into one of the builder's supported shapes.
 * @returns {Object} The default builder state.
 */
export const DEFAULT_BUILDER_STATE = {
  frequency: "day",
  minuteInterval: 1,
  hourMinuteOffset: 0,
  hour: 9,
  minute: 0,
  weekdays: [1],
  dayOfMonth: 1,
};

/**
 * Parse a 5-field cron expression into the visual builder's state shape.
 * Only recognizes the patterns the builder itself can produce; anything else
 * (ranges, step values in non-minute fields, multiple months, etc.) is
 * reported with `wasFallback: true` so the UI can warn the user that the
 * stored expression cannot be edited visually.
 *
 * IMPORTANT: The cron expression is stored in UTC on the backend. This function
 * converts the hour to local time so the builder shows the user's local time.
 *
 * Returns: { state, wasFallback }
 * @param {string} cron - The cron expression (in UTC).
 * @returns {Object} The builder state (with hours in local time).
 */
export function parseCronToBuilderState(cron) {
  const fallback = { state: { ...DEFAULT_BUILDER_STATE }, wasFallback: true };
  if (!cron || typeof cron !== "string") return fallback;
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return fallback;
  const [m, h, dom, mon, dow] = parts;
  if (mon !== "*") return fallback;

  // Every minute
  if (m === "*" && h === "*" && dom === "*" && dow === "*") {
    return {
      state: {
        ...DEFAULT_BUILDER_STATE,
        frequency: "minute",
        minuteInterval: 1,
      },
      wasFallback: false,
    };
  }

  // Every N minutes
  const stepMatch = m.match(/^\*\/(\d+)$/);
  if (stepMatch && h === "*" && dom === "*" && dow === "*") {
    return {
      state: {
        ...DEFAULT_BUILDER_STATE,
        frequency: "minute",
        minuteInterval: parseInt(stepMatch[1], 10),
      },
      wasFallback: false,
    };
  }

  // Hourly at minute X
  if (/^\d+$/.test(m) && h === "*" && dom === "*" && dow === "*") {
    return {
      state: {
        ...DEFAULT_BUILDER_STATE,
        frequency: "hour",
        hourMinuteOffset: parseInt(m, 10),
      },
      wasFallback: false,
    };
  }

  // Daily at H:M - convert UTC to local
  if (/^\d+$/.test(m) && /^\d+$/.test(h) && dom === "*" && dow === "*") {
    const local = utcTimeToLocal(parseInt(h, 10), parseInt(m, 10));
    return {
      state: {
        ...DEFAULT_BUILDER_STATE,
        frequency: "day",
        hour: local.hour,
        minute: local.minute,
      },
      wasFallback: false,
    };
  }

  // Weekly on one or more weekdays at H:M - convert UTC to local
  if (
    /^\d+$/.test(m) &&
    /^\d+$/.test(h) &&
    dom === "*" &&
    /^\d+(,\d+)*$/.test(dow)
  ) {
    const days = [
      ...new Set(
        dow
          .split(",")
          .map((d) => parseInt(d, 10) % 7)
          .filter((d) => d >= 0 && d <= 6)
      ),
    ];
    const local = utcTimeToLocal(parseInt(h, 10), parseInt(m, 10));
    return {
      state: {
        ...DEFAULT_BUILDER_STATE,
        frequency: "week",
        hour: local.hour,
        minute: local.minute,
        weekdays: days.length ? days : [1],
      },
      wasFallback: false,
    };
  }

  // Monthly on day D at H:M - convert UTC to local
  if (/^\d+$/.test(m) && /^\d+$/.test(h) && /^\d+$/.test(dom) && dow === "*") {
    const local = utcTimeToLocal(parseInt(h, 10), parseInt(m, 10));
    return {
      state: {
        ...DEFAULT_BUILDER_STATE,
        frequency: "month",
        hour: local.hour,
        minute: local.minute,
        dayOfMonth: parseInt(dom, 10),
      },
      wasFallback: false,
    };
  }

  return fallback;
}

/**
 * Build a 5-field cron expression from the visual builder's state.
 *
 * IMPORTANT: The builder state has hours in local time. This function
 * converts the time to UTC before building the cron expression, since
 * the backend stores and executes cron expressions in UTC.
 *
 * @param {Object} state - The builder state (with time in local timezone).
 * @returns {string} The cron expression (in UTC).
 */
export function buildCronFromBuilderState(state) {
  switch (state.frequency) {
    case "minute": {
      const n = state.minuteInterval || 1;
      return n === 1 ? "* * * * *" : `*/${n} * * * *`;
    }
    case "hour":
      return `${state.hourMinuteOffset} * * * *`;
    case "day": {
      const utc = localTimeToUTC(state.hour, state.minute);
      return `${utc.minute} ${utc.hour} * * *`;
    }
    case "week": {
      const utc = localTimeToUTC(state.hour, state.minute);
      const days = (state.weekdays?.length ? state.weekdays : [1])
        .slice()
        .sort((a, b) => a - b)
        .join(",");
      return `${utc.minute} ${utc.hour} * * ${days}`;
    }
    case "month": {
      const utc = localTimeToUTC(state.hour, state.minute);
      return `${utc.minute} ${utc.hour} ${state.dayOfMonth} * *`;
    }
    default: {
      const utc = localTimeToUTC(9, 0);
      return `${utc.minute} ${utc.hour} * * *`;
    }
  }
}
