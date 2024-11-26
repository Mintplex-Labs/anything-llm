const { CommunityHub } = require("../../models/communityHub");
const { reqBody } = require("../http");

/**
 * ### Must be called after `communityHubItem`
 * Checks if community hub bundle downloads are enabled. The reason this functionality is disabled
 * by default is that since AgentSkills, Workspaces, and DataConnectors are all imported from the
 * community hub via unzipping a bundle - it would be possible for a malicious user to craft and
 * download a malicious bundle and import it into their own hosted instance. To avoid this, this
 * functionality is disabled by default and must be enabled manually by the system administrator.
 *
 * On hosted systems, this would not be an issue since the user cannot modify this setting, but those
 * who self-host can still unlock this feature manually by setting the environment variable
 * which would require someone who likely has the capacity to understand the risks and the
 * implications of importing unverified items that can run code on their system, container, or instance.
 * @see {@link https://docs.anythingllm.com/docs/community-hub/import}
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
function communityHubDownloadsEnabled(request, response, next) {
  if (!("COMMUNITY_HUB_BUNDLE_DOWNLOADS_ENABLED" in process.env)) {
    return response.status(422).json({
      error:
        "Community Hub bundle downloads are not enabled. The system administrator must enable this feature manually to allow this instance to download these types of items. See https://docs.anythingllm.com/configuration#anythingllm-hub-agent-skills",
    });
  }

  // If the admin specifically did not set the system to `allow_all` then downloads are limited to verified items or private items only.
  // This is to prevent users from downloading unverified items and importing them into their own instance without understanding the risks.
  const item = response.locals.bundleItem;
  if (
    !item.verified &&
    item.visibility !== "private" &&
    process.env.COMMUNITY_HUB_BUNDLE_DOWNLOADS_ENABLED !== "allow_all"
  ) {
    return response.status(422).json({
      error:
        "Community hub bundle downloads are limited to verified public items or private team items only. Please contact the system administrator to review or modify this setting. See https://docs.anythingllm.com/configuration#anythingllm-hub-agent-skills",
    });
  }
  next();
}

/**
 * Fetch the bundle item from the community hub.
 * Sets `response.locals.bundleItem` and `response.locals.bundleUrl`.
 */
async function communityHubItem(request, response, next) {
  const { importId } = reqBody(request);
  if (!importId)
    return response.status(500).json({
      success: false,
      error: "Import ID is required",
    });

  const {
    url,
    item,
    error: fetchError,
  } = await CommunityHub.getBundleItem(importId);
  if (fetchError)
    return response.status(500).json({
      success: false,
      error: fetchError,
    });

  response.locals.bundleItem = item;
  response.locals.bundleUrl = url;
  next();
}

module.exports = {
  communityHubItem,
  communityHubDownloadsEnabled,
};
