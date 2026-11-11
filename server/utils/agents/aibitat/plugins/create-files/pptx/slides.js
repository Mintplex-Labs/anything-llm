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
// Axis and legend labels are laid out by PowerPoint, which wraps long ones
// until they crowd out the chart itself.
const MAX_CATEGORY_CHARS = 32;

// A stat title is the big number, so prose or bare "0"/"1" wordplay is not one.
const isStat = (item) =>
  /\d/.test(item.title) &&
  !/^[01]$/.test(item.title) &&
  item.title.length <= 14;

/**
 * The most text a layout holds at its smallest font size in render.js:
 * counts for lists and characters for strings. Longer model output is cut at
 * a word boundary so no text box overflows. render.test.js renders every
 * layout filled to these limits, so a change on either side that breaks the
 * fit fails there.
 */
const DEFAULT_LIMITS = {
  title: 50,
  subtitle: 160,
  bullets: 6,
  bullet: 140,
  items: 6,
  itemTitle: 40,
  itemText: 110,
  itemBullets: 6,
  itemBullet: 120,
  cell: 48,
};

/** Limits for the cover slide, whose title and subtitle come from the outline. */
const COVER_LIMITS = { title: 90, subtitle: 160 };

/**
 * Every layout: the one-line description the builder prompt shows the model,
 * the rule a normalized slide must pass to render with it and the text
 * limits it is clipped to (see DEFAULT_LIMITS).
 */
const LAYOUTS = {
  section: {
    hint: "divider. title + subtitle",
    fits: (s) => !!s.title,
    limits: { title: 90 },
  },
  bullets: {
    hint: "title + bullets (3-6 short strings)",
    fits: (s) => s.bullets.length > 0,
  },
  "two-column": {
    hint: "compare or contrast. title + items (exactly 2, each with title + bullets)",
    fits: (s) => s.items.length > 1,
    limits: { items: 2, itemTitle: 60 },
  },
  stats: {
    hint: 'real measured figures only (money, percentages, counts with a source), e.g. "42%" or "$1.2B". title + items (2-6, each title is the number, text is the label). Never use it for wordplay like "0", "1 app" or "∞"',
    fits: (s) => s.items.length > 0 && s.items.every(isStat),
    limits: { title: 100, itemText: 80, bullets: 4, bullet: 120 },
  },
  cards: {
    hint: "parallel ideas. title + items (2-6, each with title + one-sentence text)",
    fits: (s) => s.items.length > 0,
    limits: { title: 70 },
  },
  steps: {
    hint: "process or timeline. title + items (3-5, each with title + short text)",
    fits: (s) => s.items.length > 0,
    limits: { itemText: 200 },
  },
  chart: {
    hint: `title + chart { type: ${CHART_TYPES.join("|")}, categories, values } + optional bullets`,
    fits: (s) => !!s.chart,
    limits: { title: 60, bullets: 5, bullet: 120 },
  },
  table: {
    hint: "title + table { headers, rows }",
    fits: (s) => !!s.table,
    limits: { title: 60 },
  },
  quote: {
    hint: "title is the quote text, subtitle is who said it",
    fits: (s) => !!s.title,
    limits: { title: 300, subtitle: 80 },
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
  // A header row alone renders as an empty table.
  if (rows.length === 0) return null;
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
  const categories = strings(raw.categories).map((c) =>
    clip(c, MAX_CATEGORY_CHARS)
  );
  // Each value stays paired with its category, so dropping one that is not a
  // number never shifts the rest onto the wrong label.
  const points = list(series?.values ?? raw.values)
    .map((v, i) => ({
      value: typeof v === "string" && v.trim() ? Number(v) : v,
      category: categories[i] || `${i + 1}`,
    }))
    .filter((p) => typeof p.value === "number" && Number.isFinite(p.value));
  const values = points.map((p) => p.value);
  // Identical values are placeholders, not data.
  if (values.length < 2 || new Set(values).size < 2) return null;
  return {
    type: CHART_TYPES.includes(raw.type) ? raw.type : "bar",
    categories: points.map((p) => p.category),
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
      return layout ? { layout, ...applyLimits(slide, layout) } : null;
    })
    .filter(Boolean);
}

/**
 * Cuts a string to at most `max` characters, ending on a word boundary with
 * an ellipsis when it has to cut.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
function clip(str, max) {
  if (str.length <= max) return str;
  const cut = str.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/** Clips a normalized slide to the text its layout can hold. */
function applyLimits(slide, layout) {
  const max = { ...DEFAULT_LIMITS, ...LAYOUTS[layout].limits };
  const cell = (c) => clip(c, max.cell);
  return {
    ...slide,
    title: clip(slide.title, max.title),
    subtitle: clip(slide.subtitle, max.subtitle),
    bullets: slide.bullets
      .slice(0, max.bullets)
      .map((b) => clip(b, max.bullet)),
    items: slide.items.slice(0, max.items).map((item) => ({
      title: clip(item.title, max.itemTitle),
      text: clip(item.text, max.itemText),
      bullets: item.bullets
        .slice(0, max.itemBullets)
        .map((b) => clip(b, max.itemBullet)),
    })),
    table: slide.table && {
      headers: slide.table.headers.map(cell),
      rows: slide.table.rows.map((row) => row.map(cell)),
    },
  };
}

/**
 * The cover slide's title and subtitle, clipped like any slide's.
 * @param {{title: *, subtitle: *}} cover
 * @returns {{title: string, subtitle: string}}
 */
function normalizeCover({ title, subtitle }) {
  return {
    title: clip(text(title), COVER_LIMITS.title),
    subtitle: clip(text(subtitle), COVER_LIMITS.subtitle),
  };
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
  LAYOUTS,
  DEFAULT_LIMITS,
  COVER_LIMITS,
  SLIDE_SCHEMA,
  normalizeSlides,
  normalizeCover,
  pruneDividers,
};
