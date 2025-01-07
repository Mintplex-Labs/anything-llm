import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const BrowserExtensionApiKey = {
  getAll: async () => {
    return await fetch(`${API_BASE}/browser-extension/api-keys`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message, apiKeys: [] };
      });
  },

  generateKey: async () => {
    return await fetch(`${API_BASE}/browser-extension/api-keys/new`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  revoke: async (id) => {
    return await fetch(`${API_BASE}/browser-extension/api-keys/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default BrowserExtensionApiKey;
