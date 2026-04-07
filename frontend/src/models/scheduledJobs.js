import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const ScheduledJobs = {
  list: async function () {
    return await fetch(`${API_BASE}/scheduled-jobs`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { jobs: [] };
      });
  },

  create: async function (data) {
    return await fetch(`${API_BASE}/scheduled-jobs/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { job: null, error: e.message };
      });
  },

  get: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { job: null };
      });
  },

  update: async function (id, data) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}`, {
      method: "PUT",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { job: null, error: e.message };
      });
  },

  delete: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false };
      });
  },

  toggle: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}/toggle`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { job: null };
      });
  },

  trigger: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}/trigger`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  runs: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}/runs`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { runs: [] };
      });
  },

  getRun: async function (runId) {
    return await fetch(`${API_BASE}/scheduled-jobs/runs/${runId}`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { run: null, job: null };
      });
  },

  markRunRead: async function (runId) {
    return await fetch(`${API_BASE}/scheduled-jobs/runs/${runId}/read`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false };
      });
  },

  continueInThread: async function (runId) {
    return await fetch(`${API_BASE}/scheduled-jobs/runs/${runId}/continue`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { workspaceSlug: null, threadSlug: null, error: e.message };
      });
  },

  availableTools: async function () {
    return await fetch(`${API_BASE}/scheduled-jobs/available-tools`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { tools: [] };
      });
  },
};

export default ScheduledJobs;
