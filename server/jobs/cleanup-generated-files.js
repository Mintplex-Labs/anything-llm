const { log, conclude } = require("./helpers/index.js");
const { WorkspaceChats } = require("../models/workspaceChats.js");
const createFilesLib = require("../utils/agents/aibitat/plugins/create-files/lib.js");

(async () => {
  try {
    const fs = require("fs");
    const path = require("path");
    const storageDirectory = await createFilesLib.getOutputDirectory();
    if (!fs.existsSync(storageDirectory)) return;

    const files = fs.readdirSync(storageDirectory);
    if (files.length === 0) return;

    // Get all storage filenames referenced in active (include: true) chats
    const activeFileRefs = await getActiveStorageFilenames();
    const filesToDelete = [];
    for (const filename of files) {
      const fullPath = path.join(storageDirectory, filename);
      const stat = fs.statSync(fullPath);
      console.log({
        filename,
      });

      // Skip files/folders that don't match our naming pattern and add to deletion list
      if (!filename.match(/^[a-z]+-[a-f0-9-]{36}(\.\w+)?$/i)) {
        filesToDelete.push({ path: fullPath, isDirectory: stat.isDirectory() });
        continue;
      }

      // If file/folder is not referenced in any active chat, add to deletion list
      if (!activeFileRefs.has(filename))
        filesToDelete.push({ path: fullPath, isDirectory: stat.isDirectory() });
    }

    if (filesToDelete.length === 0) return;

    log(`Found ${filesToDelete.length} orphaned files/folders to delete.`);
    let deletedCount = 0;
    let failedCount = 0;
    for (const { path: itemPath, isDirectory } of filesToDelete) {
      try {
        if (isDirectory) fs.rmSync(itemPath, { recursive: true });
        else fs.unlinkSync(itemPath);
        deletedCount++;
      } catch (error) {
        failedCount++;
        log(`Failed to delete ${itemPath}: ${error.message}`);
      }
    }

    log(
      `Cleanup complete: deleted ${deletedCount} items, ${failedCount} failures.`
    );
  } catch (error) {
    console.error(error);
    log(`Error during cleanup: ${error.message}`);
  } finally {
    conclude();
  }
})();

/**
 * Retrieves all storage filenames referenced in active (include: true) workspace chats.
 * Searches through the outputs array in chat responses.
 * @returns {Promise<Set<string>>}
 */
async function getActiveStorageFilenames() {
  const storageFilenames = new Set();

  try {
    // Get all active chats
    const chats = await WorkspaceChats.where({ include: true });

    for (const chat of chats) {
      try {
        const response =
          typeof chat.response === "string"
            ? JSON.parse(chat.response)
            : chat.response;

        if (!response?.outputs || !Array.isArray(response.outputs)) continue;

        for (const output of response.outputs) {
          if (output?.payload?.storageFilename) {
            storageFilenames.add(output.payload.storageFilename);
          }
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    console.error("[getActiveStorageFilenames] Error:", error.message);
  }

  return storageFilenames;
}
