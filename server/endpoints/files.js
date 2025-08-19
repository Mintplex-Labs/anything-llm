const { Document } = require("../models/documents");
const { Workspace } = require("../models/workspace");
const { EventLogs } = require("../models/eventLogs");
const { reqBody } = require("../utils/http");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function filesEndpoints(app) {
  if (!app) return;

  app.post(
    "/files/cross-workspace",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { ops = [] } = reqBody(request);
        const results = [];

        for (const op of ops) {
          const { workspaceDocumentId, fromWorkspaceId, toWorkspaceId, mode } =
            op;

          const document = await Document.get({
            id: Number(workspaceDocumentId),
            workspaceId: Number(fromWorkspaceId),
          });

          if (!document) {
            results.push({
              workspaceDocumentId,
              success: false,
              error: "Document not found",
            });
            continue;
          }

          const toWorkspace = await Workspace._findFirst({
            where: { id: Number(toWorkspaceId) },
          });

          if (!toWorkspace) {
            results.push({
              workspaceDocumentId,
              success: false,
              error: "Destination workspace not found",
            });
            continue;
          }

          await Document.addDocuments(
            toWorkspace,
            [document.docpath],
            request?.user?.id
          );

          if (mode === "move") {
            const fromWorkspace = await Workspace._findFirst({
              where: { id: Number(fromWorkspaceId) },
            });
            if (fromWorkspace) {
              await Document.removeDocuments(
                fromWorkspace,
                [document.docpath],
                request?.user?.id
              );
            }
          }

          await EventLogs.logEvent(
            "cross_workspace_file_operation",
            {
              mode,
              workspaceDocumentId,
              fromWorkspaceId,
              toWorkspaceId,
            },
            request?.user?.id
          );

          results.push({ workspaceDocumentId, success: true, error: null });
        }

        response.status(200).json({ success: true, results });
      } catch (e) {
        console.error(e);
        response.status(500).json({ success: false, error: e.message }).end();
      }
    }
  );
}

module.exports = { filesEndpoints };
