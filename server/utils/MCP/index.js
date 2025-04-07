const MCPHypervisor = require("./hypervisor");

class MCPCompatibilityLayer extends MCPHypervisor {
  static _instance;

  constructor() {
    super();
    if (MCPCompatibilityLayer._instance) return MCPCompatibilityLayer._instance;
    MCPCompatibilityLayer._instance = this;
  }

  /**
   * Get all of the active MCP servers as plugins we can load into agents.
   * This will also boot all MCP servers if they have not been started yet.
   * @returns {Promise<string[]>} Array of flow names in @@mcp_{name} format
   */
  async activeMCPServers() {
    await this.bootMCPServers();
    return Object.keys(this.mcps).flatMap((name) => `@@mcp_${name}`);
  }

  /**
   * Convert an MCP server name to an AnythingLLM Agent plugin
   * @param {string} name - The base name of the MCP server to convert - not the tool name. eg: `docker-mcp` not `docker-mcp:list-containers`
   * @param {Object} aibitat - The aibitat object to pass to the plugin
   * @returns {Promise<{name: string, description: string, plugin: Function}[]|null>} Array of plugin configurations or null if not found
   */
  async convertServerToolsToPlugins(name, _aibitat = null) {
    const mcp = this.mcps[name];
    if (!mcp) return null;

    const tools = (await mcp.listTools()).tools;
    if (!tools.length) return null;

    const plugins = [];
    for (const tool of tools) {
      plugins.push({
        name: `${name}-${tool.name}`,
        description: tool.description,
        plugin: function () {
          return {
            name: `${name}-${tool.name}`,
            setup: (aibitat) => {
              aibitat.function({
                super: aibitat,
                name: `${name}-${tool.name}`,
                controller: new AbortController(),
                description: tool.description,
                examples: [],
                parameters: {
                  $schema: "http://json-schema.org/draft-07/schema#",
                  ...tool.inputSchema,
                },
                handler: async function (args = {}) {
                  try {
                    aibitat.handlerProps.log(
                      `Executing MCP server: ${name}:${tool.name} with args:`,
                      args
                    );
                    aibitat.introspect(
                      `Executing MCP server: ${name} with ${JSON.stringify(args, null, 2)}`
                    );
                    const result = await mcp.callTool({
                      name: tool.name,
                      arguments: args,
                    });
                    aibitat.handlerProps.log(
                      `MCP server: ${name}:${tool.name} completed successfully`,
                      result
                    );
                    aibitat.introspect(
                      `MCP server: ${name}:${tool.name} completed successfully`
                    );
                    return typeof result === "object"
                      ? JSON.stringify(result)
                      : String(result);
                  } catch (error) {
                    aibitat.handlerProps.log(
                      `MCP server: ${name}:${tool.name} failed with error:`,
                      error
                    );
                    aibitat.introspect(
                      `MCP server: ${name}:${tool.name} failed with error:`,
                      error
                    );
                    return `The tool ${name}:${tool.name} failed with error: ${error?.message || "An unknown error occurred"}`;
                  }
                },
              });
            },
          };
        },
        toolName: `${name}:${tool.name}`,
      });
    }

    return plugins;
  }

  /**
   * Returns the MCP servers that were loaded or attempted to be loaded
   * so that we can display them in the frontend for review or error logging.
   * @returns {Promise<{
   *   name: string,
   *   running: boolean,
   *   tools: {name: string, description: string, inputSchema: Object}[],
   *   process: {pid: number, cmd: string}|null,
   *   error: string|null
   * }[]>} - The active MCP servers
   */
  async servers() {
    await this.bootMCPServers();
    const servers = [];
    for (const [name, result] of Object.entries(this.mcpLoadingResults)) {
      const config = this.mcpServerConfigs.find((s) => s.name === name);

      if (result.status === "failed") {
        servers.push({
          name,
          config: config?.server || null,
          running: false,
          tools: [],
          error: result.message,
          process: null,
        });
        continue;
      }

      const mcp = this.mcps[name];
      if (!mcp) {
        delete this.mcpLoadingResults[name];
        delete this.mcps[name];
        continue;
      }

      const online = !!(await mcp.ping());
      const tools = online ? (await mcp.listTools()).tools : [];
      servers.push({
        name,
        config: config?.server || null,
        running: online,
        tools,
        error: null,
        process: {
          pid: mcp.transport._process.pid,
        },
      });
    }
    return servers;
  }

  /**
   * Toggle the MCP server (start or stop)
   * @param {string} name - The name of the MCP server to toggle
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  async toggleServerStatus(name) {
    const server = this.mcpServerConfigs.find((s) => s.name === name);
    if (!server)
      return {
        success: false,
        error: `MCP server ${name} not found in config file.`,
      };
    const mcp = this.mcps[name];
    const online = !!mcp ? !!(await mcp.ping()) : false; // If the server is not in the mcps object, it is not running

    if (online) {
      const killed = this.pruneMCPServer(name);
      return {
        success: killed,
        error: killed ? null : `Failed to kill MCP server: ${name}`,
      };
    } else {
      const startupResult = await this.startMCPServer(name);
      return { success: startupResult.success, error: startupResult.error };
    }
  }

  /**
   * Delete the MCP server - will also remove it from the config file
   * @param {string} name - The name of the MCP server to delete
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  async deleteServer(name) {
    const server = this.mcpServerConfigs.find((s) => s.name === name);
    if (!server)
      return {
        success: false,
        error: `MCP server ${name} not found in config file.`,
      };

    const mcp = this.mcps[name];
    const online = !!mcp ? !!(await mcp.ping()) : false; // If the server is not in the mcps object, it is not running
    if (online) this.pruneMCPServer(name);
    this.removeMCPServerFromConfig(name);

    delete this.mcps[name];
    delete this.mcpLoadingResults[name];
    this.log(`MCP server was killed and removed from config file: ${name}`);
    return { success: true, error: null };
  }
}
module.exports = MCPCompatibilityLayer;
