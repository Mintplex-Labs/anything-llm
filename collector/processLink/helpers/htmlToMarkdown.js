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
  // HTML clamps colspan to 1000. The grid budget keeps a hostile span from
  // inflating the output; a table over budget is written as if it had no spans.
  const MAX_COLSPAN = 1000;
  const GRID_CELLS_PER_CELL = 8;
  const MIN_GRID_CELLS = 64;
  const MAX_GRID_CELLS = 40_000;

  // GFM splits a row at any pipe with an even run of backslashes before it.
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

  const cellText = (content) =>
    escapePipes(content.replace(/\r?\n/g, " ").trim());

  const tableOf = (node) => {
    let table = node.parentNode;
    while (table && table.nodeName !== "TABLE") table = table.parentNode;
    return table ?? null;
  };

  // `zero` is what a "0" means: one column for colspan, the rest of the row
  // group for rowspan.
  const spanOf = (cell, attribute, max, zero = 1) => {
    const value = Number.parseInt(cell.getAttribute(attribute) ?? "", 10);
    if (Object.is(value, 0)) return Math.min(zero, max);
    return Number.isFinite(value) && value > 0 ? Math.min(value, max) : 1;
  };

  const cellsOf = (row) =>
    Array.from(row.children).filter(
      (child) => child.nodeName === "TH" || child.nodeName === "TD"
    );

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

  // Lay the table out on a grid the way a browser does. Returns null when the
  // grid would pass the budget.
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
    // Rows left in each row's group, which is how far a rowspan="0" reaches.
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
      // Trailing slots claimed by a rowspan above widen the table but emit no
      // cell here, so they become right-side padding.
      widths.push(column);
      free();
      width = Math.max(width, column);
    }
    const writtenRows = cells.filter((rowCells) => rowCells.length > 0).length;
    if (width * writtenRows > budget) return null;
    const after = new Map();
    rows.forEach((row, index) => after.set(row, width - widths[index]));
    return { width, before, colspan, after };
  };

  // A browser draws <thead> first and <tfoot> last wherever they sit in the
  // source.
  const SECTION_ORDER = { THEAD: 0, TFOOT: 2 };
  const rowsOf = (table) =>
    Array.from(table.querySelectorAll("tr"))
      .filter((row) => tableOf(row) === table)
      .map((row, index) => ({
        row,
        index,
        order: SECTION_ORDER[groupOf(row, table).nodeName] ?? 1,
      }))
      .sort((a, b) => a.order - b.order || a.index - b.index)
      .map(({ row }) => row);

  const measure = (table) => {
    const rows = rowsOf(table);
    const cells = rows.map(cellsOf);
    const headerIndex = cells.findIndex((rowCells) => rowCells.length > 0);
    const header = headerIndex >= 0 ? rows[headerIndex] : null;
    const nested = tableOf(table) !== null;
    // Row lines, collected here and written in drawn order by the table rule.
    const lines = new Map();
    const shape = { rows, header, nested, lines };
    const layout = layOut(rows, cells, table);
    if (layout) return { ...shape, headerWidth: layout.width, ...layout };
    // Over budget: spans are ignored and only the header is padded to the
    // widest row. GFM fills a short body row with empty cells itself.
    const width = cells.reduce(
      (widest, rowCells) => Math.max(widest, rowCells.length),
      0
    );
    const after = new Map();
    if (header) after.set(header, width - cells[headerIndex].length);
    return {
      ...shape,
      headerWidth: width,
      before: new Map(),
      colspan: new Map(),
      after,
    };
  };

  const notInATable = {
    rows: [],
    header: null,
    headerWidth: 0,
    nested: false,
    lines: new Map(),
    before: new Map(),
    colspan: new Map(),
    after: new Map(),
  };
  const grids = new WeakMap();
  const gridOfTable = (table) => {
    if (!grids.has(table)) grids.set(table, measure(table));
    return grids.get(table);
  };
  const gridFor = (node) => {
    const table = tableOf(node);
    return table ? gridOfTable(table) : notInATable;
  };

  // A nested table is flattened to text so it cannot break the outer table.
  const NESTED_CELL_SEPARATOR = ", ";
  const NESTED_ROW_SEPARATOR = "; ";

  turndown.addRule("tableCell", {
    filter: ["th", "td"],
    replacement: (content, node) => {
      const grid = gridFor(node);
      if (grid.nested) return `${cellText(content)}${NESTED_CELL_SEPARATOR}`;
      // A span becomes the empty cells for the columns it covers.
      const before = " |".repeat(grid.before.get(node) ?? 0);
      const spanned = " |".repeat((grid.colspan.get(node) ?? 1) - 1);
      return `${before} ${cellText(content)} |${spanned}`;
    },
  });

  turndown.addRule("tableRow", {
    filter: "tr",
    replacement: (content, node) => {
      const grid = gridFor(node);
      if (grid.nested) {
        const text = content.replace(/, $/, "");
        return text ? `${text}${NESTED_ROW_SEPARATOR}` : "";
      }
      const row = `|${content}${" |".repeat(grid.after.get(node) ?? 0)}`;
      // GFM needs a header row, so the first row with cells becomes one.
      const line =
        node === grid.header
          ? `${row}\n|${" --- |".repeat(grid.headerWidth)}`
          : row;
      grid.lines.set(node, line);
      return "";
    },
  });

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
    replacement: (content, node) => {
      const grid = gridOfTable(node);
      const rows = grid.rows
        .filter((row) => grid.lines.has(row))
        .map((row) => grid.lines.get(row));
      if (grid.nested) return ` ${content.replace(/; $/, "").trim()} `;
      // The rows wrote nothing, so what is left is the caption and stray text.
      const caption = content.trim();
      const table = rows.join("\n");
      if (!table) return caption ? `\n\n${caption}\n\n` : "";
      return `\n\n${caption ? `${caption}\n\n` : ""}${table}\n\n`;
    },
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
