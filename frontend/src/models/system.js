import { API_BASE, AUTH_TIMESTAMP, fullApiUrl } from "@/utils/constants";
import { baseHeaders, safeJsonParse } from "@/utils/request";
import DataConnector from "./dataConnector";
import LiveDocumentSync from "./experimental/liveSync";
import AgentPlugins from "./experimental/agentPlugins";

const System = {
  cacheKeys: {
    footerIcons: "anythingllm_footer_links",
    supportEmail: "anythingllm_support_email",
    customAppName: "anythingllm_custom_app_name",
    canViewChatHistory: "anythingllm_can_view_chat_history",
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
  recoverAccount: async function (username, recoveryCodes) {
    return await fetch(`${API_BASE}/system/recover-account`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ username, recoveryCodes }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error recovering account.");
        }
        return data;
      })
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  resetPassword: async function (token, newPassword, confirmPassword) {
    return await fetch(`${API_BASE}/system/reset-password`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error resetting password.");
        }
        return data;
      })
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
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
  deleteDocuments: async (names = []) => {
    return await fetch(`${API_BASE}/system/remove-documents`, {
      method: "DELETE",
      headers: baseHeaders(),
      body: JSON.stringify({ names }),
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
  fetchSupportEmail: async function () {
    const cache = window.localStorage.getItem(this.cacheKeys.supportEmail);
    const { email, lastFetched } = cache
      ? safeJsonParse(cache, { email: "", lastFetched: 0 })
      : { email: "", lastFetched: 0 };

    if (!!email && Date.now() - lastFetched < 3_600_000)
      return { email: email, error: null };

    const { supportEmail, error } = await fetch(
      `${API_BASE}/system/support-email`,
      {
        method: "GET",
        cache: "no-cache",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.log(e);
        return { email: "", error: e.message };
      });

    if (!supportEmail || !!error) return { email: "", error: null };
    window.localStorage.setItem(
      this.cacheKeys.supportEmail,
      JSON.stringify({ email: supportEmail, lastFetched: Date.now() })
    );
    return { email: supportEmail, error: null };
  },

  fetchCustomAppName: async function () {
    const cache = window.localStorage.getItem(this.cacheKeys.customAppName);
    const { appName, lastFetched } = cache
      ? safeJsonParse(cache, { appName: "", lastFetched: 0 })
      : { appName: "", lastFetched: 0 };

    if (!!appName && Date.now() - lastFetched < 3_600_000)
      return { appName: appName, error: null };

    const { customAppName, error } = await fetch(
      `${API_BASE}/system/custom-app-name`,
      {
        method: "GET",
        cache: "no-cache",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.log(e);
        return { customAppName: "", error: e.message };
      });

    if (!customAppName || !!error) {
      window.localStorage.removeItem(this.cacheKeys.customAppName);
      return { appName: "", error: null };
    }

    window.localStorage.setItem(
      this.cacheKeys.customAppName,
      JSON.stringify({ appName: customAppName, lastFetched: Date.now() })
    );
    return { appName: customAppName, error: null };
  },
  fetchLogo: async function () {
    const url = new URL(`${fullApiUrl()}/system/logo`);
    url.searchParams.append(
      "theme",
      localStorage.getItem("theme") || "default"
    );

    return await fetch(url, {
      method: "GET",
      cache: "no-cache",
    })
      .then(async (res) => {
        if (res.ok && res.status !== 204) {
          const isCustomLogo = res.headers.get("X-Is-Custom-Logo") === "true";
          const blob = await res.blob();
          const logoURL = URL.createObjectURL(blob);
          return { isCustomLogo, logoURL };
        }
        throw new Error("Failed to fetch logo!");
      })
      .catch((e) => {
        console.log(e);
        return { isCustomLogo: false, logoURL: null };
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
        // console.log(e);
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
  customModels: async function (
    provider,
    apiKey = null,
    basePath = null,
    timeout = null
  ) {
    const controller = new AbortController();
    if (!!timeout) {
      setTimeout(() => {
        controller.abort("Request timed out.");
      }, timeout);
    }

    return fetch(`${API_BASE}/system/custom-models`, {
      method: "POST",
      headers: baseHeaders(),
      signal: controller.signal,
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
  exportChats: async (type = "csv", chatType = "workspace") => {
    const url = new URL(`${fullApiUrl()}/system/export-chats`);
    url.searchParams.append("type", encodeURIComponent(type));
    url.searchParams.append("chatType", encodeURIComponent(chatType));
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

  getSlashCommandPresets: async function () {
    return await fetch(`${API_BASE}/system/slash-command-presets`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch slash command presets.");
        return res.json();
      })
      .then((res) => res.presets)
      .catch((e) => {
        console.error(e);
        return [];
      });
  },

  createSlashCommandPreset: async function (presetData) {
    return await fetch(`${API_BASE}/system/slash-command-presets`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(presetData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not create slash command preset.");
        return res.json();
      })
      .then((res) => {
        return { preset: res.preset, error: null };
      })
      .catch((e) => {
        console.error(e);
        return { preset: null, error: e.message };
      });
  },

  updateSlashCommandPreset: async function (presetId, presetData) {
    return await fetch(`${API_BASE}/system/slash-command-presets/${presetId}`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(presetData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not update slash command preset.");
        return res.json();
      })
      .then((res) => {
        return { preset: res.preset, error: null };
      })
      .catch((e) => {
        return { preset: null, error: "Failed to update this command." };
      });
  },

  deleteSlashCommandPreset: async function (presetId) {
    return await fetch(`${API_BASE}/system/slash-command-presets/${presetId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not delete slash command preset.");
        return true;
      })
      .catch((e) => {
        console.error(e);
        return false;
      });
  },

  /**
   * Fetches the can view chat history state from local storage or the system settings.
   * Notice: This is an instance setting that cannot be changed via the UI and it is cached
   * in local storage for 24 hours.
   * @returns {Promise<{viewable: boolean, error: string | null}>}
   */
  fetchCanViewChatHistory: async function () {
    const cache = window.localStorage.getItem(
      this.cacheKeys.canViewChatHistory
    );
    const { viewable, lastFetched } = cache
      ? safeJsonParse(cache, { viewable: false, lastFetched: 0 })
      : { viewable: false, lastFetched: 0 };

    // Since this is an instance setting that cannot be changed via the UI,
    // we can cache it in local storage for a day and if the admin changes it,
    // they should instruct the users to clear local storage.
    if (typeof viewable === "boolean" && Date.now() - lastFetched < 8.64e7)
      return { viewable, error: null };

    const res = await System.keys();
    const isViewable = res?.DisableViewChatHistory === false;

    window.localStorage.setItem(
      this.cacheKeys.canViewChatHistory,
      JSON.stringify({ viewable: isViewable, lastFetched: Date.now() })
    );
    return { viewable: isViewable, error: null };
  },

  /**
   * Validates a temporary auth token and logs in the user if the token is valid.
   * @param {string} publicToken - the token to validate against
   * @returns {Promise<{valid: boolean, user: import("@prisma/client").users | null, token: string | null, message: string | null}>}
   */
  simpleSSOLogin: async function (publicToken) {
    return fetch(`${API_BASE}/request-token/sso/simple?token=${publicToken}`, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          if (!text.startsWith("{")) throw new Error(text);
          return JSON.parse(text);
        }
        return await res.json();
      })
      .catch((e) => {
        console.error(e);
        return { valid: false, user: null, token: null, message: e.message };
      });
  },

  experimentalFeatures: {
    liveSync: LiveDocumentSync,
    agentPlugins: AgentPlugins,
  },
};

export default System;
