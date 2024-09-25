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
    collect: async function ({ repo, accessToken, branch, ignorePaths = [] }) {
      return await fetch(`${API_BASE}/ext/gitlab/repo`, {
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
    collect: async function ({ baseUrl, spaceKey, username, accessToken }) {
      return await fetch(`${API_BASE}/ext/confluence`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({
          baseUrl,
          spaceKey,
          username,
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
};

export default DataConnector;
