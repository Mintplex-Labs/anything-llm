import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import BlockList, { BLOCK_TYPES, BLOCK_INFO } from "./BlockList";
import AddBlockMenu from "./AddBlockMenu";
import showToast from "@/utils/toast";
import AgentFlows from "@/models/agentFlows";
import AgentSidebar from "./AgentSidebar";
import LoadFlowMenu from "./LoadFlowMenu";
import { useTheme } from "@/hooks/useTheme";

export default function AgentBuilder() {
  const { flowId } = useParams();
  const { theme } = useTheme();
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [currentFlowUuid, setCurrentFlowUuid] = useState(null);
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
  const [availableFlows, setAvailableFlows] = useState([]);
  const [selectedFlowForDetails, setSelectedFlowForDetails] = useState(null);

  useEffect(() => {
    loadAvailableFlows();
  }, []);

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId]);

  const loadAvailableFlows = async () => {
    try {
      const { success, error, flows } = await AgentFlows.listFlows();
      if (!success) throw new Error(error);
      setAvailableFlows(flows);
    } catch (error) {
      console.error(error);
      showToast("Failed to load available flows", "error", { clear: true });
    }
  };

  const loadFlow = async (uuid) => {
    try {
      const { success, error, flow } = await AgentFlows.getFlow(uuid);
      if (!success) throw new Error(error);

      // Convert steps to blocks with IDs, ensuring finish block is at the end
      const flowBlocks = flow.config.steps.map((step, index) => ({
        id: index === 0 ? "start" : `block_${index}`,
        type: step.type,
        config: step.config,
        isExpanded: true,
      }));

      // Add finish block if not present
      if (flowBlocks[flowBlocks.length - 1]?.type !== BLOCK_TYPES.FINISH) {
        flowBlocks.push({
          id: "finish",
          type: BLOCK_TYPES.FINISH,
          config: {},
          isExpanded: false,
        });
      }

      setAgentName(flow.config.name);
      setAgentDescription(flow.config.description);
      setActive(flow.config.active ?? true);
      setCurrentFlowUuid(flow.uuid);
      setBlocks(flowBlocks);
      setShowLoadMenu(false);

      showToast("Flow loaded successfully!", "success", { clear: true });
    } catch (error) {
      console.error(error);
      showToast("Failed to load flow", "error", { clear: true });
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

  const saveFlow = async () => {
    if (!agentName.trim()) {
      showToast("Please provide a name for your agent flow", "error", {
        clear: true,
      });
      return;
    }

    const flowConfig = {
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
      const { success, error, flow } = await AgentFlows.saveFlow(
        agentName,
        flowConfig,
        currentFlowUuid
      );
      if (!success) throw new Error(error);

      setCurrentFlowUuid(flow.uuid);
      showToast("Agent flow saved successfully!", "success", { clear: true });
      await loadAvailableFlows();
    } catch (error) {
      console.error("Save error details:", error);
      showToast("Failed to save agent flow", "error", { clear: true });
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

  const runFlow = async (uuid) => {
    try {
      const { success, error, _results } = await AgentFlows.runFlow(uuid);
      if (!success) throw new Error(error);

      showToast("Flow executed successfully!", "success", { clear: true });
    } catch (error) {
      console.error(error);
      showToast("Failed to run agent flow", "error", { clear: true });
    }
  };

  const clearFlow = () => {
    setAgentName("");
    setAgentDescription("");
    setCurrentFlowUuid(null);
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

  const moveBlock = (fromIndex, toIndex) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
  };

  return (
    <div
      style={{
        backgroundImage:
          theme === "light"
            ? "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0)"
            : "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 0)",
        backgroundSize: "15px 15px",
        backgroundPosition: "-7.5px -7.5px",
      }}
      className="w-full h-screen flex bg-theme-bg-primary"
    >
      <AgentSidebar
        agentName={agentName}
        setAgentName={setAgentName}
        agentDescription={agentDescription}
        setAgentDescription={setAgentDescription}
        onSave={saveFlow}
        onLoadClick={() => setShowLoadMenu(true)}
        onNewClick={clearFlow}
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
            moveBlock={moveBlock}
          />

          <AddBlockMenu
            showBlockMenu={showBlockMenu}
            setShowBlockMenu={setShowBlockMenu}
            addBlock={addBlock}
          />

          <LoadFlowMenu
            showLoadMenu={showLoadMenu}
            setShowLoadMenu={setShowLoadMenu}
            availableFlows={availableFlows}
            selectedFlowForDetails={selectedFlowForDetails}
            setSelectedFlowForDetails={setSelectedFlowForDetails}
            onLoadFlow={loadFlow}
            onRunFlow={runFlow}
            onFlowDeleted={loadAvailableFlows}
          />
        </div>
      </div>
    </div>
  );
}
