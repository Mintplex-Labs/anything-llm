const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
  formatChatHistory,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { OpenAI: OpenAIApi } = require("openai");
const { humanFileSize } = require("../../helpers");

class LemonadeLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.LEMONADE_LLM_BASE_PATH)
      throw new Error("No Lemonade API Base Path was set.");
    if (!process.env.LEMONADE_LLM_MODEL_PREF && !modelPreference)
      throw new Error("No Lemonade Model Pref was set.");

    this.className = "LemonadeLLM";
    this.lemonade = new OpenAIApi({
      baseURL: parseLemonadeServerEndpoint(
        process.env.LEMONADE_LLM_BASE_PATH,
        "openai"
      ),
      apiKey: null,
    });

    this.model = modelPreference || process.env.LEMONADE_LLM_MODEL_PREF;
    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;

    // We can establish here since we cannot dynamically curl the context window limit from the API.
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
    this.#log(`initialized with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[Lemonade]\x1b[0m ${text}`, ...args);
  }

  static slog(text, ...args) {
    console.log(`\x1b[32m[Lemonade]\x1b[0m ${text}`, ...args);
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
    this.#log(
      `${this.model} is using a max context window of ${this.promptWindowLimit()} tokens.`
    );
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

  /** Lemonade does not support curling the context window limit from the API, so we return the system defined limit. */
  static promptWindowLimit(_) {
    return Number(process.env.LEMONADE_LLM_MODEL_TOKEN_LIMIT) || 8192;
  }

  promptWindowLimit() {
    return this.constructor.promptWindowLimit(this.model);
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
      ...formatChatHistory(chatHistory, this.#generateContent),
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    await LemonadeLLM.loadModel(this.model);
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.lemonade.chat.completions.create({
        model: this.model,
        messages,
        temperature,
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
        outputTps: result.output.usage?.completion_tokens / result.duration,
        duration: result.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    await LemonadeLLM.loadModel(this.model);
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.lemonade.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
      }),
      messages,
      runPromptTokenCalculation: true,
      modelTag: this.model,
      provider: this.className,
    });
    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
  }

  /**
   * Returns the capabilities of the model.
   * Note: This is a heuristic approach to get the capabilities of the model based on the model metadata.
   * It is not perfect, but works since every model metadata is different and may not have key values we rely on.
   * There is no "capabilities" key in the metadata via any API endpoint - so we do this.
   * @returns {Promise<{tools: 'unknown' | boolean, reasoning: 'unknown' | boolean, imageGeneration: 'unknown' | boolean, vision: 'unknown' | boolean}>}
   */
  async getModelCapabilities() {
    try {
      const client = new OpenAIApi({
        baseURL: parseLemonadeServerEndpoint(
          process.env.LEMONADE_LLM_BASE_PATH,
          "openai"
        ),
        apiKey: null,
      });

      const { labels = [] } = await client.models.retrieve(this.model);
      return {
        tools: labels.includes("tool-calling"),
        reasoning: labels.includes("reasoning"),
        imageGeneration: "unknown",
        vision: labels.includes("vision"),
      };
    } catch (error) {
      console.error("Error getting model capabilities:", error);
      return {
        tools: "unknown",
        reasoning: "unknown",
        imageGeneration: "unknown",
        vision: "unknown",
      };
    }
  }

  /**
   * Utility function to load a model from the Lemonade server.
   * Does not check if the model is already loaded or unloads any models.
   * @param {*} model
   */
  static async loadModel(model, basePath = process.env.LEMONADE_LLM_BASE_PATH) {
    try {
      const endpoint = new URL(parseLemonadeServerEndpoint(basePath, "openai"));
      endpoint.pathname += "/load";

      console.log(endpoint.toString());

      LemonadeLLM.slog(
        `Loading model ${model} with context size ${this.promptWindowLimit()}`
      );
      await fetch(endpoint.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: String(model),
          ctx_size: Number(this.promptWindowLimit()),
        }),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(
              `Failed to load model ${model}: ${response.statusText}`
            );
          return response.json();
        })
        .then((data) => {
          if (data.status !== "success") throw new Error(data.message);
          LemonadeLLM.slog(`Model ${model} loaded successfully`);
          return true;
        });
    } catch (error) {
      LemonadeLLM.slog(`Error loading model ${model}:`, error);
      return false;
    }
  }

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    await this.assertModelContextLimits();
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

/**
 * Extracts the model family/organization name from a model ID.
 * For example:
 * - "Qwen3-VL-8B-Instruct-GGUF" → "Qwen"
 * - "SmolLM3-3B-GGUF" → "SmolLM"
 * - "Llama-3.2-8B" → "Llama"
 * - "DeepSeek-V3-GGUF" → "DeepSeek"
 * @param {string} modelId - The model identifier
 * @returns {string} The organization/family name
 */
function extractModelOrganization(modelId) {
  const match = modelId.match(/^([A-Za-z]+)/);
  return match ? match[1] : modelId;
}

/**
 * Parse the base path of the Docker Model Runner endpoint and return the host and port.
 * @param {string} basePath - The base path of the Lemonade server endpoint.
 * @param {'base' | 'openai' | 'ollama'} to - The provider to parse the endpoint for (internal DMR or openai-compatible)
 * @returns {string | null}
 */
function parseLemonadeServerEndpoint(basePath = null, to = "openai") {
  if (!basePath) return null;
  try {
    const url = new URL(basePath);
    if (to === "openai") url.pathname = "api/v1";
    else if (to === "ollama") url.pathname = "api";
    else if (to === "base") url.pathname = ""; // only used for /live
    return url.toString();
  } catch (e) {
    return basePath;
  }
}

/**
 * This function will fetch the remote models from the Lemonade server as well
 * as the local models installed on the system.
 * @param {string} basePath - The base path of the Lemonade server endpoint.
 * @param {'chat' | 'embedding' | 'reranking'} task - The task to fetch the models for.
 */
async function getAllLemonadeModels(basePath = null, task = "chat") {
  const availableModels = {};

  function isValidForTask(model) {
    if (task === "reranking") return model.labels?.includes("reranking");
    if (task === "embedding") return model.labels?.includes("embeddings");
    if (task === "chat")
      return !["embeddings", "reranking"].some((label) =>
        model.labels?.includes(label)
      );
    return true;
  }

  try {
    // Grab the locally installed models from the Lemonade server API
    const lemonadeUrl = new URL(
      parseLemonadeServerEndpoint(
        basePath ?? process.env.LEMONADE_LLM_BASE_PATH,
        "openai"
      )
    );
    lemonadeUrl.pathname += "/models";
    lemonadeUrl.searchParams.append("show_all", "true");
    await fetch(lemonadeUrl.toString())
      .then((res) => res.json())
      .then(({ data }) => {
        data?.forEach((model) => {
          if (!isValidForTask(model)) return;

          const organization = extractModelOrganization(model.id);
          const modelData = {
            id: model.id,
            name: organization + ":" + model.id,
            // Reports in GB, convert to bytes
            size: model?.size
              ? humanFileSize(model.size * 1024 ** 3)
              : "Unknown size",
            downloaded: model?.downloaded ?? false,
            organization,
          };

          if (!availableModels[organization])
            availableModels[organization] = { tags: [] };
          availableModels[organization].tags.push(modelData);
        });
      });
  } catch (e) {
    LemonadeLLM.slog(`Error getting Lemonade models`, e);
  } finally {
    return Object.values(availableModels).flatMap((m) => m.tags);
  }
}

module.exports = {
  LemonadeLLM,
  parseLemonadeServerEndpoint,
  getAllLemonadeModels,
};
