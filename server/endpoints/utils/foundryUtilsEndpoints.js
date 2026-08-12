const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { reqBody } = require("../../utils/http");
const FoundryModels = require("../../utils/AiProviders/foundry/models");

function foundryUtilsEndpoints(app) {
  if (!app) return;

  /**
   * Report what this host can do with Foundry. Managing models requires either
   * the local `foundry` CLI or a pre-0.10 daemon that still serves the REST
   * management routes; a container talking to a 0.10+ daemon has neither. The
   * UI uses this to decide whether to offer install/uninstall actions.
   */
  app.post(
    "/utils/foundry/capabilities",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { basePath = null } = reqBody(request);
        const capabilities = await FoundryModels.resolveSource(
          basePath || process.env.FOUNDRY_BASE_PATH
        );
        return response.status(200).json(capabilities);
      } catch (e) {
        console.error(e);
        return response
          .status(200)
          .json({ source: "openai", canManage: false, cliVersion: null });
      }
    }
  );

  app.post(
    "/utils/foundry/download-model",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { modelId, basePath = null } = reqBody(request);
        if (!modelId) throw new Error("modelId is required");

        response.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });

        const { success, error } = await FoundryModels.downloadModel(
          modelId,
          (percentage) =>
            response.write(
              `data: ${JSON.stringify({
                type: "progress",
                percentage,
                message: `Downloading ${modelId}...`,
              })}\n\n`
            ),
          basePath || process.env.FOUNDRY_BASE_PATH
        );

        if (!success)
          throw new Error(
            error || "An error occurred while downloading the model"
          );

        response.write(
          `data: ${JSON.stringify({
            type: "success",
            percentage: 100,
            message: "Model downloaded successfully",
          })}\n\n`
        );
      } catch (e) {
        console.error(e);
        response.write(
          `data: ${JSON.stringify({ type: "error", message: e.message })}\n\n`
        );
      } finally {
        response.end();
      }
    }
  );

  app.post(
    "/utils/foundry/delete-model",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { modelId, basePath = null } = reqBody(request);
        if (!modelId)
          return response
            .status(400)
            .json({ success: false, error: "modelId is required" });

        const { success, error } = await FoundryModels.deleteModel(
          modelId,
          basePath || process.env.FOUNDRY_BASE_PATH
        );
        if (!success)
          return response.status(500).json({
            success: false,
            error: error || "An error occurred while deleting the model",
          });

        return response
          .status(200)
          .json({ success: true, message: `Deleted model: ${modelId}` });
      } catch (e) {
        console.error(e);
        return response.status(500).json({
          success: false,
          error: e.message || "An error occurred while deleting the model",
        });
      }
    }
  );
}

module.exports = { foundryUtilsEndpoints };
