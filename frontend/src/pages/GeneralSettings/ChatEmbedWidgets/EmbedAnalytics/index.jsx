import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CaretDown, Check } from "@phosphor-icons/react";
import Embed from "@/models/embed";
import ConversationList from "./ConversationList";
import StatisticsGrid from "./StatisticsGrid";
import DateRangePicker from "@/components/DateRangePicker";
import showToast from "@/utils/toast";

/**
 * Returns "this week" default: Monday of current week to today.
 * German convention: week starts on Monday.
 */
function getThisWeekRange() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  return { startDate: monday, endDate: endOfToday };
}

/**
 * Format a Date as DD.MM.YYYY (German convention).
 */
function formatDate(date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

/**
 * Convert Date|null to ISO string|null for stable useEffect deps.
 */
function toISO(date) {
  return date ? date.toISOString() : null;
}

export default function EmbedAnalyticsView() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmbed, setSelectedEmbed] = useState(null);
  const [embeds, setEmbeds] = useState([]);
  const [retentionDays, setRetentionDays] = useState(null);
  const [embedDropdownOpen, setEmbedDropdownOpen] = useState(false);
  const embedDropdownRef = useRef(null);

  // Close embed dropdown on outside click
  useEffect(() => {
    if (!embedDropdownOpen) return;
    function handleMouseDown(e) {
      if (embedDropdownRef.current && !embedDropdownRef.current.contains(e.target)) {
        setEmbedDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [embedDropdownOpen]);

  // Date range as Date objects (null = "all time")
  const [startDate, setStartDate] = useState(
    () => getThisWeekRange().startDate
  );
  const [endDate, setEndDate] = useState(() => getThisWeekRange().endDate);

  // ISO strings for stable useEffect dependencies
  const startDateISO = toISO(startDate);
  const endDateISO = toISO(endDate);

  useEffect(() => {
    async function loadEmbeds() {
      const embedsData = await Embed.embeds();
      setEmbeds(embedsData || []);
      if (embedsData?.length > 0) {
        setSelectedEmbed(embedsData[0].id);
        setRetentionDays(embedsData[0].chat_retention_days || null);
      }
    }
    loadEmbeds();
  }, []);

  useEffect(() => {
    if (!selectedEmbed) return;

    // Update retention days for selected embed
    const currentEmbed = embeds.find((e) => e.id === selectedEmbed);
    setRetentionDays(currentEmbed?.chat_retention_days || null);

    async function loadStats() {
      setLoading(true);
      const { success, stats: data } = await Embed.getAnalyticsOverview(
        selectedEmbed,
        startDateISO,
        endDateISO
      );

      if (success) {
        setStats(data);
      } else {
        showToast(t("embed-analytics.load-error"), "error");
      }
      setLoading(false);
    }
    loadStats();
  }, [selectedEmbed, startDateISO, endDateISO, embeds, t]);

  const handleDateChange = useCallback(({ startDate: newStart, endDate: newEnd }) => {
    setStartDate(newStart);
    setEndDate(newEnd);
  }, []);

  if (loading || !stats) {
    return <div className="p-6 text-white">{t("common.loading")}</div>;
  }

  return (
    <div className="flex-1 flex-col p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-bold">
          {t("embed-analytics.title")}
        </h2>

        <div className="flex gap-3 items-center">
          {/* Embed Selector */}
          <div className="relative" ref={embedDropdownRef}>
            <button
              onClick={() => setEmbedDropdownOpen(!embedDropdownOpen)}
              className="flex items-center gap-2 bg-theme-settings-input-bg text-theme-text-primary rounded-lg px-4 py-2 text-sm border border-white/10 cursor-pointer"
            >
              <span>
                {embeds.find((e) => e.id === selectedEmbed)
                  ? `Embed #${selectedEmbed} (${embeds.find((e) => e.id === selectedEmbed)?.workspace?.name})`
                  : "Embed wählen"}
              </span>
              <CaretDown
                size={12}
                className={`text-theme-text-primary ml-1 transition-transform ${embedDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {embedDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-theme-bg-secondary border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                {embeds.map((embed) => (
                  <button
                    key={embed.id}
                    onClick={() => {
                      setSelectedEmbed(embed.id);
                      setEmbedDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-all cursor-pointer
                      ${selectedEmbed === embed.id ? "bg-white/10 text-theme-text-primary font-medium" : "text-theme-text-secondary hover:bg-white/5 hover:text-theme-text-primary"}`}
                  >
                    <span>Embed #{embed.id} ({embed.workspace?.name})</span>
                    {selectedEmbed === embed.id && (
                      <Check size={14} className="text-theme-text-primary" weight="bold" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Picker */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* DSGVO Retention Notice */}
      {retentionDays && retentionDays > 0 && (() => {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + retentionDays);
        return (
          <div className="mb-6 p-4 bg-blue-500/10 border-l-4 border-blue-400 rounded-lg light:bg-blue-50 light:border-blue-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400 light:text-blue-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-blue-300 text-sm light:text-blue-700">
                {t("embed-analytics.retention-notice", {
                  days: retentionDays,
                  expiryDate: formatDate(expiry),
                })}
              </span>
            </div>
          </div>
        );
      })()}

      {/* Statistics Grid */}
      <StatisticsGrid stats={stats} />

      {/* Divider */}
      <div className="h-px bg-white/20 my-4" />

      {/* Conversations List */}
      <ConversationList
        embedId={selectedEmbed}
        startDate={startDateISO}
        endDate={endDateISO}
      />
    </div>
  );
}
