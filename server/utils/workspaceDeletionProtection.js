function isWorkspaceDeletionProtected() {
  return "WORKSPACE_DELETION_PROTECTION" in process.env;
}

function workspaceDeletionProtection(_request, response, next) {
  if (!isWorkspaceDeletionProtected()) return next();

  return response.status(403).json({
    success: false,
    error: "Workspace deletion is protected by the system administrator.",
  });
}

module.exports = {
  isWorkspaceDeletionProtected,
  workspaceDeletionProtection,
};
