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
  const [timeoutSeconds, setTimeoutSeconds] = useState(120);
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

  const debouncedUpdateTimeout = useMemo(
    () =>
      debounce(async (seconds) => {
        await Admin.updateSystemPreferences({
          agent_clarifying_questions_timeout_ms: String(
            Math.max(10, Number(seconds)) * 1000
          ),
        });
      }, 800),
    []
  );

  useEffect(() => {
    System.keys()
      .then((res) => {
        setEnabled(!!res.AgentClarifyingQuestionsEnabled);
        setMaxPerTurn(parseInt(res.AgentClarifyingQuestionsMaxPerTurn) || 3);
        const ms = parseInt(res.AgentClarifyingQuestionsTimeoutMs) || 120000;
        setTimeoutSeconds(Math.round(ms / 1000));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      debouncedUpdateMaxPerTurn.cancel();
      debouncedUpdateTimeout.cancel();
    };
  }, [debouncedUpdateMaxPerTurn, debouncedUpdateTimeout]);

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
              type="text"
              inputMode="numeric"
              name="agentClarifyingQuestionsMaxPerTurn"
              value={maxPerTurn}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setMaxPerTurn(digitsOnly);
                const v = parseInt(digitsOnly, 10);
                if (Number.isFinite(v) && v >= 1 && v <= 10)
                  debouncedUpdateMaxPerTurn(v);
              }}
              onBlur={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isFinite(v) || v < 1) setMaxPerTurn(1);
                else if (v > 10) setMaxPerTurn(10);
                else setMaxPerTurn(v);
              }}
              className="border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[80px] p-2.5 text-center"
              placeholder="3"
              autoComplete="off"
            />
          </div>
          <div className="flex items-center gap-x-4">
            <div className="flex flex-col gap-y-1 flex-1">
              <label className="block text-md font-medium text-white">
                {t("agent.settings.clarifying-questions.timeout.title")}
              </label>
              <p className="text-xs text-white/60">
                {t("agent.settings.clarifying-questions.timeout.description")}
              </p>
            </div>
            <input
              type="text"
              inputMode="numeric"
              name="agentClarifyingQuestionsTimeoutSeconds"
              value={timeoutSeconds}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setTimeoutSeconds(digitsOnly);
                const v = parseInt(digitsOnly, 10);
                if (Number.isFinite(v) && v >= 10 && v <= 600)
                  debouncedUpdateTimeout(v);
              }}
              onBlur={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isFinite(v) || v < 10) setTimeoutSeconds(10);
                else if (v > 600) setTimeoutSeconds(600);
                else setTimeoutSeconds(v);
              }}
              className="border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[80px] p-2.5 text-center"
              placeholder="120"
              autoComplete="off"
            />
          </div>
        </>
      )}
    </div>
  );
}
