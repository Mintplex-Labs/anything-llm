const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");

function perplexityModels() {
  const { MODELS } = require("./models.js");
  return MODELS || {};
}

class PerplexityLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.PERPLEXITY_API_KEY)
      throw new Error("No Perplexity API key was set.");

    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: "https://api.perplexity.ai",
      apiKey: process.env.PERPLEXITY_API_KEY ?? null,
    });
    this.model =
      modelPreference ||
      process.env.PERPLEXITY_MODEL_PREF ||
      "llama-3-sonar-large-32k-online"; // Give at least a unique model to the provider as last fallback.
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
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
    return perplexityModels();
  }

  streamingEnabled() {
    // return "streamGetChatCompletion" in this;
    return false;
  }

  static promptWindowLimit(modelName) {
    const availableModels = perplexityModels();
    return availableModels[modelName]?.maxLength || 4096;
  }

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

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Perplexity chat: ${this.model} is not valid for chat completion!`
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

    if (
      !result.output.hasOwnProperty("choices") ||
      result.output.choices.length === 0
    )
      return null;

    console.log("Perplexity Citations:", result.output.citations);

    return {
      textResponse: result.output.choices[0].message.content,
      citations: result.output.citations || [],
      metrics: {
        prompt_tokens: result.output.usage?.prompt_tokens || 0,
        completion_tokens: result.output.usage?.completion_tokens || 0,
        total_tokens: result.output.usage?.total_tokens || 0,
        outputTps: result.output.usage?.completion_tokens / result.duration,
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `Perplexity chat: ${this.model} is not valid for chat completion!`
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

    // Store citations in the stream object so they can be accessed later
    measuredStreamRequest.citations = [];
    const originalStream = measuredStreamRequest.stream;
    measuredStreamRequest.stream = async function* () {
      try {
        for await (const chunk of originalStream) {
          // Debug the raw chunk to see what we're getting
          console.log("Perplexity Stream Chunk:", JSON.stringify(chunk, null, 2));

          // Check if citations exist in the chunk or its choices
          if (chunk.citations) {
            console.log("Found citations in chunk:", chunk.citations);
            measuredStreamRequest.citations = chunk.citations;
          } else if (chunk.choices?.[0]?.delta?.citations) {
            console.log("Found citations in delta:", chunk.choices[0].delta.citations);
            measuredStreamRequest.citations = chunk.choices[0].delta.citations;
          }
          yield chunk;
        }
      } catch (error) {
        console.error("Error in stream processing:", error);
        throw error;
      }
    }();

    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    // Store citations in responseProps so they get passed to the response chunks
    if (stream.citations && stream.citations.length > 0) {
      console.log("Perplexity handleStream Citations:", stream.citations);
      responseProps.citations = stream.citations;
    }
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
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  PerplexityLLM,
  perplexityModels,
};
