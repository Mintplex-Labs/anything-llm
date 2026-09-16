const { reqBody } = require("../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  GenericOpenAiConnections,
} = require("../utils/llm/genericOpenAiConnections");

function genericOpenAiConnectionEndpoints(app) {
  if (!app) return;

  app.get(
    "/generic-openai/connections",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const manager = new GenericOpenAiConnections();
        return response.status(200).json({
          success: true,
          connections: manager.listSummaries(),
          activeConnectionId: manager.getActiveConnectionId(),
          error: null,
        });
      } catch (error) {
        console.error("Error listing Generic OpenAI connections:", error);
        return response.status(500).json({
          success: false,
          connections: [],
          activeConnectionId: null,
          error: error.message,
        });
      }
    }
  );

  app.post(
    "/generic-openai/connections",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const body = reqBody(request);
        const manager = new GenericOpenAiConnections();
        const { connection, error } = manager.upsertConnection(body);
        if (error) {
          return response.status(400).json({ success: false, error });
        }

        const { error: activateError } = await manager.activateConnection(
          connection.id
        );
        if (activateError) {
          return response.status(400).json({
            success: false,
            error: activateError,
          });
        }

        return response.status(200).json({
          success: true,
          connection: manager
            .listSummaries()
            .find((c) => c.id === connection.id),
          connections: manager.listSummaries(),
          activeConnectionId: manager.getActiveConnectionId(),
          error: null,
        });
      } catch (error) {
        console.error("Error saving Generic OpenAI connection:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  app.post(
    "/generic-openai/connections/activate",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = reqBody(request);
        const manager = new GenericOpenAiConnections();
        const { success, error } = await manager.activateConnection(id);
        if (!success) {
          return response.status(400).json({ success: false, error });
        }

        return response.status(200).json({
          success: true,
          connections: manager.listSummaries(),
          activeConnectionId: manager.getActiveConnectionId(),
          error: null,
        });
      } catch (error) {
        console.error("Error activating Generic OpenAI connection:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  app.post(
    "/generic-openai/connections/delete",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = reqBody(request);
        const manager = new GenericOpenAiConnections();
        const { success, error } = manager.deleteConnection(id);
        if (!success) {
          return response.status(400).json({ success: false, error });
        }

        return response.status(200).json({
          success: true,
          connections: manager.listSummaries(),
          activeConnectionId: manager.getActiveConnectionId(),
          error: null,
        });
      } catch (error) {
        console.error("Error deleting Generic OpenAI connection:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );
}

module.exports = { genericOpenAiConnectionEndpoints };
