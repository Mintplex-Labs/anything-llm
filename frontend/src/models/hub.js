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

  // Update hub settings (API key, etc.)
  updateSettings: async (data) => {
    return await fetch(`${API_BASE}/hub/settings`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok)
          throw new Error(response.error || "Failed to update settings");
        return { success: true, error: null };
      })
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },

  // Get hub settings
  getSettings: async () => {
    return await fetch(`${API_BASE}/hub/settings`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok)
          throw new Error(response.error || "Failed to fetch settings");
        return { settings: response.settings, error: null };
      })
      .catch((e) => ({
        settings: { hasApiKey: false },
        error: e.message,
      }));
  },

  // Delete an item
  deleteItem: async (id) => {
    return await fetch(`${API_BASE}/hub/items/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Import by string
  importByString: async (data) => {
    return await fetch(`${API_BASE}/hub/import`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Explore items
  explore: async () => {
    return await fetch(`${API_BASE}/hub/explore`, {
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

export default Hub;
