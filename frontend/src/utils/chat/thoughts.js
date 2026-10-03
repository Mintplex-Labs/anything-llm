/**
 * Canonical utilities for the "thinking trace" segments AnythingLLM embeds
 * in assistant message text.
 *
 * The chat pipeline wraps a model's internal reasoning inside the visible
 * message text using a loose family of tags - `<think>`, `<thinking>`,
 * `<thought>` or `<thought_chain>` (the DeepSeek-style `<think>` being the
 * most common). Those segments are transport, not content: every surface
 * that renders an assistant message has to lift them out of the text first,
 * because the reasoning belongs in the stylized thought-chain dropdown -
 * never in the message body.
 *
 * Historically each renderer reimplemented that split on its own and the
 * copies drifted apart: some recognized only `<think>`, some removed only
 * the first segment, and some (the AnythingLLM Desktop Assistant) forgot
 * the split entirely - which rendered the thinking trace twice, once in the
 * chain dropdown and once as raw text at the start of the message. These
 * helpers are the frontend's single source of truth: the regexes match the
 * full tag family case-insensitively (mirroring the server's
 * `stripThinkingFromText` in `server/utils/helpers/index.js`) and every
 * helper removes *all* segments, including a trailing unterminated block
 * that is still mid-stream.
 *
 * Re-exported by
 * `@/components/WorkspaceChat/ChatContainer/ChatHistory/ThoughtContainer`
 * for the components that imported them there historically.
 */

const THOUGHT_KEYWORDS = ["thought", "thinking", "think", "thought_chain"];
const CLOSING_TAGS = [...THOUGHT_KEYWORDS, "response", "answer"];

export const THOUGHT_REGEX_OPEN = new RegExp(
  THOUGHT_KEYWORDS.map((keyword) => `<${keyword}\\s*(?:[^>]*?)?\\s*>`).join(
    "|"
  ),
  "gi"
);
export const THOUGHT_REGEX_CLOSE = new RegExp(
  CLOSING_TAGS.map((keyword) => `</${keyword}\\s*(?:[^>]*?)?>`).join("|"),
  "gi"
);
export const THOUGHT_REGEX_COMPLETE = new RegExp(
  THOUGHT_KEYWORDS.map(
    (keyword) =>
      `<${keyword}\\s*(?:[^>]*?)?\\s*>[\\s\\S]*?<\\/${keyword}\\s*(?:[^>]*?)?>`
  ).join("|"),
  "gi"
);

// Cheap pre-test so hot paths (rendering every message) can skip the full
// scans when the text cannot contain a thought tag at all.
const THOUGHT_TAG_HINT = /<\/?(?:thought|thinking|think|thought_chain)/i;

/**
 * Removes the wrapping think tags from a thought segment, leaving only the
 * reasoning text itself. Global, so joined multi-segment content is cleaned
 * in one pass.
 * @param {string} content
 * @returns {string}
 */
export function stripThoughtTags(content = "") {
  return content
    .replace(THOUGHT_REGEX_OPEN, "")
    .replace(THOUGHT_REGEX_CLOSE, "");
}

/**
 * Splits a message into its thought segments and the visible remainder.
 *
 * All complete segments are captured - not just the first - and a trailing
 * open tag without a closing partner is a thought still streaming in, so
 * everything from that tag onward belongs to the thought chain as well.
 *
 * @param {string} content - raw message text
 * @returns {{thoughts: string[], remainder: string}} segments (tags still
 * wrapped, as the chain renderer strips them itself) and the text that
 * should render as the message body.
 */
export function splitThoughtContent(content = "") {
  if (typeof content !== "string" || content.length === 0)
    return { thoughts: [], remainder: "" };

  if (!THOUGHT_TAG_HINT.test(content))
    return { thoughts: [], remainder: content };

  const thoughts = content.match(THOUGHT_REGEX_COMPLETE) ?? [];
  let remainder = content.replace(THOUGHT_REGEX_COMPLETE, "");

  // An open tag left after the complete blocks were lifted out is a thought
  // still streaming in - but only when no closing partner follows it. A
  // stray mismatched pair is model glitch text and passes through raw,
  // exactly as it did before.
  const openStart = remainder.search(THOUGHT_REGEX_OPEN);
  if (openStart !== -1) {
    const tail = remainder.slice(openStart);
    if (tail.match(THOUGHT_REGEX_CLOSE) == null) {
      thoughts.push(tail);
      remainder = remainder.slice(0, openStart);
    }
  }
  return { thoughts, remainder };
}

/**
 * Removes every thought segment (complete blocks, plus a trailing
 * unterminated one) from a message, leaving only the text that should be
 * rendered, copied, or otherwise consumed as the actual response.
 * @param {string} content
 * @returns {string}
 */
export function stripThoughtSegments(content = "") {
  return splitThoughtContent(content).remainder;
}
