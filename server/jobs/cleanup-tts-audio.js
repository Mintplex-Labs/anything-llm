const fs = require("fs");
const path = require("path");
const { log, conclude } = require("./helpers/index.js");
const { WorkspaceChats } = require("../models/workspaceChats.js");
const {
  ttsCachePath,
  TTS_AUDIO_FILENAME_PATTERN,
} = require("../utils/TextToSpeech/audioCache.js");
const { safeJsonParse } = require("../utils/http/index.js");

// Ignore audio younger than this so a freshly generated file isn't deleted in
// the window between writing it to disk and persisting its chat reference.
const MIN_AGE_MS = 60 * 60 * 1000;

(async () => {
  try {
    if (!fs.existsSync(ttsCachePath)) return;

    const now = Date.now();
    const candidates = fs
      .readdirSync(ttsCachePath)
      .filter((name) => TTS_AUDIO_FILENAME_PATTERN.test(name))
      .filter(
        (name) =>
          now - fs.statSync(path.join(ttsCachePath, name)).mtimeMs > MIN_AGE_MS
      );
    if (candidates.length === 0) return;

    const referenced = await referencedAudioFilenames();
    const orphans = candidates.filter((name) => !referenced.has(name));
    if (orphans.length === 0) return;

    log(`Found ${orphans.length} orphaned TTS audio files to delete.`);
    let deleted = 0;
    for (const name of orphans) {
      try {
        fs.unlinkSync(path.join(ttsCachePath, name));
        deleted++;
      } catch (error) {
        log(`Failed to delete ${name}: ${error.message}`);
      }
    }
    log(`Cleanup complete: deleted ${deleted}/${orphans.length} files.`);
  } catch (error) {
    console.error(error);
    log(`Error during cleanup: ${error.message}`);
  } finally {
    conclude();
  }
})();

/**
 * Collects every TTS audio filename referenced by an active chat, one batch of
 * chats at a time so the full chat table is never held in memory.
 * @param {number} batchSize - chats fetched per query
 * @returns {Promise<Set<string>>}
 */
async function referencedAudioFilenames(batchSize = 50) {
  const filenames = new Set();
  let offset = 0;
  while (true) {
    const chats = await WorkspaceChats.where(
      { include: true, response: { contains: '"ttsAudio"' } },
      batchSize,
      { id: "asc" },
      offset
    );
    for (const chat of chats) {
      const filename = safeJsonParse(chat.response, {})?.ttsAudio?.filename;
      if (filename) filenames.add(filename);
    }
    if (chats.length < batchSize) return filenames;
    offset += chats.length;
  }
}
