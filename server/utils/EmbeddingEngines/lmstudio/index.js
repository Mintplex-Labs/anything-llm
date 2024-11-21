const { parseLMStudioBasePath } = require("../../AiProviders/lmStudio");
const { maximumChunkLength } = require("../../helpers");

class LMStudioEmbedder {
  constructor() {
    if (!process.env.EMBEDDING_BASE_PATH)
      throw new Error("No embedding base path was set.");
    if (!process.env.EMBEDDING_MODEL_PREF)
      throw new Error("No embedding model was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.lmstudio = new OpenAIApi({
      baseURL: parseLMStudioBasePath(process.env.EMBEDDING_BASE_PATH),
      apiKey: null,
    });
    this.model = process.env.EMBEDDING_MODEL_PREF;

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 1;
    this.embeddingMaxChunkLength = maximumChunkLength();
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
  }

  async #isAlive() {
    return await this.lmstudio.models
      .list()
      .then((res) => res?.data?.length > 0)
      .catch((e) => {
        this.log(e.message);
        return false;
      });
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    if (!(await this.#isAlive()))
      throw new Error(
        `LMStudio service could not be reached. Is LMStudio running?`
      );

    this.log(
      `Embedding ${textChunks.length} chunks of text with ${this.model}.`
    );

    // LMStudio will drop all queued requests now? So if there are many going on
    // we need to do them sequentially or else only the first resolves and the others
    // get dropped or go unanswered >:(
    let results = [];
    let hasError = false;
    for (const chunk of textChunks) {
      if (hasError) break; // If an error occurred don't continue and exit early.
      results.push(
        await this.lmstudio.embeddings
          .create({
            model: this.model,
            input: chunk,
          })
          .then((result) => {
            const embedding = result.data?.[0]?.embedding;
            if (!Array.isArray(embedding) || !embedding.length)
              throw {
                type: "EMPTY_ARR",
                message: "The embedding was empty from LMStudio",
              };
            console.log(`Embedding length: ${embedding.length}`);
            return { data: embedding, error: null };
          })
          .catch((e) => {
            e.type =
              e?.response?.data?.error?.code ||
              e?.response?.status ||
              "failed_to_embed";
            e.message = e?.response?.data?.error?.message || e.message;
            hasError = true;
            return { data: [], error: e };
          })
      );
    }

    // Accumulate errors from embedding.
    // If any are present throw an abort error.
    const errors = results
      .filter((res) => !!res.error)
      .map((res) => res.error)
      .flat();

    if (errors.length > 0) {
      let uniqueErrors = new Set();
      console.log(errors);
      errors.map((error) =>
        uniqueErrors.add(`[${error.type}]: ${error.message}`)
      );

      if (errors.length > 0)
        throw new Error(
          `LMStudio Failed to embed: ${Array.from(uniqueErrors).join(", ")}`
        );
    }

    const data = results.map((res) => res?.data || []);
    return data.length > 0 ? data : null;
  }
}

module.exports = {
  LMStudioEmbedder,
};
