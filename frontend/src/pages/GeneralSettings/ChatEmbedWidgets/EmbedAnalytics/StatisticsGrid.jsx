import { useTranslation } from "react-i18next";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { useState } from "react";
import useUser from "@/hooks/useUser";

export default function StatisticsGrid({ stats }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const [showTechnical, setShowTechnical] = useState(false);

  const statCards = [
    {
      label: t("embed-analytics.stats.conversations-label"),
      value: stats.unique_conversations?.toLocaleString("de-DE") || 0,
      description: t("embed-analytics.stats.conversations-desc"),
      color: "#3B82F6",
    },
    {
      label: t("embed-analytics.stats.messages-label"),
      value: stats.total_chats?.toLocaleString("de-DE") || 0,
      description: t("embed-analytics.stats.messages-desc"),
      color: "#10B981",
    },
    {
      label: t("embed-analytics.stats.avg-messages-label"),
      value: stats.avg_chats_per_conversation?.toFixed(1) || "0.0",
      description: t("embed-analytics.stats.avg-messages-desc"),
      color: "#F59E0B",
    },
  ];

  const technicalStats = [
    {
      label: t("embed-analytics.stats.avg-words-prompt-label"),
      value: stats.avg_words_prompt?.toLocaleString("de-DE") || 0,
      description: t("embed-analytics.stats.avg-words-prompt-desc"),
      color: "#8B5CF6",
    },
    {
      label: t("embed-analytics.stats.avg-words-response-label"),
      value: stats.avg_words_response?.toLocaleString("de-DE") || 0,
      description: t("embed-analytics.stats.avg-words-response-desc"),
      color: "#EC4899",
    },
    {
      label: t("embed-analytics.stats.max-words-prompt-label"),
      value: stats.max_words_prompt?.toLocaleString("de-DE") || 0,
      description: t("embed-analytics.stats.max-words-prompt-desc"),
      color: "#EF4444",
    },
  ];

  return (
    <div>
      {/* Standard Statistics (visible for all) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-theme-bg-secondary border border-white/10 light:border-gray-200 rounded-lg p-5"
          >
            <h4 className="text-theme-text-secondary text-xs uppercase tracking-wide mb-2">
              {stat.label}
            </h4>
            <p className="text-4xl font-bold mb-2" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-theme-text-secondary text-xs">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Technical Details (only for Admin) */}
      {user?.role === "admin" && (
        <div className="mt-6">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="flex items-center gap-2 text-theme-text-secondary hover:text-theme-text-primary transition-colors mb-4"
          >
            {showTechnical ? (
              <CaretUp size={20} weight="bold" />
            ) : (
              <CaretDown size={20} weight="bold" />
            )}
            <span className="text-sm font-medium">{t("embed-analytics.stats.show-technical")}</span>
          </button>

          {showTechnical && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-theme-bg-secondary/50 border border-white/10 light:border-gray-200 rounded-lg">
              {technicalStats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-theme-bg-primary rounded-lg">
                  <h4 className="text-theme-text-secondary text-xs uppercase tracking-wide mb-2">
                    {stat.label}
                  </h4>
                  <p className="text-3xl font-bold mb-2" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-theme-text-secondary text-xs">{stat.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
