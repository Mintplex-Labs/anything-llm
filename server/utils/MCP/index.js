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

    let tools;
    try {
      const response = await mcp.listTools();
      tools = response.tools;
    } catch (error) {
      this.log(`Failed to list tools for MCP server ${name}:`, error);
      return null;
    }
    if (!tools || !tools.length) return null;

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
                isMCPTool: true,
                examples: [],
                parameters: {
                  $schema: "http://json-schema.org/draft-07/schema#",
                  ...tool.inputSchema,
                },
                handler: async function (args = {}) {
                  try {
                    const mcpLayer = new MCPCompatibilityLayer();

                    // Extract user ID for OAuth impersonation mode
                    const userId = aibitat?.handlerProps?.invocation?.user_id || null;

                    // Get MCP client - may be user-context-aware if OAuth impersonation enabled
                    const currentMcp = await mcpLayer.getClientWithUserContext(name, userId);
                    if (!currentMcp)
                      throw new Error(
                        `MCP server ${name} is not currently running`
                      );

                    aibitat.handlerProps.log(
                      `Executing MCP server: ${name}:${tool.name} with args:`,
                      args
                    );
                    aibitat.introspect(
                      `Executing MCP server: ${name} with ${JSON.stringify(args, null, 2)}`
                    );

                    // Call tool with 401 retry handling for OAuth mode
                    let result;
                    try {
                      result = await currentMcp.callTool({
                        name: tool.name,
                        arguments: args,
                      });
                    } catch (callError) {
                      // Handle 401 errors by refreshing token and retrying
                      if (
                        userId &&
                        process.env.MCP_AUTH_MODE === "impersonation" &&
                        mcpLayer.isUnauthorizedError(callError)
                      ) {
                        aibitat.handlerProps.log(
                          `MCP server: ${name}:${tool.name} got 401, attempting token refresh`
                        );
                        const refreshed = await mcpLayer.refreshOAuthToken(userId);
                        if (refreshed) {
                          // Retry with refreshed token
                          const retryMcp = await mcpLayer.getClientWithUserContext(name, userId, true);
                          result = await retryMcp.callTool({
                            name: tool.name,
                            arguments: args,
                          });
                        } else {
                          throw new Error("OAuth token refresh failed. User may need to re-authenticate.");
                        }
                      } else {
                        throw callError;
                      }
                    }

                    aibitat.handlerProps.log(
                      `MCP server: ${name}:${tool.name} completed successfully`,
                      result
                    );
                    aibitat.introspect(
                      `MCP server: ${name}:${tool.name} completed successfully`
                    );
                    return MCPCompatibilityLayer.returnMCPResult(result);
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
      const tools = (online ? (await mcp.listTools()).tools : []).filter(
        (tool) => !tool.name.startsWith("handle_mcp_connection_mcp_")
      );
      servers.push({
        name,
        config: config?.server || null,
        running: online,
        tools,
        error: null,
        process: {
          pid: mcp.transport?.process?.pid || null,
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

  /**
   * Get MCP client with user context for OAuth impersonation mode.
   * For HTTP/SSE MCP servers, creates a new client with the user's OAuth token.
   * For stdio servers, returns the shared client (no user context needed).
   * @param {string} name - The name of the MCP server
   * @param {number|null} userId - The user ID for OAuth token lookup
   * @param {boolean} forceRefresh - Force creating a new client (used after token refresh)
   * @returns {Promise<Client|null>} The MCP client or null if not found
   */
  async getClientWithUserContext(name, userId = null, forceRefresh = false) {
    // If OAuth impersonation is not enabled, return the shared client
    if (process.env.MCP_AUTH_MODE !== "impersonation" || !userId) {
      return this.mcps[name] || null;
    }

    const config = this.mcpServerConfigs.find((s) => s.name === name);
    if (!config) return null;

    // For stdio servers, use the shared client (no HTTP headers to inject)
    if (config.server.command && !config.server.url) {
      return this.mcps[name] || null;
    }

    // For HTTP/SSE servers, create a transport with user's OAuth token
    try {
      const userContextClient = await this.createHttpTransportWithUserContext(
        config.server,
        userId
      );
      return userContextClient;
    } catch (error) {
      this.log(`Failed to create user context client for ${name}:`, error);
      // Fall back to shared client
      return this.mcps[name] || null;
    }
  }

  /**
   * Create HTTP transport with user's OAuth access token
   * @param {Object} server - The server configuration
   * @param {number} userId - The user ID
   * @returns {Promise<Client>} New MCP client with user auth headers
   */
  async createHttpTransportWithUserContext(server, userId) {
    const { User } = require("../../models/user");
    const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
    const {
      SSEClientTransport,
    } = require("@modelcontextprotocol/sdk/client/sse.js");
    const {
      StreamableHTTPClientTransport,
    } = require("@modelcontextprotocol/sdk/client/streamableHttp.js");

    const user = await User._get({ id: userId });
    if (!user || !user.oauth_access_token) {
      throw new Error("User OAuth token not available");
    }

    const url = new URL(server.url);
    const headers = {
      ...server.headers,
      Authorization: `Bearer ${user.oauth_access_token}`,
    };

    let transport;
    switch (server.type) {
      case "streamable":
      case "http":
        transport = new StreamableHTTPClientTransport(url, {
          requestInit: { headers },
        });
        break;
      default:
        transport = new SSEClientTransport(url, {
          requestInit: { headers },
        });
    }

    const client = new Client({ name: `user-context-${userId}`, version: "1.0.0" });
    await client.connect(transport);
    return client;
  }

  /**
   * Check if an error indicates an unauthorized (401) response
   * @param {Error} error - The error to check
   * @returns {boolean} True if error is a 401 unauthorized error
   */
  isUnauthorizedError(error) {
    if (!error) return false;
    const errorStr = String(error.message || error).toLowerCase();
    return (
      errorStr.includes("401") ||
      errorStr.includes("unauthorized") ||
      errorStr.includes("authentication required") ||
      error.status === 401 ||
      error.statusCode === 401
    );
  }

  /**
   * Refresh OAuth token for a user using their refresh token
   * @param {number} userId - The user ID
   * @returns {Promise<boolean>} True if refresh was successful
   */
  async refreshOAuthToken(userId) {
    try {
      const { User } = require("../../models/user");
      const user = await User._get({ id: userId });

      if (!user || !user.oauth_refresh_token) {
        this.log(`Cannot refresh token for user ${userId}: no refresh token`);
        return false;
      }

      // Build refresh token params - client_secret is optional with PKCE
      const refreshParams = {
        grant_type: "refresh_token",
        client_id: process.env.OAUTH_CLIENT_ID,
        refresh_token: user.oauth_refresh_token,
      };
      if (process.env.OAUTH_CLIENT_SECRET) {
        refreshParams.client_secret = process.env.OAUTH_CLIENT_SECRET;
      }

      const tokenResponse = await fetch(process.env.OAUTH_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(refreshParams),
      });

      if (!tokenResponse.ok) {
        this.log(`Token refresh failed for user ${userId}:`, await tokenResponse.text());
        return false;
      }

      const tokens = await tokenResponse.json();
      const { access_token, refresh_token, expires_in } = tokens;

      const tokenExpiresAt = expires_in
        ? new Date(Date.now() + expires_in * 1000)
        : null;

      await User._update(userId, {
        oauth_access_token: access_token,
        oauth_refresh_token: refresh_token || user.oauth_refresh_token,
        oauth_token_expires_at: tokenExpiresAt,
      });

      this.log(`OAuth token refreshed for user ${userId}`);
      return true;
    } catch (error) {
      this.log(`OAuth token refresh error for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Return the result of an MCP server call as a string
   * This will handle circular references and bigints since an MCP server can return any type of data.
   * @param {Object} result - The result to return
   * @returns {string} The result as a string
   */
  static returnMCPResult(result) {
    if (typeof result !== "object" || result === null) return String(result);

    const seen = new WeakSet();
    try {
      return JSON.stringify(result, (key, value) => {
        if (typeof value === "bigint") return value.toString();
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";
          seen.add(value);
        }
        return value;
      });
    } catch (e) {
      return `[Unserializable: ${e.message}]`;
    }
  }
}
module.exports = MCPCompatibilityLayer;
