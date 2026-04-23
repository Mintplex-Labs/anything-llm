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
  getAppIntegrationSkills,
} from "@/pages/Admin/Agents/skills";
import { getCreateFileSkills } from "@/pages/Admin/Agents/CreateFileSkillPanel";
import { getFileSystemSubSkills } from "@/pages/Admin/Agents/FileSystemSkillPanel";
import { getGmailSkills } from "@/pages/Admin/Agents/GMailSkillPanel/utils";
import { getGoogleCalendarSkills } from "@/pages/Admin/Agents/GoogleCalendarSkillPanel/utils";
import { getOutlookSkills } from "@/pages/Admin/Agents/OutlookSkillPanel/utils";
import useToolsMenuItems from "../../useToolsMenuItems";

function flattenCategorySkills(categorizedSkills) {
  return Object.values(categorizedSkills).flatMap(
    (category) => category.skills
  );
}
import SkillRow from "./SkillRow";
import SkillSection from "./SkillSection";
import { Wrench, MagnifyingGlass, CircleNotch } from "@phosphor-icons/react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";

const MIN_ITEMS_TO_SHOW_SEARCH = 10;

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
  const appIntegrationSkills = getAppIntegrationSkills(t);
  const [disabledDefaults, setDisabledDefaults] = useState([]);
  const [enabledConfigurable, setEnabledConfigurable] = useState([]);
  const [importedSkills, setImportedSkills] = useState([]);
  const [flows, setFlows] = useState([]);
  const [mcpServers, setMcpServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mcpLoading, setMcpLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedSubSections, setExpandedSubSections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [disabledCreateFilesSubSkills, setDisabledCreateFilesSubSkills] =
    useState([]);
  const [disabledFileSystemSubSkills, setDisabledFileSystemSubSkills] =
    useState([]);
  const [disabledGmailSubSkills, setDisabledGmailSubSkills] = useState([]);
  const [disabledGoogleCalendarSubSkills, setDisabledGoogleCalendarSubSkills] =
    useState([]);
  const [disabledOutlookSubSkills, setDisabledOutlookSubSkills] = useState([]);
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
          "disabled_create_files_skills",
          "disabled_filesystem_skills",
          "disabled_gmail_skills",
          "disabled_google_calendar_skills",
          "disabled_outlook_skills",
        ]),
        AgentFlows.listFlows(),
        System.isFileSystemAgentAvailable(),
      ]);

      if (prefs?.settings) {
        setDisabledDefaults(prefs.settings.disabled_agent_skills ?? []);
        setEnabledConfigurable(prefs.settings.default_agent_skills ?? []);
        setImportedSkills(prefs.settings.imported_agent_skills ?? []);
        setDisabledCreateFilesSubSkills(
          prefs.settings.disabled_create_files_skills ?? []
        );
        setDisabledFileSystemSubSkills(
          prefs.settings.disabled_filesystem_skills ?? []
        );
        setDisabledGmailSubSkills(prefs.settings.disabled_gmail_skills ?? []);
        setDisabledGoogleCalendarSubSkills(
          prefs.settings.disabled_google_calendar_skills ?? []
        );
        setDisabledOutlookSubSkills(
          prefs.settings.disabled_outlook_skills ?? []
        );
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

  function toggleSubSection(subSectionId) {
    setExpandedSubSections((prev) => ({
      ...prev,
      [subSectionId]: !prev[subSectionId],
    }));
  }

  function isSubSectionExpanded(subSectionId) {
    return !!(searchQuery.trim() || expandedSubSections[subSectionId]);
  }

  function isSubSkillEnabled(skillKey, subSkillName) {
    if (skillKey === "create-files-agent") {
      return !disabledCreateFilesSubSkills.includes(subSkillName);
    }
    if (skillKey === "filesystem-agent") {
      return !disabledFileSystemSubSkills.includes(subSkillName);
    }
    if (skillKey === "gmail-agent") {
      return !disabledGmailSubSkills.includes(subSkillName);
    }
    if (skillKey === "google-calendar-agent") {
      return !disabledGoogleCalendarSubSkills.includes(subSkillName);
    }
    if (skillKey === "outlook-agent") {
      return !disabledOutlookSubSkills.includes(subSkillName);
    }
    return true;
  }

  async function toggleSubSkill(skillKey, subSkillName) {
    if (skillKey === "create-files-agent") {
      const updated = toggleItem(disabledCreateFilesSubSkills, subSkillName);
      setDisabledCreateFilesSubSkills(updated);
      await Admin.updateSystemPreferences({
        disabled_create_files_skills: updated.join(","),
      });
    } else if (skillKey === "filesystem-agent") {
      const updated = toggleItem(disabledFileSystemSubSkills, subSkillName);
      setDisabledFileSystemSubSkills(updated);
      await Admin.updateSystemPreferences({
        disabled_filesystem_skills: updated.join(","),
      });
    } else if (skillKey === "gmail-agent") {
      const updated = toggleItem(disabledGmailSubSkills, subSkillName);
      setDisabledGmailSubSkills(updated);
      await Admin.updateSystemPreferences({
        disabled_gmail_skills: updated.join(","),
      });
    } else if (skillKey === "google-calendar-agent") {
      const updated = toggleItem(disabledGoogleCalendarSubSkills, subSkillName);
      setDisabledGoogleCalendarSubSkills(updated);
      await Admin.updateSystemPreferences({
        disabled_google_calendar_skills: updated.join(","),
      });
    } else if (skillKey === "outlook-agent") {
      const updated = toggleItem(disabledOutlookSubSkills, subSkillName);
      setDisabledOutlookSubSkills(updated);
      await Admin.updateSystemPreferences({
        disabled_outlook_skills: updated.join(","),
      });
    }
  }

  function getSubSkillsForSkill(skillKey) {
    if (skillKey === "create-files-agent") return getCreateFileSkills(t);
    if (skillKey === "filesystem-agent") return getFileSystemSubSkills(t);
    if (skillKey === "gmail-agent")
      return flattenCategorySkills(getGmailSkills(t));
    if (skillKey === "google-calendar-agent")
      return flattenCategorySkills(getGoogleCalendarSkills(t));
    if (skillKey === "outlook-agent")
      return flattenCategorySkills(getOutlookSkills(t));
    return null;
  }

  // Build sections of grouped items
  const sections = useMemo(() => {
    const sectionList = [];

    // Agent Skills (default + configurable, excluding app integrations)
    const skillItems = [];
    for (const [key, { title }] of Object.entries({
      ...defaultSkills,
      ...configurableSkills,
    })) {
      const subSkills = getSubSkillsForSkill(key);
      const parentEnabled = isSkillEnabled(key);
      skillItems.push({
        id: key,
        name: title,
        enabled: parentEnabled,
        onToggle: () => toggleSkill(key),
        hasSubSkills: !!subSkills,
        subSkills: subSkills
          ? subSkills.map((sub) => ({
              id: `${key}::${sub.name}`,
              name: sub.title,
              enabled: parentEnabled && isSubSkillEnabled(key, sub.name),
              onToggle: () => toggleSubSkill(key, sub.name),
              parentEnabled,
            }))
          : null,
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

    // App Integrations (Gmail, Google Calendar, Outlook)
    const appIntegrationItems = [];
    for (const [key, { title }] of Object.entries(appIntegrationSkills)) {
      const subSkills = getSubSkillsForSkill(key);
      const parentEnabled = isSkillEnabled(key);
      appIntegrationItems.push({
        id: key,
        name: title,
        enabled: parentEnabled,
        onToggle: () => toggleSkill(key),
        hasSubSkills: !!subSkills,
        subSkills: subSkills
          ? subSkills.map((sub) => ({
              id: `${key}::${sub.name}`,
              name: sub.title,
              enabled: parentEnabled && isSubSkillEnabled(key, sub.name),
              onToggle: () => toggleSubSkill(key, sub.name),
              parentEnabled,
            }))
          : null,
      });
    }
    if (appIntegrationItems.length > 0) {
      sectionList.push({
        id: "app-integrations",
        name: t("chat_window.app_integrations"),
        items: appIntegrationItems,
        enabledCount: appIntegrationItems.filter((i) => i.enabled).length,
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
    disabledCreateFilesSubSkills,
    disabledFileSystemSubSkills,
    disabledGmailSubSkills,
    disabledGoogleCalendarSubSkills,
    disabledOutlookSubSkills,
  ]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map((section) => {
        const items = section.items.filter((item) => {
          const nameMatches = item.name.toLowerCase().includes(q);
          const subSkillMatches =
            item.subSkills?.some((sub) => sub.name.toLowerCase().includes(q)) ??
            false;
          return nameMatches || subSkillMatches;
        });
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

          if (item.hasSubSkills && item.subSkills) {
            indexMap[`subsection-${item.id}`] = items.length;
            items.push({
              type: "subheader",
              id: `subsection-${item.id}`,
              parentId: item.id,
              onToggle: () => toggleSubSection(item.id),
            });

            if (isSubSectionExpanded(item.id)) {
              for (const subItem of item.subSkills) {
                indexMap[subItem.id] = items.length;
                items.push(subItem);
              }
            }
          }
        }
      }
    }
    return { flatItems: items, flatIndexMap: indexMap };
  }, [filteredSections, expandedSections, expandedSubSections, searchQuery]);

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
      {totalItemCount >= MIN_ITEMS_TO_SHOW_SEARCH && (
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
            <div key={item.id}>
              <SkillRow
                name={item.name}
                enabled={item.enabled}
                onToggle={item.onToggle}
                highlighted={highlightedIndex === flatIndexMap[item.id]}
                disabled={agentSessionActive}
              />
              {item.hasSubSkills && item.subSkills && item.enabled && (
                <SkillSection
                  name="Sub-skills"
                  expanded={isSubSectionExpanded(item.id)}
                  onToggle={() => toggleSubSection(item.id)}
                  enabledCount={item.subSkills.filter((s) => s.enabled).length}
                  totalCount={item.subSkills.length}
                  highlighted={
                    highlightedIndex === flatIndexMap[`subsection-${item.id}`]
                  }
                  indented
                >
                  {item.subSkills.map((subItem) => (
                    <SkillRow
                      key={subItem.id}
                      name={subItem.name}
                      enabled={subItem.enabled}
                      onToggle={subItem.onToggle}
                      highlighted={
                        highlightedIndex === flatIndexMap[subItem.id]
                      }
                      disabled={agentSessionActive || !subItem.parentEnabled}
                    />
                  ))}
                </SkillSection>
              )}
            </div>
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
