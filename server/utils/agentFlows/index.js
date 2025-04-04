const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { FlowExecutor } = require("./executor");
const { normalizePath } = require("../files");
const { safeJsonParse } = require("../http");

/**
 * @typedef {Object} LoadedFlow
 * @property {string} name - The name of the flow
 * @property {string} uuid - The UUID of the flow
 * @property {Object} config - The flow configuration details
 * @property {string} config.description - The description of the flow
 * @property {Array<{type: string, config: Object, [key: string]: any}>} config.steps - The steps of the flow. Each step has at least a type and config
 */

class AgentFlows {
  static flowsDir = process.env.STORAGE_DIR
    ? path.join(process.env.STORAGE_DIR, "plugins", "agent-flows")
    : path.join(process.cwd(), "storage", "plugins", "agent-flows");

  constructor() {}

  /**
   * Ensure flows directory exists
   * @returns {Boolean} True if directory exists, false otherwise
   */
  static createOrCheckFlowsDir() {
    try {
      if (fs.existsSync(AgentFlows.flowsDir)) return true;
      fs.mkdirSync(AgentFlows.flowsDir, { recursive: true });
      return true;
    } catch (error) {
      console.error("Failed to create flows directory:", error);
      return false;
    }
  }

  /**
   * Helper to get all flow files with their contents
   * @returns {Object} Map of flow UUID to flow config
   */
  static getAllFlows() {
    AgentFlows.createOrCheckFlowsDir();
    const files = fs.readdirSync(AgentFlows.flowsDir);
    const flows = {};

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const filePath = path.join(AgentFlows.flowsDir, file);
        const content = fs.readFileSync(normalizePath(filePath), "utf8");
        const config = JSON.parse(content);
        const id = file.replace(".json", "");
        flows[id] = config;
      } catch (error) {
        console.error(`Error reading flow file ${file}:`, error);
      }
    }

    return flows;
  }

  /**
   * Load a flow configuration by UUID
   * @param {string} uuid - The UUID of the flow to load
   * @returns {LoadedFlow|null} Flow configuration or null if not found
   */
  static loadFlow(uuid) {
    try {
      const flowJsonPath = normalizePath(
        path.join(AgentFlows.flowsDir, `${uuid}.json`)
      );
      if (!uuid || !fs.existsSync(flowJsonPath)) return null;
      const flow = safeJsonParse(fs.readFileSync(flowJsonPath, "utf8"), null);
      if (!flow) return null;

      return {
        name: flow.name,
        uuid,
        config: flow,
      };
    } catch (error) {
      console.error("Failed to load flow:", error);
      return null;
    }
  }

  /**
   * Save a flow configuration
   * @param {string} name - The name of the flow
   * @param {Object} config - The flow configuration
   * @param {string|null} uuid - Optional UUID for the flow
   * @returns {Object} Result of the save operation
   */
  static saveFlow(name, config, uuid = null) {
    try {
      AgentFlows.createOrCheckFlowsDir();

      if (!uuid) uuid = uuidv4();
      const normalizedUuid = normalizePath(`${uuid}.json`);
      const filePath = path.join(AgentFlows.flowsDir, normalizedUuid);
      fs.writeFileSync(filePath, JSON.stringify({ ...config, name }, null, 2));
      return { success: true, uuid };
    } catch (error) {
      console.error("Failed to save flow:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * List all available flows
   * @returns {Array} Array of flow summaries
   */
  static listFlows() {
    try {
      const flows = AgentFlows.getAllFlows();
      return Object.entries(flows).map(([uuid, flow]) => ({
        name: flow.name,
        uuid,
        description: flow.description,
        active: flow.active !== false,
      }));
    } catch (error) {
      console.error("Failed to list flows:", error);
      return [];
    }
  }

  /**
   * Delete a flow by UUID
   * @param {string} uuid - The UUID of the flow to delete
   * @returns {Object} Result of the delete operation
   */
  static deleteFlow(uuid) {
    try {
      const filePath = normalizePath(
        path.join(AgentFlows.flowsDir, `${uuid}.json`)
      );
      if (!fs.existsSync(filePath)) throw new Error(`Flow ${uuid} not found`);
      fs.rmSync(filePath);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete flow:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Execute a flow by UUID
   * @param {string} uuid - The UUID of the flow to execute
   * @param {Object} variables - Initial variables for the flow
   * @param {Object} aibitat - The aibitat instance from the agent handler
   * @returns {Promise<Object>} Result of flow execution
   */
  static async executeFlow(uuid, variables = {}, aibitat = null) {
    const flow = AgentFlows.loadFlow(uuid);
    if (!flow) throw new Error(`Flow ${uuid} not found`);
    const flowExecutor = new FlowExecutor();
    return await flowExecutor.executeFlow(flow, variables, aibitat);
  }

  /**
   * Get all active flows as plugins that can be loaded into the agent
   * @returns {string[]} Array of flow names in @@flow_{uuid} format
   */
  static activeFlowPlugins() {
    const flows = AgentFlows.getAllFlows();
    return Object.entries(flows)
      .filter(([_, flow]) => flow.active !== false)
      .map(([uuid]) => `@@flow_${uuid}`);
  }

  /**
   * Load a flow plugin by its UUID
   * @param {string} uuid - The UUID of the flow to load
   * @returns {Object|null} Plugin configuration or null if not found
   */
  static loadFlowPlugin(uuid) {
    const flow = AgentFlows.loadFlow(uuid);
    if (!flow) return null;

    const startBlock = flow.config.steps?.find((s) => s.type === "start");
    const variables = startBlock?.config?.variables || [];

    return {
      name: `flow_${uuid}`,
      description: `Execute agent flow: ${flow.name}`,
      plugin: (_runtimeArgs = {}) => ({
        name: `flow_${uuid}`,
        description:
          flow.config.description || `Execute agent flow: ${flow.name}`,
        setup: (aibitat) => {
          aibitat.function({
            name: `flow_${uuid}`,
            description:
              flow.config.description || `Execute agent flow: ${flow.name}`,
            parameters: {
              type: "object",
              properties: variables.reduce((acc, v) => {
                if (v.name) {
                  acc[v.name] = {
                    type: "string",
                    description:
                      v.description || `Value for variable ${v.name}`,
                  };
                }
                return acc;
              }, {}),
            },
            handler: async (args) => {
              aibitat.introspect(`Executing flow: ${flow.name}`);
              const result = await AgentFlows.executeFlow(uuid, args, aibitat);
              if (!result.success) {
                aibitat.introspect(
                  `Flow failed: ${result.results[0]?.error || "Unknown error"}`
                );
                return `Flow execution failed: ${result.results[0]?.error || "Unknown error"}`;
              }
              aibitat.introspect(`${flow.name} completed successfully`);
              return typeof result === "object"
                ? JSON.stringify(result)
                : String(result);
            },
          });
        },
      }),
      flowName: flow.name,
    };
  }
}

module.exports.AgentFlows = AgentFlows;
