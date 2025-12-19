const fs = require("fs");
const path = require("path");
const { execSync, spawnSync } = require("child_process");

/**
 * Custom FFMPEG wrapper class for audio file conversion.
 * Replaces deprecated fluent-ffmpeg package.
 * Locates ffmpeg binary and converts audio files to required
 * WAV format (16k hz mono 32f) for Whisper transcription.
 *
 * @class FFMPEGWrapper
 */
class FFMPEGWrapper {
  static _instance;

  constructor() {
    if (FFMPEGWrapper._instance) return FFMPEGWrapper._instance;
    FFMPEGWrapper._instance = this;
    this._ffmpegPath = null;
  }

  log(text, ...args) {
    console.log(`\x1b[35m[FFMPEG]\x1b[0m ${text}`, ...args);
  }

  /**
   * Locates ffmpeg binary.
   * Uses fix-path on non-Windows platforms to ensure we can find ffmpeg.
   *
   * @returns {string} Path to ffmpeg binary
   * @throws {Error}
   */
  get ffmpegPath() {
    if (this._ffmpegPath) return this._ffmpegPath;

    if (process.platform !== "win32") {
      try {
        const fixPath = require("fix-path");
        fixPath();
      } catch (error) {
        this.log("Could not load fix-path, using system PATH");
      }
    }

    try {
      const which = process.platform === "win32" ? "where" : "which";
      const result = execSync(`${which} ffmpeg`, { encoding: "utf8" }).trim();
      const candidatePath = result?.split("\n")?.[0]?.trim();
      if (!candidatePath) throw new Error("FFMPEG candidate path not found.");
      if (!this.isValidFFMPEG(candidatePath))
        throw new Error("FFMPEG candidate path is not valid ffmpeg binary.");

      this.log(`Found FFMPEG binary at ${candidatePath}`);
      this._ffmpegPath = candidatePath;
      return this._ffmpegPath;
    } catch (error) {
      this.log(error.message);
    }

    throw new Error("FFMPEG binary not found.");
  }

  /**
   * Validates that path points to a valid ffmpeg binary.
   * Runs ffmpeg -version command.
   *
   * @param {string} pathToTest - Path of ffmpeg binary
   * @returns {boolean}
   */
  isValidFFMPEG(pathToTest) {
    try {
      if (!pathToTest || !fs.existsSync(pathToTest)) return false;
      execSync(`"${pathToTest}" -version`, { encoding: "utf8", stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Converts audio file to WAV format with required parameters for Whisper.
   * Output: 16k hz, mono, 32bit float.
   *
   * @param {string} inputPath - Input path for audio file (any format supported by ffmpeg)
   * @param {string} outputPath - Output path for converted file
   * @returns {boolean}
   * @throws {Error} If ffmpeg binary cannot be found or conversion fails
   */
  convertAudioToWav(inputPath, outputPath) {
    if (!fs.existsSync(inputPath))
      throw new Error(`Input file ${inputPath} does not exist.`);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    this.log(`Converting ${path.basename(inputPath)} to WAV format...`);
    // Convert to 16k hz mono 32f
    const result = spawnSync(
      this.ffmpegPath,
      [
        "-i",
        inputPath,
        "-ar",
        "16000",
        "-ac",
        "1",
        "-acodec",
        "pcm_f32le",
        "-y",
        outputPath,
      ],
      { encoding: "utf8" }
    );

    // ffmpeg writes progress to stderr
    if (result.stderr) this.log(result.stderr.trim());
    if (result.status !== 0) throw new Error(`FFMPEG conversion failed`);
    this.log(`Conversion complete: ${path.basename(outputPath)}`);
    return true;
  }
}

module.exports = { FFMPEGWrapper };
