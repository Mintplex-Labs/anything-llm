import { useState } from "react";
import {
  parseCronToBuilderState,
  buildCronFromBuilderState,
} from "./utils/cron";

const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const MINUTE_INTERVALS = [1, 2, 5, 10, 15, 20, 30];
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

const pad2 = (n) => String(n).padStart(2, "0");

const inputClass =
  "border-none bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:outline-primary-button outline-none p-2.5";

const labelClass = "text-sm text-theme-text-secondary";

// Visual cron builder. Maintains its own state derived from the incoming
// `value` on mount, and emits a fresh 5-field cron string via `onChange`
// whenever the user changes any sub-field.
export default function CronBuilder({ value, onChange }) {
  const [state, setState] = useState(
    () => parseCronToBuilderState(value).state
  );
  const [wasFallback, setWasFallback] = useState(
    () => parseCronToBuilderState(value).wasFallback
  );

  const update = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    if (wasFallback) setWasFallback(false);
    const cron = buildCronFromBuilderState(next);
    if (cron !== value) onChange(cron);
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-theme-settings-input-bg/40 rounded-lg">
      {wasFallback && (
        <p className="text-xs text-yellow-400">
          This expression can&apos;t be edited visually. Switch to Custom to
          keep it, or change anything below to overwrite it.
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={labelClass}>Run</span>
        <select
          value={state.frequency}
          onChange={(e) => update({ frequency: e.target.value })}
          className={inputClass}
        >
          <option value="minute">every minute</option>
          <option value="hour">hourly</option>
          <option value="day">daily</option>
          <option value="week">weekly</option>
          <option value="month">monthly</option>
        </select>
      </div>

      {state.frequency === "minute" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>Every</span>
          <select
            value={state.minuteInterval}
            onChange={(e) =>
              update({ minuteInterval: parseInt(e.target.value, 10) })
            }
            className={inputClass}
          >
            {MINUTE_INTERVALS.map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "1 minute" : `${n} minutes`}
              </option>
            ))}
          </select>
        </div>
      )}

      {state.frequency === "hour" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>At minute</span>
          <select
            value={state.hourMinuteOffset}
            onChange={(e) =>
              update({ hourMinuteOffset: parseInt(e.target.value, 10) })
            }
            className={inputClass}
          >
            {MINUTES.map((n) => (
              <option key={n} value={n}>
                {pad2(n)}
              </option>
            ))}
          </select>
          <span className={labelClass}>past every hour</span>
        </div>
      )}

      {(state.frequency === "day" ||
        state.frequency === "week" ||
        state.frequency === "month") && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>At</span>
          <input
            type="time"
            value={`${pad2(state.hour)}:${pad2(state.minute)}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":");
              update({
                hour: parseInt(h, 10) || 0,
                minute: parseInt(m, 10) || 0,
              });
            }}
            className={inputClass}
          />
        </div>
      )}

      {state.frequency === "week" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>On</span>
          <div className="flex gap-1 flex-wrap">
            {WEEKDAYS.map((day) => {
              const selected = state.weekdays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => {
                    const next = selected
                      ? state.weekdays.filter((d) => d !== day.value)
                      : [...state.weekdays, day.value];
                    update({ weekdays: next.length ? next : [day.value] });
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selected
                      ? "bg-primary-button text-white border-primary-button"
                      : "bg-transparent text-theme-text-secondary border-white/10 hover:border-white/30"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {state.frequency === "month" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>On day</span>
          <select
            value={state.dayOfMonth}
            onChange={(e) =>
              update({ dayOfMonth: parseInt(e.target.value, 10) })
            }
            className={inputClass}
          >
            {DAYS_OF_MONTH.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className={labelClass}>of every month</span>
        </div>
      )}
    </div>
  );
}
