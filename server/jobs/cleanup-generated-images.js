const fs = require("fs");
const path = require("path");
const { log, conclude } = require("./helpers/index.js");
const { WorkspaceChats } = require("../models/workspaceChats.js");
const { generatedImagesPath } = require("../utils/files/index.js");
const { safeJsonParse } = require("../utils/http/index.js");

// Generated images are always stored as `img-<uuid>.png`.
const IMAGE_FILENAME_PATTERN = /^img-[a-f0-9-]{36}\.png$/i;

// Ignore images younger than this so a freshly generated file isn't deleted in
// the window between writing it to disk and persisting its chat reference.
const MIN_AGE_MS = 60 * 60 * 1000;

(async () => {
  try {
    if (!fs.existsSync(generatedImagesPath)) return;

    const now = Date.now();
    const candidates = fs
      .readdirSync(generatedImagesPath)
      .filter((name) => IMAGE_FILENAME_PATTERN.test(name))
      .filter(
        (name) =>
          now - fs.statSync(path.join(generatedImagesPath, name)).mtimeMs >
          MIN_AGE_MS
      );
    if (candidates.length === 0) return;

    const referenced = await referencedImageFilenames();
    const orphans = candidates.filter((name) => !referenced.has(name));
    if (orphans.length === 0) return;

    log(`Found ${orphans.length} orphaned images to delete.`);
    let deleted = 0;
    for (const name of orphans) {
      try {
        fs.unlinkSync(path.join(generatedImagesPath, name));
        deleted++;
      } catch (error) {
        log(`Failed to delete ${name}: ${error.message}`);
      }
    }
    log(`Cleanup complete: deleted ${deleted}/${orphans.length} images.`);
  } catch (error) {
    console.error(error);
    log(`Error during cleanup: ${error.message}`);
  } finally {
    conclude();
  }
})();

/**
 * Collects every generated-image filename referenced by an active
 * (include: true) chat across all workspaces and users.
 * @returns {Promise<Set<string>>}
 */
async function referencedImageFilenames() {
  const filenames = new Set();
  for await (const chat of activeImageChats()) {
    const { outputs } = safeJsonParse(chat.response, { outputs: [] });
    for (const output of outputs || []) {
      const storageFilename = output?.payload?.storageFilename;
      if (IMAGE_FILENAME_PATTERN.test(storageFilename))
        filenames.add(storageFilename);
    }
  }
  return filenames;
}

/**
 * Yields active chats that reference a generated image, one batch at a time, so
 * the full chat table is never held in memory. The `img-` filter narrows the
 * scan to chats that can actually hold an image reference.
 * @param {number} batchSize - chats fetched per query
 * @returns {AsyncGenerator<object>}
 */
async function* activeImageChats(batchSize = 50) {
  let offset = 0;
  while (true) {
    const chats = await WorkspaceChats.where(
      { include: true, response: { contains: "img-" } },
      batchSize,
      { id: "asc" },
      offset
    );
    if (chats.length === 0) return;
    yield* chats;
    if (chats.length < batchSize) return;
    offset += chats.length;
  }
}
