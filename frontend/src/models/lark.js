import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const FAILURE = {
  config: { config: null, error: "Unable to retrieve Lark configuration." },
  status: {
    active: false,
    connected: false,
    connection_state: "disconnected",
    last_error: null,
    error: "Unable to retrieve Lark status.",
  },
  users: { users: [], error: "Unable to retrieve Lark users." },
  mutation: { success: false, error: "Unable to complete Lark request." },
};

async function request(path, { method, body } = {}, fallback) {
  try {
    return await fetch(`${API_BASE}/lark/${path}`, {
      ...(method ? { method } : {}),
      headers: baseHeaders(),
      ...(body ? { body: JSON.stringify(body) } : {}),
    }).then((res) => res.json());
  } catch {
    return fallback;
  }
}

const Lark = {
  getConfig: async function () {
    return await request("config", {}, FAILURE.config);
  },

  connect: async function (config) {
    return await request(
      "connect",
      { method: "POST", body: config },
      FAILURE.mutation
    );
  },

  disconnect: async function () {
    return await request("disconnect", { method: "POST" }, FAILURE.mutation);
  },

  status: async function () {
    return await request("status", {}, FAILURE.status);
  },

  getPendingUsers: async function () {
    return await request("pending-users", {}, FAILURE.users);
  },

  getApprovedUsers: async function () {
    return await request("approved-users", {}, FAILURE.users);
  },

  approveUser: async function (openId) {
    return await request(
      "approve-user",
      { method: "POST", body: { open_id: openId } },
      FAILURE.mutation
    );
  },

  denyUser: async function (openId) {
    return await request(
      "deny-user",
      { method: "POST", body: { open_id: openId } },
      FAILURE.mutation
    );
  },

  revokeUser: async function (openId) {
    return await request(
      "revoke-user",
      { method: "POST", body: { open_id: openId } },
      FAILURE.mutation
    );
  },

  updateConfig: async function (updates) {
    const safeUpdates = {};
    if (Object.hasOwn(updates, "default_workspace"))
      safeUpdates.default_workspace = updates.default_workspace;
    if (Object.hasOwn(updates, "attachment_size_limit"))
      safeUpdates.attachment_size_limit = updates.attachment_size_limit;

    return await request(
      "update-config",
      { method: "POST", body: safeUpdates },
      FAILURE.mutation
    );
  },
};

export default Lark;
