import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { At, Flask, X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import { useTranslation } from "react-i18next";

export default function AvailableAgentsButton({ showing, setShowAgents }) {
  const { t } = useTranslation();
  const agentSessionActive = useIsAgentSessionActive();
  if (agentSessionActive) return null;
  return (
    <div
      id="agent-list-btn"
      data-tooltip-id="tooltip-agent-list-btn"
      data-tooltip-content={t("availableAgents.tooltip")}
      aria-label={t("availableAgents.tooltip")}
      onClick={() => setShowAgents(!showing)}
      className={`flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer ${
        showing ? "!opacity-100" : ""
      }`}
    >
      <At className="w-6 h-6 pointer-events-none text-white" />
      <Tooltip
        id="tooltip-agent-list-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
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
  const { t } = useTranslation();
  const formRef = useRef(null);
  const agentSessionActive = useIsAgentSessionActive();
  useEffect(() => {
    function listenForOutsideClick() {
      if (!showing || !formRef.current) return false;
      document.addEventListener("click", closeIfOutside);
    }
    listenForOutsideClick();
  }, [showing, formRef.current]);

  const closeIfOutside = ({ target }) => {
    if (target.id === "agent-list-btn") return;
    const isOutside = !formRef?.current?.contains(target);
    if (!isOutside) return;
    setShowing(false);
  };

  if (agentSessionActive) return null;
  return (
    <>
      <div hidden={!showing}>
        <div className="w-full flex justify-center absolute bottom-[130px] md:bottom-[150px] left-0 z-10 px-4">
          <div
            ref={formRef}
            className="w-[600px] p-2 bg-zinc-800 rounded-2xl shadow flex-col justify-center items-start gap-2.5 inline-flex"
          >
            <button
              onClick={() => {
                setShowing(false);
                sendCommand("@agent ", false);
                promptRef?.current?.focus();
              }}
              className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start group"
            >
              <div className="w-full flex-col text-left flex pointer-events-none">
                <div className="text-white text-sm">
                  <b>@agent</b> - {t("availableAgents.defaultAgent")}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <AbilityTag text="rag-search" />
                  <AbilityTag text="web-scraping" />
                  <AbilityTag text="web-browsing" />
                  <AbilityTag text="save-file-to-browser" />
                  <AbilityTag text="list-documents" />
                  <AbilityTag text="summarize-document" />
                  <AbilityTag text="chart-generation" />
                </div>
              </div>
            </button>
            <button
              type="button"
              disabled={true}
              className="w-full rounded-xl flex flex-col justify-start group"
            >
              <div className="w-full flex-col text-center flex pointer-events-none">
                <div className="text-white text-xs text-white/50 italic">
                  {t("availableAgents.customAgentsComingSoon")}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      {showing && <FirstTimeAgentUser />}
    </>
  );
}

export function useAvailableAgents() {
  const [showAgents, setShowAgents] = useState(false);
  return { showAgents, setShowAgents };
}

const SEEN_FT_AGENT_MODAL = "anythingllm_seen_first_time_agent_modal";
function FirstTimeAgentUser() {
  const { t } = useTranslation();
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
            <Flask className="text-green-400" size={24} weight="fill" />
            <h3 className="text-xl font-semibold text-white">
              {t("availableAgents.firstTime.title")}
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
                {t("availableAgents.firstTime.description")}
              </p>
              <p className="text-green-300/60 text-xs md:text-sm">
                {t("availableAgents.firstTime.earlyAccess")}
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
              {t("availableAgents.firstTime.continue")}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
