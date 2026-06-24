const { log, conclude } = require("./helpers/index.js");
const { WorkspaceChats } = require("../models/workspaceChats.js");
const { generatedImagesPath } = require("../utils/files/index.js");
const { safeJsonParse } = require("../utils/http/index.js");

(async () => {
  try {
    const fs = require("fs");
    const path = require("path");
    if (!fs.existsSync(generatedImagesPath)) return;

    const files = fs.readdirSync(generatedImagesPath);
    if (files.length === 0) return;

    // Get all image filenames referenced in active (include: true) chats.
    const activeImageRefs = await getActiveImageFilenames();
    const filesToDelete = [];
    for (const filename of files) {
      // Skip files that don't match our `img-<uuid>.png` naming pattern and
      // remove anything not referenced by an active chat.
      if (
        !/^img-[a-f0-9-]{36}\.png$/i.test(filename) ||
        !activeImageRefs.has(filename)
      )
        filesToDelete.push(path.join(generatedImagesPath, filename));
    }

    if (filesToDelete.length === 0) return;

    log(`Found ${filesToDelete.length} orphaned images to delete.`);
    let deletedCount = 0;
    let failedCount = 0;
    for (const itemPath of filesToDelete) {
      try {
        fs.unlinkSync(itemPath);
        deletedCount++;
      } catch (error) {
        failedCount++;
        log(`Failed to delete ${itemPath}: ${error.message}`);
      }
    }

    log(
      `Cleanup complete: deleted ${deletedCount} images, ${failedCount} failures.`
    );
  } catch (error) {
    console.error(error);
    log(`Error during cleanup: ${error.message}`);
  } finally {
    conclude();
  }
})();

/**
 * Retrieves all image storage filenames referenced in active (include: true)
 * workspace chats. Uses pagination to avoid loading all chats into memory.
 * @param {number} batchSize - Number of chats to process per batch (default: 50)
 * @returns {Promise<Set<string>>}
 */
async function getActiveImageFilenames(batchSize = 50) {
  const storageFilenames = new Set();
  try {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const chats = await WorkspaceChats.where(
        { include: true },
        batchSize,
        { id: "asc" },
        offset
      );

      if (chats.length === 0) {
        hasMore = false;
        break;
      }

      for (const chat of chats) {
        try {
          const response = safeJsonParse(chat.response, { outputs: [] });
          for (const output of response.outputs) {
            if (!output?.payload?.storageFilename) continue;
            storageFilenames.add(output.payload.storageFilename);
          }
        } catch {
          continue;
        }
      }

      offset += chats.length;
      hasMore = chats.length === batchSize;
    }
  } catch (error) {
    console.error("[getActiveImageFilenames] Error:", error.message);
  }

  return storageFilenames;
}
