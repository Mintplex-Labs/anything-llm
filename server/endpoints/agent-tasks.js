const { saveTask, loadTask, listTasks } = require("../utils/agents/aibitat/plugins/agent-task-executor");
const { AgentHandler } = require("../utils/agents");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { strictMultiUserRoleValid, ROLES } = require("../utils/middleware/multiUserProtected");

function agentTaskEndpoints(app) {
  if (!app) return;

  // Save a task configuration
  app.post(
    "/agent-task/save",
    // [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
    try {
        const { name, config } = request.body;

      if (!name || !config) {
          return response.status(400).json({
          success: false,
            error: "Name and config are required"
          });
      }

      const saved = await saveTask(name, config);
      if (!saved) {
          return response.status(500).json({
          success: false,
            error: "Failed to save task"
          });
      }

        return response.status(200).json({
        success: true,
        task: { name, config }
        });
    } catch (error) {
      console.error("Error saving task:", error);
        return response.status(500).json({
        success: false,
          error: error.message
        });
    }
    }
  );

  // List all available tasks
  app.get(
    "/agent-task/list",
    // [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
    try {
      const tasks = await listTasks();
        return response.status(200).json({
        success: true,
        tasks
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
        success: false,
          error: error.message
        });
    }
    }
  );

  // Get a specific task by name
  app.get(
    "/agent-task/:name",
    // [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
    try {
        const { name } = request.params;
      const task = await loadTask(name);
      if (!task) {
          return response.status(404).json({
          success: false,
            error: "Task not found"
          });
      }

        return response.status(200).json({
        success: true,
        task: { name, config: task }
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
        success: false,
          error: error.message
        });
    }
    }
  );

  // Run a specific task
  app.post(
    "/agent-task/:name/run",
    // [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
    try {
        const { name } = request.params;
        const { variables = {} } = request.body;

      const agentHandler = new AgentHandler();
      const results = await agentHandler.aibitat.executeFunction("executeAgentTask", {
        taskName: name,
        variables
      });

        return response.status(200).json({
        success: true,
        results: JSON.parse(results)
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
        success: false,
          error: error.message
        });
    }
    }
  );
}

module.exports = { agentTaskEndpoints };
