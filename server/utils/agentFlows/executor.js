const executeApiCall = require("./executors/api-call");
const executeWebsite = require("./executors/website");
const executeFile = require("./executors/file");
const executeCode = require("./executors/code");
const executeLLMInstruction = require("./executors/llm-instruction");
const { Telemetry } = require("../../models/telemetry");

const FLOW_TYPES = {
  START: {
    type: "start",
    description: "Initialize flow variables",
    parameters: {
      variables: {
        type: "array",
        description: "List of variables to initialize",
      },
    },
  },
  API_CALL: {
    type: "apiCall",
    description: "Make an HTTP request to an API endpoint",
    parameters: {
      url: { type: "string", description: "The URL to make the request to" },
      method: { type: "string", description: "HTTP method (GET, POST, etc.)" },
      headers: {
        type: "array",
        description: "Request headers as key-value pairs",
      },
      bodyType: {
        type: "string",
        description: "Type of request body (json, form)",
      },
      body: {
        type: "string",
        description:
          "Request body content. If body type is json, always return a valid json object. If body type is form, always return a valid form data object.",
      },
      formData: { type: "array", description: "Form data as key-value pairs" },
      responseVariable: {
        type: "string",
        description: "Variable to store the response",
      },
    },
    examples: [
      {
        url: "https://api.example.com/data",
        method: "GET",
        headers: [{ key: "Authorization", value: "Bearer 1234567890" }],
      },
    ],
  },
  WEBSITE: {
    type: "website",
    description: "Interact with a website",
    parameters: {
      url: { type: "string", description: "The URL of the website" },
      selector: {
        type: "string",
        description: "CSS selector for targeting elements",
      },
      action: {
        type: "string",
        description: "Action to perform (read, click, type)",
      },
      value: { type: "string", description: "Value to use for type action" },
      resultVariable: {
        type: "string",
        description: "Variable to store the result",
      },
    },
  },
  FILE: {
    type: "file",
    description: "Perform file system operations",
    parameters: {
      path: { type: "string", description: "Path to the file" },
      operation: {
        type: "string",
        description: "Operation to perform (read, write, append)",
      },
      content: {
        type: "string",
        description: "Content for write/append operations",
      },
      resultVariable: {
        type: "string",
        description: "Variable to store the result",
      },
    },
  },
  CODE: {
    type: "code",
    description: "Execute code in various languages",
    parameters: {
      language: {
        type: "string",
        description: "Programming language to execute",
      },
      code: { type: "string", description: "Code to execute" },
      resultVariable: {
        type: "string",
        description: "Variable to store the result",
      },
    },
  },
  LLM_INSTRUCTION: {
    type: "llmInstruction",
    description: "Process data using LLM instructions",
    parameters: {
      instruction: {
        type: "string",
        description: "The instruction for the LLM to follow",
      },
      inputVariable: {
        type: "string",
        description: "Variable containing the input data to process",
      },
      resultVariable: {
        type: "string",
        description: "Variable to store the processed result",
      },
    },
  },
};

class FlowExecutor {
  constructor() {
    this.variables = {};
    this.introspect = () => {}; // Default no-op introspect
  }

  setIntrospect(introspectFn) {
    this.introspect = introspectFn || (() => {});
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

  // Execute entire flow
  async executeFlow(flow, initialVariables = {}, introspect = null) {
    await Telemetry.sendTelemetry("agent_flow_execution_started");

    // Initialize variables with both initial values and any passed-in values
    this.variables = {
      ...(
        flow.config.steps.find((s) => s.type === "start")?.config?.variables ||
        []
      ).reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {}),
      ...initialVariables, // This will override any default values with passed-in values
    };

    this.setIntrospect(introspect);
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
