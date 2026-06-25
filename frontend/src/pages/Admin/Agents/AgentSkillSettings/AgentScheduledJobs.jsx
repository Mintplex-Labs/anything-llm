import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import Toggle from "@/components/lib/Toggle";
import System from "@/models/system";
import Admin from "@/models/admin";

/**
 * Toggle for the create-scheduled-job agent skill. Scheduled Jobs is a
 * single-user-mode-only feature, so this section is hidden entirely when the
 * instance is in multi-user mode.
 */
export default function AgentScheduledJobs() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [multiUserMode, setMultiUserMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    System.keys()
      .then((res) => {
        setEnabled(!!res?.AgentCreateScheduledJobEnabled);
        setMultiUserMode(!!res?.MultiUserMode);
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggleEnabled(next) {
    console.log(next);
    setEnabled(next);
    await Admin.updateSystemPreferences({
      agent_create_scheduled_job_enabled: String(next),
    });
  }

  // Single-user-mode-only feature: do not render in multi-user mode. The
  // leading divider lives inside this component so it disappears with it.
  if (loading || multiUserMode) return null;

  return (
    <>
      <div className="border-b border-white/10 h-[1px] w-full" />
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-1">
          <label className="block text-md font-medium text-white">
            {t("agent.settings.scheduled-jobs.title")}
          </label>
        </div>
        <div className="flex items-center gap-x-4">
          <p className="text-xs text-white/60">
            {t("agent.settings.scheduled-jobs.description")}
          </p>
          {loading ? (
            <CircleNotch
              size={16}
              className="shrink-0 animate-spin text-theme-text-primary"
            />
          ) : (
            <Toggle
              size="lg"
              name="agentCreateScheduledJobEnabled"
              enabled={enabled}
              onChange={toggleEnabled}
            />
          )}
        </div>
      </div>
    </>
  );
}
