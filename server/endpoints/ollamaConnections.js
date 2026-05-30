const { OllamaConnection } = require("../models/ollamaConnection");
const { reqBody } = require("../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function ollamaConnectionEndpoints(app) {
  if (!app) return;

  app.get(
    "/ollama-connections",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const connections = await OllamaConnection.where({});
        const withCounts = await Promise.all(
          connections.map(async (c) => ({
            ...c,
            workspaceCount: await OllamaConnection.workspaceCount(c.id),
          }))
        );
        response.status(200).json({ connections: withCounts });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.post(
    "/ollama-connections/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const data = reqBody(request);
        const { connection, error } = await OllamaConnection.create(data);
        if (error) return response.status(400).json({ connection, error });
        return response.status(200).json({ connection });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.put(
    "/ollama-connections/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const data = reqBody(request);
        const { connection, error } = await OllamaConnection.update(
          Number(id),
          data
        );
        if (error) return response.status(400).json({ connection, error });
        return response.status(200).json({ connection });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );

  app.delete(
    "/ollama-connections/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const success = await OllamaConnection.delete(Number(id));
        if (!success)
          return response
            .status(400)
            .json({ success: false, error: "Failed to delete connection." });
        return response.status(200).json({ success: true });
      } catch (e) {
        console.error(e);
        response.sendStatus(500);
      }
    }
  );
}

module.exports = { ollamaConnectionEndpoints };
