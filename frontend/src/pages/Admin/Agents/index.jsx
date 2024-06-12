import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import AgentWebSearchSelection from "./WebSearchSelection";
import AgentSQLConnectorSelection from "./SQLConnectorSelection";
import GenericSkill from "./GenericSkill";
import DefaultSkill from "./DefaultSkill";
import {
  CaretRight,
  Robot,
  Brain,
  File,
  Browser,
  ChartBar,
  FileMagnifyingGlass,
  CaretLeft,
} from "@phosphor-icons/react";
import ContextualSaveBar from "@/components/ContextualSaveBar";
import { castToType } from "@/utils/types";
import RAGImage from "@/media/agents/rag-memory.png";
import SummarizeImage from "@/media/agents/view-summarize.png";
import ScrapeWebsitesImage from "@/media/agents/scrape-websites.png";
import GenerateChartsImage from "@/media/agents/generate-charts.png";
import GenerateSaveImages from "@/media/agents/generate-save-files.png";
import { FullScreenLoader } from "@/components/Preloader";
import DefaultBadge from "./DefaultBadge";

const defaultSkills = {
  "rag-memory": {
    title: "RAG & long-term memory",
    description:
      'Allow the agent to leverage your local documents to answer a query or ask the agent to "remember" pieces of content for long-term memory retrieval.',
    component: DefaultSkill,
    icon: Brain,
    image: RAGImage,
  },
  "view-summarize": {
    title: "View & summarize documents",
    description:
      "Allow the agent to list and summarize the content of workspace files currently embedded.",
    component: DefaultSkill,
    icon: File,
    image: SummarizeImage,
  },
  "scrape-websites": {
    title: "Scrape websites",
    description: "Allow the agent to visit and scrape the content of websites.",
    component: DefaultSkill,
    icon: Browser,
    image: ScrapeWebsitesImage,
  },
};

const configurableSkills = {
  "web-browsing": {
    title: "Web Search",
    component: AgentWebSearchSelection,
    skill: "web-browsing",
  },
  "sql-agent": {
    title: "SQL Agent",
    component: AgentSQLConnectorSelection,
    skill: "sql-agent",
  },
  "create-chart": {
    title: "Generate charts",
    description:
      "Enable the default agent to generate various types of charts from data provided or given in chat.",
    component: GenericSkill,
    skill: "create-chart",
    icon: ChartBar,
    image: GenerateChartsImage,
  },
  "save-file": {
    title: "Generate & save files to browser",
    description:
      "Enable the default agent to generate and write to files that save and can be downloaded in your browser.",
    component: GenericSkill,
    skill: "save-file-to-browser",
    icon: FileMagnifyingGlass,
    image: GenerateSaveImages,
  },
};

