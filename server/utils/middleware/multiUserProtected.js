const { SystemSettings } = require("../../models/systemSettings");

// Middleware check on a public route if the instance is in a valid
// multi-user set up.
async function isMultiUserSetup(_request, response, next) {
  const multiUserMode = await SystemSettings.isMultiUserMode();
  if (!multiUserMode) {
    response.status(403).json({
      error: "Invalid request",
    });
    return;
  }

  next();
  return;
}

module.exports = {
  isMultiUserSetup,
};
