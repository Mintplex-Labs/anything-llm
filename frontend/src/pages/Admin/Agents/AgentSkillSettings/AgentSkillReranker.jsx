import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import Toggle from "@/components/lib/Toggle";
import System from "@/models/system";

export default function AgentSkillReranker() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [maxTools, setMaxTools] = useState(15);
  const [loading, setLoading] = useState(true);

  const debouncedUpdateMaxTools = useMemo(
    () =>
      debounce(async (newMaxToolsCount) => {
        await System.updateSystem({
          AgentSkillRerankerTopN: newMaxToolsCount.toString(),
        });
      }, 800),
    []
  );

  useEffect(() => {
    System.keys()
      .then((res) => {
        setEnabled(res.AgentSkillRerankerEnabled);
        setMaxTools(parseInt(res.AgentSkillRerankerTopN));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => debouncedUpdateMaxTools.cancel();
  }, [debouncedUpdateMaxTools]);

  async function toggleEnabled(enabled) {
    setEnabled(enabled);
    await System.updateSystem({
      AgentSkillRerankerEnabled: String(enabled),
    });
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-1">
        <label className="block text-md font-medium text-white flex items-center gap-x-1">
          {t("agent.settings.intelligent-skill-selection.title")}{" "}
          <i className="ml-1 text-xs text-white pl-2 bg-blue-500/40 rounded-md px-2 py-0.5">
            {t("agent.settings.intelligent-skill-selection.beta-badge")}
          </i>
        </label>
      </div>
      <div className="flex items-center gap-x-4">
        <p className="text-xs text-white/60">
          {t("agent.settings.intelligent-skill-selection.description")}
        </p>
        {loading ? (
          <CircleNotch
            size={16}
            className="shrink-0 animate-spin text-theme-text-primary"
          />
        ) : (
          <Toggle
            size="lg"
            name="agentSkillRerankerEnabled"
            enabled={enabled}
            onChange={toggleEnabled}
          />
        )}
      </div>
      {enabled && (
        <div className="flex items-center gap-x-4">
          <div className="flex flex-col gap-y-1 flex-1">
            <label className="block text-md font-medium text-white">
              {t("agent.settings.intelligent-skill-selection.max-tools.title")}
            </label>
            <p className="text-xs text-white/60">
              {t(
                "agent.settings.intelligent-skill-selection.max-tools.description"
              )}
            </p>
          </div>
          <input
            type="number"
            name="agentSkillRerankerTopN"
            min={10}
            value={maxTools}
            onChange={(e) => {
              if (e.target.value < 10) return;
              debouncedUpdateMaxTools(e.target.value);
              setMaxTools(parseInt(e.target.value));
            }}
            onWheel={(e) => e.target.blur()}
            className="border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[80px] p-2.5 text-center"
            placeholder="15"
            autoComplete="off"
          />
        </div>
      )}
    </div>
  );
}
