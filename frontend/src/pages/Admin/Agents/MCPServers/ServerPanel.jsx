import React, { useState, useEffect, useRef } from "react";
import showToast from "@/utils/toast";
import { CaretDown, Gear, Warning } from "@phosphor-icons/react";
import MCPLogo from "@/media/agents/mcp-logo.svg";
import { titleCase } from "text-case";
import MCPServers from "@/models/mcpServers";
import { SimpleToggleSwitch } from "@/components/lib/Toggle";
import { useTranslation, Trans } from "react-i18next";

function ManageServerMenu({ server, toggleServer, onDelete }) {
  const { t } = useTranslation();
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
              {running
                ? t("agent.mcp.stop-server")
                : t("agent.mcp.start-server")}
            </span>
          </button>
          <button
            type="button"
            onClick={deleteServer}
            className="border-none flex items-center rounded-lg gap-x-2 hover:bg-theme-action-menu-item-hover py-1.5 px-2 transition-colors duration-200 w-full text-left"
          >
            <span className="text-sm">{t("agent.mcp.delete-server")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ServerPanel({
  server,
  toggleServer,
  onDelete,
  onToggleTool,
}) {
  const { t } = useTranslation();
  const suppressedTools = server.config?.anythingllm?.suppressedTools || [];
  const enabledToolCount = server.tools.filter(
    (tool) => !suppressedTools.includes(tool.name)
  ).length;

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[800px]">
          <ToolCountWarningBanner
            server={server}
            enabledToolCount={enabledToolCount}
          />
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-x-2">
              <img src={MCPLogo} className="w-6 h-6 light:invert" />
              <label htmlFor="name" className="text-white text-md font-bold">
                {titleCase(server.name.replace(/[_-]/g, " "))}
              </label>
              {server.tools.length > 0 && (
                <p className="text-theme-text-secondary text-sm">
                  {enabledToolCount}/{server.tools.length}{" "}
                  {t("agent.mcp.tools-enabled")}
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
          <RenderServerTools
            serverName={server.name}
            tools={server.tools}
            suppressedTools={suppressedTools}
            onToggleTool={onToggleTool}
          />
        </div>
      </div>
    </>
  );
}

function ToolCountWarningBanner({ server, enabledToolCount }) {
  if (server.tools.length <= 10) return null;
  if (enabledToolCount <= 10) return null;

  return (
    <div className="flex items-center gap-x-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <Warning className="h-5 w-5 text-yellow-500 shrink-0" weight="fill" />
      <p className="text-yellow-500 text-sm">
        <Trans
          i18nKey={`agent.mcp.tool-count-warning`}
          values={{ count: enabledToolCount }}
          components={{ b: <b />, br: <br /> }}
        />
      </p>
    </div>
  );
}

function RenderServerConfig({ config = null }) {
  const { t } = useTranslation();
  if (!config) return null;
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-theme-text-primary text-sm">
        {t("agent.mcp.startup-command")}
      </p>
      <div className="bg-theme-bg-primary rounded-lg p-4">
        <p className="text-theme-text-secondary text-sm text-left">
          <span className="font-bold">{t("agent.mcp.command")}:</span>{" "}
          {config.command}
        </p>
        <p className="text-theme-text-secondary text-sm text-left">
          <span className="font-bold">{t("agent.mcp.arguments")}:</span>{" "}
          {config.args ? config.args.join(" ") : t("common.none")}
        </p>
      </div>
    </div>
  );
}

function RenderServerStatus({ server }) {
  const { t } = useTranslation();
  if (server.running || !server.error) return null;
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-theme-text-primary text-sm">
        {t("agent.mcp.not-running-warning")}
      </p>
      <div className="bg-theme-bg-primary rounded-lg p-4">
        <p className="text-red-500 text-sm font-mono">{server.error}</p>
      </div>
    </div>
  );
}

function RenderServerTools({
  serverName,
  tools = [],
  suppressedTools = [],
  onToggleTool,
}) {
  if (tools.length === 0) return null;
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-2">
        {tools.map((tool) => (
          <ServerTool
            key={tool.name}
            serverName={serverName}
            tool={tool}
            enabled={!suppressedTools.includes(tool.name)}
            onToggle={onToggleTool}
          />
        ))}
      </div>
    </div>
  );
}

function ServerTool({ serverName, tool, enabled, onToggle }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex flex-col gap-y-2 px-4 py-2 rounded-lg border ${
        enabled
          ? "border-theme-text-secondary"
          : "border-theme-text-secondary/50 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 min-w-0 flex-1">
          <SimpleToggleSwitch
            size="md"
            enabled={enabled}
            onChange={(newEnabled) =>
              onToggle?.(serverName, tool.name, newEnabled)
            }
          />
          <p className="text-theme-text-primary font-mono font-bold text-sm shrink-0">
            {tool.name}
          </p>
          {!open && (
            <p className="text-theme-text-secondary text-sm truncate">
              {tool.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-x-3">
          <div
            className={`border-none text-theme-text-secondary hover:text-cta-button transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            <CaretDown size={16} />
          </div>
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
              {t("agent.mcp.tool-call-arguments")}
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
