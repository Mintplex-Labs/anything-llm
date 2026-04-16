import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { titleCase } from "text-case";
import paths from "@/utils/paths";
import Admin from "@/models/admin";
import System from "@/models/system";
import AgentPlugins from "@/models/experimental/agentPlugins";
import AgentFlows from "@/models/agentFlows";
import MCPServers from "@/models/mcpServers";
import {
  getDefaultSkills,
  getConfigurableSkills,
} from "@/pages/Admin/Agents/skills";
import useToolsMenuItems from "../../useToolsMenuItems";
import SkillRow from "./SkillRow";
import SkillSection from "./SkillSection";
import { Wrench, MagnifyingGlass, CircleNotch } from "@phosphor-icons/react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";

const SEARCH_THRESHOLD = 10;

export default function AgentSkillsTab({
  highlightedIndex = -1,
  registerItemCount,
  workspace,
}) {
  const { t } = useTranslation();
  const { showAgentCommand = true } = workspace ?? {};
  const agentSessionActive = useIsAgentSessionActive();
  const defaultSkills = getDefaultSkills(t);
  const [fileSystemAgentAvailable, setFileSystemAgentAvailable] =
    useState(false);
  const configurableSkills = getConfigurableSkills(t, {
    fileSystemAgentAvailable,
  });
  const [disabledDefaults, setDisabledDefaults] = useState([]);
  const [enabledConfigurable, setEnabledConfigurable] = useState([]);
  const [importedSkills, setImportedSkills] = useState([]);
  const [flows, setFlows] = useState([]);
  const [mcpServers, setMcpServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mcpLoading, setMcpLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const showAgentCmdActivationAlert = showAgentCommand && !agentSessionActive;

  useEffect(() => {
    fetchSkillSettings();
    fetchMcpServers();
  }, []);

  async function fetchSkillSettings() {
    try {
      const [prefs, flowsRes, fsAgentAvailable] = await Promise.all([
        Admin.systemPreferencesByFields([
          "disabled_agent_skills",
          "default_agent_skills",
          "imported_agent_skills",
        ]),
        AgentFlows.listFlows(),
        System.isFileSystemAgentAvailable(),
      ]);

      if (prefs?.settings) {
        setDisabledDefaults(prefs.settings.disabled_agent_skills ?? []);
        setEnabledConfigurable(prefs.settings.default_agent_skills ?? []);
        setImportedSkills(prefs.settings.imported_agent_skills ?? []);
      }
      if (flowsRes?.flows) setFlows(flowsRes.flows);
      setFileSystemAgentAvailable(fsAgentAvailable);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMcpServers() {
    try {
      const { servers = [] } = await MCPServers.listServers();
      setMcpServers(servers);
    } catch (e) {
      console.error(e);
    } finally {
      setMcpLoading(false);
    }
  }

  function toggleItem(arr, item) {
    return arr.includes(item) ? arr.filter((s) => s !== item) : [...arr, item];
  }

  function isSkillEnabled(key) {
    return key in defaultSkills
      ? !disabledDefaults.includes(key)
      : enabledConfigurable.includes(key);
  }

  function isSectionExpanded(sectionId) {
    return !!(searchQuery.trim() || expandedSections[sectionId]);
  }

  async function toggleSkill(key) {
    if (key in defaultSkills) {
      const updated = toggleItem(disabledDefaults, key);
      setDisabledDefaults(updated);
      await Admin.updateSystemPreferences({
        disabled_agent_skills: updated.join(","),
        default_agent_skills: enabledConfigurable.join(","),
      });
      return;
    }

    const updated = toggleItem(enabledConfigurable, key);
    setEnabledConfigurable(updated);
    await Admin.updateSystemPreferences({
      disabled_agent_skills: disabledDefaults.join(","),
      default_agent_skills: updated.join(","),
    });
  }

  async function toggleImportedSkill(skill) {
    const newActive = !skill.active;
    setImportedSkills((prev) =>
      prev.map((s) =>
        s.hubId === skill.hubId ? { ...s, active: newActive } : s
      )
    );
    await AgentPlugins.toggleFeature(skill.hubId, newActive);
  }

  async function toggleFlow(flow) {
    const newActive = !flow.active;
    setFlows((prev) =>
      prev.map((f) => (f.uuid === flow.uuid ? { ...f, active: newActive } : f))
    );
    await AgentFlows.toggleFlow(flow.uuid, newActive);
  }

  async function toggleMcpTool(serverName, toolName, currentlyEnabled) {
    const newEnabled = !currentlyEnabled;
    setMcpServers((prev) => {
      const updated = prev.map((server) => {
        if (server.name !== serverName) return server;
        const currentSuppressed =
          server.config?.anythingllm?.suppressedTools || [];
        const newSuppressed = newEnabled
          ? currentSuppressed.filter((t) => t !== toolName)
          : [...currentSuppressed, toolName];
        return {
          ...server,
          config: {
            ...server.config,
            anythingllm: {
              ...server.config?.anythingllm,
              suppressedTools: newSuppressed,
            },
          },
        };
      });
      return updated;
    });
    await MCPServers.toggleTool(serverName, toolName, newEnabled);
  }

  function toggleSection(sectionId) {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }

  // Build sections of grouped items
  const sections = useMemo(() => {
    const sectionList = [];

    // Agent Skills (default + configurable)
    const skillItems = [];
    for (const [key, { title }] of Object.entries({
      ...defaultSkills,
      ...configurableSkills,
    })) {
      skillItems.push({
        id: key,
        name: title,
        enabled: isSkillEnabled(key),
        onToggle: () => toggleSkill(key),
      });
    }
    if (skillItems.length > 0) {
      sectionList.push({
        id: "agent-skills",
        name: t("chat_window.agent_skills"),
        items: skillItems,
        enabledCount: skillItems.filter((i) => i.enabled).length,
      });
    }

    // Custom Skills (imported)
    if (importedSkills.length > 0) {
      const items = importedSkills.map((skill) => ({
        id: skill.hubId,
        name: skill.name,
        enabled: skill.active,
        onToggle: () => toggleImportedSkill(skill),
      }));
      sectionList.push({
        id: "custom-skills",
        name: t("chat_window.custom_skills"),
        items,
        enabledCount: items.filter((i) => i.enabled).length,
      });
    }

    // Agent Flows
    if (flows.length > 0) {
      const items = flows.map((flow) => ({
        id: flow.uuid,
        name: flow.name,
        enabled: flow.active,
        onToggle: () => toggleFlow(flow),
      }));
      sectionList.push({
        id: "agent-flows",
        name: t("chat_window.agent_flows"),
        items,
        enabledCount: items.filter((i) => i.enabled).length,
      });
    }

    // MCP Servers (one section per running server with tools)
    for (const server of mcpServers) {
      if (!server.running || server.tools.length === 0) continue;
      const suppressedTools = server.config?.anythingllm?.suppressedTools || [];
      const items = server.tools.map((tool) => ({
        id: `mcp::${server.name}::${tool.name}`,
        name: tool.name,
        enabled: !suppressedTools.includes(tool.name),
        onToggle: () =>
          toggleMcpTool(
            server.name,
            tool.name,
            !suppressedTools.includes(tool.name)
          ),
      }));
      sectionList.push({
        id: `mcp-${server.name}`,
        name: titleCase(server.name.replace(/[_-]/g, " ")),
        isMcp: true,
        items,
        enabledCount: items.filter((i) => i.enabled).length,
      });
    }

    return sectionList;
  }, [
    disabledDefaults,
    enabledConfigurable,
    importedSkills,
    flows,
    mcpServers,
    fileSystemAgentAvailable,
  ]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map((section) => {
        const items = section.items.filter((item) =>
          item.name.toLowerCase().includes(q)
        );
        return {
          ...section,
          items,
          enabledCount: items.filter((i) => i.enabled).length,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [sections, searchQuery]);

  // Flat list of navigable items (headers + visible children) for keyboard nav
  const { flatItems, flatIndexMap } = useMemo(() => {
    const items = [];
    const indexMap = {};
    for (const section of filteredSections) {
      indexMap[section.id] = items.length;
      items.push({
        type: "header",
        id: section.id,
        onToggle: () => toggleSection(section.id),
      });
      if (isSectionExpanded(section.id)) {
        for (const item of section.items) {
          indexMap[item.id] = items.length;
          items.push(item);
        }
      }
    }
    return { flatItems: items, flatIndexMap: indexMap };
  }, [filteredSections, expandedSections, searchQuery]);

  const totalItemCount = sections.reduce((sum, s) => sum + s.items.length, 0);

  useToolsMenuItems({
    items: flatItems,
    highlightedIndex,
    onSelect: (item) => {
      if (item.type === "header") return item.onToggle();
      if (!agentSessionActive) item.onToggle();
    },
    registerItemCount,
  });

  if (loading) return null;

  return (
    <>
      {showAgentCmdActivationAlert && (
        <p className="text-xs text-theme-text-secondary text-center py-1">
          {t("chat_window.use_agent_session_to_use_tools")}
        </p>
      )}
      {totalItemCount >= SEARCH_THRESHOLD && (
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("common.search")}
        />
      )}
      {filteredSections.map((section) => (
        <SkillSection
          key={section.id}
          name={section.name}
          expanded={isSectionExpanded(section.id)}
          onToggle={() => toggleSection(section.id)}
          enabledCount={section.enabledCount}
          totalCount={section.items.length}
          isMcp={section.isMcp}
          highlighted={highlightedIndex === flatIndexMap[section.id]}
        >
          {section.items.map((item) => (
            <SkillRow
              key={item.id}
              name={item.name}
              enabled={item.enabled}
              onToggle={item.onToggle}
              highlighted={highlightedIndex === flatIndexMap[item.id]}
              disabled={agentSessionActive}
            />
          ))}
        </SkillSection>
      ))}
      {mcpLoading && (
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <CircleNotch
            size={12}
            className="text-zinc-500 light:text-slate-400 animate-spin"
            weight="bold"
          />
          <span className="text-[10px] text-zinc-500 light:text-slate-400">
            {t("chat_window.loading_mcp_servers")}
          </span>
        </div>
      )}
      {filteredSections.length === 0 && !mcpLoading && searchQuery.trim() && (
        <p className="text-xs text-zinc-500 light:text-slate-400 text-center py-2">
          {t("chat_window.no_tools_found")}
        </p>
      )}
      <Link to={paths.settings.agentSkills()}>
        <button className="border-none flex items-center gap-1.5 px-2 h-6 rounded cursor-pointer hover:bg-zinc-700/50 light:hover:bg-slate-100 text-theme-text-primary">
          <Wrench size={12} className="text-theme-text-primary" />
          <span className="text-xs text-theme-text-primary">
            {t("chat_window.manage_agent_skills")}
          </span>
        </button>
      </Link>
    </>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative shrink-0">
      <MagnifyingGlass
        size={12}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 light:text-slate-400"
        weight="bold"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            e.target.blur();
          }
          if (e.key === "Enter") e.preventDefault();
        }}
        className="w-full pl-7 pr-2 py-1 text-xs bg-zinc-700/50 light:bg-slate-100 border border-zinc-600 light:border-slate-300 rounded text-white light:text-slate-900 placeholder:text-zinc-500 light:placeholder:text-slate-400 outline-none focus:border-zinc-500 light:focus:border-slate-400"
      />
    </div>
  );
}
