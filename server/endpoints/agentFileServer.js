const fs = require("fs");
const {
  userFromSession,
  multiUserMode,
  safeJsonParse,
} = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { WorkspaceChats } = require("../models/workspaceChats");
const { Workspace } = require("../models/workspace");
const { ScheduledJobRun } = require("../models/scheduledJobRun");
const createFilesLib = require("../utils/agents/aibitat/plugins/create-files/lib");
const {
  renderToPdf,
  isPreviewable,
} = require("../utils/files/documentPreview");
const { Telemetry } = require("../models/telemetry");

/**
 * Endpoints for serving agent-generated files (PPTX, etc.) with authentication
 * and ownership validation.
 */
function agentFileServerEndpoints(app) {
  if (!app) return;

  /**
   * Download a generated file by its storage filename.
   * Validates that the requesting user has access to the workspace
   * where the file was generated.
   */
  app.get(
    "/agent-skills/generated-files/:filename",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { filename } = request.params;
        if (!filename)
          return response.status(400).json({ error: "Filename is required" });

        // Validate filename format
        const parsed = createFilesLib.parseFilename(filename);
        if (!parsed) {
          return response
            .status(400)
            .json({ error: "Invalid filename format" });
        }

        // Find a chat or scheduled job run that references this file
        const fileSource = await findFileSource(filename, {
          user,
          isMultiUser: multiUserMode(response),
        });

        if (!fileSource) {
          return response.status(404).json({
            error: "File not found or access denied",
          });
        }

        // Retrieve the file from storage
        const fileData = await createFilesLib.getGeneratedFile(filename);
        if (!fileData) {
          return response
            .status(404)
            .json({ error: "File not found in storage" });
        }

        // Get mime type and set headers for download
        const mimeType = createFilesLib.getMimeType(`.${parsed.extension}`);
        const safeFilename = createFilesLib.sanitizeFilenameForHeader(
          fileSource.displayFilename || filename
        );
        response.setHeader("Content-Type", mimeType);
        response.setHeader(
          "Content-Disposition",
          `attachment; filename="${safeFilename}"`
        );
        response.setHeader("Content-Length", fileData.buffer.length);
        response.send(fileData.buffer);
        Telemetry.sendTelemetry("agent_generated_file_downloaded", {
          type: mimeType,
        }).catch(() => {});
        return;
      } catch (error) {
        console.error("[agentFileServer] Download error:", error.message);
        return response.status(500).json({ error: "Failed to download file" });
      }
    }
  );

  /**
   * Preview a generated file INLINE (for the in-app preview panel).
   * Same auth + ownership checks as the download route, but:
   *   - converts office documents (docx/xlsx/pptx/csv/txt...) to PDF,
   *   - serves PDF as-is,
   *   - sets Content-Disposition: inline so it renders in an <iframe>
   *     instead of triggering a file download.
   */
  app.get(
    "/agent-skills/generated-files/:filename/preview",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { filename } = request.params;
        if (!filename)
          return response.status(400).json({ error: "Filename is required" });

        const parsed = createFilesLib.parseFilename(filename);
        if (!parsed) {
          return response
            .status(400)
            .json({ error: "Invalid filename format" });
        }

        if (!isPreviewable(parsed.extension)) {
          return response
            .status(415)
            .json({ error: "Preview not supported for this file type" });
        }

        // Reuse the exact same ownership check as download.
        const fileSource = await findFileSource(filename, {
          user,
          isMultiUser: multiUserMode(response),
        });
        if (!fileSource) {
          return response
            .status(404)
            .json({ error: "File not found or access denied" });
        }

        const fileData = await createFilesLib.getGeneratedFile(filename);
        if (!fileData) {
          return response
            .status(404)
            .json({ error: "File not found in storage" });
        }

        // Convert to PDF (or passthrough if already PDF). Cached on disk.
        let pdfPath;
        try {
          pdfPath = await renderToPdf(fileData.storagePath, filename);
        } catch (convErr) {
          console.error(
            "[agentFileServer] Preview conversion error:",
            convErr.message
          );
          return response
            .status(500)
            .json({ error: "Failed to render preview" });
        }

        response.setHeader("Content-Type", "application/pdf");
        response.setHeader("Content-Disposition", `inline; filename="preview.pdf"`);
        response.setHeader("Cache-Control", "private, max-age=300");
        fs.createReadStream(pdfPath).pipe(response);
        Telemetry.sendTelemetry("agent_generated_file_previewed", {
          type: parsed.extension,
        }).catch(() => {});
        return;
      } catch (error) {
        console.error("[agentFileServer] Preview error:", error.message);
        return response.status(500).json({ error: "Failed to preview file" });
      }
    }
  );
}

/**
 * Locates the source record (a workspace chat or a scheduled job run) that
 * references the given storage filename, and confirms the requester has access.
 *
 * Search order:
 *   1. Workspace chats the user can access (per multi-user permissions).
 *   2. Scheduled job runs — single-user only, so no per-user access check.
 *
 * @param {string} storageFilename
 * @param {{ user: object|null, isMultiUser: boolean }} ctx
 * @returns {Promise<{workspaceId: number|null, displayFilename: string}|null>}
 */
async function findFileSource(storageFilename, { user, isMultiUser }) {
  try {
    const fromChat = await findInWorkspaceChats(storageFilename, {
      user,
      isMultiUser,
    });
    if (fromChat) return fromChat;

    if (isMultiUser) return null;

    return await findInScheduledJobRuns(storageFilename);
  } catch (error) {
    console.error("[findFileSource] Error:", error.message);
    return null;
  }
}

// Search workspace chats the user has access to. In single-user mode all
// workspaces are accessible; in multi-user mode only workspaces assigned to
// the user are. Returns the matching chat's workspace + display filename.
async function findInWorkspaceChats(storageFilename, { user, isMultiUser }) {
  const workspaces =
    isMultiUser && user
      ? await Workspace.whereWithUser(user)
      : await Workspace.where();

  const workspaceIds = workspaces.map((w) => w.id);
  if (workspaceIds.length === 0) return null;

  // DB-level filter so we don't load every chat into memory.
  const chats = await WorkspaceChats.where({
    workspaceId: { in: workspaceIds },
    include: true,
    response: { contains: storageFilename },
  });

  for (const chat of chats) {
    const { outputs = [] } = safeJsonParse(chat.response, { outputs: [] });
    const output = outputs.find(
      (o) => o?.payload?.storageFilename === storageFilename
    );
    if (!output) continue;
    return {
      workspaceId: chat.workspaceId,
      displayFilename:
        output.payload.filename || output.payload.displayFilename,
    };
  }

  return null;
}

// Search completed scheduled job runs. Scheduled jobs are single-user only,
// so this skips access control. Returns the matching run's display filename.
async function findInScheduledJobRuns(storageFilename) {
  const runs = await ScheduledJobRun.where({
    status: "completed",
    result: { contains: storageFilename },
  });

  for (const run of runs) {
    const { outputs = [] } = safeJsonParse(run.result, { outputs: [] });
    const output = outputs.find(
      (o) => o?.payload?.storageFilename === storageFilename
    );
    if (!output) continue;
    return {
      workspaceId: null,
      displayFilename: output.payload.filename || storageFilename,
    };
  }

  return null;
}

module.exports = { agentFileServerEndpoints };
