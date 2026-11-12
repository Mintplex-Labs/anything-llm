const { safeJsonParse } = require("../../../../../http");

/**
 * The slide contract between the model and the renderer.
 *
 * The model writes content: a title and one kind of content per slide
 * (SLIDE_SCHEMA), plus an optional layout it would like. Code makes the
 * decisions that keep a deck sound: normalizeSlides turns any model output
 * into canonical slides, drops figures and quotes the sources do not back
 * up, and clips text to what the layouts hold; assignLayouts then gives each
 * slide the layout the model asked for when its content fits it and it does
 * not repeat the slide before, and otherwise the best fit for the content.
 * A capable model gets to design; a small one that asks for nothing, or the
 * same layout everywhere, still gets a varied deck.
 *
 * @typedef {Object} Slide
 * @property {string} layout - A key of LAYOUTS, or "section" for a divider
 * @property {string} title
 * @property {string} subtitle - Section dividers only
 * @property {string[]} points
 * @property {{title: string, text: string}[]} items
 * @property {boolean} ordered - The items are steps or a timeline
 * @property {{value: string, label: string}[]} figures
 * @property {{type: string, categories: string[], values: number[]}|null} chart
 * @property {{headers: string[], rows: string[][]}|null} table
 * @property {{text: string, by: string}|null} quote
 * @property {string} notes
 * @property {import("./images.js").Picture|Promise<import("./images.js").Picture|null>|null} [image]
 *   Set by code only: a picture beside the content ("image"), on its own
 *   ("image-feature"), or a generated picture on a section divider
 * @property {"cover"|"contain"} [fit] - How an "image" or "image-feature" picture fills its frame
 * @property {string} [caption] - Shown under an "image-feature" picture
 * @property {string} [credit] - Where the picture came from, shown on the slide
 */

const CHART_TYPES = ["bar", "line", "pie", "doughnut", "area"];

/**
 * The most of each kind of content one slide holds: counts for lists,
 * characters for strings. Longer model output is cut at a word boundary.
 * render.test.js renders every layout with more than this, so a change on
 * either side that lets text overflow fails there.
 */
const LIMITS = {
  title: 60,
  subtitle: 120,
  points: 6,
  point: 120,
  items: 6,
  itemTitle: 40,
  itemText: 140,
  figures: 6,
  figureValue: 12,
  figureLabel: 60,
  quote: 240,
  quoteBy: 60,
  tableCols: 6,
  tableRows: 6,
  cell: 40,
  chartValues: 12,
  category: 32,
};

/** Limits for the cover slide, whose title and subtitle come from the outline. */
const COVER_LIMITS = { title: 90, subtitle: 160 };

/**
 * Every content layout and the content shape it can show. assignLayouts
 * tries a slide's candidate layouts in order (see candidates).
 */
const LAYOUTS = {
  bullets: (s) => s.points.length > 0 || s.items.length > 0,
  split: (s) =>
    (s.points.length > 0 && s.points.length <= 5) ||
    (s.items.length > 0 && s.items.length <= 5),
  cards: (s) => s.items.length >= 2,
  steps: (s) => s.items.length >= 3 && s.ordered,
  comparison: (s) => s.items.length === 2,
  stats: (s) => s.figures.length >= 2,
  chart: (s) => !!s.chart,
  table: (s) => !!s.table,
  quote: (s) => !!s.quote,
};

// Field meanings live in the builder prompt; the schema stays bare so it
// costs as few tokens as possible on every section call.
const SLIDE_SCHEMA = {
  type: "object",
  properties: {
    layout: { type: "string", enum: Object.keys(LAYOUTS) },
    title: { type: "string" },
    points: { type: "array", items: { type: "string" } },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { title: { type: "string" }, text: { type: "string" } },
      },
    },
    ordered: { type: "boolean" },
    figures: {
      type: "array",
      items: {
        type: "object",
        properties: { value: { type: "string" }, label: { type: "string" } },
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
    quote: {
      type: "object",
      properties: { text: { type: "string" }, by: { type: "string" } },
    },
    notes: { type: "string" },
  },
  required: ["title"],
};

// Bounds on raw model output, applied before any other parsing. A model
// stuck repeating itself can send megabytes; this caps the work (and the
// regex backtracking) on it while leaving room for anything a slide shows.
const MAX_TEXT = 1000;
const MAX_LIST = 24;

