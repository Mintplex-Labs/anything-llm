import { API_BASE } from "../utils/constants";
import { baseHeaders } from "../utils/request";

const Admin = {
  // User Mangement
  users: async () => {
    return await fetch(`${API_BASE}/admin/users`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.users || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newUser: async (data) => {
    return await fetch(`${API_BASE}/admin/users/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { user: null, error: e.message };
      });
  },
  updateUser: async (userId, data) => {
    return await fetch(`${API_BASE}/admin/user/${userId}`, {
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
  deleteUser: async (userId) => {
    return await fetch(`${API_BASE}/admin/user/${userId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Invitations
  invites: async () => {
    return await fetch(`${API_BASE}/admin/invites`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.invites || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newInvite: async () => {
    return await fetch(`${API_BASE}/admin/invite/new`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { invite: null, error: e.message };
      });
  },
  disableInvite: async (inviteId) => {
    return await fetch(`${API_BASE}/admin/invite/${inviteId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default Admin;
