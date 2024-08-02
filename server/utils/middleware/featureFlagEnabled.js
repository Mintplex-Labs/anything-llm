const { SystemSettings } = require("../../models/systemSettings");

// Explicitly check that a specific feature flag is enabled.
// This should match the key in the SystemSetting label.
function featureFlagEnabled(featureFlagKey = null) {
  return async (_, response, next) => {
    if (!featureFlagKey) return response.sendStatus(401).end();

    const flagValue = (
      await SystemSettings.get({ label: String(featureFlagKey) })
    )?.value;
    if (!flagValue) return response.sendStatus(401).end();

    if (flagValue === "enabled") {
      next();
      return;
    }

    return response.sendStatus(401).end();
  };
}
module.exports = {
  featureFlagEnabled,
};