const text = (v) => (v == null ? "" : String(v).slice(0, MAX_TEXT).trim());
const list = (v) =>
  Array.isArray(v) ? v.slice(0, MAX_LIST) : typeof v === "string" ? [v] : [];
const strings = (v) => list(v).map(text).filter(Boolean);
// "a | b | c" strings and objects are common small-model substitutes for arrays.
const cells = (row) =>
  (typeof row === "string"
    ? text(row).split(/\s*[|;\t]\s*/)
    : list(row && typeof row === "object" ? Object.values(row) : [])
  ).map((cell) => clip(text(cell), LIMITS.cell));

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

const squash = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%$€£.]/gu, "");
const withoutThousands = (str) =>
  String(str).replace(/(\d),(?=\d{3}\b)/g, "$1");

/**
 * What the model is allowed to cite: the numbers and the text of its
 * sources (outline, research, conversation lookups). With no sources every
 * figure is trusted, for callers that pass hand-written slides.
 * @param {string|undefined} sources
 */
function evidence(sources) {
  if (sources == null) return null;
  const plain = withoutThousands(sources);
  return {
    numbers: new Set((plain.match(/\d+(?:\.\d+)?/g) || []).map(Number)),
    words: squash(plain),
  };
}

/**
 * True when a figure's number appears in the sources. A one-digit number
 * matches too easily by chance, so it must appear together with its unit.
 */
function isBacked(value, proof) {
  if (!proof) return true;
  const plain = withoutThousands(value);
  const number = plain.match(/\d+(?:\.\d+)?/)?.[0];
  if (!number || !proof.numbers.has(Number(number))) return false;
  return (
    number.replace(".", "").length > 1 || proof.words.includes(squash(plain))
  );
}

// A number that states a quantity: a percentage, money, a multiplier, a
// number with a unit or magnitude, or any number of 100 or more except a
// year. "3 steps" and "Llama 3.1" are not claims; "under 100ms" is.
const QUANTITY =
  /(?:[$€£]\s?\d[\d,.]*|\d[\d,.]*\s?(?:%|x\b|k\b|m\b|b\b|ms\b|s\b|gb\b|mb\b|tb\b|percent|thousand|million|billion|trillion|hours?|minutes?|seconds?|days?|weeks?|months?|years?|times|users|customers|requests|languages|people|employees)|\b\d{3,}(?:[.,]\d+)?\b)/gi;
const isYear = (n) => Number.isInteger(n) && n >= 1900 && n <= 2099;

/**
 * True when text states a quantity the sources do not contain, which is how
 * small models invent statistics inside otherwise fine sentences.
 */
function inventsQuantity(str, proof) {
  if (!proof) return false;
  return (withoutThousands(str).match(QUANTITY) || []).some((quantity) => {
    const number = Number(quantity.match(/\d+(?:\.\d+)?/)[0]);
    return !isYear(number) && !proof.numbers.has(number);
  });
}

function normalizeItems(raw, proof) {
  return list(raw)
    .map((item) =>
      item && typeof item === "object"
        ? { title: text(item.title), text: text(item.text ?? item.description) }
        : { title: "", text: text(item) }
    )
    .map((item) => ({
      title: clip(item.title, LIMITS.itemTitle),
      text: clip(item.text, LIMITS.itemText),
    }))
    .filter((item) => item.title || item.text)
    .filter((item) => !inventsQuantity(`${item.title} ${item.text}`, proof))
    .slice(0, LIMITS.items);
}

// A figure is a number someone can check, not prose or "0"/"1" wordplay.
const isFigure = (value) =>
  /\d/.test(value) &&
  !/^[01]$/.test(value) &&
  value.length <= LIMITS.figureValue;

function normalizeFigures(raw, proof) {
  return list(raw)
    .filter((f) => f && typeof f === "object")
    .map((f) => ({
      value: text(f.value ?? f.title),
      label: clip(text(f.label ?? f.text), LIMITS.figureLabel),
    }))
    .filter((f) => isFigure(f.value) && isBacked(f.value, proof))
    .slice(0, LIMITS.figures);
}

