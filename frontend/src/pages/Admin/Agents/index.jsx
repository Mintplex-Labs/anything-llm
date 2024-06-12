import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { CaretRight, Robot } from "@phosphor-icons/react";
import ContextualSaveBar from "@/components/ContextualSaveBar";
import { castToType } from "@/utils/types";
import { FullScreenLoader } from "@/components/Preloader";
import { defaultSkills, configurableSkills } from "./skills";
import { DefaultBadge } from "./Badges/default";

export default function AdminAgents() {
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({});
  const [selectedSkill, setSelectedSkill] = useState("");
  const [agentSkills, setAgentSkills] = useState([]);
  const [loading, setLoading] = useState(true);
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
      showToast(`Agent preferences saved successfully.`, "success", {
        clear: true,
      });
    } else {
      showToast(`Agent preferences failed to save.`, "error", { clear: true });
    }

    setHasChanges(false);
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
          <input
            name="system::default_agent_skills"
            type="hidden"
            value={agentSkills.join(",")}
          />

          {/* Skill settings nav */}
          <div className="flex flex-col gap-y-[18px]">
            <div className="text-white flex items-center gap-x-2">
              <Robot size={24} />
              <p className="text-lg font-medium">Agent Skills</p>
            </div>

            {/* Default skills list */}
            <SkillList
              isDefault={true}
              skills={defaultSkills}
              selectedSkill={selectedSkill}
              handleClick={setSelectedSkill}
            />
            {/* Configurable skills */}
            <SkillList
              skills={configurableSkills}
              selectedSkill={selectedSkill}
              handleClick={setSelectedSkill}
              activeSkills={agentSkills}
            />
          </div>

          {/* Selected agent skill setting panel */}
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
        <ContextualSaveBar
          showing={hasChanges}
          onSave={handleSubmit}
          onCancel={() => setHasChanges(false)}
        />
      </div>
    </div>
  );
}

function SkillList({
  isDefault = false,
  skills = [],
  selectedSkill = null,
  handleClick = null,
  activeSkills = [],
}) {
  if (skills.length === 0) return null;

  return (
    <div className="bg-white/5 text-white min-w-[360px] w-fit rounded-xl">
      {Object.entries(skills).map(([skill, settings], index) => (
        <div
          key={skill}
          className={`py-3 px-4 flex items-center justify-between ${
            index === 0 ? "rounded-t-xl" : ""
          } ${
            index === Object.keys(skills).length - 1
              ? "rounded-b-xl"
              : "border-b border-white/10"
          } cursor-pointer transition-all duration-300  hover:bg-white/5 ${
            selectedSkill === skill ? "bg-white/10" : ""
          }`}
          onClick={() => handleClick?.(skill)}
        >
          <div className="text-sm font-light">{settings.title}</div>
          <div className="flex items-center gap-x-2">
            {isDefault ? (
              <DefaultBadge title={skill} />
            ) : (
              <div className="text-sm text-white/60 font-medium">
                {activeSkills.includes(skill) ? "On" : "Off"}
              </div>
            )}
            <CaretRight size={14} weight="bold" className="text-white/80" />
          </div>
        </div>
      ))}
    </div>
  );
}
