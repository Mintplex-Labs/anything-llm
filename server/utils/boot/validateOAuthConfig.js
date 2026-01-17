/**
 * Validates that all required OAuth environment variables are set
 * when MCP_AUTH_MODE=impersonation is enabled.
 *
 * Required variables:
 * - OAUTH_AUTHORIZATION_ENDPOINT: The OIDC provider's authorization endpoint
 * - OAUTH_TOKEN_ENDPOINT: The OIDC provider's token endpoint
 * - OAUTH_CLIENT_ID: The OAuth client ID
 * - OAUTH_LOGIN_REDIRECT_URI: The callback URI for the OAuth flow
 *
 * Optional variables:
 * - OAUTH_CLIENT_SECRET: The OAuth client secret (required for confidential clients, optional with PKCE)
 * - OAUTH_LOGOUT_ENDPOINT: The OIDC provider's logout endpoint (recommended for SSO logout)
 *
 * @throws {Error} If impersonation mode is enabled but required OAuth vars are missing
 */
function validateOAuthConfig() {
  if (process.env.MCP_AUTH_MODE !== "impersonation") {
    return; // OAuth not enabled, skip validation
  }

  // PKCE is always used, so client_secret is optional (but recommended for confidential clients)
  const requiredVars = [
    "OAUTH_AUTHORIZATION_ENDPOINT",
    "OAUTH_TOKEN_ENDPOINT",
    "OAUTH_CLIENT_ID",
    "OAUTH_LOGIN_REDIRECT_URI",
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName] || process.env[varName].trim() === ""
  );

  if (missingVars.length > 0) {
    const errorMessage = `
[OAuth Configuration Error]
MCP_AUTH_MODE=impersonation is enabled but the following required environment variables are missing:
${missingVars.map((v) => `  - ${v}`).join("\n")}

Please set these variables to use OAuth impersonation mode.
See documentation for details on OAuth/OIDC configuration.
`;
    console.error("\x1b[31m" + errorMessage + "\x1b[0m");
    throw new Error(`Missing required OAuth configuration: ${missingVars.join(", ")}`);
  }

  // Validate URLs are valid
  const urlVars = [
    "OAUTH_AUTHORIZATION_ENDPOINT",
    "OAUTH_TOKEN_ENDPOINT",
    "OAUTH_LOGIN_REDIRECT_URI",
  ];

  for (const varName of urlVars) {
    try {
      new URL(process.env[varName]);
    } catch (e) {
      const errorMessage = `
[OAuth Configuration Error]
${varName} is not a valid URL: ${process.env[varName]}
`;
      console.error("\x1b[31m" + errorMessage + "\x1b[0m");
      throw new Error(`Invalid OAuth URL for ${varName}`);
    }
  }

  // Validate OAUTH_LOGOUT_ENDPOINT if provided
  if (process.env.OAUTH_LOGOUT_ENDPOINT) {
    try {
      new URL(process.env.OAUTH_LOGOUT_ENDPOINT);
    } catch (e) {
      console.warn(
        `\x1b[33m[OAuth Warning]\x1b[0m OAUTH_LOGOUT_ENDPOINT is not a valid URL. Logout may not work correctly.`
      );
    }
  } else {
    console.warn(
      `\x1b[33m[OAuth Warning]\x1b[0m OAUTH_LOGOUT_ENDPOINT is not set. Users will be logged out of ALLM only, not the OIDC provider.`
    );
  }

  // Warn if client_secret is not set (PKCE still works, but secret adds security for server apps)
  if (!process.env.OAUTH_CLIENT_SECRET) {
    console.warn(
      `\x1b[33m[OAuth Warning]\x1b[0m OAUTH_CLIENT_SECRET is not set. Using PKCE-only authentication (public client mode).`
    );
  }

  console.log(
    `\x1b[32m[OAuth]\x1b[0m OAuth impersonation mode enabled and configured.`
  );
}

module.exports = { validateOAuthConfig };
