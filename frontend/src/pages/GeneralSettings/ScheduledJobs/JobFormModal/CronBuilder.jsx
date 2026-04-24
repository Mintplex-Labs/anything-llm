import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  parseCronToBuilderState,
  buildCronFromBuilderState,
} from "../utils/cron";

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
  const { t } = useTranslation();
  const WEEKDAYS = [
    { value: 0, label: t("scheduledJobs.builder.weekdays.sun") },
    { value: 1, label: t("scheduledJobs.builder.weekdays.mon") },
    { value: 2, label: t("scheduledJobs.builder.weekdays.tue") },
    { value: 3, label: t("scheduledJobs.builder.weekdays.wed") },
    { value: 4, label: t("scheduledJobs.builder.weekdays.thu") },
    { value: 5, label: t("scheduledJobs.builder.weekdays.fri") },
    { value: 6, label: t("scheduledJobs.builder.weekdays.sat") },
  ];
  const initial = parseCronToBuilderState(value);
  const [state, setState] = useState(initial.state);
  const [wasFallback, setWasFallback] = useState(initial.wasFallback);

  const update = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    if (wasFallback) setWasFallback(false);
    const cron = buildCronFromBuilderState(next);
    if (cron !== value) onChange(cron);
  };

  return (
    <div className="flex gap-3 p-3 bg-theme-settings-input-bg/40 rounded-lg">
      {wasFallback && (
        <p className="text-xs text-yellow-400">
          {t("scheduledJobs.builder.fallbackWarning")}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={labelClass}>{t("scheduledJobs.builder.run")}</span>
        <select
          value={state.frequency}
          onChange={(e) => update({ frequency: e.target.value })}
          className={inputClass}
        >
          <option value="minute">
            {t("scheduledJobs.builder.frequency.minute")}
          </option>
          <option value="hour">
            {t("scheduledJobs.builder.frequency.hour")}
          </option>
          <option value="day">
            {t("scheduledJobs.builder.frequency.day")}
          </option>
          <option value="week">
            {t("scheduledJobs.builder.frequency.week")}
          </option>
          <option value="month">
            {t("scheduledJobs.builder.frequency.month")}
          </option>
        </select>
      </div>

      {state.frequency === "minute" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>{t("scheduledJobs.builder.every")}</span>
          <select
            value={state.minuteInterval}
            onChange={(e) =>
              update({ minuteInterval: parseInt(e.target.value, 10) })
            }
            className={inputClass}
          >
            {MINUTE_INTERVALS.map((n) => (
              <option key={n} value={n}>
                {n === 1
                  ? t("scheduledJobs.builder.minuteOne")
                  : t("scheduledJobs.builder.minuteOther", { count: n })}
              </option>
            ))}
          </select>
        </div>
      )}

      {state.frequency === "hour" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>
            {t("scheduledJobs.builder.atMinute")}
          </span>
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
          <span className={labelClass}>
            {t("scheduledJobs.builder.pastEveryHour")}
          </span>
        </div>
      )}

      {(state.frequency === "day" ||
        state.frequency === "week" ||
        state.frequency === "month") && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>{t("scheduledJobs.builder.at")}</span>
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
            className={`${inputClass} [color-scheme:dark] light:[color-scheme:light]`}
          />
        </div>
      )}

      {state.frequency === "week" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>{t("scheduledJobs.builder.on")}</span>
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
                  className={`border-none px-3 py-1 text-xs rounded-full transition-colors ${
                    selected
                      ? "bg-zinc-50 text-zinc-950 light:bg-zinc-950 light:text-white"
                      : "bg-white/5 text-theme-text-secondary hover:bg-white/10 hover:text-theme-text-primary light:bg-slate-200 light:hover:bg-slate-300"
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
          <span className={labelClass}>{t("scheduledJobs.builder.onDay")}</span>
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
          <span className={labelClass}>
            {t("scheduledJobs.builder.ofEveryMonth")}
          </span>
        </div>
      )}
    </div>
  );
}
