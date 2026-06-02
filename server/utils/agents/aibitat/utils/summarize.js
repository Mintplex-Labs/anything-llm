const pluralize = require("pluralize");
const { getLLMProvider } = require("../../../helpers");
const { TokenManager } = require("../../../helpers/tiktoken");

/**
 * Fraction of the model's context window used for each text chunk.
 * Sized so that the chunk + running key-points + prompt always fit in a
 * single request, preventing small/local models from looping forever.
 * @type {number}
 */
const CHUNK_CONTEXT_RATIO = 0.45;

/**
 * Fraction of the model's context window reserved for the running
 * key-points carried forward between chunks. Kept small so prior
 * summaries never crowd out the section being summarized.
 * @type {number}
 */
const RUNNING_SUMMARY_RATIO = 0.05;

/**
 * Number of sections to summarize before pausing to check in with the
 * user. Prevents long documents from tying up the chat with no way to
 * bail out.
 *
 * This number is zero-index based.
 * @type {number}
 */
const CHUNKS_BEFORE_APPROVAL = 3;

/**
 * @typedef {Object} LCSummarizationConfig
 * @property {string} provider The LLM to use for summarization (inherited)
 * @property {string} model The LLM Model to use for summarization (inherited)
 * @property {AbortController['signal']} controllerSignal Abort signal checked between sections to stop summarization early
 * @property {string} content The text content of the text to summarize
 * @property {import("../index")|null} [aibitat] The aibitat instance used to report progress and request approval to continue (optional)
 * @property {string|null} [skillName] The skill requesting summarization, used for the tool approval request (optional)
 */

/**
 * Split text into chunks no larger than `maxTokens` each, using the model
 * tokenizer so the chunk sizes are accurate against the context window.
 * @param {string} content
 * @param {TokenManager} tokenManager
 * @param {number} maxTokens
 * @returns {string[]}
 */
function chunkByTokens(content, tokenManager, maxTokens) {
  const tokens = tokenManager.tokensFromString(content);
  const chunks = [];
  for (let i = 0; i < tokens.length; i += maxTokens)
    chunks.push(tokenManager.bytesFromTokens(tokens.slice(i, i + maxTokens)));
  return chunks;
}

/**
 * Keep only the most recent `maxTokens` tokens of text, truncating from the
 * start. Used to cap the running key points so the latest section's details are
 * always preserved even when we split in the middle of a piece of content.
 * @param {string} text
 * @param {TokenManager} tokenManager
 * @param {number} maxTokens
 * @returns {string}
 */
function truncateToTokenLimit(text, tokenManager, maxTokens) {
  const tokens = tokenManager.tokensFromString(text);
  if (tokens.length <= maxTokens) return text;
  return tokenManager.bytesFromTokens(tokens.slice(tokens.length - maxTokens));
}

/**
 * Count the key points/concepts captured so far (non-empty lines).
 * @param {string} text - The text to count the key points of
 * @returns {number} The number of key points/concepts captured
 */
function countKeyPoints(text) {
  return text.split("\n").filter((line) => line.trim().length > 0).length;
}

/**
 * Generate the prompt for summarizing a section of text.
 * @param {string} section - The section of text to summarize
 * @param {string} priorPoints - Key points from earlier sections for context only
 * @returns {string}
 */
function summaryPrompt(section, priorPoints) {
  let prompt =
    "You are extracting the key points from a long document that was split into sections. Read the section below and list its key points, facts, and concepts as concise bullet points. Output ONLY the bullet points for THIS section - do not repeat earlier points and do not add commentary.";
  if (priorPoints)
    prompt += `Key points from earlier sections (for context only, do not repeat):\n${priorPoints}\n`;
  prompt += `\nSection: \n${section}\n`;
  return prompt;
}

/**
 * Summarize content by walking the text one chunk at a time and accumulating
 * the key points. This replaces the LangChain map_reduce chain which would lock
 * up on small context windows. After the first few sections the user is asked
 * whether to continue so a very long document never silently hangs the chat.
 * @param {LCSummarizationConfig} config
 * @returns {Promise<string>} The accumulated key points.
 */
async function summarizeContent({
  provider = "openai",
  model = null,
  controllerSignal,
  content,
  aibitat = null,
}) {
  const introspect = (message) => aibitat?.introspect?.(message);

  const llm = getLLMProvider({ provider, model });
  const tokenManager = new TokenManager(model);
  const contextWindow = llm.promptWindowLimit();
  const chunkTokenLimit = Math.floor(contextWindow * CHUNK_CONTEXT_RATIO);
  const priorPointsTokenLimit = Math.floor(
    contextWindow * RUNNING_SUMMARY_RATIO
  );

  const chunks = chunkByTokens(content, tokenManager, chunkTokenLimit);
  introspect(`Content split into ${chunks.length} section(s) to summarize.`);

  let keyPoints = "";
  for (let i = 0; i < chunks.length; i++) {
    if (controllerSignal?.aborted) break;

    // After the first few sections, check in with the user before continuing
    // through the rest of the document. Approving here continues to the end
    // without asking again.
    if (i === CHUNKS_BEFORE_APPROVAL && aibitat?.requestToolApproval) {
      const remaining = chunks.length - i;
      const approval = await aibitat.requestToolApproval({
        skillName: "content-summarization",
        description: `There ${pluralize("is", remaining)} ${pluralize(
          "section",
          remaining,
          true
        )} of content left to summarize. Continue?`,
      });
      if (!approval.approved) {
        introspect(`User stopped continuing with summarization.`);
        break;
      }
    }

    introspect(
      `Summarizing section ${i + 1} of ${chunks.length} (~${tokenManager.countFromString(chunks[i])} tokens)...`
    );
    const priorPoints = truncateToTokenLimit(
      keyPoints,
      tokenManager,
      priorPointsTokenLimit
    );
    const { textResponse } = await llm.getChatCompletion(
      [{ role: "user", content: summaryPrompt(chunks[i], priorPoints) }],
      { temperature: 0 }
    );

    const sectionPoints = (textResponse || "").trim();
    keyPoints = keyPoints ? `${keyPoints}\n${sectionPoints}` : sectionPoints;
    introspect(`Captured ${countKeyPoints(keyPoints)} key points so far.`);
  }

  return keyPoints;
}

module.exports = { summarizeContent };
