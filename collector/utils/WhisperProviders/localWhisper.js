const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");

class LocalWhisper {
  constructor() {
    // Model Card: https://huggingface.co/Xenova/whisper-small
    this.model = "Xenova/whisper-small";
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `models`)
        : path.resolve(__dirname, `../../../server/storage/models`)
    );

    this.modelPath = path.resolve(this.cacheDir, "Xenova", "whisper-small");

    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir))
      fs.mkdirSync(this.cacheDir, { recursive: true });

    this.#log("Initialized.");
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[LocalWhisper]\x1b[0m ${text}`, ...args);
  }

  async #convertToWavAudioData(sourcePath) {
    try {
      let buffer;
      const wavefile = require("wavefile");
      const ffmpeg = require("fluent-ffmpeg");
      const outFolder = path.resolve(__dirname, `../../storage/tmp`);
      if (!fs.existsSync(outFolder))
        fs.mkdirSync(outFolder, { recursive: true });

      const fileExtension = path.extname(sourcePath).toLowerCase();
      if (fileExtension !== ".wav") {
        this.#log(
          `File conversion required! ${fileExtension} file detected - converting to .wav`
        );
        const outputFile = path.resolve(outFolder, `${v4()}.wav`);
        const convert = new Promise((resolve) => {
          ffmpeg(sourcePath)
            .toFormat("wav")
            .on("error", (error) => {
              this.#log(`Conversion Error! ${error.message}`);
              resolve(false);
            })
            .on("progress", (progress) =>
              this.#log(
                `Conversion Processing! ${progress.targetSize}KB converted`
              )
            )
            .on("end", () => {
              this.#log(`Conversion Complete! File converted to .wav!`);
              resolve(true);
            })
            .save(outputFile);
        });
        const success = await convert;
        if (!success)
          throw new Error(
            "[Conversion Failed]: Could not convert file to .wav format!"
          );

        const chunks = [];
        const stream = fs.createReadStream(outputFile);
        for await (let chunk of stream) chunks.push(chunk);
        buffer = Buffer.concat(chunks);
        fs.rmSync(outputFile);
      } else {
        const chunks = [];
        const stream = fs.createReadStream(sourcePath);
        for await (let chunk of stream) chunks.push(chunk);
        buffer = Buffer.concat(chunks);
      }

      const wavFile = new wavefile.WaveFile(buffer);
      wavFile.toBitDepth("32f");
      wavFile.toSampleRate(16000);

      let audioData = wavFile.getSamples();
      if (Array.isArray(audioData)) {
        if (audioData.length > 1) {
          const SCALING_FACTOR = Math.sqrt(2);

          // Merge channels into first channel to save memory
          for (let i = 0; i < audioData[0].length; ++i) {
            audioData[0][i] =
              (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
          }
        }
        audioData = audioData[0];
      }

      return audioData;
    } catch (error) {
      console.error(`convertToWavAudioData`, error);
      return null;
    }
  }

  async client() {
    if (!fs.existsSync(this.modelPath)) {
      this.#log(
        `The native whisper model has never been run and will be downloaded right now. Subsequent runs will be faster. (~250MB)`
      );
    }

    try {
      // Convert ESM to CommonJS via import so we can load this library.
      const pipeline = (...args) =>
        import("@xenova/transformers").then(({ pipeline }) =>
          pipeline(...args)
        );
      return await pipeline("automatic-speech-recognition", this.model, {
        cache_dir: this.cacheDir,
        ...(!fs.existsSync(this.modelPath)
          ? {
              // Show download progress if we need to download any files
              progress_callback: (data) => {
                if (!data.hasOwnProperty("progress")) return;
                console.log(
                  `\x1b[34m[Embedding - Downloading Model Files]\x1b[0m ${
                    data.file
                  } ${~~data?.progress}%`
                );
              },
            }
          : {}),
      });
    } catch (error) {
      this.#log("Failed to load the native whisper model:", error);
      throw error;
    }
  }

  async processFile(fullFilePath, filename) {
    try {
      const transcriberPromise = new Promise((resolve) =>
        this.client().then((client) => resolve(client))
      );
      const audioDataPromise = new Promise((resolve) =>
        this.#convertToWavAudioData(fullFilePath).then((audioData) =>
          resolve(audioData)
        )
      );
      const [audioData, transcriber] = await Promise.all([
        audioDataPromise,
        transcriberPromise,
      ]);

      if (!audioData) {
        this.#log(`Failed to parse content from ${filename}.`);
        return {
          content: null,
          error: `Failed to parse content from ${filename}.`,
        };
      }

      this.#log(`Transcribing audio data to text...`);
      const { text } = await transcriber(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
      });

      return { content: text, error: null };
    } catch (error) {
      return { content: null, error: error.message };
    }
  }
}

module.exports = {
  LocalWhisper,
};
