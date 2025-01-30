export const AgentTasks = {
  async list() {
    const response = await fetch("/api/agent-task/list");
    if (!response.ok) throw new Error("Failed to load tasks");
    const { tasks } = await response.json();
    return tasks;
  },

  async load(taskName) {
    const response = await fetch(`/api/agent-task/${taskName}`);
    if (!response.ok) throw new Error("Failed to load task");
    const { task } = await response.json();
    return task;
  },

  async save(name, config) {
    const response = await fetch("/api/agent-task/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, config }),
    });
    if (!response.ok) throw new Error("Failed to save task");
    const { task } = await response.json();
    return task;
  },

  async run(taskName, variables = {}) {
    const response = await fetch(`/api/agent-task/${taskName}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ variables }),
    });
    if (!response.ok) throw new Error("Failed to run task");
    const { results } = await response.json();
    return results;
  }
};