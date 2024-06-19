const chalk = require("chalk");
const { getGitVersion } = require("../../endpoints/utils");
const { Telemetry } = require("../../models/telemetry");
const logger = require("../logger");

// Telemetry is anonymized and your data is never read. This can be disabled by setting
// DISABLE_TELEMETRY=true in the `.env` of however you setup. Telemetry helps us determine use
// of how AnythingLLM is used and how to improve this product!
// You can see all Telemetry events by ctrl+f `Telemetry.sendEvent` calls to verify this claim.
async function setupTelemetry() {
  if (process.env.DISABLE_TELEMETRY === "true") {
    logger.info(
      chalk.red(
        "Telemetry is marked as disabled - no events will send. Telemetry helps Mintplex Labs Inc improve AnythingLLM."
      ),
      {
        origin: "TELEMETRY DISABLED",
      }
    );
    return true;
  }

  if (Telemetry.isDev()) {
    logger.info(
      chalk.yellow(
        "Telemetry is marked as stubbed in development - no events will send. Telemetry helps Mintplex Labs Inc improve AnythingLLM."
      ),
      {
        origin: "TELEMETRY STUBBED",
      }
    );
    return;
  }
  logger.info(
    chalk.green(
      "Anonymous Telemetry enabled. Telemetry helps Mintplex Labs Inc improve AnythingLLM."
    ),
    {
      origin: "TELEMETRY ENABLED",
    }
  );
  await Telemetry.findOrCreateId();
  await Telemetry.sendTelemetry("server_boot", {
    commit: getGitVersion(),
  });
  return;
}

module.exports = setupTelemetry;
