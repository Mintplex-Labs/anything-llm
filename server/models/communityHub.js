const ImportedPlugin = require("../utils/agents/imported");

/**
 * An interface to the community hub for AnythingLLM external API.
 */
const CommunityHub = {
  importPrefix: "allm-community-id",
  apiBase:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:5001/anythingllm-hub/us-central1/external/v1"
      : "https://external-ipxn23pfkq-uc.a.run.app/v1",

  /**
   * Validate an import ID and return the entity type and ID.
   * @param {string} importId - The import ID to validate.
   * @returns {{entityType: string | null, entityId: string | null}}
   */
  validateImportId: function (importId) {
    if (
      !importId ||
      !importId.startsWith(this.importPrefix) ||
      importId.split(":").length !== 3
    )
      return { entityType: null, entityId: null };
    const [_, entityType, entityId] = importId.split(":");
    if (!entityType || !entityId) return { entityType: null, entityId: null };
    return {
      entityType: String(entityType).trim(),
      entityId: String(entityId).trim(),
    };
  },

  /**
   * Fetch the explore items from the community hub that are publicly available.
   * @returns {Promise<{agentSkills: {items: [], hasMore: boolean, totalCount: number}, systemPrompts: {items: [], hasMore: boolean, totalCount: number}, slashCommands: {items: [], hasMore: boolean, totalCount: number}}>}
   */
  fetchExploreItems: async function () {
    return await fetch(`${this.apiBase}/explore`, {
      method: "GET",
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching explore items:", error);
        return {
          agentSkills: {
            items: [],
            hasMore: false,
            totalCount: 0,
          },
          systemPrompts: {
            items: [],
            hasMore: false,
            totalCount: 0,
          },
          slashCommands: {
            items: [],
            hasMore: false,
            totalCount: 0,
          },
        };
      });
  },

  getItemFromImportId: async function (importId) {
    const { entityType, entityId } = this.validateImportId(importId);
    if (!entityType || !entityId)
      return { item: null, error: "Invalid import ID" };

    const { SystemSettings } = require("./systemSettings");
    const { connectionKey } = await SystemSettings.hubSettings();
    return await fetch(`${this.apiBase}/${entityType}/${entityId}/review`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(connectionKey ? { Authorization: `Bearer ${connectionKey}` } : {}),
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(`Error fetching item for import ID ${importId}:`, error);
        return { item: null, error: error.message };
      });
  },

  /**
   * Fetch a bundle item from the community hub.
   * Bundle items are entities that require a downloadURL to be fetched from the community hub.
   * so we can unzip and import them to the AnythingLLM instance.
   * @param {string} importId - The import ID of the item.
   * @returns {Promise<{url: string | null, item: object | null, error: string | null}>}
   */
  getBundleItem: async function (importId) {
    const { entityType, entityId } = this.validateImportId(importId);
    if (!entityType || !entityId)
      return { item: null, error: "Invalid import ID" };

    const { SystemSettings } = require("./systemSettings");
    const { connectionKey } = await SystemSettings.hubSettings();
    const { url, item, error } = await fetch(
      `${this.apiBase}/${entityType}/${entityId}/pull`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(connectionKey
            ? { Authorization: `Bearer ${connectionKey}` }
            : {}),
        },
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.error(
          `Error fetching bundle item for import ID ${importId}:`,
          error
        );
        return { url: null, item: null, error: error.message };
      });
    return { url, item, error };
  },

  /**
   * Import a bundle item to the AnythingLLM instance by downloading the zip file and importing it.
   * or whatever the item type requires.
   * @param {{url: string, item: object}} params
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  importBundleItem: async function ({ url, item }) {
    if (item.itemType === "agent-skill") {
      const { success, error } =
        await ImportedPlugin.importCommunityItemFromUrl(url, item);
      return { success, error };
    }

    return {
      success: false,
      error: "Unsupported item type. Nothing to import.",
    };
  },

  fetchUserItems: async function (connectionKey) {
    if (!connectionKey) return { createdByMe: {}, teamItems: [] };

    return await fetch(`${this.apiBase}/items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connectionKey}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching user items:", error);
        return { createdByMe: {}, teamItems: [] };
      });
  },
};

module.exports = { CommunityHub };