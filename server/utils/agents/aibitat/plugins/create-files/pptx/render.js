const PptxGenJS = require("pptxgenjs");
const createFilesLib = require("../lib.js");

/**
 * Draws normalized slides (see slides.js) with a theme (see themes.js) into
 * a .pptx buffer. Nothing here reads model output directly and nothing
 * relies on PowerPoint autofit: every text box is sized up front by fitText
 * because "shrink text on overflow" is not applied until a box is edited.
 *
 * Every position and font size is written in pixels of the 1920 × 1080 Figma
 * frames the layouts were designed in, so numbers can be checked against the
 * design directly. LAYOUT_WIDE is 13.333 × 7.5 in, so 144 px is one inch and
 * a 2 px font is one point.
 */

const PX_PER_IN = 144;
const FONT = "Plus Jakarta Sans";
const SLIDE_W = 1920;
const SLIDE_H = 1080;

// Average glyph width as a fraction of the font size, on the safe side for
// Plus Jakarta Sans so text never overflows. Word wrapping wastes part of
// every line, hence WRAP_SLACK.
const GLYPH_W = { regular: 0.55, bold: 0.6, caps: 0.72 };
const LINE_H = 1.2;
const WRAP_SLACK = 0.85;

const inches = (px) => px / PX_PER_IN;
const points = (px) => px / 2;

/**
 * Lines a set of paragraphs wraps to at a font size.
 * @param {string[]} paragraphs
 * @param {number} size - Font size in px
 * @param {number} w - Box width in px
 * @param {"regular"|"bold"|"caps"} glyph
 * @returns {number}
 */
function lineCount(paragraphs, size, w, glyph) {
  const charsPerLine = Math.max(
    1,
    Math.floor((w / (size * GLYPH_W[glyph])) * WRAP_SLACK)
  );
  return paragraphs.reduce(
    (sum, p) => sum + Math.max(1, Math.ceil(String(p).length / charsPerLine)),
    0
  );
}

/**
 * Height in px a set of paragraphs takes at a font size.
 * @param {string|string[]} text - One paragraph, or one string per paragraph
 * @param {number} size - Font size in px
 * @param {{w: number, lineGap?: number, glyph?: "regular"|"bold"|"caps"}} box - lineGap as a fraction of font size added after each paragraph
 * @returns {number}
 */
function textHeight(text, size, { w, lineGap = 0, glyph = "regular" }) {
  const paragraphs = Array.isArray(text) ? text : [text];
  const lines = lineCount(paragraphs, size, w, glyph);
  return (lines * LINE_H + paragraphs.length * lineGap) * size;
}

/**
 * Largest font size (px) at which text fits a box, estimated from character
 * counts.
 * @param {string|string[]} text - One paragraph, or one string per paragraph
 * @param {{w: number, h: number, max: number, min?: number, lineGap?: number, maxLines?: number, glyph?: "regular"|"bold"|"caps"}} box - All in px
 * @returns {number}
 */
function fitText(
  text,
  { w, h, max, min = 12, lineGap = 0, maxLines = 99, glyph = "regular" }
) {
  const paragraphs = Array.isArray(text) ? text : [text];
  for (let size = max; size > min; size -= 2) {
    const lines = lineCount(paragraphs, size, w, glyph);
    const height = textHeight(paragraphs, size, { w, lineGap, glyph });
    if (lines <= maxLines && height <= h) return size;
  }
  return min;
}

/**
 * One font size that fits every text in a box, so a row of items reads as a
 * set.
 * @param {string[]} texts
 * @param {object} box - Same as fitText
 * @returns {number}
 */
function sharedSize(texts, box) {
  return Math.min(...texts.map((text) => fitText(text, box)));
}

/**
 * Text box positioned and sized in px. Pass `size` for a fixed font size or
 * `fit: { max, min?, maxLines? }` to size the text to the box.
 */
