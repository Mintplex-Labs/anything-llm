const { toChunks } = require("../../helpers");

class AzureOpenAiEmbedder {
  constructor() {
    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    if (!process.env.AZURE_OPENAI_ENDPOINT)
      throw new Error("No Azure API endpoint was set.");
    if (!process.env.AZURE_OPENAI_KEY)
      throw new Error("No Azure API key was set.");

    const openai = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
    );
    this.openai = openai;

    // Limit of how many strings we can process in a single pass to stay with resource or network limits
    // https://learn.microsoft.com/en-us/azure/ai-services/openai/faq#i-am-trying-to-use-embeddings-and-received-the-error--invalidrequesterror--too-many-inputs--the-max-number-of-inputs-is-1---how-do-i-fix-this-:~:text=consisting%20of%20up%20to%2016%20inputs%20per%20API%20request
    this.maxConcurrentChunks = 12;

    // https://learn.microsoft.com/en-us/answers/questions/1188074/text-embedding-ada-002-token-context-length
    //
    // AL: 2025-03-08
    // Digging deeper, it seems that Microsoft now allows a max of 8192 tokens (or 2048 if pushed in an array)
    // see https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/embeddings?tabs=console
    // The value below is used as the number of CHARACTERS (not tokens).  Since we are of the opinion that longer content
    // is better, we increase embeddingMaxChunkLength to 2048 * 2.5
    // This takes into account the average number of characters per word in English (~4.5) and the fact that there may be multiple
    // tokens per word.
    // Rough back of the envelope calculation is (2048 * 2.5) / 4.5 = 1150 words = 1150 * 8/6 = 1550 tokens
    // Assuming that we might send arrays over this gives us a 25% buffer.
    // This sets the maximum chunk length, we can configure on the UI to reduce it if needed
    this.embeddingMaxChunkLength = 5120;
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const textEmbeddingModel =
      process.env.EMBEDDING_MODEL_PREF || "text-embedding-3-large";
    if (!textEmbeddingModel)
      throw new Error(
        "No EMBEDDING_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an embedding model."
      );

    // Because there is a limit on how many chunks can be sent at once to Azure OpenAI
    // we concurrently execute each max batch of text chunks possible.
    // Refer to constructor maxConcurrentChunks for more info.
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.openai
            .getEmbeddings(textEmbeddingModel, chunk)
            .then((res) => {
              resolve({ data: res.data, error: null });
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
      // If any errors were returned from Azure abort the entire sequence because the embeddings
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

    if (!!error) throw new Error(`Azure OpenAI Failed to embed: ${error}`);
    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  AzureOpenAiEmbedder,
};
