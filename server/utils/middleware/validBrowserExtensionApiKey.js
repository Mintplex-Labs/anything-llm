const {
  BrowserExtensionApiKey,
} = require("../../models/browserExtensionApiKey");
const { SystemSettings } = require("../../models/systemSettings");
const { User } = require("../../models/user");

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

  if (multiUserMode) {
    const user = await User.get({ id: apiKey.user_id });
    if (!user) {
      response.status(403).json({
        error: "User not found.",
      });
      return;
    }

    if (user.suspended) {
      response.status(401).json({
        error: "User is suspended from system",
      });
      return;
    }

    response.locals.user = user;
  }

  response.locals.apiKey = apiKey;
  next();
}

module.exports = { validBrowserExtensionApiKey };
