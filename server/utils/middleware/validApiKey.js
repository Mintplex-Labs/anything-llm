const { ApiKey } = require("../../models/apiKeys");
const { SystemSettings } = require("../../models/systemSettings");

async function validApiKey(request, response, next) {
  const multiUserMode = await SystemSettings.isMultiUserMode();
  response.locals.multiUserMode = multiUserMode;

  const auth = request.header("Authorization");
  const bearerKey = auth ? auth.split(" ")[1] : null;
  if (!bearerKey) {
    response.status(403).json({
      error: "No valid api key found. bearer token ",
    });
    return;
  }

  if (!(await ApiKey.get({ secret: bearerKey }))) {
    response.status(403).json({
      error: "No valid api key found. secret key",
    });
    return;
  }

  next();
}

module.exports = {
  validApiKey,
};
