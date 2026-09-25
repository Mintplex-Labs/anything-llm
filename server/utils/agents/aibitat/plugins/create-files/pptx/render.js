const PptxGenJS = require("pptxgenjs");
const createFilesLib = require("../lib.js");
const { onBackground, isDark } = require("./themes.js");

/**
 * Draws normalized slides (see slides.js) with a theme (see themes.js) into
 * a .pptx buffer. Nothing here reads model output directly and nothing
 * relies on PowerPoint autofit: every text box is sized up front by fitText
 * because "shrink text on overflow" is not applied until a box is edited.
 */

// All positioning assumes LAYOUT_16x9: 10 × 5.625 in.
const MARGIN_X = 0.6;
const CONTENT_W = 8.8; // 10 - 2 × MARGIN_X
const FOOTER_Y = 5.15;

// Average glyph width as a fraction of the font size. Titles are bold and may
// be serif (Georgia), body text is Calibri; both are on the safe side so text
// never overflows. Word wrapping wastes part of every line, hence WRAP_SLACK.
const GLYPH_W = { title: 0.62, body: 0.52 };
const LINE_H = 1.2;
const WRAP_SLACK = 0.85;

/**
 * Largest font size (pt) at which text fits a box, estimated from character
 * counts.
 * @param {string|string[]} text - One paragraph, or one string per paragraph
 * @param {{w: number, h: number, max: number, min?: number, lineGap?: number, maxLines?: number, font?: "title"|"body"}} box - Inches; sizes in pt; lineGap as a fraction of font size added after each paragraph
 * @returns {number}
 */
function fitText(
  text,
  { w, h, max, min = 9, lineGap = 0, maxLines = 99, font = "body" }
) {
  const paragraphs = Array.isArray(text) ? text : [text];
  for (let size = max; size > min; size -= 1) {
    const charsPerLine = Math.max(
      1,
      Math.floor(((w * 72) / (size * GLYPH_W[font])) * WRAP_SLACK)
    );
    const lines = paragraphs.reduce(
      (sum, p) => sum + Math.max(1, Math.ceil(String(p).length / charsPerLine)),
      0
    );
    const height = ((lines * LINE_H + paragraphs.length * lineGap) * size) / 72;
    if (lines <= maxLines && height <= h) return size;
  }
  return min;
}

/**
 * Text box in the theme's font and text color. `fit: { max, min? }` sizes the
 * text to the box; otherwise pass `fontSize`.
 */
function addText(slide, t, str, { font = "body", fit, ...opts }) {
  slide.addText(str, {
    fontFace: font === "title" ? t.fontTitle : t.fontBody,
    color: t.text,
    ...(fit && {
      fontSize: fitText(str, { w: opts.w, h: opts.h, font, ...fit }),
    }),
    ...opts,
  });
}

function addRect(
  slide,
  pptx,
  { shape = pptx.ShapeType.rect, color, transparency, ...box }
) {
  slide.addShape(shape, {
    fill: { color, transparency },
    line: { color, transparency: transparency ?? 0, width: 0 },
    ...box,
  });
}

/** Decorative translucent accent circles, used by the geometric style. */
function addCircles(slide, pptx, t, circles) {
  if (!t.shapes) return;
  circles.forEach(([x, y, size, transparency]) =>
    addRect(slide, pptx, {
      shape: pptx.ShapeType.ellipse,
      x,
      y,
      w: size,
      h: size,
      color: t.accent,
      transparency,
    })
  );
}

function addBullets(slide, t, bullets, { x, y, w, h, max = 20 }) {
  if (bullets.length === 0) return;
  const size = fitText(bullets, { w: w - 0.4, h, max, lineGap: 0.7 });
  slide.addText(
    bullets.map((text) => ({
      text,
      options: {
        fontSize: size,
        color: t.text,
        fontFace: t.fontBody,
        bullet: { code: "25AA", color: t.accent, indent: size * 1.2 },
        paraSpaceAfter: size * 0.7,
      },
    })),
    { x, y, w, h, valign: "top" }
  );
}

