import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const MCPServers = {
  /**
   * Forces a reload of the MCP Hypervisor and its servers
   * @returns {Promise<{success: boolean, error: string | null, servers: Array<{name: string, running: boolean, tools: Array<{name: string, description: string, inputSchema: Object}>, error: string | null, process: {pid: number, cmd: string} | null}>}>}
   */
  forceReload: async () => {
    return await fetch(`${API_BASE}/mcp-servers/force-reload`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({
        servers: [],
        success: false,
        error: e.message,
      }));
  },

  /**
   * List all available MCP servers in the system
   * @returns {Promise<{success: boolean, error: string | null, servers: Array<{name: string, running: boolean, tools: Array<{name: string, description: string, inputSchema: Object}>, error: string | null, process: {pid: number, cmd: string} | null}>}>}
   */
  listServers: async () => {
    return await fetch(`${API_BASE}/mcp-servers/list`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
        servers: [],
      }));
  },

  /**
   * Toggle the MCP server (start or stop)
   * @param {string} name - The name of the MCP server to toggle
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  toggleServer: async (name) => {
    return await fetch(`${API_BASE}/mcp-servers/toggle`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },

  /**
   * Delete the MCP server - will also remove it from the config file
   * @param {string} name - The name of the MCP server to delete
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  deleteServer: async (name) => {
    return await fetch(`${API_BASE}/mcp-servers/delete`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
      }));
  },

  /**
   * Toggle a tool's suppression status for an MCP server
   * @param {string} serverName - The name of the MCP server
   * @param {string} toolName - The name of the tool to toggle
   * @param {boolean} enabled - Whether the tool should be enabled (true) or suppressed (false)
   * @returns {Promise<{success: boolean, error: string | null, suppressedTools: string[]}>}
   */
  toggleTool: async (serverName, toolName, enabled) => {
    return await fetch(`${API_BASE}/mcp-servers/toggle-tool`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ serverName, toolName, enabled }),
    })
      .then((res) => res.json())
      .catch((e) => ({
        success: false,
        error: e.message,
        suppressedTools: [],
      }));
  },
};

export default MCPServers;
