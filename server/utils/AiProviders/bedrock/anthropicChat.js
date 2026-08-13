const { v4 } = require("uuid");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");

/**
 * Converts OpenAI-format chat messages to Anthropic Messages API format.
 * Extracts system messages into a single string and converts image_url
 * content blocks to Anthropic's base64 image source format.
 */
function toAnthropicFormat(messages) {
  let system = "";
  const anthropicMessages = [];
  for (const msg of messages) {
    if (msg.role === "system") {
      const text =
        typeof msg.content === "string"
          ? msg.content
          : msg.content.map((c) => c.text || "").join("\n");
      system += (system ? "\n" : "") + text;
    } else {
      let content = msg.content;
      if (Array.isArray(content)) {
        content = content.map((block) => {
          if (block.type === "image_url" && block.image_url?.url) {
            const match = block.image_url.url.match(
              /^data:(.+?);base64,(.+)$/s
            );
            if (match) {
              return {
                type: "image",
                source: {
                  type: "base64",
                  media_type: match[1],
                  data: match[2],
                },
              };
            }
          }
          return block;
        });
      }
      anthropicMessages.push({ role: msg.role, content });
    }
  }
  return { system, messages: anthropicMessages };
}

/**
 * Builds request parameters for the Anthropic Messages API.
 * @param {object} opts
 * @param {string} opts.model - Model identifier
 * @param {number} opts.maxTokens - Max output tokens
 * @param {Array} opts.messages - OpenAI-format messages (will be converted)
 * @param {number|undefined} opts.temperature - Temperature value (already processed)
 * @returns {object} Anthropic Messages API params
 */
function buildAnthropicParams({ model, maxTokens, messages, temperature }) {
  const { system, messages: anthropicMessages } = toAnthropicFormat(messages);
  const params = {
    model,
    max_tokens: maxTokens,
    messages: anthropicMessages,
  };
  if (system) params.system = system;
  if (temperature !== undefined) params.temperature = temperature;
  return params;
}

/**
 * Handles an Anthropic EventEmitter-based stream, writing response chunks
 * to the HTTP response. Used by the chat provider's streaming path.
 */
function handleAnthropicChatStream(response, stream, responseProps) {
  return new Promise((resolve) => {
    let fullText = "";
    const { uuid = v4(), sources = [] } = responseProps;
    let usage = { prompt_tokens: 0, completion_tokens: 0 };

    const handleAbort = () => {
      stream?.endMeasurement(usage);
      clientAbortedHandler(resolve, fullText);
    };
    response.on("close", handleAbort);

    stream.on("error", (event) => {
      const error = event?.error?.error;
      const errorMsg = error
        ? `Bedrock/Anthropic Error: ${error?.type || "unknown"} ${error?.message || "unknown error."}`
        : event.message;

      writeResponseChunk(response, {
        uuid,
        sources: [],
        type: "abort",
        textResponse: null,
        close: true,
        error: errorMsg,
      });
      response.removeListener("close", handleAbort);
      stream?.endMeasurement(usage);
      resolve(fullText);
    });

    stream.on("streamEvent", (data) => {
      if (data.type === "message_start")
        usage.prompt_tokens = data?.message?.usage?.input_tokens;
      if (data.type === "message_delta")
        usage.completion_tokens = data?.usage?.output_tokens;

      if (
        data.type === "content_block_delta" &&
        data.delta.type === "text_delta"
      ) {
        const text = data.delta.text;
        fullText += text;
        writeResponseChunk(response, {
          uuid,
          sources,
          type: "textResponseChunk",
          textResponse: text,
          close: false,
          error: false,
        });
      }

      if (
        data.type === "message_stop" ||
        (data.stop_reason && data.stop_reason === "end_turn")
      ) {
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
      }
    });
  });
}

module.exports = {
  toAnthropicFormat,
  buildAnthropicParams,
  handleAnthropicChatStream,
};
