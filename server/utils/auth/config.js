/**
 * External Authentication Configuration
 *
 * Handles configuration for Keystone Core API token introspection
 * for user authentication (non-admin endpoints only).
 */
// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExternalAuthConfig = {
  enabled: process.env.EXTERNAL_AUTH_ENABLED === "true",
  mode: process.env.EXTERNAL_AUTH_MODE || "introspect",
  // Base URL of Keystone Core API (e.g., http://localhost:3000)
  baseUrl: process.env.EXTERNAL_AUTH_API_URL,
  // Full introspection endpoint URL (constructed from baseUrl + /api/v1/auth/introspect)
  get introspectionUrl() {
    if (!this.baseUrl) return null;
    // Ensure baseUrl doesn't end with /
    const base = this.baseUrl.replace(/\/$/, "");
    return `${base}/api/v1/auth/introspect`;
  },
  issuer: process.env.EXTERNAL_AUTH_ISSUER,
  audience: process.env.EXTERNAL_AUTH_AUDIENCE,
  serviceKey: process.env.EXTERNAL_API_SERVICE_KEY,
  cacheTTL: parseInt(
    process.env.EXTERNAL_AUTH_INTROSPECTION_CACHE_TTL || "30",
    10
  ),
  requireHTTPS:
    process.env.NODE_ENV === "production" &&
    process.env.EXTERNAL_AUTH_REQUIRE_HTTPS !== "false",
};

// Validate configuration
if (ExternalAuthConfig.enabled) {
  if (!ExternalAuthConfig.baseUrl) {
    throw new Error(
      "EXTERNAL_AUTH_API_URL required when EXTERNAL_AUTH_ENABLED=true"
    );
  }

  if (
    ExternalAuthConfig.mode === "introspect" &&
    !ExternalAuthConfig.serviceKey
  ) {
    throw new Error(
      "EXTERNAL_API_SERVICE_KEY required when EXTERNAL_AUTH_MODE=introspect"
    );
  }

  if (ExternalAuthConfig.requireHTTPS) {
    const url = new URL(ExternalAuthConfig.baseUrl);
    if (url.protocol !== "https:") {
      throw new Error("EXTERNAL_AUTH_API_URL must use HTTPS in production");
    }
  }
}

module.exports = { ExternalAuthConfig };
