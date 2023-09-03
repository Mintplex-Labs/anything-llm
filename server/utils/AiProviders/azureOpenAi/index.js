const { toChunks } = require("../../helpers");

class AzureOpenAi {
  constructor() {
    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    const openai = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
    );
    this.openai = openai;

    // The maximum amount of "inputs" that OpenAI API can process in a single call.
    // https://learn.microsoft.com/en-us/azure/ai-services/openai/faq#i-am-trying-to-use-embeddings-and-received-the-error--invalidrequesterror--too-many-inputs--the-max-number-of-inputs-is-1---how-do-i-fix-this-:~:text=consisting%20of%20up%20to%2016%20inputs%20per%20API%20request
    this.embeddingChunkLimit = 16;
  }

  isValidChatModel(_modelName = "") {
    // The Azure user names their "models" as deployments and they can be any name
    // so we rely on the user to put in the correct deployment as only they would
    // know it.
    return true;
  }

  async isSafe(_input = "") {
    // Not implemented by Azure OpenAI so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}) {
    const model = process.env.OPEN_MODEL_PREF;
    if (!model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const textResponse = await this.openai
      .getChatCompletions(
        model,
        [
          { role: "system", content: "" },
          ...chatHistory,
          { role: "user", content: prompt },
        ],
        {
          temperature: Number(workspace?.openAiTemp ?? 0.7),
          n: 1,
        }
      )
      .then((res) => {
        if (!res.hasOwnProperty("choices"))
          throw new Error("OpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("OpenAI chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        console.log(error);
        throw new Error(
          `AzureOpenAI::getChatCompletions failed with: ${error.message}`
        );
      });
    return textResponse;
  }

  async getChatCompletion(messages = [], { temperature = 0.7 }) {
    const model = process.env.OPEN_MODEL_PREF;
    if (!model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const data = await this.openai.getChatCompletions(model, messages, {
      temperature,
    });
    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(textInput);
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const textEmbeddingModel =
      process.env.EMBEDDING_MODEL_PREF || "text-embedding-ada-002";
    if (!textEmbeddingModel)
      throw new Error(
        "No EMBEDDING_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an embedding model."
      );

    // Because there is a limit on how many chunks can be sent at once to Azure OpenAI
    // we concurrently execute each max batch of text chunks possible.
    // Refer to constructor embeddingChunkLimit for more info.
    const embeddingRequests = [];
    for (const chunk of toChunks(textChunks, this.embeddingChunkLimit)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          this.openai
            .getEmbeddings(textEmbeddingModel, chunk)
            .then((res) => {
              resolve({ data: res.data, error: null });
            })
            .catch((e) => {
              resolve({ data: [], error: e?.error });
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
        return {
          data: [],
          error: `(${errors.length}) Embedding Errors! ${errors
            .map((error) => `[${error.type}]: ${error.message}`)
            .join(", ")}`,
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
  AzureOpenAi,
};
