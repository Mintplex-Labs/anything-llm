const { toChunks } = require("../../helpers");

class OpenRouterEmbedder {
  constructor() {
    if (!process.env.OPENROUTER_API_KEY)
      throw new Error("No OpenRouter API key was set.");
    this.className = "OpenRouterEmbedder";
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://anythingllm.com",
        "X-Title": "AnythingLLM",
      },
    });
    this.model = process.env.EMBEDDING_MODEL_PREF || "baai/bge-m3";

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    this.maxConcurrentChunks = 500;

    // https://openrouter.ai/docs/api/reference/embeddings
    this.embeddingMaxChunkLength = 8_191;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    this.log(`Embedding ${textChunks.length} document chunks...`);
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.openai.embeddings
            .create({
              model: this.model,
              input: chunk,
            })
            .then((result) => {
              resolve({ data: result?.data, error: null });
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
      // If any errors were returned from OpenAI abort the entire sequence because the embeddings
      // will be incomplete.
      const errors = results
        .filter((res) => !!res.error)
        .map((res) => res.error)
        .flat();
      if (errors.length > 0) {
        let uniqueErrors = new Set();
        errors.map((error) =>
          uniqueErrors.add(`[${error.type}]: ${error.message}`)
        );

        return {
          data: [],
          error: Array.from(uniqueErrors).join(", "),
        };
      }
      return {
        data: results.map((res) => res?.data || []).flat(),
        error: null,
      };
    });

    if (!!error) throw new Error(`OpenRouter Failed to embed: ${error}`);
    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

async function fetchOpenRouterEmbeddingModels() {
  return await fetch(`https://openrouter.ai/api/v1/embeddings/models`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then(({ data = [] }) => {
      const models = {};
      data.forEach((model) => {
        models[model.id] = {
          id: model.id,
          name: model.name || model.id,
          organization:
            model.id.split("/")[0].charAt(0).toUpperCase() +
            model.id.split("/")[0].slice(1),
          maxLength: model.context_length,
        };
      });
      return models;
    })
    .catch((e) => {
      console.error("OpenRouter:fetchEmbeddingModels", e.message);
      return {};
    });
}

module.exports = {
  OpenRouterEmbedder,
  fetchOpenRouterEmbeddingModels,
};
