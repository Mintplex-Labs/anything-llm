import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Memory = {
  all: async function () {
    return await fetch(`${API_BASE}/memories/all`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.memories || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },

  forWorkspace: async function (workspaceId) {
    return await fetch(`${API_BASE}/memories/${workspaceId}`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.memories || { global: [], workspace: [] })
      .catch((e) => {
        console.error(e);
        return { global: [], workspace: [] };
      });
  },

  create: async function (workspaceId, { content, scope = "workspace" }) {
    return await fetch(`${API_BASE}/memories/${workspaceId}`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ content, scope }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { memory: null, error: e.message };
      });
  },

  update: async function (memoryId, { content }) {
    return await fetch(`${API_BASE}/memories/${memoryId}`, {
      method: "PUT",
      headers: baseHeaders(),
      body: JSON.stringify({ content }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { memory: null, error: e.message };
      });
  },

  delete: async function (memoryId) {
    return await fetch(`${API_BASE}/memories/${memoryId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  promoteToGlobal: async function (memoryId) {
    return await fetch(`${API_BASE}/memories/${memoryId}/promote`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { memory: null, error: e.message };
      });
  },

  clearAll: async function () {
    return await fetch(`${API_BASE}/memories/clear/all`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  runExtraction: async function () {
    return await fetch(`${API_BASE}/memories/run-extraction`, {
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

export default Memory;