/**
 * Card background per the theme's `cards` knob. Returns the theme to draw
 * the card's contents with, so text always reads on the fill.
 */
function addCard(slide, pptx, t, cell, radius) {
  if (t.cards === "outline") {
    slide.addShape(pptx.ShapeType.rect, {
      ...cell,
      fill: { color: t.bg, transparency: 100 },
      line: { color: t.muted, transparency: 55, width: 0.75 },
    });
    return t;
  }
  const fill = t.cards === "dark" && !isDark(t.bg) ? t.dark : t.surface;
  addRect(slide, pptx, {
    shape: pptx.ShapeType.roundRect,
    rectRadius: radius,
    ...cell,
    color: fill,
  });
  return onBackground(t, fill);
}

/**
 * Splits `count` items into rows of equal-width cells inside a box.
 * @returns {{x: number, y: number, w: number, h: number}[]}
 */
function gridCells(count, { x, y, w, h, gap = 0.25 }) {
  const cols = count <= 3 ? count : Math.ceil(count / 2);
  const rows = Math.ceil(count / cols);
  const cellW = (w - gap * (cols - 1)) / cols;
  const cellH = (h - gap * (rows - 1)) / rows;
  return Array.from({ length: count }, (_, i) => ({
    x: x + (i % cols) * (cellW + gap),
    y: y + Math.floor(i / cols) * (cellH + gap),
    w: cellW,
    h: cellH,
  }));
}

/** Page number (when `page` is given) and the "Created with AnythingLLM" mark. */
function addFooter(slide, t, page) {
  if (page)
    addText(slide, t, `${page.n}  /  ${page.total}`, {
      x: MARGIN_X,
      y: FOOTER_Y,
      w: 1.2,
      h: 0.25,
      fontSize: 8,
      color: t.muted,
    });
  const logo = createFilesLib.getLogo({
    forDarkBackground: isDark(t.bg),
    format: "dataUri",
  });
  const brand = {
    x: 7.85,
    w: 1.85,
    color: t.text,
    transparency: 78,
    fontFace: "Calibri",
    align: "center",
  };
  slide.addText("Created with", {
    ...brand,
    y: 5.1,
    h: 0.12,
    fontSize: 5.5,
    italic: true,
  });
  if (logo)
    slide.addImage({
      data: logo,
      x: 8.025,
      y: 5.21,
      w: 1.5,
      h: 0.24,
      transparency: 78,
    });
  else
    slide.addText("AnythingLLM", { ...brand, y: 5.21, h: 0.24, fontSize: 8 });
}

/**
 * Title block for content slides: header band or accent bar, title, optional
 * subtitle.
 * @returns {number} y coordinate where slide content should start
 */
function addTitle(slide, pptx, t, { title, subtitle }) {
  const band = t.band ? onBackground(t, t.accent) : null;
  const filled = t.cards !== "outline";
  if (band)
    addRect(slide, pptx, {
      x: 0,
      y: 0,
      w: 10,
      h: subtitle ? 1.55 : 1.25,
      color: t.accent,
    });
  else if (filled)
    addRect(slide, pptx, {
      x: MARGIN_X,
      y: 0.5,
      w: 0.07,
      h: 0.5,
      color: t.accent,
    });
  else
    addRect(slide, pptx, {
      x: MARGIN_X,
      y: subtitle ? 1.5 : 1.2,
      w: CONTENT_W,
      h: 0.012,
      color: t.muted,
      transparency: 50,
    });
  const x = filled && !band ? MARGIN_X + 0.22 : MARGIN_X;
  const w = CONTENT_W - (x - MARGIN_X);
  addText(slide, band ?? t, title, {
    x,
    y: 0.38,
    w,
    h: 0.75,
    fit: { max: band ? 28 : 26 },
    font: "title",
    bold: true,
    valign: "middle",
  });
  if (!subtitle) return 1.4;
  addText(slide, band ?? t, subtitle, {
    x,
    y: 1.1,
    w,
    h: 0.35,
    fontSize: 13,
    color: band ? band.text : t.muted,
    transparency: band ? 30 : 0,
    valign: "top",
  });
  return 1.65;
}

