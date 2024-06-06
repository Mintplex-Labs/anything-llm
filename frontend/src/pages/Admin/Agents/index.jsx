import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import CTAButton from "@/components/lib/CTAButton";
import AgentWebSearchSelection from "./WebSearchSelection";
import AgentSQLConnectorSelection from "./SQLConnectorSelection";
import GenericSkill from "./GenericSkill";
import { CaretRight, Robot } from "@phosphor-icons/react";

const defaultSkills = {
  "rag-memory": {
    title: "RAG & long-term memory",
    description:
      'Allow the agent to leverage your local documents to answer a query or ask the agent to "remember" pieces of content for long-term memory retrieval.',
    enabled: true,
    component: GenericSkill,
  },
  "view-summarize": {
    title: "View & summarize documents",
    description:
      "Allow the agent to list and summarize the content of workspace files currently embedded.",
    enabled: true,
    component: GenericSkill,
  },
  "scrape-websites": {
    title: "Scrape websites",
    description: "Allow the agent to visit and scrape the content of websites.",
    enabled: true,
    component: GenericSkill,
  },
};

const configurableSkills = {
  "web-search": {
    title: "Web Search",
    component: AgentWebSearchSelection,
    enabled: true,
  },
  "sql-connector": {
    title: "SQL Connector",
    component: AgentSQLConnectorSelection,
    enabled: true,
  },
  "create-chart": {
    title: "Generate charts",
    description:
      "Enable the default agent to generate various types of charts from data provided or given in chat.",
    skill: "create-chart",
    component: GenericSkill,
    enabled: true,
  },
  "save-file": {
    title: "Generate & save files to browser",
    description:
      "Enable the default agent to generate and write to files that save and can be downloaded in your browser.",
    skill: "save-file-to-browser",
    component: GenericSkill,
    enabled: true,
  },
};

export default function AdminAgents() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({});
  const [selectedSkill, setSelectedSkill] = useState("");
  const [agentSkills, setAgentSkills] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await Admin.updateSystemPreferences({
      ...settings,
      default_agent_skills: agentSkills,
    });
    setSaving(false);
    setHasChanges(false);
    showToast("System preferences updated successfully.", "success");
  };

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await Admin.systemPreferences();
      setSettings(_settings?.settings ?? {});
      console.log("default_agent_skills", _settings?.settings);
      setAgentSkills(_settings?.settings?.default_agent_skills ?? []);
    }
    fetchSettings();
  }, []);

  function toggleAgentSkill(skillName = "") {
    setAgentSkills((prev) => {
      setHasChanges(true);
      return prev.includes(skillName)
        ? prev.filter((name) => name !== skillName)
        : [...prev, skillName];
    });
  }

  const SelectedSkillComponent =
    configurableSkills[selectedSkill]?.component ||
    defaultSkills[selectedSkill]?.component;

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-full h-full flex"
      >
        <div className="flex-1 flex gap-x-6 p-4 mt-10">
          {/* Skill settings nav */}
          <div className="flex flex-col gap-y-[18px]">
            <div className="text-white flex items-center gap-x-2">
              <Robot size={24} />
              <p className="text-lg font-medium">Agent Skills</p>
            </div>
            {/* Default skills */}
            <div className="bg-white/5 text-white min-w-[360px] w-fit rounded-xl">
              {Object.entries(defaultSkills).map(([skill, settings], index) => (
                <div
                  key={skill}
                  className={`py-3 px-4 flex items-center justify-between ${
                    index === 0 ? "rounded-t-xl" : ""
                  } ${
                    index === Object.keys(defaultSkills).length - 1
                      ? "rounded-b-xl"
                      : "border-b border-white/10"
                  } cursor-pointer transition-all duration-300  hover:bg-white/10 ${
                    selectedSkill === skill ? "bg-white/20" : ""
                  }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  <div className="text-sm">{settings.title}</div>
                  <CaretRight
                    size={14}
                    weight="bold"
                    className="text-white/80"
                  />
                </div>
              ))}
            </div>

            {/* Configurable skills */}
            <div className="bg-white/5 text-white min-w-[360px] w-fit rounded-xl">
              {Object.entries(configurableSkills).map(
                ([skill, settings], index) => (
                  <div
                    key={skill}
                    className={`py-3 px-4 flex items-center justify-between ${
                      index === 0 ? "rounded-t-xl" : ""
                    } ${
                      index === Object.keys(configurableSkills).length - 1
                        ? "rounded-b-xl"
                        : "border-b border-white/10"
                    } transition-all duration-300 cursor-pointer hover:bg-white/10 ${
                      selectedSkill === skill ? "bg-white/20" : ""
                    }`}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="text-sm">{settings.title}</div>
                    <div className="flex items-center gap-x-2">
                      <div className="text-sm text-white/60 font-medium">
                        {settings.enabled ? "On" : "Off"}
                      </div>

                      <CaretRight
                        size={14}
                        weight="bold"
                        className="text-white/80"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Selected agent skill */}
          <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
            <div className="bg-[#303237] text-white rounded-xl flex-1 p-4">
              {SelectedSkillComponent ? (
                <SelectedSkillComponent
                  skill={selectedSkill}
                  settings={settings}
                  toggleSkill={toggleAgentSkill}
                  enabled={agentSkills.includes(
                    configurableSkills[selectedSkill]?.skill
                  )}
                  {...(configurableSkills[selectedSkill] ||
                    defaultSkills[selectedSkill])}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/60">
                  <Robot size={40} />
                  <p className="font-medium">Select an agent skill</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
