import React from 'react';
import { ArrowsClockwise } from "@phosphor-icons/react";

export default function AgentSidebar({ agentName, setAgentName, agentDescription, setAgentDescription, generateJson }) {
  return (
    <div className="w-80 border-r border-theme-sidebar-border bg-theme-bg-secondary p-6 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-medium  text-theme-text-primary mb-6">Agent Builder</h1>
          <div className="space-y-4">
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

        <button
          onClick={generateJson}
          className="transition-all duration-300 text-xs px-4 py-2.5 font-semibold rounded-lg bg-primary-button hover:bg-secondary border-2 border-transparent hover:border-primary-button hover:text-white w-full flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
        >
          <ArrowsClockwise className="w-4 h-4" />
          Generate JSON
        </button>
      </div>
    </div>
  );
}