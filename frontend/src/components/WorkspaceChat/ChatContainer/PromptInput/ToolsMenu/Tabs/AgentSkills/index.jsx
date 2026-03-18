import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import Admin from "@/models/admin";
import AgentPlugins from "@/models/experimental/agentPlugins";
import AgentFlows from "@/models/agentFlows";
import {
  getDefaultSkills,
  getConfigurableSkills,
} from "@/pages/Admin/Agents/skills";
import useToolsMenuItems from "../../useToolsMenuItems";
import SkillRow from "./SkillRow";
import { Wrench } from "@phosphor-icons/react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function AgentSkillsTab({
  highlightedIndex = -1,
  registerItemCount,
  workspace,
}) {
  const { t } = useTranslation();
  const { showAgentCommand = true } = workspace ?? {};
  const agentSessionActive = useIsAgentSessionActive();
  const defaultSkills = getDefaultSkills(t);
  const configurableSkills = getConfigurableSkills(t);
  const [disabledDefaults, setDisabledDefaults] = useState([]);
  const [enabledConfigurable, setEnabledConfigurable] = useState([]);
  const [importedSkills, setImportedSkills] = useState([]);
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const showAgentCmdActivationAlert = showAgentCommand && !agentSessionActive;

  useEffect(() => {
    fetchSkillSettings();
  }, []);

  async function fetchSkillSettings() {
    try {
      const [prefs, flowsRes] = await Promise.all([
        Admin.systemPreferencesByFields([
          "disabled_agent_skills",
          "default_agent_skills",
          "imported_agent_skills",
        ]),
        AgentFlows.listFlows(),
      ]);

      if (prefs?.settings) {
        setDisabledDefaults(prefs.settings.disabled_agent_skills ?? []);
        setEnabledConfigurable(prefs.settings.default_agent_skills ?? []);
        setImportedSkills(prefs.settings.imported_agent_skills ?? []);
      }
      if (flowsRes?.flows) setFlows(flowsRes.flows);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  // Build list of all skill items for rendering/keyboard navigation
  const items = useMemo(() => {
    const list = [];
    for (const [key, { title }] of Object.entries({
      ...defaultSkills,
      ...configurableSkills,
    })) {
      list.push({
        id: key,
        name: title,
        enabled: isSkillEnabled(key),
        onToggle: () => toggleSkill(key),
      });
    }
    for (const skill of importedSkills) {
      list.push({
        id: skill.hubId,
        name: skill.name,
        enabled: skill.active,
        onToggle: () => toggleImportedSkill(skill),
      });
    }
    for (const flow of flows) {
      list.push({
        id: flow.uuid,
        name: flow.name,
        enabled: flow.active,
        onToggle: () => toggleFlow(flow),
      });
    }
    return list;
  }, [disabledDefaults, enabledConfigurable, importedSkills, flows]);

  useToolsMenuItems({
    items,
    highlightedIndex,
    onSelect: agentSessionActive ? () => {} : (item) => item.onToggle(),
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
      {items.map((item, index) => (
        <SkillRow
          key={item.id}
          name={item.name}
          enabled={item.enabled}
          onToggle={item.onToggle}
          highlighted={highlightedIndex === index}
          disabled={agentSessionActive}
        />
      ))}
      <Link to={paths.settings.agentSkills()}>
        <button className="flex items-center gap-1.5 px-2 h-6 rounded cursor-pointer hover:bg-zinc-700/50 light:hover:bg-slate-100 text-theme-text-primary">
          <Wrench size={12} className="text-theme-text-primary" />
          <span className="text-xs text-theme-text-primary">
            {t("chat_window.manage_agent_skills")}
          </span>
        </button>
      </Link>
    </>
  );
}
