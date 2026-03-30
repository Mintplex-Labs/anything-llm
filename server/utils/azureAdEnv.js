/**
 * Returns true when Azure AD integration is configured via environment variables.
 * Used for isMultiUserMode() OR and boot-time multi-user + admin bootstrap.
 * @returns {boolean}
 */
function azureAdEnvironmentConfigured() {
  if (String(process.env.AZURE_AD_ENABLED || "").toLowerCase() === "false") {
    return false;
  }
  return !!(
    process.env.AZURE_AD_TENANT_ID &&
    process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_REDIRECT_URI
  );
}

module.exports = {
  azureAdEnvironmentConfigured,
};
