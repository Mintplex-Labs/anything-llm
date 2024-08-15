const { StringOutputParser } = require("@langchain/core/output_parsers");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");

// Docs: https://js.langchain.com/v0.2/docs/integrations/chat/bedrock_converse
class AWSBedrockLLM {
  constructor(embedder = null, modelPreference = null) {
    if (!process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID)
      throw new Error("No AWS Bedrock LLM profile id was set.");

    if (!process.env.AWS_BEDROCK_LLM_ACCESS_KEY)
      throw new Error("No AWS Bedrock LLM access key was set.");

    if (!process.env.AWS_BEDROCK_LLM_REGION)
      throw new Error("No AWS Bedrock LLM region was set.");

    this.model =
      modelPreference || process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
  }

  #bedrockClient({ temperature = 0.7 }) {
    const { ChatBedrockConverse } = require("@langchain/aws");
    return new ChatBedrockConverse({
      model: process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE,
      region: process.env.AWS_BEDROCK_LLM_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_BEDROCK_LLM_ACCESS_KEY,
      },
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

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(_modelName) {
    const limit = process.env.AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT || 8191;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No valid token context limit was set.");
    return Number(limit);
  }

  // Ensure the user set a value for the token limit
  // and if undefined - assume 4096 window.
  promptWindowLimit() {
    const limit = process.env.AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT || 8191;
    if (!limit || isNaN(Number(limit)))
      throw new Error("No valid token context limit was set.");
    return Number(limit);
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
      return { content: userPrompt };
    }

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: attachment.contentString,
      });
    }
    return { content: content.flat() };
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
    // AWS Mistral models do not support system prompts
    if (this.model.startsWith("mistral"))
      return [
        ...chatHistory,
        {
          role: "user",
          ...this.#generateContent({ userPrompt, attachments }),
        },
      ];

    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...chatHistory,
      {
        role: "user",
        ...this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = this.#bedrockClient({ temperature });
    const textResponse = await model
      .pipe(new StringOutputParser())
      .invoke(this.#convertToLangchainPrototypes(messages))
      .catch((e) => {
        throw new Error(
          `AWSBedrock::getChatCompletion failed to communicate with Ollama. ${e.message}`
        );
      });

    if (!textResponse || !textResponse.length)
      throw new Error(`AWSBedrock::getChatCompletion text response was empty.`);

    return textResponse;
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const model = this.#bedrockClient({ temperature });
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
          type: "textResponseChunk",
          textResponse: "",
          close: true,
          error: `AWSBedrock:streaming - could not stream chat. ${
            error?.cause ?? error.message
          }`,
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
  AWSBedrockLLM,
};
