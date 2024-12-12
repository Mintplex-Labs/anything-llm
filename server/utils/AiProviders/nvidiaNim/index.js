const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");

class NvidiaNimLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.NVIDIA_NIM_LLM_BASE_PATH)
      throw new Error("No Nvidia NIM API Base Path was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.nvidiaNim = new OpenAIApi({
      baseURL: parseNvidiaNimBasePath(process.env.NVIDIA_NIM_LLM_BASE_PATH),
      apiKey: null,
    });

    this.model = modelPreference || process.env.NVIDIA_NIM_LLM_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.#log(
      `Loaded with model: ${this.model} with context window: ${this.promptWindowLimit()}`
    );
  }

  #log(text, ...args) {
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

  /**
   * Set the model token limit `NVIDIA_NIM_LLM_MODEL_TOKEN_LIMIT` for the given model ID
   * @param {string} modelId
   * @param {string} basePath
   * @returns {Promise<void>}
   */
  static async setModelTokenLimit(modelId, basePath = null) {
    if (!modelId) return;
    const { OpenAI: OpenAIApi } = require("openai");
    const openai = new OpenAIApi({
      baseURL: parseNvidiaNimBasePath(
        basePath || process.env.NVIDIA_NIM_LLM_BASE_PATH
      ),
      apiKey: null,
    });
    const model = await openai.models
      .list()
      .then((results) => results.data)
      .catch(() => {
        return [];
      });

    if (!model.length) return;
    const modelInfo = model.find((model) => model.id === modelId);
    if (!modelInfo) return;
    process.env.NVIDIA_NIM_LLM_MODEL_TOKEN_LIMIT = Number(
      modelInfo.max_model_len || 4096
    );
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(_modelName) {
    const limit = process.env.NVIDIA_NIM_LLM_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No Nvidia NIM token context limit was set.");
    return Number(limit);
  }

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const limit = process.env.NVIDIA_NIM_LLM_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No Nvidia NIM token context limit was set.");
    return Number(limit);
  }

  async isValidChatCompletionModel(_ = "") {
    return true;
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
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
          detail: "auto",
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
    if (!this.model)
      throw new Error(
        `Nvidia NIM chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const result = await this.nvidiaNim.chat.completions.create({
      model: this.model,
      messages,
      temperature,
    });

    if (!result.hasOwnProperty("choices") || result.choices.length === 0)
      return null;
    return result.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!this.model)
      throw new Error(
        `Nvidia NIM chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const streamRequest = await this.nvidiaNim.chat.completions.create({
      model: this.model,
      stream: true,
      messages,
      temperature,
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

/**
 * Parse the base path for the Nvidia NIM container API. Since the base path must end in /v1 and cannot have a trailing slash,
 * and the user can possibly set it to anything and likely incorrectly due to pasting behaviors, we need to ensure it is in the correct format.
 * @param {string} basePath
 * @returns {string}
 */
function parseNvidiaNimBasePath(providedBasePath = "") {
  try {
    const baseURL = new URL(providedBasePath);
    const basePath = `${baseURL.origin}/v1`;
    return basePath;
  } catch (e) {
    return providedBasePath;
  }
}

module.exports = {
  NvidiaNimLLM,
  parseNvidiaNimBasePath,
};
