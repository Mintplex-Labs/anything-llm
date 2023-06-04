import { API_BASE } from "../utils/constants";

const Workspace = {
  new: async function (data = {}) {
    const { workspace, message } = await fetch(`${API_BASE}/workspace/new`, {
      method: "POST",
      body: JSON.stringify(data),
    })
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
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { workspace: null, message: e.message };
      });

    return { workspace, message };
  },
  chatHistory: async function (slug) {
    const history = await fetch(`${API_BASE}/workspace/${slug}/chats`)
      .then((res) => res.json())
      .then((res) => res.history || [])
      .catch(() => []);
    return history;
  },
  sendChat: async function ({ slug }, message, mode = "query") {
    const chatResult = await fetch(`${API_BASE}/workspace/${slug}/chat`, {
      method: "POST",
      body: JSON.stringify({ message, mode }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return null;
      });

    return chatResult;
  },
  all: async function () {
    const workspaces = await fetch(`${API_BASE}/workspaces`)
      .then((res) => res.json())
      .then((res) => res.workspaces || [])
      .catch(() => []);

    return workspaces;
  },
  bySlug: async function (slug = "") {
    const workspace = await fetch(`${API_BASE}/workspace/${slug}`)
      .then((res) => res.json())
      .then((res) => res.workspace)
      .catch(() => null);
    return workspace;
  },
  delete: async function (slug) {
    const result = await fetch(`${API_BASE}/workspace/${slug}`, {
      method: "DELETE",
    })
      .then((res) => res.ok)
      .catch(() => false);

    return result;
  },
};

export default Workspace;
