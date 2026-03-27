import { useEffect, useState } from "react";
import SettingsSidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import Workspace from "@/models/workspace";
import Memory from "@/models/memory";
import showToast from "@/utils/toast";
import Toggle from "@/components/lib/Toggle";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import GlobalMemoriesSection from "./GlobalMemoriesSection";
import WorkspacesList from "./WorkspacesList";

export default function Personalization() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [memories, setMemories] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  async function fetchData() {
    const { settings } = await Admin.systemPreferencesByFields([
      "memory_enabled",
    ]);
    const isEnabled = settings?.memory_enabled === "on";
    setEnabled(isEnabled);

    if (isEnabled) {
      const [allMemories, allWorkspaces] = await Promise.all([
        Memory.all(),
        Workspace.all(),
      ]);
      setMemories(allMemories);
      setWorkspaces(allWorkspaces);
    } else {
      setMemories([]);
      setWorkspaces([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleToggle(checked) {
    const value = checked ? "on" : "off";
    const { success, error } = await Admin.updateSystemPreferences({
      memory_enabled: value,
    });
    if (!success) {
      showToast(`Failed to update setting: ${error}`, "error");
      return;
    }
    setEnabled(checked);
    showToast(
      `Personalization ${checked ? "enabled" : "disabled"}.`,
      "success"
    );
    if (checked) fetchData();
  }

  async function handleRunExtraction() {
    setExtracting(true);
    const { success, error } = await Memory.runExtraction();
    setExtracting(false);
    if (!success) {
      showToast(`Extraction failed: ${error}`, "error");
      return;
    }
    showToast("Memory extraction completed.", "success");
    fetchData();
  }

  async function handleClearAll() {
    if (
      !window.confirm(
        "Are you sure? This will permanently delete all of your personalization memories."
      )
    )
      return;
    setClearing(true);
    const { success, error } = await Memory.clearAll();
    setClearing(false);
    if (!success) {
      showToast(`Failed to clear memories: ${error}`, "error");
      return;
    }
    showToast("All personalization memories cleared.", "success");
    setMemories([]);
  }

  async function handleDeleteMemory(memoryId) {
    if (!window.confirm("Delete this memory?")) return;
    const { success } = await Memory.delete(memoryId);
    if (!success) {
      showToast("Failed to delete memory.", "error");
      return;
    }
    showToast("Memory deleted.", "success");
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
  }

  async function handleUpdateMemory(memoryId, content) {
    const { memory, error } = await Memory.update(memoryId, { content });
    if (!memory) {
      showToast(error || "Failed to update memory.", "error");
      return;
    }
    showToast("Memory updated.", "success");
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, content } : m))
    );
  }

  async function handleAddGlobal(content) {
    // scope=global ignores workspaceId, but the endpoint requires one
    const wsId = workspaces[0]?.id || 0;
    const { memory, error } = await Memory.create(wsId, {
      content,
      scope: "global",
    });
    if (!memory) {
      showToast(error || "Failed to add memory.", "error");
      return;
    }
    showToast("Global memory added.", "success");
    setMemories((prev) => [memory, ...prev]);
  }

  const globalMemories = memories.filter((m) => m.scope === "global");

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <SettingsSidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Personalization
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              AnythingLLM can learn about you over time to provide more relevant
              and personalized responses. Memories are extracted automatically
              from your conversations.
            </p>
          </div>

          {loading ? (
            <Skeleton.default
              height="60vh"
              width="100%"
              highlightColor="var(--theme-bg-primary)"
              baseColor="var(--theme-bg-secondary)"
              count={1}
              className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
              containerClassName="flex w-full"
            />
          ) : (
            <div className="mt-6 flex flex-col gap-y-6">
              <Toggle
                size="lg"
                enabled={enabled}
                onChange={handleToggle}
                label="Enable Personalization"
                description="When enabled, AnythingLLM will learn user preferences and context from conversations."
              />

              {enabled && (
                <>
                  <div className="flex gap-x-3">
                    <button
                      onClick={handleRunExtraction}
                      disabled={extracting}
                      className="enabled:hover:bg-secondary enabled:hover:text-white rounded-lg bg-primary-button w-fit py-2 px-4 font-semibold text-xs disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      {extracting ? "Extracting..." : "Run Extraction Now"}
                    </button>
                    <button
                      onClick={handleClearAll}
                      disabled={clearing || memories.length === 0}
                      className="rounded-lg border border-red-500/50 text-red-300 hover:bg-red-500/20 w-fit py-2 px-4 font-semibold text-xs disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      {clearing ? "Clearing..." : "Clear All My Memories"}
                    </button>
                  </div>

                  <GlobalMemoriesSection
                    memories={globalMemories}
                    onDelete={handleDeleteMemory}
                    onUpdate={handleUpdateMemory}
                    onAdd={handleAddGlobal}
                  />

                  <WorkspacesList workspaces={workspaces} memories={memories} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
