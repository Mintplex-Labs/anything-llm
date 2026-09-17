const TurndownService = require("turndown");
const { parse } = require("node-html-parser");

// Image URL base paths to strip entirely - these are typically proxied badges,
// tracking pixels, avatars, or other non-content images that bloat token counts.
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
  // HTML clamps colspan to 1..1000, and a rowspan never reaches past its table.
  const MAX_COLSPAN = 1000;
  // A span attribute on a scraped page must not be able to make the output, or
  // the conversion, much larger than the page. So a table is padded out to a
  // full grid only while the grid stays within a few cells per real cell, and
  // never past MAX_GRID_CELLS; a table past that is written row by row, one
  // column per cell, as if it had no spans.
  const GRID_CELLS_PER_CELL = 8;
  const MIN_GRID_CELLS = 64;
  const MAX_GRID_CELLS = 40_000;

  // A GFM row splits at a pipe preceded by an even number of backslashes, so
  // every pipe is left with an odd number. In text Turndown has already
  // doubled each backslash, so that is always one more; inside a code span it
  // has not, and `a\|b` there already has one.
  const escapePipes = (text) => {
    const parts = text.split("|");
    for (let index = 0; index < parts.length - 1; index++) {
      const part = parts[index];
      let run = 0;
      while (run < part.length && part[part.length - 1 - run] === "\\") run++;
      if (run % 2 === 0) parts[index] = `${part}\\`;
    }
    return parts.join("|");
  };

  // A newline would end the row halfway through, so a line break folds into a
  // space.
  const cellText = (content) =>
    escapePipes(content.replace(/\r?\n/g, " ").trim());

  const tableOf = (node) => {
    let table = node.parentNode;
    while (table && table.nodeName !== "TABLE") table = table.parentNode;
    return table ?? null;
  };

  // A span is a non-negative integer, so a leading number wins and the rest of
  // the value is ignored. `zero` is what a `0` means: HTML5 dropped
  // `colspan="0"` so it counts as one column, while `rowspan="0"` still reaches
  // to the end of the cell's row group.
  const spanOf = (cell, attribute, max, zero = 1) => {
    const value = Number.parseInt(cell.getAttribute(attribute) ?? "", 10);
    // `-0` parses to zero but is not a non-negative integer, so it is no span.
    if (Object.is(value, 0)) return Math.min(zero, max);
    return Number.isFinite(value) && value > 0 ? Math.min(value, max) : 1;
  };

  const cellsOf = (row) =>
    Array.from(row.children).filter(
      (child) => child.nodeName === "TH" || child.nodeName === "TD"
    );

  // The row's group is the <thead>, <tbody> or <tfoot> around it, or the table
  // itself when its rows are not wrapped in one.
  const groupOf = (row, table) => {
    let group = row.parentNode;
    while (
      group &&
      group !== table &&
      group.nodeName !== "THEAD" &&
      group.nodeName !== "TBODY" &&
      group.nodeName !== "TFOOT"
    )
      group = group.parentNode;
    return group ?? table;
  };

  // Lay the table out on a grid the way a browser does, so a span takes the
  // columns it covers instead of leaving the row short. Returns null once the
  // grid would pass the table's budget.
  const layOut = (rows, cells, table) => {
    const before = new Map();
    const colspan = new Map();
    const widths = [];
    const taken = new Set();
    let width = 0;
    const realCells = cells.reduce(
      (total, rowCells) => total + rowCells.length,
      0
    );
    const budget = Math.min(
      MAX_GRID_CELLS,
      MIN_GRID_CELLS + GRID_CELLS_PER_CELL * realCells
    );
    // How far a `rowspan="0"` in each row reaches: its own row plus the rows
    // left in its group. Groups run in document order, so one pass from the
    // bottom counts them.
    const groups = rows.map((row) => groupOf(row, table));
    const groupRowsLeft = new Array(rows.length);
    for (let index = rows.length - 1; index >= 0; index--)
      groupRowsLeft[index] =
        groups[index + 1] === groups[index] ? groupRowsLeft[index + 1] + 1 : 1;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      let column = 0;
      const free = () => {
        let skipped = 0;
        while (taken.has(`${rowIndex},${column}`)) {
          column++;
          skipped++;
        }
        return skipped;
      };
      for (const cell of cells[rowIndex]) {
        before.set(cell, free());
        const across = spanOf(cell, "colspan", MAX_COLSPAN);
        const down = spanOf(
          cell,
          "rowspan",
          rows.length - rowIndex,
          groupRowsLeft[rowIndex]
        );
        if (taken.size + across * down > budget) return null;
        colspan.set(cell, across);
        for (let r = 0; r < down; r++)
          for (let c = 0; c < across; c++)
            taken.add(`${rowIndex + r},${column + c}`);
        column += across;
      }
      // `column` is the width the row emits cells for. Trailing slots a rowspan
      // from above still claims widen the table but emit no cell here, so they
      // count toward `width` and become right-side padding.
      widths.push(column);
      free();
      width = Math.max(width, column);
    }
    // A row with no cells is never written, so only the others are padded.
    const writtenRows = cells.filter((rowCells) => rowCells.length > 0).length;
    if (width * writtenRows > budget) return null;
    const after = new Map();
    rows.forEach((row, index) => after.set(row, width - widths[index]));
    return { width, before, colspan, after };
  };

  const measure = (table) => {
    const rows = Array.from(table.querySelectorAll("tr")).filter(
      (row) => tableOf(row) === table
    );
    const cells = rows.map(cellsOf);
    // The delimiter goes under the first row that has cells.
    const headerIndex = cells.findIndex((rowCells) => rowCells.length > 0);
    const header = headerIndex >= 0 ? rows[headerIndex] : null;
    const layout = layOut(rows, cells, table);
    if (layout) return { header, headerWidth: layout.width, ...layout };
    // Past the budget the spans are ignored, so a row is as wide as its own
    // cells. The header still has to reach the widest row, or the cells beyond
    // it fall out of the table. A shorter body row is fine as it is, because
    // GFM fills it with empty cells, and padding every row is exactly the
    // growth the budget exists to prevent.
    const width = cells.reduce(
      (widest, rowCells) => Math.max(widest, rowCells.length),
      0
    );
    const after = new Map();
    if (header) after.set(header, width - cells[headerIndex].length);
    return {
      header,
      headerWidth: width,
      before: new Map(),
      colspan: new Map(),
      after,
    };
  };

  const notInATable = {
    header: null,
    headerWidth: 0,
    before: new Map(),
    colspan: new Map(),
    after: new Map(),
  };
  const grids = new WeakMap();
  const gridFor = (node) => {
    const table = tableOf(node);
    if (!table) return notInATable;
    if (!grids.has(table)) grids.set(table, measure(table));
    return grids.get(table);
  };

  turndown.addRule("tableCell", {
    filter: ["th", "td"],
    replacement: (content, node) => {
      const grid = gridFor(node);
      // Markdown has no merged cells, so a span becomes the empty cells the
      // columns it covers would otherwise be missing.
      const before = " |".repeat(grid.before.get(node) ?? 0);
      const spanned = " |".repeat((grid.colspan.get(node) ?? 1) - 1);
      return `${before} ${cellText(content)} |${spanned}`;
    },
  });

  turndown.addRule("tableRow", {
    filter: "tr",
    replacement: (content, node) => {
      const grid = gridFor(node);
      const row = `|${content}${" |".repeat(grid.after.get(node) ?? 0)}`;
      if (node !== grid.header) return `\n${row}`;
      // A GFM table has to open with a header row, so the first row that has
      // cells becomes one. On a page written without <th> that is what it is.
      return `\n${row}\n|${" --- |".repeat(grid.headerWidth)}`;
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
    // A row with no cells is blank to Turndown, which writes it as a blank line
    // instead of calling the row rule, and a blank line ends the table.
    replacement: (content) =>
      `\n\n${content.trim().replace(/^(\|.*)\n\s*\n(?=\|)/gm, "$1\n")}\n\n`,
  });
}

