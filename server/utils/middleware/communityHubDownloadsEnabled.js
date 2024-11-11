/**
 * Checks if community hub bundle downloads are enabled. The reason this functionality is disabled
 * by default is that since AgentSkills, Workspaces, and DataConnectors are all imported from the
 * community hub via unzipping a bundle - it would be possible for a malicious user to craft and
 * download a malicious bundle and import it into their own hosted instance. To avoid this, this
 * functionality is disabled by default and must be enabled manually by the system administrator.
 *
 * On hosted systems, this would not be an issue since the user cannot modify this setting, but those
 * who self-host can still unlock this feature manually by setting the environment variable.
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
async function communityHubDownloadsEnabled(_, response, next) {
  if (!("COMMUNITY_HUB_BUNDLE_DOWNLOADS_ENABLED" in process.env)) {
    return response.status(422).json({
      error:
        "Community Hub bundle downloads are not enabled. The system administrator must enable this feature manually to allow this instance to download these types of items.",
    });
  }

  next();
}

module.exports = {
  communityHubDownloadsEnabled,
};
