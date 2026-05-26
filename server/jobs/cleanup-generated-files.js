const { log, conclude } = require("./helpers/index.js");
const { WorkspaceChats } = require("../models/workspaceChats.js");
const { ScheduledJobRun } = require("../models/scheduledJobRun.js");
const createFilesLib = require("../utils/agents/aibitat/plugins/create-files/lib.js");
const { safeJsonParse } = require("../utils/http/index.js");

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
 * Uses pagination to avoid loading all chats into memory at once.
 * @param {number} batchSize - Number of chats to process per batch (default: 50)
 * @returns {Promise<Set<string>>}
 */
async function getActiveStorageFilenames(batchSize = 50) {
  const [workspaceChats, scheduledJobRuns] = await Promise.all([
    workspaceChatGeneratedFilenames(batchSize),
    scheduledJobRunGeneratedFilenames(batchSize),
  ]);

  return new Set([...workspaceChats, ...scheduledJobRuns]);
}

async function workspaceChatGeneratedFilenames(batchSize = 50) {
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
            if (!output || !output.payload || !output.payload.storageFilename)
              continue;
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
    console.error("[workspaceChatGeneratedFilenames] Error:", error.message);
  }

  return storageFilenames;
}

async function scheduledJobRunGeneratedFilenames(batchSize = 50) {
  const storageFilenames = new Set();
  try {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const runs = await ScheduledJobRun.where(
        { status: "completed" },
        batchSize,
        { id: "asc" },
        {},
        offset
      );

      if (runs.length === 0) {
        hasMore = false;
        break;
      }

      for (const run of runs) {
        try {
          const response = safeJsonParse(run.result, { outputs: [] });
          for (const output of response.outputs) {
            if (!output?.payload?.storageFilename) continue;
            storageFilenames.add(output.payload.storageFilename);
          }
        } catch {
          continue;
        }
      }

      offset += runs.length;
      hasMore = runs.length === batchSize;
    }
  } catch (error) {
    console.error("[scheduledJobRunGeneratedFilenames] Error:", error.message);
  }

  return storageFilenames;
}
