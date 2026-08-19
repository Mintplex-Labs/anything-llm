import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const FoundryUtils = {
  capabilities: async function (basePath = "") {
    try {
      const response = await fetch(`${API_BASE}/utils/foundry/capabilities`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ basePath }),
      });
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (error) {
      console.error("Error fetching Foundry capabilities:", error);
      return { source: "openai", canManage: false };
    }
  },
};

export default FoundryUtils;
