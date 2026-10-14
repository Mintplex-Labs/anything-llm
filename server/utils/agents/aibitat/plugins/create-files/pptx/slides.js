const { safeJsonParse } = require("../../../../../http");

/**
 * The slide contract between the model and the renderer: the layouts that
 * exist, what the model may submit for one (SLIDE_SCHEMA) and how any model
 * output is turned into the one shape every renderer trusts (normalizeSlides).
 *
 * @typedef {Object} Slide
 * @property {string} layout - A key of LAYOUTS
 * @property {string} title
 * @property {string} subtitle
 * @property {string[]} bullets
 * @property {{title: string, text: string, bullets: string[]}[]} items
 * @property {{headers: string[], rows: string[][]}|null} table
 * @property {{type: string, categories: string[], values: number[]}|null} chart
 * @property {string} notes
 */

const CHART_TYPES = ["bar", "line", "pie", "doughnut", "area"];
const MAX_TABLE_COLS = 6;
const MAX_TABLE_ROWS = 8;

// A stat title is the big number, so prose or bare "0"/"1" wordplay is not one.
const isStat = (item) =>
  /\d/.test(item.title) &&
  !/^[01]$/.test(item.title) &&
  item.title.length <= 14;

/**
 * Every layout: the one-line description the builder prompt shows the model
 * and the rule a normalized slide must pass to render with it.
 */
const LAYOUTS = {
  section: {
    hint: "divider. title + subtitle",
    fits: (s) => !!s.title,
  },
  bullets: {
    hint: "title + bullets (3-6 short strings)",
    fits: (s) => s.bullets.length > 0,
  },
  "two-column": {
    hint: "compare or contrast. title + items (exactly 2, each with title + bullets)",
    fits: (s) => s.items.length > 1,
  },
  stats: {
    hint: 'real measured figures only (money, percentages, counts with a source), e.g. "42%" or "$1.2B". title + items (2-4, each title is the number, text is the label). Never use it for wordplay like "0", "1 app" or "∞"',
    fits: (s) => s.items.length > 0 && s.items.every(isStat),
  },
  cards: {
    hint: "parallel ideas. title + items (2-6, each with title + one-sentence text)",
    fits: (s) => s.items.length > 0,
  },
  steps: {
    hint: "process or timeline. title + items (3-5, each with title + short text)",
    fits: (s) => s.items.length > 0,
  },
  chart: {
    hint: `title + chart { type: ${CHART_TYPES.join("|")}, categories, values } + optional bullets`,
    fits: (s) => !!s.chart,
  },
  table: {
    hint: "title + table { headers, rows }",
    fits: (s) => !!s.table,
  },
  quote: {
    hint: "title is the quote text, subtitle is who said it",
    fits: (s) => !!s.title,
  },
};

// Field meanings live in the builder prompt; the schema stays bare so it
// costs as few tokens as possible on every section call.
const SLIDE_SCHEMA = {
  type: "object",
  properties: {
    layout: { type: "string", enum: Object.keys(LAYOUTS) },
    title: { type: "string" },
    subtitle: { type: "string" },
    bullets: { type: "array", items: { type: "string" } },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          text: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
      },
    },
    chart: {
      type: "object",
      properties: {
        type: { type: "string", enum: CHART_TYPES },
        categories: { type: "array", items: { type: "string" } },
        values: { type: "array", items: { type: "number" } },
      },
    },
    table: {
      type: "object",
      properties: {
        headers: { type: "array", items: { type: "string" } },
        rows: {
          type: "array",
          items: { type: "array", items: { type: "string" } },
        },
      },
    },
    notes: { type: "string" },
  },
  required: ["layout", "title"],
};

const text = (v) => (v == null ? "" : String(v).trim());
const list = (v) => (Array.isArray(v) ? v : typeof v === "string" ? [v] : []);
const strings = (v) => list(v).map(text).filter(Boolean);
// "a | b | c" strings and objects are common small-model substitutes for arrays.
const cells = (row) =>
  Array.isArray(row)
    ? row.map(text)
    : typeof row === "string"
      ? row.split(/\s*[|;\t]\s*/).map(text)
      : row && typeof row === "object"
        ? Object.values(row).map(text)
        : [];

function normalizeItems(raw) {
  return list(raw)
    .map((item) =>
      item && typeof item === "object"
        ? {
            title: text(item.title),
            text: text(item.text),
            bullets: strings(item.bullets),
          }
        : { title: text(item), text: "", bullets: [] }
    )
    .filter((item) => item.title || item.text || item.bullets.length);
}

function normalizeTable(raw) {
  if (!raw || typeof raw !== "object") return null;
  const rows = list(raw.rows)
    .map(cells)
    .filter((row) => row.some(Boolean))
    .slice(0, MAX_TABLE_ROWS);
  const headers = cells(raw.headers);
  const cols = Math.min(
    MAX_TABLE_COLS,
    Math.max(headers.length, ...rows.map((r) => r.length))
  );
  if (cols === 0) return null;
  const pad = (row) => Array.from({ length: cols }, (_, i) => row[i] || "");
  return { headers: headers.length ? pad(headers) : [], rows: rows.map(pad) };
}

function normalizeChart(raw) {
  if (!raw || typeof raw !== "object") return null;
  const series = list(raw.series)[0];
  const values = list(series?.values ?? raw.values)
    .map(Number)
    .filter((v) => !Number.isNaN(v));
  // Identical values are placeholders, not data.
  if (values.length < 2 || new Set(values).size < 2) return null;
  const categories = strings(raw.categories);
  return {
    type: CHART_TYPES.includes(raw.type) ? raw.type : "bar",
    categories: values.map((_, i) => categories[i] || `${i + 1}`),
    values,
  };
}

/** The requested layout when the slide's data supports it, else the richest one that does. */
function resolveLayout(slide, requested) {
  if (LAYOUTS[requested]?.fits(slide)) return requested;
  if (slide.chart) return "chart";
  if (slide.table) return "table";
  if (slide.items.length) return "cards";
  if (slide.bullets.length) return "bullets";
  return null;
}

/**
 * Turns whatever the model submitted into canonical slides. Accepts a JSON
 * string, a single slide object or an array; drops slides with no content.
 * @param {*} raw - Model output for one section
 * @param {string} sectionTitle - Fallback title for untitled slides
 * @returns {Slide[]}
 */
function normalizeSlides(raw, sectionTitle = "") {
  if (typeof raw === "string") raw = safeJsonParse(raw, null);
  if (raw && !Array.isArray(raw) && typeof raw === "object")
    raw = Array.isArray(raw.slides) ? raw.slides : [raw];
  return list(raw)
    .filter((s) => s && typeof s === "object")
    .map((s) => {
      const slide = {
        title: text(s.title) || sectionTitle,
        subtitle: text(s.subtitle),
        bullets: strings(s.bullets),
        items: normalizeItems(s.items),
        table: normalizeTable(s.table),
        chart: normalizeChart(s.chart),
        notes: text(s.notes),
      };
      const layout = resolveLayout(slide, text(s.layout));
      return layout ? { layout, ...slide } : null;
    })
    .filter(Boolean);
}

/**
 * Drops section dividers with no content slide after them so a deck never
 * ends on, or stacks, empty dividers.
 * @param {Slide[]} slides
 * @returns {Slide[]}
 */
function pruneDividers(slides) {
  return slides.filter(
    (slide, i) =>
      slide.layout !== "section" ||
      (slides[i + 1] && slides[i + 1].layout !== "section")
  );
}

module.exports = { LAYOUTS, SLIDE_SCHEMA, normalizeSlides, pruneDividers };
