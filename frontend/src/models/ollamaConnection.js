import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const OllamaConnection = {
  getAll: async () => {
    return await fetch(`${API_BASE}/ollama-connections`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.connections || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },

  create: async (data) => {
    return await fetch(`${API_BASE}/ollama-connections/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { connection: null, error: e.message };
      });
  },

  update: async (id, data) => {
    return await fetch(`${API_BASE}/ollama-connections/${id}`, {
      method: "PUT",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { connection: null, error: e.message };
      });
  },

  delete: async (id) => {
    return await fetch(`${API_BASE}/ollama-connections/${id}`, {
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

export default OllamaConnection;
