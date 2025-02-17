const fs = require("fs");
const path = require("path");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  writeResponseChunk,
  clientAbortedHandler,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const { MODEL_MAP } = require("../modelMap");
const { defaultGeminiModels, v1BetaModels } = require("./defaultModels");
const { safeJsonParse } = require("../../http");
const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "gemini")
    : path.resolve(__dirname, `../../../storage/models/gemini`)
);

class GeminiLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.GEMINI_API_KEY)
      throw new Error("No Gemini API key was set.");

    // Docs: https://ai.google.dev/tutorials/node_quickstart
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model =
      modelPreference || process.env.GEMINI_LLM_MODEL_PREF || "gemini-pro";
    this.gemini = genAI.getGenerativeModel(
      { model: this.model },
      {
        apiVersion:
          /**
           * There are some models that are only available in the v1beta API
           * and some models that are only available in the v1 API
           * generally, v1beta models have `exp` in the name, but not always
           * so we check for both against a static list as well.
           * @see {v1BetaModels}
           */
          this.model.includes("exp") || v1BetaModels.includes(this.model)
            ? "v1beta"
            : "v1",
      }
    );
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7; // not used for Gemini
    this.safetyThreshold = this.#fetchSafetyThreshold();

    if (!fs.existsSync(cacheFolder))
      fs.mkdirSync(cacheFolder, { recursive: true });
    this.cacheModelPath = path.resolve(cacheFolder, "models.json");
    this.cacheAtPath = path.resolve(cacheFolder, ".cached_at");
    this.#log(
      `Initialized with model: ${this.model} (${this.promptWindowLimit()})`
    );
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[GeminiLLM]\x1b[0m ${text}`, ...args);
  }

  // This checks if the .cached_at file has a timestamp that is more than 1Week (in millis)
  // from the current date. If it is, then we will refetch the API so that all the models are up
  // to date.
  static cacheIsStale() {
    const MAX_STALE = 6.048e8; // 1 Week in MS
    if (!fs.existsSync(path.resolve(cacheFolder, ".cached_at"))) return true;
    const now = Number(new Date());
    const timestampMs = Number(
      fs.readFileSync(path.resolve(cacheFolder, ".cached_at"))
    );
    return now - timestampMs > MAX_STALE;
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

  // BLOCK_NONE can be a special candidate for some fields
  // https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/configure-safety-attributes#how_to_remove_automated_response_blocking_for_select_safety_attributes
  // so if you are wondering why BLOCK_NONE still failed, the link above will explain why.
  #fetchSafetyThreshold() {
    const threshold =
      process.env.GEMINI_SAFETY_SETTING ?? "BLOCK_MEDIUM_AND_ABOVE";
    const safetyThresholds = [
      "BLOCK_NONE",
      "BLOCK_ONLY_HIGH",
      "BLOCK_MEDIUM_AND_ABOVE",
      "BLOCK_LOW_AND_ABOVE",
    ];
    return safetyThresholds.includes(threshold)
      ? threshold
      : "BLOCK_MEDIUM_AND_ABOVE";
  }

  #safetySettings() {
    return [
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: this.safetyThreshold,
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: this.safetyThreshold,
      },
      { category: "HARM_CATEGORY_HARASSMENT", threshold: this.safetyThreshold },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: this.safetyThreshold,
      },
    ];
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    try {
      const cacheModelPath = path.resolve(cacheFolder, "models.json");
      if (!fs.existsSync(cacheModelPath))
        return MODEL_MAP.gemini[modelName] ?? 30_720;

      const models = safeJsonParse(fs.readFileSync(cacheModelPath));
      const model = models.find((model) => model.id === modelName);
      if (!model)
        throw new Error(
          "Model not found in cache - falling back to default model."
        );
      return model.contextWindow;
    } catch (e) {
      console.error(`GeminiLLM:promptWindowLimit`, e.message);
      return MODEL_MAP.gemini[modelName] ?? 30_720;
    }
  }

  promptWindowLimit() {
    try {
      if (!fs.existsSync(this.cacheModelPath))
        return MODEL_MAP.gemini[this.model] ?? 30_720;

      const models = safeJsonParse(fs.readFileSync(this.cacheModelPath));
      const model = models.find((model) => model.id === this.model);
      if (!model)
        throw new Error(
          "Model not found in cache - falling back to default model."
        );
      return model.contextWindow;
    } catch (e) {
      console.error(`GeminiLLM:promptWindowLimit`, e.message);
      return MODEL_MAP.gemini[this.model] ?? 30_720;
    }
  }

  /**
   * Fetches Gemini models from the Google Generative AI API
   * @param {string} apiKey - The API key to use for the request
   * @param {number} limit - The maximum number of models to fetch
   * @param {string} pageToken - The page token to use for pagination
   * @returns {Promise<[{id: string, name: string, contextWindow: number, experimental: boolean}]>} A promise that resolves to an array of Gemini models
   */
  static async fetchModels(apiKey, limit = 1_000, pageToken = null) {
    if (!apiKey) return [];
    if (fs.existsSync(cacheFolder) && !this.cacheIsStale()) {
      console.log(
        `\x1b[32m[GeminiLLM]\x1b[0m Using cached models API response.`
      );
      return safeJsonParse(
        fs.readFileSync(path.resolve(cacheFolder, "models.json"))
      );
    }

    const url = new URL(
      "https://generativelanguage.googleapis.com/v1beta/models"
    );
    url.searchParams.set("pageSize", limit);
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    let success = false;

    const models = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error.message);
        return data.models ?? [];
      })
      .then((models) => {
        success = true;
        return models
          .filter(
            (model) => !model.displayName.toLowerCase().includes("tuning")
          )
          .filter((model) =>
            model.supportedGenerationMethods.includes("generateContent")
          ) //  Only generateContent is supported
          .map((model) => {
            return {
              id: model.name.split("/").pop(),
              name: model.displayName,
              contextWindow: model.inputTokenLimit,
              experimental: model.name.includes("exp"),
            };
          });
      })
      .catch((e) => {
        console.error(`Gemini:getGeminiModels`, e.message);
        success = false;
        return defaultGeminiModels;
      });

    if (success) {
      console.log(
        `\x1b[32m[GeminiLLM]\x1b[0m Writing cached models API response to disk.`
      );
      if (!fs.existsSync(cacheFolder))
        fs.mkdirSync(cacheFolder, { recursive: true });
      fs.writeFileSync(
        path.resolve(cacheFolder, "models.json"),
        JSON.stringify(models)
      );
      fs.writeFileSync(
        path.resolve(cacheFolder, ".cached_at"),
        new Date().getTime().toString()
      );
    }
    return models;
  }

  /**
   * Checks if a model is valid for chat completion (unused)
   * @deprecated
   * @param {string} modelName - The name of the model to check
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the model is valid
   */
  async isValidChatCompletionModel(modelName = "") {
    const models = await this.fetchModels(process.env.GEMINI_API_KEY);
    return models.some((model) => model.id === modelName);
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

    const content = [{ text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        inlineData: {
          data: attachment.contentString.split("base64,")[1],
          mimeType: attachment.mime,
        },
      });
    }
    return content.flat();
  }

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
      { role: "assistant", content: "Okay." },
      ...formatChatHistory(chatHistory, this.#generateContent),
      {
        role: "USER_PROMPT",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  // This will take an OpenAi format message array and only pluck valid roles from it.
  formatMessages(messages = []) {
    // Gemini roles are either user || model.
    // and all "content" is relabeled to "parts"
    const allMessages = messages
      .map((message) => {
        if (message.role === "system")
          return { role: "user", parts: [{ text: message.content }] };

        if (message.role === "user") {
          // If the content is an array - then we have already formatted the context so return it directly.
          if (Array.isArray(message.content))
            return { role: "user", parts: message.content };

          // Otherwise, this was a regular user message with no attachments
          // so we need to format it for Gemini
          return { role: "user", parts: [{ text: message.content }] };
        }

        if (message.role === "assistant")
          return { role: "model", parts: [{ text: message.content }] };
        return null;
      })
      .filter((msg) => !!msg);

    // Specifically, Google cannot have the last sent message be from a user with no assistant reply
    // otherwise it will crash. So if the last item is from the user, it was not completed so pop it off
    // the history.
    if (
      allMessages.length > 0 &&
      allMessages[allMessages.length - 1].role === "user"
    )
      allMessages.pop();

    // Validate that after every user message, there is a model message
    // sometimes when using gemini we try to compress messages in order to retain as
    // much context as possible but this may mess up the order of the messages that the gemini model expects
    // we do this check to work around the edge case where 2 user prompts may be next to each other, in the message array
    for (let i = 0; i < allMessages.length; i++) {
      if (
        allMessages[i].role === "user" &&
        i < allMessages.length - 1 &&
        allMessages[i + 1].role !== "model"
      ) {
        allMessages.splice(i + 1, 0, {
          role: "model",
          parts: [{ text: "Okay." }],
        });
      }
    }

    return allMessages;
  }

  async getChatCompletion(messages = [], _opts = {}) {
    const prompt = messages.find(
      (chat) => chat.role === "USER_PROMPT"
    )?.content;
    const chatThread = this.gemini.startChat({
      history: this.formatMessages(messages),
      safetySettings: this.#safetySettings(),
    });

    const { output: result, duration } =
      await LLMPerformanceMonitor.measureAsyncFunction(
        chatThread.sendMessage(prompt)
      );
    const responseText = result.response.text();
    if (!responseText) throw new Error("Gemini: No response could be parsed.");

    const promptTokens = LLMPerformanceMonitor.countTokens(messages);
    const completionTokens = LLMPerformanceMonitor.countTokens([
      { content: responseText },
    ]);

    return {
      textResponse: responseText,
      metrics: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
        outputTps: (promptTokens + completionTokens) / duration,
        duration,
      },
    };
  }

  async streamGetChatCompletion(messages = [], _opts = {}) {
    const prompt = messages.find(
      (chat) => chat.role === "USER_PROMPT"
    )?.content;
    const chatThread = this.gemini.startChat({
      history: this.formatMessages(messages),
      safetySettings: this.#safetySettings(),
    });
    const responseStream = await LLMPerformanceMonitor.measureStream(
      (await chatThread.sendMessageStream(prompt)).stream,
      messages
    );

    if (!responseStream)
      throw new Error("Could not stream response stream from Gemini.");
    return responseStream;
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    // Usage is not available for Gemini streams
    // so we need to calculate the completion tokens manually
    // because 1 chunk != 1 token in gemini responses and it buffers
    // many tokens before sending them to the client as a "chunk"

    return new Promise(async (resolve) => {
      let fullText = "";

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => {
        stream?.endMeasurement({
          completion_tokens: LLMPerformanceMonitor.countTokens([
            { content: fullText },
          ]),
        });
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      for await (const chunk of stream) {
        let chunkText;
        try {
          // Due to content sensitivity we cannot always get the function .text();
          // https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/configure-safety-attributes#gemini-TASK-samples-nodejs
          // and it is not possible to unblock or disable this safety protocol without being allowlisted by Google.
          chunkText = chunk.text();
        } catch (e) {
          chunkText = e.message;
          writeResponseChunk(response, {
            uuid,
            sources: [],
            type: "abort",
            textResponse: null,
            close: true,
            error: e.message,
          });
          stream?.endMeasurement({ completion_tokens: 0 });
          resolve(e.message);
          return;
        }

        fullText += chunkText;
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: chunk.text(),
          close: false,
          error: false,
        });
      }

      writeResponseChunk(response, {
        uuid,
        sources,
        type: "textResponseChunk",
        textResponse: "",
        close: true,
        error: false,
      });
      response.removeListener("close", handleAbort);
      stream?.endMeasurement({
        completion_tokens: LLMPerformanceMonitor.countTokens([
          { content: fullText },
        ]),
      });
      resolve(fullText);
    });
  }

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }
}

module.exports = {
  GeminiLLM,
};
