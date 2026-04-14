import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Workspace from "@/models/workspace";

/**
 * Customer View for Billing Settings
 * Read-only view showing usage statistics and progress bar
 */
export default function BillingCustomerView({ workspace }) {
  const { t } = useTranslation();
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsageData() {
      try {
        const data = await Workspace.getUsageInfo(workspace.slug);
        setUsageData(data);
      } catch (err) {
        console.error("Failed to fetch usage data:", err);
        setError(t("billing.customer.load-error"));
      }
      setLoading(false);
    }
    fetchUsageData();
  }, [workspace.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white/60">
          {t("billing.customer.loading")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 rounded-xl border border-red-500/20">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  // Extract data
  const messageCount = usageData?.messageCount ?? 0;
  const messagesLimit = usageData?.messagesLimit;
  const cycleInfo = usageData?.cycleInfo;
  const isUnlimited = messagesLimit === null || messagesLimit === undefined;

  // Calculate percentage
  const percentage = isUnlimited ? 0 : Math.min((messageCount / messagesLimit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  // Format next reset date
  const formatNextReset = () => {
    if (cycleInfo?.nextReset) {
      return new Date(cycleInfo.nextReset).toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    // Fallback to next month
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get days remaining
  const daysRemaining = cycleInfo?.daysRemaining ?? (() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.getDate() - now.getDate();
  })();

  // Get cycle duration text with description in parentheses
  const getCycleDurationText = () => {
    if (!cycleInfo?.cycleDurationMonths) return t("billing.cycle.1-month");
    switch (cycleInfo.cycleDurationMonths) {
      case 1: return t("billing.cycle.1-month");
      case 2: return t("billing.cycle.2-months");
      case 3: return t("billing.cycle.3-months");
      case 4: return t("billing.cycle.4-months");
      case 6: return t("billing.cycle.6-months");
      case 12: return t("billing.cycle.12-months");
      default: return `${cycleInfo.cycleDurationMonths} ${t("billing.cycle.months")}`;
    }
  };

  // Progress bar color based on usage
  const getProgressColor = () => {
    if (isAtLimit) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-1/2 flex flex-col gap-y-6">
      {/* Main Usage Section */}
      <div>
        <div className="flex flex-col gap-y-1">
          <label className="block text-sm font-medium text-white">
            {t("billing.customer.your-quota")}
          </label>
          <p className="text-white/60 text-xs">
            {t("billing.customer.quota-description")}
          </p>
        </div>

        {isUnlimited ? (
          /* Unlimited usage */
          <div className="mt-4 text-center py-6">
            <div className="text-4xl mb-2">{"\u221E"}</div>
            <p className="text-xl font-semibold text-white">
              {t("billing.customer.unlimited-quota")}
            </p>
            <p className="text-white/60 text-sm mt-2">
              {t("billing.customer.unlimited-description")}
            </p>
          </div>
        ) : (
          /* Limited usage with progress bar */
          <div className="mt-4 space-y-3">
            {/* Usage Numbers */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-sm">{t("billing.customer.consumed")}</p>
                <p className="text-3xl font-bold text-white">
                  {messageCount.toLocaleString("de-DE")}
                  <span className="text-lg font-normal text-white/60">
                    {" / "}{messagesLimit.toLocaleString("de-DE")}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">{t("billing.customer.remaining")}</p>
                <p className="text-2xl font-semibold text-white">
                  {Math.max(0, messagesLimit - messageCount).toLocaleString("de-DE")}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-theme-settings-input-bg rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Percentage */}
            <div className="text-sm">
              <span className={`font-medium ${isAtLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-white/60"}`}>
                {percentage.toFixed(1)}% {t("billing.customer.used")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cycle Info Section */}
      {!isUnlimited && (
        <div>
          <div className="flex flex-col gap-y-1">
            <label className="block text-sm font-medium text-white">
              {t("billing.customer.billing-cycle")}
            </label>
            <p className="text-white/60 text-xs">
              {t("billing.customer.cycle-info-description")}
            </p>
          </div>

          <div className="flex gap-x-8 mt-4">
            {/* Next Reset */}
            <div>
              <p className="text-white/60 text-xs block">{t("billing.customer.next-cycle-start")}</p>
              <p className="text-sm font-medium text-white">
                {formatNextReset()}
              </p>
            </div>

            {/* Days Remaining */}
            <div>
              <p className="text-white/60 text-xs block">{t("billing.customer.remaining")}</p>
              <p className="text-sm font-medium text-white">
                {daysRemaining} {daysRemaining === 1 ? t("billing.customer.day") : t("billing.customer.days")}
              </p>
            </div>

            {/* Cycle Duration */}
            <div>
              <p className="text-white/60 text-xs block">{t("billing.customer.cycle-duration")}</p>
              <p className="text-sm font-medium text-white">
                {getCycleDurationText()}
              </p>
            </div>

            {/* Current Cycle Number */}
            {cycleInfo?.cycleNumber && (
              <div>
                <p className="text-white/60 text-xs block">{t("billing.customer.current-cycle")}</p>
                <p className="text-sm font-medium text-white">
                  {cycleInfo.cycleNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning when near or at limit */}
      {!isUnlimited && isNearLimit && (
        <div className={`p-4 rounded-lg border ${
          isAtLimit
            ? "bg-red-500/10 border-red-500/20"
            : "bg-yellow-500/10 border-yellow-500/20"
        }`}>
          {isAtLimit ? (
            <>
              <p className="font-semibold text-red-300 mb-1">
                {t("billing.customer.quota-exhausted")}
              </p>
              <p className="text-sm text-red-300/80">
                {t("billing.customer.quota-exhausted-description")} {formatNextReset()} {t("billing.customer.messages-until")}
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-yellow-300 mb-1">
                {t("billing.customer.quota-almost-exhausted")}
              </p>
              <p className="text-sm text-yellow-300/80">
                {t("billing.customer.quota-almost-description", { percentage: percentage.toFixed(0), remaining: Math.max(0, messagesLimit - messageCount).toLocaleString("de-DE") })} {formatNextReset()}.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
