const { safeJsonParse } = require("../../http");
const path = require("path");
const fs = require("fs");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js");

/**
 * @class MCPHypervisor
 * @description A class that manages MCP servers found in the storage/plugins/anythingllm_mcp_servers.json file.
 * This class is responsible for booting, stopping, and reloading MCP servers - it is the user responsiblity for the MCP server definitions
 * to me correct and also functioning tools depending on their deployment (docker vs local) as well as the security of said tools
 * since MCP is basically arbitrary code execution.
 *
 * @notice This class is a singleton.
 * @notice Each MCP tool has dependencies specific to it and this call WILL NOT check for them.
 * For example, if the tools requires `npx` then the context in which AnythingLLM mains process is running will need to access npx.
 * This is typically not common in our pre-built image so may not function. But this is the case anywhere MCP is used.
 *
 * AnythingLLM will take care of porting MCP servers to agent-callable functions via @agent directive.
 * @see
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
   * @type { { [key: string]: Client & {transport: {_process: import('child_process').ChildProcess}} } }
   */
  mcps = {};

  constructor() {
    if (MCPHypervisor._instance) return MCPHypervisor._instance;
    MCPHypervisor._instance = this;
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
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
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
   * Reload the MCP servers - can be used to reload the MCP servers without restarting the server or app
   */
  async reloadMCPServers() {
    await this.pruneMCPServers();
    await this.bootMCPServers();
  }

  /**
   * Prune the MCP servers - pkills and forgets all MCP servers
   */
  async pruneMCPServers() {
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
  }

  /**
   * Boot the MCP servers according to the server definitions.
   * This function will skip booting MCP servers if they are already running.
   * @returns { Promise<{ [key: string]: {status: string, message: string} }> } The results of the boot process.
   */
  async bootMCPServers() {
    if (Object.keys(this.mcps).length > 0) {
      this.log("MCP Servers already running, skipping boot.");
      const results = {};
      Object.keys(this.mcps).forEach((name) => {
        results[name] = {
          status: "success",
          message: `Successfully connected to MCP server: ${name}`,
        };
      });
      return results;
    }

    const serverDefinitions = this.mcpServerConfigs;
    const results = {};
    for (const { name, server } of serverDefinitions) {
      try {
        this.log(`Attempting to start MCP server: ${name}`);
        const mcp = new Client({ name: name, version: "1.0.0" });
        const transport = new StdioClientTransport({
          command: server.command,
          args: server?.args ?? [],
        });

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

        // Verify the connection is alive?
        // if (!(await mcp.ping())) throw new Error('Connection failed to establish');
        results[name] = {
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

        results[name] = {
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
    return results;
  }
}

module.exports = MCPHypervisor;
