import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Admin = {
  // User Management
  users: async () => {
    return await fetch(`${API_BASE}/admin/users`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.users || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newUser: async (data) => {
    const { user, message } = await fetch(`${API_BASE}/admin/users/new`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        return { user: null, message: e.message };
      });

    // Add the new user to all workspaces or hubs
    const workspaces = await Workspace.all();
    workspaces.forEach((workspace) => {
      await Workspace.addUser(workspace.slug, user.id);
    });

    return { user, message };
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
      .then((res) => res.ok)
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  // ... (rest of the code remains the same)
};

// Add a new method to the Workspace object
Workspace.prototype.addUser = async (slug, userId) => {
  const result = await fetch(`${API_BASE}/workspace/${slug}/add-user`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({ userId }),
  });

  if (!result.ok) {
    throw new Error("Failed to add user to workspace.");
  }

  return true;
};