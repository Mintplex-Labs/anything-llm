import React from "react";
import { titleCase } from "text-case";

export default function MCPServersList({
  servers = [],
  selectedServer,
  handleClick,
}) {
  if (servers.length === 0) {
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>No MCP servers found</p>
        <a
          href="https://docs.anythingllm.com/mcp-servers/getting-started"
          target="_blank"
          className="text-theme-text-secondary underline hover:text-cta-button"
        >
          Learn more about MCP Servers.
        </a>
      </div>
    );
  }

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl min-w-[360px] w-fit">
      {servers.map((server, index) => (
        <div
          key={server.name}
          className={`py-3 px-4 flex items-center justify-between ${
            index === 0 ? "rounded-t-xl" : ""
          } ${
            index === servers.length - 1
              ? "rounded-b-xl"
              : "border-b border-white/10"
          } cursor-pointer transition-all duration-300 hover:bg-theme-bg-primary ${
            selectedServer?.name === server.name
              ? "bg-white/10 light:bg-theme-bg-sidebar"
              : ""
          }`}
          onClick={() => handleClick?.(server)}
        >
          <div className="text-sm font-light">
            {titleCase(server.name.replace(/[_-]/g, " "))}
          </div>
          <div className="flex items-center gap-x-2">
            <div
              className={`text-sm text-theme-text-secondary font-medium ${server.running ? "text-green-500" : "text-red-500"}`}
            >
              {server.running ? "On" : "Stopped"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
