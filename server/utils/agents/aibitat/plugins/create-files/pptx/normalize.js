const { safeJsonParse } = require("../../../../../http");

/**
 * The one shape every renderer trusts. Produced only by normalizeSlides.
 * @typedef {Object} Slide
 * @property {string} layout - A key of LAYOUT_RULES
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

// Which layouts are valid for a normalized slide's data. A stat title is the
// big number, so prose or bare "0"/"1" wordplay is not a stat.
const LAYOUT_RULES = {
  section: (s) => !!s.title,
  quote: (s) => !!s.title,
  bullets: (s) => s.bullets.length > 0,
  "two-column": (s) => s.items.length > 1,
  stats: (s) =>
    s.items.length > 0 &&
    s.items.every(
      (i) =>
        /\d/.test(i.title) && !/^[01]$/.test(i.title) && i.title.length <= 14
    ),
  cards: (s) => s.items.length > 0,
  steps: (s) => s.items.length > 0,
  chart: (s) => !!s.chart,
  table: (s) => !!s.table,
};

function resolveLayout(slide, requested) {
  if (LAYOUT_RULES[requested]?.(slide)) return requested;
  if (slide.chart) return "chart";
  if (slide.table) return "table";
  if (slide.items.length) return "cards";
  if (slide.bullets.length) return "bullets";
  return requested === "quote" && slide.title ? "quote" : null;
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
      const layout =
        s.layout === "section" && slide.title
          ? "section"
          : resolveLayout(slide, text(s.layout));
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

module.exports = {
  LAYOUTS: Object.keys(LAYOUT_RULES),
  CHART_TYPES,
  normalizeSlides,
  pruneDividers,
};
