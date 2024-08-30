import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const AgentPlugins = {
  toggleFeature: async function (hubId, active = false) {
    return await fetch(
      `${API_BASE}/experimental/agent-plugins/${hubId}/toggle`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ active }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Could not update agent plugin status.");
        return true;
      })
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
  updatePluginConfig: async function (hubId, updates = {}) {
    return await fetch(
      `${API_BASE}/experimental/agent-plugins/${hubId}/config`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ updates }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Could not update agent plugin config.");
        return true;
      })
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
};

export default AgentPlugins;
