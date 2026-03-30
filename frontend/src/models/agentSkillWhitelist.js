import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const AgentSkillWhitelist = {
  /**
   * Add a skill to the whitelist
   * @param {string} skillName - The skill name to whitelist
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  addToWhitelist: async function (skillName) {
    return fetch(`${API_BASE}/agent-skills/whitelist/add`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ skillName }),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message }));
  },
};

export default AgentSkillWhitelist;