function renderCover(slide, pptx, { title, subtitle, author }, t) {
  addCircles(slide, pptx, t, [
    [6.6, -1.6, 5.2, 82],
    [8.4, 2.4, 3.2, 72],
  ]);
  addRect(slide, pptx, {
    x: 0.8,
    y: 1.75,
    w: t.band ? 8.4 : 0.7,
    h: t.band ? 0.04 : 0.07,
    color: t.band ? t.text : t.accent,
  });
  addText(slide, t, title || "Untitled", {
    x: 0.8,
    y: 1.9,
    w: 8.4,
    h: 1.8,
    fit: { max: 44, min: 24 },
    font: "title",
    bold: true,
    valign: "top",
  });
  const line = [subtitle, author].filter(Boolean).join("  ·  ");
  if (line)
    addText(slide, t, line, {
      x: 0.8,
      y: 3.8,
      w: 8.4,
      h: 0.5,
      fontSize: 16,
      color: t.muted,
      valign: "top",
    });
}

function renderSection(slide, pptx, data, t, meta) {
  addCircles(slide, pptx, t, [[7.4, 3.0, 4.4, 84]]);
  addText(slide, t, String(meta.sectionIndex).padStart(2, "0"), {
    x: 0.8,
    y: 0.9,
    w: 4,
    h: 1.3,
    fontSize: 72,
    font: "title",
    bold: true,
    color: t.band ? t.text : t.accent,
    transparency: t.band ? 60 : 0,
    valign: "top",
  });
  addText(slide, t, data.title, {
    x: 0.8,
    y: 2.3,
    w: 8.4,
    h: 1.2,
    fit: { max: 36, min: 22 },
    font: "title",
    bold: true,
    valign: "top",
  });
  if (data.subtitle)
    addText(slide, t, data.subtitle, {
      x: 0.8,
      y: 3.55,
      w: 8.4,
      h: 0.8,
      fontSize: 16,
      color: t.muted,
      valign: "top",
    });
}

function renderBullets(slide, pptx, data, t) {
  const y = addTitle(slide, pptx, t, data);
  addBullets(slide, t, data.bullets, {
    x: MARGIN_X + 0.22,
    y: y + 0.1,
    w: CONTENT_W - 0.22,
    h: FOOTER_Y - y - 0.3,
  });
}

function renderTwoColumn(slide, pptx, data, t) {
  const y = addTitle(slide, pptx, t, data);
  const gap = 0.5;
  const colW = (CONTENT_W - gap) / 2;
  const h = FOOTER_Y - y - 0.3;
  addRect(slide, pptx, {
    x: MARGIN_X + colW + gap / 2,
    y: y + 0.15,
    w: 0.01,
    h: h - 0.2,
    color: t.muted,
    transparency: 60,
  });
  data.items.slice(0, 2).forEach((item, i) => {
    const x = MARGIN_X + i * (colW + gap);
    addText(slide, t, item.title, {
      x,
      y: y + 0.05,
      w: colW,
      h: 0.4,
      fontSize: 17,
      font: "title",
      bold: true,
      color: t.accent,
      valign: "middle",
    });
    const bullets = item.bullets.length ? item.bullets : [item.text];
    addBullets(slide, t, bullets, {
      x,
      y: y + 0.55,
      w: colW,
      h: h - 0.55,
      max: 18,
    });
  });
}

