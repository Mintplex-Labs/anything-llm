const path = require("path");
const fs = require("fs");
const { toChunks } = require("../../helpers");

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

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 50;
    this.embeddingMaxChunkLength = 1_000;

    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir);
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

  async embedChunks(textChunks = []) {
    const Embedder = await this.embedderClient();
    const embeddingResults = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      const output = await Embedder(chunk, {
        pooling: "mean",
        normalize: true,
      });
      if (output.length === 0) continue;
      embeddingResults.push(output.tolist());
    }

    return embeddingResults.length > 0 ? embeddingResults.flat() : null;
  }
}

module.exports = {
  NativeEmbedder,
};
