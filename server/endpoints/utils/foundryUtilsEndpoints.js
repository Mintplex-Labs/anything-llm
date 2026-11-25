const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { reqBody } = require("../../utils/http");
const FoundryModels = require("../../utils/AiProviders/foundry/models");

function foundryUtilsEndpoints(app) {
  if (!app) return;

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
          .json({ source: "openai", canManage: false });
      }
    }
  );
}

module.exports = { foundryUtilsEndpoints };
