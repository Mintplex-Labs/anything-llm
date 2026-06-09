const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");
const { CollectorApi } = require("../collectorApi");
const { hotdirPath, isWithin } = require("../files");

/**
 * Convert an audio buffer to a 16kHz mono WAV buffer via the collector's
 * FFMPEG wrapper. Use this when the downstream STT provider (e.g. Lemonade)
 * runs a whisper.cpp backend that rejects webm/opus input.
 * @param {Buffer} audioBuffer - Source audio buffer.
 * @param {string} extension - Source file extension including the leading dot (e.g. ".webm").
 * @returns {Promise<Buffer>} The converted WAV buffer.
 */
async function convertAudioBufferToWav(audioBuffer, extension) {
  let wavPath = null;
  const sourceFilename = `stt-${v4()}${extension}`;
  const sourcePath = path.resolve(hotdirPath, sourceFilename);
  if (!isWithin(hotdirPath, sourcePath))
    throw new Error("Source path is outside the hotdir.");

  try {
    await fs.writeFile(sourcePath, audioBuffer);
    const result = await new CollectorApi().convertAudioToWav(sourceFilename);
    if (!result?.success || !result?.wavFilename)
      throw new Error(result?.reason || "Audio conversion failed.");

    wavPath = path.resolve(hotdirPath, result.wavFilename);
    return await fs.readFile(wavPath);
  } finally {
    await fs.rm(sourcePath, { force: true }).catch(() => {});
    if (wavPath) await fs.rm(wavPath, { force: true }).catch(() => {});
  }
}

module.exports = { convertAudioBufferToWav };
