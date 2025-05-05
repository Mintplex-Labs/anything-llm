const { toChunks } = require("../../helpers");

/**
 * Gemini embeddings engine implementation for generating vector embeddings
 */
class GeminiEmbedder {
  constructor() {
    if (!process.env.GEMINI_EMBEDDING_API_KEY) {
      throw new Error("No Gemini API key was set.");
    }

    const { OpenAI: OpenAIApi } = require("openai");
    
    // Configure the embedding model and client
    this.model = process.env.EMBEDDING_MODEL_PREF || "text-embedding-004";
    this.openai = new OpenAIApi({
      apiKey: process.env.GEMINI_EMBEDDING_API_KEY,
      // Even models that are v1 in gemini API can be used with v1beta/openai/ endpoint
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    // Embedding configuration
    this.maxConcurrentChunks = 4;
    
    // Set max chunk length based on model - newer models support longer context
    this.embeddingMaxChunkLength = this.model === "gemini-embedding-exp-03-07" 
      ? 8_192 
      : 2_048;
      
    this.log(`Initialized with ${this.model} (max tokens: ${this.embeddingMaxChunkLength})`);
  }

  /**
   * Helper to output consistent log messages
   */
  log(text, ...args) {
    console.log(`\x1b[36m[GeminiEmbedder]\x1b[0m ${text}`, ...args);
  }

  /**
   * Embeds a single text input
   * @param {string|string[]} textInput - The text to embed
   * @returns {Promise<Array<number>>} The embedding values
   */
  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  /**
   * Embeds a list of text inputs
   * @param {Array<string>} textChunks - The list of text to embed
   * @returns {Promise<Array<Array<number>>>} The embedding values
   */
  async embedChunks(textChunks = []) {
    this.log(`Embedding ${textChunks.length} chunks...`);

    // Because there is a hard POST limit on how many chunks can be sent at once to OpenAI (~8mb)
    // we concurrently execute each max batch of text chunks possible.
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
            .catch((error) => {
              const errorType = 
                error?.response?.data?.error?.code ||
                error?.response?.status ||
                "failed_to_embed";
                
              const errorMessage = error?.response?.data?.error?.message || error.message;
              
              error.type = errorType;
              error.message = errorMessage;
              resolve({ data: [], error });
            });
        })
      );
    }

    const { data = [], error = null } = await Promise.all(embeddingRequests)
      .then((results) => {
        // If any errors were returned from OpenAI abort the entire sequence because the embeddings
        // will be incomplete.
        const errors = results
          .filter((res) => !!res.error)
          .map((res) => res.error)
          .flat();
          
        if (errors.length > 0) {
          const uniqueErrors = new Set();
          errors.forEach((error) =>
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

    if (!!error) {
      throw new Error(`OpenAI Failed to embed: ${error}`);
    }
    
    // Ensure we have valid embeddings before returning
    return data.length > 0 && data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  GeminiEmbedder,
};
