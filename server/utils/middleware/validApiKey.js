const { ApiKey } = require("../../models/apiKeys");
const { SystemSettings } = require("../../models/systemSettings");
const { setApiKeyWorkspace } = require("./validWorkspace");
const {
  WORKSPACE_LOOKUPS,
  routeRule,
  keyPermitted,
  setTargetUser,
} = require("./apiKeyScopes");

/**
 * Validates the api key and that its scopes permit the matched route. The
 * route is identified by its pattern (`request.route.path`) since Express
 * matches the request path case-insensitively and with optional trailing slashes.
 */
async function validApiKey(request, response, next) {
  const multiUserMode = await SystemSettings.isMultiUserMode();
  response.locals.multiUserMode = multiUserMode;

  const auth = request.header("Authorization");
  const bearerKey = auth ? auth.split(" ")[1] : null;
  if (!bearerKey) {
    response.status(403).json({
      error: "No valid api key found.",
    });
    return;
  }

  const apiKey = await ApiKey.get({ secret: bearerKey });
  if (!apiKey) {
    response.status(403).json({
      error: "No valid api key found.",
    });
    return;
  }

  response.locals.apiKey = apiKey;

  const rule = routeRule(request);
  if (!keyPermitted(apiKey, rule))
    return response.status(403).json({
      error: "This api key's scopes do not permit access to this endpoint.",
    });

  const underWorkspaceSlug = String(request.route?.path).startsWith(
    "/v1/workspace/:slug"
  );
  const findWorkspace = underWorkspaceSlug
    ? WORKSPACE_LOOKUPS.slug
    : rule?.workspace;
  if (findWorkspace) {
    const workspaceSet = await setApiKeyWorkspace(
      request,
      response,
      findWorkspace,
      rule?.notFound
    );
    if (!workspaceSet) return;
  }

  if (rule?.user) {
    const userSet = await setTargetUser(request, response);
    if (!userSet) return;
  }
  next();
}

module.exports = {
  validApiKey,
};
