import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import {
  CaretLeft,
  Plug,
  Robot,
  FlowArrow,
  HeadCircuit,
  Plus,
} from "@phosphor-icons/react";
import { castToType } from "@/utils/types";
import { FullScreenLoader } from "@/components/Preloader";
import { defaultSkills } from "./skills";
import ImportedSkillList from "./Imported/SkillList";
import ImportedSkillConfig from "./Imported/ImportedSkillConfig";
import AgentFlowsList from "./AgentFlows";
import FlowPanel from "./AgentFlows/FlowPanel";
import { MCPServersList, MCPServerHeader } from "./MCPServers";
import ServerPanel from "./MCPServers/ServerPanel";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import AgentFlows from "@/models/agentFlows";
import SkillList from "./SkillList";
import SkillLayout from "./SkillLayout";

export default function AdminAgents() {
  const formEl = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({});
  const [selectedSkill, setSelectedSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSkillModal, setShowSkillModal] = useState(false);

  const [agentSkills, setAgentSkills] = useState([]);
  const [importedSkills, setImportedSkills] = useState([]);
  const [disabledAgentSkills, setDisabledAgentSkills] = useState([]);

  const [agentFlows, setAgentFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [activeFlowIds, setActiveFlowIds] = useState([]);

  // MCP Servers are lazy loaded to not block the UI thread
  const [mcpServers, setMcpServers] = useState([]);
  const [selectedMcpServer, setSelectedMcpServer] = useState(null);

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
      const _preferences = await Admin.systemPreferencesByFields([
        "disabled_agent_skills",
        "imported_agent_skills",
        "active_agent_flows",
      ]);
      const { flows = [] } = await AgentFlows.listFlows();

      setSettings({ ..._settings, preferences: _preferences.settings } ?? {});
      setDisabledAgentSkills(
        _preferences.settings?.disabled_agent_skills ?? []
      );
      setImportedSkills(_preferences.settings?.imported_agent_skills ?? []);
      setActiveFlowIds(_preferences.settings?.active_agent_flows ?? []);
      setAgentFlows(flows);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const toggleFlow = async (flowId) => {
    const updatedFlowIds = activeFlowIds.includes(flowId)
      ? activeFlowIds.filter((id) => id !== flowId)
      : [...activeFlowIds, flowId];

    const { success, error } = await Admin.updateSystemPreferences({
      active_agent_flows: updatedFlowIds.join(","),
    });

    if (success) {
      setActiveFlowIds(updatedFlowIds);
      showToast(`Flow status updated successfully.`, "success", {
        clear: true,
      });
    } else {
      showToast(`Failed to update flow status: ${error}`, "error", {
        clear: true,
      });
    }
  };

  const toggleMCP = async (server) => {
    try {
      const { success, error } = await Admin.updateSystemPreferences({
        mcp_servers: JSON.stringify(
          mcpServers.map((s) =>
            s.name === server.name ? { ...s, active: !s.active } : s
          )
        ),
      });

      if (!success) throw new Error(error);
      setMcpServers((prev) =>
        prev.map((s) =>
          s.name === server.name ? { ...s, active: !s.active } : s
        )
      );
      showToast(`MCP server status updated successfully.`, "success", {
        clear: true,
      });
    } catch (error) {
      console.error("Failed to toggle MCP server:", error);
      showToast(`Failed to update MCP server status: ${error}`, "error", {
        clear: true,
      });
    }
  };

  const toggleSkill = async (skillName) => {
    const updatedSkills = disabledAgentSkills.includes(skillName)
      ? disabledAgentSkills.filter((name) => name !== skillName)
      : [...disabledAgentSkills, skillName];

    const { success, error } = await Admin.updateSystemPreferences({
      disabled_agent_skills: updatedSkills.join(","),
    });

    if (success) {
      setDisabledAgentSkills(updatedSkills);
      showToast(`Skill ${skillName} updated successfully.`, "success", {
        clear: true,
      });
    } else {
      showToast(`Failed to update skill: ${error}`, "error", { clear: true });
    }
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
      const _preferences = await Admin.systemPreferencesByFields([
        "disabled_agent_skills",
        "imported_agent_skills",
      ]);
      setSettings({ ..._settings, preferences: _preferences.settings } ?? {});
      setDisabledAgentSkills(
        _preferences.settings?.disabled_agent_skills ?? []
      );
      setImportedSkills(_preferences.settings?.imported_agent_skills ?? []);
      setActiveFlowIds(_preferences.settings?.active_agent_flows ?? []);
      setAgentFlows(flows);
      showToast(`Agent preferences saved successfully.`, "success", {
        clear: true,
      });
    } else {
      showToast(`Agent preferences failed to save.`, "error", { clear: true });
    }

    setHasChanges(false);
  };

  let SelectedSkillComponent = null;
  if (selectedFlow) {
    SelectedSkillComponent = FlowPanel;
  } else if (selectedMcpServer) {
    SelectedSkillComponent = ServerPanel;
  } else if (selectedSkill?.imported) {
    SelectedSkillComponent = ImportedSkillConfig;
  } else {
    SelectedSkillComponent = defaultSkills[selectedSkill]?.component;
  }

  // Update the click handlers to clear the other selection
  const handleDefaultSkillClick = (skill) => {
    setSelectedFlow(null);
    setSelectedMcpServer(null);
    setSelectedSkill(skill);
    if (isMobile) setShowSkillModal(true);
  };

  const handleSkillClick = (skill) => {
    setSelectedFlow(null);
    setSelectedMcpServer(null);
    setSelectedSkill(skill);
    if (isMobile) setShowSkillModal(true);
  };

  const handleFlowClick = (flow) => {
    setSelectedSkill(null);
    setSelectedMcpServer(null);
    setSelectedFlow(flow);
    if (isMobile) setShowSkillModal(true);
  };

  const handleMCPClick = (server) => {
    setSelectedSkill(null);
    setSelectedFlow(null);
    setSelectedMcpServer(server);
    if (isMobile) setShowSkillModal(true);
  };

  const handleFlowDelete = (flowId) => {
    setSelectedFlow(null);
    setActiveFlowIds((prev) => prev.filter((id) => id !== flowId));
    setAgentFlows((prev) => prev.filter((flow) => flow.uuid !== flowId));
  };

  const handleMCPServerDelete = (serverName) => {
    setSelectedMcpServer(null);
    setMcpServers((prev) =>
      prev.filter((server) => server.name !== serverName)
    );
  };

  const handleImportedSkillToggle = async (skill) => {
    const updatedSkills = importedSkills.map((s) =>
      s.hubId === skill.hubId ? { ...s, active: !s.active } : s
    );

    const { success, error } = await Admin.updateSystemPreferences({
      imported_agent_skills: JSON.stringify(updatedSkills),
    });

    if (success) {
      setImportedSkills(updatedSkills);
      showToast(`Imported skill updated successfully.`, "success", {
        clear: true,
      });
    } else {
      showToast(`Failed to update imported skill: ${error}`, "error", {
        clear: true,
      });
    }
  };

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
      <SkillLayout
        hasChanges={hasChanges}
        handleCancel={() => setHasChanges(false)}
        handleSubmit={handleSubmit}
      >
        <form
          onSubmit={handleSubmit}
          onChange={() => !selectedFlow && setHasChanges(true)}
          ref={formEl}
          className="flex flex-col w-full p-4 mt-10"
        >
          <input
            name="system::disabled_agent_skills"
            type="hidden"
            value={disabledAgentSkills.join(",")}
          />

          {/* Skill settings nav */}
          <div
            hidden={showSkillModal}
            className="flex flex-col gap-y-[18px] overflow-y-scroll no-scroll"
          >
            <div className="text-theme-text-primary flex items-center gap-x-2">
              <Robot size={24} />
              <p className="text-lg font-medium">Agent Skills</p>
            </div>
            {/* Default skills */}
            <SkillList
              skills={defaultSkills}
              selectedSkill={selectedSkill}
              handleClick={handleDefaultSkillClick}
              activeSkills={[
                ...Object.keys(defaultSkills).filter(
                  (skill) => !disabledAgentSkills.includes(skill)
                ),
              ]}
              toggleSkill={toggleSkill}
            />

            <div className="text-theme-text-primary flex items-center gap-x-2">
              <Plug size={24} />
              <p className="text-lg font-medium">Custom Skills</p>
            </div>
            <ImportedSkillList
              skills={importedSkills}
              selectedSkill={selectedSkill}
              handleClick={handleSkillClick}
              toggleSkill={handleImportedSkillToggle}
            />

            <div className="text-theme-text-primary flex items-center gap-x-2 mt-6">
              <FlowArrow size={24} />
              <p className="text-lg font-medium">Agent Flows</p>
            </div>
            <AgentFlowsList
              flows={agentFlows}
              selectedFlow={selectedFlow}
              handleClick={handleFlowClick}
              activeFlowIds={activeFlowIds}
              toggleFlow={toggleFlow}
            />
            <input
              type="hidden"
              name="system::active_agent_flows"
              id="active_agent_flows"
              value={activeFlowIds.join(",")}
            />
            <MCPServerHeader
              setMcpServers={setMcpServers}
              setSelectedMcpServer={setSelectedMcpServer}
            >
              {({ loadingMcpServers }) => {
                return (
                  <MCPServersList
                    isLoading={loadingMcpServers}
                    servers={mcpServers}
                    selectedServer={selectedMcpServer}
                    handleClick={handleMCPClick}
                    toggleServer={toggleMCP}
                  />
                );
              }}
            </MCPServerHeader>
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
                <div className="flex-1 overflow-y-auto p-4 no-scroll">
                  <div className=" bg-theme-bg-secondary text-white rounded-xl p-4 overflow-y-scroll no-scroll">
                    {SelectedSkillComponent ? (
                      <>
                        {selectedMcpServer ? (
                          <ServerPanel
                            server={selectedMcpServer}
                            toggleServer={toggleMCP}
                            onDelete={handleMCPServerDelete}
                          />
                        ) : selectedFlow ? (
                          <FlowPanel
                            flow={selectedFlow}
                            toggleFlow={toggleFlow}
                            enabled={activeFlowIds.includes(selectedFlow.uuid)}
                            onDelete={handleFlowDelete}
                          />
                        ) : selectedSkill.imported ? (
                          <ImportedSkillConfig
                            key={selectedSkill.hubId}
                            selectedSkill={selectedSkill}
                            setImportedSkills={setImportedSkills}
                          />
                        ) : (
                          <>
                            {defaultSkills?.[selectedSkill] ? (
                              // The selected skill is a default skill - show the default skill panel
                              <SelectedSkillComponent
                                skill={defaultSkills[selectedSkill]?.skill}
                                settings={settings}
                                toggleSkill={toggleSkill}
                                enabled={
                                  !disabledAgentSkills.includes(
                                    defaultSkills[selectedSkill]?.skill
                                  )
                                }
                                setHasChanges={setHasChanges}
                                {...defaultSkills[selectedSkill]}
                              />
                            ) : (
                              // The selected skill is a configurable skill - show the configurable skill panel
                              <SelectedSkillComponent
                                skill={defaultSkills[selectedSkill]?.skill}
                                settings={settings}
                                toggleSkill={toggleSkill}
                                enabled={
                                  !disabledAgentSkills.includes(
                                    defaultSkills[selectedSkill]?.skill
                                  )
                                }
                                setHasChanges={setHasChanges}
                                {...defaultSkills[selectedSkill]}
                              />
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-theme-text-secondary">
                        <Robot size={40} />
                        <p className="font-medium">
                          Select an Agent Skill, Agent Flow, or MCP Server
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </SkillLayout>
    );
  }

  return (
    <SkillLayout
      hasChanges={hasChanges}
      handleCancel={() => setHasChanges(false)}
      handleSubmit={handleSubmit}
    >
      <form
        onSubmit={handleSubmit}
        onChange={() => !selectedFlow && setHasChanges(true)}
        ref={formEl}
        className="flex-1 flex gap-x-6 p-4 mt-10"
      >
        <input
          name="system::disabled_agent_skills"
          type="hidden"
          value={disabledAgentSkills.join(",")}
        />
        <input
          type="hidden"
          name="system::active_agent_flows"
          id="active_agent_flows"
          value={activeFlowIds.join(",")}
        />

        {/* Skill settings nav - Make this section scrollable */}
        <div className="flex flex-col min-w-[360px] h-[calc(100vh-90px)]">
          <div className="flex-none mb-[18px]">
            <div className="text-theme-text-primary flex items-center gap-x-2">
              <HeadCircuit size={24} weight="light" />
              <p className="text-lg font-semibold">Agent Skills</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-4 no-scroll">
            <div className="space-y-[18px]">
              <div className="text-theme-text-primary flex items-center gap-x-2">
                <p className="text-sm font-semibold">Default Skills</p>
              </div>
              {/* Default skills list */}
              <SkillList
                skills={defaultSkills}
                selectedSkill={selectedSkill}
                handleClick={handleSkillClick}
                activeSkills={[
                  ...Object.keys(defaultSkills).filter(
                    (skill) => !disabledAgentSkills.includes(skill)
                  ),
                ]}
                toggleSkill={toggleSkill}
              />

              <div className="text-theme-text-primary flex items-center gap-x-2 mt-4">
                <p className="text-sm font-semibold">Custom Skills</p>
              </div>
              <ImportedSkillList
                skills={importedSkills}
                selectedSkill={selectedSkill}
                handleClick={handleSkillClick}
                toggleSkill={handleImportedSkillToggle}
              />

              <div className="text-theme-text-primary flex items-center justify-between gap-x-2 mt-4">
                <div className="flex items-center gap-x-2">
                  <p className="text-sm font-semibold">Agent Flows</p>
                </div>
                <Link
                  to={paths.agents.builder()}
                  className="text-cta-button hover:text-theme-text-secondary flex items-center gap-x-1"
                >
                  <Plus size={16} weight="bold" />
                  <p className="text-sm font-medium">Create</p>
                </Link>
              </div>
              <AgentFlowsList
                flows={agentFlows}
                selectedFlow={selectedFlow}
                handleClick={handleFlowClick}
                activeFlowIds={activeFlowIds}
                toggleFlow={toggleFlow}
              />

              <MCPServerHeader
                setMcpServers={setMcpServers}
                setSelectedMcpServer={setSelectedMcpServer}
              >
                {({ loadingMcpServers }) => {
                  return (
                    <MCPServersList
                      isLoading={loadingMcpServers}
                      servers={mcpServers}
                      selectedServer={selectedMcpServer}
                      handleClick={handleMCPClick}
                      toggleServer={toggleMCP}
                    />
                  );
                }}
              </MCPServerHeader>
            </div>
          </div>
        </div>

        {/* Selected agent skill setting panel */}
        <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
          <div className="bg-theme-bg-secondary text-white rounded-xl flex-1 p-4 overflow-y-scroll no-scroll">
            {SelectedSkillComponent ? (
              <>
                {selectedMcpServer ? (
                  <ServerPanel
                    server={selectedMcpServer}
                    toggleServer={toggleMCP}
                    onDelete={handleMCPServerDelete}
                  />
                ) : selectedFlow ? (
                  <FlowPanel
                    flow={selectedFlow}
                    toggleFlow={toggleFlow}
                    enabled={activeFlowIds.includes(selectedFlow.uuid)}
                    onDelete={handleFlowDelete}
                  />
                ) : selectedSkill.imported ? (
                  <ImportedSkillConfig
                    key={selectedSkill.hubId}
                    selectedSkill={selectedSkill}
                    setImportedSkills={setImportedSkills}
                  />
                ) : (
                  <SelectedSkillComponent
                    skill={defaultSkills[selectedSkill]?.skill}
                    settings={settings}
                    toggleSkill={toggleSkill}
                    enabled={
                      !disabledAgentSkills.includes(
                        defaultSkills[selectedSkill]?.skill
                      )
                    }
                    setHasChanges={setHasChanges}
                    {...defaultSkills[selectedSkill]}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-theme-text-secondary">
                <Robot size={40} />
                <p className="font-medium">
                  Select an Agent Skill, Agent Flow, or MCP Server
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </SkillLayout>
  );
}

// function SkillLayout({ children, hasChanges, handleSubmit, handleCancel }) {
//   return (
//     <div
//       id="workspace-agent-settings-container"
//       className="w-screen h-screen overflow-hidden bg-theme-bg-container flex md:mt-0 mt-6"
//     >
//       <Sidebar />
//       <div
//         style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
//         className="relative md:ml-[2px] md:mr-[16px] md:rounded-[16px] w-full h-full flex"
//       >
//         {children}
//         <ContextualSaveBar
//           showing={hasChanges}
//           onSave={handleSubmit}
//           onCancel={handleCancel}
//         />
//       </div>
//     </div>
//   );
// }

// function SkillList({
//   skills = [],
//   selectedSkill = null,
//   handleClick = null,
//   activeSkills = [],
//   toggleSkill = () => {},
// }) {
//   if (skills.length === 0) return null;

//   return (
//     <div
//       className={`bg-theme-bg-secondary text-white rounded-xl ${isMobile ? "w-full" : "min-w-[360px] w-fit"}`}
//     >
//       {Object.entries(skills).map(([skill, settings]) => (
//         <div
//           key={skill}
//           onClick={() => handleClick?.(skill)}
//           className={`
//             relative
//             cursor-pointer
//             transition-all duration-300
//             after:content-['']
//             after:absolute
//             after:bottom-0
//             after:left-4
//             after:right-4
//             after:h-[1px]
//             after:bg-theme-action-menu-bg
//             last:after:hidden
//             first:rounded-t-xl
//             last:rounded-b-xl
//             ${selectedSkill === skill ? "bg-white/10 light:bg-theme-bg-sidebar" : "hover:bg-theme-bg-primary"}
//           `}
//         >
//           <div className="flex items-center justify-between h-[36px] px-4">
//             <div className="text-sm font-medium">{settings.title}</div>
//             <div className="flex items-center gap-x-2">
//               <div
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSkill(skill);
//                 }}
//                 className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300"
//                 style={{
//                   backgroundColor: activeSkills.includes(skill)
//                     ? "#32D583"
//                     : "#CFCFD0",
//                 }}
//               >
//                 <span
//                   className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
//                     activeSkills.includes(skill)
//                       ? "translate-x-[14px]"
//                       : "translate-x-[2px]"
//                   }`}
//                 />
//               </div>
//               <CaretRight
//                 size={14}
//                 weight="bold"
//                 className="text-theme-text-secondary"
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
