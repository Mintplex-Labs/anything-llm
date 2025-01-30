import React, { useState, useEffect } from "react";

import BlockList, { BLOCK_TYPES, BLOCK_INFO } from "./BlockList";
import AddBlockMenu from "./AddBlockMenu";
import showToast from "@/utils/toast";
import { AgentTasks } from "@/models/agent-tasks";
import { FolderOpen, Play, Info } from "@phosphor-icons/react";
import AgentSidebar from "./AgentSidebar";

export default function AgentBuilder() {
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [blocks, setBlocks] = useState([
    {
      id: "start",
      type: BLOCK_TYPES.START,
      config: {
        variables: [{ name: "", value: "" }],
      },
      isExpanded: true,
    },
  ]);
  const [selectedBlock, setSelectedBlock] = useState("start");
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);

  useEffect(() => {
    loadAvailableTasks();
  }, []);

  const loadAvailableTasks = async () => {
    try {
      const tasks = await AgentTasks.list();
      setAvailableTasks(tasks);

      // Load details for each task
      const details = {};
      for (const taskName of tasks) {
        const task = await AgentTasks.load(taskName);
        details[taskName] = task.config;
      }
      setTaskDetails(details);
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to load available tasks",
      });
    }
  };

  const loadTask = async (taskName) => {
    try {
      const { config } = await AgentTasks.load(taskName);

      // Convert steps to blocks with IDs
      const newBlocks = config.steps.map((step, index) => ({
        id: index === 0 ? "start" : `block_${index}`,
        type: step.type,
        config: step.config,
        isExpanded: true,
      }));

      setAgentName(config.name);
      setAgentDescription(config.description);
      setBlocks(newBlocks);
      setShowLoadMenu(false);

      showToast({
        type: "success",
        title: "Success",
        description: "Task loaded successfully!",
      });
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to load task",
      });
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block_${blocks.length}`,
      type,
      config: { ...BLOCK_INFO[type].defaultConfig },
      isExpanded: true,
    };
    setBlocks([...blocks, newBlock]);
    setShowBlockMenu(false);
  };

  const updateBlockConfig = (blockId, config) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId
          ? { ...block, config: { ...block.config, ...config } }
          : block
      )
    );
  };

  const removeBlock = (blockId) => {
    if (blockId === "start") return;
    setBlocks(blocks.filter((block) => block.id !== blockId));
    if (selectedBlock === blockId) {
      setSelectedBlock("start");
    }
  };

  const generateJson = async () => {
    if (!agentName.trim()) {
      showToast({
        type: "error",
        title: "Error",
        description: "Please provide a name for your agent task",
      });
      return;
    }

    const json = {
      name: agentName,
      description: agentDescription,
      steps: blocks.map((block) => ({
        type: block.type,
        config: block.config,
      })),
    };

    try {
      await AgentTasks.save(
        agentName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        json
      );

      showToast({
        type: "success",
        title: "Success",
        description: "Agent task saved successfully!",
      });

      // Refresh available tasks
      await loadAvailableTasks();

      // Reset form
      setAgentName("");
      setAgentDescription("");
      setBlocks([
        {
          id: "start",
          type: BLOCK_TYPES.START,
          config: {
            variables: [{ name: "", value: "" }],
          },
          isExpanded: true,
        },
      ]);
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to save agent task",
      });
    }
  };

  const toggleBlockExpansion = (blockId) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId
          ? { ...block, isExpanded: !block.isExpanded }
          : block
      )
    );
  };

  // Get all available variables from the start block
  const getAvailableVariables = () => {
    const startBlock = blocks.find((b) => b.type === BLOCK_TYPES.START);
    return startBlock?.config?.variables?.filter((v) => v.name) || [];
  };

  const renderVariableSelect = (
    value,
    onChange,
    placeholder = "Select variable"
  ) => (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
    >
      <option value="" className="bg-theme-bg-primary">
        {placeholder}
      </option>
      {getAvailableVariables().map((v) => (
        <option key={v.name} value={v.name} className="bg-theme-bg-primary">
          {v.name}
        </option>
      ))}
    </select>
  );

  const deleteVariable = (variableName) => {
    // Clean up references in other blocks
    blocks.forEach((block) => {
      if (block.type === BLOCK_TYPES.START) return;

      let configUpdated = false;
      const newConfig = { ...block.config };

      // Check and clean responseVariable/resultVariable
      if (newConfig.responseVariable === variableName) {
        newConfig.responseVariable = "";
        configUpdated = true;
      }
      if (newConfig.resultVariable === variableName) {
        newConfig.resultVariable = "";
        configUpdated = true;
      }

      if (configUpdated) {
        updateBlockConfig(block.id, newConfig);
      }
    });
  };

  const runTask = async (taskName) => {
    try {
      const task = taskDetails[taskName];
      const startBlock = task.steps.find(step => step.type === "START");
      const variables = {};

      // If there are variables defined in the start block, prompt for their values
      if (startBlock?.config?.variables) {
        for (const variable of startBlock.config.variables) {
          if (!variable.name) continue;
          const value = prompt(`Enter value for ${variable.name}:`, variable.value || "");
          if (value === null) return; // User cancelled
          variables[variable.name] = value;
        }
      }

      const results = await AgentTasks.run(taskName, variables);

      showToast({
        type: "success",
        title: "Task Complete",
        description: "Task executed successfully!",
      });

      // Show results in a more readable format
      console.log("Task Results:", results);
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to run agent task",
      });
    }
  };

  return (
    <div className="w-full h-screen flex bg-theme-bg-primary">
      <AgentSidebar
        agentName={agentName}
        setAgentName={setAgentName}
        agentDescription={agentDescription}
        setAgentDescription={setAgentDescription}
        generateJson={generateJson}
        onLoadClick={() => setShowLoadMenu(true)}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <BlockList
            blocks={blocks}
            updateBlockConfig={updateBlockConfig}
            removeBlock={removeBlock}
            toggleBlockExpansion={toggleBlockExpansion}
            renderVariableSelect={renderVariableSelect}
            onDeleteVariable={deleteVariable}
          />

          <AddBlockMenu
            showBlockMenu={showBlockMenu}
            setShowBlockMenu={setShowBlockMenu}
            addBlock={addBlock}
          />

          {/* Load Task Menu */}
          {showLoadMenu && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-theme-action-menu-bg rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Load Task</h2>
                  <button
                    onClick={() => {
                      setShowLoadMenu(false);
                      setSelectedTaskForDetails(null);
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid gap-2">
                  {availableTasks.length === 0 ? (
                    <div className="text-white/60">No tasks available</div>
                  ) : (
                    availableTasks.map((taskName) => (
                      <div
                        key={taskName}
                        className="bg-theme-bg-primary border border-white/5 rounded-lg overflow-hidden"
                      >
                        <div className="p-3 flex items-center justify-between">
                          <span className="text-white">{taskName}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedTaskForDetails(selectedTaskForDetails === taskName ? null : taskName)}
                              className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                              title="Toggle details"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => runTask(taskName)}
                              className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                              title="Run task"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => loadTask(taskName)}
                              className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                              title="Load task for editing"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {selectedTaskForDetails === taskName && taskDetails[taskName] && (
                          <div className="p-3 border-t border-white/5 bg-theme-action-menu-bg">
                            <p className="text-white/80 text-sm mb-2">
                              {taskDetails[taskName].description || "No description"}
                            </p>
                            <div className="text-sm text-white/60">
                              <div className="font-medium mb-1">Steps:</div>
                              <ul className="list-disc list-inside">
                                {taskDetails[taskName].steps.map((step, index) => (
                                  <li key={index}>
                                    {step.type}
                                    {step.config.responseVariable &&
                                      ` → ${step.config.responseVariable}`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
