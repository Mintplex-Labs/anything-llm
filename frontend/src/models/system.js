import { API_BASE, AUTH_TIMESTAMP, fullApiUrl } from "@/utils/constants";
import { baseHeaders, safeJsonParse } from "@/utils/request";
import DataConnector from "./dataConnector";

const System = {
  cacheKeys: {
    footerIcons: "anythingllm_footer_links",
  },
  ping: async function () {
    return await fetch(`${API_BASE}/ping`)
      .then((res) => res.json())
      .then((res) => res?.online || false)
      .catch(() => false);
  },
  totalIndexes: async function (slug = null) {
    const url = new URL(`${fullApiUrl()}/system/system-vectors`);
    if (!!slug) url.searchParams.append("slug", encodeURIComponent(slug));
    return await fetch(url.toString(), {
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not find indexes.");
        return res.json();
      })
      .then((res) => res.vectorCount)
      .catch(() => 0);
  },
  keys: async function () {
    return await fetch(`${API_BASE}/setup-complete`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not find setup information.");
        return res.json();
      })
      .then((res) => res.results)
      .catch(() => null);
  },
  localFiles: async function () {
    return await fetch(`${API_BASE}/system/local-files`, {
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not find setup information.");
        return res.json();
      })
      .then((res) => res.localFiles)
      .catch(() => null);
  },
  needsAuthCheck: function () {
    const lastAuthCheck = window.localStorage.getItem(AUTH_TIMESTAMP);
    if (!lastAuthCheck) return true;
    const expiresAtMs = Number(lastAuthCheck) + 60 * 5 * 1000; // expires in 5 minutes in ms
    return Number(new Date()) > expiresAtMs;
  },

  checkAuth: async function (currentToken = null) {
    const valid = await fetch(`${API_BASE}/system/check-token`, {
      headers: baseHeaders(currentToken),
    })
      .then((res) => res.ok)
      .catch(() => false);

    window.localStorage.setItem(AUTH_TIMESTAMP, Number(new Date()));
    return valid;
  },
  requestToken: async function (body) {
    return await fetch(`${API_BASE}/request-token`, {
      method: "POST",
      body: JSON.stringify({ ...body }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not validate login.");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        return { valid: false, message: e.message };
      });
  },
  checkDocumentProcessorOnline: async () => {
    return await fetch(`${API_BASE}/system/document-processing-status`, {
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch(() => false);
  },
  acceptedDocumentTypes: async () => {
    return await fetch(`${API_BASE}/system/accepted-document-types`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.types)
      .catch(() => null);
  },
  updateSystem: async (data) => {
    return await fetch(`${API_BASE}/system/update-env`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { newValues: null, error: e.message };
      });
  },
  updateSystemPassword: async (data) => {
    return await fetch(`${API_BASE}/system/update-password`, {
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
  setupMultiUser: async (data) => {
    return await fetch(`${API_BASE}/system/enable-multi-user`, {
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
  isMultiUserMode: async () => {
    return await fetch(`${API_BASE}/system/multi-user-mode`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.multiUserMode)
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
  deleteDocument: async (name) => {
    return await fetch(`${API_BASE}/system/remove-document`, {
      method: "DELETE",
      headers: baseHeaders(),
      body: JSON.stringify({ name }),
    })
      .then((res) => res.ok)
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
  deleteFolder: async (name) => {
    return await fetch(`${API_BASE}/system/remove-folder`, {
      method: "DELETE",
      headers: baseHeaders(),
      body: JSON.stringify({ name }),
    })
      .then((res) => res.ok)
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
  uploadPfp: async function (formData) {
    return await fetch(`${API_BASE}/system/upload-pfp`, {
      method: "POST",
      body: formData,
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error uploading pfp.");
        return { success: true, error: null };
      })
      .catch((e) => {
        console.log(e);
        return { success: false, error: e.message };
      });
  },
  uploadLogo: async function (formData) {
    return await fetch(`${API_BASE}/system/upload-logo`, {
      method: "POST",
      body: formData,
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error uploading logo.");
        return { success: true, error: null };
      })
      .catch((e) => {
        console.log(e);
        return { success: false, error: e.message };
      });
  },
  fetchCustomFooterIcons: async function () {
    const cache = window.localStorage.getItem(this.cacheKeys.footerIcons);
    const { data, lastFetched } = cache
      ? safeJsonParse(cache, { data: [], lastFetched: 0 })
      : { data: [], lastFetched: 0 };

    if (!!data && Date.now() - lastFetched < 3_600_000)
      return { footerData: data, error: null };

    const { footerData, error } = await fetch(
      `${API_BASE}/system/footer-data`,
      {
        method: "GET",
        cache: "no-cache",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.log(e);
        return { footerData: [], error: e.message };
      });

    if (!footerData || !!error) return { footerData: [], error: null };

    const newData = safeJsonParse(footerData, []);
    window.localStorage.setItem(
      this.cacheKeys.footerIcons,
      JSON.stringify({ data: newData, lastFetched: Date.now() })
    );
    return { footerData: newData, error: null };
  },
  fetchLogo: async function () {
    return await fetch(`${API_BASE}/system/logo`, {
      method: "GET",
      cache: "no-cache",
    })
      .then((res) => {
        if (res.ok && res.status !== 204) return res.blob();
        throw new Error("Failed to fetch logo!");
      })
      .then((blob) => URL.createObjectURL(blob))
      .catch((e) => {
        console.log(e);
        return null;
      });
  },
  fetchPfp: async function (id) {
    return await fetch(`${API_BASE}/system/pfp/${id}`, {
      method: "GET",
      cache: "no-cache",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (res.ok && res.status !== 204) return res.blob();
        throw new Error("Failed to fetch pfp.");
      })
      .then((blob) => (blob ? URL.createObjectURL(blob) : null))
      .catch((e) => {
        console.log(e);
        return null;
      });
  },
  removePfp: async function (id) {
    return await fetch(`${API_BASE}/system/remove-pfp`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (res.ok) return { success: true, error: null };
        throw new Error("Failed to remove pfp.");
      })
      .catch((e) => {
        console.log(e);
        return { success: false, error: e.message };
      });
  },

  isDefaultLogo: async function () {
    return await fetch(`${API_BASE}/system/is-default-logo`, {
      method: "GET",
      cache: "no-cache",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to get is default logo!");
        return res.json();
      })
      .then((res) => res?.isDefaultLogo)
      .catch((e) => {
        console.log(e);
        return null;
      });
  },
  removeCustomLogo: async function () {
    return await fetch(`${API_BASE}/system/remove-logo`, {
      headers: baseHeaders(),
    })
      .then((res) => {
        if (res.ok) return { success: true, error: null };
        throw new Error("Error removing logo!");
      })
      .catch((e) => {
        console.log(e);
        return { success: false, error: e.message };
      });
  },
  getCanDeleteWorkspaces: async function () {
    return await fetch(`${API_BASE}/system/can-delete-workspaces`, {
      method: "GET",
      cache: "no-cache",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch can delete workspaces.");
        return res.json();
      })
      .then((res) => res?.canDelete)
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
  getWelcomeMessages: async function () {
    return await fetch(`${API_BASE}/system/welcome-messages`, {
      method: "GET",
      cache: "no-cache",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch welcome messages.");
        return res.json();
      })
      .then((res) => res.welcomeMessages)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  setWelcomeMessages: async function (messages) {
    return fetch(`${API_BASE}/system/set-welcome-messages`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ messages }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText || "Error setting welcome messages.");
        }
        return { success: true, ...res.json() };
      })
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  getApiKeys: async function () {
    return fetch(`${API_BASE}/system/api-keys`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText || "Error fetching api key.");
        }
        return res.json();
      })
      .catch((e) => {
        console.error(e);
        return { apiKey: null, error: e.message };
      });
  },
  generateApiKey: async function () {
    return fetch(`${API_BASE}/system/generate-api-key`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText || "Error generating api key.");
        }
        return res.json();
      })
      .catch((e) => {
        console.error(e);
        return { apiKey: null, error: e.message };
      });
  },
  deleteApiKey: async function () {
    return fetch(`${API_BASE}/system/api-key`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
  customModels: async function (provider, apiKey = null, basePath = null) {
    return fetch(`${API_BASE}/system/custom-models`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({
        provider,
        apiKey,
        basePath,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText || "Error finding custom models.");
        }
        return res.json();
      })
      .catch((e) => {
        console.error(e);
        return { models: [], error: e.message };
      });
  },
  chats: async (offset = 0) => {
    return await fetch(`${API_BASE}/system/workspace-chats`, {
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
  eventLogs: async (offset = 0) => {
    return await fetch(`${API_BASE}/system/event-logs`, {
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
  clearEventLogs: async () => {
    return await fetch(`${API_BASE}/system/event-logs`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  deleteChat: async (chatId) => {
    return await fetch(`${API_BASE}/system/workspace-chats/${chatId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  exportChats: async (type = "csv") => {
    const url = new URL(`${fullApiUrl()}/system/export-chats`);
    url.searchParams.append("type", encodeURIComponent(type));
    return await fetch(url, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error(res.statusText);
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  updateUser: async (data) => {
    return await fetch(`${API_BASE}/system/user`, {
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
  dataConnectors: DataConnector,
};

export default System;
