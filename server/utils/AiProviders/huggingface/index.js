const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const { OpenAiEmbedder } = require("../../EmbeddingEngines/openAi");
const { chatPrompt } = require("../../chats");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");

class HuggingFaceLLM {
  constructor(embedder = null, _modelPreference = null) {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.HUGGING_FACE_LLM_ENDPOINT)
      throw new Error("No HuggingFace Inference Endpoint was set.");
    if (!process.env.HUGGING_FACE_LLM_API_KEY)
      throw new Error("No HuggingFace Access Token was set.");

    const config = new Configuration({
      basePath: `${process.env.HUGGING_FACE_LLM_ENDPOINT}/v1`,
      apiKey: process.env.HUGGING_FACE_LLM_API_KEY,
    });
    this.openai = new OpenAIApi(config);
    // When using HF inference server - the model param is not required so
    // we can stub it here. HF Endpoints can only run one model at a time.
    // We set to 'tgi' so that endpoint for HF can accept message format
    this.model = "tgi";
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      console.warn(
        "No embedding provider defined for HuggingFaceLLM - falling back to Native for embedding!"
      );
    this.embedder = !embedder ? new OpenAiEmbedder() : new NativeEmbedder();
    this.defaultTemp = 0.2;
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
    return "streamChat" in this && "streamGetChatCompletion" in this;
  }

  promptWindowLimit() {
    const limit = process.env.HUGGING_FACE_LLM_TOKEN_LIMIT || 4096;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No HuggingFace token context limit was set.");
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
    // System prompt it not enabled for HF model chats
    const prompt = {
      role: "user",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    const assistantResponse = {
      role: "assistant",
      content: "Okay, I will follow those instructions",
    };
    return [
      prompt,
      assistantResponse,
      ...chatHistory,
      { role: "user", content: userPrompt },
    ];
  }

  async isSafe(_input = "") {
    // Not implemented so must be stubbed
    return { safe: true, reasons: [] };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const textResponse = await this.openai
      .createChatCompletion({
        model: this.model,
        temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
        n: 1,
        messages: await this.compressMessages(
          {
            systemPrompt: chatPrompt(workspace),
            userPrompt: prompt,
            chatHistory,
          },
          rawHistory
        ),
      })
      .then((json) => {
        const res = json.data;
        if (!res.hasOwnProperty("choices"))
          throw new Error("HuggingFace chat: No results!");
        if (res.choices.length === 0)
          throw new Error("HuggingFace chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        throw new Error(
          `HuggingFace::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    const streamRequest = await this.openai.createChatCompletion(
      {
        model: this.model,
        stream: true,
        temperature: Number(workspace?.openAiTemp ?? this.defaultTemp),
        n: 1,
        messages: await this.compressMessages(
          {
            systemPrompt: chatPrompt(workspace),
            userPrompt: prompt,
            chatHistory,
          },
          rawHistory
        ),
      },
      { responseType: "stream" }
    );
    return streamRequest;
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const { data } = await this.openai.createChatCompletion({
      model: this.model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const streamRequest = await this.openai.createChatCompletion(
      {
        model: this.model,
        stream: true,
        messages,
        temperature,
      },
      { responseType: "stream" }
    );
    return streamRequest;
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;

    return new Promise((resolve) => {
      let fullText = "";
      let chunk = "";

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => clientAbortedHandler(resolve, fullText);
      response.on("close", handleAbort);

      stream.data.on("data", (data) => {
        const lines = data
          ?.toString()
          ?.split("\n")
          .filter((line) => line.trim() !== "");

        for (const line of lines) {
          let validJSON = false;
          const message = chunk + line.replace(/^data:/, "");
          if (message !== "[DONE]") {
            // JSON chunk is incomplete and has not ended yet
            // so we need to stitch it together. You would think JSON
            // chunks would only come complete - but they don't!
            try {
              JSON.parse(message);
              validJSON = true;
            } catch {
              console.log("Failed to parse message", message);
            }

            if (!validJSON) {
              // It can be possible that the chunk decoding is running away
              // and the message chunk fails to append due to string length.
              // In this case abort the chunk and reset so we can continue.
              // ref: https://github.com/Mintplex-Labs/anything-llm/issues/416
              try {
                chunk += message;
              } catch (e) {
                console.error(`Chunk appending error`, e);
                chunk = "";
              }
              continue;
            } else {
              chunk = "";
            }
          }

          if (message == "[DONE]") {
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
          } else {
            let error = null;
            let finishReason = null;
            let token = "";
            try {
              const json = JSON.parse(message);
              error = json?.error || null;
              token = json?.choices?.[0]?.delta?.content;
              finishReason = json?.choices?.[0]?.finish_reason || null;
            } catch {
              continue;
            }

            if (!!error) {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: null,
                close: true,
                error,
              });
              response.removeListener("close", handleAbort);
              resolve("");
              return;
            }

            if (token) {
              fullText += token;
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: token,
                close: false,
                error: false,
              });
            }

            if (finishReason !== null) {
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
            }
          }
        }
      });
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
  HuggingFaceLLM,
};