function normalizeTable(raw, proof) {
  if (!raw || typeof raw !== "object") return null;
  const rows = list(raw.rows)
    .map(cells)
    .filter((row) => row.some(Boolean))
    .filter((row) => !inventsQuantity(row.join(" "), proof))
    .slice(0, LIMITS.tableRows);
  // A header row alone renders as an empty table.
  if (rows.length === 0) return null;
  const headers = cells(raw.headers);
  const cols = Math.min(
    LIMITS.tableCols,
    Math.max(headers.length, ...rows.map((r) => r.length))
  );
  const pad = (row) => Array.from({ length: cols }, (_, i) => row[i] || "");
  return { headers: headers.length ? pad(headers) : [], rows: rows.map(pad) };
}

function normalizeChart(raw, proof) {
  if (!raw || typeof raw !== "object") return null;
  const series = list(raw.series)[0];
  const categories = strings(raw.categories).map((c) =>
    clip(c, LIMITS.category)
  );
  // Each value stays paired with its category, so dropping one that is not
  // a number, or not in the sources, never shifts the rest onto the wrong
  // label.
  const points = list(series?.values ?? raw.values)
    .map((v, i) => ({
      value: typeof v === "string" && v.trim() ? Number(v) : v,
      category: categories[i] || `${i + 1}`,
    }))
    .filter(
      (p) =>
        typeof p.value === "number" &&
        Number.isFinite(p.value) &&
        (!proof || proof.numbers.has(p.value))
    )
    .slice(0, LIMITS.chartValues);
  const values = points.map((p) => p.value);
  // Fewer than three points or identical values are placeholders, not data.
  if (values.length < 3 || new Set(values).size < 2) return null;
  return {
    type: CHART_TYPES.includes(raw.type) ? raw.type : "bar",
    categories: points.map((p) => p.category),
    values,
  };
}

