const MCPHypervisor = require("./hypervisor");
const { resolveMCPIdentity, withMCPIdentity } = require("./identity");

// JSON-RPC "Method not found". A server that does not implement `ping`
// answers with this code, which still proves it is alive.
const JSONRPC_METHOD_NOT_FOUND = -32601;

/**
 * Check whether an MCP server client is reachable. A server that answers
 * `ping` with JSON-RPC -32601 ("Method not found") is alive but does not
 * implement `ping` - treat it as reachable so its tools can still be listed
 * and used. Any other ping failure (transport errors, timeouts) is rethrown
 * so the server is still reported as down.
 * @param {import("@modelcontextprotocol/sdk/client/index.js").Client} mcp - The connected MCP client
 * @returns {Promise<boolean>} true when the server answered the ping request
 */
async function isMCPServerReachable(mcp) {
  try {
    return !!(await mcp.ping());
  } catch (error) {
    if (error?.code === JSONRPC_METHOD_NOT_FOUND) return true;
    throw error;
  }
}

// The SDK returns one page per call. Only expose the list once every page
// has loaded, so a later-page error cannot silently hide tools.
async function listAllMCPTools(mcp, _meta = undefined) {
  const tools = [];
  const seenCursors = new Set();
  let cursor;
  do {
    const params = {
      ...(cursor !== undefined && { cursor }),
      ...(_meta && { _meta }),
    };
    const page = await mcp.listTools(
      Object.keys(params).length ? params : undefined
    );
    tools.push(...page.tools);
    cursor = page.nextCursor;
    if (cursor !== undefined) {
      if (seenCursors.has(cursor))
        throw new Error("MCP tools/list returned a repeated pagination cursor");
      seenCursors.add(cursor);
    }
  } while (cursor !== undefined);
  return tools;
}

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
  async convertServerToolsToPlugins(name, aibitat = null) {
    const mcp = this.mcps[name];
    if (!mcp) return null;

    const identity = await resolveMCPIdentity(
      this.getForwardIdentityFields(name),
      aibitat
    );

    let tools;
    try {
      tools = await withMCPIdentity(identity, () =>
        listAllMCPTools(mcp, identity?._meta)
      );
    } catch (error) {
      this.log(`Failed to list tools for MCP server ${name}:`, error);
      return null;
    }
    if (!tools || !tools.length) return null;

    const suppressedTools = this.getSuppressedTools(name);
    const totalTools = tools.length;
    tools = tools.filter((tool) => !suppressedTools.includes(tool.name));
    const suppressedCount = totalTools - tools.length;

    if (suppressedCount > 0) {
      this.log(
        `MCP server ${name}: ${suppressedCount} tool(s) suppressed, ${tools.length} tool(s) enabled`
      );
    }

    if (!tools.length) {
      this.log(`MCP server ${name}: All tools are suppressed, skipping`);
      return null;
    }

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
                    const currentMcp = mcpLayer.mcps[name];
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
                    const result = await withMCPIdentity(identity, () =>
                      currentMcp.callTool(
                        {
                          name: tool.name,
                          arguments: args,
                          ...(identity && { _meta: identity._meta }),
                        },
                        undefined,
                        { timeout: mcpLayer.getToolCallTimeout(name) }
                      )
                    );
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

      // ping() and listTools() can throw - e.g. when a tool's outputSchema
      // contains a $ref the MCP SDK cannot resolve. If we let that bubble up
      // it crashes the entire list, so a single bad server would hide every
      // other server. Keep the server visible with its error instead.
      try {
        const online = await isMCPServerReachable(mcp);
        const tools = (online ? await listAllMCPTools(mcp) : []).filter(
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
      } catch (error) {
        this.log(`Failed to list tools for MCP server ${name}:`, error);
        servers.push({
          name,
          config: config?.server || null,
          running: false,
          tools: [],
          error: error?.message || "Failed to load tools for this MCP server.",
          process: null,
        });
      }
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
    const online = mcp ? await isMCPServerReachable(mcp) : false; // If the server is not in the mcps object, it is not running

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

    // Removing local configuration must not depend on the server being reachable.
    this.pruneMCPServer(name);
    this.removeMCPServerFromConfig(name);

    delete this.mcps[name];
    delete this.mcpLoadingResults[name];
    this.log(`MCP server was killed and removed from config file: ${name}`);
    return { success: true, error: null };
  }

  /**
   * Create or replace an MCP server definition in the config file, then
   * (re)start it. The definition is kept even if the server fails to start,
   * so it can be fixed with another update - the start outcome is reported
   * separately via `running` and `startError`.
   * @param {string} name - The name of the MCP server
   * @param {Object} config - The full server definition (replaces any existing one)
   * @param {{create: boolean}} options - create: true to add (name must be new), false to update (name must exist)
   * @returns {Promise<{success: boolean, error: string | null, running: boolean, startError: string | null}>}
   */
  async saveServer(name, config, { create }) {
    const exists = this.mcpServerConfigs.some((s) => s.name === name);
    const fail = (error) => ({
      success: false,
      error,
      running: false,
      startError: null,
    });
    if (create && exists)
      return fail(`MCP server ${name} already exists in config file.`);
    if (!create && !exists)
      return fail(`MCP server ${name} not found in config file.`);

    const written = this.writeMCPServerToConfig(name, config);
    if (!written.success) return fail(written.error);

    // Stop the old instance so the new definition takes effect.
    this.pruneMCPServer(name);
    delete this.mcpLoadingResults[name];

    if (config.anythingllm?.autoStart === false) {
      this.mcpLoadingResults[name] = {
        status: "failed",
        message: `MCP server ${name} has anythingllm.autoStart property set to false, boot skipped!`,
      };
      return { success: true, error: null, running: false, startError: null };
    }

    const started = await this.startMCPServer(name);
    return {
      success: true,
      error: null,
      running: started.success,
      startError: started.success ? null : started.error,
    };
  }

  /**
   * Return the useful MCP payload as a string for the agent.
   * Text blocks are returned as-is so JSON inside them is not escaped again.
   * Error results keep the full envelope so the agent sees `isError: true`.
   * `structuredContent` is only used when the server sent no content blocks,
   * since the spec treats text content as the model-facing representation.
   * Images, mixed blocks, and anything else still stringify the whole result,
   * with circular references and bigints made safe.
   * @param {Object} result - The MCP CallToolResult
   * @returns {string} The result as a string
   */
  static returnMCPResult(result) {
    if (typeof result !== "object" || result === null) return String(result);
    if (result.isError) return MCPCompatibilityLayer.#serialize(result);

    const blocks = Array.isArray(result.content) ? result.content : [];
    if (
      blocks.length > 0 &&
      blocks.every(
        (block) => block?.type === "text" && typeof block.text === "string"
      )
    ) {
      return blocks.map((block) => block.text).join("\n");
    }

    if (
      blocks.length === 0 &&
      result.structuredContent &&
      typeof result.structuredContent === "object"
    ) {
      return MCPCompatibilityLayer.#serialize(result.structuredContent);
    }

    return MCPCompatibilityLayer.#serialize(result);
  }

  /**
   * JSON.stringify that survives bigints and circular references.
   * @param {unknown} value
   * @returns {string}
   */
  static #serialize(value) {
    const seen = new WeakSet();
    try {
      return JSON.stringify(value, (_key, item) => {
        if (typeof item === "bigint") return item.toString();
        if (typeof item === "object" && item !== null) {
          if (seen.has(item)) return "[Circular]";
          seen.add(item);
        }
        return item;
      });
    } catch (e) {
      return `[Unserializable: ${e.message}]`;
    }
  }

  /**
   * Toggle tool suppression for an MCP server.
   * The server must be running so the tool name can be checked against the
   * tools it reports. A name already in suppressedTools can always be
   * re-enabled, so entries for tools the server no longer has can be cleared.
   * To suppress tools before a server's first start, set
   * `anythingllm.suppressedTools` in its config instead.
   * @param {string} serverName - The name of the MCP server
   * @param {string} toolName - The name of the tool to toggle
   * @param {boolean} enabled - Whether the tool should be enabled (true) or suppressed (false)
   * @returns {Promise<{success: boolean, error: string | null, suppressedTools: string[]}>}
   */
  async toggleToolSuppression(serverName, toolName, enabled) {
    const fail = (error) => ({ success: false, error, suppressedTools: [] });
    if (!this.mcpServerConfigs.some((s) => s.name === serverName))
      return fail(`MCP server ${serverName} not found in config file.`);

    const clearingStaleEntry =
      enabled === true &&
      this.getSuppressedTools(serverName).includes(toolName);
    if (!clearingStaleEntry) {
      const mcp = this.mcps[serverName];
      if (!mcp)
        return fail(
          `MCP server ${serverName} is not running - start it to toggle its tools.`
        );

      let tools;
      try {
        tools = await listAllMCPTools(mcp);
      } catch (error) {
        return fail(
          `Failed to list tools for MCP server ${serverName}: ${error.message}`
        );
      }
      if (!tools.some((tool) => tool.name === toolName))
        return fail(`Tool ${toolName} not found on MCP server ${serverName}.`);
    }

    return this.updateSuppressedTools(serverName, toolName, enabled);
  }
}
module.exports = MCPCompatibilityLayer;
