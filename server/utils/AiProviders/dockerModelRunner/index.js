const fs = require("fs");
const path = require("path");
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
const { safeJsonParse } = require("../../http");

class DockerModelRunnerLLM {
  static cacheTime = 1000 * 60 * 60 * 24; // 24 hours
  static cacheFolder = path.resolve(
    process.env.STORAGE_DIR
      ? path.resolve(process.env.STORAGE_DIR, "models", "docker-model-runner")
      : path.resolve(__dirname, `../../../storage/models/docker-model-runner`)
  );

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.DOCKER_MODEL_RUNNER_BASE_PATH)
      throw new Error("No Docker Model Runner API Base Path was set.");
    if (!process.env.DOCKER_MODEL_RUNNER_LLM_MODEL_PREF && !modelPreference)
      throw new Error("No Docker Model Runner Model Pref was set.");

    this.className = "DockerModelRunnerLLM";
    this.dmr = new OpenAIApi({
      baseURL: parseDockerModelRunnerEndpoint(
        process.env.DOCKER_MODEL_RUNNER_BASE_PATH
      ),
      apiKey: null,
    });

    this.model =
      modelPreference || process.env.DOCKER_MODEL_RUNNER_LLM_MODEL_PREF;
    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;

    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.#log(`initialized with model: ${this.model}`);
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[Docker Model Runner]\x1b[0m ${text}`, ...args);
  }

  static slog(text, ...args) {
    console.log(`\x1b[32m[Docker Model Runner]\x1b[0m ${text}`, ...args);
  }

  async assertModelContextLimits() {
    if (this.limits !== null) return;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };
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

  /** DMR does not support curling the context window limit from the API, so we return the system defined limit. */
  static promptWindowLimit(_) {
    const systemDefinedLimit =
      Number(process.env.DOCKER_MODEL_RUNNER_LLM_MODEL_TOKEN_LIMIT) || 8192;
    return systemDefinedLimit;
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
    if (!this.model)
      throw new Error(
        `Docker Model Runner chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.dmr.chat.completions.create({
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
    if (!this.model)
      throw new Error(
        `Docker Model Runner chat: ${this.model} is not valid or defined model for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.dmr.chat.completions.create({
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
 * Parse the base path of the Docker Model Runner endpoint and return the host and port.
 * @param {string} basePath - The base path of the Docker Model Runner endpoint.
 * @param {'openai' | 'dmr'} to - The provider to parse the endpoint for (internal DMR or openai-compatible)
 * @returns {string | null}
 */
function parseDockerModelRunnerEndpoint(basePath = null, to = "openai") {
  if (!basePath) return null;
  try {
    const url = new URL(basePath);
    if (to === "openai") url.pathname = "engines/v1";
    else if (to === "dmr") url.pathname = "";
    return url.toString();
  } catch (e) {
    return basePath;
  }
}

/**
 * @typedef {Object} DockerRunnerInstalledModel
 * @property {string} id - The SHA256 identifier of the model layer/blob.
 * @property {string[]} tags - List of tags or aliases associated with this model (e.g., "ai/qwen3:4B-UD-Q4_K_XL").
 * @property {number} created - The Unix timestamp (seconds) when the model was created.
 * @property {string} config - The configuration of the model.
 * @property {string} config.format - The file format (e.g., "gguf").
 * @property {string} config.quantization - The quantization level (e.g., "MOSTLY_Q4_K_M", "Q4_0").
 * @property {string} config.parameters - The parameter count formatted as a string (e.g., "4.02 B").
 * @property {string} config.architecture - The base architecture of the model (e.g., "qwen3", "llama").
 * @property {string} config.size - The physical file size formatted as a string (e.g., "2.37 GiB").
 * @property {string} config?.gguf - Raw GGUF metadata headers containing tokenizer, architecture details, and licensing.
 * @property {string} config?.gguf['general.base_model.0.organization'] - The tokenizer of the model.
 * @property {string} config?.gguf['general.basename'] - The base name of the model (the real name of the model, not the tag)
 * @property {string} config?.gguf['*.context_length'] - The context length of the model. will be something like qwen3.context_length
 */

function filterByTask(task = "chat", models = {}) {
  const possibleEmbed = [{ pattern: /^all-mini/i }, { pattern: /embed/i }];
  const isEmbedModel = (strTag) =>
    possibleEmbed.some((p) => p.pattern.test(strTag));
  const filteredModels = {};
  for (const [modelName, tags] of Object.entries(models)) {
    if (task === "chat") {
      if (isEmbedModel(modelName)) continue;
      filteredModels[modelName] = tags;
    } else if (task === "embedding") {
      if (!isEmbedModel(modelName)) continue;
      filteredModels[modelName] = tags;
    }
  }
  return filteredModels;
}

/**
 * Fetch the remote models from the Docker Hub and cache the results.
 * @param {'chat' | 'embedding'} task - The task to fetch the models for.
 * @returns {Promise<Record<string, {id: string, name: string, size: string, organization: string}[]>>}
 */
async function fetchRemoteModels(task = "chat") {
  const cachePath = path.resolve(
    DockerModelRunnerLLM.cacheFolder,
    "models.json"
  );
  const cachedAtPath = path.resolve(
    DockerModelRunnerLLM.cacheFolder,
    ".cached_at"
  );
  let cacheTime = 0;

  if (fs.existsSync(cachePath) && fs.existsSync(cachedAtPath)) {
    cacheTime = Number(fs.readFileSync(cachedAtPath, "utf8"));
    if (Date.now() - cacheTime < DockerModelRunnerLLM.cacheTime)
      return filterByTask(
        task,
        safeJsonParse(fs.readFileSync(cachePath, "utf8"))
      );
  }

  DockerModelRunnerLLM.slog(`Refreshing remote models from Docker Hub`);
  // Now hit the Docker Hub API to get the remote model namespace and root tags
  const availableNamespaces = []; // array of strings like ai/mistral, ai/qwen3, etc
  let nextPage =
    "https://hub.docker.com/v2/namespaces/ai/repositories?page_size=100&page=1";
  while (nextPage) {
    const response = await fetch(nextPage)
      .then((res) => res.json())
      .then((data) => {
        const namespaces = data.results
          .filter(
            (result) =>
              result.namespace &&
              result.name &&
              result.content_types.includes("model") &&
              result.namespace === "ai"
          )
          .map((result) => result.namespace + "/" + result.name);
        availableNamespaces.push(...namespaces);
      })
      .catch((e) => {
        DockerModelRunnerLLM.slog(
          `Error fetching remote models from Docker Hub`,
          e
        );
        return [];
      });
    if (!response) break;
    if (!response || !response.next) break;
    nextPage = response.next;
  }

  const availableRemoteModels = {};
  const BATCH_SIZE = 10;

  // Run batch requests to avoid rate limiting but also
  // improve the speed of the total request time.
  for (let i = 0; i < availableNamespaces.length; i += BATCH_SIZE) {
    const batch = availableNamespaces.slice(i, i + BATCH_SIZE);
    DockerModelRunnerLLM.slog(
      `Fetching tags for batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(availableNamespaces.length / BATCH_SIZE)}`
    );

    await Promise.all(
      batch.map(async (namespace) => {
        const [organization, model] = namespace.split("/");
        const namespaceUrl = new URL(
          "https://hub.docker.com/v2/namespaces/ai/repositories/" +
            model +
            "/tags"
        );

        DockerModelRunnerLLM.slog(
          `Fetching tags for ${namespaceUrl.toString()}`
        );
        await fetch(namespaceUrl.toString())
          .then((res) => res.json())
          .then((data) => {
            const tags = data.results.map((result) => {
              return {
                id: `${organization}/${model}:${result.name}`,
                name: `${model}:${result.name}`,
                size: humanFileSize(result.full_size),
                organization: model,
              };
            });
            availableRemoteModels[model] = tags;
          })
          .catch((e) => {
            DockerModelRunnerLLM.slog(
              `Error fetching tags for ${namespaceUrl.toString()}`,
              e
            );
          });
      })
    );
  }

  if (Object.keys(availableRemoteModels).length === 0) {
    DockerModelRunnerLLM.slog(
      `No remote models found - API may be down or not available`
    );
    return {};
  }

  if (!fs.existsSync(DockerModelRunnerLLM.cacheFolder))
    fs.mkdirSync(DockerModelRunnerLLM.cacheFolder, { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(availableRemoteModels), {
    encoding: "utf8",
  });
  fs.writeFileSync(cachedAtPath, String(Number(new Date())), {
    encoding: "utf8",
  });
  return filterByTask(task, availableRemoteModels);
}

/**
 * This function will fetch the remote models from the Docker Hub as well
 * as the local models installed on the system.
 * @param {string} basePath - The base path of the Docker Model Runner endpoint.
 * @param {'chat' | 'embedding'} task - The task to fetch the models for.
 */
async function getDockerModels(basePath = null, task = "chat") {
  let availableModels = {};
  /** @type {Array<DockerRunnerInstalledModel>} */
  let installedModels = {};

  try {
    // Grab the locally installed models from the Docker Model Runner API
    const dmrUrl = new URL(
      parseDockerModelRunnerEndpoint(
        basePath ?? process.env.DOCKER_MODEL_RUNNER_BASE_PATH,
        "dmr"
      )
    );
    dmrUrl.pathname = "/models";

    await fetch(dmrUrl.toString())
      .then((res) => res.json())
      .then((data) => {
        data?.forEach((model) => {
          const id = model.tags.at(0);
          // eg: ai/qwen3:latest -> qwen3
          const tag =
            id?.split("/").pop()?.split(":")?.at(1) ??
            id?.split(":").at(1) ??
            "latest";
          const organization = id?.split("/").pop()?.split(":")?.at(0) ?? id;
          installedModels[id] = {
            id: id,
            name: `${organization}:${tag}`,
            size: model.config?.size ?? "Unknown size",
            organization: organization,
          };
        });
      });

    // Now hit the Docker Hub API to get the remote model namespace and root tags
    const remoteModels = await fetchRemoteModels(task);
    for (const [modelName, tags] of Object.entries(remoteModels)) {
      availableModels[modelName] = { tags: [] };
      for (const tag of tags) {
        if (!installedModels[tag.id])
          availableModels[modelName].tags.push({ ...tag, downloaded: false });
        else {
          availableModels[modelName].tags.push({ ...tag, downloaded: true });
          // remove the model from the installed models list so we dont double append it to the available models list
          // when checking for custom models
          delete installedModels[tag.id];
        }
      }
    }

    // For any models that are still in the installed models list, we need to append them to the available models list as downloaded
    for (const model of Object.values(installedModels)) {
      const organization = model.id.split("/").pop();
      const name = model.id.split("/").pop();
      if (!availableModels[organization])
        availableModels[organization] = { tags: [] };
      availableModels[organization].tags.push({
        ...model,
        downloaded: true,
        name: name,
      });
    }
  } catch (e) {
    DockerModelRunnerLLM.slog(`Error getting Docker models`, e);
  } finally {
    return Object.values(availableModels).flatMap((m) => m.tags);
  }
}

module.exports = {
  DockerModelRunnerLLM,
  parseDockerModelRunnerEndpoint,
  getDockerModels,
};
