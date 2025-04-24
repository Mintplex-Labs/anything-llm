/**
 * AWS Bedrock Language Model Connector using the Converse API.
 * Supports text and multi-modal (text + image) interactions.
 * Handles distinct context window limits and max output token limits.
 */

// Core AWS SDK imports for Bedrock Converse API
const {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommand,
} = require("@aws-sdk/client-bedrock-runtime");

// Helper imports from the application
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses"); // For streaming responses
const { NativeEmbedder } = require("../../EmbeddingEngines/native"); // Default embedder
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor"); // For tracking API call performance
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs
const { MODEL_MAP } = require("../modelMap"); // Although imported, not currently used for Bedrock limits

// --- Constants ---

/** @const {string[]} Supported image formats by Bedrock Converse API */
const SUPPORTED_BEDROCK_IMAGE_FORMATS = ["jpeg", "png", "gif", "webp"];
/** @const {number} Default maximum tokens to generate in the response. Models often have lower output limits than their total context windows. */
const DEFAULT_MAX_OUTPUT_TOKENS = 4096;
/** @const {number} Default total context window size if not specified in environment variables. */
const DEFAULT_CONTEXT_WINDOW_TOKENS = 8191;

// --- Helper Functions ---

/**
 * Parses a MIME type string (e.g., "image/jpeg") to extract and validate the image format
 * supported by Bedrock Converse. Handles 'image/jpg' as 'jpeg'.
 * @param {string | null | undefined} mimeType - The MIME type string.
 * @returns {string | null} The validated image format (e.g., "jpeg") or null if invalid/unsupported.
 */
function getImageFormatFromMime(mimeType) {
  if (!mimeType || typeof mimeType !== 'string') {
    console.warn(`[AWSBedrock] Invalid or missing MIME type provided for attachment.`);
    return null;
  }
  const parts = mimeType.toLowerCase().split('/');
  if (parts.length !== 2 || parts[0] !== 'image') {
    console.warn(`[AWSBedrock] Invalid MIME type format: "${mimeType}". Expected "image/...".`);
    return null;
  }

  let format = parts[1];
  if (format === 'jpg') format = 'jpeg'; // Normalize jpg to jpeg

  if (!SUPPORTED_BEDROCK_IMAGE_FORMATS.includes(format)) {
     console.warn(`[AWSBedrock] Unsupported image format: "${format}" from MIME type "${mimeType}". Supported formats: ${SUPPORTED_BEDROCK_IMAGE_FORMATS.join(', ')}.`);
     return null;
  }
  return format;
}

/**
 * Decodes a pure base64 string (without data URI prefix) into a Uint8Array using the atob method.
 * This approach matches the technique previously used by Langchain's implementation.
 * @param {string} base64String - The pure base64 encoded data.
 * @returns {Uint8Array | null} The resulting byte array or null on decoding error.
 */
function base64ToUint8Array(base64String) {
  try {
    const binaryString = atob(base64String); // Decode base64 to binary string
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i); // Convert char code to byte value
    }
    return bytes;
  } catch (e) {
    console.error(`[AWSBedrock] Error decoding base64 string with atob: ${e.message}`);
    if (e.name === 'InvalidCharacterError') {
        console.error("[AWSBedrock] Base64 decoding failed. Ensure input string is valid base64 and does not contain a data URI prefix.");
    }
    return null;
  }
}


// --- AWSBedrockLLM Class ---

class AWSBedrockLLM {
  /**
   * List of Bedrock models observed to not support system prompts when using the Converse API.
   * @type {string[]}
   */
  noSystemPromptModels = [
    "amazon.titan-text-express-v1",
    "amazon.titan-text-lite-v1",
    "cohere.command-text-v14",
    "cohere.command-light-text-v14",
    // Add other models here if identified
  ];

