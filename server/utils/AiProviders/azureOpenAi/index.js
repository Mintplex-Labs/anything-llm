const { AzureOpenAiEmbedder } = require("../../EmbeddingEngines/azureOpenAi");
const { chatPrompt } = require("../../chats");

class AzureOpenAiLLM {
  constructor(embedder = null) {
    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    if (!process.env.AZURE_OPENAI_ENDPOINT)
      throw new Error("No Azure API endpoint was set.");
    if (!process.env.AZURE_OPENAI_KEY)
      throw new Error("No Azure API key was set.");

    this.openai = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
    );
    this.model = process.env.OPEN_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      console.warn(
        "No embedding provider defined for AzureOpenAiLLM - falling back to AzureOpenAiEmbedder for embedding!"
      );
    this.embedder = !embedder ? new AzureOpenAiEmbedder() : embedder;
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts || !contextTexts.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => {
          return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
        })
        .join("")
    );
  }

  streamingEnabled() {
    return "streamChat" in this && "streamGetChatCompletion" in this;
  }

  // Sure the user selected a proper value for the token limit
  // could be any of these https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#gpt-4-models
  // and if undefined - assume it is the lowest end.
  promptWindowLimit() {
    return !!process.env.AZURE_OPENAI_TOKEN_LIMIT
      ? Number(process.env.AZURE_OPENAI_TOKEN_LIMIT)
      : 4096;
  }

  isValidChatCompletionModel(_modelName = "") {
    // The Azure user names their "models" as deployments and they can be any name
    // so we rely on the user to put in the correct deployment as only they would
    // know it.
    return true;
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
  }

  async isSafe(_input = "") {
    // Not implemented by Azure OpenAI so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const messages = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: prompt,
        chatHistory,
      },
      rawHistory
    );
    const textResponse = await this.openai
      .getChatCompletions(this.model, messages, {
        temperature: Number(workspace?.openAiTemp ?? 0.7),
        n: 1,
      })
      .then((res) => {
        if (!res.hasOwnProperty("choices"))
          throw new Error("AzureOpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("AzureOpenAI chat: No results length!");
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

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const messages = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: prompt,
        chatHistory,
      },
      rawHistory
    );
    const stream = await this.openai.streamChatCompletions(
      this.model,
      messages,
      {
        temperature: Number(workspace?.openAiTemp ?? 0.7),
        n: 1,
      }
    );
    return { type: "azureStream", stream };
  }

  async getChatCompletion(messages = [], { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const data = await this.openai.getChatCompletions(this.model, messages, {
      temperature,
    });
    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = [], { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        "No OPEN_MODEL_PREF ENV defined. This must the name of a deployment on your Azure account for an LLM chat model like GPT-3.5."
      );

    const stream = await this.openai.streamChatCompletions(
      this.model,
      messages,
      {
        temperature,
        n: 1,
      }
    );
    return { type: "azureStream", stream };
  }

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  AzureOpenAiLLM,
};
