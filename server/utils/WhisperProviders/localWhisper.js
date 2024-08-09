const fs = require("fs");
const path = require("path");
const defaultWhisper = "Xenova/whisper-large"; // Model Card: https://huggingface.co/Xenova/whisper-tiny
const fileSize = {
  "Xenova/whisper-tiny": "50mb",
  "Xenova/whisper-small": "250mb",
  "Xenova/whisper-large": "1.56GB",
};

class LocalWhisper {
  constructor({ options }) {
    this.isDistilWhisper = false;
    this.model = options?.model ?? defaultWhisper;
    this.fileSize = fileSize[this.model];
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `models`)
        : path.resolve(__dirname, `../../storage/models`)
    );

    this.modelPath = path.resolve(this.cacheDir, ...this.model.split("/"));
    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir))
      fs.mkdirSync(this.cacheDir, { recursive: true });

    this.#log(`Initialized with ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[LocalWhisper]\x1b[0m ${text}`, ...args);
  }

  /**
   * Get Transcription client
   * @returns {Promise<import("@xenova/transformers").AutomaticSpeechRecognitionPipeline>}
   */
  async client() {
    if (!fs.existsSync(this.modelPath)) {
      this.#log(
        `The native whisper model has never been run and will be downloaded right now. Subsequent runs will be faster. (~${this.fileSize})`
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
                  `\x1b[34m[Whisper - Downloading Model Files]\x1b[0m ${
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

  /**
   * Transcribe an audio stream into text with the class's model
   * @param {{audio: Float32Array, language: string|null}} parameters
   * @returns {Promise<any>}
   */
  async transcribe({ audio, language = null }) {
    const transcriber = await this.client();
    const time_precision =
      transcriber.processor.feature_extractor.config.chunk_length /
      transcriber.model.config.max_source_positions;

    // Storage for chunks to be processed. Initialize with an empty chunk.
    let chunks_to_process = [{ tokens: [], finalized: false }];

    function chunk_callback(chunk) {
      let last = chunks_to_process[chunks_to_process.length - 1];

      // Overwrite last chunk with new info
      Object.assign(last, chunk);
      last.finalised = true;

      // Create an empty chunk after, if it not the last chunk
      if (!chunk.is_last) {
        chunks_to_process.push({
          tokens: [],
          finalised: false,
        });
      }
    }

    // Inject custom callback function to handle merging of chunks
    function callback_function(item) {
      let last = chunks_to_process[chunks_to_process.length - 1];

      // Update tokens of last chunk
      last.tokens = [...item[0].output_token_ids];

      // Merge text chunks
      // TODO optimize so we don't have to decode all chunks every time
      let data = transcriber.tokenizer._decode_asr(chunks_to_process, {
        time_precision: time_precision,
        return_timestamps: true,
        force_full_sequences: false,
      });
      console.log("update event", data);
    }

    const output = await transcriber(audio, {
      // Greedy
      // top_k: 0,
      // do_sample: false,

      // Sliding window
      chunk_length_s: this.isDistilWhisper ? 20 : 30,
      stride_length_s: this.isDistilWhisper ? 3 : 5,

      // Language and task
      // language: language,
      // task: null,

      // Return timestamps
      // return_timestamps: true,
      // force_full_sequences: false,

      // // Callback functions
      // callback_function: callback_function, // after each generation step
      // chunk_callback: chunk_callback, // after each chunk is processed
    }).catch((error) => {
      console.error("Error", error);
      return null;
    });

    return output;
  }
}

module.exports = {
  LocalWhisper,
};
