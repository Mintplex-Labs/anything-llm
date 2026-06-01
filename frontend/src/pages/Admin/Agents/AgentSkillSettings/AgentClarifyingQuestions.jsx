import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import Toggle from "@/components/lib/Toggle";
import System from "@/models/system";
import Admin from "@/models/admin";

export default function AgentClarifyingQuestions() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [maxPerTurn, setMaxPerTurn] = useState(3);
  const [loading, setLoading] = useState(true);

  const debouncedUpdateMaxPerTurn = useMemo(
    () =>
      debounce(async (value) => {
        await Admin.updateSystemPreferences({
          agent_clarifying_questions_max_per_turn: String(value),
        });
      }, 800),
    []
  );

  useEffect(() => {
    System.keys()
      .then((res) => {
        setEnabled(!!res.AgentClarifyingQuestionsEnabled);
        setMaxPerTurn(parseInt(res.AgentClarifyingQuestionsMaxPerTurn) || 3);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      debouncedUpdateMaxPerTurn.cancel();
    };
  }, [debouncedUpdateMaxPerTurn]);

  async function toggleEnabled(next) {
    setEnabled(next);
    await Admin.updateSystemPreferences({
      agent_clarifying_questions_enabled: String(next),
    });
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-1">
        <label className="block text-md font-medium text-white flex items-center gap-x-1">
          {t("agent.settings.clarifying-questions.title")}{" "}
          <i className="ml-1 text-xs text-white pl-2 bg-blue-500/40 rounded-md px-2 py-0.5">
            {t("agent.settings.clarifying-questions.beta-badge")}
          </i>
        </label>
      </div>
      <div className="flex items-center gap-x-4">
        <p className="text-xs text-white/60">
          {t("agent.settings.clarifying-questions.description")}
        </p>
        {loading ? (
          <CircleNotch
            size={16}
            className="shrink-0 animate-spin text-theme-text-primary"
          />
        ) : (
          <Toggle
            size="lg"
            name="agentClarifyingQuestionsEnabled"
            enabled={enabled}
            onChange={toggleEnabled}
          />
        )}
      </div>
      {enabled && (
        <>
          <div className="flex items-center gap-x-4">
            <div className="flex flex-col gap-y-1 flex-1">
              <label className="block text-md font-medium text-white">
                {t("agent.settings.clarifying-questions.max-per-turn.title")}
              </label>
              <p className="text-xs text-white/60">
                {t(
                  "agent.settings.clarifying-questions.max-per-turn.description"
                )}
              </p>
            </div>
            <input
              type="number"
              name="agentClarifyingQuestionsMaxPerTurn"
              min={1}
              value={maxPerTurn}
              onChange={(e) => {
                if (e.target.value < 1) return;
                debouncedUpdateMaxPerTurn(e.target.value);
                setMaxPerTurn(parseInt(e.target.value));
              }}
              onWheel={(e) => e.target.blur()}
              className="border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[80px] p-2.5 text-center"
              placeholder="3"
              autoComplete="off"
            />
          </div>
        </>
      )}
    </div>
  );
}
