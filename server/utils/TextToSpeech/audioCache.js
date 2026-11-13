/**
 * Disk cache for text-to-speech audio generated from workspace chats, so a
 * replayed message is served from storage instead of being synthesized again.
 *
 * Each chat keeps at most one audio file at `tts-cache/<chatId>/<key><ext>`.
 * The key hashes the provider, model, voice and spoken text, so audio made
 * with other TTS settings or from an older version of the message is a miss
 * and gets replaced the next time the message is played.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { getAudioFileInfo, mimeFromExtension } = require("./audioFormat");

const TEMP_EXTENSION = ".tmp";

/**
 * @typedef {Object} CachedAudio
 * @property {string} filepath - Absolute path of audio file on disk.
 * @property {string} mime
 */

/**
 * @returns {string}
 */
function cachePath() {
  return process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/tts-cache`)
    : path.resolve(process.env.STORAGE_DIR, `tts-cache`);
}

/**
 * @param {number|string} chatId
 * @returns {string}
 */
function chatFolder(chatId) {
  return path.resolve(cachePath(), String(Number(chatId)));
}

/**
 * @param {string} filepath
 * @returns {CachedAudio}
 */
function cachedAudio(filepath) {
  return { filepath, mime: mimeFromExtension(path.extname(filepath)) };
}

const TTSAudioCache = {
  /**
   * @param {{cacheKey: string}} provider - TTS provider that generates the audio.
   * @param {string} text - Text that is spoken.
   * @returns {string}
   */
  key: function (provider, text) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify([provider.cacheKey, text]))
      .digest("hex");
  },

  /**
   * @param {number|string} chatId
   * @param {string} key
   * @returns {Promise<CachedAudio|null>} Null when no audio is cached for the key.
   */
  get: async function (chatId, key) {
    const folder = chatFolder(chatId);
    const files = await fs.promises.readdir(folder).catch(() => []);
    const file = files.find((name) => path.parse(name).name === key);
    return file ? cachedAudio(path.resolve(folder, file)) : null;
  },

  /**
   * Stores audio for a chat and drops any audio it had under another key.
   * @param {number|string} chatId
   * @param {string} key
   * @param {Buffer} buffer
   * @returns {Promise<CachedAudio>}
   */
  set: async function (chatId, key, buffer) {
    const folder = chatFolder(chatId);
    const filename = `${key}${getAudioFileInfo(buffer).extension}`;
    const filepath = path.resolve(folder, filename);
    await fs.promises.mkdir(folder, { recursive: true });

    // Written under a temporary name and renamed into place, so a crash or a
    // concurrent read never finds a partially written audio file.
    const tempFilepath = `${filepath}.${crypto.randomUUID()}${TEMP_EXTENSION}`;
    await fs.promises.writeFile(tempFilepath, buffer);
    await fs.promises.rename(tempFilepath, filepath);

    const files = await fs.promises.readdir(folder);
    await Promise.all(
      files
        .filter((name) => name !== filename && !name.endsWith(TEMP_EXTENSION))
        .map((name) => fs.promises.rm(path.resolve(folder, name)))
    );
    return cachedAudio(filepath);
  },

  /**
   * Removes cached audio of the given chats.
   * @param {number[]} chatIds
   * @returns {Promise<void>}
   */
  purge: async function (chatIds = []) {
    if (!Array.isArray(chatIds) || chatIds.length === 0) return;
    const ids = new Set(chatIds.map((id) => String(Number(id))));
    const cached = await fs.promises.readdir(cachePath()).catch(() => []);
    await Promise.all(
      cached
        .filter((name) => ids.has(name))
        .map((name) =>
          fs.promises.rm(chatFolder(name), { recursive: true, force: true })
        )
    );
  },
};

module.exports = { TTSAudioCache };
