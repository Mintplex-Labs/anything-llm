const {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { v4: uuidv4 } = require("uuid");

class AWSBedrockLLM {
  /**
   * These models do not support system prompts
   * It is not explicitly stated but it is observed that they do not use the system prompt
   * in their responses and will crash when a system prompt is provided.
   * We can add more models to this list as we discover them or new models are added.
   * We may want to extend this list or make a user-config if using custom bedrock models.
   */
  noSystemPromptModels = [
    "amazon.titan-text-express-v1",
    "amazon.titan-text-lite-v1",
    "cohere.command-text-v14",
    "cohere.command-light-text-v14",
    "us.deepseek.r1-v1:0",
  ];

  constructor(embedder = null, modelPreference = null) {
    if (!process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID)
      throw new Error("No AWS Bedrock LLM profile id was set.");

    if (!process.env.AWS_BEDROCK_LLM_ACCESS_KEY)
      throw new Error("No AWS Bedrock LLM access key was set.");

    if (!process.env.AWS_BEDROCK_LLM_REGION)
      throw new Error("No AWS Bedrock LLM region was set.");

    if (
      process.env.AWS_BEDROCK_LLM_CONNECTION_METHOD === "sessionToken" &&
      !process.env.AWS_BEDROCK_LLM_SESSION_TOKEN
    )
      throw new Error(
        "No AWS Bedrock LLM session token was set while using session token as the authentication method."
      );

    this.model =
      modelPreference || process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE;
    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.bedrockClient = new BedrockRuntimeClient({
      region: process.env.AWS_BEDROCK_LLM_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_BEDROCK_LLM_ACCESS_KEY,
        ...(this.authMethod === "sessionToken"
          ? { sessionToken: process.env.AWS_BEDROCK_LLM_SESSION_TOKEN }
          : {}),
      },
    });

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.#log(
      `Loaded with model: ${this.model}. Will communicate with AWS Bedrock using ${this.authMethod} authentication.`
    );
  }

  /**
   * Get the authentication method for the AWS Bedrock LLM.
   * There are only two valid values for this setting - anything else will default to "iam".
   * @returns {"iam"|"sessionToken"}
   */
  get authMethod() {
    const method = process.env.AWS_BEDROCK_LLM_CONNECTION_METHOD || "iam";
    if (!["iam", "sessionToken"].includes(method)) return "iam";
    return method;
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

  #log(text, ...args) {
    console.log(`\x1b[32m[AWSBedrock]\x1b[0m ${text}`, ...args);
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
   * TODO: Implement this - attachments are not supported yet for Bedrock.
   * @param {{userPrompt:string, attachments: import("../../helpers").Attachment[]}}
   * @returns {string|object[]}
   */
  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) return [{ text: userPrompt }];

    // const content = [{ type: "text", text: userPrompt }];
    // for (let attachment of attachments) {
    //   content.push({
    //     type: "image_url",
    //     image_url: attachment.contentString,
    //   });
    // }
    // return { content: content.flat() };
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
    _attachments = [],
  }) {
    let prompt = [
      {
        role: "system",
        content: [
          { text: `${systemPrompt}${this.#appendContext(contextTexts)}` },
        ],
      },
    ];

    // If the model does not support system prompts, we need to add a user message and assistant message
    if (this.noSystemPromptModels.includes(this.model)) {
      prompt = [
        {
          role: "user",
          content: [
            { text: `${systemPrompt}${this.#appendContext(contextTexts)}` },
          ],
        },
        {
          role: "assistant",
          content: [{ text: "Okay." }],
        },
      ];
    }

    return [
      ...prompt,
      ...chatHistory.map((msg) => ({
        role: msg.role,
        content: this.#generateContent({
          userPrompt: msg.content,
          attachments: msg.attachments,
        }),
      })),
      {
        role: "user",
        content: this.#generateContent({
          userPrompt: userPrompt,
          attachments: [],
        }),
      },
    ];
  }

  /**
   * Parses and prepends reasoning from the response and returns the full text response.
   * @param {Object} response
   * @returns {string}
   */
  #parseReasoningFromResponse({ content = [] }) {
    let textResponse = content[0]?.text;

    if (
      !!content?.[1]?.reasoningContent &&
      content?.[1]?.reasoningContent?.reasoningText?.text?.trim().length > 0
    )
      textResponse = `<think>${content?.[1]?.reasoningContent?.reasoningText?.text}</think>${textResponse}`;

    return textResponse;
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const hasSystem = messages[0]?.role === "system";
    const [system, ...history] = hasSystem ? messages : [null, ...messages];

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.bedrockClient
        .send(
          new ConverseCommand({
            modelId: this.model,
            messages: history,
            inferenceConfig: {
              maxTokens: this.promptWindowLimit(),
              temperature,
            },
            system: !!system ? system.content : undefined,
          })
        )
        .catch((e) => {
          throw new Error(
            `AWSBedrock::getChatCompletion failed to communicate with Bedrock client. ${e.message}`
          );
        }),
      messages,
      false
    );

    const response = result.output;
    if (!response || !response?.output) return null;
    return {
      textResponse: this.#parseReasoningFromResponse(response.output?.message),
      metrics: {
        prompt_tokens: response?.usage?.inputTokens,
        completion_tokens: response?.usage?.outputTokens,
        total_tokens: response?.usage?.totalTokens,
        outputTps:
          response?.usage?.outputTokens / (response?.metrics?.latencyMs / 1000),
        duration: result.duration,
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const hasSystem = messages[0]?.role === "system";
    const [system, ...history] = hasSystem ? messages : [null, ...messages];

    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
      this.bedrockClient.send(
        new ConverseStreamCommand({
          modelId: this.model,
          messages: history,
          inferenceConfig: { maxTokens: this.promptWindowLimit(), temperature },
          system: !!system ? system.content : undefined,
        })
      ),
      messages,
      false
    );
    return measuredStreamRequest;
  }

  /**
   * Handles the stream response from the AWS Bedrock API.
   * Bedrock does not support usage metrics in the stream response so we need to estimate them.
   * @param {Object} response - the response object
   * @param {import('../../helpers/chat/LLMPerformanceMonitor').MonitoredStream} stream - the stream response from the AWS Bedrock API w/tracking
   * @param {Object} responseProps - the response properties
   * @returns {Promise<string>}
   */
  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    let hasUsageMetrics = false;
    let usage = {
      prompt_tokens: 0,
      completion_tokens: 0,
    };

    return new Promise(async (resolve) => {
      let fullText = "";
      let reasoningText = "";

      // Establish listener to early-abort a streaming response
      // in case things go sideways or the user does not like the response.
      // We preserve the generated text but continue as if chat was completed
      // to preserve previously generated content.
      const handleAbort = () => {
        stream?.endMeasurement(usage);
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      try {
        for await (const chunk of stream.stream) {
          if (chunk === undefined)
            throw new Error(
              "Stream returned undefined chunk. Aborting reply - check model provider logs."
            );

          const action = Object.keys(chunk)[0];
          if (action === "metadata") {
            hasUsageMetrics = true;
            usage.prompt_tokens = chunk.metadata?.usage?.inputTokens ?? 0;
            usage.completion_tokens = chunk.metadata?.usage?.outputTokens ?? 0;
            usage.total_tokens = chunk.metadata?.usage?.totalTokens ?? 0;
          }

          if (action === "contentBlockDelta") {
            const token = chunk.contentBlockDelta?.delta?.text;
            const reasoningToken =
              chunk.contentBlockDelta?.delta?.reasoningContent?.text;

            // Reasoning models will always return the reasoning text before the token text.
            if (reasoningToken) {
              // If the reasoning text is empty (''), we need to initialize it
              // and send the first chunk of reasoning text.
              if (reasoningText.length === 0) {
                writeResponseChunk(response, {
                  uuid,
                  sources: [],
                  type: "textResponseChunk",
                  textResponse: `<think>${reasoningToken}`,
                  close: false,
                  error: false,
                });
                reasoningText += `<think>${reasoningToken}`;
                continue;
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

            // If the reasoning text is not empty, but the reasoning token is empty
            // and the token text is not empty we need to close the reasoning text and begin sending the token text.
            if (!!reasoningText && !reasoningToken && token) {
              writeResponseChunk(response, {
                uuid,
                sources: [],
                type: "textResponseChunk",
                textResponse: `</think>`,
                close: false,
                error: false,
              });
              fullText += `${reasoningText}</think>`;
              reasoningText = "";
            }

            if (token) {
              fullText += token;
              // If we never saw a usage metric, we can estimate them by number of completion chunks
              if (!hasUsageMetrics) usage.completion_tokens++;
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
        stream?.endMeasurement(usage);
        resolve(fullText);
      } catch (error) {
        console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
        writeResponseChunk(response, {
          uuid,
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: `AWSBedrock:streaming - could not stream chat. ${error?.cause ?? error.message}`,
        });
        response.removeListener("close", handleAbort);
        stream?.endMeasurement(usage);
        resolve(fullText); // Return what we currently have - if anything.
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
