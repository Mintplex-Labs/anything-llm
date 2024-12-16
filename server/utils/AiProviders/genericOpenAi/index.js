const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { toValidNumber } = require("../../http");

class GenericOpenAiLLM {
  constructor(embedder = null, modelPreference = null) {
    const { OpenAI: OpenAIApi } = require("openai");
    if (!process.env.GENERIC_OPEN_AI_BASE_PATH)
      throw new Error(
        "GenericOpenAI must have a valid base path to use for the api."
      );

    this.basePath = process.env.GENERIC_OPEN_AI_BASE_PATH;
    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey: process.env.GENERIC_OPEN_AI_API_KEY ?? null,
    });
    this.model =
      modelPreference ?? process.env.GENERIC_OPEN_AI_MODEL_PREF ?? null;
    this.maxTokens = process.env.GENERIC_OPEN_AI_MAX_TOKENS
      ? toValidNumber(process.env.GENERIC_OPEN_AI_MAX_TOKENS, 1024)
      : 1024;
    if (!this.model)
      throw new Error("GenericOpenAI must have a valid model set.");
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(`Inference API: ${this.basePath} Model: ${this.model}`);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.constructor.name}]\x1b[0m ${text}`, ...args);
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
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(_modelName) {
    const limit = process.env.GENERIC_OPEN_AI_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No token context limit was set.");
    return Number(limit);
  }

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const limit = process.env.GENERIC_OPEN_AI_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No token context limit was set.");
    return Number(limit);
  }

  // Short circuit since we have no idea if the model is valid or not
  // in pre-flight for generic endpoints
  isValidChatCompletionModel(_modelName = "") {
    return true;
  }

  /**
   * Generates appropriate content array for a message + attachments.
   *
   * ## Developer Note
   * This function assumes the generic OpenAI provider is _actually_ OpenAI compatible.
   * For example, Ollama is "OpenAI compatible" but does not support images as a content array.
   * The contentString also is the base64 string WITH `data:image/xxx;base64,` prefix, which may not be the case for all providers.
   * If your provider does not work exactly this way, then attachments will not function or potentially break vision requests.
   * If you encounter this issue, you are welcome to open an issue asking for your specific provider to be supported.
   *
   * This function will **not** be updated for providers that **do not** support images as a content array like OpenAI does.
   * Do not open issues to update this function due to your specific provider not being compatible. Open an issue to request support for your specific provider.
   * @param {Object} props
   * @param {string} props.userPrompt - the user prompt to be sent to the model
   * @param {import("../../helpers").Attachment[]} props.attachments - the array of attachments to be sent to the model
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) {
      return userPrompt;
    }

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: {
          url: attachment.contentString,
          detail: "high",
        },
      });
    }
    return content.flat();
  }

  /**
   * Construct the user prompt for this model.
   * @param {{attachments: import("../../helpers").Attachment[]}} param0
   * @returns
   */
  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...chatHistory,
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const result = await this.openai.chat.completions
      .create({
        model: this.model,
        messages,
        temperature,
        max_tokens: this.maxTokens,
      })
      .catch((e) => {
        throw new Error(e.message);
      });

    if (!result.hasOwnProperty("choices") || result.choices.length === 0)
      return null;
    return result.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const streamRequest = await this.openai.chat.completions.create({
      model: this.model,
      stream: true,
      messages,
      temperature,
      max_tokens: this.maxTokens,
    });
    return streamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
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
  GenericOpenAiLLM,
};
