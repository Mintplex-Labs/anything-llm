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
    this.maxConcurrentChunks = 50;
    this.embeddingMaxChunkLength = 1_000;

    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir);
    this.pipeline = (...args) => import("@xenova/transformers").then(({ pipeline }) => pipeline(...args))
  }

  async embedderClient() {
    if (!fs.existsSync(this.modelPath)) {
      console.log(
        "\x1b[34m[INFO]\x1b[0m The native embedding model has never been run and will be downloaded right now. Subsequent runs will be faster. (~23MB)\n\n"
      );
    }

    try {
      // Convert ESM to CommonJS via import so we can load this library.
      return await this.pipeline("feature-extraction", this.model, {
        cache_dir: this.cacheDir,
        ...(!fs.existsSync(this.modelPath)
          ? {
            // Show download progress if we need to download any files
            progress_callback: (data) => {
              if (!data.hasOwnProperty("progress")) return;
              console.log(
                `\x1b[34m[Embedding - Downloading Model Files]\x1b[0m ${data.file
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

  writeToOut(filePath, data) {
    let fd = 0;
    try {
      fd = fs.openSync(filePath, 'w', 0o666);
      let writer = fs.writeSync(fd, data, 0, 'utf8');
    } catch (e) {
    } finally {
      if (fd) console.log('Closing.')
      if (fd) fs.closeSync(fd);
    }
  }

  async embedChunks(textChunks = []) {
    const Embedder = await this.embedderClient();
    const filename = `${v4()}.tmp`;
    const tmpPath = path.resolve(__dirname, '../../../storage/tmp', filename)
    const chunks = toChunks(textChunks, this.maxConcurrentChunks);


    for (const [idx, chunk] of chunks.entries()) {
      // if (idx === 0) this.writeToOut(tmpPath, '[');
      await Embedder(chunk, {
        pooling: "mean",
        normalize: true,
      })
      console.log(`run ${idx} on chunk of ${chunk.length}`)

      // let output = await Embedder(chunk, {
      //   pooling: "mean",
      //   normalize: true,
      // })

      // if (output.length === 0) continue;
      // let data = JSON.stringify(output.tolist());
      // this.writeToOut(tmpPath, data)
      // console.log(`wrote ${data.length} bytes`)
      // if (chunks.length - 1 !== idx) this.writeToOut(tmpPath, ',')
      // if (chunks.length - 1 === idx) this.writeToOut(tmpPath, ']');
      // data = null;
      // output = null;
      global.gc ? global?.gc() : null
    }

    // const embeddingResults = JSON.parse(fs.readFileSync(tmpPath, { encoding: 'utf-8' }))
    // fs.rmSync(tmpPath, { force: true });
    // return embeddingResults.length > 0 ? embeddingResults.flat() : null;
    return null
  }
}

module.exports = {
  NativeEmbedder,
};
