import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const CommunityHub = {
  /**
   * Get an item from the community hub by its import ID.
   * @param {string} importId - The import ID of the item.
   * @returns {Promise<{error: string | null, item: object | null}>}
   */
  getItemFromImportId: async (importId) => {
    return await fetch(`${API_BASE}/community-hub/item`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ importId }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return {
          error: e.message,
          item: null,
        };
      });
  },

  /**
   * Apply an item to the AnythingLLM instance. Used for simple items like slash commands and system prompts.
   * @param {string} importId - The import ID of the item.
   * @param {object} options - Additional options for applying the item for whatever the item type requires.
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  applyItem: async (importId, options = {}) => {
    return await fetch(`${API_BASE}/community-hub/apply`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ importId, options }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return {
          success: false,
          error: e.message,
        };
      });
  },

  /**
   * Import a bundle item from the community hub.
   * @param {string} importId - The import ID of the item.
   * @returns {Promise<{error: string | null, item: object | null}>}
   */
  importBundleItem: async (importId) => {
    return await fetch(`${API_BASE}/community-hub/import`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ importId }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) throw new Error(response?.error ?? res.statusText);
        return response;
      })
      .catch((e) => {
        return {
          error: e.message,
          item: null,
        };
      });
  },

  /**
   * Update the hub settings (API key, etc.)
   * @param {Object} data - The data to update.
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  updateSettings: async (data) => {
    return await fetch(`${API_BASE}/community-hub/settings`, {
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

  /**
   * Get the hub settings (API key, etc.)
   * @returns {Promise<{connectionKey: string | null, error: string | null}>}
   */
  getSettings: async () => {
    return await fetch(`${API_BASE}/community-hub/settings`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok)
          throw new Error(response.error || "Failed to fetch settings");
        return { connectionKey: response.connectionKey, error: null };
      })
      .catch((e) => ({
        connectionKey: null,
        error: e.message,
      }));
  },

  /**
   * Fetch the explore items from the community hub that are publicly available.
   * @returns {Promise<{agentSkills: {items: [], hasMore: boolean, totalCount: number}, systemPrompts: {items: [], hasMore: boolean, totalCount: number}, slashCommands: {items: [], hasMore: boolean, totalCount: number}}>}
   */
  fetchExploreItems: async () => {
    return await fetch(`${API_BASE}/community-hub/explore`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return {
          success: false,
          error: e.message,
          result: null,
        };
      });
  },

  /**
   * Fetch the user items from the community hub.
   * @returns {Promise<{success: boolean, error: string | null, createdByMe: object, teamItems: object[]}>}
   */
  fetchUserItems: async () => {
    return await fetch(`${API_BASE}/community-hub/items`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return {
          success: false,
          error: e.message,
          createdByMe: {},
          teamItems: [],
        };
      });
  },

  /**
   * Create a new system prompt in the community hub
   * @param {Object} data - The system prompt data
   * @param {string} data.name - The name of the prompt
   * @param {string} data.description - The description of the prompt
   * @param {string} data.prompt - The actual system prompt text
   * @param {string[]} data.tags - Array of tags
   * @param {string} data.visibility - Either 'public' or 'private'
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  createSystemPrompt: async (data) => {
    return await fetch(`${API_BASE}/community-hub/system-prompt/create`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok)
          throw new Error(response.error || "Failed to create system prompt");
        return { success: true, error: null, itemId: response.item?.id };
      })
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },

  /**
   * Create a new agent flow in the community hub
   * @param {Object} data - The agent flow data
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  createAgentFlow: async (data) => {
    return await fetch(`${API_BASE}/community-hub/agent-flow/create`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    }).then(async (res) => {
      const response = await res.json();
      if (!res.ok)
        throw new Error(response.error || "Failed to create agent flow");
      return { success: true, error: null, itemId: response.item?.id };
    });
  },

  /**
   * Create a new slash command in the community hub
   * @param {Object} data - The slash command data
   * @param {string} data.name - The name of the command
   * @param {string} data.description - The description of the command
   * @param {string} data.command - The actual command text
   * @param {string} data.prompt - The prompt for the command
   * @param {string[]} data.tags - Array of tags
   * @param {string} data.visibility - Either 'public' or 'private'
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  createSlashCommand: async (data) => {
    return await fetch(`${API_BASE}/community-hub/slash-command/create`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok)
          throw new Error(response.error || "Failed to create slash command");
        return { success: true, error: null, itemId: response.item?.id };
      })
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },
};

export default CommunityHub;
