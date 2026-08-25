const { LocalAiConnection } = require("../models/localAiConnection");
const { getCustomModels } = require("../utils/helpers/customModels");
const { reqBody, userFromSession } = require("../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

const adminOnly = [validatedRequest, flexUserRoleValid([ROLES.admin])];
const authenticated = [validatedRequest];

function localAiConnectionEndpoints(app) {
  if (!app) return;

  app.get(
    "/local-ai-connections",
    authenticated,
    async (_request, response) => {
      const connections = await LocalAiConnection.getAll();
      return response.status(200).json({ connections });
    }
  );

  app.post("/local-ai-connections", adminOnly, async (request, response) => {
    const user = await userFromSession(request, response);
    const { connection, error } = await LocalAiConnection.create(
      reqBody(request),
      user?.id || null
    );
    return response.status(error ? 400 : 200).json({ connection, error });
  });

  app.put("/local-ai-connections/:id", adminOnly, async (request, response) => {
    const { connection, error } = await LocalAiConnection.update(
      request.params.id,
      reqBody(request)
    );
    return response.status(error ? 400 : 200).json({ connection, error });
  });

  app.delete(
    "/local-ai-connections/:id",
    adminOnly,
    async (request, response) => {
      const result = await LocalAiConnection.delete(request.params.id);
      return response.status(result.success ? 200 : 400).json(result);
    }
  );

  app.get(
    "/local-ai-connections/:id/models",
    authenticated,
    async (request, response) => {
      const connection = await LocalAiConnection.get({
        id: Number(request.params.id),
      });
      if (!connection)
        return response.status(404).json({ models: [], error: "Not found." });

      const { models, error } = await getCustomModels(
        "localai",
        connection.api_key,
        connection.base_url
      );
      return response.status(200).json({ models, error });
    }
  );
}

module.exports = { localAiConnectionEndpoints };
