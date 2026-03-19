import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import { CircleNotch, SlidersHorizontal, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import Toggle from "@/components/lib/Toggle";
import System from "@/models/system";
import debounce from "lodash.debounce";

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
  if (!isOpen) return null;
  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="w-[500px] bg-theme-bg-sidebar px-6 py-4 rounded-lg flex flex-col items-center justify-between relative shadow-lg border border-white/10">
        <div className="w-full flex items-center justify-between">
          <div className="text-white text-left font-medium text-lg">
            Agent Skill Settings
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
            <AgentSkillReranker />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

function AgentSkillReranker() {
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
    <div className="flex flex-col gap-y-2 mt-4">
      <div className="flex items-center gap-x-1">
        <label className="block text-md font-medium text-white flex items-center gap-x-1">
          Intelligent Skill Selection{" "}
          <i className="ml-1 text-xs text-white pl-2 bg-blue-500/40 rounded-md px-2 py-0.5">
            Beta
          </i>
        </label>
      </div>
      <div className="flex items-center gap-x-4">
        <p className="text-xs text-white/60">
          Enable unlimited tools and cut token usage by up to 80% per query —
          AnythingLLM automatically selects the right skills for every prompt.
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
        <div className="flex items-center gap-x-4 mt-2">
          <div className="flex flex-col gap-y-1 flex-1">
            <label className="block text-md font-medium text-white">
              Max Tools
            </label>
            <p className="text-xs text-white/60">
              The maximum number of tools to select for each query. We recommend
              setting this to higher values for larger context models.
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
