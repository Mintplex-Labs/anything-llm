const { userFromSession } = require("../utils/http");
const {
  getSwarmsyOnboardingStatus,
} = require("../utils/swarmsy/onboardingStatus");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");

async function swarmsyOnboardingStatus(request, response) {
  try {
    const user = await userFromSession(request, response);
    const status = await getSwarmsyOnboardingStatus({ user });
    return response.status(200).json(status);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to resolve SWARMSY onboarding status.",
    });
  }
}

function swarmsyEndpoints(app) {
  if (!app) return;

  app.get(
    "/swarmsy/onboarding/status",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyOnboardingStatus
  );
}

module.exports = {
  swarmsyEndpoints,
  swarmsyOnboardingStatus,
};
