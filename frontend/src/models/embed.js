import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Embed = {
  embeds: async () => {
    return await fetch(`${API_BASE}/embeds`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.embeds || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newEmbed: async (data) => {
    return await fetch(`${API_BASE}/embeds/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { embed: null, error: e.message };
      });
  },
  updateEmbed: async (embedId, data) => {
    return await fetch(`${API_BASE}/embed/update/${embedId}`, {
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
  deleteEmbed: async (embedId) => {
    return await fetch(`${API_BASE}/embed/${embedId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (res.ok) return { success: true, error: null };
        throw new Error(res.statusText);
      })
      .catch((e) => {
        console.error(e);
        return { success: true, error: e.message };
      });
  },
  chats: async (offset = 0) => {
    return await fetch(`${API_BASE}/embed/chats`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ offset }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  deleteChat: async (chatId) => {
    return await fetch(`${API_BASE}/embed/chats/${chatId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  // DSGVO: Clear all embed chats (globally)
  clearAllChats: async () => {
    return await fetch(`${API_BASE}/embed-chats/clear/-1`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  // DSGVO: Clear all chats for a specific embed
  clearEmbedChats: async (embedId) => {
    return await fetch(`${API_BASE}/embed-chats/clear/${embedId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Analytics: Get basic statistics overview
  getAnalyticsOverview: async (embedId, startDate, endDate) => {
    return await fetch(`${API_BASE}/embed/${embedId}/analytics/overview`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ startDate, endDate }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Analytics: Get conversations list
  getConversations: async (
    embedId,
    offset = 0,
    limit = 20,
    startDate,
    endDate
  ) => {
    return await fetch(
      `${API_BASE}/embed/${embedId}/analytics/conversations`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ offset, limit, startDate, endDate }),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Analytics: Get conversation details
  getConversationDetails: async (embedId, sessionId) => {
    return await fetch(
      `${API_BASE}/embed/${embedId}/conversation/${sessionId}`,
      {
        method: "GET",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Visual Config: Get embed by ID (with visual_config)
  getEmbed: async (embedId) => {
    const embeds = await Embed.embeds();
    return embeds.find((e) => e.id === Number(embedId)) || null;
  },

  // Visual Config: Update visual config
  updateVisualConfig: async (embedId, visualConfig) => {
    return await fetch(`${API_BASE}/embed/update/${embedId}`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ visual_config: JSON.stringify(visualConfig) }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Visual Config: Upload embed logo
  uploadEmbedLogo: async (embedId, formData) => {
    return await fetch(`${API_BASE}/embed/${embedId}/upload-logo`, {
      method: "POST",
      headers: {
        Authorization: baseHeaders().Authorization,
      },
      body: formData,
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Visual Config: Remove embed logo
  removeEmbedLogo: async (embedId) => {
    return await fetch(`${API_BASE}/embed/${embedId}/remove-logo`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Get conversations (global view, grouped by conversation_id)
  getConversationsGlobal: async (
    offset = 0,
    limit = 20,
    startDate,
    endDate
  ) => {
    return await fetch(`${API_BASE}/embed/chats/conversations`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ offset, limit, startDate, endDate }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default Embed;
