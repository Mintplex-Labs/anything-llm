const { safeJsonParse } = require("../../http");
const path = require("path");
const fs = require("fs");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js");
const {
  SSEClientTransport,
} = require("@modelcontextprotocol/sdk/client/sse.js");
const {
  StreamableHTTPClientTransport,
} = require("@modelcontextprotocol/sdk/client/streamableHttp.js");

/**
 * @typedef {'stdio' | 'http' | 'sse'} MCPServerTypes
 */

/**
 * @class MCPHypervisor
 * @description A class that manages MCP servers found in the storage/plugins/anythingllm_mcp_servers.json file.
 * This class is responsible for booting, stopping, and reloading MCP servers - it is the user responsibility for the MCP server definitions
 * to me correct and also functioning tools depending on their deployment (docker vs local) as well as the security of said tools
 * since MCP is basically arbitrary code execution.
 *
 * @notice This class is a singleton.
 * @notice Each MCP tool has dependencies specific to it and this call WILL NOT check for them.
 * For example, if the tools requires `npx` then the context in which AnythingLLM mains process is running will need to access npx.
 * This is typically not common in our pre-built image so may not function. But this is the case anywhere MCP is used.
 *
 * AnythingLLM will take care of porting MCP servers to agent-callable functions via @agent directive.
 * @see MCPCompatibilityLayer.convertServerToolsToPlugins
 */
class MCPHypervisor {
  static _instance;
  /**
   * The path to the JSON file containing the MCP server definitions.
   * @type {string}
   */
  mcpServerJSONPath;

  /**
   * The MCP servers currently running.
   * @type { { [key: string]: Client & {transport: {_process: import('child_process').ChildProcess}, aibitatToolIds: string[]} } }
   */
  mcps = {};
  /**
   * The results of the MCP server loading process.
   * @type { { [key: string]: {status: 'success' | 'failed', message: string} } }
   */
  mcpLoadingResults = {};

  constructor() {
    if (MCPHypervisor._instance) return MCPHypervisor._instance;
    MCPHypervisor._instance = this;
    this.className = "MCPHypervisor";
    this.log("Initializing MCP Hypervisor - subsequent calls will boot faster");
    this.#setupConfigFile();
    return this;
  }

  /**
   * Setup the MCP server definitions file.
   * Will create the file/directory if it doesn't exist already in storage/plugins with blank options
   */
  #setupConfigFile() {
    this.mcpServerJSONPath =
      process.env.NODE_ENV === "development"
        ? path.resolve(
            __dirname,
            `../../../storage/plugins/anythingllm_mcp_servers.json`
          )
        : path.resolve(
            process.env.STORAGE_DIR ??
              path.resolve(__dirname, `../../../storage`),
            `plugins/anythingllm_mcp_servers.json`
          );

    if (!fs.existsSync(this.mcpServerJSONPath)) {
      fs.mkdirSync(path.dirname(this.mcpServerJSONPath), { recursive: true });
      fs.writeFileSync(
        this.mcpServerJSONPath,
        JSON.stringify({ mcpServers: {} }, null, 2),
        { encoding: "utf8" }
      );
    }

    this.log(`MCP Config File: ${this.mcpServerJSONPath}`);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  /**
   * Get the MCP servers from the JSON file.
   * @returns { { name: string, server: { command: string, args: string[], env: { [key: string]: string } } }[] } The MCP servers.
   */
  get mcpServerConfigs() {
    const servers = safeJsonParse(
      fs.readFileSync(this.mcpServerJSONPath, "utf8"),
      { mcpServers: {} }
    );
    return Object.entries(servers.mcpServers).map(([name, server]) => ({
      name,
      server,
    }));
  }

  /**
   * Remove the MCP server from the config file
   * @param {string} name - The name of the MCP server to remove
   * @returns {boolean} - True if the MCP server was removed, false otherwise
   */
  removeMCPServerFromConfig(name) {
    const servers = safeJsonParse(
      fs.readFileSync(this.mcpServerJSONPath, "utf8"),
      { mcpServers: {} }
    );
    if (!servers.mcpServers[name]) return false;

    delete servers.mcpServers[name];
    fs.writeFileSync(
      this.mcpServerJSONPath,
      JSON.stringify(servers, null, 2),
      "utf8"
    );
    this.log(`MCP server ${name} removed from config file`);
    return true;
  }

  /**
   * Reload the MCP servers - can be used to reload the MCP servers without restarting the server or app
   * and will also apply changes to the config file if any where made.
   */
  async reloadMCPServers() {
    this.pruneMCPServers();
    await this.bootMCPServers();
  }

