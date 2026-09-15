const { Domain } = require("@larksuiteoapi/node-sdk");

const ERROR_CATEGORIES = new Set([
  "format_error",
  "target_revoked",
  "rate_limited",
  "permission_denied",
  "upload_failed",
  "ssrf_blocked",
  "send_timeout",
  "not_connected",
  "unknown",
]);

function domainForPlatform(platform) {
  if (platform === "lark") return Domain.Lark;
  if (platform === "feishu") return Domain.Feishu;
  throw new Error("Unsupported Lark platform");
}

function sanitizedError(error) {
  return {
    category: ERROR_CATEGORIES.has(error?.code) ? error.code : "unknown",
    timestamp: new Date().toISOString(),
  };
}

function safeLarkConfig(connector, service) {
  const config = connector?.config || {};
  const status = service?.status || {};
  const error = status.last_error;
  const validError =
    ERROR_CATEGORIES.has(error?.category) &&
    typeof error?.timestamp === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(error.timestamp);
  return {
    platform: config.platform || "lark",
    app_id: config.app_id || "",
    has_app_secret: Boolean(config.app_secret),
    bot_name: status.bot_name || config.bot_name || null,
    bot_open_id: status.bot_open_id || config.bot_open_id || null,
    default_workspace: config.default_workspace || null,
    attachment_size_limit: config.attachment_size_limit ?? null,
    active: Boolean(connector?.active),
    connected: status.connected === true,
    connection_state: status.connection_state || "disconnected",
    last_error: validError
      ? { category: error.category, timestamp: error.timestamp }
      : null,
  };
}

module.exports = { domainForPlatform, safeLarkConfig, sanitizedError };