  /**
   * Initializes the AWS Bedrock LLM connector.
   * @param {object | null} [embedder=null] - An optional embedder instance. Defaults to NativeEmbedder.
   * @param {string | null} [modelPreference=null] - Optional model ID override. Defaults to environment variable.
   * @throws {Error} If required environment variables are missing or invalid.
   */
  constructor(embedder = null, modelPreference = null) {
    // --- Environment Variable Validation ---
    const requiredEnvVars = [
        'AWS_BEDROCK_LLM_ACCESS_KEY_ID',
        'AWS_BEDROCK_LLM_ACCESS_KEY',
        'AWS_BEDROCK_LLM_REGION',
        'AWS_BEDROCK_LLM_MODEL_PREFERENCE' // Model preference is effectively required
    ];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Required environment variable ${envVar} is not set.`);
        }
    }
    if (process.env.AWS_BEDROCK_LLM_CONNECTION_METHOD === "sessionToken" && !process.env.AWS_BEDROCK_LLM_SESSION_TOKEN) {
      throw new Error("AWS_BEDROCK_LLM_SESSION_TOKEN is not set for sessionToken authentication method.");
    }

    // --- Model and Limits Setup ---
    this.model = modelPreference || process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE;
    // Get the total context window limit (used for input management)
    const contextWindowLimit = this.promptWindowLimit();
    // Define approximate limits for different parts of the prompt based on the context window
    this.limits = {
      history: Math.floor(contextWindowLimit * 0.15),
      system: Math.floor(contextWindowLimit * 0.15),
      user: Math.floor(contextWindowLimit * 0.70), // Allow user prompt + context to take the bulk
    };

    // --- AWS SDK Client Configuration ---
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

    // --- Other Initializations ---
    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7; // Default sampling temperature

    this.#log(`Initialized with model: ${this.model}. Auth: ${this.authMethod}. Context Window: ${contextWindowLimit}.`);
  }

  /**
   * Gets the configured AWS authentication method ('iam' or 'sessionToken').
   * Defaults to 'iam' if the environment variable is invalid.
   * @returns {"iam" | "sessionToken"} The authentication method.
   */
  get authMethod() {
    const method = process.env.AWS_BEDROCK_LLM_CONNECTION_METHOD || "iam";
    return ["iam", "sessionToken"].includes(method) ? method : "iam";
  }

  /**
   * Appends context texts to a string with standard formatting.
   * @param {string[]} [contextTexts=[]] - An array of context text snippets.
   * @returns {string} Formatted context string or empty string if no context provided.
   * @private
   */
  #appendContext(contextTexts = []) {
    if (!Array.isArray(contextTexts) || contextTexts.length === 0) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`)
        .join("")
    );
  }

  /**
   * Internal logging helper with provider prefix.
   * @param {string} text - The log message.
   * @param  {...any} args - Additional arguments to log.
   * @private
   */
   #log(text, ...args) {
    console.log(`\x1b[32m[AWSBedrock]\x1b[0m ${text}`, ...args);
  }

  /**
   * Indicates if the provider supports streaming responses.
   * @returns {boolean} True.
   */
  streamingEnabled() {
    return typeof this.streamGetChatCompletion === "function";
  }

  /**
   * Gets the total prompt window limit (total context window: input + output) from the environment variable.
   * This value is used for calculating input limits, NOT for setting the max output tokens in API calls.
   * @param {string} [_modelName] - The model name (parameter currently unused, reads directly from env var).
   * @returns {number} The total context window token limit.
   * @static
   * @throws {Error} If the AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT environment variable is invalid.
   */
  static promptWindowLimit(_modelName) {
    const limitSourceValue = process.env.AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT;
    // Log the value being read (can be commented out in production)
    // console.log(`[AWSBedrock DEBUG] Reading AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT for prompt window. Value found: ${limitSourceValue} (Type: ${typeof limitSourceValue})`);
    const limit = limitSourceValue || DEFAULT_CONTEXT_WINDOW_TOKENS; // Use default if not set

    const numericLimit = Number(limit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      console.error(`[AWSBedrock ERROR] Invalid AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT found: "${limitSourceValue}". Must be a positive number.`);
      throw new Error(`Invalid AWS_BEDROCK_LLM_MODEL_TOKEN_LIMIT set in environment: "${limitSourceValue}"`);
    }
    // Note: Does not use MODEL_MAP for Bedrock context window. Relies on the specific Bedrock env var.
    return numericLimit;
  }

  /**
   * Gets the total prompt window limit (total context window) for the current model instance.
   * @returns {number} The token limit.
   */
  promptWindowLimit() {
    // Delegates to the static method for consistency.
    return AWSBedrockLLM.promptWindowLimit(this.model);
  }

  /**
   * Gets the maximum number of tokens the model should generate in its response.
   * Reads from the AWS_BEDROCK_LLM_MAX_OUTPUT_TOKENS environment variable or uses a default.
   * This is distinct from the total context window limit.
   * @returns {number} The maximum output tokens limit for API calls.
   */
  getMaxOutputTokens() {
      const outputLimitSource = process.env.AWS_BEDROCK_LLM_MAX_OUTPUT_TOKENS;
      let outputLimit = DEFAULT_MAX_OUTPUT_TOKENS; // Start with the class default

      if (outputLimitSource) {
          const numericOutputLimit = Number(outputLimitSource);
          // Validate the environment variable value
          if (!isNaN(numericOutputLimit) && numericOutputLimit > 0) {
              outputLimit = numericOutputLimit;
          } else {
              this.#log(`Invalid AWS_BEDROCK_LLM_MAX_OUTPUT_TOKENS value "${outputLimitSource}". Using default ${DEFAULT_MAX_OUTPUT_TOKENS}.`);
          }
      }
      return outputLimit;
  }


  /**
   * Checks if the configured model is valid for chat completion (basic check for Bedrock).
   * @param {string} [_modelName] - Model name (unused).
   * @returns {Promise<boolean>} Always true, assuming any configured Bedrock model supports Converse API.
   */
  async isValidChatCompletionModel(_modelName = "") {
    // Assume valid for Bedrock Converse; more specific checks could be added if needed.
    return true;
  }

  /**
   * Generates the Bedrock Converse API content array for a message,
   * processing text and formatting valid image attachments.
   * @param {object} params
   * @param {string} [params.userPrompt=""] - The text part of the message.
   * @param {Array<{contentString: string, mime: string}>} [params.attachments=[]] - Array of attachments for the message.
   * @returns {Array<object>} Array of content blocks (e.g., [{text: "..."}, {image: {...}}]).
   * @private
   */
  #generateContent({ userPrompt = "", attachments = [] }) {
    const content = [];

    // Add text block if prompt is not empty
    if (userPrompt && typeof userPrompt === 'string' && userPrompt.trim().length > 0) {
        content.push({ text: userPrompt });
    }

    // Process valid attachments
    if (Array.isArray(attachments)) {
        for (const attachment of attachments) {
             if (!attachment || typeof attachment.mime !== 'string' || typeof attachment.contentString !== 'string') {
                this.#log("Skipping invalid attachment object.", attachment);
                continue;
            }

            // Strip data URI prefix (e.g., "data:image/png;base64,")
            let base64Data = attachment.contentString;
            const dataUriPrefixMatch = base64Data.match(/^data:image\/\w+;base64,/);
            if (dataUriPrefixMatch) {
                base64Data = base64Data.substring(dataUriPrefixMatch[0].length);
            }

            const format = getImageFormatFromMime(attachment.mime);
            if (format) {
                 const imageBytes = base64ToUint8Array(base64Data);
                 if (imageBytes) {
                     // Add the image block in the required Bedrock format
                     content.push({
                         image: {
                             format: format,
                             source: { bytes: imageBytes }
                         }
                     });
                 } else {
                      this.#log(`Skipping attachment with mime ${attachment.mime} due to base64 decoding error.`);
                 }
            } else {
                 this.#log(`Skipping attachment with unsupported/invalid MIME type: ${attachment.mime}`);
            }
        }
    }

    // Ensure content array is never empty (Bedrock requires at least one block)
    if (content.length === 0) {
        this.#log("Warning: #generateContent resulted in an empty content array. Adding empty text block as fallback.");
        content.push({ text: "" });
    }

    return content;
  }

  /**
   * Constructs the complete message array in the format expected by the Bedrock Converse API.
   * @param {object} params
   * @param {string} [params.systemPrompt=""] - The system prompt text.
   * @param {string[]} [params.contextTexts=[]] - Array of context text snippets.
   * @param {Array<{role: 'user' | 'assistant', content: string, attachments?: Array<{contentString: string, mime: string}>}>} [params.chatHistory=[]] - Previous messages.
   * @param {string} [params.userPrompt=""] - The latest user prompt text.
   * @param {Array<{contentString: string, mime: string}>} [params.attachments=[]] - Attachments for the latest user prompt.
   * @returns {Array<object>} The formatted message array for the API call.
   */
  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const systemMessageContent = `${systemPrompt}${this.#appendContext(contextTexts)}`;
    let messages = [];

    // Handle system prompt (either real or simulated)
    if (this.noSystemPromptModels.includes(this.model)) {
       if (systemMessageContent.trim().length > 0) {
           this.#log(`Model ${this.model} doesn't support system prompts; simulating.`);
           messages.push(
              { role: "user", content: this.#generateContent({ userPrompt: systemMessageContent }) }, // No attachments in simulated system prompt
              { role: "assistant", content: [{ text: "Okay." }] }
           );
       }
    } else if (systemMessageContent.trim().length > 0) {
        messages.push({
            role: "system",
            content: this.#generateContent({ userPrompt: systemMessageContent }) // No attachments in system prompt
        });
    }

    // Add chat history
    messages = messages.concat(
      chatHistory.map((msg) => ({
        role: msg.role,
        content: this.#generateContent({
          userPrompt: msg.content,
          attachments: Array.isArray(msg.attachments) ? msg.attachments : [],
        }),
      }))
    );

    // Add final user prompt
    messages.push({
        role: "user",
        content: this.#generateContent({
            userPrompt: userPrompt,
            attachments: Array.isArray(attachments) ? attachments : [],
        }),
    });

    return messages;
  }

  /**
   * Parses reasoning steps from the response and prepends them in <think> tags.
   * @param {object} message - The message object from the Bedrock response.
   * @returns {string} The text response, potentially with reasoning prepended.
   * @private
   */
   #parseReasoningFromResponse({ content = [] }) {
    if (!Array.isArray(content)) return "";
    const textBlock = content.find(block => block.text !== undefined);
    let textResponse = textBlock?.text || "";
    const reasoningBlock = content.find(block => block.reasoningContent?.reasoningText?.text);
    if (reasoningBlock) {
      const reasoningText = reasoningBlock.reasoningContent.reasoningText.text.trim();
      if (reasoningText.length > 0) {
        textResponse = `<think>${reasoningText}</think>${textResponse}`;
      }
    }
    return textResponse;
  }


  /**
   * Sends a request for chat completion (non-streaming).
   * @param {Array<object> | null} messages - Formatted message array from constructPrompt.
   * @param {object} options - Request options.
   * @param {number} [options.temperature] - Sampling temperature.
   * @returns {Promise<object | null>} Response object with textResponse and metrics, or null.
   * @throws {Error} If the API call fails or validation errors occur.
   */
  async getChatCompletion(messages = null, { temperature }) {
    if (!Array.isArray(messages) || messages.length === 0) {
       throw new Error("AWSBedrock::getChatCompletion requires a non-empty messages array.");
    }

    const hasSystem = messages[0]?.role === "system";
    const systemBlock = hasSystem ? messages[0].content : undefined;
    const history = hasSystem ? messages.slice(1) : messages;
    const maxTokensToSend = this.getMaxOutputTokens();

    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.bedrockClient
        .send(
          new ConverseCommand({
            modelId: this.model,
            messages: history,
            inferenceConfig: {
              maxTokens: maxTokensToSend,
              temperature: temperature ?? this.defaultTemp,
            },
            system: systemBlock,
          })
        )
        .catch((e) => {
          this.#log(`Bedrock Converse API Error (getChatCompletion): ${e.message}`, e);
           if (e.name === 'ValidationException' && e.message.includes('maximum tokens')) {
               throw new Error(`AWSBedrock::getChatCompletion failed. Model ${this.model} rejected maxTokens value of ${maxTokensToSend}. Check model documentation for its maximum output token limit and set AWS_BEDROCK_LLM_MAX_OUTPUT_TOKENS if needed. Original error: ${e.message}`);
           }
          throw new Error(`AWSBedrock::getChatCompletion failed. ${e.message}`);
        }),
      messages,
      false
    );

    const response = result.output;
    if (!response?.output?.message) {
       this.#log("Bedrock response missing expected output.message structure.", response);
       return null;
    }

    const latencyMs = response?.metrics?.latencyMs;
    const outputTokens = response?.usage?.outputTokens;
    const outputTps = (latencyMs > 0 && outputTokens) ? (outputTokens / (latencyMs / 1000)) : 0;

    return {
      textResponse: this.#parseReasoningFromResponse(response.output.message),
      metrics: {
        prompt_tokens: response?.usage?.inputTokens ?? 0,
        completion_tokens: outputTokens ?? 0,
        total_tokens: response?.usage?.totalTokens ?? 0,
        outputTps: outputTps,
        duration: result.duration,
      },
    };
  }

  /**
   * Sends a request for streaming chat completion.
   * @param {Array<object> | null} messages - Formatted message array from constructPrompt.
   * @param {object} options - Request options.
   * @param {number} [options.temperature] - Sampling temperature.
   * @returns {Promise<import('../../helpers/chat/LLMPerformanceMonitor').MonitoredStream>} The monitored stream object.
   * @throws {Error} If the API call setup fails or validation errors occur.
   */
  async streamGetChatCompletion(messages = null, { temperature }) {
     if (!Array.isArray(messages) || messages.length === 0) {
       throw new Error("AWSBedrock::streamGetChatCompletion requires a non-empty messages array.");
    }

    const hasSystem = messages[0]?.role === "system";
    const systemBlock = hasSystem ? messages[0].content : undefined;
    const history = hasSystem ? messages.slice(1) : messages;
    const maxTokensToSend = this.getMaxOutputTokens();

    try {
        // Attempt to initiate the stream
        const stream = await this.bedrockClient.send(
            new ConverseStreamCommand({
              modelId: this.model,
              messages: history,
              inferenceConfig: {
                  maxTokens: maxTokensToSend,
                  temperature: temperature ?? this.defaultTemp,
              },
              system: systemBlock,
            })
          );

        // If successful, wrap the stream with performance monitoring
        const measuredStreamRequest = await LLMPerformanceMonitor.measureStream(
            stream,
            messages,
            false // Indicate it's not a function call measurement
        );
        return measuredStreamRequest;

    } catch (e) {
        // Catch errors during the initial .send() call (e.g., validation errors)
        this.#log(`Bedrock Converse API Error (streamGetChatCompletion setup): ${e.message}`, e);
        if (e.name === 'ValidationException' && e.message.includes('maximum tokens')) {
            // Provide specific error context for max token issues
            throw new Error(`AWSBedrock::streamGetChatCompletion failed during setup. Model ${this.model} rejected maxTokens value of ${maxTokensToSend}. Check model documentation for its maximum output token limit and set AWS_BEDROCK_LLM_MAX_OUTPUT_TOKENS if needed. Original error: ${e.message}`);
        }
        // Re-throw other setup errors
        throw new Error(`AWSBedrock::streamGetChatCompletion failed during setup. ${e.message}`);
    }
  }

  /**
   * Handles the stream response from the AWS Bedrock API ConverseStreamCommand.
   * Parses chunks, handles reasoning tags, and estimates token usage if not provided.
   * @param {object} response - The HTTP response object to write chunks to.
   * @param {import('../../helpers/chat/LLMPerformanceMonitor').MonitoredStream} stream - The monitored stream object from streamGetChatCompletion.
   * @param {object} responseProps - Additional properties for the response chunks.
   * @param {string} [responseProps.uuid] - Unique ID for the response.
   * @param {Array} [responseProps.sources=[]] - Source documents used (if any).
   * @returns {Promise<string>} A promise that resolves with the complete text response when the stream ends.
   */
   handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    let hasUsageMetrics = false;
    let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    return new Promise(async (resolve) => {
      let fullText = "";
      let reasoningText = "";

      // Abort handler for client closing connection
      const handleAbort = () => {
        this.#log(`Client closed connection for stream ${uuid}. Aborting.`);
        stream?.endMeasurement(usage); // Finalize metrics
        clientAbortedHandler(resolve, fullText); // Resolve with partial text
      };
      response.on("close", handleAbort);

      try {
        // Process stream chunks
        for await (const chunk of stream.stream) {
          if (!chunk) { this.#log("Stream returned null/undefined chunk."); continue; }
          const action = Object.keys(chunk)[0];

          switch (action) {
            case "metadata": // Contains usage metrics at the end
              if (chunk.metadata?.usage) {
                 hasUsageMetrics = true;
                 usage = { // Overwrite with final metrics
                     prompt_tokens: chunk.metadata.usage.inputTokens ?? 0,
                     completion_tokens: chunk.metadata.usage.outputTokens ?? 0,
                     total_tokens: chunk.metadata.usage.totalTokens ?? 0,
                 };
              }
              break;
            case "contentBlockDelta": { // Contains text or reasoning deltas
              const delta = chunk.contentBlockDelta?.delta;
              if (!delta) break;
              const token = delta.text;
              const reasoningToken = delta.reasoningContent?.text;

              if (reasoningToken) { // Handle reasoning text
                if (reasoningText.length === 0) { // Start of reasoning block
                  const startTag = "<think>";
                  writeResponseChunk(response, { uuid, sources, type: "textResponseChunk", textResponse: startTag + reasoningToken, close: false, error: false });
                  reasoningText += startTag + reasoningToken;
                } else { // Continuation of reasoning block
                   writeResponseChunk(response, { uuid, sources, type: "textResponseChunk", textResponse: reasoningToken, close: false, error: false });
                   reasoningText += reasoningToken;
                }
              } else if (token) { // Handle regular text
                  if (reasoningText.length > 0) { // If reasoning was just output, close the tag
                      const endTag = "</think>";
                      writeResponseChunk(response, { uuid, sources, type: "textResponseChunk", textResponse: endTag, close: false, error: false });
                      fullText += reasoningText + endTag; // Add completed reasoning to final text
                      reasoningText = ""; // Reset reasoning buffer
                  }
                  fullText += token; // Append regular text
                  if (!hasUsageMetrics) usage.completion_tokens++; // Estimate usage if no metrics yet
                  writeResponseChunk(response, { uuid, sources, type: "textResponseChunk", textResponse: token, close: false, error: false });
              }
              break;
            }
            case "messageStop": // End of message event
              if (chunk.messageStop?.usage) { // Check for final metrics here too
                  hasUsageMetrics = true;
                  usage = { // Overwrite with final metrics if available
                    prompt_tokens: chunk.messageStop.usage.inputTokens ?? usage.prompt_tokens,
                    completion_tokens: chunk.messageStop.usage.outputTokens ?? usage.completion_tokens,
                    total_tokens: chunk.messageStop.usage.totalTokens ?? usage.total_tokens,
                  };
              }
              // Ensure reasoning tag is closed if message stops mid-reasoning
              if (reasoningText.length > 0) {
                  const endTag = "</think>";
                  writeResponseChunk(response, { uuid, sources, type: "textResponseChunk", textResponse: endTag, close: false, error: false });
                  fullText += reasoningText + endTag;
                  reasoningText = "";
              }
              break;
            // Ignore other event types for now
            case "messageStart": case "contentBlockStart": case "contentBlockStop": break;
            default: this.#log(`Unhandled stream action: ${action}`, chunk);
          }
        } // End for await loop

        // Final cleanup for reasoning tag in case stream ended abruptly
         if (reasoningText.length > 0 && !fullText.endsWith("</think>")) {
            const endTag = "</think>";
            if (!response.writableEnded) {
                writeResponseChunk(response, { uuid, sources, type: "textResponseChunk", textResponse: endTag, close: false, error: false });
            }
            fullText += reasoningText + endTag;
         }

        // Send final closing chunk to signal end of stream
        if (!response.writableEnded) {
            writeResponseChunk(response, { uuid, sources, type: "textResponseChunk", textResponse: "", close: true, error: false });
        }

      } catch (error) {
        // Handle errors during stream processing
        this.#log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${error.message}`, error);
        if (response && !response.writableEnded) {
           writeResponseChunk(response, { uuid, type: "abort", textResponse: null, sources, close: true, error: `AWSBedrock:streaming - error. ${error?.message ?? "Unknown error"}` });
        }
      } finally {
          // Cleanup: Always remove listener and finalize measurement
          response.removeListener("close", handleAbort);
          stream?.endMeasurement(usage); // Log final usage metrics
          resolve(fullText); // Resolve with the accumulated text
      }
    });
  }


  /**
   * Embeds a single text input using the configured embedder.
   * @param {string} textInput - The text to embed.
   * @returns {Promise<number[]>} The embedding vector.
   * @throws {Error} If the embedder is not configured or fails.
   */
  async embedTextInput(textInput) {
    if (!this.embedder?.embedTextInput) {
        throw new Error("Embedder is not configured or does not support embedTextInput.");
    }
    try {
        return await this.embedder.embedTextInput(textInput);
    } catch(e) {
        this.#log(`EmbedTextInput Error: ${e.message}`, e)
        throw e; // Re-throw after logging
    }
  }

  /**
   * Embeds multiple chunks of text using the configured embedder.
   * @param {string[]} [textChunks=[]] - An array of text chunks to embed.
   * @returns {Promise<number[][]>} An array of embedding vectors.
   * @throws {Error} If the embedder is not configured or fails.
   */
  async embedChunks(textChunks = []) {
     if (!this.embedder?.embedChunks) {
        throw new Error("Embedder is not configured or does not support embedChunks.");
     }
     try {
        return await this.embedder.embedChunks(textChunks);
     } catch(e) {
        this.#log(`EmbedChunks Error: ${e.message}`, e)
        throw e; // Re-throw after logging
     }
  }

  /**
   * Compresses chat messages if necessary using the messageArrayCompressor helper.
   * @param {object} [promptArgs={}] - Arguments to pass to constructPrompt.
   * @param {Array<object>} [rawHistory=[]] - The raw chat history.
   * @returns {Promise<object>} The potentially compressed message array and metadata.
   */
  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    if (!messageArrayCompressor) {
        throw new Error("Message compressor helper not found.");
    }
    // Construct the message array first
    const messageArray = this.constructPrompt(promptArgs);
    // Then pass it to the compressor
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  AWSBedrockLLM,
};