  /**
   * Start a single MCP server by its server name - public method
   * @param {string} name - The name of the MCP server to start
   * @returns {Promise<{success: boolean, error: string | null}>}
   */
  async startMCPServer(name) {
    if (this.mcps[name])
      return { success: false, error: `MCP server ${name} already running` };
    const config = this.mcpServerConfigs.find((s) => s.name === name);
    if (!config)
      return {
        success: false,
        error: `MCP server ${name} not found in config file`,
      };

    try {
      await this.#startMCPServer(config);
      this.mcpLoadingResults[name] = {
        status: "success",
        message: `Successfully connected to MCP server: ${name}`,
      };

      return { success: true, message: `MCP server ${name} started` };
    } catch (e) {
      this.log(`Failed to start single MCP server: ${name}`, {
        error: e.message,
        code: e.code,
        syscall: e.syscall,
        path: e.path,
        stack: e.stack,
      });
      this.mcpLoadingResults[name] = {
        status: "failed",
        message: `Failed to start MCP server: ${name} [${e.code || "NO_CODE"}] ${e.message}`,
      };

      // Clean up failed connection
      if (this.mcps[name]) {
        this.mcps[name].close();
        delete this.mcps[name];
      }

      return { success: false, error: e.message };
    }
  }
  /**
   * Prune a single MCP server by its server name
   * @param {string} name - The name of the MCP server to prune
   * @returns {boolean} - True if the MCP server was pruned, false otherwise
   */
  pruneMCPServer(name) {
    if (!name || !this.mcps[name]) return true;

    this.log(`Pruning MCP server: ${name}`);
    const mcp = this.mcps[name];
    const childProcess = mcp.transport._process;
    if (childProcess) childProcess.kill(1);
    mcp.transport.close();

    delete this.mcps[name];
    this.mcpLoadingResults[name] = {
      status: "failed",
      message: `Server was stopped manually by the administrator.`,
    };
    return true;
  }

  /**
   * Prune the MCP servers - pkills and forgets all MCP servers
   * @returns {void}
   */
  pruneMCPServers() {
    this.log(`Pruning ${Object.keys(this.mcps).length} MCP servers...`);

    for (const name of Object.keys(this.mcps)) {
      if (!this.mcps[name]) continue;
      const mcp = this.mcps[name];
      const childProcess = mcp.transport._process;
      if (childProcess)
        this.log(`Killing MCP ${name} (PID: ${childProcess.pid})`, {
          killed: childProcess.kill(1),
        });

      mcp.transport.close();
      mcp.close();
    }
    this.mcps = {};
    this.mcpLoadingResults = {};
  }

  /**
   * Build the MCP server environment variables - ensures proper PATH and NODE_PATH
   * inheritance across all platforms and deployment scenarios.
   * @param {Object} server - The server definition
   * @returns {{env: { [key: string]: string } | {}}} - The environment variables
   */
  #buildMCPServerENV(server) {
    // Start with essential environment variables, inheriting from current process
    // This ensures GUI applications on macOS/Linux get proper PATH inheritance
    let baseEnv = {
      PATH: process.env.PATH || "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
      NODE_PATH: process.env.NODE_PATH || "/usr/local/lib/node_modules",
    };

    // Docker-specific environment setup
    if (process.env.ANYTHING_LLM_RUNTIME === "docker") {
      baseEnv = {
        // Fixed: NODE_PATH should point to modules directory, not node binary
        NODE_PATH: "/usr/local/lib/node_modules",
        PATH: "/usr/local/bin:/usr/bin:/bin",
        ...baseEnv, // Allow inheritance to override docker defaults if needed
      };
    }

    // No custom environment specified - return base environment
    if (!server?.env || Object.keys(server.env).length === 0) {
      return { env: baseEnv };
    }

