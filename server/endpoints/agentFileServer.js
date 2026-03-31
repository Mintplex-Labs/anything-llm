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

        // Find a chat record that references this file and that the user can access
        const validChat = await findValidChatForFile(
          filename,
          user,
          multiUserMode(response)
        );

        if (!validChat) {
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
          validChat.displayFilename || filename
        );
        response.setHeader("Content-Type", mimeType);
        response.setHeader(
          "Content-Disposition",
          `attachment; filename="${safeFilename}"`
        );
        response.setHeader("Content-Length", fileData.buffer.length);
        return response.send(fileData.buffer);
      } catch (error) {
        console.error("[agentFileServer] Download error:", error.message);
        return response.status(500).json({ error: "Failed to download file" });
      }
    }
  );
}

/**
 * Finds a valid chat record that references the given storage filename
 * and that the user has access to.
 * @param {string} storageFilename - The storage filename to search for
 * @param {object|null} user - The user object (null in single-user mode)
 * @param {boolean} isMultiUser - Whether multi-user mode is enabled
 * @returns {Promise<{workspaceId: number, displayFilename: string}|null>}
 */
async function findValidChatForFile(storageFilename, user, isMultiUser) {
  try {
    // Get all workspaces the user has access to.
    // In single-user mode, all workspaces are accessible.
    // In multi-user mode, only workspaces assigned to the user are accessible.
    let workspaceIds;
    if (isMultiUser && user) {
      const workspaces = await Workspace.whereWithUser(user);
      workspaceIds = workspaces.map((w) => w.id);
    } else {
      const workspaces = await Workspace.where();
      workspaceIds = workspaces.map((w) => w.id);
    }

    if (workspaceIds.length === 0) return null;

    // Use database-level filtering to only fetch chats that contain the filename
    // This avoids loading all chats into memory
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
          displayFilename:
            output.payload.filename || output.payload.displayFilename,
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
