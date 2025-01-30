import React, { useState, useEffect } from "react";

import BlockList, { BLOCK_TYPES, BLOCK_INFO } from "./BlockList";
import AddBlockMenu from "./AddBlockMenu";
import showToast from "@/utils/toast";
import AgentTasks from "@/models/agent-tasks";
import AgentSidebar from "./AgentSidebar";
import LoadTaskMenu from "./LoadTaskMenu";

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
      const { success, error, tasks } = await AgentTasks.listTasks();
      if (!success) throw new Error(error);
      setAvailableTasks(tasks);

      // Load details for each task
      const details = {};
      for (const taskName of tasks) {
        const { success, error, task } = await AgentTasks.getTask(taskName);
        if (!success) throw new Error(error);
        details[taskName] = task.config;
      }
      setTaskDetails(details);
    } catch (error) {
      console.error(error);
      showToast("Failed to load available tasks", "error");
    }
  };

  const loadTask = async (taskName) => {
    try {
      const { success, error, task } = await AgentTasks.getTask(taskName);
      if (!success) throw new Error(error);

      // Convert steps to blocks with IDs
      const newBlocks = task.config.steps.map((step, index) => ({
        id: index === 0 ? "start" : `block_${index}`,
        type: step.type,
        config: step.config,
        isExpanded: true,
      }));

      setAgentName(task.config.name);
      setAgentDescription(task.config.description);
      setBlocks(newBlocks);
      setShowLoadMenu(false);

      showToast("Task loaded successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to load task", "error");
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

  const saveTask = async () => {
    if (!agentName.trim()) {
      showToast("Please provide a name for your agent task", "error");
      return;
    }

    const taskConfig = {
      name: agentName,
      description: agentDescription,
      steps: blocks.map((block) => ({
        type: block.type,
        config: block.config,
      })),
    };

    const taskName = agentName.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    try {
      const { success, error } = await AgentTasks.saveTask(taskName, taskConfig);
      if (!success) throw new Error(error);
      showToast("Agent task saved successfully!", "success");
      await loadAvailableTasks();
    } catch (error) {
      console.error("Save error details:", error);
      showToast("Failed to save agent task", "error");
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

      const { success, error, results } = await AgentTasks.runTask(taskName, variables);
      if (!success) throw new Error(error);

      showToast("Task executed successfully!", "success");
      console.log("Task Results:", results);
    } catch (error) {
      console.error(error);
      showToast("Failed to run agent task", "error");
    }
  };

  return (
    <div className="w-full h-screen flex bg-theme-bg-primary">
      <AgentSidebar
        agentName={agentName}
        setAgentName={setAgentName}
        agentDescription={agentDescription}
        setAgentDescription={setAgentDescription}
        onSave={saveTask}
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

          <LoadTaskMenu
            showLoadMenu={showLoadMenu}
            setShowLoadMenu={setShowLoadMenu}
            availableTasks={availableTasks}
            taskDetails={taskDetails}
            selectedTaskForDetails={selectedTaskForDetails}
            setSelectedTaskForDetails={setSelectedTaskForDetails}
            onLoadTask={loadTask}
            onRunTask={runTask}
          />
        </div>
      </div>
    </div>
  );
}
