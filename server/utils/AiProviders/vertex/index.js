const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { MODEL_MAP } = require("../modelMap");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");

class VertexLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.VERTEX_AI_LLM_API_KEY)
      throw new Error("No Vertex AI API key was set.");
    if (!process.env.VERTEX_AI_LLM_PROJECT_ID)
      throw new Error("No Vertex AI project ID was set.");
    this.className = "VertexLLM";
    const { OpenAI: OpenAIApi } = require("openai");

    // Vertex only accepts the API key via `x-goog-api-key` and rejects any
    // request that also carries an Authorization header, so the SDK's own
    // bearer header must be removed (a null default header deletes it).
    this.openai = new OpenAIApi({
      apiKey: "anythingllm",
      baseURL: VertexLLM.openaiBaseURL(),
      defaultHeaders: {
        Authorization: null,
        "x-goog-api-key": process.env.VERTEX_AI_LLM_API_KEY,
      },
    });
    this.model =
      modelPreference ||
      process.env.VERTEX_AI_LLM_MODEL_PREF ||
      "gemini-2.5-flash";
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

  /**
   * The OpenAI-compatible endpoint for the configured project/region.
   * The `global` location uses the bare host - regional locations use
   * a region-prefixed host.
   * @returns {string}
   */
  static openaiBaseURL() {
    const projectId = process.env.VERTEX_AI_LLM_PROJECT_ID;
    const region = process.env.VERTEX_AI_LLM_REGION || "global";
    const host =
      region === "global"
        ? "https://aiplatform.googleapis.com"
        : `https://${region}-aiplatform.googleapis.com`;
    return `${host}/v1/projects/${projectId}/locations/${region}/endpoints/openapi`;
  }

  /**
   * Google publisher models must be requested as `google/<model>` on the
   * OpenAI-compatible endpoint. Model Garden partner models are entered by
   * the user already carrying their publisher prefix (eg: `meta/llama-...`)
   * so any model with a path is passed through untouched.
   * @param {string} modelName
   * @returns {string}
   */
  static apiModelId(modelName = "") {
    return modelName.includes("/") ? modelName : `google/${modelName}`;
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
    // The cache stores bare model names, so strip any publisher prefix.
    // `gemini` tracks the same LiteLLM provider tag and covers caches
    // pulled before `vertex` was tracked.
    const model = String(modelName ?? "")
      .split("/")
      .pop();
    const userLimit = Number(process.env.VERTEX_AI_LLM_MODEL_TOKEN_LIMIT);
    return (
      MODEL_MAP.get("vertex", model) ??
      MODEL_MAP.get("gemini", model) ??
      (!isNaN(userLimit) && userLimit > 0 ? userLimit : 8192)
    );
  }

  promptWindowLimit() {
    return VertexLLM.promptWindowLimit(this.model);
  }

  // Vertex's OpenAI-compatible endpoint has no /models listing, so the
  // model is trusted as-is - an invalid one fails at completion time with
  // an actionable error from the API.
  async isValidChatCompletionModel(_modelName = "") {
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

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: VertexLLM.apiModelId(this.model),
          messages,
          temperature,
        })
        .catch((e) => {
          throw new Error(e.message);
        })
    );

    if (
      !result?.output?.hasOwnProperty("choices") ||
      result?.output?.choices?.length === 0
    )
      throw new Error(
        `Invalid response body returned from Vertex AI: ${JSON.stringify(result.output)}`
      );

    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: result.output.usage.prompt_tokens || 0,
        completion_tokens: result.output.usage.completion_tokens || 0,
        total_tokens: result.output.usage.total_tokens || 0,
        outputTps: result.output.usage.completion_tokens / result.duration,
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
        model: VertexLLM.apiModelId(this.model),
        stream: true,
        messages,
        temperature,
      }),
      messages,
      runPromptTokenCalculation: false,
      modelTag: this.model,
      provider: this.className,
    });

    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    return handleDefaultStreamResponseV2(response, stream, responseProps);
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
  VertexLLM,
};
