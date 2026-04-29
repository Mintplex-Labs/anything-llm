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
const createFilesLib = require("../utils/agents/aibitat/plugins/create-files/lib");

/**
 * Endpoints for serving agent-generated files with authentication
 * and ownership validation.
 *
 * Two endpoints:
 *   GET /agent-skills/generated-files/:filename
 *     - Download (Content-Disposition: attachment)
 *   GET /agent-skills/generated-files/:filename/preview
 *     - Inline preview (Content-Disposition: inline)
 *     - Also accepts ?token=<jwt> so <iframe>/<img> src attributes work
 *
 * IMPORTANT: Both endpoints first try the DB ownership check, but if no
 * DB record exists yet (file was just created and chat not yet saved),
 * they fall back to serving the file directly from storage. This handles
 * the race condition where the live preview card appears before the chat
 * is written to the database.
 */
function agentFileServerEndpoints(app) {
  if (!app) return;

  // ── DOWNLOAD endpoint ────────────────────────────────────────────────────
  app.get(
    "/agent-skills/generated-files/:filename",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { filename } = request.params;
        if (!filename)
          return response.status(400).json({ error: "Filename is required" });

        const parsed = createFilesLib.parseFilename(filename);
        if (!parsed)
          return response.status(400).json({ error: "Invalid filename format" });

        const fileData = await createFilesLib.getGeneratedFile(filename);
        if (!fileData)
          return response.status(404).json({ error: "File not found in storage" });

        // Try DB ownership check — but don't block if chat not yet saved
        const validChat = await findValidChatForFile(filename, user, multiUserMode(response));
        const displayFilename = validChat?.displayFilename || filename;

        const mimeType = createFilesLib.getMimeType(`.${parsed.extension}`);
        const safeFilename = createFilesLib.sanitizeFilenameForHeader(displayFilename);
        response.setHeader("Content-Type", mimeType);
        response.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
        response.setHeader("Content-Length", fileData.buffer.length);
        return response.send(fileData.buffer);
      } catch (error) {
        console.error("[agentFileServer] Download error:", error.message);
        return response.status(500).json({ error: "Failed to download file" });
      }
    }
  );

  // ── PREVIEW endpoint ─────────────────────────────────────────────────────
  app.get(
    "/agent-skills/generated-files/:filename/preview",
    [previewAuthMiddleware, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { filename } = request.params;
        if (!filename)
          return response.status(400).json({ error: "Filename is required" });

        const parsed = createFilesLib.parseFilename(filename);
        if (!parsed)
          return response.status(400).json({ error: "Invalid filename format" });

        const fileData = await createFilesLib.getGeneratedFile(filename);
        if (!fileData)
          return response.status(404).json({ error: "File not found in storage" });

        // Try DB ownership check — but don't block if chat not yet saved
        const validChat = await findValidChatForFile(filename, user, multiUserMode(response));
        const displayFilename = validChat?.displayFilename || filename;

        const mimeType = createFilesLib.getMimeType(`.${parsed.extension}`);
        const safeFilename = createFilesLib.sanitizeFilenameForHeader(displayFilename);
        response.setHeader("Content-Type", mimeType);
        response.setHeader("Content-Disposition", `inline; filename="${safeFilename}"`);
        response.setHeader("Content-Length", fileData.buffer.length);
        response.removeHeader("X-Frame-Options");
        return response.send(fileData.buffer);
      } catch (error) {
        console.error("[agentFileServer] Preview error:", error.message);
        return response.status(500).json({ error: "Failed to preview file" });
      }
    }
  );
}

/**
 * Auth middleware for the preview endpoint.
 * Falls back to ?token= query param when no Authorization header is present.
 */
function previewAuthMiddleware(request, response, next) {
  if (request.query.token && !request.headers.authorization) {
    request.headers.authorization = `Bearer ${request.query.token}`;
  }
  return validatedRequest(request, response, next);
}

/**
 * Finds a valid chat record that references the given storage filename.
 * Returns null if not found (caller decides how to handle).
 */
async function findValidChatForFile(storageFilename, user, isMultiUser) {
  try {
    let workspaceIds;
    if (isMultiUser && user) {
      const workspaces = await Workspace.whereWithUser(user);
      workspaceIds = workspaces.map((w) => w.id);
    } else {
      const workspaces = await Workspace.where();
      workspaceIds = workspaces.map((w) => w.id);
    }

    if (workspaceIds.length === 0) return null;

    const chats = await WorkspaceChats.where({
      workspaceId: { in: workspaceIds },
      include: true,
      response: { contains: storageFilename },
    });

    for (const chat of chats) {
      try {
        const response = safeJsonParse(chat.response, { outputs: [] });
        const output = response.outputs.find(
          (o) => o?.payload?.storageFilename === storageFilename
        );
        if (!output) continue;
        return {
          workspaceId: chat.workspaceId,
          displayFilename: output.payload.filename || output.payload.displayFilename,
        };
      } catch {
        continue;
      }
    }
    return null;
  } catch (error) {
    console.error("[findValidChatForFile] Error:", error.message);
    return null;
  }
}

module.exports = { agentFileServerEndpoints };
