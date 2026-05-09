import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const ScheduledJobs = {
  list: async function () {
    return await fetch(`${API_BASE}/scheduled-jobs`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch(() => ({ jobs: [] }));
  },

  create: async function (data) {
    return await fetch(`${API_BASE}/scheduled-jobs/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch(() => ({ job: null, error: "Failed to create scheduled job" }));
  },

  get: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch(() => ({ job: null }));
  },

  update: async function (id, data) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}`, {
      method: "PUT",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => ({
        job: null,
        error: e.message,
      }));
  },

  delete: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch(() => ({ success: false }));
  },

  toggle: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}/toggle`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch(() => ({ job: null }));
  },

  trigger: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}/trigger`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message }));
  },

  runs: async function (id) {
    return await fetch(`${API_BASE}/scheduled-jobs/${id}/runs`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch(() => ({ runs: [] }));
  },

  getRun: async function (runId) {
    return await fetch(`${API_BASE}/scheduled-jobs/runs/${runId}`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch(() => ({ run: null, job: null }));
  },

  markRunRead: async function (runId) {
    return await fetch(`${API_BASE}/scheduled-jobs/runs/${runId}/read`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch(() => ({ success: false }));
  },

  continueInThread: async function (runId) {
    return await fetch(`${API_BASE}/scheduled-jobs/runs/${runId}/continue`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({
        workspaceSlug: null,
        threadSlug: null,
        error: e.message,
      }));
  },

  availableTools: async function () {
    return await fetch(`${API_BASE}/scheduled-jobs/available-tools`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch(() => ({ tools: [] }));
  },

  killRun: async function (runId) {
    return await fetch(`${API_BASE}/scheduled-jobs/runs/${runId}/kill`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message }));
  },
};

export default ScheduledJobs;
