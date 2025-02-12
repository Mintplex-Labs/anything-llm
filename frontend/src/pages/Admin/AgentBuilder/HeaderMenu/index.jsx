import { CaretDown, CaretUp, Plus, FloppyDisk } from "@phosphor-icons/react";
import AnythingInfinityLogo from "@/media/logo/anything-llm-infinity.png";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";

export default function HeaderMenu({
  agentName,
  availableFlows,
  onLoadFlow,
  onNewFlow,
  onSaveFlow,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
    <div className="absolute top-4 left-4 right-4 pointer-events-none">
      <div className="flex justify-between items-center max-w-[1700px] mx-auto">
        <div
          className="flex items-center bg-theme-action-menu-bg rounded-md border border-white/10 pointer-events-auto"
          ref={dropdownRef}
        >
          <button
            onClick={() => navigate(paths.settings.agentSkills())}
            className="flex items-center gap-x-1 px-4 py-3 border-r border-white/10 hover:bg-theme-action-menu-item-hover transition-colors duration-300"
          >
            <img
              src={AnythingInfinityLogo}
              alt="logo"
              className="w-[20px] light:invert"
            />
            <span className="text-theme-text-primary text-sm font-medium">
              Builder
            </span>
          </button>
          <div className="relative">
            <button
              className="flex items-center justify-between gap-x-1 text-theme-text-primary text-sm px-4 py-3 hover:bg-theme-action-menu-item-hover transition-colors duration-300 min-w-[200px] max-w-[300px]"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-theme-text-primary text-sm font-medium truncate">
                {agentName || "-----------------"}
              </span>
              <div className="flex flex-col ml-2 shrink-0">
                <CaretUp size={10} />
                <CaretDown size={10} />
              </div>
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] max-w-[300px] bg-theme-action-menu-bg border border-white/10 rounded-md shadow-lg z-50 animate-fadeUpIn">
                {availableFlows?.map((flow) => (
                  <button
                    key={flow?.uuid || Math.random()}
                    onClick={() => {
                      onLoadFlow(flow.uuid);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-theme-text-primary hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                  >
                    <span className="block truncate">
                      {flow?.name || "Untitled Flow"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-x-2 pointer-events-auto">
          <button
            onClick={onNewFlow}
            className="flex items-center gap-x-2 text-theme-text-primary text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-theme-action-menu-item-hover transition-colors duration-300 font-medium"
          >
            <Plus className="w-4 h-4" />
            New Flow
          </button>
          <button
            onClick={onSaveFlow}
            className="bg-cta-button hover:opacity-80 text-black px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <FloppyDisk className="w-4 h-4" />
            Save Flow
          </button>
        </div>
      </div>
    </div>
  );
}
