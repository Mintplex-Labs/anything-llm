import React from 'react';

export default function AgentSidebar({ agentName, setAgentName, agentDescription, setAgentDescription, generateJson }) {
  return (
    <div className="w-80 border-r border-theme-sidebar-border bg-theme-bg-secondary p-6 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-theme-text-primary mb-6">Agent Builder</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Agent Name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                Description
              </label>
              <textarea
                placeholder="Agent Description"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
                rows={3}
              />
            </div>
          </div>
        </div>

        <button
          onClick={generateJson}
          className="w-full p-2 bg-theme-bg-primary hover:bg-theme-bg-hover border border-theme-sidebar-border rounded text-theme-text-primary flex items-center justify-center gap-2"
        >
          Generate JSON
        </button>
      </div>
    </div>
  );
}