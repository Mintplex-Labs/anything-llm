const { Workspace } = require("../../models/workspace");
const { WorkspaceUser } = require("../../models/workspaceUsers");
const { ROLES } = require("./multiUserProtected");
const { SystemSettings } = require("../../models/systemSettings");
const { userFromSession } = require("../http");

/**
 * Middleware that binds the `manager` role to the workspaces they created
 * or were added to as a member of, blocking cross-workspace mutations.
 *
 * - Admins are unaffected and retain full access.
 * - In single-user mode the check is bypassed entirely.
 * - The target workspace is resolved from the `:slug` request param.
 *
 * Intended to be used on workspace-scoped mutation routes that are gated
 * by `flexUserRoleValid([ROLES.admin, ROLES.manager])`.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @param {NextFunction} next - The next function.
 */
async function workspaceManagerScopeValid(request, response, next) {
  const multiUserMode =
    response.locals?.multiUserMode ?? (await SystemSettings.isMultiUserMode());
  if (!multiUserMode) return next();

  const user =
    response.locals?.user ?? (await userFromSession(request, response));

  // Admins are not scoped to workspace membership.
  if (user?.role === ROLES.admin) return next();

  // Managers may only act on workspaces they created or are a member of.
  if (user?.role === ROLES.manager) {
    const workspace = await Workspace.get({ slug: request.params?.slug });
    if (workspace) {
      const membership = await WorkspaceUser.get({
        user_id: user.id,
        workspace_id: workspace.id,
      });
      if (membership) return next();
    }
  }

  return response.status(403).json({
    success: false,
    error: "Managers may only modify workspaces they are a member of.",
  });
}

module.exports = {
  workspaceManagerScopeValid,
};
