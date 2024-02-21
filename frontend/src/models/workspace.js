import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import WorkspaceThread from "@/models/workspaceThread";
import { v4 } from "uuid";

const Workspace = {
  new: async function (data = {}) {
    const { workspace, message } = await fetch(`${API_BASE}/workspace/new`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        return { workspace: null, message: e.message };
      });

    return { workspace, message };
  },
  update: async function (slug, data = {}) {
    const { workspace, message } = await fetch(
      `${API_BASE}/workspace/${slug}/update`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { workspace: null, message: e.message };
      });

    return { workspace, message };
  },
  modifyEmbeddings: async function (slug, changes = {}) {
    const { workspace, message } = await fetch(
      `${API_BASE}/workspace/${slug}/update-embeddings`,
      {
        method: "POST",
        body: JSON.stringify(changes), // contains 'adds' and 'removes' keys that are arrays of filepaths
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { workspace: null, message: e.message };
      });

    return { workspace, message };
  },
  chatHistory: async function (slug) {
    const history = await fetch(`${API_BASE}/workspace/${slug}/chats`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.history || [])
      .catch(() => []);
    return history;
  },
  updateChatFeedback: async function (chatId, slug, feedback) {
    const result = await fetch(
      `${API_BASE}/workspace/${slug}/chat-feedback/${chatId}`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ feedback }),
      }
    )
      .then((res) => res.ok)
      .catch(() => false);
    return result;
  },
  streamChat: async function ({ slug }, message, handleChat) {
    const ctrl = new AbortController();
    await fetchEventSource(`${API_BASE}/workspace/${slug}/stream-chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: baseHeaders(),
      signal: ctrl.signal,
      openWhenHidden: true,
      async onopen(response) {
        if (response.ok) {
          return; // everything's good
        } else if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          handleChat({
            id: v4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `An error occurred while streaming response. Code ${response.status}`,
          });
          ctrl.abort();
          throw new Error("Invalid Status code response.");
        } else {
          handleChat({
            id: v4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `An error occurred while streaming response. Unknown Error.`,
          });
          ctrl.abort();
          throw new Error("Unknown error");
        }
      },
      async onmessage(msg) {
        try {
          const chatResult = JSON.parse(msg.data);
          handleChat(chatResult);
        } catch {}
      },
      onerror(err) {
        handleChat({
          id: v4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: `An error occurred while streaming response. ${err.message}`,
        });
        ctrl.abort();
        throw new Error();
      },
    });
  },
  all: async function () {
    const workspaces = await fetch(`${API_BASE}/workspaces`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.workspaces || [])
      .catch(() => []);

    return workspaces;
  },
  bySlug: async function (slug = "") {
    const workspace = await fetch(`${API_BASE}/workspace/${slug}`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.workspace)
      .catch(() => null);
    return workspace;
  },
  delete: async function (slug) {
    const result = await fetch(`${API_BASE}/workspace/${slug}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch(() => false);

    return result;
  },
  uploadFile: async function (slug, formData) {
    const response = await fetch(`${API_BASE}/workspace/${slug}/upload`, {
      method: "POST",
      body: formData,
      headers: baseHeaders(),
    });

    const data = await response.json();
    return { response, data };
  },
  uploadLink: async function (slug, link) {
    const response = await fetch(`${API_BASE}/workspace/${slug}/upload-link`, {
      method: "POST",
      body: JSON.stringify({ link }),
      headers: baseHeaders(),
    });

    const data = await response.json();
    return { response, data };
  },

  getSuggestedMessages: async function (slug) {
    return await fetch(`${API_BASE}/workspace/${slug}/suggested-messages`, {
      method: "GET",
      cache: "no-cache",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch suggested messages.");
        return res.json();
      })
      .then((res) => res.suggestedMessages)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  setSuggestedMessages: async function (slug, messages) {
    return fetch(`${API_BASE}/workspace/${slug}/suggested-messages`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ messages }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.statusText || "Error setting suggested messages."
          );
        }
        return { success: true, ...res.json() };
      })
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  setPinForDocument: async function (slug, docPath, pinStatus) {
    return fetch(`${API_BASE}/workspace/${slug}/update-pin`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ docPath, pinStatus }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.statusText || "Error setting pin status for document."
          );
        }
        return true;
      })
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
  threads: WorkspaceThread,
};

export default Workspace;
