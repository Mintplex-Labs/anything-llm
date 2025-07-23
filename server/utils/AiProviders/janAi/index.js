const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { formatChatHistory } = require("../../helpers/chat/responses");
const { v4: uuidv4 } = require("uuid");

class JanAiLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.JAN_AI_API_KEY)
      throw new Error("No Jan AI API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");

    this.basePath = process.env.JAN_AI_BASE_PATH || "http://127.0.0.1:1337/v1";
    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey: process.env.JAN_AI_API_KEY,
    });
    this.model = modelPreference || process.env.JAN_AI_MODEL_PREF;
    this.contextWindow = process.env.JAN_AI_MODEL_TOKEN_LIMIT || 4096;
    this.limits = {
      history: this.contextWindow * 0.15,
      system: this.contextWindow * 0.15,
      user: this.contextWindow * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.timeout = 500;

    // Get model context window since this is available in the model list
    this.updateContextWindow();
  }

  async updateContextWindow() {
    try {
      const { data } = await this.openai.models.list();
      const model = data.find((m) => m.id === this.model);
      if (model?.ctx_len) {
        this.contextWindow = model.ctx_len;
        this.limits = {
          history: this.contextWindow * 0.15,
          system: this.contextWindow * 0.15,
          user: this.contextWindow * 0.7,
        };
      }
    } catch (error) {
      this.log(`Using default context window of ${this.contextWindow}`);
    }
  }

  log(message) {
    console.log(`[Jan AI] ${message}`);
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
        },
      });
    }
    return content.flat();
  }

  streamingEnabled() {
    return true;
  }

  async isValidChatCompletionModel(model) {
    try {
      const { data } = await this.openai.models.list();
      return data.some((m) => m.id === model);
    } catch (error) {
      console.error("Failed to validate model:", error);
      return false;
    }
  }

  promptWindowLimit() {
    return this.contextWindow;
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
      ...formatChatHistory(chatHistory, this.#generateContent),
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Jan AI chat: ${this.model} is not valid for chat completion!`
      );

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

    if (!result.output?.choices?.length) return null;

    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        prompt_tokens: result.output.usage.prompt_tokens || 0,
        completion_tokens: result.output.usage.completion_tokens || 0,
        total_tokens: result.output.usage.total_tokens || 0,
        outputTps: result.output.usage.completion_tokens / result.duration,
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Jan AI chat: ${this.model} is not valid for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
      }),
      messages
    );

    return measuredStreamRequest;
  }

  // Custom stream handler for Jan AI
  // Jan AI does not send a finish_reason (always returns null) so we handle it manually using a timeout
  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    let lastChunkTime = null;
    let usage = { completion_tokens: 0 };

    return new Promise((resolve) => {
      let fullText = "";
      let reasoningText = "";

      const handleAbort = () => {
        stream?.endMeasurement(usage);
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      const timeoutCheck = setInterval(() => {
        if (lastChunkTime === null) return;
        const now = Number(new Date());
        const diffMs = now - lastChunkTime;

        if (diffMs >= this.timeout) {
          this.log(
            `Stream stale for >${this.timeout}ms. Closing response stream.`
          );
          writeResponseChunk(response, {
            uuid,
            sources,
            type: "textResponseChunk",
            textResponse: "",
            close: true,
            error: false,
          });
          clearInterval(timeoutCheck);
          response.removeListener("close", handleAbort);
          stream?.endMeasurement(usage);
          resolve(fullText);
        }
      }, 100);

      const processStream = async () => {
        try {
          for await (const chunk of stream) {
            lastChunkTime = Number(new Date());
            const message = chunk?.choices?.[0];
            const token = message?.delta?.content;
            const reasoningToken = message?.delta?.reasoning_content;

            if (reasoningToken) {
              if (reasoningText.length === 0) {
                writeResponseChunk(response, {
                  uuid,
                  sources: [],
                  type: "textResponseChunk",
                  textResponse: `<think>${reasoningToken}`,
                  close: false,
                  error: false,
                });
                reasoningText = `<think>${reasoningToken}`;
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

            if (!!reasoningText && !reasoningToken && token) {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: "</think>",
                close: false,
                error: false,
              });
              fullText += `${reasoningText}</think>`;
              reasoningText = "";
            }

            if (token) {
              fullText += token;
              usage.completion_tokens++;
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: token,
                close: false,
                error: false,
              });
            }
          }
        } catch (e) {
          clearInterval(timeoutCheck);
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
      };

      processStream();
    });
  }

  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }
}

module.exports = { JanAiLLM };
