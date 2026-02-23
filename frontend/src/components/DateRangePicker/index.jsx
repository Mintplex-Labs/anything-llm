import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CalendarBlank, CaretDown, Check } from "@phosphor-icons/react";
import { DayPicker } from "react-day-picker";
import { de } from "react-day-picker/locale";
import "react-day-picker/style.css";

/**
 * Computes fixed calendar-boundary preset dates (NOT rolling windows).
 * Returns { from: Date|null, to: Date|null }
 */
/**
 * Returns a new Date with time set to 23:59:59.999 (end of day).
 * Critical: without this, API queries miss all conversations after 00:00.
 */
function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getPresetRange(presetKey) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (presetKey) {
    case "today":
      return { from: today, to: endOfDay(today) };
    case "yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: endOfDay(yesterday) };
    }
    case "this-week": {
      // German convention: week starts on Monday
      const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - diff);
      return { from: monday, to: endOfDay(today) };
    }
    case "this-month":
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: endOfDay(today),
      };
    case "last-month": {
      const firstOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const lastOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );
      return { from: firstOfLastMonth, to: endOfDay(lastOfLastMonth) };
    }
    case "all":
      return { from: null, to: null };
    default:
      return { from: null, to: null };
  }
}

/**
 * Format a Date as dd.MM.yyyy (German format)
 */
function formatDE(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

const PRESET_KEYS = [
  "today",
  "yesterday",
  "this-week",
  "this-month",
  "last-month",
  "all",
];

/**
 * Chatbase-inspired DateRange picker with preset dropdown + dual calendar.
 *
 * Props:
 * - startDate: Date|null - current start
 * - endDate: Date|null - current end
 * - onChange: ({ startDate: Date|null, endDate: Date|null }) => void
 */
export default function DateRangePicker({ startDate, endDate, onChange }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [calendarRange, setCalendarRange] = useState({
    from: startDate,
    to: endDate,
  });
  const [activePreset, setActivePreset] = useState("this-week");
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  // Detect which preset matches current dates (compare date part only)
  useEffect(() => {
    const sameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const matched = PRESET_KEYS.find((key) => {
      const { from, to } = getPresetRange(key);
      if (key === "all") return startDate === null && endDate === null;
      if (!from || !to || !startDate || !endDate) return false;
      return sameDay(from, startDate) && sameDay(to, endDate);
    });
    setActivePreset(matched || null);
  }, [startDate, endDate]);

  // Sync calendarRange when popover opens
  useEffect(() => {
    if (open) {
      setCalendarRange({ from: startDate, to: endDate });
    }
  }, [open, startDate, endDate]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
        setPresetDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  const handlePresetSelect = useCallback(
    (key) => {
      const { from, to } = getPresetRange(key);
      setActivePreset(key);
      setPresetDropdownOpen(false);
      setOpen(false);
      onChange({ startDate: from, endDate: to });
    },
    [onChange]
  );

  const handleCalendarSelect = useCallback((range) => {
    if (!range) return;
    setCalendarRange({ from: range.from || null, to: range.to || null });
    setActivePreset(null);
  }, []);

  const handleApply = useCallback(() => {
    if (calendarRange.from) {
      const end = calendarRange.to || calendarRange.from;
      onChange({
        startDate: calendarRange.from,
        endDate: endOfDay(end),
      });
      setOpen(false);
      setPresetDropdownOpen(false);
    }
  }, [calendarRange, onChange]);

  // Display text for trigger button
  const displayText =
    startDate === null && endDate === null
      ? t("date-picker.all")
      : `${formatDE(startDate)} - ${formatDE(endDate)}`;

  // Default month for calendar: show the month of startDate (or current month)
  const defaultMonth = startDate || new Date();
  // For dual calendar, show previous month + default month
  const calendarMonth = new Date(
    defaultMonth.getFullYear(),
    defaultMonth.getMonth() - 1,
    1
  );

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-theme-settings-input-bg text-theme-text-primary rounded-lg px-4 py-2 text-sm border border-white/10 cursor-pointer"
      >
        <CalendarBlank size={16} className="text-theme-text-secondary" />
        <span>{displayText}</span>
        <CaretDown
          size={12}
          className={`text-theme-text-secondary ml-1 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 z-50 bg-theme-bg-secondary border border-white/10 rounded-xl shadow-2xl p-4 min-w-[580px]"
        >
          {/* Preset Dropdown */}
          <div className="relative mb-3">
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center justify-between w-full bg-theme-settings-input-bg text-theme-text-primary rounded-lg px-3 py-2 text-sm border border-white/10 cursor-pointer"
            >
              <span>
                {activePreset
                  ? t(`date-picker.${activePreset}`)
                  : t("date-picker.custom-range")}
              </span>
              <CaretDown
                size={12}
                className={`text-theme-text-secondary transition-transform ${presetDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {presetDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-theme-bg-secondary border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                {PRESET_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() => handlePresetSelect(key)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-all cursor-pointer
                      ${activePreset === key ? "bg-white/10 text-theme-text-primary font-medium" : "text-theme-text-secondary hover:bg-white/5 hover:text-theme-text-primary"}`}
                  >
                    <span>{t(`date-picker.${key}`)}</span>
                    {activePreset === key && (
                      <Check
                        size={14}
                        className="text-theme-text-primary"
                        weight="bold"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mb-3" />

          {/* Dual Calendar */}
          <div className="rdp-theme-wrapper">
            <DayPicker
              mode="range"
              locale={de}
              weekStartsOn={1}
              numberOfMonths={2}
              defaultMonth={calendarMonth}
              selected={
                calendarRange.from
                  ? { from: calendarRange.from, to: calendarRange.to }
                  : undefined
              }
              onSelect={handleCalendarSelect}
              disabled={{ after: new Date() }}
            />
          </div>

          {/* Apply Button */}
          <div className="flex justify-end mt-3 pt-3 border-t border-white/10">
            <button
              onClick={handleApply}
              disabled={!calendarRange.from}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer
                bg-theme-button-primary text-black hover:opacity-90
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("date-picker.apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
