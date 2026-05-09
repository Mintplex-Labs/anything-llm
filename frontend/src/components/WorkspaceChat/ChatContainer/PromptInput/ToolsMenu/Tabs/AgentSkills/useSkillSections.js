import { useMemo } from "react";
import { titleCase } from "text-case";
import { getSubSkillsForSkill, hasSubSkills } from "./skillRegistry";

/**
 * Builds a skill item with optional sub-skills.
 */
function buildSkillItem({
  key,
  title,
  isEnabled,
  onToggle,
  t,
  isSubSkillEnabled,
  toggleSubSkill,
}) {
  const subSkills = getSubSkillsForSkill(key, t);
  const parentEnabled = isEnabled(key);

  return {
    id: key,
    name: title,
    enabled: parentEnabled,
    onToggle: () => onToggle(key),
    hasSubSkills: hasSubSkills(key),
    subSkills: subSkills
      ? subSkills.map((sub) => ({
          id: `${key}::${sub.name}`,
          name: sub.title,
          enabled: parentEnabled && isSubSkillEnabled(key, sub.name),
          onToggle: () => toggleSubSkill(key, sub.name),
          parentEnabled,
        }))
      : null,
  };
}

/**
 * Hook to build all skill sections for the menu.
 * Separates the section-building logic from the main component.
 */
export default function useSkillSections({
  t,
  defaultSkills,
  configurableSkills,
  appIntegrationSkills,
  importedSkills,
  flows,
  mcpServers,
  isSkillEnabled,
  toggleSkill,
  isSubSkillEnabled,
  toggleSubSkill,
  toggleImportedSkill,
  toggleFlow,
  toggleMcpTool,
  disabledSubSkills,
}) {
  return useMemo(() => {
    const sectionList = [];

    // Agent Skills (default + configurable)
    const skillItems = [];
    for (const [key, { title }] of Object.entries({
      ...defaultSkills,
      ...configurableSkills,
    })) {
      skillItems.push(
        buildSkillItem({
          key,
          title,
          isEnabled: isSkillEnabled,
          onToggle: toggleSkill,
          t,
          isSubSkillEnabled,
          toggleSubSkill,
        })
      );
    }
    if (skillItems.length > 0) {
      sectionList.push({
        id: "agent-skills",
        name: t("chat_window.agent_skills"),
        items: skillItems,
        enabledCount: skillItems.filter((i) => i.enabled).length,
      });
    }

    // App Integrations
    const appIntegrationItems = [];
    for (const [key, { title }] of Object.entries(appIntegrationSkills)) {
      appIntegrationItems.push(
        buildSkillItem({
          key,
          title,
          isEnabled: isSkillEnabled,
          onToggle: toggleSkill,
          t,
          isSubSkillEnabled,
          toggleSubSkill,
        })
      );
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

    // MCP Servers
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
    t,
    defaultSkills,
    configurableSkills,
    appIntegrationSkills,
    importedSkills,
    flows,
    mcpServers,
    isSkillEnabled,
    toggleSkill,
    isSubSkillEnabled,
    toggleSubSkill,
    toggleImportedSkill,
    toggleFlow,
    toggleMcpTool,
    disabledSubSkills,
  ]);
}