function addText(
  slide,
  str,
  { x, y, w, h, size, fit, bold = false, caps = false, spacing, color, ...opts }
) {
  const glyph = caps ? "caps" : bold ? "bold" : "regular";
  const fontSize = fit ? fitText(str, { w, h, glyph, ...fit }) : size;
  slide.addText(caps ? String(str).toUpperCase() : str, {
    x: inches(x),
    y: inches(y),
    w: inches(w),
    h: inches(h),
    margin: 0,
    fontFace: FONT,
    fontSize: points(fontSize),
    bold,
    color,
    ...(spacing && { charSpacing: points(spacing) }),
    valign: "top",
    ...opts,
  });
}

/** Filled rectangle in px; `radius` rounds the corners. */
function addRect(slide, pptx, { x, y, w, h, color, radius, line }) {
  slide.addShape(radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, {
    x: inches(x),
    y: inches(y),
    w: inches(w),
    h: inches(h),
    ...(radius && { rectRadius: inches(radius) }),
    fill: color ? { color } : { type: "none" },
    line: line ?? { type: "none" },
  });
}

/** Bulleted paragraphs in one text box. */
function addBullets(slide, bullets, { size, color, ...box }) {
  if (bullets.length === 0) return;
  slide.addText(
    bullets.map((text) => ({
      text,
      options: {
        bullet: { indent: points(size * 1.5) },
        paraSpaceAfter: points(size * 0.5),
      },
    })),
    {
      x: inches(box.x),
      y: inches(box.y),
      w: inches(box.w),
      h: inches(box.h),
      margin: 0,
      fontFace: FONT,
      fontSize: points(size),
      color,
      valign: box.valign ?? "top",
    }
  );
}

/** Bullet font size that fits a box, with room for the bullet indent. */
function bulletSize(bullets, { w, h, max, min = 14 }) {
  return fitText(bullets, { w: w - max * 1.5, h, max, min, lineGap: 0.5 });
}

/** The small rule and caption in the top-left corner of the design. */
function addLabel(slide, pptx, label, color, x = 76) {
  if (!label) return;
  const text = label.length > 60 ? `${label.slice(0, 59).trim()}…` : label;
  const w = Math.max(124, text.length * 16 * 0.6);
  addRect(slide, pptx, { x, y: 71, w, h: 1, color });
  addText(slide, text, {
    x,
    y: 80,
    w: w + 40,
    h: 24,
    size: 16,
    bold: true,
    color,
  });
}

/** The "Created with AnythingLLM" mark in the bottom-right corner. */
function addBrand(slide, dark) {
  const logo = createFilesLib.getLogo({
    forDarkBackground: dark,
    format: "dataUri",
  });
  const brand = {
    x: 1690,
    w: 186,
    color: dark ? "FFFFFF" : "000000",
    transparency: 78,
    align: "center",
  };
  addText(slide, "Created with", {
    ...brand,
    y: 1012,
    h: 16,
    size: 12,
    italic: true,
  });
  if (logo)
    slide.addImage({
      data: logo,
      x: inches(1690),
      y: inches(1030),
      w: inches(186),
      h: inches(30),
      transparency: 78,
    });
  else addText(slide, "AnythingLLM", { ...brand, y: 1030, h: 30, size: 16 });
}

/** Big title block shared by the cover and section dividers. */
function renderTitleSlide(slide, pptx, t, { title, subtitle, number, label }) {
  const color = t.scale[50];
  addLabel(slide, pptx, label, color);
  if (number)
    addText(slide, String(number).padStart(2, "0"), {
      x: 1653,
      y: 71,
      w: 200,
      h: 110,
      size: 100,
      bold: true,
      color,
      align: "right",
    });
  addText(slide, title || "Untitled", {
    x: 76,
    y: 200,
    w: 1768,
    h: 647,
    fit: { max: 250, min: 80, maxLines: 3 },
    bold: true,
    color,
    valign: "bottom",
  });
  if (subtitle)
    addText(slide, subtitle, {
      x: 76,
      y: 877,
      w: 1500,
      h: 120,
      fit: { max: 54, min: 28, maxLines: 2 },
      color,
    });
}

function renderSection(slide, pptx, data, t, meta) {
  renderTitleSlide(slide, pptx, t, {
    ...data,
    number: meta.sectionIndex,
    label: meta.label,
  });
}

