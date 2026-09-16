#!/usr/bin/env node
// CLI: reads HTML from stdin, writes clean markdown to stdout.
// Usage: echo "<html>...</html>" | node html-to-markdown.js [baseUrl]

const TurndownService = require("turndown");
const { parse } = require("node-html-parser");

const IGNORED_IMG_BASEPATHS = [
  "https://camo.githubusercontent.com",
  "https://avatars.githubusercontent.com",
  "https://img.shields.io",
  "https://badge.fury.io",
  "https://badges.gitter.im",
  "https://coveralls.io/repos",
  "https://travis-ci.org",
  "https://circleci.com",
  "https://github.com/favicon",
];

/**
 * Give Turndown the table rules it does not ship with.
 *
 * Without them a `<table>` is flattened into one paragraph per cell, so a
 * value loses the row and the column it belonged to: a price ends up as a
 * paragraph of its own, several blank lines away from the product it belongs
 * to, and the chunker can split the two apart.
 * @param {import('turndown')} turndown
 */
function addTableRules(turndown) {
  // Turndown has already escaped the cell's backslashes, so only the pipe is
  // left to escape, and a pipe inside a cell would add a column of its own.
  const cellText = (content) =>
    content.replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim();

  const tableOf = (node) => {
    let table = node.parentNode;
    while (table && table.nodeName !== "TABLE") table = table.parentNode;
    return table ?? null;
  };

  const isFirstRow = (node) => {
    const table = tableOf(node);
    return !!table && table.querySelector("tr") === node;
  };

  const spanOf = (cell, attribute) => {
    const value = Number.parseInt(cell.getAttribute(attribute) ?? "", 10);
    return Number.isFinite(value) && value > 0 ? value : 1;
  };

  const cellsOf = (row) =>
    Array.from(row.children).filter(
      (child) => child.nodeName === "TH" || child.nodeName === "TD"
    );

  // Lay the table out on a grid the way a browser does, so a span takes the
  // columns it covers instead of leaving the row short.
  const measure = (table) => {
    const before = new Map();
    const after = new Map();
    const taken = new Set();
    const rows = Array.from(table.querySelectorAll("tr")).filter(
      (row) => tableOf(row) === table
    );
    let width = 0;

    rows.forEach((row, rowIndex) => {
      let column = 0;
      const free = () => {
        let skipped = 0;
        while (taken.has(`${rowIndex},${column}`)) {
          column++;
          skipped++;
        }
        return skipped;
      };
      for (const cell of cellsOf(row)) {
        before.set(cell, free());
        const colspan = spanOf(cell, "colspan");
        const rowspan = spanOf(cell, "rowspan");
        for (let r = 0; r < rowspan; r++)
          for (let c = 0; c < colspan; c++)
            taken.add(`${rowIndex + r},${column + c}`);
        column += colspan;
      }
      // `column` is now the width the row emits cells for. Trailing slots a
      // rowspan from above still claims widen the table but emit no cell here,
      // so they count toward `width` and become right-side padding.
      after.set(row, column);
      free();
      width = Math.max(width, column);
    });

    // `after` held each row's own emitted width; turn it into the padding it needs.
    for (const row of rows) after.set(row, width - (after.get(row) ?? width));
    return { width, before, after };
  };

  const grids = new WeakMap();
  const gridFor = (node) => {
    const table = tableOf(node);
    if (!table) return null;
    if (!grids.has(table)) grids.set(table, measure(table));
    return grids.get(table);
  };

  turndown.addRule("tableCell", {
    filter: ["th", "td"],
    replacement: (content, node) => {
      const grid = gridFor(node);
      // Markdown has no merged cells, so a span becomes the empty cells the
      // columns it covers would otherwise be missing.
      const before = " |".repeat(grid?.before.get(node) ?? 0);
      const spanned = " |".repeat(spanOf(node, "colspan") - 1);
      return `${before} ${cellText(content)} |${spanned}`;
    },
  });

  turndown.addRule("tableRow", {
    filter: "tr",
    replacement: (content, node) => {
      const grid = gridFor(node);
      const after = " |".repeat(grid?.after.get(node) ?? 0);
      const row = `|${content}${after}`;
      if (!isFirstRow(node)) return `\n${row}`;
      // A GFM table has to open with a header row, so the first row becomes
      // one. On a page written without <th> that is what it is anyway.
      const columns = grid?.width ?? node.querySelectorAll("th, td").length;
      return `\n${row}\n|${" --- |".repeat(columns)}`;
    },
  });

  // A section wrapper must not put a blank line between the header row and the
  // body, because a blank line ends the table.
  turndown.addRule("tableSection", {
    filter: ["thead", "tbody", "tfoot"],
    replacement: (content) => content,
  });

  turndown.addRule("tableCaption", {
    filter: "caption",
    replacement: (content) => (content.trim() ? `${content.trim()}\n\n` : ""),
  });

  turndown.addRule("table", {
    filter: "table",
    replacement: (content) => `\n\n${content.trim()}\n\n`,
  });
}

