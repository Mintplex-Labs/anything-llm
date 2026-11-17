const { ApiKey } = require("../../models/apiKeys");
const { SystemSettings } = require("../../models/systemSettings");
const SCOPES = ApiKey.scopes;

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
  next();
}

/**
 * Limits a route to full access keys and keys with one of the allowed scopes.
 * Only the `:slug` param is checked against a workspace key's workspaces, so
 * handlers that take a workspace any other way must check it themselves.
 * @param {string[]} allowedScopes
 * @returns {function}
 */
function apiKeyScope(allowedScopes = []) {
  return async (request, response, next) => {
    const apiKey = response.locals.apiKey;
    if (ApiKey.isFullAccess(apiKey)) return next();
    if (!apiKey || !allowedScopes.includes(apiKey.scope))
      return response.status(403).json({
        error: "This api key's scope does not permit access to this endpoint.",
      });

    const { slug } = request.params;
    if (apiKey.scope !== SCOPES.workspace || !slug) return next();

    if (!(await ApiKey.canAccessWorkspaceSlug(apiKey, slug)))
      return response.status(403).json({
        error: "This api key's scope does not permit access to this workspace.",
      });
    next();
  };
}

module.exports = {
  SCOPES,
  validApiKey,
  apiKeyScope,
};
