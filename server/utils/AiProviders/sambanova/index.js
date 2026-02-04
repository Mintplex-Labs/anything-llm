const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { v4: uuidv4 } = require("uuid");
const { writeResponseChunk } = require("../../helpers/chat/responses");
const { MODEL_MAP } = require("../modelMap");

class SambaNovaLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.SAMBANOVA_LLM_API_KEY)
      throw new Error("No SambaNova API key was set.");
    this.className = "SambaNovaLLM";
    const { OpenAI: OpenAIApi } = require("openai");

    this.openai = new OpenAIApi({
      baseURL: "https://api.sambanova.ai/v1",
      apiKey: process.env.SAMBANOVA_LLM_API_KEY,
    });
    this.model = modelPreference || process.env.SAMBANOVA_LLM_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(
      `Initialized ${this.model} with context window ${this.promptWindowLimit()}`
    );
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
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

  static promptWindowLimit(modelName) {
    return MODEL_MAP.get("sambanova", modelName) ?? 131072;
  }

  promptWindowLimit() {
    return MODEL_MAP.get("sambanova", this.model) ?? 131072;
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
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          temperature,
        })
        .catch((e) => {
          throw new Error(e.message);
        })
    );

    if (
      !result.output.hasOwnProperty("choices") ||
      result.output.choices.length === 0
    )
      return null;

    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: result.output.usage?.completion_tokens || 0,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps: result.output.usage?.total_tokens_per_sec || 0,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
        stream_options: {
          include_usage: true,
        },
      }),
      messages,
      runPromptTokenCalculation: false,
      modelTag: this.model,
      provider: this.className,
    });

    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    let hasUsageMetrics = false;
    let usage = {
      prompt_tokens: 0,
      total_tokens: 0,
      outputTps: 0,
      completion_tokens: 0,
    };

    return new Promise(async (resolve) => {
      let fullText = "";
      const handleAbort = () => {
        stream?.endMeasurement(usage);
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      try {
        for await (const chunk of stream) {
          const message = chunk?.choices?.[0];
          const token = message?.delta?.content;

          if (
            chunk.hasOwnProperty("usage") && // exists
            !!chunk.usage &&
            Object.values(chunk.usage).length > 0
          ) {
            if (chunk.usage.hasOwnProperty("prompt_tokens"))
              usage.prompt_tokens = Number(chunk.usage.prompt_tokens);
            if (chunk.usage.hasOwnProperty("completion_tokens"))
              usage.completion_tokens = Number(chunk.usage.completion_tokens);
            if (chunk.usage.hasOwnProperty("total_tokens"))
              usage.total_tokens = Number(chunk.usage.total_tokens);
            if (chunk.usage.hasOwnProperty("total_tokens_per_sec"))
              usage.outputTps = Number(chunk.usage.total_tokens_per_sec);
            hasUsageMetrics = true;
          }

          if (token) {
            fullText += token;
            if (!hasUsageMetrics) usage.completion_tokens++;
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: token,
              close: false,
              error: false,
            });
          }

          if (
            message?.hasOwnProperty("finish_reason") &&
            message.finish_reason !== "" &&
            message.finish_reason !== null
          ) {
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });
          }
        }

        response.removeListener("close", handleAbort);
        stream?.endMeasurement(usage);
        resolve(fullText);
      } catch (e) {
        this.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
        writeResponseChunk(response, {
          uuid,
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
        stream?.endMeasurement(usage);
        resolve(fullText);
      }
    });
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
  SambaNovaLLM,
};
