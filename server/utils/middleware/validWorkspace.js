const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
const { ApiKey } = require("../../models/apiKeys");
const { userFromSession, multiUserMode } = require("../http");

// Will pre-validate and set the workspace for a request if the slug is provided in the URL path.
async function validWorkspaceSlug(request, response, next) {
  const { slug } = request.params;
  const user = await userFromSession(request, response);
  const workspace = multiUserMode(response)
    ? await Workspace.getWithUser(user, { slug })
    : await Workspace.get({ slug });

  if (!workspace) {
    response.status(404).send("Workspace does not exist.");
    return;
  }

  response.locals.workspace = workspace;
  next();
}

// Will pre-validate and set the workspace AND a thread for a request if the slugs are provided in the URL path.
async function validWorkspaceAndThreadSlug(request, response, next) {
  const { slug, threadSlug } = request.params;
  const user = await userFromSession(request, response);
  const workspace = multiUserMode(response)
    ? await Workspace.getWithUser(user, { slug })
    : await Workspace.get({ slug });

  if (!workspace) {
    response.status(404).send("Workspace does not exist.");
    return;
  }

  const thread = await WorkspaceThread.get({
    slug: threadSlug,
    user_id: user?.id || null,
    workspace_id: workspace.id,
  });
  if (!thread) {
    response.status(404).send("Workspace thread does not exist.");
    return;
  }

  response.locals.workspace = workspace;
  response.locals.thread = thread;
  next();
}

/**
 * Developer API counterpart to the session middlewares above. Sets the workspace,
 * and the thread when the route has a `:threadSlug`, once they exist and the
 * api key may access the workspace. API keys act without a session user, so
 * neither lookup is limited to a user.
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {(request: import("express").Request, response: import("express").Response) => Promise<object|null>} findWorkspace
 * @param {string} [notFound] - Error sent when the workspace is not found
 * @returns {Promise<boolean>} false when the response was ended with a 404 or 403
 */
async function setApiKeyWorkspace(
  request,
  response,
  findWorkspace,
  notFound = "Workspace does not exist."
) {
  const workspace = await findWorkspace(request, response);
  if (!workspace) {
    response.status(404).json({ error: notFound });
    return false;
  }

  if (!ApiKey.canAccessWorkspace(response.locals.apiKey, workspace.id)) {
    response.status(403).json({
      error: "This api key is not permitted to access this workspace.",
    });
    return false;
  }
  response.locals.workspace = workspace;

  const { threadSlug } = request.params;
  if (!threadSlug) return true;

  const thread = await WorkspaceThread.get({
    slug: String(threadSlug),
    workspace_id: workspace.id,
  });
  if (!thread) {
    response.status(404).json({ error: "Workspace thread does not exist." });
    return false;
  }

  response.locals.thread = thread;
  return true;
}

module.exports = {
  validWorkspaceSlug,
  validWorkspaceAndThreadSlug,
  setApiKeyWorkspace,
};
