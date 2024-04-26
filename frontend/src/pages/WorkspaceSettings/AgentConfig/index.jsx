import System from "@/models/system";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import AgentLLMSelection from "./AgentLLMSelection";
import AgentWebSearchSelection from "./WebSearchSelection";
import GenericSkill from "./GenericSkill";
import Admin from "@/models/admin";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function WorkspaceAgentConfiguration({ workspace }) {
  const [settings, setSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agentSkills, setAgentSkills] = useState([]);

  const formEl = useRef(null);
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

  const handleUpdate = async (e) => {
    setSaving(true);
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

    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data.workspace
    );
    await Admin.updateSystemPreferences(data.system);
    await System.updateSystem(data.env);

    if (!!updatedWorkspace) {
      showToast("Workspace updated!", "success", { clear: true });
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }

    setSaving(false);
    setHasChanges(false);
  };

  function toggleAgentSkill(skillName = "") {
    setAgentSkills((prev) => {
      return prev.includes(skillName)
        ? prev.filter((name) => name !== skillName)
        : [...prev, skillName];
    });
  }

  if (!workspace || loading) return <LoadingSkeleton />;
  return (
    <div id="workspace-agent-settings-container">
      <form
        ref={formEl}
        onSubmit={handleUpdate}
        onChange={() => setHasChanges(true)}
        id="agent-settings-form"
        className="w-1/2 flex flex-col gap-y-6"
      >
        <AgentLLMSelection
          settings={settings}
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <AvailableAgentSkills
          skills={agentSkills}
          toggleAgentSkill={toggleAgentSkill}
          settings={settings}
        />
        {hasChanges && (
          <button
            type="submit"
            form="agent-settings-form"
            className="w-fit transition-all duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            {saving ? "Updating agent..." : "Update workspace agent"}
          </button>
        )}
      </form>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div id="workspace-agent-settings-container">
      <div className="w-1/2 flex flex-col gap-y-6">
        <Skeleton.default
          height={100}
          width="100%"
          count={2}
          baseColor="#292524"
          highlightColor="#4c4948"
          enableAnimation={true}
          containerClassName="flex flex-col gap-y-1"
        />
        <div className="bg-white/10 h-[1px] w-full" />
        <Skeleton.default
          height={100}
          width="100%"
          count={2}
          baseColor="#292524"
          highlightColor="#4c4948"
          enableAnimation={true}
          containerClassName="flex flex-col gap-y-1 mt-4"
        />
      </div>
    </div>
  );
}

function AvailableAgentSkills({ skills, settings, toggleAgentSkill }) {
  return (
    <div>
      <div className="flex flex-col mb-8">
        <div className="flex w-full justify-between items-center">
          <label htmlFor="name" className="text-white text-md font-semibold">
            Default agent skills
          </label>
        </div>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          Improve the natural abilities of the default agent with these
          pre-built skills. This set up applies to all workspaces.
        </p>
      </div>
      <input
        name="system::default_agent_skills"
        type="hidden"
        value={skills.join(",")}
      />
      <div className="flex flex-col gap-y-3">
        <GenericSkill
          title="RAG & long-term memory"
          description='Allow the agent to leverage your local documents to answer a query or ask the agent to "remember" pieces of content for long-term memory retrieval.'
          settings={settings}
          enabled={true}
          disabled={true}
        />
        <GenericSkill
          title="View & summarize documents"
          description="Allow the agent to list and summarize the content of workspace files currently embedded."
          settings={settings}
          enabled={true}
          disabled={true}
        />
        <GenericSkill
          title="Scrape websites"
          description="Allow the agent to visit and scrape the content of websites."
          settings={settings}
          enabled={true}
          disabled={true}
        />
        <GenericSkill
          title="Generate charts"
          description="Enable the default agent to generate various types of charts from data provided or given in chat."
          skill="create-chart"
          settings={settings}
          toggleSkill={toggleAgentSkill}
          enabled={skills.includes("create-chart")}
        />
        <GenericSkill
          title="Generate & save files to browser"
          description="Enable the default agent to generate and write to files that save and can be downloaded in your browser."
          skill="save-file-to-browser"
          settings={settings}
          toggleSkill={toggleAgentSkill}
          enabled={skills.includes("save-file-to-browser")}
        />
        <AgentWebSearchSelection
          skill="web-browsing"
          settings={settings}
          toggleSkill={toggleAgentSkill}
          enabled={skills.includes("web-browsing")}
        />
      </div>
    </div>
  );
}
