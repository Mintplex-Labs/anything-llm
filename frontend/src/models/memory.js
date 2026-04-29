import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

/**
 * @typedef {Object} Memory
 * @property {number} id
 * @property {number|null} userId
 * @property {number|null} workspaceId
 * @property {"workspace"|"global"} scope
 * @property {string} content
 * @property {string|null} lastUsedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

const Memory = {
  /**
   * Fetch all memories (global + workspace) for a workspace.
   * @param {string} slug
   * @returns {Promise<{global: Memory[], workspace: Memory[]}>}
   */
  forWorkspace: async function (slug) {
    return await fetch(`${API_BASE}/workspaces/${slug}/memories`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.memories || { global: [], workspace: [] })
      .catch(() => ({ global: [], workspace: [] }));
  },

  /**
   * Create a new memory for a workspace.
   * @param {string} slug
   * @param {{content: string, scope?: "workspace"|"global"}} body
   * @returns {Promise<{memory: Memory|null, error?: string}>}
   */
  create: async function (slug, { content, scope = "workspace" }) {
    return await fetch(`${API_BASE}/workspaces/${slug}/memories`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ content, scope }),
    })
      .then((res) => res.json())
      .catch((e) => ({ memory: null, error: e.message }));
  },

  /**
   * Update an existing memory's content.
   * @param {number} memoryId
   * @param {{content: string}} body
   * @returns {Promise<{memory: Memory|null, error?: string}>}
   */
  update: async function (memoryId, { content }) {
    return await fetch(`${API_BASE}/memories/${memoryId}`, {
      method: "PUT",
      headers: baseHeaders(),
      body: JSON.stringify({ content }),
    })
      .then((res) => res.json())
      .catch((e) => ({ memory: null, error: e.message }));
  },

  /**
   * Delete a memory.
   * @param {number} memoryId
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  delete: async function (memoryId) {
    return await fetch(`${API_BASE}/memories/${memoryId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message }));
  },

  /**
   * Promote a workspace-scoped memory to global.
   * @param {number} memoryId
   * @returns {Promise<{memory: Memory|null, error?: string}>}
   */
  promoteToGlobal: async function (memoryId) {
    return await fetch(`${API_BASE}/memories/${memoryId}/promote`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({ memory: null, error: e.message }));
  },

  /**
   * Demote a global memory to a specific workspace.
   * @param {number} memoryId
   * @param {string} slug
   * @returns {Promise<{memory: Memory|null, error?: string}>}
   */
  demoteToWorkspace: async function (memoryId, slug) {
    return await fetch(`${API_BASE}/memories/${memoryId}/demote/${slug}`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({ memory: null, error: e.message }));
  },
};

export default Memory;
