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
        <label className="block text-md font-medium text-zinc-50 light:text-slate-900 flex items-center gap-x-1">
          {t("agent.settings.clarifying-questions.title")}{" "}
          <i className="ml-1 text-xs text-white light:text-sky-700 pl-2 bg-blue-500/40 light:bg-sky-100 rounded-md px-2 py-0.5">
            {t("agent.settings.clarifying-questions.beta-badge")}
          </i>
        </label>
      </div>
      <div className="flex items-center gap-x-4">
        <p className="text-xs text-zinc-400 light:text-slate-600">
          {t("agent.settings.clarifying-questions.description")}
        </p>
        {loading ? (
          <CircleNotch
            size={16}
            className="shrink-0 animate-spin text-zinc-400 light:text-slate-600"
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
              <label className="block text-md font-medium text-zinc-50 light:text-slate-900">
                {t("agent.settings.clarifying-questions.max-per-turn.title")}
              </label>
              <p className="text-xs text-zinc-400 light:text-slate-600">
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
              className="bg-zinc-800 border border-zinc-800 text-zinc-100 placeholder:text-zinc-400 light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400 text-sm rounded-lg outline-none focus:border-sky-500 light:focus:border-sky-500 block w-[80px] h-[34px] px-3 text-center"
              placeholder="3"
              autoComplete="off"
            />
          </div>
        </>
      )}
    </div>
  );
}
