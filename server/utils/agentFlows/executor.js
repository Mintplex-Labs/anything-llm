const { FLOW_TYPES } = require("./flowTypes");
const executeApiCall = require("./executors/api-call");
const executeWebsite = require("./executors/website");
const executeFile = require("./executors/file");
const executeCode = require("./executors/code");
const executeLLMInstruction = require("./executors/llm-instruction");
const executeWebScraping = require("./executors/web-scraping");
const { Telemetry } = require("../../models/telemetry");

class FlowExecutor {
  constructor() {
    this.variables = {};
    this.introspect = (...args) => console.log("[introspect] ", ...args);
    this.logger = console.info;
    this.aibitat = null;
  }

  attachLogging(introspectFn = null, loggerFn = null) {
    this.introspect =
      introspectFn || ((...args) => console.log("[introspect] ", ...args));
    this.logger = loggerFn || console.info;
  }

  // Utility to replace variables in config
  replaceVariables(config) {
    const deepReplace = (obj) => {
      if (typeof obj === "string") {
        return obj.replace(/\${([^}]+)}/g, (match, varName) => {
          return this.variables[varName] !== undefined
            ? this.variables[varName]
            : match;
        });
      }
      if (Array.isArray(obj)) {
        return obj.map((item) => deepReplace(item));
      }
      if (obj && typeof obj === "object") {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = deepReplace(value);
        }
        return result;
      }
      return obj;
    };

    return deepReplace(config);
  }

  // Main execution method
  async executeStep(step) {
    const config = this.replaceVariables(step.config);
    let result;
    // Create execution context with introspect
    const context = {
      introspect: this.introspect,
      variables: this.variables,
      logger: this.logger,
      aibitat: this.aibitat,
    };

    switch (step.type) {
      case FLOW_TYPES.START.type:
        // For start blocks, we just initialize variables if they're not already set
        if (config.variables) {
          config.variables.forEach((v) => {
            if (v.name && !this.variables[v.name]) {
              this.variables[v.name] = v.value || "";
            }
          });
        }
        result = this.variables;
        break;
      case FLOW_TYPES.API_CALL.type:
        result = await executeApiCall(config, context);
        break;
      case FLOW_TYPES.WEBSITE.type:
        result = await executeWebsite(config, context);
        break;
      case FLOW_TYPES.FILE.type:
        result = await executeFile(config, context);
        break;
      case FLOW_TYPES.CODE.type:
        result = await executeCode(config, context);
        break;
      case FLOW_TYPES.LLM_INSTRUCTION.type:
        result = await executeLLMInstruction(config, context);
        break;
      case FLOW_TYPES.WEB_SCRAPING.type:
        result = await executeWebScraping(config, context);
        break;
      default:
        throw new Error(`Unknown flow type: ${step.type}`);
    }

    // Store result in variable if specified
    if (config.resultVariable || config.responseVariable) {
      const varName = config.resultVariable || config.responseVariable;
      this.variables[varName] = result;
    }

    return result;
  }

  /**
   * Execute entire flow
   * @param {Object} flow - The flow to execute
   * @param {Object} initialVariables - Initial variables for the flow
   * @param {Object} aibitat - The aibitat instance from the agent handler
   */
  async executeFlow(flow, initialVariables = {}, aibitat) {
    await Telemetry.sendTelemetry("agent_flow_execution_started");

    // Initialize variables with both initial values and any passed-in values
    this.variables = {
      ...(
        flow.config.steps.find((s) => s.type === "start")?.config?.variables ||
        []
      ).reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {}),
      ...initialVariables, // This will override any default values with passed-in values
    };

    this.aibitat = aibitat;
    this.attachLogging(aibitat?.introspect, aibitat?.handlerProps?.log);
    const results = [];

    for (const step of flow.config.steps) {
      try {
        const result = await this.executeStep(step);
        results.push({ success: true, result });
      } catch (error) {
        results.push({ success: false, error: error.message });
        break;
      }
    }

    return {
      success: results.every((r) => r.success),
      results,
      variables: this.variables,
    };
  }
}

module.exports = {
  FlowExecutor,
  FLOW_TYPES,
};
