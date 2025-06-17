import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

/**
 * @typedef {Object} PromptHistory
 * @property {number} id - The ID of the prompt history entry
 * @property {number} workspaceId - The ID of the workspace
 * @property {string} prompt - The prompt text
 * @property {number|null} modifiedBy - The ID of the user who modified the prompt
 * @property {Date} modifiedAt - The date when the prompt was modified
 * @property {Object|null} user - The user who modified the prompt
 */

const PromptHistory = {
  /**
   * Get all prompt history for a workspace
   * @param {number} workspaceId - The ID of the workspace
   * @returns {Promise<PromptHistory[]>} - An array of prompt history entries
   */
  forWorkspace: async function (workspaceId) {
    try {
      return await fetch(
        `${API_BASE}/workspace/${workspaceId}/prompt-history`,
        {
          method: "GET",
          headers: baseHeaders(),
        }
      )
        .then((res) => res.json())
        .then((res) => res.history || [])
        .catch((error) => {
          console.error("Error fetching prompt history:", error);
          return [];
        });
    } catch (error) {
      console.error("Error fetching prompt history:", error);
      return [];
    }
  },

  /**
   * Delete all prompt history for a workspace
   * @param {number} workspaceId - The ID of the workspace
   * @returns {Promise<{success: boolean, error: string}>} - A promise that resolves to an object containing a success flag and an error message
   */
  clearAll: async function (workspaceId) {
    try {
      return await fetch(
        `${API_BASE}/workspace/${workspaceId}/prompt-history`,
        {
          method: "DELETE",
          headers: baseHeaders(),
        }
      )
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error clearing prompt history:", error);
          return { success: false, error };
        });
    } catch (error) {
      console.error("Error clearing prompt history:", error);
      return { success: false, error };
    }
  },

  delete: async function (id) {
    try {
      return await fetch(`${API_BASE}/workspace/prompt-history/${id}`, {
        method: "DELETE",
        headers: baseHeaders(),
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error deleting prompt history:", error);
          return { success: false, error };
        });
    } catch (error) {
      console.error("Error deleting prompt history:", error);
      return { success: false, error };
    }
  },
};

export default PromptHistory;