function htmlToMarkdown(html, baseUrl) {
  if (!html || typeof html !== "string") return "";
  try {
    let root = parse(html);

    const content =
      root.querySelector("article") ||
      root.querySelector("main") ||
      root.querySelector('[role="main"]');
    if (content) root = content;

    const junkSelectors = [
      "script",
      "style",
      "noscript",
      "nav",
      "footer",
      "header",
      "aside",
      "iframe",
      "svg",
      '[role="navigation"]',
      '[role="banner"]',
      '[role="contentinfo"]',
      '[aria-hidden="true"]',
      "[hidden]",
    ];
    for (const sel of junkSelectors) {
      root.querySelectorAll(sel).forEach((el) => el.remove());
    }

    for (const el of root.querySelectorAll("[style]")) {
      const style = el.getAttribute("style") || "";
      if (
        /display\s*:\s*none/i.test(style) ||
        /visibility\s*:\s*hidden/i.test(style)
      ) {
        el.remove();
      }
    }

    if (baseUrl) {
      resolveUrls(root, baseUrl);
    }

    stripCitations(root);

    const cleanedHtml = root.toString();

    const turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });
    turndown.remove(["script", "style", "noscript", "iframe", "svg"]);
    addTableRules(turndown);

    turndown.addRule("compactLinks", {
      filter: "a",
      replacement: function (content, node) {
        const href = node.getAttribute("href");
        if (!href) return content;
        const text = content.replace(/\s+/g, " ").trim();
        if (!text) return "";
        return `[${text}](${href})`;
      },
    });

    let markdown = turndown.turndown(cleanedHtml);

    markdown = markdown.replace(/!\[[^\]]*\]\([^)]{200,}\)\s*/g, "");
    markdown = markdown.replace(/\[[^\]]*\]\([^)]{200,}\)/g, (match) => {
      const textMatch = match.match(/\[([^\]]*)\]/);
      return textMatch ? textMatch[1] : "";
    });

    markdown = markdown.replace(/\[[\d]+\]/g, "");
    markdown = markdown.replace(/\[#cite[^\]]*\]/g, "");
    markdown = markdown.replace(/\[edit\]/gi, "");

    markdown = markdown.replace(/\n{4,}/g, "\n\n\n").trim();
    return markdown;
  } catch (error) {
    process.stderr.write(
      "html-to-markdown conversion failed: " + error.message + "\n"
    );
    try {
      return parse(html).text.trim();
    } catch {
      return "";
    }
  }
}

function resolveUrls(root, baseUrl) {
  for (const a of root.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href || /^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) continue;
    try {
      a.setAttribute("href", new URL(href, baseUrl).toString());
    } catch {}
  }

  for (const img of root.querySelectorAll("img[src]")) {
    const src = img.getAttribute("src");
    if (!src) {
      img.remove();
      continue;
    }
    if (src.startsWith("data:")) {
      img.remove();
      continue;
    }

    const resolvedSrc = /^https?:/i.test(src)
      ? src
      : (() => {
          try {
            return new URL(src, baseUrl).toString();
          } catch {
            return src;
          }
        })();

    if (IGNORED_IMG_BASEPATHS.some((base) => resolvedSrc.startsWith(base))) {
      img.remove();
      continue;
    }

    if (!/^https?:/i.test(src)) {
      try {
        img.setAttribute("src", new URL(src, baseUrl).toString());
      } catch {}
    }

    const alt = (img.getAttribute("alt") || "").trim();
    if (!alt) {
      try {
        const pathname = new URL(img.getAttribute("src")).pathname;
        const filename = pathname.split("/").pop() || "image";
        img.setAttribute("alt", filename);
      } catch {
        img.setAttribute("alt", "image");
      }
    }
  }
}

function stripCitations(root) {
  for (const sup of root.querySelectorAll("sup.reference, sup.noprint")) {
    sup.remove();
  }

  for (const sel of [
    ".reflist",
    ".references",
    ".refbegin",
    "#References",
    ".catlinks",
    ".mw-authority-control",
  ]) {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  }
}

// --- CLI entry point ---
let input = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  const baseUrl = process.argv[2] || "";
  const md = htmlToMarkdown(input, baseUrl);
  process.stdout.write(md);
});
