import { useState, useEffect } from "react";
import { titleCase } from "text-case";
import { BookOpenText, ArrowClockwise } from "@phosphor-icons/react";
import MCPLogo from "@/media/agents/mcp-logo.svg";
import MCPServers from "@/models/mcpServers";
import showToast from "@/utils/toast";

export function MCPServerHeader({
  setMcpServers,
  setSelectedMcpServer,
  children,
}) {
  const [loadingMcpServers, setLoadingMcpServers] = useState(false);
  useEffect(() => {
    async function fetchMCPServers() {
      setLoadingMcpServers(true);
      const { servers = [] } = await MCPServers.listServers();
      setMcpServers(servers);
      setLoadingMcpServers(false);
    }
    fetchMCPServers();
  }, []);

  // Refresh the list of MCP servers
  const refreshMCPServers = () => {
    if (
      window.confirm(
        "Are you sure you want to refresh the list of MCP servers? This will restart all MCP servers and reload their tools."
      )
    ) {
      setLoadingMcpServers(true);
      MCPServers.forceReload()
        .then(({ servers = [] }) => {
          setSelectedMcpServer(null);
          setMcpServers(servers);
        })
        .catch((err) => {
          console.error(err);
          showToast(`Failed to refresh MCP servers.`, "error", { clear: true });
        })
        .finally(() => {
          setLoadingMcpServers(false);
        });
    }
  };

  return (
    <>
      <div className="text-theme-text-primary flex items-center justify-between gap-x-2 mt-4">
        <div className="flex items-center gap-x-2">
          <img src={MCPLogo} className="w-6 h-6 light:invert" alt="MCP Logo" />
          <p className="text-lg font-medium">MCP Servers</p>
        </div>
        <div className="flex items-center gap-x-3">
          <a
            href="https://docs.anythingllm.com/mcp-compatibility/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="border-none text-theme-text-secondary hover:text-cta-button"
          >
            <BookOpenText size={16} />
          </a>
          <button
            type="button"
            onClick={refreshMCPServers}
            disabled={loadingMcpServers}
            className="border-none text-theme-text-secondary hover:text-cta-button flex items-center gap-x-1"
          >
            <ArrowClockwise
              size={16}
              className={loadingMcpServers ? "animate-spin" : ""}
            />
            <p className="text-sm">
              {loadingMcpServers ? "Loading..." : "Refresh"}
            </p>
          </button>
        </div>
      </div>
      {children({ loadingMcpServers })}
    </>
  );
}

export function MCPServersList({
  isLoading = false,
  servers = [],
  selectedServer,
  handleClick,
}) {
  if (isLoading) {
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>Loading MCP Servers from configuration file...</p>
        <a
          href="https://docs.anythingllm.com/mcp-compatibility/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme-text-secondary underline hover:text-cta-button"
        >
          Learn more about MCP Servers.
        </a>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>No MCP servers found</p>
        <a
          href="https://docs.anythingllm.com/mcp-compatibility/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme-text-secondary underline hover:text-cta-button"
        >
          Learn more about MCP Servers.
        </a>
      </div>
    );
  }

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl w-full md:min-w-[360px]">
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
