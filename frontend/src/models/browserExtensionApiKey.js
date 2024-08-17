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

  accept: async (key) => {
    return await fetch(`${API_BASE}/browser-extension/api-keys/accept`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ key }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  revoke: async (key) => {
    return await fetch(`${API_BASE}/browser-extension/api-keys/revoke`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ key }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  register: async () => {
    return await fetch(`${API_BASE}/browser-extension/register`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  unregister: async (key) => {
    return await fetch(`${API_BASE}/browser-extension/unregister`, {
      method: "POST",
      headers: {
        ...baseHeaders(),
        Authorization: `Bearer ${key}`,
      },
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default BrowserExtensionApiKey;
