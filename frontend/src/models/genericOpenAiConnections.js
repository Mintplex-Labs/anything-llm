import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const GenericOpenAiConnections = {
  list: async () => {
    return await fetch(`${API_BASE}/generic-openai/connections`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        connections: [],
        activeConnectionId: null,
        error: e.message,
      }));
  },

  save: async (data) => {
    return await fetch(`${API_BASE}/generic-openai/connections`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },

  activate: async (id) => {
    return await fetch(`${API_BASE}/generic-openai/connections/activate`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },

  delete: async (id) => {
    return await fetch(`${API_BASE}/generic-openai/connections/delete`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },
};

export default GenericOpenAiConnections;
