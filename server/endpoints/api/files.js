const { Document } = require("../../models/documents");
const { Workspace } = require("../../models/workspace");
const { EventLogs } = require("../../models/eventLogs");
const { reqBody } = require("../../utils/http");
const { validApiKey } = require("../../utils/middleware/validApiKey");

function apiFilesEndpoints(app) {
  if (!app) return;

  app.post(
    "/v1/files/cross-workspace",
    [validApiKey],
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

          await Document.addDocuments(toWorkspace, [document.docpath], null);

          if (mode === "move") {
            const fromWorkspace = await Workspace._findFirst({
              where: { id: Number(fromWorkspaceId) },
            });
            if (fromWorkspace) {
              await Document.removeDocuments(
                fromWorkspace,
                [document.docpath],
                null
              );
            }
          }

          await EventLogs.logEvent("api_cross_workspace_file_operation", {
            mode,
            workspaceDocumentId,
            fromWorkspaceId,
            toWorkspaceId,
          });

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

module.exports = { apiFilesEndpoints };
