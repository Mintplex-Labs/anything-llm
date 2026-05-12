import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const AdvancedGateway = {
  getConfig: async function () {
    return await fetch(`${API_BASE}/advanced-gateway/config`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { config: null, error: e.message };
      });
  },

  saveConfig: async function (updates = {}) {
    return await fetch(`${API_BASE}/advanced-gateway/config`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  testConnection: async function () {
    return await fetch(`${API_BASE}/advanced-gateway/test`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default AdvancedGateway;
