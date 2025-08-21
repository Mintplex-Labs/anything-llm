import React, { useState, useEffect, useRef } from "react";
import showToast from "@/utils/toast";
import { CaretDown, Gear } from "@phosphor-icons/react";
import MCPLogo from "@/media/agents/mcp-logo.svg";
import { titleCase } from "text-case";
import truncate from "truncate";
import MCPServers from "@/models/mcpServers";
import pluralize from "pluralize";

function ManageServerMenu({ server, toggleServer, onDelete }) {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(server.running);
  const menuRef = useRef(null);

  async function deleteServer() {
    if (
      !window.confirm(
        "Are you sure you want to delete this MCP server? It will be removed from your config file and you will need to add it back manually."
      )
    )
      return;
    const { success, error } = await MCPServers.deleteServer(server.name);
    if (success) {
      showToast("MCP server deleted successfully.", "success");
      onDelete(server.name);
    } else {
      showToast(error || "Failed to delete MCP server.", "error");
    }
  }

  async function handleToggleServer() {
    if (
      !window.confirm(
        running
          ? "Are you sure you want to stop this MCP server? It will be started automatically when you next start the server."
          : "Are you sure you want to start this MCP server? It will be started automatically when you next start the server."
      )
    )
      return;

    const { success, error } = await MCPServers.toggleServer(server.name);
    if (success) {
      const newState = !running;
      setRunning(newState);
      toggleServer(server.name);
      showToast(
        `MCP server ${server.name} ${newState ? "started" : "stopped"} successfully.`,
        "success",
        { clear: true }
      );
    } else {
      showToast(error || "Failed to toggle MCP server.", "error", {
        clear: true,
      });
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
      >
        <Gear className="h-5 w-5" weight="bold" />
      </button>
      {open && (
        <div className="absolute w-[150px] top-1 left-7 mt-1 border-[1.5px] border-white/40 rounded-lg bg-theme-action-menu-bg flex flex-col shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-white z-99 md:z-10">
          <button
            type="button"
            onClick={handleToggleServer}
            className="border-none flex items-center rounded-lg gap-x-2 hover:bg-theme-action-menu-item-hover py-1.5 px-2 transition-colors duration-200 w-full text-left"
          >
            <span className="text-sm">
              {running ? "Stop MCP Server" : "Start MCP Server"}
            </span>
          </button>
          <button
            type="button"
            onClick={deleteServer}
            className="border-none flex items-center rounded-lg gap-x-2 hover:bg-theme-action-menu-item-hover py-1.5 px-2 transition-colors duration-200 w-full text-left"
          >
            <span className="text-sm">Delete MCP Server</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ServerPanel({ server, toggleServer, onDelete }) {
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[800px]">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-x-2">
              <img src={MCPLogo} className="w-6 h-6 light:invert" />
              <label htmlFor="name" className="text-white text-md font-bold">
                {titleCase(server.name.replace(/[_-]/g, " "))}
              </label>
              {server.tools.length > 0 && (
                <p className="text-theme-text-secondary text-sm">
                  {server.tools.length} {pluralize("tool", server.tools.length)}{" "}
                  available
                </p>
              )}
            </div>
            <ManageServerMenu
              key={server.name}
              server={server}
              toggleServer={toggleServer}
              onDelete={onDelete}
            />
          </div>
          <RenderServerConfig config={server.config} />
          <RenderServerStatus server={server} />
          <RenderServerTools tools={server.tools} />
        </div>
      </div>
    </>
  );
}

function RenderServerConfig({ config = null }) {
  if (!config) return null;
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-theme-text-primary text-sm">Startup Command</p>
      <div className="bg-theme-bg-primary rounded-lg p-4">
        <p className="text-theme-text-secondary text-sm text-left">
          <span className="font-bold">Command:</span> {config.command}
        </p>
        <p className="text-theme-text-secondary text-sm text-left">
          <span className="font-bold">Arguments:</span>{" "}
          {config.args ? config.args.join(" ") : "None"}
        </p>
      </div>
    </div>
  );
}

function RenderServerStatus({ server }) {
  if (server.running || !server.error) return null;
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-theme-text-primary text-sm">
        This MCP server is not running - it may be stopped or experiencing an
        error on startup.
      </p>
      <div className="bg-theme-bg-primary rounded-lg p-4">
        <p className="text-red-500 text-sm font-mono">{server.error}</p>
      </div>
    </div>
  );
}

function RenderServerTools({ tools = [] }) {
  if (tools.length === 0) return null;
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-2">
        {tools.map((tool) => (
          <ServerTool key={tool.name} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function ServerTool({ tool }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="flex flex-col gap-y-2 px-4 py-2 rounded-lg border border-theme-text-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <p className="text-theme-text-primary font-mono font-bold text-sm">
            {tool.name}
          </p>
          {!open && (
            <p className="text-theme-text-secondary text-sm">
              {truncate(tool.description, 70)}
            </p>
          )}
        </div>
        <div className="border-none text-theme-text-secondary hover:text-cta-button">
          <CaretDown size={16} />
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-2">
            <p className="text-theme-text-secondary text-sm text-left">
              {tool.description}
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-theme-text-primary text-sm text-left">
              Tool call arguments
            </p>
            <div className="flex flex-col gap-y-2">
              {Object.entries(tool.inputSchema?.properties || {}).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center gap-x-2">
                    <p className="text-theme-text-secondary text-sm text-left font-bold">
                      {key}
                      {tool.inputSchema?.required?.includes(key) && (
                        <sup className="text-red-500">*</sup>
                      )}
                    </p>
                    <p className="text-theme-text-secondary text-sm text-left">
                      {value.type}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
