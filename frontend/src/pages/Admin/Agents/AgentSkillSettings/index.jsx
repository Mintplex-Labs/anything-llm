import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import { CircleNotch, SlidersHorizontal, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import Toggle from "@/components/lib/Toggle";
import System from "@/models/system";
import Admin from "@/models/admin";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";

export default function AgentSkillSettings() {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`w-10 h-10 flex items-center justify-center light:border-black/10 light:border-solid border-none light:!border rounded-lg transition-colors outline-none bg-transparent hover:bg-theme-bg-secondary`}
      >
        <SlidersHorizontal size={24} className={`text-theme-text-secondary`} />
      </button>
      <AgentSkillSettingsModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}

function AgentSkillSettingsModal({ isOpen, closeModal }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="w-[500px] bg-theme-bg-sidebar px-6 py-4 rounded-lg flex flex-col items-center justify-between relative shadow-lg border border-white/10">
        <div className="w-full flex items-center justify-between">
          <div className="text-white text-left font-medium text-lg">
            {t("agent.settings.title")}
          </div>
          <button
            onClick={closeModal}
            className="text-white opacity-60 hover:text-white hover:opacity-100 border-none outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-y-5 w-full">
            <MaxToolCallStack />
            <div className="border-b border-white/10 h-[1px] w-full" />
            <AgentSkillReranker />
            <div className="border-b border-white/10 h-[1px] w-full" />
            <AgentClarifyingQuestions />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

function MaxToolCallStack() {
  const { t } = useTranslation();
  const [maxCallStack, setMaxCallStack] = useState(10);
  const [loading, setLoading] = useState(true);

  const debouncedUpdateMaxCallStack = useMemo(
    () =>
      debounce(async (newMaxCallStack) => {
        await System.updateSystem({
          AgentSkillMaxToolCalls: newMaxCallStack.toString(),
        });
      }, 800),
    []
  );

  useEffect(() => {
    System.keys()
      .then((res) => {
        setMaxCallStack(parseInt(res.AgentSkillMaxToolCalls));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => debouncedUpdateMaxCallStack.cancel();
  }, [debouncedUpdateMaxCallStack]);

  return (
    <div className="flex flex-col gap-y-2 mt-4">
      <div className="flex items-center gap-x-4 mt-2">
        <div className="flex flex-col gap-y-1 flex-1">
          <label className="block text-md font-medium text-white">
            {t("agent.settings.max-tool-calls.title")}
          </label>
          <p className="text-xs text-white/60">
            {t("agent.settings.max-tool-calls.description")}
          </p>
        </div>
        <input
          type="number"
          name="agentSkillMaxToolCalls"
          min={1}
          value={maxCallStack}
          disabled={loading}
          onChange={(e) => {
            if (e.target.value < 1) return;
            debouncedUpdateMaxCallStack(e.target.value);
            setMaxCallStack(parseInt(e.target.value));
          }}
          onWheel={(e) => e.target.blur()}
          className="border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[80px] p-2.5 text-center"
          placeholder="10"
          autoComplete="off"
        />
      </div>
    </div>
  );
}

function AgentClarifyingQuestions() {
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
          {t("agent.settings.clarifying-questions.title", {
            defaultValue: "Allow agent to ask clarifying questions",
          })}{" "}
          <i className="ml-1 text-xs text-white pl-2 bg-blue-500/40 rounded-md px-2 py-0.5">
            {t("agent.settings.clarifying-questions.beta-badge", {
              defaultValue: "BETA",
            })}
          </i>
        </label>
      </div>
      <div className="flex items-center gap-x-4">
        <p className="text-xs text-white/60">
          {t("agent.settings.clarifying-questions.description", {
            defaultValue:
              "When enabled, agents can pause to ask short clarifying questions if your prompt is ambiguous. Off by default. Not available for API/programmatic agent runs.",
          })}
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
                {t("agent.settings.clarifying-questions.max-per-turn.title", {
                  defaultValue: "Max questions per turn",
                })}
              </label>
              <p className="text-xs text-white/60">
                {t(
                  "agent.settings.clarifying-questions.max-per-turn.description",
                  {
                    defaultValue:
                      "How many clarifying questions the agent may ask in a single response. Lower is less interruptive.",
                  }
                )}
              </p>
            </div>
            <input
              type="number"
              name="agentClarifyingQuestionsMaxPerTurn"
              min={1}
              max={10}
              value={maxPerTurn}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!Number.isFinite(v) || v < 1) return;
                setMaxPerTurn(v);
                debouncedUpdateMaxPerTurn(v);
              }}
              onWheel={(e) => e.target.blur()}
              className="border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[80px] p-2.5 text-center"
              placeholder="3"
              autoComplete="off"
            />
          </div>
          <div className="flex items-center gap-x-4">
            <div className="flex flex-col gap-y-1 flex-1">
              <label className="block text-md font-medium text-white">
                {t("agent.settings.clarifying-questions.timeout.title", {
                  defaultValue: "Response timeout (seconds)",
                })}
              </label>
              <p className="text-xs text-white/60">
                {t("agent.settings.clarifying-questions.timeout.description", {
                  defaultValue:
                    "If the user does not respond within this time, the agent proceeds with its best judgment.",
                })}
              </p>
            </div>
            <input
              type="number"
              name="agentClarifyingQuestionsTimeoutSeconds"
              min={10}
              max={600}
              value={timeoutSeconds}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!Number.isFinite(v) || v < 10) return;
                setTimeoutSeconds(v);
                debouncedUpdateTimeout(v);
              }}
              onWheel={(e) => e.target.blur()}
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

function AgentSkillReranker() {
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
