const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { TaskExecutor, TASK_TYPES } = require("./executor");

class AgentTasks {
  constructor() {
    this.tasksDir = process.env.STORAGE_DIR
      ? path.join(process.env.STORAGE_DIR, "plugins", "agent-tasks")
      : path.join(process.cwd(), "storage", "plugins", "agent-tasks");
    this.executor = new TaskExecutor();
  }

  /**
   * Ensure tasks directory exists
   */
  async ensureTasksDir() {
    try {
      await fs.mkdir(this.tasksDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create tasks directory:", error);
    }
  }

  /**
   * Helper to get all task files with their contents
   * @returns {Object} Map of task UUID to task config
   */
  async getAllTasks() {
    const files = await fs.readdir(this.tasksDir);
    const tasks = {};

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const content = await fs.readFile(
          path.join(this.tasksDir, file),
          "utf8"
        );
        const config = JSON.parse(content);
        const id = file.replace(".json", "");
        tasks[id] = config;
      } catch (error) {
        console.error(`Error reading task file ${file}:`, error);
      }
    }

    return tasks;
  }

  /**
   * Load a task configuration by UUID
   * @param {string} uuid - The UUID of the task to load
   * @returns {Object|null} Task configuration or null if not found
   */
  async loadTask(uuid) {
    try {
      const tasks = await this.getAllTasks();
      const task = tasks[uuid];
      if (!task) return null;

      return {
        name: task.name,
        uuid,
        config: task,
      };
    } catch (error) {
      console.error("Failed to load task:", error);
      return null;
    }
  }

  /**
   * Save a task configuration
   * @param {string} name - The name of the task
   * @param {Object} config - The task configuration
   * @param {string|null} uuid - Optional UUID for the task
   * @returns {Object} Result of the save operation
   */
  async saveTask(name, config, uuid = null) {
    try {
      await this.ensureTasksDir();

      // Generate new UUID if not provided
      if (!uuid) {
        uuid = uuidv4();
      }

      const filename = path.join(this.tasksDir, `${uuid}.json`);
      await fs.writeFile(
        filename,
        JSON.stringify({ ...config, name }, null, 2)
      );
      return { success: true, uuid };
    } catch (error) {
      console.error("Failed to save task:", error);
      return { success: false };
    }
  }

  /**
   * List all available tasks
   * @returns {Array} Array of task summaries
   */
  async listTasks() {
    try {
      const tasks = await this.getAllTasks();
      return Object.entries(tasks).map(([uuid, task]) => ({
        name: task.name,
        uuid,
        description: task.description,
      }));
    } catch (error) {
      console.error("Failed to list tasks:", error);
      return [];
    }
  }

  /**
   * Delete a task by UUID
   * @param {string} uuid - The UUID of the task to delete
   * @returns {Object} Result of the delete operation
   */
  async deleteTask(uuid) {
    try {
      const filename = path.join(this.tasksDir, `${uuid}.json`);
      await fs.unlink(filename);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete task:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if a task exists
   * @param {string} uuid - The UUID of the task to check
   * @returns {Promise<boolean>} Whether the task exists
   */
  async taskExists(uuid) {
    try {
      const filename = path.join(this.tasksDir, `${uuid}.json`);
      await fs.access(filename);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get task function definition for agent
   * @param {string} uuid - The UUID of the task
   * @returns {Promise<Object|null>} Function definition for the agent
   */
  async getTaskFunction(uuid) {
    const task = await this.loadTask(uuid);
    if (!task) return null;

    const startBlock = task.config.steps?.find((s) => s.type === "start");
    const variables = startBlock?.config?.variables || [];

    return {
      name: `task_${uuid}`,
      description: `Execute agent task: ${task.name} - ${task.description}`,
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
  }

  /**
   * Get all available task functions for the agent
   * @returns {Promise<Array>} Array of function definitions
   */
  async getAvailableTaskFunctions() {
    const tasks = await this.getAllTasks();
    const functions = [];

    for (const [uuid, task] of Object.entries(tasks)) {
      const funcDef = await this.getTaskFunction(uuid);
      if (funcDef) functions.push(funcDef);
    }

    return functions;
  }

  /**
   * Execute a task by UUID
   * @param {string} uuid - The UUID of the task to execute
   * @param {Object} variables - Initial variables for the task
   * @returns {Promise<Object>} Result of task execution
   */
  async executeTask(uuid, variables = {}) {
    const task = await this.loadTask(uuid);
    if (!task) {
      throw new Error(`Task ${uuid} not found`);
    }
    return await this.executor.executeTask(task, variables);
  }

  /**
   * Get all supported task types and their schemas
   * @returns {Object} Map of task types to their schemas
   */
  getTaskTypes() {
    return TASK_TYPES;
  }

  /**
   * Validate a task configuration against the schema
   * @param {Object} config - The task configuration to validate
   * @returns {Object} Validation result
   */
  validateTaskConfig(config) {
    const errors = [];

    if (!config.steps || !Array.isArray(config.steps)) {
      errors.push("Task must have steps array");
      return { valid: false, errors };
    }

    for (const [index, step] of config.steps.entries()) {
      if (!step.type) {
        errors.push(`Step ${index} missing type`);
        continue;
      }

      const typeSchema = Object.values(TASK_TYPES).find(
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
   * Get all active tasks as plugins that can be loaded into the agent
   * @returns {Promise<string[]>} Array of task names in @@task_{uuid} format
   */
  async activeTaskPlugins() {
    const tasks = await this.getAllTasks();
    return Object.keys(tasks).map(uuid => `@@task_${uuid}`);
  }

  /**
   * Load a task plugin by its UUID
   * @param {string} uuid - The UUID of the task to load
   * @returns {Object|null} Plugin configuration or null if not found
   */
  async loadTaskPlugin(uuid) {
    const task = await this.loadTask(uuid);
    if (!task) return null;

    const startBlock = task.config.steps?.find((s) => s.type === "start");
    const variables = startBlock?.config?.variables || [];

    return {
      name: `task_${uuid}`,
      description: `Execute agent task: ${task.name}`,
      plugin: (runtimeArgs = {}) => ({
        name: `task_${uuid}`,
        description: task.description || `Execute agent task: ${task.name}`,
        setup: (aibitat) => {
          aibitat.function({
            name: `task_${uuid}`,
            description: task.description || `Execute agent task: ${task.name}`,
            parameters: {
              type: "object",
              properties: variables.reduce((acc, v) => {
                if (v.name) {
                  acc[v.name] = {
                    type: "string",
                    description: v.description || `Value for variable ${v.name}`,
                  };
                }
                return acc;
              }, {}),
            },
            handler: async (args) => {
              const result = await this.executeTask(uuid, args);
              // Convert result to string if it's an object
              return typeof result === 'object' ? JSON.stringify(result) : String(result);
            },
          });
        },
      }),
      taskName: task.name,
    };
  }
}

// Create singleton instance
const agentTasks = new AgentTasks();

module.exports = {
  AgentTasks: agentTasks,
};
