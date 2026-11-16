/**
 * Disk cache for chat text-to-speech audio. Files are written flat as
 * `tts-cache/tts-<uuid><ext>` and referenced from the chat's response as
 * `ttsAudio: { key, filename }`, where the key hashes the provider, model,
 * voice and spoken text. Files no active chat references are removed by the
 * `cleanup-tts-audio` job.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { getAudioFileInfo, mimeFromExtension } = require("./audioFormat");

const TTS_AUDIO_FILENAME_PATTERN =
  /^tts-[a-f0-9-]{36}\.(flac|m4a|mp3|ogg|wav|webm)$/;

const ttsCachePath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/tts-cache`)
    : path.resolve(process.env.STORAGE_DIR, `tts-cache`);

/**
 * @typedef {Object} TTSAudioReference
 * @property {string} key
 * @property {string} filename
 */

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
   * @param {TTSAudioReference|undefined} ttsAudio - Reference stored on the chat response.
   * @param {string} key - Key the audio must have been generated with.
   * @returns {{filepath: string, mime: string}|null}
   */
  get: function (ttsAudio, key) {
    if (ttsAudio?.key !== key) return null;
    if (!TTS_AUDIO_FILENAME_PATTERN.test(ttsAudio.filename)) return null;

    const filepath = path.resolve(ttsCachePath, ttsAudio.filename);
    if (!fs.existsSync(filepath)) return null;
    return { filepath, mime: mimeFromExtension(path.extname(filepath)) };
  },

  /**
   * @param {string} key
   * @param {Buffer} buffer
   * @returns {Promise<TTSAudioReference>}
   */
  set: async function (key, buffer) {
    const { extension } = getAudioFileInfo(buffer);
    const filename = `tts-${crypto.randomUUID()}${extension}`;
    await fs.promises.mkdir(ttsCachePath, { recursive: true });
    await fs.promises.writeFile(path.resolve(ttsCachePath, filename), buffer);
    return { key, filename };
  },
};

module.exports = { TTSAudioCache, ttsCachePath, TTS_AUDIO_FILENAME_PATTERN };
