import { useState, useEffect } from "react";
import Admin from "@/models/admin";
import AgentPlugins from "@/models/experimental/agentPlugins";
import AgentFlows from "@/models/agentFlows";
import paths from "@/utils/paths";
import SkillRow from "./SkillRow";
import BrowseButton from "../../BrowseButton";

// Default skills are enabled by default; toggling adds to disabled_agent_skills
const DEFAULT_SKILL_NAMES = [
  "rag-memory",
  "document-summarizer",
  "web-scraping",
];

// All built-in skills with display names
const ALL_SKILLS = {
  "rag-memory": "RAG & long-term memory",
  "document-summarizer": "View & summarize documents",
  "web-scraping": "Scrape websites",
  "save-file-to-browser": "Generate & save files",
  "create-chart": "Generate charts",
  "web-browsing": "Web Search",
  "sql-agent": "SQL Connector",
};

export default function AgentSkillsTab() {
  const [disabledDefaults, setDisabledDefaults] = useState([]);
  const [enabledConfigurable, setEnabledConfigurable] = useState([]);
  const [importedSkills, setImportedSkills] = useState([]);
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  function isSkillEnabled(skillName) {
    if (DEFAULT_SKILL_NAMES.includes(skillName))
      return !disabledDefaults.includes(skillName);
    return enabledConfigurable.includes(skillName);
  }

  async function toggleSkill(skillName) {
    let newDisabled = [...disabledDefaults];
    let newEnabled = [...enabledConfigurable];

    if (DEFAULT_SKILL_NAMES.includes(skillName)) {
      if (newDisabled.includes(skillName))
        newDisabled = newDisabled.filter((s) => s !== skillName);
      else newDisabled.push(skillName);
    } else {
      if (newEnabled.includes(skillName))
        newEnabled = newEnabled.filter((s) => s !== skillName);
      else newEnabled.push(skillName);
    }

    setDisabledDefaults(newDisabled);
    setEnabledConfigurable(newEnabled);

    await Admin.updateSystemPreferences({
      disabled_agent_skills: newDisabled.join(","),
      default_agent_skills: newEnabled.join(","),
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

  if (loading) return null;

  return (
    <>
      {Object.entries(ALL_SKILLS).map(([key, name]) => (
        <SkillRow
          key={key}
          name={name}
          enabled={isSkillEnabled(key)}
          onToggle={() => toggleSkill(key)}
        />
      ))}
      {importedSkills.map((skill) => (
        <SkillRow
          key={skill.hubId}
          name={skill.name}
          enabled={skill.active}
          onToggle={() => toggleImportedSkill(skill)}
        />
      ))}
      {flows.map((flow) => (
        <SkillRow
          key={flow.uuid}
          name={flow.name}
          enabled={flow.active}
          onToggle={() => toggleFlow(flow)}
        />
      ))}
      <BrowseButton link={paths.communityHub.trending()} />
    </>
  );
}
