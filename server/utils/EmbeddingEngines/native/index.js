const path = require("path");
const fs = require("fs");
const { toChunks } = require("../../helpers");

class NativeEmbedder {
  constructor() {
    this.model = "Xenova/all-MiniLM-L6-v2";
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `models`)
        : path.resolve(__dirname, `../../../storage/models`)
    );
    // Limit the number of chunks to send per loop to not overload compute.
    this.embeddingChunkLimit = 16;

    // Make directory when it does not exist in existing installations
    if (!fs.existsSync(path.resolve(this.cacheDir)))
      fs.mkdirSync(this.cacheDir);
  }

  async embedderClient() {
    if (
      !fs.existsSync(path.resolve(this.cacheDir, "Xenova", "all-MiniLM-L6-v2"))
    ) {
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
    for (const chunk of toChunks(textChunks, this.embeddingChunkLimit)) {
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
