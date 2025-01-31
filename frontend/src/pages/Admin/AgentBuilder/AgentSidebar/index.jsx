import React from "react";
import { FloppyDisk, FolderOpen } from "@phosphor-icons/react";
import useLogo from "@/hooks/useLogo";

export default function AgentSidebar({
  agentName,
  setAgentName,
  agentDescription,
  setAgentDescription,
  onSave,
  onLoadClick,
  onNewClick,
}) {
  const { logo } = useLogo();

  return (
    <div className="w-80">
      <div className="relative m-[16px] rounded-[16px] bg-theme-bg-secondary border-[2px] border-theme-sidebar-border light:border-none min-w-[250px] p-[5px] h-[calc(100%-35px)]">
        <div className="p-[10px]">
          <div className="flex justify-between w-[250px] min-w-[250px]">
            <img
              src={logo}
              alt="Logo"
              className="rounded max-h-[24px] object-contain mb-1"
            />
          </div>
          <div className="flex flex-col mb-6">
            <span className="text-xs font-light text-theme-text-primary">
              Agent Task Builder
            </span>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Name
              </label>
              <input
                type="text"
                placeholder="Agent Name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Description
              </label>
              <textarea
                placeholder="Agent Description"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                rows={3}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={onNewClick}
              className="transition-all duration-300 text-xs px-4 py-2.5 font-semibold rounded-lg bg-theme-bg-primary hover:bg-theme-action-menu-item-hover border-2 border-white/10 text-white w-full flex items-center justify-center gap-2"
            >
              New Task
            </button>
            <button
              onClick={onLoadClick}
              className="transition-all duration-300 text-xs px-4 py-2.5 font-semibold rounded-lg bg-theme-bg-primary hover:bg-theme-action-menu-item-hover border-2 border-white/10 text-white w-full flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Load Task
            </button>
            <button
              onClick={onSave}
              className="transition-all duration-300 text-xs px-4 py-2.5 font-semibold rounded-lg bg-primary-button hover:bg-secondary border-2 border-transparent hover:border-primary-button hover:text-white w-full flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
            >
              <FloppyDisk className="w-4 h-4" />
              Save Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
