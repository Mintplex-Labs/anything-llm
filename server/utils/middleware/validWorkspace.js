const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
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

async function includeRbacWorkSpaces(request, response, next) {
  const { slug } = request.params;
  const wss = request.query.workspaces; 
  const slugs = wss.split(",");
  const user = await userFromSession(request, response);
  const workspaces = multiUserMode(response)
    ? await Workspace.getWithUserMultipleWS({ name: { in: slugs }, user: user }) // Query multiple workspaces
    : await Workspace.getMultipleWS({ name: { in: slugs } }); // Adjusted query for single user mode

    if (!workspaces || workspaces.length === 0) {
      response.status(404).send("Workspaces do not exist.");
      return;
    }

  response.locals.workspaces = workspaces;
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

  console.log(`'threadSlug value : ${threadSlug}`)

  const thread = await WorkspaceThread.get({
    slug: threadSlug,
    user_id: user?.id || null,
  });
  if (!thread) {
    response.status(404).send("Workspace thread does not exist.");
    return;
  }

  response.locals.workspace = workspace;
  response.locals.thread = thread;
  next();
}

// Will pre-validate and set the workspace AND a thread for a request if the slugs are provided in the URL path.
async function includeRbacWorkSpacesAndThreadSlug(request, response, next) {
  const { slug, threadSlug } = request.params;
  const wss = request.query.workspaces; 
  const slugs = wss.split(",");
  const user = await userFromSession(request, response);
  const workspaces = multiUserMode(response)
    ? await Workspace.getWithUserMultipleWS({ name: { in: slugs }, user: user }) // Query multiple workspaces
    : await Workspace.getMultipleWS({ name: { in: slugs } }); // Adjusted query for single user mode

  if (!workspaces || workspaces.length === 0) {
      response.status(404).send("Workspaces do not exist.");
      return;
    }

  console.log(`'threadSlug value : ${threadSlug}`)

  const thread = await WorkspaceThread.get({
    slug: threadSlug,
    user_id: user?.id || null,
  });
  if (!thread) {
    response.status(404).send("Workspace thread does not exist.");
    return;
  }

  response.locals.workspaces = workspaces;
  response.locals.thread = thread;
  next();
}

module.exports = {
  validWorkspaceSlug,
  validWorkspaceAndThreadSlug,
  includeRbacWorkSpaces,
  includeRbacWorkSpacesAndThreadSlug,
};
