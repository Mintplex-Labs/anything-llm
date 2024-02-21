const { chatPrompt } = require("../../chats");
const { writeResponseChunk } = require("../../helpers/chat/responses");

function togetherAiModels() {
  const { MODELS } = require("./models.js");
  return MODELS || {};
}

class TogetherAiLLM {
  constructor(embedder = null, modelPreference = null) {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.TOGETHER_AI_API_KEY)
      throw new Error("No TogetherAI API key was set.");

    const config = new Configuration({
      basePath: "https://api.together.xyz/v1",
      apiKey: process.env.TOGETHER_AI_API_KEY,
    });
    this.openai = new OpenAIApi(config);
    this.model = modelPreference || process.env.TOGETHER_AI_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    if (!embedder)
      throw new Error(
        "INVALID TOGETHER AI SETUP. No embedding engine has been set. Go to instance settings and set up an embedding interface to use Together AI as your LLM."
      );
    this.embedder = embedder;
    this.defaultTemp = 0.7;
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

  allModelInformation() {
    return togetherAiModels();
  }

  streamingEnabled() {
    return "streamChat" in this && "streamGetChatCompletion" in this;
  }

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const availableModels = this.allModelInformation();
    return availableModels[this.model]?.maxLength || 4096;
  }

  async isValidChatCompletionModel(model = "") {
    const availableModels = this.allModelInformation();
    return availableModels.hasOwnProperty(model);
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
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Together AI chat: ${this.model} is not valid for chat completion!`
      );

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
          throw new Error("Together AI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("Together AI chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        throw new Error(
          `TogetherAI::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `TogetherAI chat: ${this.model} is not valid for chat completion!`
      );

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
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `TogetherAI chat: ${this.model} is not valid for chat completion!`
      );

    const { data } = await this.openai.createChatCompletion({
      model: this.model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `TogetherAI chat: ${this.model} is not valid for chat completion!`
      );

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
      stream.data.on("data", (data) => {
        const lines = data
          ?.toString()
          ?.split("\n")
          .filter((line) => line.trim() !== "");

        for (const line of lines) {
          let validJSON = false;
          const message = chunk + line.replace(/^data: /, "");

          if (message !== "[DONE]") {
            // JSON chunk is incomplete and has not ended yet
            // so we need to stitch it together. You would think JSON
            // chunks would only come complete - but they don't!
            try {
              JSON.parse(message);
              validJSON = true;
            } catch {}

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
            resolve(fullText);
          } else {
            let finishReason = null;
            let token = "";
            try {
              const json = JSON.parse(message);
              token = json?.choices?.[0]?.delta?.content;
              finishReason = json?.choices?.[0]?.finish_reason || null;
            } catch {
              continue;
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
  TogetherAiLLM,
  togetherAiModels,
};
