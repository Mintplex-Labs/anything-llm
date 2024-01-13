const path = require("path");
const fs = require("fs");
const { toChunks } = require("../../helpers");
const { v4 } = require("uuid");

class NativeEmbedder {
  constructor() {
    // Model Card: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
    this.model = "Xenova/all-MiniLM-L6-v2";
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `models`)
        : path.resolve(__dirname, `../../../storage/models`)
    );
    this.modelPath = path.resolve(this.cacheDir, "Xenova", "all-MiniLM-L6-v2");
    this.dimensions = 384;

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 25;
    this.embeddingMaxChunkLength = 1_000;

    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir);
  }

  #tempfilePath() {
    const filename = `${v4()}.tmp`;
    const tmpPath = process.env.STORAGE_DIR
      ? path.resolve(process.env.STORAGE_DIR, "tmp")
      : path.resolve(__dirname, `../../../storage/tmp`);
    if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath, { recursive: true });
    return path.resolve(tmpPath, filename);
  }

  async #writeToTempfile(filePath, data) {
    try {
      await fs.promises.appendFile(filePath, data, { encoding: "utf8" });
    } catch (e) {
      console.error(`Error writing to tempfile: ${e}`);
    }
  }

  async embedderClient() {
    if (!fs.existsSync(this.modelPath)) {
      console.log(
        "\x1b[34m[INFO]\x1b[0m The native embedding model has never been run and will be downloaded right now. Subsequent runs will be faster. (~23MB)\n\n"
      );
    }

    try {
      // Convert ESM to CommonJS via import so we can load this library.
      const pipeline = (...args) =>
        import("@xenova/transformers").then(({ pipeline }) =>
          pipeline(...args)
        );
      return await pipeline("feature-extraction", this.model, {
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
      console.error("Failed to load the native embedding model:", error);
      throw error;
    }
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(textInput);
    return result?.[0] || [];
  }

  // If you are thinking you want to edit this function - you probably don't.
  // This process was benchmarked heavily on a t3.small (2GB RAM 1vCPU)
  // and without careful memory management for the V8 garbage collector
  // this function will likely result in an OOM on any resource-constrained deployment.
  // To help manage very large documents we run a concurrent write-log each iteration
  // to keep the embedding result out of memory. The `maxConcurrentChunk` is set to 25,
  // as 50 seems to overflow no matter what. Given the above, memory use hovers around ~30%
  // during a very large document (>100K words) but can spike up to 70% before gc.
  // This seems repeatable for all document sizes.
  // While this does take a while, it is zero set up and is 100% free and on-instance.
  async embedChunks(textChunks = []) {
    const tmpFilePath = this.#tempfilePath();
    const chunks = toChunks(textChunks, this.maxConcurrentChunks);
    const chunkLen = chunks.length;

    for (let [idx, chunk] of chunks.entries()) {
      if (idx === 0) await this.#writeToTempfile(tmpFilePath, "[");
      let data;
      let pipeline = await this.embedderClient();
      let output = await pipeline(chunk, {
        pooling: "mean",
        normalize: true,
      });

      if (output.length === 0) {
        pipeline = null;
        output = null;
        data = null;
        continue;
      }

      data = JSON.stringify(output.tolist());
      await this.#writeToTempfile(tmpFilePath, data);
      console.log(`\x1b[34m[Embedded Chunk ${idx + 1} of ${chunkLen}]\x1b[0m`);
      if (chunkLen - 1 !== idx) await this.#writeToTempfile(tmpFilePath, ",");
      if (chunkLen - 1 === idx) await this.#writeToTempfile(tmpFilePath, "]");
      pipeline = null;
      output = null;
      data = null;
    }

    const embeddingResults = JSON.parse(
      fs.readFileSync(tmpFilePath, { encoding: "utf-8" })
    );
    fs.rmSync(tmpFilePath, { force: true });
    return embeddingResults.length > 0 ? embeddingResults.flat() : null;
  }
}

module.exports = {
  NativeEmbedder,
};