function normalizeQuote(raw, proof) {
  const quote =
    typeof raw === "string"
      ? { text: text(raw), by: "" }
      : raw && typeof raw === "object"
        ? { text: text(raw.text), by: text(raw.by ?? raw.author) }
        : null;
  if (!quote?.text) return null;
  const words = quote.text.replace(/^["“”']+|["“”']+$/g, "");
  // Quotes are only kept when the sources contain them word for word.
  if (proof && !proof.words.includes(squash(words))) return null;
  return {
    text: clip(words, LIMITS.quote),
    by: clip(quote.by.replace(/^[-–—\s]+/, ""), LIMITS.quoteBy),
  };
}

/**
 * Turns one slide of model output into a canonical slide without a layout,
 * or null when nothing in it can be shown. The layout the model asked for
 * is kept as `preferred` for assignLayouts.
 */
function normalizeSlide(s, fallbackTitle, proof) {
  const asked = text(s.layout);
  const slide = {
    preferred: Object.hasOwn(LAYOUTS, asked) ? asked : null,
    title: clip(text(s.title) || fallbackTitle, LIMITS.title),
    points: strings(s.points ?? s.bullets)
      .map((p) => clip(p, LIMITS.point))
      .filter((p) => !inventsQuantity(p, proof)),
    items: normalizeItems(s.items, proof),
    ordered: s.ordered === true || s.ordered === "true",
    figures: normalizeFigures(s.figures ?? s.stats, proof),
    chart: normalizeChart(s.chart, proof),
    table: normalizeTable(s.table, proof),
    quote: normalizeQuote(s.quote, proof),
    notes: text(s.notes),
  };
  // One item or one figure is too few for a layout of its own; it reads
  // as a point.
  if (slide.items.length === 1) {
    const [item] = slide.items;
    slide.points.unshift(
      clip([item.title, item.text].filter(Boolean).join(": "), LIMITS.point)
    );
    slide.items = [];
  }
  if (slide.figures.length === 1) {
    const [figure] = slide.figures;
    slide.points.unshift(
      clip(`${figure.value} ${figure.label}`.trim(), LIMITS.point)
    );
    slide.figures = [];
  }
  slide.points = slide.points.slice(0, LIMITS.points);
  const showable = Object.values(LAYOUTS).some((fits) => fits(slide));
  return showable ? slide : null;
}

/**
 * Turns whatever the model submitted for one section into canonical content
 * slides, without layouts. Accepts a JSON string, a {slides} wrapper, a
 * single slide or an array. Section dividers in the output are ignored;
 * the deck builder adds its own.
 * @param {*} raw - Model output for one section
 * @param {Object} [options]
 * @param {string} [options.fallbackTitle] - Title for untitled slides
 * @param {string} [options.sources] - Text figures, chart values and quotes must come from
 * @returns {Omit<Slide, "layout"|"subtitle">[]}
 */
function normalizeSlides(raw, { fallbackTitle = "", sources } = {}) {
  if (typeof raw === "string") raw = safeJsonParse(raw, null);
  if (raw && !Array.isArray(raw) && typeof raw === "object")
    raw = Array.isArray(raw.slides) ? raw.slides : [raw];
  const proof = evidence(sources);
  return list(raw)
    .filter((s) => s && typeof s === "object" && s.layout !== "section")
    .map((s) => normalizeSlide(s, fallbackTitle, proof))
    .filter(Boolean);
}

/**
 * The layouts that can show a slide, best first. Data has one natural
 * layout; lists of ideas can be shown several ways, which is where variety
 * comes from.
 */
function candidates(slide) {
  if (slide.chart) return ["chart"];
  if (slide.table) return ["table"];
  if (slide.figures.length) return ["stats"];
  if (slide.quote) return ["quote"];
  const ideas = slide.items.length;
  if (ideas === 2) return ["comparison", "split", "cards", "bullets"];
  if (ideas && slide.ordered) return ["steps", "cards", "bullets", "split"];
  if (ideas) return ["cards", "bullets", "split"];
  return ["bullets", "split"];
}

/**
 * True when a slide's content is a short list, which leaves room for a
 * picture beside it.
 * @param {Omit<Slide, "layout"|"subtitle">} slide
 */
function fitsImage(slide) {
  if (slide.chart || slide.table || slide.quote || slide.figures.length)
    return false;
  const entries = slide.items.length || slide.points.length;
  return entries > 0 && entries <= 5;
}

/**
 * Gives each slide a layout: the one the model asked for when the content
 * fits it and it is not the layout right before; otherwise the best
 * candidate that is not the layout right before, preferring layouts the
 * deck has used least. A slide code gave a picture always shows it: beside
 * its list ("image") or on its own ("image-feature"). `state` carries the
 * deck's history across sections.
 * @param {Omit<Slide, "layout"|"subtitle">[]} slides
 * @param {{used: Object<string, number>, previous: string|null}} state - Updated in place
 * @returns {Slide[]}
 */
function assignLayouts(slides, state) {
  return slides.map(({ preferred, ...slide }) => {
    if (slide.image) {
      const layout = fitsImage(slide) ? "image" : "image-feature";
      state.used[layout] = (state.used[layout] || 0) + 1;
      state.previous = layout;
      return { layout, subtitle: "", ...slide };
    }
    const honored =
      preferred && LAYOUTS[preferred](slide) && preferred !== state.previous;
    const options = candidates(slide).filter((l) => LAYOUTS[l](slide));
    const score = (layout) =>
      options.indexOf(layout) +
      3 * (state.used[layout] || 0) +
      (layout === state.previous ? 100 : 0);
    const layout = honored
      ? preferred
      : options.reduce((best, l) => (score(l) < score(best) ? l : best));
    state.used[layout] = (state.used[layout] || 0) + 1;
    state.previous = layout;
    return { layout, subtitle: "", ...slide };
  });
}

/**
 * A section divider slide.
 * @param {string} title
 * @param {string} [subtitle]
 * @returns {Slide}
 */
function sectionSlide(title, subtitle = "") {
  return {
    layout: "section",
    title: clip(text(title), LIMITS.title),
    subtitle: clip(text(subtitle), LIMITS.subtitle),
    points: [],
    items: [],
    ordered: false,
    figures: [],
    chart: null,
    table: null,
    quote: null,
    notes: "",
  };
}

/**
 * A slide that shows one picture under a title, before assignLayouts.
 * @param {string} title
 * @param {import("./images.js").InlineImage} picture
 * @returns {Omit<Slide, "layout"|"subtitle">}
 */
function pictureSlide(title, picture) {
  const {
    layout: _layout,
    subtitle: _subtitle,
    ...empty
  } = sectionSlide(title);
  return {
    ...empty,
    image: picture.image,
    fit: picture.fit,
    caption: clip(text(picture.caption), LIMITS.point),
    credit: text(picture.credit),
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

module.exports = {
  LAYOUTS,
  LIMITS,
  COVER_LIMITS,
  SLIDE_SCHEMA,
  normalizeSlides,
  assignLayouts,
  sectionSlide,
  normalizeCover,
  fitsImage,
  pictureSlide,
};
