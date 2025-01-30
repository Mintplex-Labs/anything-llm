const fs = require('fs').promises;
const path = require('path');

const TASKS_DIR = path.join(__dirname, 'tasks');

// Ensure tasks directory exists
async function ensureTasksDir() {
  try {
    await fs.mkdir(TASKS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create tasks directory:', error);
  }
}

// Save a task configuration
async function saveTask(name, config) {
  try {
    await ensureTasksDir();
    const filename = path.join(TASKS_DIR, `${name}.json`);
    await fs.writeFile(filename, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to save task:', error);
    return false;
  }
}

// Load a task configuration
async function loadTask(name) {
  try {
    const filename = path.join(TASKS_DIR, `${name}.json`);
    const content = await fs.readFile(filename, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load task:', error);
    return null;
  }
}

// List all available tasks
async function listTasks() {
  try {
    await ensureTasksDir();
    const files = await fs.readdir(TASKS_DIR);
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
  } catch (error) {
    console.error('Failed to list tasks:', error);
    return [];
  }
}

// Helper to replace variables in config with actual values
function replaceVariables(config, variables) {
  const configStr = JSON.stringify(config);
  const replaced = configStr.replace(/\${([^}]+)}/g, (match, varName) => {
    return variables[varName] || match;
  });
  return JSON.parse(replaced);
}

const taskExecutor = {
  name: "agent-task-executor",
  startupConfig: {
    params: {},
  },
  plugin: (config = {}) => ({
    setup(aibitat) {
      aibitat.function("executeTask", {
        description: "Execute a task with the given configuration",
        parameters: {
          type: {
            type: "string",
            description: "Type of task to execute"
          },
          config: {
            type: "object",
            description: "Configuration for the task",
            additionalProperties: true
          }
        },
        async handler(params, context) {
          const { type, config } = params;

          switch (type) {
            case "apiCall":
              return await executeApiCall(config);
            case "website":
              return await executeWebsiteAction(config);
            case "file":
              return await executeFileOperation(config);
            case "code":
              return await executeCode(config);
            default:
              throw new Error(`Unknown task type: ${type}`);
          }
        }
      });

      aibitat.function("executeAgentTask", {
        description: "Execute a saved agent task by name",
        parameters: {
          taskName: {
            type: "string",
            description: "Name of the agent task to execute"
          },
          variables: {
            type: "object",
            description: "Variables to use in the task",
            additionalProperties: true
          }
        },
        async handler(params, context) {
          const { taskName, variables = {} } = params;
          const taskConfig = await loadTask(taskName);
          if (!taskConfig) throw new Error(`Task ${taskName} not found`);

          const results = {};
          for (const step of taskConfig.steps) {
            const result = await aibitat.executeFunction("executeTask", {
              type: step.type,
              config: replaceVariables(step.config, variables)
            });

            const varName = step.config.resultVariable || step.config.responseVariable;
            if (varName) {
              results[varName] = result;
              variables[varName] = result; // Make available for next steps
            }
          }
          return JSON.stringify(results);
        }
      });
    }
  })
};

async function executeApiCall(config) {
  const { url, method, headers = [], body, bodyType, formData } = config;

  const requestConfig = {
    method,
    headers: headers.reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {})
  };

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    if (bodyType === 'form') {
      const formDataObj = new URLSearchParams();
      formData.forEach(({ key, value }) => formDataObj.append(key, value));
      requestConfig.body = formDataObj.toString();
      requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (bodyType === 'json') {
      requestConfig.body = body;
      requestConfig.headers['Content-Type'] = 'application/json';
    } else {
      requestConfig.body = body;
    }
  }

  try {
    const response = await fetch(url, requestConfig);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    try {
      // Try to parse as JSON first
      return JSON.stringify(JSON.parse(data));
    } catch {
      // If not JSON, return as text
      return data;
    }
  } catch (error) {
    throw new Error(`API Call failed: ${error.message}`);
  }
}

async function executeWebsiteAction(config) {
  const { webBrowsing } = require("../web-browsing");
  const { url, action, selector } = config;
  let content;

  switch(action) {
    case 'read':
      content = await webBrowsing.readContent(url, selector);
      return content;
    case 'click':
      // For now, just return the selector that would be clicked
      return `Would click: ${selector} on ${url}`;
    case 'type':
      // For now, just return the typing action that would occur
      return `Would type at: ${selector} on ${url}`;
    default:
      throw new Error(`Unknown website action: ${action}`);
  }
}

async function executeFileOperation(config) {
  const { path, operation, content } = config;

  switch(operation) {
    case 'read':
      return await fs.readFile(path, 'utf8');
    case 'write':
      await fs.writeFile(path, content);
      return `File written to ${path}`;
    case 'append':
      await fs.appendFile(path, content);
      return `Content appended to ${path}`;
    default:
      throw new Error(`Unknown file operation: ${operation}`);
  }
}

async function executeCode(config) {
  const { language, code } = config;

  // For security, we'll just return what would be executed for now
  return `Would execute ${language} code:\n${code}`;
}

module.exports = {
  taskExecutor,
  saveTask,
  loadTask,
  listTasks
};
