import System from "@/models/system";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useEffect, useState } from "react";
import AutosaveForm from "@/components/AutosaveForm";
import AgentLLMSelection from "./AgentLLMSelection";
import Admin from "@/models/admin";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import paths from "@/utils/paths";
import useUser from "@/hooks/useUser";

export default function WorkspaceAgentConfiguration({ workspace }) {
  const { user } = useUser();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setSettings(_settings ?? {});
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleUpdate = async (formEl) => {
    const data = {
      workspace: {},
      system: {},
      env: {},
    };

    const form = new FormData(formEl);
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

    if (!updatedWorkspace)
      showToast(`Error: ${message}`, "error", { clear: true });
    return !!updatedWorkspace;
  };

  if (!workspace || loading) return <LoadingSkeleton />;
  return (
    <div id="workspace-agent-settings-container">
      <AutosaveForm
        onSave={handleUpdate}
        id="agent-settings-form"
        className="w-1/2 flex flex-col gap-y-6"
      >
        <AgentLLMSelection settings={settings} workspace={workspace} />
        {(!user || user?.role === "admin") && (
          <div className="flex flex-col gap-y-4">
            <a
              className="w-fit transition-all duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              href={paths.settings.agentSkills()}
            >
              Configure Agent Skills
            </a>
            <p className="text-white text-opacity-60 text-xs font-medium">
              Customize and enhance the default agent's capabilities by enabling
              or disabling specific skills. These settings will be applied
              across all workspaces.
            </p>
          </div>
        )}
      </AutosaveForm>
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
          highlightColor="var(--theme-bg-primary)"
          baseColor="var(--theme-bg-secondary)"
          enableAnimation={true}
          containerClassName="flex flex-col gap-y-1"
        />
        <div className="bg-white/10 h-[1px] w-full" />
        <Skeleton.default
          height={100}
          width="100%"
          count={2}
          highlightColor="var(--theme-bg-primary)"
          baseColor="var(--theme-bg-secondary)"
          enableAnimation={true}
          containerClassName="flex flex-col gap-y-1 mt-4"
        />
      </div>
    </div>
  );
}
