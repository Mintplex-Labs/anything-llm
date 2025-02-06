import React, { useState, useEffect } from "react";
import { CaretRight } from "@phosphor-icons/react";
import AgentTasks from "@/models/agent-tasks";
import showToast from "@/utils/toast";

export default function AgentTasksList({
  selectedTask,
  handleClick,
  activeTaskIds = [],
}) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, [activeTaskIds]);

  const loadTasks = async () => {
    try {
      const { success, error, tasks } = await AgentTasks.listTasks();
      if (!success) throw new Error(error);
      setTasks(tasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      showToast("Failed to load agent tasks", "error", { clear: true });
    }
  };

  if (tasks.length === 0) return null;

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl min-w-[360px] w-fit">
      {tasks.map((task, index) => (
        <div
          key={task.uuid}
          className={`py-3 px-4 flex items-center justify-between ${
            index === 0 ? "rounded-t-xl" : ""
          } ${
            index === tasks.length - 1
              ? "rounded-b-xl"
              : "border-b border-white/10"
          } cursor-pointer transition-all duration-300 hover:bg-theme-bg-primary ${
            selectedTask?.uuid === task.uuid
              ? "bg-white/10 light:bg-theme-bg-sidebar"
              : ""
          }`}
          onClick={() => handleClick?.(task)}
        >
          <div className="text-sm font-light">{task.name}</div>
          <div className="flex items-center gap-x-2">
            <div className="text-sm text-theme-text-secondary font-medium">
              {task.active ? "On" : "Off"}
            </div>
            <CaretRight
              size={14}
              weight="bold"
              className="text-theme-text-secondary"
            />
          </div>
        </div>
      ))}
    </div>
  );
}