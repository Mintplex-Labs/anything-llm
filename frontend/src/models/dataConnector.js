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
  googledocs: {
    checkAuth: async () => {
      try {
        const response = await fetch(`${API_BASE}/ext/googledocs/auth/status`, {
          method: "GET",
          headers: baseHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to check authorization status');
        }
        return data;
      } catch (error) {
        console.error('Auth check failed:', error);
        return { authorized: false, error: error.message };
      }
    },
    getAuthUrl: async () => {
      try {
        const response = await fetch(`${API_BASE}/ext/googledocs/auth/url`, {
          method: "GET",
          headers: baseHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate authorization URL');
        }
        return { data: { url: data.url }, error: null };
      } catch (error) {
        console.error('Get auth URL failed:', error);
        return { data: null, error: error.message };
      }
    },
    listDocs: async () => {
      try {
        const response = await fetch(`${API_BASE}/ext/googledocs/list`, {
          method: "GET",
          headers: baseHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to list documents');
        }
        return { documents: data.documents || [], error: null };
      } catch (error) {
        console.error('List documents failed:', error);
        return { documents: [], error: error.message };
      }
    },
    collect: async ({ documentIds, workspaceId }) => {
      try {
        if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
          throw new Error('Document IDs array is required and must not be empty');
        }

        if (!workspaceId) {
          throw new Error('Workspace ID is required');
        }

        console.log('Collecting documents with IDs:', documentIds);
        console.log('For workspace:', workspaceId);
        
        const response = await fetch(`${API_BASE}/ext/googledocs/collect`, {
          method: "POST",
          headers: {
            ...baseHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            documentIds: documentIds,
            workspaceId: workspaceId 
          })
        });

        console.log('Raw response:', response);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to collect documents');
        }

        return { data, error: null };
      } catch (error) {
        console.error('Collect documents failed:', error);
        return { data: null, error: error.message };
      }
    },
  },
};

export default DataConnector;
