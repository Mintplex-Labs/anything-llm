const { SystemSettings } = require("../../models/systemSettings");

/**
 * Checks if simple SSO is enabled for issuance of temporary auth tokens.
 * Note: This middleware must be called after `validApiKey`.
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
async function simpleSSOEnabled(_, response, next) {
  if (!("SIMPLE_SSO_ENABLED" in process.env)) {
    return response
      .status(403)
      .send(
        "Simple SSO is not enabled. It must be enabled to validate or issue temporary auth tokens."
      );
  }

  // If the multi-user mode response local is not set, we need to check if it's enabled.
  if (!("multiUserMode" in response.locals)) {
    const multiUserMode = await SystemSettings.isMultiUserMode();
    response.locals.multiUserMode = multiUserMode;
  }

  if (!response.locals.multiUserMode) {
    return response
      .status(403)
      .send(
        "Multi-User mode is not enabled. It must be enabled to use Simple SSO."
      );
  }

  next();
}

module.exports = {
  simpleSSOEnabled,
};
