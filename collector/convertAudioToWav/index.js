const fs = require("fs/promises");
const path = require("path");
const { WATCH_DIRECTORY } = require("../utils/constants");
const { isWithin, trashFile, normalizePath } = require("../utils/files");
const { FFMPEGWrapper } = require("../utils/WhisperProviders/ffmpeg");

/**
 * Convert an audio file in the hotdir to a 16kHz mono WAV in the same directory.
 * The source file is trashed; caller must read and trash the resulting wav.
 * @param {string} filename - The filename of the source audio in the hotdir
 * @returns {Promise<{success: boolean, reason: string, wavFilename: string|null}>}
 */
async function convertAudioToWav(filename) {
  if (!filename)
    return {
      success: false,
      reason: "No filename provided.",
      wavFilename: null,
    };

  const inputPath = normalizePath(path.resolve(WATCH_DIRECTORY, filename));
  if (!isWithin(path.resolve(WATCH_DIRECTORY), inputPath))
    return {
      success: false,
      reason: "Filename is outside the hotdir.",
      wavFilename: null,
    };

  try {
    await fs.access(inputPath);
  } catch {
    return {
      success: false,
      reason: `${filename} does not exist in hotdir.`,
      wavFilename: null,
    };
  }

  const wavFilename = `${path.parse(filename).name}.wav`;
  const outputPath = path.resolve(WATCH_DIRECTORY, wavFilename);

  try {
    const ffmpeg = new FFMPEGWrapper();
    await ffmpeg.convertAudioToWav(inputPath, outputPath);
    return { success: true, reason: null, wavFilename };
  } catch (e) {
    console.error(e);
    return { success: false, reason: e.message, wavFilename: null };
  } finally {
    trashFile(inputPath);
  }
}

module.exports = { convertAudioToWav };
