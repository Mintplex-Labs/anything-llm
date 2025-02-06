import React, { useState } from "react";
import AgentTasks from "@/models/agent-tasks";
import showToast from "@/utils/toast";
import { Gear, ListChecks } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";

export default function TaskPanel({ task, toggleTask }) {
  const [isActive, setIsActive] = useState(task.active);
  const navigate = useNavigate();

  const handleToggle = async () => {
    const { success, error } = await AgentTasks.toggleTask(
      task.uuid,
      !isActive
    );
    if (success) {
      setIsActive(!isActive);
      toggleTask(task.uuid);
      showToast("Task status updated successfully", "success", { clear: true });
    } else {
      showToast(error || "Failed to toggle task", "error", { clear: true });
    }
  };

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
          <div className="flex items-center gap-x-2">
            <ListChecks size={24} weight="bold" className="text-white" />
            <label htmlFor="name" className="text-white text-md font-bold">
              {task.name}
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
            <button
              onClick={() => navigate(paths.agents.editAgent(task.uuid))}
              className="p-1.5 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
            >
              <Gear className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            {task.description || "No description provided"}
          </p>
        </div>
      </div>
    </>
  );
}
