const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { v4: uuidv4 } = require("uuid");

class Portkey {
  constructor(embedder = null, modelPreference = null) {
    const { OpenAI: OpenAIApi } = require("openai");

    // Get system settings - handles both UI settings and .env
    const { SystemSettings } = require("../../../models/systemSettings");
    const settings = SystemSettings.llmPreferenceKeys();

    if (!settings?.PortkeyBasePath && !process.env.PORTKEY_BASE_PATH)
      throw new Error("Portkey must have a valid base path to use for the api.");

    // UI settings take precedence over .env
    const apiKey = settings?.PortkeyApiKey ? 
      (settings.PortkeyApiKey === true ? process.env.PORTKEY_API_KEY : settings.PortkeyApiKey) : 
      process.env.PORTKEY_API_KEY;

    if (!apiKey) 
      throw new Error("Portkey API Key is required.");

    const configSlug = settings?.PortkeyConfigSlug || process.env.PORTKEY_CONFIG_SLUG;
    const virtualKey = settings?.PortkeyVirtualKey || process.env.PORTKEY_VIRTUAL_KEY;
      
    if (!configSlug && !virtualKey)
      throw new Error("Either Portkey Config Slug or Virtual Key is required.");

    this.basePath = settings?.PortkeyBasePath || process.env.PORTKEY_BASE_PATH;
    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey,
      defaultHeaders: {
        'x-portkey-config-slug': configSlug || '',
        'x-portkey-virtual-key': virtualKey || ''
      }
    });
    
    this.model = modelPreference ?? settings?.PortkeyModelPref ?? process.env.PORTKEY_MODEL_PREF ?? "gpt-3.5-turbo";
    this.maxTokens = settings?.PortkeyTokenLimit ?? process.env.PORTKEY_MODEL_TOKEN_LIMIT ?? 4096;
    
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      console.warn(
        "No embedding provider defined for Portkey - falling back to NativeEmbedder for embedding!"
      );
    this.embedder = !embedder ? new NativeEmbedder() : embedder;
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
    return true;
  }

  promptWindowLimit() {
    const limit = process.env.PORTKEY_MODEL_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No token context limit was set.");
    return Number(limit);
  }

  isValidChatCompletionModel(_modelName = "") {
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
    return { safe: true, reasons: [] };
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    try {
      const result = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        temperature,
        max_tokens: parseInt(this.maxTokens),
      });

      if (!result.hasOwnProperty("choices") || result.choices.length === 0)
        return null;
      return result.choices[0].message.content;
    } catch (error) {
      console.error("Portkey API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || error.message);
    }
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    try {
      const streamRequest = await this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
        max_tokens: parseInt(this.maxTokens),
      });
      return streamRequest;
    } catch (error) {
      console.error("Portkey API Streaming Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || error.message);
    }
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";

      const handleAbort = () => clientAbortedHandler(resolve, fullText);
      response.on("close", handleAbort);

      try {
        for await (const chunk of stream) {
          const message = chunk?.choices?.[0];
          const token = message?.delta?.content;

          if (token) {
            fullText += token;
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: token,
              close: false,
              error: false,
            });
          }

          if (message.finish_reason || message.finish_reason === "stop") {
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });
            response.removeListener("close", handleAbort);
            resolve(fullText);
          }
        }
      } catch (error) {
        console.error("Stream handling error:", error);
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: error.message,
        });
        response.removeListener("close", handleAbort);
        resolve(fullText);
      }
    });
  }

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
  Portkey,
};