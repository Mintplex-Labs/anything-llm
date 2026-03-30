const { v4 } = require("uuid");
const { SystemSettings } = require("../models/systemSettings");
const { BrowserExtensionApiKey } = require("../models/browserExtensionApiKey");
const { AgentSkillWhitelist } = require("../models/agentSkillWhitelist");
const { updateENV } = require("./helpers/updateENV");
const { Telemetry } = require("../models/telemetry");
const { EventLogs } = require("../models/eventLogs");

/**
 * Shared side effects when enabling multi-user mode (mirrors POST /system/enable-multi-user).
 * @param {number} adminUserId
 * @returns {Promise<void>}
 */
async function applyMultiUserModeSideEffects(adminUserId) {
  await SystemSettings._updateSettings({
    multi_user_mode: true,
  });
  await BrowserExtensionApiKey.migrateApiKeysToMultiUser(adminUserId);
  await AgentSkillWhitelist.clearSingleUserWhitelist();
  await updateENV(
    {
      JWTSecret: process.env.JWT_SECRET || v4(),
    },
    true
  );
  await Telemetry.sendTelemetry("enabled_multi_user_mode", {
    multiUserMode: true,
  });
  await EventLogs.logEvent("multi_user_mode_enabled", {}, adminUserId);
}

module.exports = {
  applyMultiUserModeSideEffects,
};
