import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import CTAButton from "@/components/lib/CTAButton";

/**
 * Admin View for Billing Settings
 * Allows admins to configure message limits and billing cycles
 * Also shows current usage statistics for support purposes
 */
export default function BillingAdminView({ workspace }) {
  const { t } = useTranslation();
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const formEl = useRef(null);

  // Fetch current usage data on mount
  useEffect(() => {
    async function loadInitialUsageData() {
      try {
        const data = await Workspace.getUsageInfo(workspace.slug);
        setUsageData(data);
      } catch (err) {
        console.error("Failed to fetch usage data:", err);
      }
      setLoadingUsage(false);
    }
    loadInitialUsageData();
  }, [workspace.slug]);

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  // Calculate next reset date for display
  const calculateNextReset = (startDate, durationMonths) => {
    if (!startDate || !durationMonths) return null;

    const start = new Date(startDate);
    if (isNaN(start.getTime())) return null;

    const now = new Date();
    let cycleStart = new Date(start);

    // Find current cycle start
    while (addMonths(cycleStart, durationMonths) <= now) {
      cycleStart = addMonths(cycleStart, durationMonths);
    }

    return addMonths(cycleStart, durationMonths);
  };

  // Add months with clamping (same logic as backend)
  const addMonths = (date, months) => {
    const originalDay = date.getDate();
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);

    if (result.getDate() !== originalDay) {
      result.setDate(0);
    }

    return result;
  };

  const [cycleStartDate, setCycleStartDate] = useState(
    formatDateForInput(workspace?.cycleStartDate)
  );
  const [cycleDurationMonths, setCycleDurationMonths] = useState(
    workspace?.cycleDurationMonths || ""
  );
  const [messagesLimit, setMessagesLimit] = useState(
    workspace?.messagesLimit ?? ""
  );

  const nextReset = calculateNextReset(cycleStartDate, cycleDurationMonths);

  const cycleDurationOptions = [
    { value: 1, label: t("billing.cycle.1-month") },
    { value: 2, label: t("billing.cycle.2-months") },
    { value: 3, label: t("billing.cycle.3-months") },
    { value: 4, label: t("billing.cycle.4-months") },
    { value: 6, label: t("billing.cycle.6-months") },
    { value: 12, label: t("billing.cycle.12-months") },
  ];

  // Fetch usage data function (reusable)
  const fetchUsageData = async () => {
    try {
      const data = await Workspace.getUsageInfo(workspace.slug);
      setUsageData(data);
    } catch (err) {
      console.error("Failed to fetch usage data:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);

    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (updatedWorkspace) {
      showToast(t("billing.admin.save-success"), "success", { clear: true });
      setHasChanges(false);
      // Reload usage data to reflect new limits
      await fetchUsageData();
    } else {
      showToast(t("billing.admin.save-error", { message }), "error", { clear: true });
    }
    setSaving(false);
  };

  return (
    <div id="workspace-billing-settings-container" className="relative">
      <form ref={formEl} onSubmit={handleUpdate} className="w-1/2 flex flex-col gap-y-6">
        {/* Save Button - top right like other tabs */}
        {hasChanges && (
          <div className="absolute top-0 right-0">
            <CTAButton type="submit" disabled={saving}>
              {saving ? t("billing.admin.saving") : t("billing.admin.update-workspace")}
            </CTAButton>
          </div>
        )}

        {/* Current Usage Status - for admin to see customer's usage */}
        <div>
          <div className="flex flex-col gap-y-1">
            <label className="block text-sm font-medium text-white">
              {t("billing.admin.current-usage")}
            </label>
            <p className="text-white/60 text-xs">
              {t("billing.admin.usage-description")}
            </p>
          </div>

          {loadingUsage ? (
            <div className="animate-pulse text-white/60 text-sm mt-4">
              {t("billing.admin.loading-usage")}
            </div>
          ) : usageData ? (
            <div className="space-y-3 mt-4">
              {/* Usage Numbers */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-sm">{t("billing.admin.consumed")}</p>
                  <p className="text-3xl font-bold text-white">
                    {usageData.messageCount?.toLocaleString("de-DE") ?? 0}
                    <span className="text-lg font-normal text-white/60">
                      {" / "}{usageData.messagesLimit?.toLocaleString("de-DE") ?? t("billing.admin.unlimited")}
                    </span>
                  </p>
                </div>
                {usageData.messagesLimit && (
                  <div className="text-right">
                    <p className="text-white/60 text-sm">{t("billing.admin.remaining")}</p>
                    <p className="text-2xl font-semibold text-white">
                      {Math.max(0, usageData.messagesLimit - usageData.messageCount).toLocaleString("de-DE")}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {usageData.messagesLimit && (
                <div className="w-full bg-theme-settings-input-bg rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (usageData.messageCount / usageData.messagesLimit) >= 1
                        ? "bg-red-500"
                        : (usageData.messageCount / usageData.messagesLimit) >= 0.8
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min((usageData.messageCount / usageData.messagesLimit) * 100, 100)}%` }}
                  />
                </div>
              )}

              {/* Percentage */}
              {usageData.messagesLimit && (
                <div className="text-sm">
                  <span className={`font-medium ${
                    (usageData.messageCount / usageData.messagesLimit) >= 1
                      ? "text-red-400"
                      : (usageData.messageCount / usageData.messagesLimit) >= 0.8
                        ? "text-yellow-400"
                        : "text-white/60"
                  }`}>
                    {((usageData.messageCount / usageData.messagesLimit) * 100).toFixed(1)}% {t("billing.admin.used")}
                  </span>
                </div>
              )}

              {/* Cycle Info */}
              {usageData.cycleInfo && (
                <div className="flex gap-x-8 pt-2">
                  <div>
                    <span className="text-white/60 text-xs block">{t("billing.admin.next-cycle-start")}</span>
                    <p className="text-white text-sm font-medium">
                      {new Date(usageData.cycleInfo.nextReset).toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs block">{t("billing.admin.remaining")}</span>
                    <p className="text-white text-sm font-medium">
                      {usageData.cycleInfo.daysRemaining} {usageData.cycleInfo.daysRemaining === 1 ? t("billing.admin.day") : t("billing.admin.days")}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs block">{t("billing.admin.cycle-duration")}</span>
                    <p className="text-white text-sm font-medium">
                      {(() => {
                        const months = usageData.cycleInfo.cycleDurationMonths;
                        switch (months) {
                          case 1: return t("billing.cycle.1-month");
                          case 2: return t("billing.cycle.2-months");
                          case 3: return t("billing.cycle.3-months");
                          case 4: return t("billing.cycle.4-months");
                          case 6: return t("billing.cycle.6-months");
                          case 12: return t("billing.cycle.12-months");
                          default: return `${months} ${t("billing.cycle.months")}`;
                        }
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs block">{t("billing.admin.current-cycle")}</span>
                    <p className="text-white text-sm font-medium">
                      {usageData.cycleInfo.cycleNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-white/60 text-sm mt-4">
              {t("billing.admin.no-usage-data")}
            </div>
          )}
        </div>

        {/* Messages Limit Section */}
        <div>
          <div className="flex flex-col gap-y-1">
            <label htmlFor="messagesLimit" className="block text-sm font-medium text-white">
              {t("billing.admin.messages-limit")}
            </label>
            <p className="text-white/60 text-xs">
              {t("billing.admin.messages-limit-description")}
            </p>
          </div>
          <input
            name="messagesLimit"
            type="number"
            min={0}
            step={1}
            onWheel={(e) => e.target.blur()}
            value={messagesLimit}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 mt-4"
            placeholder={t("billing.admin.unlimited")}
            autoComplete="off"
            onChange={(e) => {
              setMessagesLimit(e.target.value);
              setHasChanges(true);
            }}
          />
        </div>

        {/* Billing Cycle Section */}
        <div>
          <div className="flex flex-col gap-y-1">
            <label className="block text-sm font-medium text-white">
              {t("billing.admin.billing-cycle")}
            </label>
            <p className="text-white/60 text-xs">
              {t("billing.admin.cycle-reset-description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Cycle Start Date */}
            <div>
              <label
                htmlFor="cycleStartDate"
                className="block mb-2 text-sm font-medium text-white"
              >
                {t("billing.admin.cycle-start-date")}
              </label>
              <input
                name="cycleStartDate"
                type="date"
                value={cycleStartDate}
                onChange={(e) => {
                  setCycleStartDate(e.target.value);
                  setHasChanges(true);
                }}
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              />
            </div>

            {/* Cycle Duration */}
            <div>
              <label
                htmlFor="cycleDurationMonths"
                className="block mb-2 text-sm font-medium text-white"
              >
                {t("billing.admin.cycle-duration-label")}
              </label>
              <select
                name="cycleDurationMonths"
                value={cycleDurationMonths}
                onChange={(e) => {
                  setCycleDurationMonths(e.target.value ? parseInt(e.target.value) : "");
                  setHasChanges(true);
                }}
                className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              >
                <option value="">{t("billing.admin.select-placeholder")}</option>
                {cycleDurationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Next Reset Info */}
          {nextReset && (
            <p className="text-sm text-white/60 mt-3">
              {t("billing.admin.next-cycle-start-label")}{" "}
              <span className="font-medium text-white">
                {nextReset.toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-500/15 rounded-lg border border-blue-500/30">
          <p className="text-sm text-blue-400">
            <strong>{t("billing.admin.info-title")}</strong>{" "}
            {t("billing.admin.info-text")}
          </p>
        </div>
      </form>
    </div>
  );
}
