import katex from "katex";
import "katex/dist/katex.min.css";

// Validate whether a $ at `pos` can open/close inline math.
// This preserves common markdown behavior and avoids parsing currency badly.
function isValidDollarDelim(state, pos) {
  const max = state.posMax;
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
  const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;

  let canOpen = true;
  let canClose = true;

  // Same basic heuristics as many markdown-it math plugins:
  // - "$ " should not open
  // - " $" should not close
  // - "$5" should usually not be treated as opening math
  if (
    prevChar === 0x20 || // space
    prevChar === 0x09 || // tab
    (nextChar >= 0x30 && nextChar <= 0x39) // digit
  ) {
    canClose = false;
  }

  if (
    nextChar === 0x20 || // space
    nextChar === 0x09 // tab
  ) {
    canOpen = false;
  }

  return { canOpen, canClose };
}

function findClosingDollar(src, start) {
  let match = start;

  while ((match = src.indexOf("$", match)) !== -1) {
    let pos = match - 1;
    while (pos >= 0 && src[pos] === "\\") pos--;

    // odd number of backslashes before $ => unescaped delimiter
    if ((match - pos) % 2 === 1) {
      return match;
    }

    match += 1;
  }

  return -1;
}

function findClosingParen(src, start) {
  let match = start;

  while ((match = src.indexOf("\\)", match)) !== -1) {
    let pos = match - 1;
    while (pos >= 0 && src[pos] === "\\") pos--;

    // odd number of backslashes before the "\" in "\)" => real closing delimiter
    if ((match - pos) % 2 === 1) {
      return match;
    }

    match += 2;
  }

  return -1;
}

function math_inline(state, silent) {
  const src = state.src;
  const pos = state.pos;

  // Case 1: \( ... \)
  if (src[pos] === "\\" && src[pos + 1] === "(") {
    const start = pos + 2;
    const match = findClosingParen(src, start);

    if (match === -1) {
      return false; // let markdown handle it normally
    }

    if (!silent) {
      const token = state.push("math_inline", "math", 0);
      token.markup = "\\(";
      token.content = src.slice(start, match);
    }

    state.pos = match + 2;
    return true;
  }

  // Case 2: $ ... $
  if (src[pos] !== "$") {
    return false;
  }

  const open = isValidDollarDelim(state, pos);
  if (!open.canOpen) {
    return false;
  }

  // Don't treat $$ as inline math here; leave it for block parsing.
  if (src[pos + 1] === "$") {
    return false;
  }

  const start = pos + 1;
  const match = findClosingDollar(src, start);

  if (match === -1) {
    return false; // let literal $ pass through as markdown text
  }

  if (match === start) {
    return false; // empty content: "$$" or "$$..." edge case, not inline math
  }

  const close = isValidDollarDelim(state, match);
  if (!close.canClose) {
    return false;
  }

  if (!silent) {
    const token = state.push("math_inline", "math", 0);
    token.markup = "$";
    token.content = src.slice(start, match);
  }

  state.pos = match + 1;
  return true;
}

function math_block(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];

  if (pos + 1 >= max) return false;

  const firstTwo = state.src.slice(pos, pos + 2);

  let openDelim = null;
  let closeDelim = null;

  if (firstTwo === "$$") {
    openDelim = "$$";
    closeDelim = "$$";
  } else if (firstTwo === "\\[") {
    openDelim = "\\[";
    closeDelim = "\\]";
  } else {
    return false;
  }

  if (silent) return true;

  let firstLine = state.src.slice(pos + 2, max);
  let nextLine = startLine;
  let found = false;
  let lastLine = "";

  // Single-line block
  const trimmedFirst = firstLine.trim();
  if (trimmedFirst.endsWith(closeDelim)) {
    firstLine = trimmedFirst.slice(0, -closeDelim.length);
    found = true;
  }

  while (!found) {
    nextLine++;
    if (nextLine >= endLine) break;

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    // stop on negative indentation like markdown-it block rules typically do
    if (pos < max && state.tShift[nextLine] < state.blkIndent) {
      break;
    }

    const lineText = state.src.slice(pos, max);
    const trimmed = lineText.trim();

    if (trimmed.endsWith(closeDelim)) {
      const endIndex = lineText.lastIndexOf(closeDelim);
      lastLine = lineText.slice(0, endIndex);
      found = true;
    }
  }

  if (!found) {
    return false;
  }

  state.line = nextLine + 1;

  const token = state.push("math_block", "math", 0);
  token.block = true;
  token.markup = openDelim;
  token.map = [startLine, state.line];
  token.content =
    (firstLine ? firstLine : "") +
    (nextLine > startLine ? "\n" : "") +
    state.getLines(startLine + 1, nextLine, state.tShift[startLine], true) +
    (lastLine ? lastLine : "");

  return true;
}

export default function math_plugin(md, options = {}) {
  function renderMath(latex, displayMode) {
    try {
      return katex.renderToString(latex, {
        ...options,
        displayMode,
      });
    } catch (error) {
      if (options.throwOnError) {
        console.error(error);
      }

      // Escape minimally so raw latex shows safely if rendering fails
      const escaped = md.utils.escapeHtml(latex);
      return displayMode
        ? `<pre class="katex-error">${escaped}</pre>`
        : `<code class="katex-error">${escaped}</code>`;
    }
  }

  md.inline.ruler.before("escape", "math_inline", math_inline);

  md.block.ruler.after("blockquote", "math_block", math_block, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });

  md.renderer.rules.math_inline = function (tokens, idx) {
    return renderMath(tokens[idx].content, false);
  };

  md.renderer.rules.math_block = function (tokens, idx) {
    return renderMath(tokens[idx].content, true) + "\n";
  };
}
