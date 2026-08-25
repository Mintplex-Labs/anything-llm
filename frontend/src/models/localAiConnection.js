import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const LocalAiConnection = {
  all: async () => {
    return fetch(`${API_BASE}/local-ai-connections`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.connections || [])
      .catch(() => []);
  },

  create: async (data) => {
    return fetch(`${API_BASE}/local-ai-connections`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((error) => ({ connection: null, error: error.message }));
  },

  update: async (id, data) => {
    return fetch(`${API_BASE}/local-ai-connections/${id}`, {
      method: "PUT",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((error) => ({ connection: null, error: error.message }));
  },

  delete: async (id) => {
    return fetch(`${API_BASE}/local-ai-connections/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((error) => ({ success: false, error: error.message }));
  },

  models: async (id) => {
    return fetch(`${API_BASE}/local-ai-connections/${id}/models`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((error) => ({ models: [], error: error.message }));
  },
};

export default LocalAiConnection;