function renderBullets(slide, pptx, data, t, meta) {
  const color = t.scale[900];
  addLabel(slide, pptx, meta.label, color);
  const x = 764;
  const w = 1080;
  const titleSize = fitText(data.title, {
    w,
    h: 260,
    max: 100,
    min: 56,
    maxLines: 2,
    glyph: "bold",
  });
  const titleH = textHeight(data.title, titleSize, { w, glyph: "bold" });
  // The block sits low on the right like the design, growing upward.
  const bottom = 960;
  const size = bulletSize(data.bullets, {
    w,
    h: bottom - 150 - titleH - 50,
    max: 32,
    min: 18,
  });
  const bulletsH = Math.min(
    bottom - 150 - titleH - 50,
    textHeight(data.bullets, size, { w: w - size * 1.5, lineGap: 0.5 })
  );
  const bulletsY = bottom - bulletsH;
  addText(slide, data.title, {
    x,
    y: bulletsY - 50 - titleH,
    w,
    h: titleH,
    size: titleSize,
    bold: true,
    color,
    valign: "bottom",
  });
  addBullets(slide, data.bullets, {
    x,
    y: bulletsY,
    w,
    h: bulletsH + size,
    size,
    color,
  });
}

function renderTwoColumn(slide, pptx, data, t, meta) {
  addRect(slide, pptx, {
    x: 0,
    y: 0,
    w: SLIDE_W / 2,
    h: SLIDE_H,
    color: t.scale[600],
  });
  addLabel(slide, pptx, meta.label, "FFFFFF");
  const columns = data.items.slice(0, 2);
  const w = 640;
  // One size for both columns so the halves read as a pair.
  const headingSize = sharedSize(
    columns.map((item) => item.title),
    { w, h: 90, max: 32, min: 22, glyph: "caps" }
  );
  const lists = columns.map((item) =>
    item.bullets.length ? item.bullets : [item.text].filter(Boolean)
  );
  const size = Math.min(
    ...lists.map((list) =>
      bulletSize(list, { w, h: 700 - headingSize * 2.4 - 50, max: 28 })
    )
  );
  // Both columns share one top so their headings and lists line up.
  const headingH = Math.max(
    ...columns.map((item) =>
      textHeight(item.title, headingSize, { w, glyph: "caps" })
    )
  );
  const listH = Math.max(
    ...lists.map((list) =>
      textHeight(list, size, { w: w - size * 1.5, lineGap: 0.5 })
    )
  );
  const top = (SLIDE_H - (headingH + 50 + listH)) / 2;
  columns.forEach((item, i) => {
    const x = i * (SLIDE_W / 2) + 160;
    const color = i === 0 ? "FFFFFF" : t.scale[800];
    addText(slide, item.title, {
      x,
      y: top,
      w,
      h: headingH,
      size: headingSize,
      bold: true,
      caps: true,
      color,
      align: "center",
      valign: "bottom",
    });
    addBullets(slide, lists[i], {
      x,
      y: top + headingH + 50,
      w,
      h: listH + size,
      size,
      color,
    });
  });
}

/** Up to three stats as outlined cards beside the title, the "Stats" frame with a title. */
function renderStatsList(slide, pptx, data, t, meta) {
  addLabel(slide, pptx, meta.label, t.dark, 111);
  const ink = t.scale[950];
  addText(slide, data.title, {
    x: 111,
    y: 230,
    w: 880,
    h: 540,
    fit: { max: 100, min: 48, maxLines: 4 },
    color: ink,
  });
  const body = data.subtitle || data.bullets.join(" ");
  if (body)
    addText(slide, body, {
      x: 111,
      y: 800,
      w: 880,
      h: 200,
      fit: { max: 24, min: 16 },
      color: ink,
    });

  const items = data.items;
  const cardH = Math.min(220, (700 - 20 * (items.length - 1)) / items.length);
  const stackH = items.length * cardH + (items.length - 1) * 20;
  const top = 580 - stackH / 2;
  const numberW = 400;
  const numberSize = sharedSize(
    items.map((item) => item.title),
    { w: numberW, h: cardH, max: 100, min: 40, maxLines: 1, glyph: "bold" }
  );
  items.forEach((item, i) => {
    const y = top + i * (cardH + 20);
    addRect(slide, pptx, {
      x: 1088,
      y,
      w: 700,
      h: cardH,
      radius: 20,
      line: { color: t.scale[500], width: 1 },
    });
    addText(slide, item.title, {
      x: 1148,
      y,
      w: numberW,
      h: cardH,
      size: numberSize,
      bold: true,
      color: t.dark,
      valign: "middle",
    });
    addText(slide, item.text, {
      x: 1148 + numberW + 20,
      y: y + 16,
      w: 700 - 60 - numberW - 20 - 40,
      h: cardH - 32,
      fit: { max: 24, min: 13 },
      color: t.scale[600],
      valign: "middle",
    });
  });
}

