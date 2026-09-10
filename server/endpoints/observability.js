const { SystemSettings } = require("../models/systemSettings");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { reqBody, userFromSession } = require("../utils/http");
const { EventLogs } = require("../models/eventLogs");
const { Observability } = require("../utils/observability");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");

function observabilityEndpoints(app) {
  if (!app) return;

  app.get(
    "/observability/settings",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_, response) => {
      try {
        const { provider, config } =
          await SystemSettings.observabilitySettings();
        response.status(200).json({ success: true, provider, config });
      } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: error.message });
      }
    }
  );

  app.post(
    "/observability/settings",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { provider = null, config = {} } = reqBody(request);
        const result = await SystemSettings.updateSettings({
          observability_provider: provider,
          observability_config: config,
        });
        if (result.error) throw new Error(result.error);

        Observability.reset();
        const user = await userFromSession(request, response);
        await EventLogs.logEvent(
          "observability_settings_updated",
          { provider },
          user?.id
        );
        return response.status(200).json({ success: true, error: null });
      } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: error.message });
      }
    }
  );
}

module.exports = { observabilityEndpoints };
