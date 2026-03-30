const prisma = require("../prisma");

/**
 * Workspace id 1 if present, else lowest id workspace.
 * Optional: set AZURE_AD_DEFAULT_WORKSPACE_ID to a numeric id (must exist).
 * @returns {Promise<number|null>}
 */
async function getDefaultWorkspaceIdForProvisioning() {
  const raw = process.env.AZURE_AD_DEFAULT_WORKSPACE_ID;
  if (raw && /^\d+$/.test(String(raw).trim())) {
    const overrideId = parseInt(String(raw).trim(), 10);
    const overrideWs = await prisma.workspaces.findUnique({
      where: { id: overrideId },
    });
    if (overrideWs) return overrideId;
  }

  const byId = await prisma.workspaces.findUnique({
    where: { id: 1 },
  });
  if (byId) return 1;
  const first = await prisma.workspaces.findFirst({
    orderBy: { id: "asc" },
  });
  return first ? first.id : null;
}

module.exports = { getDefaultWorkspaceIdForProvisioning };
