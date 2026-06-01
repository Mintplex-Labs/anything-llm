/**
 * A simple middleware that blocks workspace deletion routes when the
 * `WORKSPACE_DELETION_PROTECTION` environment variable is set AT ALL.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @param {NextFunction} next - The next function.
 */
function workspaceDeletionProtection(_request, response, next) {
  if (!("WORKSPACE_DELETION_PROTECTION" in process.env)) return next();
  return response.status(403).json({
    success: false,
    error: "Workspace deletion is blocked by the system administrator.",
  });
}

module.exports = {
  workspaceDeletionProtection,
};
