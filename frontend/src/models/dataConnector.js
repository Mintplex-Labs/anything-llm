import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import showToast from "@/utils/toast";

const DataConnector = {
  github: {
    branches: async ({ repo, accessToken }) => {
      return await fetch(`${API_BASE}/ext/github/branches`, {
        method: "POST",
        headers: baseHeaders(),
        cache: "force-cache",
        body: JSON.stringify({ repo, accessToken }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return res.data;
        })
        .then((data) => {
          return { branches: data?.branches || [], error: null };
        })
        .catch((e) => {
          console.error(e);
          showToast(e.message, "error");
          return { branches: [], error: e.message };
        });
    },
    collect: async function ({ repo, accessToken, branch, ignorePaths = [] }) {
      return await fetch(`${API_BASE}/ext/github/repo`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ repo, accessToken, branch, ignorePaths }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },
  gitlab: {
    branches: async ({ repo, accessToken }) => {
      return await fetch(`${API_BASE}/ext/gitlab/branches`, {
        method: "POST",
        headers: baseHeaders(),
        cache: "force-cache",
        body: JSON.stringify({ repo, accessToken }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return res.data;
        })
        .then((data) => {
          return { branches: data?.branches || [], error: null };
        })
        .catch((e) => {
          console.error(e);
          showToast(e.message, "error");
          return { branches: [], error: e.message };
        });
    },
    collect: async function ({
      repo,
      accessToken,
      branch,
      ignorePaths = [],
      fetchIssues = false,
      fetchWikis = false,
    }) {
      return await fetch(`${API_BASE}/ext/gitlab/repo`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({
          repo,
          accessToken,
          branch,
          ignorePaths,
          fetchIssues,
          fetchWikis,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },
  youtube: {
    transcribe: async ({ url }) => {
      return await fetch(`${API_BASE}/ext/youtube/transcript`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ url }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },
  websiteDepth: {
    scrape: async ({ url, depth, maxLinks }) => {
      return await fetch(`${API_BASE}/ext/website-depth`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ url, depth, maxLinks }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },

  confluence: {
    collect: async function ({
      baseUrl,
      spaceKey,
      username,
      accessToken,
      cloud,
      personalAccessToken,
    }) {
      return await fetch(`${API_BASE}/ext/confluence`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({
          baseUrl,
          spaceKey,
          username,
          accessToken,
          cloud,
          personalAccessToken,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },

  drupalwiki: {
    collect: async function ({ baseUrl, spaceIds, accessToken }) {
      return await fetch(`${API_BASE}/ext/drupalwiki`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({
          baseUrl,
          spaceIds,
          accessToken,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },
  obsidian: {
    collect: async function ({ files }) {
      return await fetch(`${API_BASE}/ext/obsidian/vault`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({
          files,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },
  webdav: {
    collect: async function ({ url, username, password, path, recursive = true, fileTypes = [] }) {
      return await fetch(`${API_BASE}/ext/webdav`, {
        method: "POST",
        headers: {
          ...baseHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          username,
          password,
          path,
          recursive,
          fileTypes,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
    // Save WebDAV settings
    saveSettings: async function (settings) {
      console.log("Sending WebDAV settings with headers:", baseHeaders());
      console.log("Settings data:", settings);
      return await fetch(`${API_BASE}/ext/webdav/settings`, {
        method: "POST",
        headers: {
          ...baseHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason || "Failed to save settings");
          return { success: true, error: null };
        })
        .catch((e) => {
          console.error("WebDAV save settings error:", e);
          return { success: false, error: e.message };
        });
    },
    // Load WebDAV settings
    loadSettings: async function () {
      return await fetch(`${API_BASE}/ext/webdav/settings`, {
        method: "GET",
        headers: {
          ...baseHeaders(),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason || "Failed to load settings");
          return { settings: res.settings, error: null };
        })
        .catch((e) => {
          console.error("WebDAV load settings error:", e);
          return { settings: null, error: e.message };
        });
    },
    // Test WebDAV connection
    testConnection: async function ({ url, username, password }) {
      console.log("Sending WebDAV test with headers:", baseHeaders());
      console.log("Test data:", { url, username, password: password ? "***" : "(empty)" });
      return await fetch(`${API_BASE}/ext/webdav/test`, {
        method: "POST",
        headers: {
          ...baseHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, username, password }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.message || res.reason || "Connection failed");
          return { success: true, folders: res.folders || [], error: null };
        })
        .catch((e) => {
          console.error("WebDAV test connection error:", e);
          return { success: false, folders: [], error: e.message };
        });
    },
  },
};

export default DataConnector;
