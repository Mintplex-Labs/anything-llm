import { useMemo } from "react";
import { titleCase } from "text-case";
import {
  getSubSkillsForSkill,
  hasSubSkills,
  isSkillMultiUserSupported,
} from "./skillRegistry";

/**
 * Builds a skill item with optional sub-skills.
 */
function buildSkillItem({
  key,
  title,
  t,
  instanceSkillEnabled,
  skillState,
  isSubSkillEnabled,
}) {
  const subSkills = getSubSkillsForSkill(key, t);
  const { enabled: parentEnabled, toggle } = skillState(
    key,
    instanceSkillEnabled(key)
  );

  return {
    id: key,
    name: title,
    enabled: parentEnabled,
    onToggle: toggle,
    hasSubSkills: hasSubSkills(key),
    subSkills: subSkills
      ? subSkills.map((sub) => {
          const { enabled, toggle } = skillState(
            sub.name,
            isSubSkillEnabled(key, sub.name)
          );
          return {
            id: `${key}::${sub.name}`,
            name: sub.title,
            enabled: parentEnabled && enabled,
            onToggle: toggle,
            parentEnabled,
          };
        })
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
  isMultiUser,
  instanceSkillEnabled,
  skillState,
  isSubSkillEnabled,
}) {
  return useMemo(() => {
    const sectionList = [];
    const skillItemOpts = {
      t,
      instanceSkillEnabled,
      skillState,
      isSubSkillEnabled,
    };

    // Agent Skills (default + configurable)
    const skillItems = [];
    for (const [key, { title, mode }] of Object.entries({
      ...defaultSkills,
      ...configurableSkills,
    })) {
      if (isMultiUser && mode?.includes("singleUserOnly")) continue;
      skillItems.push(buildSkillItem({ key, title, ...skillItemOpts }));
    }
    if (skillItems.length > 0) {
      sectionList.push({
        id: "agent-skills",
        name: t("chat_window.agent_skills"),
        items: skillItems,
        enabledCount: skillItems.filter((i) => i.enabled).length,
      });
    }

    // App Integrations — skip skills unsupported in multi-user mode
    const appIntegrationItems = [];
    for (const [key, { title }] of Object.entries(appIntegrationSkills)) {
      if (isMultiUser && !isSkillMultiUserSupported(key)) continue;
      appIntegrationItems.push(
        buildSkillItem({ key, title, ...skillItemOpts })
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
      const items = importedSkills.map((skill) => {
        const { enabled, toggle } = skillState(skill.hubId, skill.active);
        return {
          id: skill.hubId,
          name: skill.name,
          enabled,
          onToggle: toggle,
        };
      });
      sectionList.push({
        id: "custom-skills",
        name: t("chat_window.custom_skills"),
        items,
        enabledCount: items.filter((i) => i.enabled).length,
      });
    }

    // Agent Flows
    if (flows.length > 0) {
      const items = flows.map((flow) => {
        const id = `@@flow_${flow.uuid}`;
        const { enabled, toggle } = skillState(id, flow.active);
        return {
          id,
          name: flow.name,
          enabled,
          onToggle: toggle,
        };
      });
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
      const items = server.tools.map((tool) => {
        const id = `${server.name}-${tool.name}`;
        const { enabled, toggle } = skillState(
          id,
          !suppressedTools.includes(tool.name),
          { serverName: server.name }
        );
        return {
          id,
          name: tool.name,
          enabled,
          onToggle: toggle,
        };
      });
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
    isMultiUser,
    instanceSkillEnabled,
    skillState,
    isSubSkillEnabled,
  ]);
}
