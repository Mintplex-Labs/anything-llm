import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { Play, Info } from "@phosphor-icons/react";
import { AgentTasks as AgentTasksModel } from "@/models/agent-tasks";

export default function AgentTasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const taskList = await AgentTasksModel.list();
      setTasks(taskList);

      // Load details for each task
      const details = {};
      for (const taskName of taskList) {
        const task = await AgentTasksModel.load(taskName);
        details[taskName] = task.config;
      }
      setTaskDetails(details);
    } catch (error) {
      console.error(error);
      toast({
        type: "error",
        title: "Error",
        description: "Failed to load agent tasks",
      });
    } finally {
      setLoading(false);
    }
  };

  const runTask = async (taskName) => {
    try {
      const task = taskDetails[taskName];
      const startBlock = task.steps.find((step) => step.type === "START");
      const variables = {};

      // If there are variables defined in the start block, prompt for their values
      if (startBlock?.config?.variables) {
        for (const variable of startBlock.config.variables) {
          if (!variable.name) continue;
          const value = prompt(
            `Enter value for ${variable.name}:`,
            variable.value || ""
          );
          if (value === null) return; // User cancelled
          variables[variable.name] = value;
        }
      }

      const results = await AgentTasksModel.run(taskName, variables);

      toast({
        type: "success",
        title: "Task Complete",
        description: "Task executed successfully!",
      });

      // Show results in a more readable format
      console.log("Task Results:", results);
    } catch (error) {
      console.error(error);
      toast({
        type: "error",
        title: "Error",
        description: "Failed to run agent task",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-theme-bg-primary">
        <div className="text-white">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-theme-bg-primary p-6">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Agent Tasks</h1>

        {tasks.length === 0 ? (
          <div className="text-white/60">
            No agent tasks found. Create one in the Agent Builder.
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((taskName) => (
              <div
                key={taskName}
                className="bg-theme-action-menu-bg border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{taskName}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedTask(
                          selectedTask === taskName ? null : taskName
                        )
                      }
                      className="p-2 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Toggle details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => runTask(taskName)}
                      className="p-2 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Run task"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {selectedTask === taskName && taskDetails[taskName] && (
                  <div className="mt-4 p-4 bg-theme-bg-primary rounded-lg border border-white/5">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
