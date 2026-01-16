import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const WorkspaceTemplate = {
  create: async function ({ name, description, workspaceSlug }) {
    const { template, message } = await fetch(
      `${API_BASE}/workspace-templates`,
      {
        method: "POST",
        body: JSON.stringify({ name, description, workspaceSlug }),
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { template: null, message: e.message };
      });

    return { template, message };
  },

  all: async function () {
    const templates = await fetch(`${API_BASE}/workspace-templates`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.templates || [])
      .catch(() => []);

    return templates;
  },

  delete: async function (id) {
    const result = await fetch(`${API_BASE}/workspace-templates/${id}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch(() => false);

    return result;
  },

  update: async function (id, { name, description, config }) {
    const { template, message } = await fetch(
      `${API_BASE}/workspace-templates/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ name, description, config }),
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { template: null, message: e.message };
      });

    return { template, message };
  },
};

export default WorkspaceTemplate;
