import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));
  if (response.ok) return data;
  return {
    success: false,
    ...data,
    message: data?.message || data?.error || fallbackMessage,
  };
}

const WebsiteNpcs = {
  status: async function () {
    return await fetch(`${API_BASE}/swarmsy/website-npcs/status`, {
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(response, "Failed to load SWARMSY website NPC status.")
      )
      .catch(() => ({
        success: false,
        message: "Failed to load SWARMSY website NPC status.",
      }));
  },
  save: async function (npc) {
    return await fetch(`${API_BASE}/swarmsy/website-npcs`, {
      method: "POST",
      headers: {
        ...baseHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(npc),
    })
      .then((response) => parseResponse(response, "Failed to save NPC."))
      .catch(() => ({ success: false, message: "Failed to save NPC." }));
  },
  repairWorkspaces: async function () {
    return await fetch(`${API_BASE}/swarmsy/website-npcs/repair-workspaces`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(
          response,
          "Failed to create or repair default workspaces."
        )
      )
      .catch(() => ({
        success: false,
        message: "Failed to create or repair default workspaces.",
      }));
  },
};

export default WebsiteNpcs;
