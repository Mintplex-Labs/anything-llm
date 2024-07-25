const { StringOutputParser } = require("@langchain/core/output_parsers");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { safeJsonParse } = require("../../http");

class AnythingLLMOllama {
  constructor(embedder = null, modelPreference = null) {
    this.model = modelPreference || process.env.ANYTHINGLLM_MODEL_PREF;
    this.basePath = () =>
      `http://127.0.0.1:${process.env.ANYTHING_LLM_OLLAMA_PORT}`;

    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder || new NativeEmbedder();
    this.defaultTemp = 0.7;
  }

  async #supportedPlatform() {
    if (process.env.APP_PLATFORM === "linux") {
      this.#log(`${process.env.APP_PLATFORM} not supported.`);
      return false;
    }
    return true;
  }

  // Get the port that the main process is reported to be
  // running the embedded ollama service on. This will
  // always hit the main process in case the port moved
  // between reboots.
  async #getProcessPort() {
    if (!process.parentPort) {
      this.#log("No parentPort found. Assuming default 11434");
      process.env.ANYTHING_LLM_OLLAMA_PORT = "11434";
      return;
    }

    const getOllamaPortFromMain = new Promise((resolve) => {
      const requestHandler = ({ data }) => {
        const { type, port } = data;
        if (type === "get-ollama-port") resolve(port);
      };

      process?.parentPort?.once("message", requestHandler);
      setTimeout(() => {
        resolve(null);
      }, 30_000);
    });

    process.parentPort?.postMessage({ message: "get-ollama-port" });
    const ollamaPort = await getOllamaPortFromMain
      .then((res) => res)
      .catch(() => null);
    if (ollamaPort) {
      this.#log(
        `Main process is intending to run local AnythingLLMOllama on port ${ollamaPort}`
      );
      process.env.ANYTHING_LLM_OLLAMA_PORT = ollamaPort;
    } else {
      this.#log(
        ` Failed to communicate. Will assume AnythingLLMOllama with bind to 11434.`
      );
      process.env.ANYTHING_LLM_OLLAMA_PORT = "11434";
    }
    return ollamaPort;
  }

  async #ollamaProcessRunning() {
    if (!this.#supportedPlatform()) return false;
    if (!process.env.ANYTHING_LLM_OLLAMA_PORT) {
      this.#log("Current port is unknown. Fetching from main process.");
      await this.#getProcessPort();
    }

    return await fetch(this.basePath(), {
      method: "HEAD",
    })
      .then((res) => res.ok)
      .catch(() => false);
  }

  #log(text, ...args) {
    console.log(`\x1b[36m[AnythingLLMOllama]\x1b[0m ${text}`, ...args);
  }

  #ollamaClient({ temperature = 0.07 }) {
    const { ChatOllama } = require("@langchain/community/chat_models/ollama");
    return new ChatOllama({
      baseUrl: this.basePath(),
      model: this.model,
      temperature,
    });
  }

  // For streaming we use Langchain's wrapper to handle weird chunks
  // or otherwise absorb headaches that can arise from Ollama models
  #convertToLangchainPrototypes(chats = []) {
    const {
      HumanMessage,
      SystemMessage,
      AIMessage,
    } = require("@langchain/core/messages");
    const langchainChats = [];
    const roleToMessageMap = {
      system: SystemMessage,
      user: HumanMessage,
      assistant: AIMessage,
    };

    for (const chat of chats) {
      if (!roleToMessageMap.hasOwnProperty(chat.role)) continue;
      const MessageClass = roleToMessageMap[chat.role];
      langchainChats.push(new MessageClass({ content: chat.content }));
    }

    return langchainChats;
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

  #errorHandler(errorMessage = "") {
    if (errorMessage?.includes("try pulling it first")) {
      return `AnythingLLM:404: ${this.model} has not completed downloading. Please wait for it to complete to send a chat.`;
    }
    return errorMessage;
  }

  // Send signal to ollama process in electron and tell the worker to reboot ollama
  // so that it stops the download process since it cannot be killed via API.
  async rebootOllama() {
    if (!this.#supportedPlatform()) return false;
    if (!(await this.#ollamaProcessRunning())) return;
    process.parentPort?.postMessage({ message: "boot-ollama" });
  }

  // Before running anything just call this to either boot up the Ollama service
  // or check if alive.
  async bootOrContinue() {
    if (!this.#supportedPlatform()) return false;
    if (await this.#ollamaProcessRunning()) return;

    process.parentPort?.postMessage({ message: "boot-ollama" });
    const ollamaOnline = new Promise((resolve) => {
      const requestHandler = ({ data }) => {
        const { type, success, port } = data;
        if (type === "boot-ollama") {
          if (!success) {
            this.#log(`Boot failure for port ${port}`);
            resolve(false);
            return;
          }

          !!port ? (process.env.ANYTHING_LLM_OLLAMA_PORT = port) : null;

          // Once the system boots it can take a few ms for the API
          // to be ready so we have to wait for it to resolve.
          const fetchRetry = require("fetch-retry")(global.fetch);
          fetchRetry(this.basePath(), {
            retries: 3,
            retryOn: function (attempt, error, response) {
              if (error !== null || response.status >= 400) {
                console.log(`OllamaAPI offline - retrying. ${attempt + 1}/3`);
                return true;
              }
            },
            retryDelay: function (attempt, _error, _response) {
              return Math.pow(2, attempt) * 500;
            },
          })
            .then((res) => res.text())
            .then(() => resolve(true))
            .catch(() => resolve(false));
        }
      };

      process?.parentPort?.once("message", requestHandler);
      setTimeout(() => {
        resolve(false);
      }, 10_000);
    });

    return await ollamaOnline;
  }

  async availableModels() {
    if (!this.#supportedPlatform()) return [];
    await this.bootOrContinue();
    return await fetch(`${this.basePath()}/api/tags`, { method: "GET" })
      .then((res) => res.json())
      .then((json) => json.models || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  }

  async pullModel(
    modelName = "llama2",
    progressCallback,
    successCallback,
    errorCallback
  ) {
    if (!this.#supportedPlatform()) {
      errorCallback?.(`${this.process.APP_PLATFORM} is not supported.`);
      return;
    }
    await this.bootOrContinue();

    this.#log(`Starting pull of model tag "${modelName}".`);
    const response = await fetch(`${this.basePath()}/api/pull`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: modelName, stream: true }),
    });

    const reader = response.body.getReader();
    let receivedLength = 0;
    let chunks = [];
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      const receivedText = new TextDecoder("utf-8").decode(value);
      try {
        const json = safeJsonParse(receivedText);
        if (json?.status && json?.total && json?.completed) {
          const percentage = Math.round((json.completed / json.total) * 100);
          progressCallback?.(percentage, json.status);
        }

        if (json?.status === "success") {
          successCallback?.();
        }
      } catch (e) {
        console.error("Error parsing JSON", e);
        errorCallback?.(e.message);
      }
    }
  }

  async createModel(
    modelFileLocation = null,
    progressCallback,
    successCallback,
    errorCallback
  ) {
    const fs = require("fs");
    if (!modelFileLocation || !fs.existsSync(modelFileLocation)) {
      errorCallback?.(
        `Could not find a model at file location: ${modelFileLocation}.`
      );
      return;
    }

    if (!this.#supportedPlatform()) {
      errorCallback?.(`${this.process.APP_PLATFORM} is not supported.`);
      return;
    }
    await this.bootOrContinue();
    const modelName = modelFileLocation.split("/").splice(-1)[0];
    this.#log(
      `Starting creation of model ${modelName} from "${modelFileLocation}".`
    );
    const response = await fetch(`${this.basePath()}/api/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: modelName,
        modelfile: `FROM ${modelFileLocation}`,
        stream: true,
      }),
    });

    const reader = response.body.getReader();
    let chunks = [];
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      const receivedText = new TextDecoder("utf-8").decode(value);
      try {
        const parsedResult = safeJsonParse(receivedText);
        const responses = Array.isArray(parsedResult)
          ? parsedResult
          : [parsedResult];
        for (let json of responses) {
          if (json?.status) progressCallback?.(json?.status, "OK");
          if (json?.status === "success") successCallback?.();
        }
      } catch (e) {
        console.error("Error parsing JSON", e);
        errorCallback?.(e.message);
      }
    }
  }

  async deleteModel(modelName = null) {
    if (!this.#supportedPlatform()) return [];
    if (!modelName) return true;
    await this.bootOrContinue();

    this.#log(`Removing model tag "${modelName}".`);
    return await fetch(`${this.basePath()}/api/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: modelName }),
    })
      .then((res) => res.json())
      .catch(() => false);
  }

  async kill() {
    if (!this.#supportedPlatform()) return [];
    if (!process.parentPort) return;
    process.parentPort.postMessage({ message: "kill-ollama" });
    return;
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  promptWindowLimit() {
    switch (this.model) {
      case "llama3.1:latest":
      case "phi3:latest":
        return 131072;

      case "gemma2:latest":
      case "gemma:2b":
      case "gemma:7b":
      case "llama3:latest":
        return 8192;

      case "llama2:latest":
      case "llama2:13b":
      case "llama2-uncensored:latest":
      case "codellama:7b":
        return 4096;

      case "mistral:latest":
      case "mixtral:latest":
      case "dolphin-mixtral:latest":
        return 32768;

      case "phi:latest":
      case "orca-mini:3b":
      case "orca-mini:7b":
      case "orca-mini:13b":
        return 2048;

      default:
        return 4096;
    }
  }

  async isValidChatCompletionModel(_ = "") {
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
    // Not implemented so must be stubbed
    return { safe: true, reasons: [] };
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = this.#ollamaClient({ temperature });
    const textResponse = await model
      .pipe(new StringOutputParser())
      .invoke(this.#convertToLangchainPrototypes(messages))
      .catch((e) => {
        throw new Error(
          `AnythingLLM::getChatCompletion failed to communicate with AnythingLLM. ${e.message}`
        );
      });

    if (!textResponse || !textResponse.length)
      throw new Error(
        `AnythingLLM::getChatCompletion text response was empty.`
      );

    return textResponse;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = this.#ollamaClient({ temperature });
    const stream = await model
      .pipe(new StringOutputParser())
      .stream(this.#convertToLangchainPrototypes(messages));
    return stream;
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise(async (resolve) => {
      let fullText = "";

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => clientAbortedHandler(resolve, fullText);
      response.on("close", handleAbort);

      try {
        for await (const chunk of stream) {
          if (chunk === undefined)
            throw new Error(
              "Stream returned undefined chunk. Aborting reply - check model provider logs."
            );

          const content = chunk.hasOwnProperty("content")
            ? chunk.content
            : chunk;
          fullText += content;
          writeResponseChunk(response, {
            uuid,
            sources: [],
            type: "textResponseChunk",
            textResponse: content,
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
        resolve(fullText);
      } catch (error) {
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "abort",
          textResponse: "",
          close: true,
          error: this.#errorHandler(
            `AnythingLLM:streaming - could not stream chat. ${
              error?.cause ?? error.message
            }`
          ),
        });
        response.removeListener("close", handleAbort);
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
  AnythingLLMOllama,
};
