import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import { fetchEventSource } from "@microsoft/fetch-event-source";
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
  streamChat: async function ({ slug }, message, mode = "query", handleChat) {
    const ctrl = new AbortController();
    await fetchEventSource(`${API_BASE}/workspace/${slug}/stream-chat`, {
      method: "POST",
      body: JSON.stringify({ message, mode }),
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

  // TODO: Deprecated and should be removed from frontend.
  sendChat: async function ({ slug }, message, mode = "query") {
    const chatResult = await fetch(`${API_BASE}/workspace/${slug}/chat`, {
      method: "POST",
      body: JSON.stringify({ message, mode }),
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return null;
      });

    return chatResult;
  },
};

export default Workspace;
