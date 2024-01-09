const { getGitVersion } = require("../../endpoints/utils");
const { Telemetry } = require("../../models/telemetry");

// Telemetry is anonymized and your data is never read. This can be disabled by setting
// DISABLE_TELEMETRY=true in the `.env` of however you setup. Telemetry helps us determine use
// of how AnythingLLM is used and how to improve this product!
// You can see all Telemetry events by ctrl+f `Telemetry.sendEvent` calls to verify this claim.
async function setupTelemetry() {
  if (process.env.DISABLE_TELEMETRY === "true") {
    console.log(
      `\x1b[31m[TELEMETRY DISABLED]\x1b[0m Telemetry is marked as disabled - no events will send. Telemetry helps Mintplex Labs Inc improve AnythingLLM.`
    );
    return true;
  }

  if (Telemetry.isDev()) {
    console.log(
      `\x1b[33m[TELEMETRY STUBBED]\x1b[0m Anonymous Telemetry stubbed in development.`
    );
    return;
  }

  console.log(
    `\x1b[32m[TELEMETRY ENABLED]\x1b[0m Anonymous Telemetry enabled. Telemetry helps Mintplex Labs Inc improve AnythingLLM.`
  );
  await Telemetry.findOrCreateId();
  await Telemetry.sendTelemetry("server_boot", {
    commit: getGitVersion(),
  });
  return;
}

module.exports = setupTelemetry;
