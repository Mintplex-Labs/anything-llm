import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function AvailableAgentsButton({ showing, setShowAgents }) {
  return null; // Hide the icon by returning null
}

function AbilityTag({ text }) {
  return (
    <div className="px-2 bg-white/20 text-white/60 text-black text-xs w-fit rounded-sm">
      <p>{text}</p>
    </div>
  );
}

export function AvailableAgents({
  showing,
  setShowing,
  sendCommand,
  promptRef,
}) {
  return null; // Hide the icon by returning null
}

export function useAvailableAgents() {
  const [showAgents, setShowAgents] = useState(false);
  return { showAgents, setShowAgents };
}

const SEEN_FT_AGENT_MODAL = "anythingllm_seen_first_time_agent_modal";
function FirstTimeAgentUser() {
  const { isOpen, openModal, closeModal } = useModal();
  useEffect(() => {
    function firstTimeShow() {
      if (!window) return;
      if (!window.localStorage.getItem(SEEN_FT_AGENT_MODAL)) openModal();
    }
    firstTimeShow();
  }, []);

  const dismiss = () => {
    closeModal();
    window.localStorage.setItem(SEEN_FT_AGENT_MODAL, 1);
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="relative w-[500px] max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-center gap-x-1 justify-between p-4 border-b rounded-t border-gray-600">
            <h3 className="text-xl font-semibold text-white">
              You just discovered Agents!
            </h3>
            <button
              onClick={dismiss}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <div className="p-6 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <p className="text-white/80 text-xs md:text-sm">
                Agents are your LLM, but with special abilities that{" "}
                <u>do something beyond chatting with your documents</u>.
                <br />
                <br />
                Now you can use agents for real-time web search and scraping,
                saving documents to your browser, summarizing documents, and
                more.
              </p>
              <p className="text-green-300/60 text-xs md:text-sm">
                This feature is currently early access and fully custom agents
                with custom integrations & code execution will be in a future
                update.
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-600">
            <div />
            <button
              onClick={dismiss}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
