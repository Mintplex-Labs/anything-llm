const { SystemSettings } = require("../../models/systemSettings");

/**
 * Mark the onboarding as completed for legacy users prior to this change where onboarding is now a flag in the DB.
 * This is a legacy patch to ensure that existing users are not redirected to the onboarding page who have been using the app for a while.
 */
async function markOnboarded() {
  try {
    const onboardingStatus = await SystemSettings.isOnboardingComplete();
    if (onboardingStatus === true) return;

    // Check if the server is already onboarded by the old way of checking if the server in any way has been setup.
    // If it is, then we can mark the onboarding as complete in the DB to persist this
    const alreadyOnboarded = await isLegacyOnboarded();
    if (alreadyOnboarded === true) {
      console.log(
        "\x1b[33m[ONBOARDING PATCH]\x1b[0m Legacy instance is already onboarded, marking onboarding as complete. You will not see this message again."
      );
      await SystemSettings.markOnboardingComplete();
      return true;
    }
    return false;
  } catch (e) {
    console.error(
      "\x1b[31m[ONBOARDING PATCH]\x1b[0m Error marking onboarding as complete",
      e.message,
      e
    );
    return false;
  }
}

/**
 * Check if the server is already onboarded by the old way of checking if the server in any way has been setup.
 * @returns {Promise<boolean>}
 */
async function isLegacyOnboarded() {
  // LLM Provider is set, so we can assume onboarding is complete since this is default null in SystemSettings.js
  if (!!process.env.LLM_PROVIDER) return true;

  // Vector DB is set, so we can assume onboarding is complete since this is default null in SystemSettings.js (default is lancedb in frontend)
  if (!!process.env.VECTOR_DB) return true;

  // Check if the AUTH_TOKEN/JWT_SECRET is set, so we can assume onboarding is complete since this is default null in SystemSettings.js
  if (!!process.env.AUTH_TOKEN || !!process.env.JWT_SECRET) return true;

  // Check multi-user mode is enabled, if it is, then they are already using the app.
  if ((await SystemSettings.isMultiUserMode()) === true) return true;
  return false;
}

module.exports = markOnboarded;