function renderStats(slide, pptx, data, t) {
  const y = addTitle(slide, pptx, t, data);
  const items = data.items.slice(0, 4);
  const cells = gridCells(items.length, {
    x: MARGIN_X,
    y: y + 0.3,
    w: CONTENT_W,
    h:
      items.length > 3 ? FOOTER_Y - y - 0.6 : Math.min(2.6, FOOTER_Y - y - 0.6),
  });
  // Every number shares one size so the row reads as a set.
  const innerW = cells[0].w - 0.5;
  const numberSize = Math.min(
    ...items.map((item) =>
      fitText(item.title, {
        w: innerW,
        h: 99,
        max: items.length > 3 ? 28 : 44,
        min: 16,
        maxLines: 1,
        font: "title",
      })
    )
  );
  const numberH = (numberSize * LINE_H) / 72;
  items.forEach((item, i) => {
    const c = cells[i];
    const card = addCard(slide, pptx, t, c, 0.08);
    addRect(slide, pptx, {
      x: c.x + 0.3,
      y: c.y + 0.25,
      w: 0.5,
      h: 0.05,
      color: t.accent,
    });
    addText(slide, card, item.title, {
      x: c.x + 0.25,
      y: c.y + 0.35,
      w: innerW,
      h: numberH,
      fontSize: numberSize,
      font: "title",
      bold: true,
      color: t.band ? card.text : t.accent,
      valign: "middle",
    });
    const labelY = c.y + 0.4 + numberH;
    addText(slide, card, item.text, {
      x: c.x + 0.25,
      y: labelY,
      w: innerW,
      h: c.h - (labelY - c.y) - 0.12,
      fit: { max: 14 },
      color: card.muted,
      valign: "top",
    });
  });
}

function renderCards(slide, pptx, data, t) {
  const y = addTitle(slide, pptx, t, data);
  const items = data.items.slice(0, 6);
  const twoRows = items.length > 3;
  const filled = t.cards !== "outline";
  const cells = gridCells(items.length, {
    x: MARGIN_X,
    y: y + 0.2,
    w: CONTENT_W,
    h: twoRows ? FOOTER_Y - y - 0.5 : Math.min(2.4, FOOTER_Y - y - 0.5),
  });
  items.forEach((item, i) => {
    const c = cells[i];
    const card = addCard(slide, pptx, t, c, 0.06);
    // Filled cards get a left accent stripe, outlined cards a top rule.
    addRect(slide, pptx, {
      x: c.x,
      y: c.y,
      w: filled ? 0.07 : c.w,
      h: filled ? c.h : 0.05,
      color: t.accent,
    });
    const innerW = c.w - 0.4;
    const titleH = twoRows ? 0.4 : 0.55;
    addText(slide, card, item.title, {
      x: c.x + 0.25,
      y: c.y + 0.15,
      w: innerW,
      h: titleH,
      fit: { max: twoRows ? 14 : 16 },
      font: "title",
      bold: true,
      valign: "middle",
    });
    const textY = c.y + 0.2 + titleH;
    addText(slide, card, item.text, {
      x: c.x + 0.25,
      y: textY,
      w: innerW,
      h: c.h - (textY - c.y) - 0.15,
      fit: { max: twoRows ? 12 : 14 },
      color: card.muted,
      valign: "top",
    });
  });
}

