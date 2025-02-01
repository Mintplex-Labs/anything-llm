const TASK_TYPES = {
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
      body: { type: "string", description: "Request body content" },
      formData: { type: "array", description: "Form data as key-value pairs" },
      responseVariable: {
        type: "string",
        description: "Variable to store the response",
      },
    },
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
};

module.exports = TASK_TYPES;
