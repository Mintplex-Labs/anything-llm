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
        <label className="block text-md font-medium text-zinc-50 light:text-slate-900 flex items-center gap-x-1">
          {t("agent.settings.intelligent-skill-selection.title")}{" "}
          <i className="ml-1 text-xs text-white light:text-sky-700 pl-2 bg-blue-500/40 light:bg-sky-100 rounded-md px-2 py-0.5">
            {t("agent.settings.intelligent-skill-selection.beta-badge")}
          </i>
        </label>
      </div>
      <div className="flex items-center gap-x-4">
        <p className="text-xs text-zinc-400 light:text-slate-600">
          {t("agent.settings.intelligent-skill-selection.description")}
        </p>
        {loading ? (
          <CircleNotch
            size={16}
            className="shrink-0 animate-spin text-zinc-400 light:text-slate-600"
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
            <label className="block text-md font-medium text-zinc-50 light:text-slate-900">
              {t("agent.settings.intelligent-skill-selection.max-tools.title")}
            </label>
            <p className="text-xs text-zinc-400 light:text-slate-600">
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
            className="bg-zinc-800 border border-zinc-800 text-zinc-100 placeholder:text-zinc-400 light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400 text-sm rounded-lg outline-none focus:border-sky-500 light:focus:border-sky-500 block w-[80px] h-[34px] px-3 text-center"
            placeholder="15"
            autoComplete="off"
          />
        </div>
      )}
    </div>
  );
}
