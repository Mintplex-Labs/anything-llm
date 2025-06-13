import katex from "katex";

// Test if potential opening or closing delimieter
// Assumes that there is a "$" at state.src[pos]
function isValidDelim(state, pos) {
  var prevChar,
    nextChar,
    max = state.posMax,
    can_open = true,
    can_close = true;

  prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
  nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;

  // Only apply whitespace rules if we're dealing with $ delimiter
  if (state.src[pos] === "$") {
    if (
      prevChar === 0x20 /* " " */ ||
      prevChar === 0x09 /* \t */ ||
      (nextChar >= 0x30 /* "0" */ && nextChar <= 0x39) /* "9" */
    ) {
      can_close = false;
    }
    if (nextChar === 0x20 /* " " */ || nextChar === 0x09 /* \t */) {
      can_open = false;
    }
  }

  return {
    can_open: can_open,
    can_close: can_close,
  };
}

function math_inline(state, silent) {
  var start, match, token, res, pos, esc_count;

  // Only process $ and \( delimiters for inline math
  if (
    state.src[state.pos] !== "$" &&
    (state.src[state.pos] !== "\\" || state.src[state.pos + 1] !== "(")
  ) {
    return false;
  }

  // Handle \( ... \) case separately
  if (state.src[state.pos] === "\\" && state.src[state.pos + 1] === "(") {
    start = state.pos + 2;
    match = start;
    while ((match = state.src.indexOf("\\)", match)) !== -1) {
      pos = match - 1;
      while (state.src[pos] === "\\") {
        pos -= 1;
      }
      if ((match - pos) % 2 == 1) {
        break;
      }
      match += 1;
    }

    if (match === -1) {
      if (!silent) {
        state.pending += "\\(";
      }
      state.pos = start;
      return true;
    }

    if (!silent) {
      token = state.push("math_inline", "math", 0);
      token.markup = "\\(";
      token.content = state.src.slice(start, match);
    }

    state.pos = match + 2;
    return true;
  }

  res = isValidDelim(state, state.pos);
  if (!res.can_open) {
    if (!silent) {
      state.pending += "$";
    }
    state.pos += 1;
    return true;
  }

  // First check for and bypass all properly escaped delimieters
  // This loop will assume that the first leading backtick can not
  // be the first character in state.src, which is known since
  // we have found an opening delimieter already.
  start = state.pos + 1;
  match = start;
  while ((match = state.src.indexOf("$", match)) !== -1) {
    // Found potential $, look for escapes, pos will point to
    // first non escape when complete
    pos = match - 1;
    while (state.src[pos] === "\\") {
      pos -= 1;
    }

    // Even number of escapes, potential closing delimiter found
    if ((match - pos) % 2 == 1) {
      break;
    }
    match += 1;
  }

  // No closing delimiter found.  Consume $ and continue.
  if (match === -1) {
    if (!silent) {
      state.pending += "$";
    }
    state.pos = start;
    return true;
  }

  // Check if we have empty content, ie: $$.  Do not parse.
  if (match - start === 0) {
    if (!silent) {
      state.pending += "$$";
    }
    state.pos = start + 1;
    return true;
  }

  // Check for valid closing delimiter
  res = isValidDelim(state, match);
  if (!res.can_close) {
    if (!silent) {
      state.pending += "$";
    }
    state.pos = start;
    return true;
  }

  if (!silent) {
    token = state.push("math_inline", "math", 0);
    token.markup = "$";
    token.content = state.src.slice(start, match);
  }

  state.pos = match + 1;
  return true;
}

function math_block(state, start, end, silent) {
  var firstLine,
    lastLine,
    next,
    lastPos,
    found = false,
    token,
    pos = state.bMarks[start] + state.tShift[start],
    max = state.eMarks[start];

  // Check for $$, \[, or standalone [ as opening delimiters
  if (pos + 1 > max) {
    return false;
  }

  let openDelim = state.src.slice(pos, pos + 2);
  let isDoubleDollar = openDelim === "$$";
  let isLatexBracket = openDelim === "\\[";

  if (!isDoubleDollar && !isLatexBracket) {
    return false;
  }

  // Determine the closing delimiter and position adjustment
  let delimiter, posAdjust;
  if (isDoubleDollar) {
    delimiter = "$$";
    posAdjust = 2;
  } else if (isLatexBracket) {
    delimiter = "\\]";
    posAdjust = 2;
  }

  pos += posAdjust;
  firstLine = state.src.slice(pos, max);

  if (silent) {
    return true;
  }
  if (firstLine.trim().slice(-delimiter.length) === delimiter) {
    // Single line expression
    firstLine = firstLine.trim().slice(0, -delimiter.length);
    found = true;
  }

  for (next = start; !found; ) {
    next++;

    if (next >= end) {
      break;
    }

    pos = state.bMarks[next] + state.tShift[next];
    max = state.eMarks[next];

    if (pos < max && state.tShift[next] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      break;
    }

    if (
      state.src.slice(pos, max).trim().slice(-delimiter.length) === delimiter
    ) {
      lastPos = state.src.slice(0, max).lastIndexOf(delimiter);
      lastLine = state.src.slice(pos, lastPos);
      found = true;
    }
  }

  state.line = next + 1;

  token = state.push("math_block", "math", 0);
  token.block = true;
  token.content =
    (firstLine && firstLine.trim() ? firstLine + "\n" : "") +
    state.getLines(start + 1, next, state.tShift[start], true) +
    (lastLine && lastLine.trim() ? lastLine : "");
  token.map = [start, state.line];
  token.markup = delimiter;
  return true;
}

export default function math_plugin(md, options) {
  // Default options
  options = options || {};

  var katexInline = function (latex) {
    options.displayMode = false;
    try {
      latex = latex
        .replace(/^\[(.*)\]$/, "$1")
        .replace(/^\\\((.*)\\\)$/, "$1")
        .replace(/^\\\[(.*)\\\]$/, "$1");
      return katex.renderToString(latex, options);
    } catch (error) {
      if (options.throwOnError) {
        console.log(error);
      }
      return latex;
    }
  };

  var inlineRenderer = function (tokens, idx) {
    return katexInline(tokens[idx].content);
  };

  var katexBlock = function (latex) {
    options.displayMode = true;
    try {
      // Remove surrounding delimiters if present
      latex = latex.replace(/^\[(.*)\]$/, "$1").replace(/^\\\[(.*)\\\]$/, "$1");
      return "<p>" + katex.renderToString(latex, options) + "</p>";
    } catch (error) {
      if (options.throwOnError) {
        console.log(error);
      }
      return latex;
    }
  };

  var blockRenderer = function (tokens, idx) {
    return katexBlock(tokens[idx].content) + "\n";
  };

  md.inline.ruler.after("escape", "math_inline", math_inline);
  md.block.ruler.after("blockquote", "math_block", math_block, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });
  md.renderer.rules.math_inline = inlineRenderer;
  md.renderer.rules.math_block = blockRenderer;
}
