const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  handleDefaultStreamResponseV2,
} = require("../../helpers/chat/responses");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../../http");

const cacheFolder = path.resolve(
  process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "models", "sambanova")
    : path.resolve(__dirname, `../../../storage/models/sambanova`)
);

// async function sambanovaModels(apiKey = null) {
//   console.log('trying to get models from cloud api')
//   // const cacheModelPath = path.resolve(cacheFolder, "models.json");
//   // const cacheAtPath = path.resolve(cacheFolder, ".cached_at");

//   // // If cache exists and is less than 1 week old, use it
//   // if (fs.existsSync(cacheModelPath) && fs.existsSync(cacheAtPath)) {
//   //   const now = Number(new Date());
//   //   const timestampMs = Number(fs.readFileSync(cacheAtPath));
//   //   if (now - timestampMs <= 6.048e8) {
//   //     // 1 Week in MS
//   //     return safeJsonParse(
//   //       fs.readFileSync(cacheModelPath, { encoding: "utf-8" }),
//   //       []
//   //     );
//   //   }
//   // }

//   try {
//     // const { OpenAI: OpenAIApi } = require("openai");
//     // const openai = new OpenAIApi({
//     //   baseURL: "https://api.sambanova.ai/v1",
//     //   apiKey: apiKey || process.env.SAMBANOVA_API_KEY || null,
//     // });

//     // const response = await openai.models.list();

//     // // Filter and transform models into the expected format
//     // // Only include chat models
//     // const validModels = response.body
//     //   .filter((model) => ["chat"].includes(model.type))
//     //   .map((model) => ({
//     //     id: model.id,
//     //     name: model.display_name || model.id,
//     //     organization: model.organization || "Unknown",
//     //     type: model.type,
//     //     maxLength: model.context_length || 4096,
//     //   }));

//     // // Cache the results
//     // if (!fs.existsSync(cacheFolder))
//     //   fs.mkdirSync(cacheFolder, { recursive: true });
//     // fs.writeFileSync(cacheModelPath, JSON.stringify(validModels), {
//     //   encoding: "utf-8",
//     // });
//     // fs.writeFileSync(cacheAtPath, String(Number(new Date())), {
//     //   encoding: "utf-8",
//     // });

//     return validModels;
//   } catch (error) {
//     console.error("Error fetching SambaNova models:", error);
//     // If cache exists but is stale, still use it as fallback
//     // if (fs.existsSync(cacheModelPath)) {
//     //   return safeJsonParse(
//     //     fs.readFileSync(cacheModelPath, { encoding: "utf-8" }),
//     //     []
//     //   );
//     // }
//     return [];
//   }
// }

async function sambanovaModels(apiKey = null) {
  console.log('Trying to get models from SambaNova Cloud API');

  const endpoint = 'https://api.sambanova.ai/v1/models';
  const headers = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
      throw new Error("Unexpected response structure");
    }

    const modelIds = data.data.map(model => model.id);

    console.log("Fetched models:", modelIds);

    return modelIds;
  } catch (error) {
    console.error("Error fetching SambaNova models:", error);
    return [];
  }
}

class SambaNovaLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.SAMBANOVA_API_KEY)
      throw new Error("No SambaNova API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    this.openai = new OpenAIApi({
      baseURL: "https://api.sambanova.ai/v1",
      apiKey: process.env.SAMBANOVA_API_KEY ?? null,
    });
    this.model = modelPreference || process.env.SAMBANOVA_MODEL_PREF;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = !embedder ? new NativeEmbedder() : embedder;
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

  async allModelInformation() {
    const models = await sambanovaModels();
    return models.reduce((acc, model) => {
      acc[model.id] = model;
      return acc;
    }, {});
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static async promptWindowLimit(modelName) {
    const models = await sambanovaModels();
    const model = models.find((m) => m.id === modelName);
    return model?.maxLength || 4096;
  }

  async promptWindowLimit() {
    const models = await sambanovaModels();
    const model = models.find((m) => m.id === this.model);
    return model?.maxLength || 4096;
  }

  async isValidChatCompletionModel(model = "") {
    const models = await sambanovaModels();
    const foundModel = models.find((m) => m.id === model);
    return foundModel && foundModel.type === "chat";
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
      ...chatHistory,
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    if (!(await this.isValidChatCompletionModel(this.model)))
      throw new Error(
        `SambaNova chat: ${this.model} is not valid for chat completion!`
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

    return {
      textResponse: result.output.choices[0].message.content,
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
        `SambaNova chat: ${this.model} is not valid for chat completion!`
      );

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
      }),
      messages,
      false
    );
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
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  SambaNovaLLM,
  sambanovaModels,
};
