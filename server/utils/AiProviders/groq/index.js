const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const { MODEL_MAP } = require("../modelMap");

class GroqLLM {
  constructor(embedder = null, modelPreference = null) {
    const { OpenAI: OpenAIApi } = require("openai");
    if (!process.env.GROQ_API_KEY) throw new Error("No Groq API key was set.");

    this.openai = new OpenAIApi({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });
    this.model =
      modelPreference || process.env.GROQ_MODEL_PREF || "llama-3.1-8b-instant";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
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

  #log(text, ...args) {
    console.log(`\x1b[32m[GroqAi]\x1b[0m ${text}`, ...args);
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    return MODEL_MAP.groq[modelName] ?? 8192;
  }

  promptWindowLimit() {
    return MODEL_MAP.groq[this.model] ?? 8192;
  }

  async isValidChatCompletionModel(modelName = "") {
    return !!modelName; // name just needs to exist
  }

  /**
   * Generates appropriate content array for a message + attachments.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return userPrompt;

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: {
          url: attachment.contentString,
        },
      });
    }
    return content.flat();
  }

  /**
   * Last Updated: October 21, 2024
   * According to https://console.groq.com/docs/vision
   * the vision models supported all make a mess of prompting depending on the model.
   * Currently the llama3.2 models are only in preview and subject to change and the llava model is deprecated - so we will not support attachments for that at all.
   *
   * Since we can only explicitly support the current models, this is a temporary solution.
   * If the attachments are empty or the model is not a vision model, we will return the default prompt structure which will work for all models.
   * If the attachments are present and the model is a vision model - we only return the user prompt with attachments - see comment at end of function for more.
   */
  #conditionalPromptStruct({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [], // This is the specific attachment for only this prompt
  }) {
    const VISION_MODELS = [
      "llama-3.2-90b-vision-preview",
      "llama-3.2-11b-vision-preview",
    ];
    const DEFAULT_PROMPT_STRUCT = [
      {
        role: "system",
        content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
      },
      ...chatHistory,
      { role: "user", content: userPrompt },
    ];

    // If there are no attachments or model is not a vision model, return the default prompt structure
    // as there is nothing to attach or do and no model limitations to consider
    if (!attachments.length) return DEFAULT_PROMPT_STRUCT;
    if (!VISION_MODELS.includes(this.model)) {
      this.#log(
        `${this.model} is not an explicitly supported vision model! Will omit attachments.`
      );
      return DEFAULT_PROMPT_STRUCT;
    }

    return [
      // Why is the system prompt and history commented out?
      // The current vision models for Groq perform VERY poorly with ANY history or text prior to the image.
      // In order to not get LLM refusals for every single message, we will not include the "system prompt" or even the chat history.
      // This is a temporary solution until Groq fixes their vision models to be more coherent and also handle context prior to the image.
      // Note for the future:
      // Groq vision models also do not support system prompts - which is why you see the user/assistant emulation used instead of "system".
      // This means any vision call is assessed independently of the chat context prior to the image.
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // {
      //   role: "user",
      //   content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
      // },
      // {
      //   role: "assistant",
      //   content: "OK",
      // },
      // ...chatHistory,
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
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
    attachments = [], // This is the specific attachment for only this prompt
  }) {
    // NOTICE: SEE GroqLLM.#conditionalPromptStruct for more information on how attachments are handled with Groq.
    return this.#conditionalPromptStruct({
      systemPrompt,
      contextTexts,
      chatHistory,
      userPrompt,
      attachments,
    });
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `GroqAI:chatCompletion: ${this.model} is not valid for chat completion!`
      );

    const result = await this.openai.chat.completions
      .create({
        model: this.model,
        messages,
        temperature,
      })
      .catch((e) => {
        throw new Error(e.message);
      });

    if (!result.hasOwnProperty("choices") || result.choices.length === 0)
      return null;
    return result.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `GroqAI:streamChatCompletion: ${this.model} is not valid for chat completion!`
      );

    const streamRequest = await this.openai.chat.completions.create({
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

module.exports = {
  GroqLLM,
};
