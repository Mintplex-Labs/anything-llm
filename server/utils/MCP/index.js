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
                    const result = await currentMcp.callTool({
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

                    // Check for image content in MCP result per MCP spec
                    // Images are sent directly to the frontend and excluded from LLM context to save tokens
                    const imageResult =
                      MCPCompatibilityLayer.extractImageContent(result);
                    if (imageResult) {
                      const payload = {
                        images: imageResult.images,
                        description: imageResult.textContent,
                      };
                      aibitat.socket.send("mcpImageContent", payload);
                      aibitat._replySpecialAttributes = {
                        saveAsType: "mcpImageContent",
                        storedResponse: (additionalText = "") =>
                          JSON.stringify({
                            ...payload,
                            caption: additionalText,
                          }),
                      };
                      return imageResult.llmText;
                    }

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
   * Extract image content items from an MCP tool result per MCP spec.
   * Handles: type "image" (inline base64), "resource_link" (remote URL), "resource" (embedded blob/URI).
   * @param {Object} result - The MCP tool result
   * @returns {{images: {src: string, mimeType: string}[], textContent: string, llmText: string}|null}
   */
  static extractImageContent(result) {
    if (!result?.content || !Array.isArray(result.content)) return null;

    const isImage = (mime) =>
      typeof mime === "string" && mime.startsWith("image/");
    const images = [];
    const textParts = [];

    for (const item of result.content) {
      if (item.type === "image" && item.data && item.mimeType) {
        images.push({
          src: `data:${item.mimeType};base64,${item.data}`,
          mimeType: item.mimeType,
        });
      } else if (
        item.type === "resource_link" &&
        item.uri &&
        isImage(item.mimeType)
      ) {
        images.push({ src: item.uri, mimeType: item.mimeType });
      } else if (
        item.type === "resource" &&
        item.resource &&
        isImage(item.resource.mimeType)
      ) {
        if (item.resource.blob) {
          images.push({
            src: `data:${item.resource.mimeType};base64,${item.resource.blob}`,
            mimeType: item.resource.mimeType,
          });
        } else if (item.resource.uri) {
          images.push({
            src: item.resource.uri,
            mimeType: item.resource.mimeType,
          });
        }
      } else if (item.type === "text" && item.text) {
        textParts.push(item.text);
      }
    }

    if (images.length === 0) return null;

    const textContent = textParts.join("\n");
    const llmText = [
      textContent,
      `[${images.length} image(s) returned by this tool and displayed to the user]`,
    ]
      .filter(Boolean)
      .join("\n");

    return { images, textContent, llmText };
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

  /**
   * Toggle tool suppression for an MCP server
   * @param {string} serverName - The name of the MCP server
   * @param {string} toolName - The name of the tool to toggle
   * @param {boolean} enabled - Whether the tool should be enabled (true) or suppressed (false)
   * @returns {Promise<{success: boolean, error: string | null, suppressedTools: string[]}>}
   */
  async toggleToolSuppression(serverName, toolName, enabled) {
    return this.updateSuppressedTools(serverName, toolName, enabled);
  }
}
module.exports = MCPCompatibilityLayer;
