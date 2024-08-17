const {
  BrowserExtensionApiKey,
} = require("../../models/browserExtensionApiKey");
const { SystemSettings } = require("../../models/systemSettings");

async function validBrowserExtensionApiKey(request, response, next) {
  const multiUserMode = await SystemSettings.isMultiUserMode();
  response.locals.multiUserMode = multiUserMode;

  const auth = request.header("Authorization");
  const bearerKey = auth ? auth.split(" ")[1] : null;
  if (!bearerKey) {
    response.status(403).json({
      error: "No valid API key found.",
    });
    return;
  }

  const apiKey = await BrowserExtensionApiKey.validate(bearerKey);
  if (!apiKey) {
    response.status(403).json({
      error: "No valid API key found.",
    });
    return;
  }

  if (!apiKey.accepted) {
    response.status(401).json({
      error: "API key not yet accepted.",
      verificationCode: apiKey.verificationCode,
    });
    return;
  }

  next();
}

module.exports = { validBrowserExtensionApiKey };
