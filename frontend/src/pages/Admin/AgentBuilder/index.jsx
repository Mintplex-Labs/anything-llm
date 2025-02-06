import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import BlockList, { BLOCK_TYPES, BLOCK_INFO } from "./BlockList";
import AddBlockMenu from "./AddBlockMenu";
import showToast from "@/utils/toast";
import AgentTasks from "@/models/agent-tasks";
import AgentSidebar from "./AgentSidebar";
import LoadTaskMenu from "./LoadTaskMenu";

export default function AgentBuilder() {
  const { taskId } = useParams();
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [currentTaskUuid, setCurrentTaskUuid] = useState(null);
  const [active, setActive] = useState(true);
  const [blocks, setBlocks] = useState([
    {
      id: "start",
      type: BLOCK_TYPES.START,
      config: {
        variables: [{ name: "", value: "" }],
      },
      isExpanded: true,
    },
    {
      id: "finish",
      type: BLOCK_TYPES.FINISH,
      config: {},
      isExpanded: false,
    },
  ]);
  const [selectedBlock, setSelectedBlock] = useState("start");
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);

  useEffect(() => {
    loadAvailableTasks();
  }, []);

  useEffect(() => {
    if (taskId) {
      loadTask(taskId);
    }
  }, [taskId]);

  const loadAvailableTasks = async () => {
    try {
      const { success, error, tasks } = await AgentTasks.listTasks();
      if (!success) throw new Error(error);
      setAvailableTasks(tasks);
    } catch (error) {
      console.error(error);
      showToast("Failed to load available tasks", "error", { clear: true });
    }
  };

  const loadTask = async (uuid) => {
    try {
      const { success, error, task } = await AgentTasks.getTask(uuid);
      if (!success) throw new Error(error);

      // Convert steps to blocks with IDs, ensuring finish block is at the end
      const taskBlocks = task.config.steps.map((step, index) => ({
        id: index === 0 ? "start" : `block_${index}`,
        type: step.type,
        config: step.config,
        isExpanded: true,
      }));

      // Add finish block if not present
      if (taskBlocks[taskBlocks.length - 1]?.type !== BLOCK_TYPES.FINISH) {
        taskBlocks.push({
          id: "finish",
          type: BLOCK_TYPES.FINISH,
          config: {},
          isExpanded: false,
        });
      }

      setAgentName(task.config.name);
      setAgentDescription(task.config.description);
      setActive(task.config.active ?? true);
      setCurrentTaskUuid(task.uuid);
      setBlocks(taskBlocks);
      setShowLoadMenu(false);

      showToast("Task loaded successfully!", "success", { clear: true });
    } catch (error) {
      console.error(error);
      showToast("Failed to load task", "error", { clear: true });
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block_${blocks.length}`,
      type,
      config: { ...BLOCK_INFO[type].defaultConfig },
      isExpanded: true,
    };
    // Insert the new block before the finish block
    const newBlocks = [...blocks];
    newBlocks.splice(newBlocks.length - 1, 0, newBlock);
    setBlocks(newBlocks);
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
      showToast("Please provide a name for your agent task", "error", {
        clear: true,
      });
      return;
    }

    const taskConfig = {
      name: agentName,
      description: agentDescription,
      active,
      // Exclude the finish block from the saved steps
      steps: blocks
        .filter((block) => block.type !== BLOCK_TYPES.FINISH)
        .map((block) => ({
          type: block.type,
          config: block.config,
        })),
    };

    try {
      const { success, error, task } = await AgentTasks.saveTask(
        agentName,
        taskConfig,
        currentTaskUuid
      );
      if (!success) throw new Error(error);

      setCurrentTaskUuid(task.uuid);
      showToast("Agent task saved successfully!", "success", { clear: true });
      await loadAvailableTasks();
    } catch (error) {
      console.error("Save error details:", error);
      showToast("Failed to save agent task", "error", { clear: true });
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

  const runTask = async (uuid) => {
    try {
      const { success, error, results } = await AgentTasks.runTask(uuid);
      if (!success) throw new Error(error);

      showToast("Task executed successfully!", "success", { clear: true });
    } catch (error) {
      console.error(error);
      showToast("Failed to run agent task", "error", { clear: true });
    }
  };

  const clearTask = () => {
    setAgentName("");
    setAgentDescription("");
    setCurrentTaskUuid(null);
    setActive(true);
    setBlocks([
      {
        id: "start",
        type: BLOCK_TYPES.START,
        config: {
          variables: [{ name: "", value: "" }],
        },
        isExpanded: true,
      },
      {
        id: "finish",
        type: BLOCK_TYPES.FINISH,
        config: {},
        isExpanded: false,
      },
    ]);
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
        onNewClick={clearTask}
        active={active}
        onToggleActive={setActive}
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
            selectedTaskForDetails={selectedTaskForDetails}
            setSelectedTaskForDetails={setSelectedTaskForDetails}
            onLoadTask={loadTask}
            onRunTask={runTask}
            onTaskDeleted={loadAvailableTasks}
          />
        </div>
      </div>
    </div>
  );
}
