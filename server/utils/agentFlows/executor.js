const { FLOW_TYPES } = require("./flowTypes");
const executeApiCall = require("./executors/api-call");
const executeWebsite = require("./executors/website");
const executeFile = require("./executors/file");
const executeCode = require("./executors/code");
const executeLLMInstruction = require("./executors/llm-instruction");
const executeWebScraping = require("./executors/web-scraping");
const { Telemetry } = require("../../models/telemetry");
const { safeJsonParse } = require("../http");

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

  /**
   * Resolves nested values from objects using dot notation and array indices
   * Supports paths like "data.items[0].name" or "response.users[2].address.city"
   * Returns empty string for invalid paths or errors
   */
  getValueFromPath(obj, path) {
    try {
      if (!path || typeof path !== "string") return "";

      const parsedObj = typeof obj === "string" ? safeJsonParse(obj, obj) : obj;

      // If no dots in path, return the whole object as a string
      if (!path.includes(".")) {
        if (typeof parsedObj === "object") {
          try {
            return JSON.stringify(parsedObj, null, 0);
          } catch (e) {
            return ""; // fallback for stringify errors
          }
        }
        return String(parsedObj);
      }

      // Get path without the variable name prefix
      const pathWithoutVar = path.split(".").slice(1).join(".");

      // Parse path into segments, converting array indices to [array, index] pairs
      const segments = [];
      let currentSegment = "";
      let inBracket = false;
      let bracketContent = "";

      // Parse each character to handle both object properties and array indices
      // Example path: items[0].name.details[1].type
      // Becomes: ['items', ['array', 0], 'name', 'details', ['array', 1], 'type']
      for (let i = 0; i < pathWithoutVar.length; i++) {
        const char = pathWithoutVar[i];

        // Start of array index - push current property name if exists
        if (char === "[" && !inBracket) {
          inBracket = true;
          if (currentSegment) {
            segments.push(currentSegment);
            currentSegment = "";
          }
          continue;
        }

        // End of array index - validate and convert to number
        if (char === "]" && inBracket) {
          inBracket = false;
          if (/^\d+$/.test(bracketContent)) {
            segments.push(["array", parseInt(bracketContent, 10)]);
          }
          bracketContent = "";
          continue;
        }

        // Build up array index or property name
        if (inBracket) {
          bracketContent += char;
        } else if (char === ".") {
          if (currentSegment) {
            segments.push(currentSegment);
            currentSegment = "";
          }
        } else {
          currentSegment += char;
        }
      }

      if (currentSegment) {
        segments.push(currentSegment);
      }

      // Navigate through object using segments, handling both array and object access
      let result = parsedObj;
      for (const segment of segments) {
        if (result === null || result === undefined) return "";

        if (Array.isArray(segment)) {
          const [type, index] = segment;
          if (type === "array") {
            if (!Array.isArray(result) || index < 0 || index >= result.length)
              return "";
            result = result[index];
          }
        } else {
          result = result?.[segment];
        }
      }

      // Convert final result to string, handling objects and error cases
      if (result === null || result === undefined) return "";
      if (typeof result === "object") {
        try {
          return JSON.stringify(result, null, 0);
        } catch (e) {
          return ""; // fallback for stringify errors
        }
      }
      return String(result);
    } catch (error) {
      console.error("Error in getValueFromPath:", error);
      return "";
    }
  }

  // Utility to replace variables in config
  replaceVariables(config) {
    const deepReplace = (obj) => {
      if (typeof obj === "string") {
        const result = obj.replace(/\${([^}]+)}/g, (match, varName) => {
          if (!this.variables[varName.split(".")[0]]) return match;
          return this.getValueFromPath(
            this.variables[varName.split(".")[0]],
            varName
          );
        });
        return result;
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
