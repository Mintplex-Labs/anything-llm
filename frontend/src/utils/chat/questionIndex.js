/**
 * Pure helpers behind the right-side question index for the current chat.
 *
 * The rail lists one entry per user question and highlights the question the
 * reader is currently on. Everything here is plain data in / data out so the
 * behaviour can be reasoned about (and asserted) without a DOM.
 *
 * Geometry below is measured from the reference UI at a 150% display scale
 * (device pixels / 1.5): one 30px row per question, 16px of panel padding and
 * nine rows visible before the panel starts to scroll.
 */
export const QUESTION_ROW_HEIGHT = 30;
export const QUESTION_PANEL_PADDING = 16;
export const QUESTION_PANEL_VISIBLE_ROWS = 9;
export const QUESTION_PANEL_MAX_LIST_HEIGHT =
  QUESTION_ROW_HEIGHT * QUESTION_PANEL_VISIBLE_ROWS;

// A question sitting within this many pixels of the bottom counts as "at the
// bottom" so the last question stays selected through sub-pixel scroll ends.
const BOTTOM_EPSILON = 4;
// The reading line: the question whose top is closest above this fraction of
// the viewport is the one being read. Keeping it above the vertical middle
// means a question becomes current as soon as its answer enters the view.
const READING_LINE_RATIO = 0.35;

/**
 * Master switch for the right-side question index.
 *
 * The index is part of the chat layout, so it is on by default. Nothing in the
 * settings UI turns it off: where such a preference belongs - appearance,
 * workspace settings, an environment flag - is a product decision, so this
 * function is the single seam to wire it to. Returning false removes the rail
 * and stops the index from observing the chat scroller; the transcript renders
 * exactly as it does today.
 * @returns {boolean} whether the question index is shown
 */
export function isQuestionIndexEnabled() {
  return true;
}

/**
 * Reduces a message body to a single-line label.
 * Markdown that would read as punctuation noise (code fences, heading/list
 * markers, emphasis) is dropped; whitespace collapses so multi-line questions
 * still produce one line, which the rail then truncates with CSS.
 * @param {string} content - the raw message content
 * @returns {string} the label, or an empty string when there is nothing to show
 */
export function questionLabel(content) {
  if (typeof content !== "string") return "";
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .split("\n")
    .map((line) => line.replace(/^\s{0,3}(?:#{1,6}|>|[-*+]|\d+\.)\s+/, ""))
    .join(" ")
    .replace(/[*_~]{1,3}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Collects one index entry per user question in the thread, in order.
 * Questions with nothing to display (attachment-only turns) are skipped, so
 * every entry is guaranteed to have a label.
 * @param {Array<Object>} history - the chat history as rendered
 * @returns {Array<{order: number, messageIndex: number, label: string}>}
 */
export function buildQuestionIndex(history = []) {
  const items = [];
  history.forEach((message, messageIndex) => {
    if (message?.role !== "user") return;
    const label = questionLabel(message.content);
    if (!label) return;
    items.push({ order: items.length, messageIndex, label });
  });
  return items;
}

/**
 * Picks the question the reader is currently on.
 * @param {number[]} offsets - each question's top, in scroll-container content
 *   coordinates, in question order
 * @param {Object} viewport
 * @param {number} viewport.scrollTop - current scroll offset
 * @param {number} viewport.viewportHeight - visible height of the container
 * @param {number} viewport.scrollHeight - full height of the container content
 * @returns {number} the index of the current question, or -1 when there are none
 */
export function resolveCurrentQuestion(
  offsets = [],
  { scrollTop = 0, viewportHeight = 0, scrollHeight = 0 } = {}
) {
  if (!offsets.length) return -1;
  // At the end of the thread the newest question is the one being read, even
  // when its top never crosses the reading line.
  if (scrollHeight - scrollTop - viewportHeight <= BOTTOM_EPSILON)
    return offsets.length - 1;

  const readingLine = scrollTop + viewportHeight * READING_LINE_RATIO;
  let current = 0;
  for (let index = 0; index < offsets.length; index++) {
    if (offsets[index] > readingLine) break;
    current = index;
  }
  return current;
}
