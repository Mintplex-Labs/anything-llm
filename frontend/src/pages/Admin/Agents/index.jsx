import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import CTAButton from "@/components/lib/CTAButton";
import AgentWebSearchSelection from "./WebSearchSelection";
import AgentSQLConnectorSelection from "./SQLConnectorSelection";
import GenericSkill from "./GenericSkill";

const skillComponents = {
  "web-search": AgentWebSearchSelection,
  "sql-connector": AgentSQLConnectorSelection,
  "rag-memory": GenericSkill,
  "view-summarize": GenericSkill,
  "scrape-websites": GenericSkill,
  "create-chart": GenericSkill,
  "save-file": GenericSkill,
};

const skillSettings = {
  "web-search": {
    title: "Web Search",
  },
  "sql-connector": {
    title: "SQL Connector",
  },
  "rag-memory": {
    title: "RAG & long-term memory",
    description:
      'Allow the agent to leverage your local documents to answer a query or ask the agent to "remember" pieces of content for long-term memory retrieval.',
    enabled: true,
    disabled: true,
  },
  "view-summarize": {
    title: "View & summarize documents",
    description:
      "Allow the agent to list and summarize the content of workspace files currently embedded.",
    enabled: true,
    disabled: true,
  },
  "scrape-websites": {
    title: "Scrape websites",
    description: "Allow the agent to visit and scrape the content of websites.",
    enabled: true,
    disabled: true,
  },
  "create-chart": {
    title: "Generate charts",
    description:
      "Enable the default agent to generate various types of charts from data provided or given in chat.",
    skill: "create-chart",
  },
  "save-file": {
    title: "Generate & save files to browser",
    description:
      "Enable the default agent to generate and write to files that save and can be downloaded in your browser.",
    skill: "save-file-to-browser",
  },
};

export default function AdminAgents() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({});
  const [selectedSkill, setSelectedSkill] = useState("web-search");
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

  const SelectedSkillComponent = skillComponents[selectedSkill];

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full flex flex-col"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16 flex-grow"
        >
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-white">
                Available Agents
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              Improve the natural abilities of the default agent with these
              pre-built skills. This setup applies to all workspaces.
            </p>
          </div>
          {hasChanges && (
            <div className="flex justify-end">
              <CTAButton type="submit" className="mt-3 mr-0">
                {saving ? "Saving..." : "Save changes"}
              </CTAButton>
            </div>
          )}
          <div className="bg-[#222628] rounded-lg mt-5 flex flex-grow overflow-y-scroll">
            <div className="w-1/4 min-w-[200px] p-5 flex flex-col gap-y-2">
              {Object.keys(skillComponents).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`text-white w-full justify-start flex text-sm ${
                    selectedSkill === skill ? "bg-white/10 font-semibold" : ""
                  }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  {skillSettings[skill]?.title || skill}
                </button>
              ))}
            </div>
            <div className="w-[2px] bg-white/20 mx-4" />
            <div className="w-3/4 flex-grow p-6">
              <SelectedSkillComponent
                skill={selectedSkill}
                settings={settings}
                toggleSkill={toggleAgentSkill}
                enabled={agentSkills.includes(
                  skillSettings[selectedSkill]?.skill
                )}
                {...skillSettings[selectedSkill]}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