/** Four to six stats in two rows split by a rule, the other "Stats" frame. */
function renderStatsGrid(slide, pptx, data, t, meta) {
  addLabel(slide, pptx, meta.label, t.dark);
  addText(slide, data.title, {
    x: 135,
    y: 140,
    w: 1650,
    h: 100,
    fit: { max: 64, min: 36, maxLines: 1 },
    bold: true,
    color: t.scale[900],
  });
  const items = data.items.slice(0, 6);
  const cols = Math.ceil(items.length / 2);
  const colW = 1650 / cols;
  const numberSize = sharedSize(
    items.map((item) => item.title),
    { w: colW - 60, h: 120, max: 80, min: 40, maxLines: 1, glyph: "bold" }
  );
  const labelSize = sharedSize(
    items.map((item) => item.text),
    { w: colW - 60, h: 56, max: 16, min: 12, maxLines: 2, glyph: "caps" }
  );
  const rowTops = [330, 640];
  addRect(slide, pptx, {
    x: 135,
    y: 590,
    w: 1650,
    h: 1,
    color: t.scale[300],
  });
  items.forEach((item, i) => {
    const x = 135 + (i % cols) * colW;
    const y = rowTops[Math.floor(i / cols)];
    addText(slide, item.title, {
      x,
      y,
      w: colW - 60,
      h: numberSize * LINE_H,
      size: numberSize,
      bold: true,
      color: t.dark,
    });
    addText(slide, item.text, {
      x,
      y: y + numberSize * LINE_H + 24,
      w: colW - 60,
      h: 60,
      size: labelSize,
      caps: true,
      spacing: labelSize / 10,
      color: t.scale[600],
    });
  });
}

function renderStats(slide, pptx, data, t, meta) {
  if (data.items.length <= 3)
    return renderStatsList(slide, pptx, data, t, meta);
  return renderStatsGrid(slide, pptx, data, t, meta);
}

function renderCards(slide, pptx, data, t) {
  const light = t.scale[50];
  addText(slide, data.title, {
    x: 114,
    y: 114,
    w: 860,
    h: 380,
    fit: { max: 100, min: 48, maxLines: 3 },
    bold: true,
    color: light,
  });
  if (data.subtitle)
    addText(slide, data.subtitle, {
      x: 1027,
      y: 114,
      w: 780,
      h: 380,
      fit: { max: 28, min: 18 },
      color: light,
    });
  const items = data.items.slice(0, 6);
  const cols = items.length <= 3 ? items.length : Math.ceil(items.length / 2);
  const rows = Math.ceil(items.length / cols);
  const gap = 30;
  const cardW = (1766 - gap * (cols - 1)) / cols;
  // Cards keep the design's height and sit on the bottom edge; a single
  // row gets a little more room for longer captions.
  const cardH = rows === 1 ? 280 : 218;
  const top = 993 - (rows * cardH + gap * (rows - 1));
  const innerW = cardW - 64;
  const titleSize = sharedSize(
    items.map((item) => item.title),
    { w: innerW, h: 90, max: 36, min: 20, maxLines: 2, glyph: "caps" }
  );
  const titleH = Math.max(
    ...items.map((item) =>
      textHeight(item.title, titleSize, { w: innerW, glyph: "caps" })
    )
  );
  const textH = cardH - 64 - titleH - 16;
  const textSize = sharedSize(
    items.map((item) => item.text),
    { w: innerW, h: textH, max: 24, min: 12 }
  );
  items.forEach((item, i) => {
    const x = 87 + (i % cols) * (cardW + gap);
    const y = top + Math.floor(i / cols) * (cardH + gap);
    addRect(slide, pptx, {
      x,
      y,
      w: cardW,
      h: cardH,
      color: light,
      radius: 16,
    });
    addText(slide, item.title, {
      x: x + 32,
      y: y + 32,
      w: innerW,
      h: titleH,
      size: titleSize,
      bold: true,
      caps: true,
      color: t.scale[900],
    });
    addText(slide, item.text, {
      x: x + 32,
      y: y + 32 + titleH + 16,
      w: innerW,
      h: textH,
      size: textSize,
      color: t.scale[600],
      valign: "bottom",
    });
  });
}

