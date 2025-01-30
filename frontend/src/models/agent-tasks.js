import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const AgentTasks = {
  /**
   * Save a task configuration with a given name and config
   * @param {string} name - The name of the task to save
   * @param {object} config - The configuration object for the task
   * @returns {Promise<{success: boolean, error: string | null, task: {name: string, config: object} | null}>}
   */
  saveTask: async (name, config) => {
    return await fetch(`${API_BASE}/agent-task/save`, {
      method: "POST",
      headers: {
        ...baseHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, config }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) throw new Error(response.error || "Failed to save task");
        return response;
      })
      .catch((e) => ({
        success: false,
        error: e.message,
        task: null,
      }));
  },

  /**
   * List all available tasks in the system
   * @returns {Promise<{success: boolean, error: string | null, tasks: string[]}>}
   */
  listTasks: async () => {
    return await fetch(`${API_BASE}/agent-task/list`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
        tasks: [],
      }));
  },

  /**
   * Get a specific task by its name
   * @param {string} name - The name of the task to retrieve
   * @returns {Promise<{success: boolean, error: string | null, task: {name: string, config: object} | null}>}
   */
  getTask: async (name) => {
    return await fetch(`${API_BASE}/agent-task/${name}`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) throw new Error(response.error || "Failed to get task");
        return response;
      })
      .catch((e) => ({
        success: false,
        error: e.message,
        task: null,
      }));
  },

  /**
   * Execute a specific task with optional variables
   * @param {string} name - The name of the task to run
   * @param {object} variables - Optional variables to pass to the task
   * @returns {Promise<{success: boolean, error: string | null, results: object | null}>}
   */
  runTask: async (name, variables = {}) => {
    return await fetch(`${API_BASE}/agent-task/${name}/run`, {
      method: "POST",
      headers: {
        ...baseHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ variables }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) throw new Error(response.error || "Failed to run task");
        return response;
      })
      .catch((e) => ({
        success: false,
        error: e.message,
        results: null,
      }));
  },
};

export default AgentTasks;
