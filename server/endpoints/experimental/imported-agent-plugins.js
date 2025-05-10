const ImportedPlugin = require("../../utils/agents/imported");
const { reqBody } = require("../../utils/http");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const AccessManager = require("../../utils/AccessManager");

function importedAgentPluginEndpoints(app) {
  if (!app) return;

  app.post(
    "/experimental/agent-plugins/:hubId/toggle",
    [validatedRequest, AccessManager.flexibleAC(["agent.imported.update"])],
    (request, response) => {
      try {
        const { hubId } = request.params;
        const { active } = reqBody(request);
        const updatedConfig = ImportedPlugin.updateImportedPlugin(hubId, {
          active: Boolean(active),
        });
        response.status(200).json(updatedConfig);
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );

  app.post(
    "/experimental/agent-plugins/:hubId/config",
    [validatedRequest, AccessManager.flexibleAC(["agent.imported.update"])],
    (request, response) => {
      try {
        const { hubId } = request.params;
        const { updates } = reqBody(request);
        const updatedConfig = ImportedPlugin.updateImportedPlugin(
          hubId,
          updates
        );
        response.status(200).json(updatedConfig);
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );

  app.delete(
    "/experimental/agent-plugins/:hubId",
    [validatedRequest, AccessManager.flexibleAC(["agent.imported.delete"])],
    async (request, response) => {
      try {
        const { hubId } = request.params;
        const result = ImportedPlugin.deletePlugin(hubId);
        response.status(200).json(result);
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );
}

module.exports = { importedAgentPluginEndpoints };
