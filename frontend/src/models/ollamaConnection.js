import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const OllamaConnection = {
  getAll: async () => {
    return await fetch(`${API_BASE}/ollama-connections`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((response) => response.json())
      .then((data) => data?.connections || [])
      .catch((error) => {
        console.error(error);
        return [];
      });
  },

  create: async (data) => {
    return await fetch(`${API_BASE}/ollama-connections/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        return { connection: null, error: error.message };
      });
  },

  update: async (id, data) => {
    return await fetch(`${API_BASE}/ollama-connections/${id}`, {
      method: "PUT",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        return { connection: null, error: error.message };
      });
  },

  delete: async (id) => {
    return await fetch(`${API_BASE}/ollama-connections/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        return { success: false, error: error.message };
      });
  },
};

export default OllamaConnection;