function renderSteps(slide, pptx, data, t) {
  const y = addTitle(slide, pptx, t, data);
  const items = data.items.slice(0, 5);
  const n = items.length;
  const colW = CONTENT_W / n;
  const circle = 0.55;
  const circleY = y + 0.35;
  addRect(slide, pptx, {
    x: MARGIN_X + colW / 2,
    y: circleY + circle / 2 - 0.015,
    w: CONTENT_W - colW,
    h: 0.03,
    color: t.muted,
    transparency: 60,
  });
  const plain = t.marker === "number";
  items.forEach((item, i) => {
    const x = MARGIN_X + i * colW;
    const markerBox = {
      x: x + colW / 2 - circle / 2,
      y: circleY,
      w: circle,
      h: circle,
    };
    if (!plain)
      addRect(slide, pptx, {
        shape:
          t.marker === "square" ? pptx.ShapeType.rect : pptx.ShapeType.ellipse,
        ...markerBox,
        color: t.accent,
      });
    addText(slide, t, String(i + 1), {
      ...markerBox,
      fontSize: plain ? 26 : 16,
      font: "title",
      bold: true,
      color: plain ? t.accent : "FFFFFF",
      align: "center",
      valign: "middle",
    });
    const innerW = colW - 0.2;
    const titleY = circleY + circle + 0.2;
    const titleH = 0.65;
    const textY = titleY + titleH + 0.05;
    addText(slide, t, item.title, {
      x: x + 0.1,
      y: titleY,
      w: innerW,
      h: titleH,
      fit: { max: n > 3 ? 13 : 15 },
      font: "title",
      bold: true,
      align: "center",
      valign: "top",
    });
    addText(slide, t, item.text, {
      x: x + 0.1,
      y: textY,
      w: innerW,
      h: FOOTER_Y - textY - 0.2,
      fit: { max: n > 3 ? 12 : 13 },
      color: t.muted,
      align: "center",
      valign: "top",
    });
  });
}

function renderChart(slide, pptx, data, t) {
  const y = addTitle(slide, pptx, t, data);
  const { type, categories, values } = data.chart;
  const isRound = type === "pie" || type === "doughnut";
  const hasBullets = data.bullets.length > 0;
  const chartW = hasBullets ? 5.4 : CONTENT_W;
  const h = FOOTER_Y - y - 0.35;

  slide.addChart(
    pptx.ChartType[type],
    [{ name: data.title, labels: categories, values }],
    {
      x: MARGIN_X,
      y: y + 0.1,
      w: chartW,
      h,
      chartColors: [t.accent, t.accent2, t.text, t.muted, "9CA3AF", "D1D5DB"],
      showValue: type === "bar",
      showPercent: isRound,
      showLegend: isRound,
      legendPos: isRound ? "r" : "b",
      legendColor: t.muted,
      legendFontSize: 11,
      dataLabelColor: t.muted,
      dataLabelFontSize: 10,
      dataLabelPosition: "outEnd",
      dataLabelFormatCode: isRound ? "0%" : "General",
      valAxisLabelFormatCode: "General",
      catAxisLabelColor: t.muted,
      valAxisLabelColor: t.muted,
      catAxisLabelFontSize: 11,
      valAxisLabelFontSize: 10,
      catAxisLineShow: false,
      valAxisLineShow: false,
      valGridLine: { color: t.surface, style: "solid", size: 0.5 },
      catGridLine: { style: "none" },
      barGapWidthPct: 60,
      lineSize: 2.5,
      lineDataSymbolSize: 7,
      holeSize: 55,
      chartArea: { fill: { color: t.bg } },
      plotArea: { fill: { color: t.bg } },
    }
  );

  if (hasBullets)
    addBullets(slide, t, data.bullets, {
      x: MARGIN_X + chartW + 0.4,
      y: y + 0.2,
      w: CONTENT_W - chartW - 0.4,
      h: h - 0.2,
      max: 14,
    });
}