    // Merge user-specified environment with base environment
    // User environment takes precedence over defaults
    return {
      env: {
        ...baseEnv,
        ...server.env,
      },
    };
  }

  /**
   * Parse the server type from the server definition
   * @param {Object} server - The server definition
   * @returns {MCPServerTypes | null} - The server type
   */
  #parseServerType(server) {
    if (server.hasOwnProperty("command")) return "stdio";
    if (server.hasOwnProperty("url")) return "http";
    return "sse";
  }

  /**
   * Validate the server definition by type
   * - Will throw an error if the server definition is invalid
   * @param {Object} server - The server definition
   * @param {MCPServerTypes} type - The server type
   * @returns {void}
   */
  #validateServerDefinitionByType(server, type) {
    if (type === "stdio") {
      if (server.hasOwnProperty("args") && !Array.isArray(server.args))
        throw new Error("MCP server args must be an array");
    }

    if (type === "http") {
      if (!["sse", "streamable"].includes(server?.type))
        throw new Error("MCP server type must have sse or streamable value.");
    }

    if (type === "sse") return;
    return;
  }

  /**
   * Setup the server transport by type and server definition
   * @param {Object} server - The server definition
   * @param {MCPServerTypes} type - The server type
   * @returns {StdioClientTransport | StreamableHTTPClientTransport | SSEClientTransport} - The server transport
   */
  #setupServerTransport(server, type) {
    // if not stdio then it is http or sse
    if (type !== "stdio") return this.createHttpTransport(server);

    return new StdioClientTransport({
      command: server.command,
      args: server?.args ?? [],
      ...this.#buildMCPServerENV(server),
    });
  }

  /**
   * Create MCP client transport for http MCP server.
   * @param {Object} server - The server definition
   * @returns {StreamableHTTPClientTransport | SSEClientTransport} - The server transport
   */
  createHttpTransport(server) {
    const url = new URL(server.url);

    // If the server block has a type property then use that to determine the transport type
    switch (server.type) {
      case "streamable":
        return new StreamableHTTPClientTransport(url, {
          requestInit: {
            headers: server.headers,
          },
        });
      default:
        return new SSEClientTransport(url, {
          requestInit: {
            headers: server.headers,
          },
        });
    }
  }

  /**
   * @private Start a single MCP server by its server definition from the JSON file
   * @param {string} name - The name of the MCP server to start
   * @param {Object} server - The server definition
   * @returns {Promise<boolean>}
   */
  async #startMCPServer({ name, server }) {
    if (!name) throw new Error("MCP server name is required");
    if (!server) throw new Error("MCP server definition is required");
    const serverType = this.#parseServerType(server);
    if (!serverType) throw new Error("MCP server command or url is required");

    this.#validateServerDefinitionByType(server, serverType);
    this.log(`Attempting to start MCP server: ${name}`);
    const mcp = new Client({ name: name, version: "1.0.0" });
    const transport = this.#setupServerTransport(server, serverType);

    // Add connection event listeners
    transport.onclose = () => this.log(`${name} - Transport closed`);
    transport.onerror = (error) =>
      this.log(`${name} - Transport error:`, error);
    transport.onmessage = (message) =>
      this.log(`${name} - Transport message:`, message);

    // Connect and await the connection with a timeout
    this.mcps[name] = mcp;
    const connectionPromise = mcp.connect(transport);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Connection timeout")), 30_000); // 30 second timeout
    });
    await Promise.race([connectionPromise, timeoutPromise]);
    return true;
  }

  /**
   * Boot the MCP servers according to the server definitions.
   * This function will skip booting MCP servers if they are already running.
   * @returns { Promise<{ [key: string]: {status: string, message: string} }> } The results of the boot process.
   */
  async bootMCPServers() {
    if (Object.keys(this.mcps).length > 0) {
      this.log("MCP Servers already running, skipping boot.");
      return this.mcpLoadingResults;
    }

    const serverDefinitions = this.mcpServerConfigs;
    for (const { name, server } of serverDefinitions) {
      if (
        server.anythingllm?.hasOwnProperty("autoStart") &&
        server.anythingllm.autoStart === false
      ) {
        this.log(
          `MCP server ${name} has anythingllm.autoStart property set to false, skipping boot!`
        );
        this.mcpLoadingResults[name] = {
          status: "failed",
          message: `MCP server ${name} has anythingllm.autoStart property set to false, boot skipped!`,
        };
        continue;
      }

      try {
        await this.#startMCPServer({ name, server });
        // Verify the connection is alive?
        // if (!(await mcp.ping())) throw new Error('Connection failed to establish');
        this.mcpLoadingResults[name] = {
          status: "success",
          message: `Successfully connected to MCP server: ${name}`,
        };
      } catch (e) {
        this.log(`Failed to start MCP server: ${name}`, {
          error: e.message,
          code: e.code,
          syscall: e.syscall,
          path: e.path,
          stack: e.stack, // Adding stack trace for better debugging
        });
        this.mcpLoadingResults[name] = {
          status: "failed",
          message: `Failed to start MCP server: ${name} [${e.code || "NO_CODE"}] ${e.message}`,
        };

        // Clean up failed connection
        if (this.mcps[name]) {
          this.mcps[name].close();
          delete this.mcps[name];
        }
      }
    }

    const runningServers = Object.keys(this.mcps);
    this.log(
      `Successfully started ${runningServers.length} MCP servers:`,
      runningServers
    );
    return this.mcpLoadingResults;
  }
}

module.exports = MCPHypervisor;
