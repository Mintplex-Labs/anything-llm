const { toChunks } = require("../../helpers");

class CohereEmbedder {
  constructor() {
    if (!process.env.COHERE_API_KEY)
      throw new Error("No Cohere API key was set.");

    const { CohereClient } = require("cohere-ai");
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });

    this.cohere = cohere;
    this.model = process.env.EMBEDDING_MODEL_PREF || "embed-english-v3.0";
    this.inputType = "search_document";

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 96; // Cohere's limit per request is 96
    this.embeddingMaxChunkLength = 1945; // https://docs.cohere.com/docs/embed-2 - assume a token is roughly 4 letters with some padding
  }

  async embedTextInput(textInput) {
    this.inputType = "search_query";
    const result = await this.embedChunks([textInput]);
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const embeddingRequests = [];
    this.inputType = "search_document";

    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.cohere
            .embed({
              texts: chunk,
              model: this.model,
              inputType: this.inputType,
            })
            .then((res) => {
              resolve({ data: res.embeddings, error: null });
            })
            .catch((e) => {
              e.type =
                e?.response?.data?.error?.code ||
                e?.response?.status ||
                "failed_to_embed";
              e.message = e?.response?.data?.error?.message || e.message;
              resolve({ data: [], error: e });
            });
        })
      );
    }

    const { data = [], error = null } = await Promise.all(
      embeddingRequests
    ).then((results) => {
      const errors = results
        .filter((res) => !!res.error)
        .map((res) => res.error)
        .flat();

      if (errors.length > 0) {
        let uniqueErrors = new Set();
        errors.map((error) =>
          uniqueErrors.add(`[${error.type}]: ${error.message}`)
        );
        return { data: [], error: Array.from(uniqueErrors).join(", ") };
      }

      return {
        data: results.map((res) => res?.data || []).flat(),
        error: null,
      };
    });

    if (!!error) throw new Error(`Cohere Failed to embed: ${error}`);

    return data.length > 0 ? data : null;
  }
}

module.exports = {
  CohereEmbedder,
};
