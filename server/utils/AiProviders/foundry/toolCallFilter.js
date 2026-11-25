/**
 * Strips `<tool_call>…</tool_call>` markup out of streamed assistant text.
 *
 * Foundry Local emits a tool call *twice*: once properly, as OpenAI
 * `delta.tool_calls`, and again as raw markup inside `delta.content`:
 *
 *   <tool_call>
 *   {"name": "web-scraping", "arguments": {"url": "https://anythingllm.com"}}
 *   </tool_call>
 *
 * The native copy is what actually invokes the tool, so the text copy is pure
 * noise — but it reaches the chat window verbatim. Filtering has to survive the
 * tags being split across chunks (`<tool` / `_call>`), so this holds back any
 * trailing text that could still turn out to be the start of an opening tag.
 */
class ToolCallTextFilter {
  static OPEN = "<tool_call>";
  static CLOSE = "</tool_call>";

  constructor() {
    /** Text withheld pending a decision — a partial tag, or a suppressed block. */
    this.buffer = "";
    /** True once an opening tag is seen, until its closing tag arrives. */
    this.suppressing = false;
  }

  /**
   * How many characters at the end of `text` could be the beginning of `tag`.
   * `"hello <tool"` against `"<tool_call>"` returns 5, so those are held back
   * rather than emitted and then regretted.
   * @param {string} text
   * @param {string} tag
   * @returns {number}
   */
  static #partialTagLength(text, tag) {
    const max = Math.min(text.length, tag.length - 1);
    for (let length = max; length > 0; length--) {
      if (tag.startsWith(text.slice(text.length - length))) return length;
    }
    return 0;
  }

  /**
   * Feed the next chunk of assistant text.
   * @param {string} text
   * @returns {string} The portion safe to show the user, possibly empty.
   */
  push(text = "") {
    this.buffer += text;
    let emitted = "";

    // Each pass consumes one tag; loop because a chunk may contain several.
    for (;;) {
      if (this.suppressing) {
        const close = this.buffer.indexOf(ToolCallTextFilter.CLOSE);
        // Still inside a tool call — keep swallowing until the tag closes.
        if (close === -1) return emitted;
        this.buffer = this.buffer.slice(
          close + ToolCallTextFilter.CLOSE.length
        );
        this.suppressing = false;
        continue;
      }

      const open = this.buffer.indexOf(ToolCallTextFilter.OPEN);
      if (open !== -1) {
        emitted += this.buffer.slice(0, open);
        this.buffer = this.buffer.slice(open + ToolCallTextFilter.OPEN.length);
        this.suppressing = true;
        continue;
      }

      const held = ToolCallTextFilter.#partialTagLength(
        this.buffer,
        ToolCallTextFilter.OPEN
      );
      emitted += this.buffer.slice(0, this.buffer.length - held);
      this.buffer = this.buffer.slice(this.buffer.length - held);
      return emitted;
    }
  }

  /**
   * Release anything still held once the stream ends. Text withheld as a
   * possible partial tag turned out to be ordinary text; an unterminated tool
   * call stays suppressed.
   * @returns {string}
   */
  flush() {
    const remainder = this.suppressing ? "" : this.buffer;
    this.buffer = "";
    return remainder;
  }

  /**
   * Remove tool-call markup from a complete (non-streamed) string.
   * @param {string} text
   * @returns {string}
   */
  static clean(text = "") {
    if (!text.includes(ToolCallTextFilter.OPEN)) return text;
    const filter = new ToolCallTextFilter();
    return `${filter.push(text)}${filter.flush()}`;
  }
}

module.exports = ToolCallTextFilter;
