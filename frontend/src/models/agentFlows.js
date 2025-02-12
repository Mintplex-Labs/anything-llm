import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const AgentFlows = {
  /**
   * Save a flow configuration
   * @param {string} name - Display name of the flow
   * @param {object} config - The configuration object for the flow
   * @param {string} [uuid] - Optional UUID for updating existing flow
   * @returns {Promise<{success: boolean, error: string | null, flow: {name: string, config: object, uuid: string} | null}>}
   */
  saveFlow: async (name, config, uuid = null) => {
    return await fetch(`${API_BASE}/agent-flows/save`, {
      method: "POST",
      headers: {
        ...baseHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, config, uuid }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(response.error || "Failed to save flow");
        return res;
      })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
        flow: null,
      }));
  },

  /**
   * List all available flows in the system
   * @returns {Promise<{success: boolean, error: string | null, flows: Array<{name: string, uuid: string, description: string, steps: Array}>}>}
   */
  listFlows: async () => {
    return await fetch(`${API_BASE}/agent-flows/list`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
        flows: [],
      }));
  },

  /**
   * Get a specific flow by UUID
   * @param {string} uuid - The UUID of the flow to retrieve
   * @returns {Promise<{success: boolean, error: string | null, flow: {name: string, config: object, uuid: string} | null}>}
   */
  getFlow: async (uuid) => {
    return await fetch(`${API_BASE}/agent-flows/${uuid}`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error(response.error || "Failed to get flow");
        return res;
      })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
        flow: null,
      }));
  },

  /**
   * Execute a specific flow
   * @param {string} uuid - The UUID of the flow to run
   * @param {object} variables - Optional variables to pass to the flow
   * @returns {Promise<{success: boolean, error: string | null, results: object | null}>}
   */
  // runFlow: async (uuid, variables = {}) => {
  //   return await fetch(`${API_BASE}/agent-flows/${uuid}/run`, {
  //     method: "POST",
  //     headers: {
  //       ...baseHeaders(),
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ variables }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error(response.error || "Failed to run flow");
  //       return res;
  //     })
  //     .then((res) => res.json())
  //     .catch((e) => ({
  //       success: false,
  //       error: e.message,
  //       results: null,
  //     }));
  // },

  /**
   * Delete a specific flow
   * @param {string} uuid - The UUID of the flow to delete
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  deleteFlow: async (uuid) => {
    return await fetch(`${API_BASE}/agent-flows/${uuid}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error(response.error || "Failed to delete flow");
        return res;
      })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },

  /**
   * Toggle a flow's active status
   * @param {string} uuid - The UUID of the flow to toggle
   * @param {boolean} active - The new active status
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  toggleFlow: async (uuid, active) => {
    try {
      const result = await fetch(`${API_BASE}/agent-flows/${uuid}/toggle`, {
        method: "POST",
        headers: {
          ...baseHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.error || "Failed to toggle flow");
          return res;
        })
        .then((res) => res.json());
      return { success: true, flow: result.flow };
    } catch (error) {
      console.error("Failed to toggle flow:", error);
      return { success: false, error: error.message };
    }
  },
};

export default AgentFlows;
