const { FileTypeDefault } = require("../../models/fileTypeDefault");
const { Document } = require("../../models/documents");
const { EventLogs } = require("../../models/eventLogs");
const { SystemSettings } = require("../../models/systemSettings");
const { Telemetry } = require("../../models/telemetry");
const { reqBody } = require("../../utils/http");
const {
  featureFlagEnabled,
} = require("../../utils/middleware/featureFlagEnabled");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { validWorkspaceSlug } = require("../../utils/middleware/validWorkspace");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");

function fileTypeDefaultEndpoints(app) {
  if (!app) return;

  app.post(
    "/experimental/toggle-file-type-default",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { updatedStatus = false } = reqBody(request);
        const newStatus =
          SystemSettings.validations.experimental_file_type_default(updatedStatus);
        const currentStatus =
          (await SystemSettings.get({ label: "experimental_file_type_default" }))
            ?.value || "disabled";
        if (currentStatus === newStatus)
          return response
            .status(200)
            .json({ fileTypeDefaultEnabled: newStatus === "enabled" });

        // Already validated earlier - so can hot update.
        await SystemSettings._updateSettings({
          experimental_file_type_default: newStatus,
        });
        if (newStatus === "enabled") {
          await Telemetry.sendTelemetry("experimental_feature_enabled", {
            feature: "file_type_default",
          });
          await EventLogs.logEvent("experimental_feature_enabled", {
            feature: "file_type_default",
          });
        }

        response.status(200).json({ fileTypeDefaultEnabled: newStatus === "enabled" });
      } catch (e) {
        console.error(e);
        response.status(500).end();
      }
    }
  );
}

module.exports = { fileTypeDefaultEndpoints };
