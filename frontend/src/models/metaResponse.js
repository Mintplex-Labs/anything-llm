import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const MetaResponse = {
  toggle: async function (slug) {
    const result = await fetch(
      `${API_BASE}/workspace/${slug}/metaResponse/toggle`,
      {
        method: "PATCH",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.ok)
      .catch(() => false);
    return result;
  },
  update: async function (slug, data = {}) {
    const { workspace, message } = await fetch(
      `${API_BASE}/workspace/${slug}/update`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        return { workspace: null, message: e.message };
      });

    return { workspace, message };
  },
  getMetaResponseSettings: async function (slug) {
    const settings = await fetch(
      `${API_BASE}/workspace/${slug}/metaResponse/settings`,
      {
        method: "GET",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch(() => ({}));
    return settings;
  },
  updateMetaResponseSettings: async function (slug, data) {
    const settings = await fetch(
      `${API_BASE}/workspace/${slug}/metaResponse/settings`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch(() => ({}));
    return settings;
  },
};

export default MetaResponse;
