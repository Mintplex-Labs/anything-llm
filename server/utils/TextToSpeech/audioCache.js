/**
 * Disk cache for chat text-to-speech audio. Each chat keeps one file at
 * `tts-cache/<chatId>/<key><ext>`, where the key hashes the provider, model,
 * voice and spoken text.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { getAudioFileInfo, mimeFromExtension } = require("./audioFormat");

const TEMP_EXTENSION = ".tmp";

/**
 * @typedef {Object} CachedAudio
 * @property {string} filepath
 * @property {string} mime
 */

function cachePath() {
  return process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/tts-cache`)
    : path.resolve(process.env.STORAGE_DIR, `tts-cache`);
}

function chatFolder(chatId) {
  return path.resolve(cachePath(), String(Number(chatId)));
}

function cachedAudio(filepath) {
  return { filepath, mime: mimeFromExtension(path.extname(filepath)) };
}

const TTSAudioCache = {
  /**
   * @param {{cacheKey: string}} provider
   * @param {string} text
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
   * @returns {Promise<CachedAudio|null>}
   */
  get: async function (chatId, key) {
    const folder = chatFolder(chatId);
    const files = await fs.promises.readdir(folder).catch(() => []);
    const file = files.find((name) => path.parse(name).name === key);
    return file ? cachedAudio(path.resolve(folder, file)) : null;
  },

  /**
   * Replaces any audio the chat had under another key.
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

    // Renamed into place so a crash or concurrent read never sees a partial file.
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

  /**
   * @returns {Promise<void>}
   */
  clear: async function () {
    await fs.promises.rm(cachePath(), { recursive: true, force: true });
  },
};

module.exports = { TTSAudioCache };
