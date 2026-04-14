import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const GmailAgent = {
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
};

export default GmailAgent;
