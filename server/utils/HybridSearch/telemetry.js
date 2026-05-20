const { config } = require("./config");
const { logger } = require("./logger");

/**
 * Telemetry adapter for HybridSearch.
 *
 * Routes structured events to the existing Telemetry model when enabled.
 * Falls back to a debug log line when telemetry is disabled (test, or
 * HYBRID_SEARCH_TELEMETRY=false). Importing the Telemetry model lazily
 * avoids a circular import and a hard dependency for unit tests.
 */
async function emit(event, properties = {}) {
  if (!config.telemetryEnabled) {
    logger.debug(`telemetry skipped: ${event}`, properties);
    return;
  }
  try {
    const { Telemetry } = require("../../models/telemetry");
    await Telemetry.sendTelemetry(event, properties, null, true);
  } catch (e) {
    // Never let telemetry failures impact a user query.
    logger.warn("telemetry emit failed", { event, error: e.message });
  }
}

module.exports = { emit };
