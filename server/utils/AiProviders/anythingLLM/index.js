const { chatPrompt } = require("../../chats");
const { StringOutputParser } = require("langchain/schema/output_parser");
const { writeResponseChunk } = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");

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
      console.log(
        `\x1b[36m[AnythingLLMOllama]\x1b[0m Main process is intending to run local AnythingLLMOllama on port ${ollamaPort}`
      );
      process.env.ANYTHING_LLM_OLLAMA_PORT = ollamaPort;
    } else {
      console.error(
        `\x1b[36m[AnythingLLMOllama]\x1b[0m Failed to communicate. Will assume AnythingLLMOllama with bind to 11434.`
      );
      process.env.ANYTHING_LLM_OLLAMA_PORT = "11434";
    }
    return ollamaPort;
  }

  async #ollamaProcessRunning() {
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
    const { ChatOllama } = require("langchain/chat_models/ollama");
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
    } = require("langchain/schema");
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

  // Before running anything just call this to either boot up the Ollama service
  // or check if alive.
  async bootOrContinue() {
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
    await this.bootOrContinue();
    return await fetch(`${this.basePath()}/api/tags`, { method: "GET" })
      .then((res) => res.json())
      .then((json) => json.models || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  }

  async kill() {
    if (!process.parentPort) return;
    process.parentPort.postMessage({ message: "kill-ollama" });
    return;
  }

  streamingEnabled() {
    return "streamChat" in this && "streamGetChatCompletion" in this;
  }

  promptWindowLimit() {
    const limit = 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No AnythingLLM token context limit was set.");
    return Number(limit);
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

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const messages = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: prompt,
        chatHistory,
      },
      rawHistory
    );

    const model = this.#ollamaClient({
      temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
    });
    const textResponse = await model
      .pipe(new StringOutputParser())
      .invoke(this.#convertToLangchainPrototypes(messages))
      .catch((e) => {
        throw new Error(
          `Ollama::getChatCompletion failed to communicate with Ollama. ${e.message}`
        );
      });

    if (!textResponse || !textResponse.length)
      throw new Error(`Ollama::sendChat text response was empty.`);

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const messages = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: prompt,
        chatHistory,
      },
      rawHistory
    );

    const model = this.#ollamaClient({
      temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
    });
    const stream = await model
      .pipe(new StringOutputParser())
      .stream(this.#convertToLangchainPrototypes(messages));
    return stream;
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = this.#ollamaClient({ temperature });
    const textResponse = await model
      .pipe(new StringOutputParser())
      .invoke(this.#convertToLangchainPrototypes(messages))
      .catch((e) => {
        throw new Error(
          `Ollama::getChatCompletion failed to communicate with Ollama. ${e.message}`
        );
      });

    if (!textResponse || !textResponse.length)
      throw new Error(`Ollama::getChatCompletion text response was empty.`);

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
      try {
        let fullText = "";
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
        resolve(fullText);
      } catch (error) {
        writeResponseChunk(response, {
          uuid,
          sources: [],
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: `Ollama:streaming - could not stream chat. ${
            error?.cause ?? error.message
          }`,
        });
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