function renderTable(slide, pptx, data, t) {
  const y = addTitle(slide, pptx, t, data);
  const { headers, rows: body } = data.table;
  const colCount = headers.length || body[0].length;
  const headerFill = isDark(t.bg) ? t.accent : t.dark;
  const rowBorder = [
    { type: "none" },
    { type: "none" },
    { type: "solid", pt: 0.5, color: t.surface },
    { type: "none" },
  ];
  const cell = (text, options) => ({
    text,
    options: {
      fontFace: t.fontBody,
      valign: "middle",
      margin: [4, 8, 4, 8],
      ...options,
    },
  });
  const rows = [];
  if (headers.length)
    rows.push(
      headers.map((h) =>
        cell(h, {
          bold: true,
          fontSize: 12,
          color: onBackground(t, headerFill).text,
          fill: { color: headerFill },
          border: { type: "none" },
        })
      )
    );
  body.forEach((row, i) =>
    rows.push(
      row.map((value) =>
        cell(value, {
          fontSize: body.length > 5 || colCount > 4 ? 10 : 12,
          color: t.text,
          fill: { color: i % 2 === 1 ? t.surface : t.bg },
          border: rowBorder,
        })
      )
    )
  );
  slide.addTable(rows, {
    x: MARGIN_X,
    y: y + 0.15,
    w: CONTENT_W,
    colW: CONTENT_W / colCount,
    rowH: Math.min(0.5, (FOOTER_Y - y - 0.5) / rows.length),
    autoPage: false,
  });
}

function renderQuote(slide, pptx, data, t) {
  addText(slide, t, "“", {
    x: 0.6,
    y: 0.3,
    w: 1.5,
    h: 1.5,
    fontSize: 120,
    bold: true,
    color: t.band ? t.text : t.accent,
    transparency: t.band ? 50 : 0,
    fontFace: "Georgia",
    valign: "top",
  });
  addText(slide, t, data.title, {
    x: 1.2,
    y: 1.5,
    w: 7.6,
    h: 2.2,
    fit: { max: 26, min: 16 },
    font: "title",
    italic: true,
    valign: "middle",
  });
  if (data.subtitle)
    addText(slide, t, `—  ${data.subtitle}`, {
      x: 1.2,
      y: 3.85,
      w: 7.6,
      h: 0.5,
      fontSize: 14,
      color: t.muted,
      valign: "top",
    });
}

const RENDERERS = {
  section: renderSection,
  bullets: renderBullets,
  "two-column": renderTwoColumn,
  stats: renderStats,
  cards: renderCards,
  steps: renderSteps,
  chart: renderChart,
  table: renderTable,
  quote: renderQuote,
};

// Which background each slide gets. Cover, dividers and quotes sit on the
// style's canvas; the first content slide of every section and every stats
// slide sit on the dark canvas so a deck alternates instead of reading as
// one template.
function backgroundFor(theme, slides, i) {
  const { layout } = slides[i];
  if (layout === "section" || layout === "quote") return theme.canvas;
  if (layout === "stats" || slides[i - 1]?.layout === "section")
    return theme.dark;
  return theme.bg;
}

/**
 * Renders a whole deck to a .pptx buffer.
 * @param {{title: string, subtitle?: string, author?: string, slides: import("./slides.js").Slide[]}} deck
 * @param {object} theme - From getTheme
 * @returns {Promise<Buffer>}
 */
async function renderDeck(
  { title, subtitle = "", author = "", slides },
  theme
) {
  const pptx = new PptxGenJS();
  pptx.title = title;
  pptx.company = "AnythingLLM";
  if (author) pptx.author = author;

  const cover = pptx.addSlide();
  const coverTheme = onBackground(theme, theme.canvas);
  cover.background = { color: coverTheme.bg };
  renderCover(cover, pptx, { title, subtitle, author }, coverTheme);
  addFooter(cover, coverTheme);

  let sectionIndex = 0;
  slides.forEach((data, i) => {
    if (data.layout === "section") sectionIndex++;
    const slide = pptx.addSlide();
    const t = onBackground(theme, backgroundFor(theme, slides, i));
    slide.background = { color: t.bg };
    RENDERERS[data.layout](slide, pptx, data, t, { sectionIndex });
    addFooter(slide, t, { n: i + 1, total: slides.length });
    if (data.notes) slide.addNotes(data.notes);
  });

  return pptx.write({ outputType: "nodebuffer" });
}

module.exports = { renderDeck };
