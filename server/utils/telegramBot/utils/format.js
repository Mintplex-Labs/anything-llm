const FENCE_OPEN = /^[ \t]*(`{3,}|~{3,})(.*)$/;

/**
 * Replace each fenced code block that has a closing fence line with
 * `replace(code)`. A block opens on a ``` or ~~~ line (a backtick fence's info
 * string cannot contain a backtick) and closes on a line holding only a run of
 * the same character that is at least as long, as in CommonMark. So ~~~ fences
 * work, an info string such as `c++` stays out of the code, and a ```` fence
 * can show a ``` example. Unclosed fences are left for the caller.
 *
 * @param {string} text
 * @param {(code: string) => string} replace
 * @returns {string}
 */
function replaceFencedCodeBlocks(text, replace) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    // A CRLF line keeps its \r after the split; `.` does not match it.
    const open = lines[i].replace(/\r$/, "").match(FENCE_OPEN);
    if (open && !(open[1][0] === "`" && open[2].includes("`"))) {
      const fence = open[1];
      let close = -1;
      for (let j = i + 1; j < lines.length; j++) {
        const run = lines[j].trim();
        if (run.length >= fence.length && run === fence[0].repeat(run.length)) {
          close = j;
          break;
        }
      }
      if (close !== -1) {
        out.push(replace(lines.slice(i + 1, close).join("\n")));
        i = close + 1;
        continue;
      }
    }
    out.push(lines[i]);
    i++;
  }
  return out.join("\n");
}

/**
 * Convert standard markdown to Telegram HTML format.
 * Telegram HTML supports: <b>, <i>, <u>, <s>, <code>, <pre>, <a href="">, <tg-spoiler>
 *
 * @param {string} text - The markdown text to convert
 * @param {object} [opts]
 * @param {boolean} [opts.escapeHtml=true] - Whether to escape HTML in non-code text
 * @param {boolean} [opts.closeUnclosedTags=true] - Whether to close unclosed HTML tags
 * @returns {string} - HTML formatted text for Telegram
 */
function markdownToTelegram(
  text,
  { escapeHtml = true, closeUnclosedTags = true } = {}
) {
  if (!text) return "";

  let result = text;

  // Use null char placeholders that won't be affected by other transformations
  const codeBlocks = [];
  const inlineCode = [];
  const thinkBlocks = [];
  const links = [];

  // Handle <think> blocks - including partial tags from split messages
  // Process complete blocks first, then handle partials

  // First: complete <think>...</think> blocks
  result = result.replace(/<think>([\s\S]*?)<\/think>/g, (_, content) => {
    const placeholder = `\x00THINKBLOCK${thinkBlocks.length}\x00`;
    const trimmed = content.trim();
    const tag = trimmed.length > 200 ? "blockquote expandable" : "blockquote";
    thinkBlocks.push(
      `<${tag}>💭 <b>Thinking:</b>\n${escapeHTML(trimmed)}</blockquote>`
    );
    return placeholder;
  });

  // Second: unclosed <think> tag (split message part 1)
  if (result.includes("<think>")) {
    result = result.replace(/<think>([\s\S]*)$/, (_, content) => {
      const placeholder = `\x00THINKBLOCK${thinkBlocks.length}\x00`;
      const trimmed = content.trim();
      const tag = trimmed.length > 200 ? "blockquote expandable" : "blockquote";
      thinkBlocks.push(
        `<${tag}>💭 <b>Thinking:</b>\n${escapeHTML(trimmed)}</blockquote>`
      );
      return placeholder;
    });
  }

  // Third: closing </think> without open (split message part 2)
  if (result.includes("</think>")) {
    result = result.replace(/([\s\S]*?)<\/think>/g, (_, content) => {
      const placeholder = `\x00THINKBLOCK${thinkBlocks.length}\x00`;
      const trimmed = content.trim();
      const tag = trimmed.length > 200 ? "blockquote expandable" : "blockquote";
      thinkBlocks.push(
        `<${tag}>💭 <b>Thinking continued:</b>\n${escapeHTML(trimmed)}</blockquote>`
      );
      return placeholder;
    });
  }

  // Extract fenced code blocks: first every ``` / ~~~ block that has a closing
  // fence line, then one-line ```code``` and anything left unmatched.
  const saveCodeBlock = (code) => {
    const placeholder = `\x00CODEBLOCK${codeBlocks.length}\x00`;
    codeBlocks.push(`<pre>${escapeHTML(code.trimEnd())}</pre>`);
    return placeholder;
  };
  result = replaceFencedCodeBlocks(result, saveCodeBlock);
  result = result.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    saveCodeBlock(code)
  );

  // Extract and convert markdown tables to preformatted text
  result = result.replace(
    /(?:^|\n)((?:\|[^\n]+\|(?:\n|$))+)/g,
    (match, tableContent) => {
      const converted = convertTableToPreformatted(tableContent);
      const placeholder = `\x00CODEBLOCK${codeBlocks.length}\x00`;
      codeBlocks.push(`<pre>${escapeHTML(converted)}</pre>`);
      return `\n${placeholder}`;
    }
  );

  // Extract inline code (`...`)
  result = result.replace(/`([^`\n]+)`/g, (_, code) => {
    const placeholder = `\x00INLINECODE${inlineCode.length}\x00`;
    inlineCode.push(`<code>${escapeHTML(code)}</code>`);
    return placeholder;
  });

  // Escape HTML in remaining text
  if (escapeHtml) result = escapeHTML(result);

  // Convert links before emphasis so markdown characters in the URL (eg: `__init__`)
  // are left alone. The URL may contain balanced parentheses (eg: Wikipedia links).
  result = result.replace(
    /\[([^\]]+)\]\(((?:[^()]|\([^()]*\))+)\)/g,
    (_, label, url) => {
      const placeholder = `\x00LINK${links.length}\x00`;
      links.push(url);
      return `<a href="${placeholder}">${label}</a>`;
    }
  );

  // Convert markdown to HTML (order matters - do bold before italic)
  result = result.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  result = result.replace(/__(.+?)__/g, "<b>$1</b>");
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<i>$1</i>");
  result = result.replace(
    /(?<![a-zA-Z0-9])_([^_]+)_(?![a-zA-Z0-9])/g,
    "<i>$1</i>"
  );
  result = result.replace(/~~(.+?)~~/g, "<s>$1</s>");
  result = result.replace(/^&gt;\s*(.+)$/gm, "<i>$1</i>");
  result = result.replace(/^[-*_]{3,}$/gm, "————————————");
  result = result.replace(/^#{1,6}\s+(.+)$/gm, "<b>$1</b>");

  // Convert list items: - item or * item → • item
  result = result.replace(/^[-*]\s+/gm, "• ");

  // Restore preserved blocks
  thinkBlocks.forEach((block, i) => {
    result = result.replace(`\x00THINKBLOCK${i}\x00`, () => block);
  });
  codeBlocks.forEach((block, i) => {
    result = result.replace(`\x00CODEBLOCK${i}\x00`, () => block);
  });
  inlineCode.forEach((code, i) => {
    result = result.replace(`\x00INLINECODE${i}\x00`, () => code);
  });
  links.forEach((url, i) => {
    result = result.replace(`\x00LINK${i}\x00`, () => url);
  });

  // Close any unclosed HTML tags to prevent Telegram API errors during streaming
  // since if you try to update a message with an unclosed tag, the API will return an 400 error
  if (closeUnclosedTags) result = closeUnclosedHtmlTags(result);
  return result;
}

/**
 * Escape HTML special characters.
 * @param {string} text
 * @returns {string}
 */
function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Close any unclosed HTML tags to prevent Telegram API errors.
 * This is important during streaming when messages may be split mid-markdown.
 * @param {string} html - The HTML text to fix
 * @returns {string} - HTML with all tags properly closed
 */
function closeUnclosedHtmlTags(html) {
  const tags = ["b", "i", "u", "s", "code", "pre", "a", "blockquote"];
  const openTags = [];
  const tagRegex = /<\/?([a-z]+)(?:\s[^>]*)?\s*\/?>/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    const tagName = match[1].toLowerCase();

    if (!tags.includes(tagName)) continue;
    if (fullMatch.endsWith("/>")) continue;

    if (fullMatch.startsWith("</")) {
      const lastOpenIdx = openTags.lastIndexOf(tagName);
      if (lastOpenIdx !== -1) {
        openTags.splice(lastOpenIdx, 1);
      }
    } else {
      openTags.push(tagName);
    }
  }

  // Close any remaining open tags in reverse order
  let result = html;
  for (let i = openTags.length - 1; i >= 0; i--) {
    result += `</${openTags[i]}>`;
  }

  return result;
}

/**
 * Convert a markdown table to aligned preformatted text.
 * @param {string} tableMarkdown
 * @returns {string}
 */
function convertTableToPreformatted(tableMarkdown) {
  const lines = tableMarkdown.trim().split("\n");
  const rows = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const withoutPipes = trimmed.replace(/\|/g, "").trim();
    if (/^[\s\-:]+$/.test(withoutPipes) && withoutPipes.includes("-")) continue;

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length > 0) rows.push(cells);
  }

  if (rows.length === 0) return tableMarkdown;

  const colCount = Math.max(...rows.map((r) => r.length));
  const colWidths = Array(colCount).fill(0);

  for (const row of rows) {
    for (let i = 0; i < row.length; i++) {
      colWidths[i] = Math.max(colWidths[i], row[i].length);
    }
  }

  const output = [];
  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const paddedCells = row.map((cell, i) => cell.padEnd(colWidths[i]));
    output.push(paddedCells.join(" │ "));
    if (rowIdx === 0) {
      output.push(colWidths.map((w) => "─".repeat(w)).join("─┼─"));
    }
  }

  return output.join("\n");
}

module.exports = {
  escapeHTML,
  markdownToTelegram,
};
