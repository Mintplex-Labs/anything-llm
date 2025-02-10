const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { FlowExecutor, FLOW_TYPES } = require("./executor");
const { normalizePath } = require("../files");

class AgentFlows {
  constructor() {
    this.flowsDir = process.env.STORAGE_DIR
      ? path.join(process.env.STORAGE_DIR, "plugins", "agent-flows")
      : path.join(process.cwd(), "storage", "plugins", "agent-flows");
    this.executor = new FlowExecutor();
  }

  /**
   * Ensure flows directory exists
   */
  async ensureFlowsDir() {
    try {
      await fs.mkdir(this.flowsDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create flows directory:", error);
    }
  }

  /**
   * Helper to get all flow files with their contents
   * @returns {Object} Map of flow UUID to flow config
   */
  async getAllFlows() {
    const files = await fs.readdir(this.flowsDir);
    const flows = {};

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const normalizedFile = normalizePath(file);
        const filePath = path.join(this.flowsDir, normalizedFile);
        const content = await fs.readFile(filePath, "utf8");
        const config = JSON.parse(content);
        const id = normalizedFile.replace(".json", "");
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
   * @returns {Object|null} Flow configuration or null if not found
   */
  async loadFlow(uuid) {
    try {
      const flows = await this.getAllFlows();
      const flow = flows[uuid];
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
  async saveFlow(name, config, uuid = null) {
    try {
      await this.ensureFlowsDir();

      // Generate new UUID if not provided
      if (!uuid) {
        uuid = uuidv4();
      }

      const normalizedUuid = normalizePath(`${uuid}.json`);
      const filePath = path.join(this.flowsDir, normalizedUuid);
      await fs.writeFile(
        filePath,
        JSON.stringify({ ...config, name }, null, 2)
      );
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
  async listFlows() {
    try {
      const flows = await this.getAllFlows();
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
  async deleteFlow(uuid) {
    try {
      const normalizedUuid = normalizePath(`${uuid}.json`);
      const filePath = path.join(this.flowsDir, normalizedUuid);
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete flow:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if a flow exists
   * @param {string} uuid - The UUID of the flow to check
   * @returns {Promise<boolean>} Whether the flow exists
   */
  async flowExists(uuid) {
    try {
      const normalizedUuid = normalizePath(`${uuid}.json`);
      const filePath = path.join(this.flowsDir, normalizedUuid);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get flow function definition for agent
   * @param {string} uuid - The UUID of the flow
   * @returns {Promise<Object|null>} Function definition for the agent
   */
  async getFlowFunction(uuid) {
    console.log(`[AgentFlows] Getting function definition for flow ${uuid}`);

    const flow = await this.loadFlow(uuid);
    if (!flow) {
      console.log(`[AgentFlows] No flow found for UUID ${uuid}`);
      return null;
    }

    const startBlock = flow.config.steps?.find((s) => s.type === "start");
    const variables = startBlock?.config?.variables || [];

    const funcDef = {
      name: `flow_${uuid}`,
      description: `Execute agent flow: ${flow.name} - ${flow.description}`,
      parameters: variables.reduce((acc, v) => {
        if (v.name) {
          acc[v.name] = {
            type: "string",
            description: v.description || `Value for variable ${v.name}`,
          };
        }
        return acc;
      }, {}),
    };

    console.log(`[AgentFlows] Generated function definition:`, funcDef);
    return funcDef;
  }

  /**
   * Get all available flow functions for the agent
   * @returns {Promise<Array>} Array of function definitions
   */
  async getAvailableFlowFunctions() {
    const flows = await this.getAllFlows();
    const functions = [];

    for (const [uuid, flow] of Object.entries(flows)) {
      const funcDef = await this.getFlowFunction(uuid);
      if (funcDef) functions.push(funcDef);
    }

    return functions;
  }

  /**
   * Execute a flow by UUID
   * @param {string} uuid - The UUID of the flow to execute
   * @param {Object} variables - Initial variables for the flow
   * @returns {Promise<Object>} Result of flow execution
   */
  async executeFlow(uuid, variables = {}, introspect = null) {
    const flow = await this.loadFlow(uuid);
    if (!flow) {
      throw new Error(`Flow ${uuid} not found`);
    }

    return await this.executor.executeFlow(flow, variables, introspect);
  }

  /**
   * Get all supported flow types and their schemas
   * @returns {Object} Map of flow types to their schemas
   */
  getFlowTypes() {
    return FLOW_TYPES;
  }

  /**
   * Validate a flow configuration against the schema
   * @param {Object} config - The flow configuration to validate
   * @returns {Object} Validation result
   */
  validateFlowConfig(config) {
    const errors = [];

    if (!config.steps || !Array.isArray(config.steps)) {
      errors.push("Flow must have steps array");
      return { valid: false, errors };
    }

    for (const [index, step] of config.steps.entries()) {
      if (!step.type) {
        errors.push(`Step ${index} missing type`);
        continue;
      }

      const typeSchema = Object.values(FLOW_TYPES).find(
        (t) => t.type === step.type
      );
      if (!typeSchema) {
        errors.push(`Step ${index} has unknown type: ${step.type}`);
        continue;
      }

      if (!step.config) {
        errors.push(`Step ${index} missing config`);
        continue;
      }

      // Validate required parameters
      for (const [paramName, paramSchema] of Object.entries(
        typeSchema.parameters
      )) {
        if (paramSchema.required && !step.config[paramName]) {
          errors.push(`Step ${index} missing required parameter: ${paramName}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get all active flows as plugins that can be loaded into the agent
   * @returns {Promise<string[]>} Array of flow names in @@flow_{uuid} format
   */
  async activeFlowPlugins() {
    const flows = await this.getAllFlows();
    return Object.entries(flows)
      .filter(([_, flow]) => flow.active !== false)
      .map(([uuid]) => `@@flow_${uuid}`);
  }

  /**
   * Load a flow plugin by its UUID
   * @param {string} uuid - The UUID of the flow to load
   * @returns {Object|null} Plugin configuration or null if not found
   */
  async loadFlowPlugin(uuid) {
    const flow = await this.loadFlow(uuid);
    if (!flow) return null;

    const startBlock = flow.config.steps?.find((s) => s.type === "start");
    const variables = startBlock?.config?.variables || [];

    return {
      name: `flow_${uuid}`,
      description: `Execute agent flow: ${flow.name}`,
      plugin: (runtimeArgs = {}) => ({
        name: `flow_${uuid}`,
        description: flow.description || `Execute agent flow: ${flow.name}`,
        setup: (aibitat) => {
          aibitat.function({
            name: `flow_${uuid}`,
            description: flow.description || `Execute agent flow: ${flow.name}`,
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
              const result = await this.executeFlow(
                uuid,
                args,
                aibitat.introspect
              );
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

// Create singleton instance
const agentFlows = new AgentFlows();

module.exports = {
  AgentFlows: agentFlows,
};
