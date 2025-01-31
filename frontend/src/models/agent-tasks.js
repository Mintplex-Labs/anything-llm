import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const AgentTasks = {
  /**
   * Save a task configuration
   * @param {string} name - Display name of the task
   * @param {object} config - The configuration object for the task
   * @param {string} [uuid] - Optional UUID for updating existing task
   * @returns {Promise<{success: boolean, error: string | null, task: {name: string, config: object, uuid: string} | null}>}
   */
  saveTask: async (name, config, uuid = null) => {
    return await fetch(`${API_BASE}/agent-task/save`, {
      method: "POST",
      headers: {
        ...baseHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, config, uuid }),
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
   * @returns {Promise<{success: boolean, error: string | null, tasks: Array<{name: string, uuid: string, description: string, steps: Array}>}>}
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
   * Get a specific task by UUID
   * @param {string} uuid - The UUID of the task to retrieve
   * @returns {Promise<{success: boolean, error: string | null, task: {name: string, config: object, uuid: string} | null}>}
   */
  getTask: async (uuid) => {
    return await fetch(`${API_BASE}/agent-task/${uuid}`, {
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
   * Execute a specific task
   * @param {string} uuid - The UUID of the task to run
   * @param {object} variables - Optional variables to pass to the task
   * @returns {Promise<{success: boolean, error: string | null, results: object | null}>}
   */
  runTask: async (uuid, variables = {}) => {
    return await fetch(`${API_BASE}/agent-task/${uuid}/run`, {
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

  /**
   * Delete a specific task
   * @param {string} uuid - The UUID of the task to delete
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  deleteTask: async (uuid) => {
    return await fetch(`${API_BASE}/agent-task/${uuid}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) throw new Error(response.error || "Failed to delete task");
        return response;
      })
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },
};

export default AgentTasks;
