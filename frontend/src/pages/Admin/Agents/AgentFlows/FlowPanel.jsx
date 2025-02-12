import React, { useState, useEffect, useRef } from "react";
import AgentFlows from "@/models/agentFlows";
import showToast from "@/utils/toast";
import { FlowArrow, Gear } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";

function ManageFlowMenu({ flow, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  async function deleteFlow() {
    if (
      !window.confirm(
        "Are you sure you want to delete this flow? This action cannot be undone."
      )
    )
      return;
    const { success, error } = await AgentFlows.deleteFlow(flow.uuid);
    if (success) {
      showToast("Flow deleted successfully.", "success");
      onDelete(flow.uuid);
    } else {
      showToast(error || "Failed to delete flow.", "error");
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
      >
        <Gear className="h-5 w-5" weight="bold" />
      </button>
      {open && (
        <div className="absolute w-[100px] -top-1 left-7 mt-1 border-[1.5px] border-white/40 rounded-lg bg-theme-action-menu-bg flex flex-col shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-white z-99 md:z-10">
          <button
            type="button"
            onClick={() => navigate(paths.agents.editAgent(flow.uuid))}
            className="border-none flex items-center rounded-lg gap-x-2 hover:bg-theme-action-menu-item-hover py-1.5 px-2 transition-colors duration-200 w-full text-left"
          >
            <span className="text-sm">Edit Flow</span>
          </button>
          <button
            type="button"
            onClick={deleteFlow}
            className="border-none flex items-center rounded-lg gap-x-2 hover:bg-theme-action-menu-item-hover py-1.5 px-2 transition-colors duration-200 w-full text-left"
          >
            <span className="text-sm">Delete Flow</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function FlowPanel({ flow, toggleFlow, onDelete }) {
  const [isActive, setIsActive] = useState(flow.active);

  useEffect(() => {
    setIsActive(flow.active);
  }, [flow.uuid, flow.active]);

  const handleToggle = async () => {
    try {
      const { success, error } = await AgentFlows.toggleFlow(
        flow.uuid,
        !isActive
      );
      if (!success) throw new Error(error);
      setIsActive(!isActive);
      toggleFlow(flow.uuid);
      showToast("Flow status updated successfully", "success", { clear: true });
    } catch (error) {
      console.error("Failed to toggle flow:", error);
      showToast("Failed to toggle flow", "error", { clear: true });
    }
  };

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
          <div className="flex items-center gap-x-2">
            <FlowArrow size={24} weight="bold" className="text-white" />
            <label htmlFor="name" className="text-white text-md font-bold">
              {flow.name}
            </label>
            <label className="border-none relative inline-flex items-center ml-auto cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isActive}
                onChange={handleToggle}
              />
              <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
              <span className="ml-3 text-sm font-medium"></span>
            </label>
            <ManageFlowMenu flow={flow} onDelete={onDelete} />
          </div>
          <p className="whitespace-pre-wrap text-white text-opacity-60 text-xs font-medium py-1.5">
            {flow.description || "No description provided"}
          </p>
        </div>
      </div>
    </>
  );
}
