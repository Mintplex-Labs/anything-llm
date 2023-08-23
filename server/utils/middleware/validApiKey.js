const { SystemSettings } = require("../../models/systemSettings");

async function validApiKey(request, response, next) {
  const multiUserMode = await SystemSettings.isMultiUserMode();
  response.locals.multiUserMode = multiUserMode;

  // Check the API Key is valid
  // TODO

  next();
}

module.exports = {
  validApiKey,
};
