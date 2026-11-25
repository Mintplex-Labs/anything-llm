const { v4 } = require("uuid");
const { isAbortError } = require("../../helpers/abortSignals");
const {
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");

/**
 * Converts OpenAI Chat Completions messages to Responses API input. String
 * content passes through; content arrays map `text` blocks to input_text
 * (output_text for assistant turns) and `image_url` blocks to input_image.
 * @param {Array} messages - Chat Completions format messages
 * @returns {Array} Responses API input
 */
function toResponsesInput(messages = []) {
  return messages.map((msg) => {
    if (!Array.isArray(msg.content)) return msg;
    const textType = msg.role === "assistant" ? "output_text" : "input_text";
    const content = msg.content.map((block) => {
      if (block.type === "text") return { type: textType, text: block.text };
      if (block.type === "image_url")
        return { type: "input_image", image_url: block.image_url?.url };
      return block;
    });
    return { role: msg.role, content };
  });
}

/**
 * Builds request parameters for the Responses API. Temperature is never sent
 * since Bedrock's OpenAI GPT models reject it on this API.
 * @param {object} opts
 * @param {string} opts.model - Model identifier
 * @param {Array} opts.messages - Chat Completions format messages (will be converted)
 * @returns {object} Responses API params
 */
function buildResponsesParams({ model, messages }) {
  return { model, input: toResponsesInput(messages), store: false };
}

/**
 * Handles a Responses API event stream, writing response chunks to the HTTP
 * response. Used by the chat provider's streaming path.
 */
function handleResponsesChatStream(response, stream, responseProps) {
  const { uuid = v4(), sources = [] } = responseProps;
  let usage = { completion_tokens: 0 };
  let hasUsageMetrics = false;

  return new Promise(async (resolve) => {
    let fullText = "";

    const handleAbort = () => {
      stream?.endMeasurement(usage);
      clientAbortedHandler(resolve, fullText);
    };
    response.on("close", handleAbort);

    const finish = (error = null) => {
      writeResponseChunk(response, {
        uuid,
        sources: error ? [] : sources,
        type: error ? "abort" : "textResponseChunk",
        textResponse: error ? null : "",
        close: true,
        error: error ?? false,
      });
      response.removeListener("close", handleAbort);
      stream?.endMeasurement(usage);
      resolve(fullText);
    };

    try {
      for await (const chunk of stream) {
        if (chunk.type === "response.output_text.delta" && chunk.delta) {
          fullText += chunk.delta;
          if (!hasUsageMetrics) usage.completion_tokens++;
          writeResponseChunk(response, {
            uuid,
            sources: [],
            type: "textResponseChunk",
            textResponse: chunk.delta,
            close: false,
            error: false,
          });
          continue;
        }

        if (chunk.type === "response.completed") {
          const res = chunk.response;
          if (res?.usage) {
            hasUsageMetrics = true;
            usage = {
              prompt_tokens: res.usage.input_tokens || 0,
              completion_tokens: res.usage.output_tokens || 0,
              total_tokens: res.usage.total_tokens || 0,
            };
          }
          return finish();
        }

        if (chunk.type === "response.failed" || chunk.type === "error") {
          const message =
            chunk.response?.error?.message || chunk.message || "Unknown error.";
          return finish(`Bedrock/OpenAI Error: ${message}`);
        }
      }
      // The stream ended without a terminal event - close out what we have.
      finish();
    } catch (e) {
      // Cancelling the upstream request rejects the iterator - that is the
      // client leaving, not a failure, so it is not reported as an error.
      if (isAbortError(e)) {
        stream?.endMeasurement(usage);
        return clientAbortedHandler(resolve, fullText);
      }
      console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
      finish(e.message);
    }
  });
}

module.exports = {
  toResponsesInput,
  buildResponsesParams,
  handleResponsesChatStream,
};
