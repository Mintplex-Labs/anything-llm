import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const GoogleAgentSkills = {
  gmail: {
    /**
     * Get the current configuration status for Gmail.
     * @returns {Promise<{success: boolean, isConfigured?: boolean, config?: {deploymentId: string, apiKey: string}, error?: string}>}
     */
    getStatus: async () => {
      return await fetch(`${API_BASE}/admin/agent-skills/gmail/status`, {
        method: "GET",
        headers: baseHeaders(),
      })
        .then((res) => res.json())
        .catch((e) => {
          console.error(e);
          return { success: false, error: e.message };
        });
    },
  },

  calendar: {
    /**
     * Get the current configuration status for Google Calendar.
     * @returns {Promise<{success: boolean, isConfigured?: boolean, config?: {deploymentId: string, apiKey: string}, error?: string}>}
     */
    getStatus: async () => {
      return await fetch(
        `${API_BASE}/admin/agent-skills/google-calendar/status`,
        {
          method: "GET",
          headers: baseHeaders(),
        }
      )
        .then((res) => res.json())
        .catch((e) => {
          console.error(e);
          return { success: false, error: e.message };
        });
    },
  },
};

export default GoogleAgentSkills;
