import cronstrue from "cronstrue";

// Render a 5-field cron expression as plain English using cronstrue.
// Falls back to the raw expression if parsing fails.
export function humanizeCron(cron) {
  if (!cron) return "";
  try {
    return cronstrue.toString(cron, { throwExceptionOnParseError: false });
  } catch {
    return cron;
  }
}

// Default state for the visual builder. Used when an incoming cron expression
// cannot be reverse-parsed into one of the builder's supported shapes.
export const DEFAULT_BUILDER_STATE = {
  frequency: "day",
  minuteInterval: 1,
  hourMinuteOffset: 0,
  hour: 9,
  minute: 0,
  weekdays: [1],
  dayOfMonth: 1,
};

// Parse a 5-field cron expression into the visual builder's state shape.
// Only recognizes the patterns the builder itself can produce; anything else
// (ranges, step values in non-minute fields, multiple months, etc.) returns
// the default state so the builder still renders sensibly.
export function parseCronToBuilderState(cron) {
  if (!cron || typeof cron !== "string") return { ...DEFAULT_BUILDER_STATE };
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return { ...DEFAULT_BUILDER_STATE };
  const [m, h, dom, mon, dow] = parts;
  if (mon !== "*") return { ...DEFAULT_BUILDER_STATE };

  // Every minute
  if (m === "*" && h === "*" && dom === "*" && dow === "*") {
    return { ...DEFAULT_BUILDER_STATE, frequency: "minute", minuteInterval: 1 };
  }

  // Every N minutes
  const stepMatch = m.match(/^\*\/(\d+)$/);
  if (stepMatch && h === "*" && dom === "*" && dow === "*") {
    return {
      ...DEFAULT_BUILDER_STATE,
      frequency: "minute",
      minuteInterval: parseInt(stepMatch[1], 10),
    };
  }

  // Hourly at minute X
  if (/^\d+$/.test(m) && h === "*" && dom === "*" && dow === "*") {
    return {
      ...DEFAULT_BUILDER_STATE,
      frequency: "hour",
      hourMinuteOffset: parseInt(m, 10),
    };
  }

  // Daily at H:M
  if (/^\d+$/.test(m) && /^\d+$/.test(h) && dom === "*" && dow === "*") {
    return {
      ...DEFAULT_BUILDER_STATE,
      frequency: "day",
      hour: parseInt(h, 10),
      minute: parseInt(m, 10),
    };
  }

  // Weekly on one or more weekdays at H:M
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
    return {
      ...DEFAULT_BUILDER_STATE,
      frequency: "week",
      hour: parseInt(h, 10),
      minute: parseInt(m, 10),
      weekdays: days.length ? days : [1],
    };
  }

  // Monthly on day D at H:M
  if (/^\d+$/.test(m) && /^\d+$/.test(h) && /^\d+$/.test(dom) && dow === "*") {
    return {
      ...DEFAULT_BUILDER_STATE,
      frequency: "month",
      hour: parseInt(h, 10),
      minute: parseInt(m, 10),
      dayOfMonth: parseInt(dom, 10),
    };
  }

  return { ...DEFAULT_BUILDER_STATE };
}

// Build a 5-field cron expression from the visual builder's state.
export function buildCronFromBuilderState(state) {
  switch (state.frequency) {
    case "minute": {
      const n = state.minuteInterval || 1;
      return n === 1 ? "* * * * *" : `*/${n} * * * *`;
    }
    case "hour":
      return `${state.hourMinuteOffset} * * * *`;
    case "day":
      return `${state.minute} ${state.hour} * * *`;
    case "week": {
      const days = (state.weekdays?.length ? state.weekdays : [1])
        .slice()
        .sort((a, b) => a - b)
        .join(",");
      return `${state.minute} ${state.hour} * * ${days}`;
    }
    case "month":
      return `${state.minute} ${state.hour} ${state.dayOfMonth} * *`;
    default:
      return "0 9 * * *";
  }
}
