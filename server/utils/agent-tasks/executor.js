const executeApiCall = require('./executors/api-call');
const executeWebsite = require('./executors/website');
const executeFile = require('./executors/file');
const executeCode = require('./executors/code');

const TASK_TYPES = {
  API_CALL: {
    type: "apiCall",
    description: "Make an HTTP request to an API endpoint",
    parameters: {
      url: { type: "string", description: "The URL to make the request to" },
      method: { type: "string", description: "HTTP method (GET, POST, etc.)" },
      headers: { type: "array", description: "Request headers as key-value pairs" },
      bodyType: { type: "string", description: "Type of request body (json, form)" },
      body: { type: "string", description: "Request body content" },
      formData: { type: "array", description: "Form data as key-value pairs" },
      responseVariable: { type: "string", description: "Variable to store the response" }
    }
  },
  WEBSITE: {
    type: "website",
    description: "Interact with a website",
    parameters: {
      url: { type: "string", description: "The URL of the website" },
      selector: { type: "string", description: "CSS selector for targeting elements" },
      action: { type: "string", description: "Action to perform (read, click, type)" },
      value: { type: "string", description: "Value to use for type action" },
      resultVariable: { type: "string", description: "Variable to store the result" }
    }
  },
  FILE: {
    type: "file",
    description: "Perform file system operations",
    parameters: {
      path: { type: "string", description: "Path to the file" },
      operation: { type: "string", description: "Operation to perform (read, write, append)" },
      content: { type: "string", description: "Content for write/append operations" },
      resultVariable: { type: "string", description: "Variable to store the result" }
    }
  },
  CODE: {
    type: "code",
    description: "Execute code in various languages",
    parameters: {
      language: { type: "string", description: "Programming language to execute" },
      code: { type: "string", description: "Code to execute" },
      resultVariable: { type: "string", description: "Variable to store the result" }
    }
  }
};

class TaskExecutor {
  constructor() {
    this.variables = {};
  }

  // Utility to replace variables in config
  replaceVariables(config) {
    const configStr = JSON.stringify(config);
    const replaced = configStr.replace(/\${([^}]+)}/g, (match, varName) => {
      return this.variables[varName] || match;
    });
    return JSON.parse(replaced);
  }

  // Main execution method
  async executeStep(step) {
    const config = this.replaceVariables(step.config);
    let result;

    switch (step.type) {
      case TASK_TYPES.API_CALL.type:
        result = await executeApiCall(config);
        break;
      case TASK_TYPES.WEBSITE.type:
        result = await executeWebsite(config);
        break;
      case TASK_TYPES.FILE.type:
        result = await executeFile(config);
        break;
      case TASK_TYPES.CODE.type:
        result = await executeCode(config);
        break;
      default:
        throw new Error(`Unknown task type: ${step.type}`);
    }

    // Store result in variable if specified
    if (config.resultVariable || config.responseVariable) {
      const varName = config.resultVariable || config.responseVariable;
      this.variables[varName] = result;
    }

    return result;
  }

  // Execute entire task
  async executeTask(task, initialVariables = {}) {
    this.variables = { ...initialVariables };
    const results = [];

    for (const step of task.config.steps) {
      try {
        const result = await this.executeStep(step);
        results.push({ success: true, result });
      } catch (error) {
        results.push({ success: false, error: error.message });
        break;
      }
    }

    return {
      success: results.every(r => r.success),
      results,
      variables: this.variables
    };
  }
}

module.exports = {
  TaskExecutor,
  TASK_TYPES
};