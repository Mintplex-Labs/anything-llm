const MCPCompatibilityLayer = require("../MCP");

/**
 * Start the MCP servers when the server boots so their tools are available to the
 * very first agent session - not only after something (eg: the Agent Skills panel)
 * happens to request them. Servers with `anythingllm.autoStart: false` are skipped.
 *
 * Not awaited by the caller - each server can take up to 30s to connect and should not
 * delay the rest of boot. An agent session that starts while this is still running
 * waits for it to finish (see MCPHypervisor.bootMCPServers).
 * @returns {Promise<void>}
 */
async function bootMCPServers() {
  try {
    await new MCPCompatibilityLayer().bootMCPServers();
  } catch (e) {
    console.error(
      "\x1b[31m[MCP BOOT]\x1b[0m Error booting MCP servers",
      e.message,
      e
    );
  }
}

module.exports = bootMCPServers;
