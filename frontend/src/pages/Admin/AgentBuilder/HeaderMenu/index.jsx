import { CaretDown, CaretUp, Plus, CaretLeft } from "@phosphor-icons/react";
import AnythingInfinityLogo from "@/media/logo/anything-llm-infinity.png";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";

export default function HeaderMenu({
  agentName,
  availableFlows = [],
  onNewFlow,
  onSaveFlow,
  onPublishFlow,
}) {
  const { t } = useTranslation();
  const { flowId = null } = useParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const hasOtherFlows =
    availableFlows.filter((flow) => flow.uuid !== flowId).length > 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute top-3 sm:top-[calc(40px+16px)] left-2 right-2 sm:left-4 sm:right-4 z-20">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-2 sm:gap-3 max-w-[1700px] mx-auto">
        {/* Left: back + builder selector */}
        <div className="flex items-center gap-x-2 min-w-0 flex-1">
          <button
            onClick={() => navigate(paths.settings.agentSkills())}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-theme-settings-input-bg border border-white/10 hover:bg-theme-action-menu-bg transition-colors duration-300"
            aria-label="Back"
          >
            <CaretLeft
              weight="bold"
              className="w-5 h-5 text-theme-text-primary"
            />
          </button>
          <div
            className="flex items-center bg-theme-settings-input-bg rounded-md border border-white/10 pointer-events-auto min-w-0 flex-1 sm:flex-initial"
            ref={dropdownRef}
          >
            <button
              onClick={() => navigate(paths.settings.agentSkills())}
              className="!border-t-transparent !border-l-transparent !border-b-transparent flex items-center gap-x-1.5 sm:gap-x-2 px-2.5 sm:px-4 py-2 border-r border-white/10 hover:bg-theme-action-menu-bg transition-colors duration-300 shrink-0"
            >
              <img
                src={AnythingInfinityLogo}
                alt="logo"
                className="w-[18px] sm:w-[20px] light:invert"
              />
              <span className="text-theme-text-primary text-xs sm:text-sm uppercase tracking-widest">
                {t("agentBuilder.title")}
              </span>
            </button>
            <div className="relative min-w-0 flex-1">
              <button
                disabled={!hasOtherFlows}
                className="border-none flex items-center justify-between gap-x-1 text-theme-text-primary text-sm px-2.5 sm:px-4 py-2 enabled:hover:bg-theme-action-menu-bg transition-colors duration-300 w-full min-w-0 sm:min-w-[160px] md:min-w-[200px] max-w-full sm:max-w-[300px]"
                onClick={() => {
                  if (!agentName && !hasOtherFlows) {
                    const agentNameInput = document.getElementById(
                      "agent-flow-name-input"
                    );
                    if (agentNameInput) agentNameInput.focus();
                    return;
                  }
                  setShowDropdown(!showDropdown);
                }}
              >
                <span
                  className={`text-xs sm:text-sm font-medium truncate ${!!agentName ? "text-theme-text-primary " : "text-theme-text-secondary"}`}
                >
                  {agentName || t("agentBuilder.untitledFlow")}
                </span>
                {hasOtherFlows && (
                  <div className="flex flex-col ml-1 sm:ml-2 shrink-0">
                    <CaretUp size={10} />
                    <CaretDown size={10} />
                  </div>
                )}
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full min-w-[180px] max-w-[min(350px,calc(100vw-2rem))] bg-theme-settings-input-bg border border-white/10 rounded-md shadow-lg z-50 animate-fadeUpIn">
                  {availableFlows
                    .filter((flow) => flow.uuid !== flowId)
                    .map((flow, index) => (
                      <button
                        key={flow?.uuid || `flow-${index}`}
                        onClick={() => {
                          navigate(paths.agents.editAgent(flow.uuid));
                          setShowDropdown(false);
                        }}
                        className="border-none w-full text-left px-2 py-1.5 text-sm text-theme-text-primary hover:bg-theme-action-menu-bg transition-colors duration-300"
                      >
                        <span className="block truncate">
                          {flow?.name || t("agentBuilder.untitledFlow")}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: actions — full width row on mobile, end-aligned on larger */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-x-[15px] shrink-0">
          <button
            onClick={onNewFlow}
            className="flex items-center gap-x-1 sm:gap-x-2 text-theme-text-primary text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 rounded-lg border border-white bg-theme-settings-input-bg hover:bg-theme-action-menu-bg transition-colors duration-300"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t("agentBuilder.newFlow")}</span>
          </button>
          <button
            onClick={onPublishFlow}
            className="px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border border-white/10 bg-theme-bg-primary text-theme-text-primary hover:bg-theme-action-menu-bg transition-all duration-300 whitespace-nowrap"
          >
            {t("agentBuilder.publish")}
          </button>
          <button
            onClick={onSaveFlow}
            className="border-none bg-primary-button hover:opacity-80 text-black light:text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {t("agentBuilder.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
