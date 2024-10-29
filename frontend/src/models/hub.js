import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Hub = {
  // Get all imported items
  getItems: async () => {
    return await fetch(`${API_BASE}/hub/items`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.items || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },

  // Import a new item from the hub
  importItem: async (data) => {
    return await fetch(`${API_BASE}/hub/items`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to import item.");
        return res.json();
      })
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },

  // Delete an imported item
  deleteItem: async (id) => {
    return await fetch(`${API_BASE}/hub/items/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch((e) => {
        console.error(e);
        return false;
      });
  },

  // Get hub API key from system settings
  getApiKey: async () => {
    return await fetch(`${API_BASE}/system/settings?labels=hub_api_key`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.settings?.hub_api_key || null)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },

  // Fetch hub settings (API key, etc.)
  getSettings: async () => {
    return await fetch(`${API_BASE}/hub/settings`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.settings)
      .catch((e) => {
        console.error(e);
        return { hasApiKey: false };
      });
  },

  // Update hub settings (API key, etc.)
  updateSettings: async (data) => {
    return await fetch(`${API_BASE}/hub/settings`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    });
  },
};

export default Hub;