/** Numbered badges on a horizontal line, the first "Steps" frame. */
function renderStepsTimeline(slide, pptx, data, t) {
  const ink = t.scale[950];
  addText(slide, data.title, {
    x: 160,
    y: 100,
    w: 1600,
    h: 110,
    fit: { max: 36, min: 24, maxLines: 2 },
    bold: true,
    caps: true,
    color: ink,
    align: "center",
  });
  const items = data.items.slice(0, 6);
  const gap = 40;
  const colW = Math.min(440, (1760 - gap * (items.length - 1)) / items.length);
  const startX =
    (SLIDE_W - (items.length * colW + gap * (items.length - 1))) / 2;
  const centerOf = (i) => startX + i * (colW + gap) + colW / 2;
  const badge = 50;
  const badgeY = 527;
  if (items.length > 1)
    addRect(slide, pptx, {
      x: centerOf(0),
      y: badgeY + badge / 2 - 1,
      w: centerOf(items.length - 1) - centerOf(0),
      h: 2,
      color: t.scale[200],
    });
  const titleSize = sharedSize(
    items.map((item) => item.title),
    { w: colW, h: 160, max: 24, min: 16, maxLines: 3, glyph: "caps" }
  );
  const textSize = sharedSize(
    items.map((item) => item.text),
    { w: colW, h: 340, max: 24, min: 13 }
  );
  items.forEach((item, i) => {
    const x = centerOf(i) - colW / 2;
    addText(slide, item.title, {
      x,
      y: 330,
      w: colW,
      h: 170,
      size: titleSize,
      bold: true,
      caps: true,
      color: ink,
      align: "center",
      valign: "bottom",
    });
    addRect(slide, pptx, {
      x: centerOf(i) - badge / 2,
      y: badgeY,
      w: badge,
      h: badge,
      radius: 12,
      color: t.dark,
    });
    addText(slide, String(i + 1), {
      x: centerOf(i) - badge / 2,
      y: badgeY,
      w: badge,
      h: badge,
      size: 28,
      color: "FFFFFF",
      align: "center",
      valign: "middle",
    });
    addText(slide, item.text, {
      x,
      y: 634,
      w: colW,
      h: 360,
      size: textSize,
      color: t.scale[800],
      align: "center",
    });
  });
}

/** A color panel beside a numbered list, the second "Steps" frame. */
function renderStepsList(slide, pptx, data, t) {
  addRect(slide, pptx, { x: 0, y: 0, w: 750, h: SLIDE_H, color: t.dark });
  const ink = t.scale[950];
  const x = 860;
  const w = 960;
  const titleSize = fitText(data.title, {
    w,
    h: 250,
    max: 100,
    min: 48,
    maxLines: 2,
    glyph: "bold",
  });
  const titleH = textHeight(data.title, titleSize, { w, glyph: "bold" });
  addText(slide, data.title, {
    x,
    y: 114,
    w,
    h: titleH,
    size: titleSize,
    bold: true,
    color: ink,
  });
  const items = data.items.slice(0, 6);
  const top = 114 + titleH + 70;
  const pitch = Math.min(150, (1000 - top) / items.length);
  const circle = 67;
  const textX = x + circle + 60;
  const textW = 1820 - textX;
  const lines = items.map((item) =>
    [item.title, item.text].filter(Boolean).join(": ")
  );
  const size = sharedSize(lines, {
    w: textW,
    h: pitch - 12,
    max: 24,
    min: 13,
    maxLines: 3,
  });
  items.forEach((item, i) => {
    const y = top + i * pitch;
    addRect(slide, pptx, {
      x,
      y: y + (pitch - circle) / 2 - 6,
      w: circle,
      h: circle,
      radius: circle / 2,
      color: t.scale[200],
    });
    addText(slide, String(i + 1), {
      x,
      y: y + (pitch - circle) / 2 - 6,
      w: circle,
      h: circle,
      size: 36,
      color: ink,
      align: "center",
      valign: "middle",
    });
    const runs = [
      item.title && {
        text: item.text ? `${item.title}: ` : item.title,
        options: { bold: true, color: ink },
      },
      item.text && { text: item.text, options: { color: t.scale[800] } },
    ].filter(Boolean);
    slide.addText(runs, {
      x: inches(textX),
      y: inches(y - 6),
      w: inches(textW),
      h: inches(pitch - 12),
      margin: 0,
      fontFace: FONT,
      fontSize: points(size),
      valign: "middle",
    });
  });
}