/**
 * Convert raw page HTML into clean markdown using Turndown.
 * Strips non-content elements (nav, footer, ads, etc.), hidden elements,
 * base64 images, scripts, styles, and resolves relative URLs before converting.
 * @param {string} html - Raw HTML string
 * @param {string} baseUrl - The URL the page was scraped from
 * @returns {string} Cleaned markdown string
 */
function htmlToMarkdown(html, baseUrl) {
  if (!html || typeof html !== "string") return "";
  try {
    let root = parse(html);

    // Prefer the narrowest content container to avoid page chrome.
    // article > main because sites like GitHub put the file tree inside <main>
    // but scope the README to <article>.
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

    // Strip links and images with excessively long URLs (200+ chars)
    markdown = markdown.replace(/!\[[^\]]*\]\([^)]{200,}\)\s*/g, "");
    markdown = markdown.replace(/\[[^\]]*\]\([^)]{200,}\)/g, (match) => {
      const textMatch = match.match(/\[([^\]]*)\]/);
      return textMatch ? textMatch[1] : "";
    });

    markdown = markdown.replace(/\n{4,}/g, "\n\n\n").trim();
    return markdown;
  } catch (error) {
    console.error("htmlToMarkdown failed:", error);
    try {
      return parse(html).text.trim();
    } catch {
      return "";
    }
  }
}

/**
 * Resolve relative URLs for links and images. Strips base64 and
 * ignored-basepath images entirely. Gives alt-less images a filename-based alt.
 * @param {import('node-html-parser').HTMLElement} root
 * @param {string} baseUrl
 */
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

/**
 * Strip citation/reference superscripts and reference sections
 * commonly found on Wikipedia and similar sites.
 * @param {import('node-html-parser').HTMLElement} root
 */
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
    ".mw-editsection",
  ]) {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  }
}

module.exports = { htmlToMarkdown };
