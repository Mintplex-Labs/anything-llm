import { useState, useEffect } from "react";
import { titleCase } from "text-case";
import {
  BookOpenText,
  ArrowsClockwise,
  CaretRight,
} from "@phosphor-icons/react";
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
          <img src={MCPLogo} className="w-5 h-5 light:invert" alt="MCP Logo" />
          <p className="text-sm font-semibold">MCP Servers</p>
        </div>
        <div className="flex items-center gap-x-3">
          <a
            href="https://docs.anythingllm.com/mcp-compatibility/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="border-none text-cta-button hover:text-theme-text-secondary"
          >
            <BookOpenText size={16} weight="bold" />
          </a>
          <button
            type="button"
            onClick={refreshMCPServers}
            disabled={loadingMcpServers}
            className="border-none text-cta-button hover:text-theme-text-secondary flex items-center gap-x-1"
          >
            <ArrowsClockwise
              size={16}
              className={loadingMcpServers ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>
      {children({ loadingMcpServers })}
    </>
  );
}

export function MCPServersList({
  servers = [],
  selectedServer = null,
  handleClick = null,
  toggleServer = () => {},
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>Loading MCP servers...</p>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>No MCP servers found</p>
        <a
          href="https://docs.anythingllm.com/mcp/getting-started"
          target="_blank"
          rel="noreferrer"
          className="text-theme-text-secondary underline hover:text-cta-button"
        >
          Learn more about MCP.
        </a>
      </div>
    );
  }

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl w-full md:min-w-[360px]">
      {servers.map((server) => (
        <div
          key={server.name}
          onClick={() => handleClick?.(server)}
          className={`
            relative
            cursor-pointer
            transition-all duration-300
            after:content-['']
            after:absolute
            after:bottom-0
            after:left-4
            after:right-4
            after:h-[1px]
            after:bg-theme-action-menu-bg
            last:after:hidden
            first:rounded-t-xl
            last:rounded-b-xl
            ${selectedServer?.name === server.name ? "bg-white/10 light:bg-theme-bg-sidebar" : "hover:bg-theme-bg-primary"}
          `}
        >
          <div className="flex items-center justify-between h-[36px] px-4">
            <div className="text-sm font-medium">
              {titleCase(server.name.replace(/[_-]/g, " "))}
            </div>
            <div className="flex items-center gap-x-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleServer(server.name);
                }}
                className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: server.running ? "#32D583" : "#CFCFD0",
                }}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                    server.running ? "translate-x-[14px]" : "translate-x-[2px]"
                  }`}
                />
              </div>
              <CaretRight
                size={14}
                weight="bold"
                className="text-theme-text-secondary"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