function renderSteps(slide, pptx, data, t, meta) {
  if (meta.variant === 0) return renderStepsTimeline(slide, pptx, data, t);
  return renderStepsList(slide, pptx, data, t);
}

function renderChart(slide, pptx, data, t) {
  const ink = t.scale[900];
  addText(slide, data.title, {
    x: 123,
    y: 114,
    w: 1674,
    h: 100,
    fit: { max: 64, min: 36, maxLines: 1 },
    bold: true,
    color: ink,
  });
  const { type, categories, values } = data.chart;
  const isRound = type === "pie" || type === "doughnut";
  const hasBullets = data.bullets.length > 0;
  const chart = { x: 100, y: 270, w: hasBullets ? 1130 : 1720, h: 730 };
  // Darkest first, so a bar chart steps down the scale like the design.
  const shades = [900, 800, 700, 600, 500, 400, 300].map((s) => t.scale[s]);
  const axisLabel = (size) => ({
    color: ink,
    fontFace: FONT,
    fontSize: points(size),
  });
  const val = axisLabel(24);
  const cat = axisLabel(22);

  slide.addChart(
    pptx.ChartType[type],
    [{ name: data.title, labels: categories, values }],
    {
      x: inches(chart.x),
      y: inches(chart.y),
      w: inches(chart.w),
      h: inches(chart.h),
      chartColors: type === "line" || type === "area" ? [t.dark] : shades,
      showValue: false,
      showPercent: isRound,
      showLegend: isRound,
      legendPos: "r",
      legendColor: ink,
      legendFontFace: FONT,
      legendFontSize: points(22),
      dataLabelColor: "FFFFFF",
      dataLabelFontFace: FONT,
      dataLabelFontSize: points(22),
      dataLabelFontBold: true,
      dataLabelFormatCode: "0%",
      valAxisLabelFormatCode: "General",
      valAxisLabelColor: val.color,
      valAxisLabelFontFace: val.fontFace,
      valAxisLabelFontSize: val.fontSize,
      valAxisLabelFontBold: true,
      catAxisLabelColor: cat.color,
      catAxisLabelFontFace: cat.fontFace,
      catAxisLabelFontSize: cat.fontSize,
      catAxisLineShow: false,
      valAxisLineShow: false,
      valGridLine: { color: t.scale[200], style: "solid", size: 1 },
      catGridLine: { style: "none" },
      barGapWidthPct: 12,
      lineSize: 3,
      lineDataSymbolSize: 8,
      holeSize: 55,
      chartArea: { fill: { color: t.light } },
      plotArea: { fill: { color: t.light } },
    }
  );

  if (hasBullets) {
    const box = { x: 1291, y: 270, w: 530, h: 730 };
    const size = bulletSize(data.bullets, { ...box, max: 24 });
    addBullets(slide, data.bullets, {
      ...box,
      size,
      color: ink,
      valign: "bottom",
    });
  }
}

