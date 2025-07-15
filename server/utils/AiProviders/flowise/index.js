const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { v4 } = require("uuid");
const { Readable } = require("stream");

class FlowiseLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.FLOWISE_LLM_BASE_PATH)
      throw new Error(
        "FlowiseLLM must have a valid base path to use for the api."
      );

    if (!process.env.FLOWISE_LLM_CHATFLOW_ID)
      throw new Error(
        "FlowiseLLM must have a valid Chatflow ID to use for the api."
      );

    this.basePath = process.env.FLOWISE_LLM_BASE_PATH;
    this.model = "flowise";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
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
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(_modelName) {
    const limit = process.env.FLOWISE_LLM_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No token context limit was set.");
    return Number(limit);
  }

  promptWindowLimit() {
    const limit = process.env.FLOWISE_LLM_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No token context limit was set.");
    return Number(limit);
  }

  isValidChatCompletionModel(_modelName = "") {
    return true;
  }

  formatFlowiseChatHistory(chatHistory = []) {
    return chatHistory.map((message) => {
      return {
        role: message.role === "user" ? "userMessage" : "apiMessage",
        content: message.content,
      };
    });
  }

  formatFlowiseAttachments(attachments = []) {
    return attachments.map((attachment) => ({
      data: attachment.contentString,
      type: "file",
      name: attachment.name,
      mime: attachment.mime,
    }));
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const historicalAttachments = [];
    for (const message of chatHistory) {
      if (message.attachments?.length) {
        historicalAttachments.push(...message.attachments);
      }
    }
    return {
      question: userPrompt,
      history: this.formatFlowiseChatHistory(chatHistory),
      attachments: this.formatFlowiseAttachments([
        ...attachments,
        ...historicalAttachments,
      ]),
    };
  }

  async getChatCompletion(messages = null) {
    try {
      const lastMessage = messages[messages.length - 1];
      const result = await LLMPerformanceMonitor.measureAsyncFunction(
        fetch(
          `${this.basePath}/api/v1/prediction/${process.env.FLOWISE_LLM_CHATFLOW_ID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: lastMessage.content,
              streaming: false,
            }),
          }
        )
      );

      const response = result.output;
      if (!response || !response.content || !response.content[0]) {
        throw new Error("Invalid response format from Flowise API");
      }

      const promptTokens = response.usage?.input_tokens || 0;
      const completionTokens = response.usage?.output_tokens || 0;

      return {
        textResponse: response.content[0].text,
        metrics: {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
          outputTps: completionTokens / result.duration,
          duration: result.duration,
        },
      };
    } catch (error) {
      this.log(`Error in getChatCompletion: ${error.message}`);
      return {
        textResponse: "An error occurred while processing your request.",
        metrics: {},
      };
    }
  }

  async streamGetChatCompletion({ attachments, history, question }) {
    try {
      const response = await fetch(
        `${this.basePath}/api/v1/prediction/${process.env.FLOWISE_LLM_CHATFLOW_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            streaming: true,
            uploads: attachments,
            question,
            history,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const stream = new Readable({
        read() {},
      });

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          stream.push(null);
          break;
        }
        stream.push(value);
      }

      return stream;
    } catch (error) {
      this.log(`Error in streamGetChatCompletion: ${error.message}`);
      throw error;
    }
  }

  handleStream(response, stream, responseProps) {
    return new Promise(async (resolve) => {
      let fullText = "";
      const { uuid = v4(), sources = [] } = responseProps;
      let usage = {
        prompt_tokens: 0,
        completion_tokens: 0,
      };

      const handleAbort = () => {
        stream?.endMeasurement?.(usage);
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      let buffer = "";
      stream.on("data", (chunk) => {
        const text = chunk.toString();
        const lines = (buffer + text).split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim() || line.startsWith("message:")) continue;

          if (line.startsWith("data:")) {
            try {
              const data = JSON.parse(line.slice(5));
              if (data.event === "token") {
                fullText += data.data;
                writeResponseChunk(response, {
                  uuid,
                  sources,
                  type: "textResponseChunk",
                  textResponse: data.data,
                  close: false,
                  error: false,
                });
              }
            } catch (e) {
              this.log(`Error parsing chunk: ${e.message}`);
            }
          }
        }
      });

      stream.on("end", () => {
        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer.trim().slice(5));
            if (data.event === "token") {
              fullText += data.data;
              writeResponseChunk(response, {
                uuid,
                sources,
                type: "textResponseChunk",
                textResponse: data.data,
                close: false,
                error: false,
              });
            }
          } catch (e) {
            this.log(`Error parsing final buffer: ${e.message}`);
          }
        }

        writeResponseChunk(response, {
          uuid,
          sources,
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: false,
        });

        stream?.endMeasurement?.(usage);
        resolve(fullText);
      });

      stream.on("error", (error) => {
        this.log(`Stream error: ${error.message}`);
        writeResponseChunk(response, {
          uuid,
          sources,
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: error.message,
        });
        stream?.endMeasurement?.(usage);
        resolve(fullText);
      });
    });
  }

  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }

  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    return this.constructPrompt(promptArgs);
  }
}

module.exports = {
  FlowiseLLM,
};
