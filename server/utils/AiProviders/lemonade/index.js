const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  formatChatHistory,
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { v4: uuidv4 } = require("uuid");
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
      apiKey: process.env.LEMONADE_LLM_API_KEY || null,
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
      textResponse: this.#parseReasoningFromResponse(result.output.choices[0]),
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

  /**
   * Parses and prepends reasoning from the response and returns the full text response.
   * Lemonade's OpenAI-compatible endpoint may emit reasoning under either
   * `reasoning_content` (DeepSeek-style) or `reasoning` (newer servers), so we
   * accept both shapes.
   * @param {Object} choice - the first choice from the chat completion response
   * @returns {string}
   */
  #parseReasoningFromResponse(choice) {
    const message = choice?.message;
    let textResponse = message?.content;
    const rawReasoning = message?.reasoning_content ?? message?.reasoning;
    if (typeof rawReasoning === "string" && rawReasoning.trim().length > 0) {
      textResponse = `<think>${rawReasoning}</think>${textResponse ?? ""}`;
    }
    return textResponse;
  }

  // TODO: This is a copy of the generic handleStream function in responses.js
  // to specifically handle Lemonade reasoning model `reasoning_content` /
  // `reasoning` fields. When or if ever possible, we should refactor this to
  // be in the generic function.
  /**
   * Handles streaming responses from Lemonade.
   * Parses `delta.reasoning_content` / `delta.reasoning` (emitted by Lemonade
   * reasoning models on its OpenAI-compatible endpoint) and wraps it in
   * <think> tags so the UI renders the model's thoughts separately from the
   * final answer. Also closes the <think> block on `finish_reason` if the
   * model stops mid-reasoning before any content tokens are emitted.
   * @param {import("express").Response} response
   * @param {import("../../helpers/chat/LLMPerformanceMonitor").MonitoredStream} stream
   * @param {Object} responseProps
   * @returns {Promise<string>}
   */
  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    let hasUsageMetrics = false;
    let usage = {
      completion_tokens: 0,
    };

    return new Promise(async (resolve) => {
      let fullText = "";
      let reasoningText = "";

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => {
        stream?.endMeasurement(usage);
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      try {
        for await (const chunk of stream) {
          const message = chunk?.choices?.[0];
          const token = message?.delta?.content;
          const reasoningToken =
            message?.delta?.reasoning_content ?? message?.delta?.reasoning;

          if (
            chunk.hasOwnProperty("usage") && // exists
            !!chunk.usage && // is not null
            Object.values(chunk.usage).length > 0 // has values
          ) {
            if (chunk.usage.hasOwnProperty("prompt_tokens")) {
              usage.prompt_tokens = Number(chunk.usage.prompt_tokens);
            }

            if (chunk.usage.hasOwnProperty("completion_tokens")) {
              hasUsageMetrics = true; // to stop estimating counter
              usage.completion_tokens = Number(chunk.usage.completion_tokens);
            }
          }

          // Reasoning models will always return the reasoning text before the token text.
          if (reasoningToken) {
            // If the reasoning text is empty (''), we need to initialize it
            // and send the first chunk of reasoning text.
            if (reasoningText.length === 0) {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: `<think>${reasoningToken}`,
                close: false,
                error: false,
              });
              reasoningText += `<think>${reasoningToken}`;
              continue;
            } else {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: reasoningToken,
                close: false,
                error: false,
              });
              reasoningText += reasoningToken;
            }
          }

          // If the reasoning text is not empty, but the reasoning token is empty
          // and the token text is not empty we need to close the reasoning text and begin sending the token text.
          if (!!reasoningText && !reasoningToken && token) {
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: `</think>`,
              close: false,
              error: false,
            });
            fullText += `${reasoningText}</think>`;
            reasoningText = "";
          }

          if (token) {
            fullText += token;
            // If we never saw a usage metric, we can estimate them by number of completion chunks
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

          // LocalAi returns '' and others return null on chunks - the last chunk is not "" or null.
          // Either way, the key `finish_reason` must be present to determine ending chunk.
          if (
            message?.hasOwnProperty("finish_reason") && // Got valid message and it is an object with finish_reason
            message.finish_reason !== "" &&
            message.finish_reason !== null
          ) {
            // If the model stops after reasoning but before emitting any
            // content tokens, the <think> block is still open — close it so
            // stored history matches what the UI rendered.
            if (reasoningText.length > 0) {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: `</think>`,
                close: false,
                error: false,
              });
              fullText += `${reasoningText}</think>`;
              reasoningText = "";
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
            stream?.endMeasurement(usage);
            resolve(fullText);
            break; // Break streaming when a valid finish_reason is first encountered
          }
        }
      } catch (e) {
        console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
        writeResponseChunk(response, {
          uuid,
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
        response.removeListener("close", handleAbort);
        stream?.endMeasurement(usage);
        resolve(fullText);
      }
    });
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
        apiKey: process.env.LEMONADE_LLM_API_KEY || null,
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
   * Get the currently loaded models from the Lemonade server.
   * @returns {Promise<string[]>}
   */
  static async getCurrentlyLoadedModels() {
    const endpoint = new URL(
      parseLemonadeServerEndpoint(process.env.LEMONADE_LLM_BASE_PATH, "openai")
    );
    endpoint.pathname += "/health";
    const loadedModels = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        ...(process.env.LEMONADE_LLM_API_KEY
          ? { Authorization: `Bearer ${process.env.LEMONADE_LLM_API_KEY}` }
          : {}),
      },
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `Failed to get currently loaded models: ${response.statusText}`
          );
        return response.json();
      })
      .then(({ all_models_loaded = [] } = {}) => {
        return all_models_loaded.map((model) => {
          return {
            model_name: model.model_name,
            ctx_size: model?.recipe_options?.ctx_size ?? 8192,
          };
        });
      });
    return loadedModels;
  }

  /**
   * Utility function to load a model from the Lemonade server.
   * Does not check if the model is already loaded or unloads any models.
   * @param {*} model
   */
  static async loadModel(model, basePath = process.env.LEMONADE_LLM_BASE_PATH) {
    try {
      const desiredCtxSize = Number(this.promptWindowLimit());
      const currentlyLoadedModels =
        await LemonadeLLM.getCurrentlyLoadedModels();
      const modelAlreadyLoaded = currentlyLoadedModels.find(
        (m) => m.model_name === model
      );

      if (modelAlreadyLoaded) {
        if (modelAlreadyLoaded.ctx_size === desiredCtxSize) {
          LemonadeLLM.slog(
            `Model ${model} already loaded with ctx size ${desiredCtxSize}`
          );
          return true;
        }

        LemonadeLLM.slog(
          `Model ${model} needs to be reloaded again with ctx size ${desiredCtxSize}`
        );
      }

      const endpoint = new URL(parseLemonadeServerEndpoint(basePath, "openai"));
      endpoint.pathname += "/load";

      LemonadeLLM.slog(
        `Loading model ${model} with context size ${desiredCtxSize}`
      );

      await fetch(endpoint.toString(), {
        method: "POST",
        headers: {
          ...(process.env.LEMONADE_LLM_API_KEY
            ? { Authorization: `Bearer ${process.env.LEMONADE_LLM_API_KEY}` }
            : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_name: String(model),
          ctx_size: desiredCtxSize,
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
  } catch {
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

    await fetch(lemonadeUrl.toString(), {
      headers: {
        ...(!!process.env.LEMONADE_LLM_API_KEY
          ? { Authorization: `Bearer ${process.env.LEMONADE_LLM_API_KEY}` }
          : {}),
      },
    })
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
    // eslint-disable-next-line
    return Object.values(availableModels).flatMap((m) => m.tags);
  }
}

module.exports = {
  LemonadeLLM,
  parseLemonadeServerEndpoint,
  getAllLemonadeModels,
};