function renderTable(slide, pptx, data, t) {
  addText(slide, data.title, {
    x: 160,
    y: 114,
    w: 1600,
    h: 100,
    fit: { max: 64, min: 36, maxLines: 1 },
    bold: true,
    color: t.scale[900],
  });
  const { headers, rows: body } = data.table;
  const rows = headers.length ? [headers, ...body] : body;
  const cols = rows[0].length;
  const top = 277;
  const gap = rows.length > 6 ? 12 : 20;
  const rowH = Math.min(
    80,
    (1010 - top - gap * (rows.length - 1)) / rows.length
  );
  const pad = 24;
  const cellW = (1600 - pad * 2 - 20 * (cols - 1)) / cols;
  const sizeFor = (cells, glyph) =>
    sharedSize(
      cells.map((cell) => cell || " "),
      { w: cellW, h: rowH - 8, max: 24, min: 12, maxLines: 2, glyph }
    );
  const headerSize = headers.length ? sizeFor(headers, "bold") : 0;
  // Sized per column so one long cell does not shrink the whole table.
  const columnSizes = rows[0].map((_, c) =>
    sizeFor(
      body.map((row) => row[c]),
      "regular"
    )
  );
  rows.forEach((row, r) => {
    const isHeader = headers.length > 0 && r === 0;
    const bodyIndex = headers.length ? r - 1 : r;
    const y = top + r * (rowH + gap);
    const fill = isHeader ? t.dark : bodyIndex % 2 === 0 ? t.stripe : null;
    if (fill)
      addRect(slide, pptx, {
        x: 160,
        y,
        w: 1600,
        h: rowH,
        radius: Math.min(16, rowH / 3),
        color: fill,
      });
    row.forEach((cell, c) =>
      addText(slide, cell, {
        x: 160 + pad + c * (cellW + 20),
        y,
        w: cellW,
        h: rowH,
        size: isHeader ? headerSize : columnSizes[c],
        bold: isHeader,
        color: isHeader ? "FFFFFF" : t.dark,
        valign: "middle",
      })
    );
  });
}

/** Wraps a quote in curly quotes, replacing any the model already added. */
function quoted(text) {
  return `“${String(text).replace(/^["“”']+|["“”']+$/g, "")}”`;
}

function renderQuote(slide, pptx, data, t, meta) {
  const dark = meta.variant === 0;
  const color = dark ? "FFFFFF" : t.scale[950];
  const x = dark ? 149 : 164;
  const w = dark ? 1622 : 1300;
  addText(slide, quoted(data.title), {
    x,
    y: 110,
    w,
    h: 610,
    fit: { max: dark ? 106 : 96, min: 40 },
    bold: true,
    color,
    align: dark ? "center" : "left",
    valign: "bottom",
  });
  if (data.subtitle)
    // The design prefixes the speaker with a dash, so drop any the model wrote.
    addText(slide, `-${data.subtitle.replace(/^[-–—\s]+/, "")}`, {
      x: dark ? 160 : x,
      y: 760,
      w: 1600,
      h: 90,
      fit: { max: 32, min: 20, maxLines: 2 },
      bold: !dark,
      caps: true,
      spacing: 3.2,
      color,
      align: dark ? "center" : "left",
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

/**
 * Background of a slide. Layouts drawn on the theme's dark shade in the
 * design are listed here; the quote alternates between dark and light.
 */
function backgroundFor(t, layout, variant) {
  if (layout === "section" || layout === "cards") return t.dark;
  if (layout === "quote") return variant === 0 ? t.dark : t.scale[50];
  return t.light;
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
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = title;
  pptx.company = "AnythingLLM";
  if (author) pptx.author = author;

  const cover = pptx.addSlide();
  cover.background = { color: theme.dark };
  renderTitleSlide(cover, pptx, theme, { title, subtitle });
  addBrand(cover, true);

  let sectionIndex = 0;
  // Layouts with two designs alternate between them through the deck.
  const seen = {};
  slides.forEach((data) => {
    if (data.layout === "section") sectionIndex++;
    const count = seen[data.layout] ?? 0;
    seen[data.layout] = count + 1;
    const variant = count % 2;
    const slide = pptx.addSlide();
    const bg = backgroundFor(theme, data.layout, variant);
    slide.background = { color: bg };
    RENDERERS[data.layout](slide, pptx, data, theme, {
      sectionIndex,
      variant,
      // The deck title runs along the top of every slide except the cover.
      label: title,
    });
    addBrand(slide, bg === theme.dark);
    if (data.notes) slide.addNotes(data.notes);
  });

  return pptx.write({ outputType: "nodebuffer" });
}

module.exports = { renderDeck };