export default function AdminAgents() {
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({});
  const [selectedSkill, setSelectedSkill] = useState("");
  const [agentSkills, setAgentSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkillModal, setShowSkillModal] = useState(false);

  const formEl = useRef(null);

  // Alert user if they try to leave the page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      const _preferences = await Admin.systemPreferences();
      setSettings({ ..._settings, preferences: _preferences.settings } ?? {});
      setAgentSkills(_preferences.settings?.default_agent_skills ?? []);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const toggleAgentSkill = (skillName) => {
    setAgentSkills((prev) => {
      const updatedSkills = prev.includes(skillName)
        ? prev.filter((name) => name !== skillName)
        : [...prev, skillName];
      setHasChanges(true);
      return updatedSkills;
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = {
      workspace: {},
      system: {},
      env: {},
    };

    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) {
      if (key.startsWith("system::")) {
        const [_, label] = key.split("system::");
        data.system[label] = String(value);
        continue;
      }

      if (key.startsWith("env::")) {
        const [_, label] = key.split("env::");
        data.env[label] = String(value);
        continue;
      }
      data.workspace[key] = castToType(key, value);
    }
    const { success } = await Admin.updateSystemPreferences(data.system);
    await System.updateSystem(data.env);

    if (success) {
      const _settings = await System.keys();
      const _preferences = await Admin.systemPreferences();
      setSettings({ ..._settings, preferences: _preferences.settings } ?? {});
      setAgentSkills(_preferences.settings?.default_agent_skills ?? []);
      setLoading(false);
      setShowSkillModal(false);
    }

    setLoading(false);
    setHasChanges(false);
    showToast(`Agent preferences saved successfully.`, "success");
  };

  const SelectedSkillComponent =
    configurableSkills[selectedSkill]?.component ||
    defaultSkills[selectedSkill]?.component;

  if (loading) {
    return (
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-full h-full flex justify-center items-center"
      >
        <FullScreenLoader />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div
        id="workspace-agent-settings-container"
        className="w-screen h-screen overflow-hidden bg-sidebar flex mt-6"
      >
        <Sidebar />
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-full h-full flex"
        >
          <form
            onSubmit={handleSubmit}
            onChange={() => setHasChanges(true)}
            ref={formEl}
            className="flex flex-col w-full p-4 mt-10"
          >
            {/* Skill settings nav */}
            <div
              hidden={!showSkillModal}
              className="flex flex-col gap-y-[18px]"
            >
              <div className="text-white flex items-center gap-x-2">
                <Robot size={24} />
                <p className="text-lg font-medium">Agent Skills</p>
              </div>
              <div className="text-white/50 text-xs leading-[18px]">
                Improve the natural abilities of the default agent with these
                pre-built skills. This set up applies to all workspaces.
              </div>
              {/* Default skills */}
              <div className="bg-white/5 text-white min-w-[360px] w-full rounded-xl">
                <input
                  name="system::default_agent_skills"
                  type="hidden"
                  value={agentSkills.join(",")}
                />
                {Object.entries(defaultSkills).map(
                  ([skill, settings], index) => (
                    <div
                      key={skill}
                      className={`py-3 px-4 flex items-center justify-between ${
                        index === 0 ? "rounded-t-xl" : ""
                      } ${
                        index === Object.keys(defaultSkills).length - 1
                          ? "rounded-b-xl"
                          : "border-b border-white/10"
                      } cursor-pointer transition-all duration-300  hover:bg-white/5`}
                      onClick={() => {
                        setSelectedSkill(skill);
                        setShowSkillModal(true);
                      }}
                    >
                      <div className="text-sm font-light">{settings.title}</div>
                      <div className="flex items-center gap-x-2">
                        <DefaultBadge title={skill} />
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

              {/* Configurable skills */}
              <div className="bg-white/5 text-white min-w-[360px] w-full rounded-xl">
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
                      } transition-all duration-300 cursor-pointer hover:bg-white/5`}
                      onClick={() => {
                        setSelectedSkill(skill);
                        setShowSkillModal(true);
                      }}
                    >
                      <div className="text-sm font-light">{settings.title}</div>
                      <div className="flex items-center gap-x-2">
                        <div className="text-sm text-white/60 font-medium">
                          {agentSkills.includes(settings.skill) ? "On" : "Off"}
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

            {/* Selected agent skill modal */}
            {showSkillModal && (
              <div className="fixed top-0 left-0 w-full h-full bg-sidebar z-30">
                <div className="flex flex-col h-full">
                  <div className="flex items-center p-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSkillModal(false);
                        setSelectedSkill("");
                      }}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      <div className="flex items-center text-sky-400">
                        <CaretLeft size={24} />
                        <div>Back</div>
                      </div>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="bg-[#303237] text-white rounded-xl p-4">
                      {SelectedSkillComponent ? (
                        <SelectedSkillComponent
                          skill={configurableSkills[selectedSkill]?.skill}
                          settings={settings}
                          toggleSkill={toggleAgentSkill}
                          enabled={agentSkills.includes(
                            configurableSkills[selectedSkill]?.skill
                          )}
                          setHasChanges={setHasChanges}
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
            )}
          </form>
          {hasChanges && (
            <ContextualSaveBar
              onSave={handleSubmit}
              onCancel={() => setHasChanges(false)}
            />
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      id="workspace-agent-settings-container"
      className="w-screen h-screen overflow-hidden bg-sidebar flex"
    >
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-full h-full flex"
      >
        <form
          onSubmit={handleSubmit}
          onChange={() => setHasChanges(true)}
          ref={formEl}
          className="flex-1 flex gap-x-6 p-4 mt-10"
        >
          {/* Skill settings nav */}
          <div className="flex flex-col gap-y-[18px]">
            <div className="text-white flex items-center gap-x-2">
              <Robot size={24} />
              <p className="text-lg font-medium">Agent Skills</p>
            </div>
            {/* Default skills */}
            <div className="bg-white/5 text-white min-w-[360px] w-fit rounded-xl">
              <input
                name="system::default_agent_skills"
                type="hidden"
                value={agentSkills.join(",")}
              />
              {Object.entries(defaultSkills).map(([skill, settings], index) => (
                <div
                  key={skill}
                  className={`py-3 px-4 flex items-center justify-between ${
                    index === 0 ? "rounded-t-xl" : ""
                  } ${
                    index === Object.keys(defaultSkills).length - 1
                      ? "rounded-b-xl"
                      : "border-b border-white/10"
                  } cursor-pointer transition-all duration-300  hover:bg-white/5 ${
                    selectedSkill === skill ? "bg-white/10" : ""
                  }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  <div className="text-sm font-light">{settings.title}</div>
                  <div className="flex items-center gap-x-2">
                    <DefaultBadge title={skill} />
                    <CaretRight
                      size={14}
                      weight="bold"
                      className="text-white/80"
                    />
                  </div>
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
                    } transition-all duration-300 cursor-pointer hover:bg-white/5 ${
                      selectedSkill === skill ? "bg-white/10" : ""
                    }`}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="text-sm font-light">{settings.title}</div>
                    <div className="flex items-center gap-x-2">
                      <div className="text-sm text-white/60 font-medium">
                        {agentSkills.includes(settings.skill) ? "On" : "Off"}
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
                  skill={configurableSkills[selectedSkill]?.skill}
                  settings={settings}
                  toggleSkill={toggleAgentSkill}
                  enabled={agentSkills.includes(
                    configurableSkills[selectedSkill]?.skill
                  )}
                  setHasChanges={setHasChanges}
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
        </form>
        {hasChanges && (
          <ContextualSaveBar
            onSave={handleSubmit}
            onCancel={() => setHasChanges(false)}
          />
        )}
      </div>
    </div>
  );
}
