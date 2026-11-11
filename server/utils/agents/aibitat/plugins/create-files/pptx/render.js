const PptxGenJS = require("pptxgenjs");
const createFilesLib = require("../lib.js");

/**
 * Draws normalized slides (see slides.js) with a theme (see themes.js) into
 * a .pptx buffer. Nothing here reads model output directly and nothing
 * relies on PowerPoint autofit: every text box is sized up front by fitText
 * because "shrink text on overflow" is not applied until a box is edited.
 *
 * Positions and font sizes are pixels of a 1920 × 1080 frame. LAYOUT_WIDE is
 * 13.333 × 7.5 in, so 144 px is one inch and a 2 px font is one point.
 * Content slides share one grid: the title at the top and the content as one
 * block centred in the space below it, sized as large as that space allows,
 * so a slide with little content never looks empty and a full one never
 * overflows.
 */

const PX_PER_IN = 144;
// Aptos ships with Microsoft 365 on Windows and macOS; viewers without it
// substitute a similar sans serif.
const FONT = "Aptos";
const HEADING_FONT = "Aptos Display";
const SLIDE_W = 1920;
const SLIDE_H = 1080;
const MARGIN = 120;
const CONTENT_W = SLIDE_W - 2 * MARGIN;
const TITLE_Y = 110;
// Content stays above the footer.
const CONTENT_BOTTOM = 960;
const INK = "1F2937";
const MUTED = "6B7280";

// Average glyph width as a fraction of the font size. Aptos measures 0.44
// regular, 0.47 bold, 0.56 in capitals and 0.43 for Aptos Display Bold
// headings; these are about 13% wider, which covers strings of wide letters
// and viewers that substitute a slightly wider font. wrappedLines models
// word wrapping itself, so WRAP_SLACK only keeps a little room at the end
// of each line.
const GLYPH_W = { regular: 0.5, bold: 0.53, caps: 0.62, heading: 0.49 };
const LINE_H = 1.2;
const WRAP_SLACK = 0.96;
// Space after each list paragraph, as a fraction of the font size.
const LIST_GAP = 0.7;
const LIST_INDENT = 1.6;

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
  const perLine = charsPerLine(size, w, glyph);
  return paragraphs.reduce(
    (sum, p) => sum + wrappedLines(String(p), perLine),
    0
  );
}

/**
 * Characters that fit on one line at a font size.
 * @param {number} size - Font size in px
 * @param {number} w - Box width in px
 * @param {"regular"|"bold"|"caps"} glyph
 * @returns {number}
 */
function charsPerLine(size, w, glyph) {
  return Math.max(1, Math.floor((w / (size * GLYPH_W[glyph])) * WRAP_SLACK));
}

/**
 * Lines one paragraph wraps to when breaking between words. A word longer
 * than a line is split across as many lines as it needs.
 * @param {string} paragraph
 * @param {number} perLine - Characters per line
 * @returns {number}
 */
function wrappedLines(paragraph, perLine) {
  let lines = 0;
  let used = perLine;
  for (const word of paragraph.split(/\s+/).filter(Boolean)) {
    if (used + 1 + word.length <= perLine) {
      used += 1 + word.length;
      continue;
    }
    lines += Math.ceil(word.length / perLine);
    used = word.length % perLine || perLine;
  }
  return Math.max(1, lines);
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
  const longestWord = Math.max(
    ...paragraphs
      .flatMap((p) => String(p).split(/\s+/))
      .map((word) => word.length)
  );
  for (let size = max; size > min; size -= 2) {
    const lines = lineCount(paragraphs, size, w, glyph);
    const height = textHeight(paragraphs, size, { w, lineGap, glyph });
    // A word wider than the box would be broken mid-word.
    const wordFits = longestWord <= charsPerLine(size, w, glyph);
    if (lines <= maxLines && height <= h && wordFits) return size;
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
 * Font size for a heading in Aptos Display Bold: like fitText, but it gives
 * up to 15% of the size to save a line, so a title does not wrap one word
 * onto a line of its own.
 * @param {string} text
 * @param {object} box - Same as fitText, without glyph
 * @returns {number}
 */
function headingSize(text, box) {
  const size = fitText(text, { ...box, glyph: "heading" });
  const lines = (s) => lineCount([text], s, box.w, "heading");
  for (let s = size - 2; s >= Math.max(box.min ?? 12, size * 0.85); s -= 2)
    if (lines(s) < lines(size)) return s;
  return size;
}

/**
 * Largest font size from `max` down to `min` at which a block of content,
 * measured by `heightAt(size)`, fits `room` px of height.
 * @returns {number}
 */
function fitBlock({ max, min }, room, heightAt) {
  for (let size = max; size > min; size -= 2)
    if (heightAt(size) <= room) return size;
  return min;
}

/** Top of a block `h` px tall in an area: centred, sitting slightly high. */
function placeIn(area, h) {
  return area.top + Math.max(0, (area.bottom - area.top - h) * 0.4);
}

/**
 * Text box positioned and sized in px. Pass `size` for a fixed font size or
 * `fit: { max, min?, maxLines? }` to size the text to the box.
 */
function addText(
  slide,
  str,
  {
    x,
    y,
    w,
    h,
    size,
    fit,
    bold = false,
    caps = false,
    font = FONT,
    spacing,
    color,
    ...opts
  }
) {
  const glyph = caps
    ? "caps"
    : bold && font === HEADING_FONT
      ? "heading"
      : bold
        ? "bold"
        : "regular";
  const fontSize = fit ? fitText(str, { w, h, glyph, ...fit }) : size;
  slide.addText(caps ? String(str).toUpperCase() : str, {
    x: inches(x),
    y: inches(y),
    w: inches(w),
    h: inches(h),
    margin: 0,
    fontFace: font,
    fontSize: points(fontSize),
    bold,
    color,
    ...(spacing && { charSpacing: points(spacing) }),
    valign: "top",
    ...opts,
  });
}

/** Rectangle, rounded rectangle (`radius`) or ellipse in px. */
function addShape(
  slide,
  pptx,
  { x, y, w, h, color, radius, ellipse, line, transparency }
) {
  const type = ellipse
    ? pptx.ShapeType.ellipse
    : radius
      ? pptx.ShapeType.roundRect
      : pptx.ShapeType.rect;
  slide.addShape(type, {
    x: inches(x),
    y: inches(y),
    w: inches(w),
    h: inches(h),
    ...(radius && { rectRadius: inches(radius) }),
    fill: color
      ? { color, ...(transparency && { transparency }) }
      : { type: "none" },
    line: line ?? { type: "none" },
  });
}

/** A slide's list entries: items as a bold lead-in and its text, or points. */
function entriesOf(data) {
  return data.items.length
    ? data.items
    : data.points.map((point) => ({ title: "", text: point }));
}

const entryText = (entry) =>
  [entry.title, entry.text].filter(Boolean).join(" — ");

function listHeight(entries, size, w) {
  return textHeight(entries.map(entryText), size, {
    w: w - size * LIST_INDENT,
    lineGap: LIST_GAP,
  });
}

/** A bulleted list in one text box, so PowerPoint flows the paragraphs. */
function addList(slide, entries, { x, y, w, h, size, color, lead }) {
  const runs = entries.flatMap((entry, i) => {
    const parts = [];
    if (entry.title)
      parts.push({
        text: entry.text ? `${entry.title} — ` : entry.title,
        options: { bold: true, color: lead },
      });
    if (entry.text) parts.push({ text: entry.text, options: { color } });
    parts[0].options.bullet = {
      characterCode: "25AA",
      indent: points(size * LIST_INDENT),
    };
    parts[0].options.paraSpaceAfter = points(size * LIST_GAP);
    parts[parts.length - 1].options.breakLine = i < entries.length - 1;
    return parts;
  });
  slide.addText(runs, {
    x: inches(x),
    y: inches(y),
    w: inches(w),
    h: inches(h),
    margin: 0,
    fontFace: FONT,
    fontSize: points(size),
    color,
    valign: "top",
  });
}

/**
 * The title of a content slide, under a short accent rule.
 * @returns {{top: number, bottom: number}} The area left for content
 */
function addTitle(slide, pptx, title, t) {
  addShape(slide, pptx, {
    x: MARGIN,
    y: TITLE_Y - 34,
    w: 72,
    h: 8,
    radius: 4,
    color: t.scale[500],
  });
  const size = headingSize(title, {
    w: CONTENT_W,
    h: 210,
    max: 84,
    min: 56,
    maxLines: 2,
  });
  const h = textHeight(title, size, { w: CONTENT_W, glyph: "heading" });
  addText(slide, title, {
    x: MARGIN,
    y: TITLE_Y,
    w: CONTENT_W,
    h,
    size,
    bold: true,
    font: HEADING_FONT,
    color: t.scale[950],
  });
  return { top: TITLE_Y + h + 64, bottom: CONTENT_BOTTOM };
}

/** Large soft circles that give dark slides some depth. */
function addDecor(slide, pptx, t) {
  addShape(slide, pptx, {
    x: 1180,
    y: -320,
    w: 1100,
    h: 1100,
    ellipse: true,
    color: t.scale[400],
    transparency: 86,
  });
  addShape(slide, pptx, {
    x: 1500,
    y: 600,
    w: 640,
    h: 640,
    ellipse: true,
    color: t.scale[300],
    transparency: 90,
  });
}

/** The deck title in the bottom-left corner. */
function addLabel(slide, label, color) {
  if (!label) return;
  const text = label.length > 60 ? `${label.slice(0, 59).trim()}…` : label;
  addText(slide, text, { x: MARGIN, y: 1000, w: 1200, h: 32, size: 22, color });
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

/**
 * A heading block on a dark slide: an optional kicker line above the title
 * and a subtitle below, centred vertically.
 */
function addHeadingBlock(
  slide,
  pptx,
  t,
  { kicker, title, subtitle, titleMax, titleMin }
) {
  const w = 1500;
  const titleSize = headingSize(title, {
    w,
    h: 560,
    max: titleMax,
    min: titleMin,
    maxLines: 3,
  });
  const titleH = textHeight(title, titleSize, { w, glyph: "heading" });
  const subSize = subtitle
    ? fitText(subtitle, { w, h: 130, max: 44, min: 30, maxLines: 2 })
    : 0;
  const subH = subtitle ? textHeight(subtitle, subSize, { w }) : 0;
  const kickerH = kicker ? 80 : 12 + 48;
  const blockH = kickerH + titleH + (subtitle ? 40 + subH : 0);
  let y = (SLIDE_H - blockH) / 2;
  if (kicker)
    addText(slide, kicker, {
      x: MARGIN,
      y,
      w: 400,
      h: 68,
      size: 56,
      bold: true,
      font: HEADING_FONT,
      color: t.scale[300],
    });
  else
    addShape(slide, pptx, {
      x: MARGIN,
      y,
      w: 120,
      h: 12,
      radius: 6,
      color: t.scale[400],
    });
  y += kickerH;
  addText(slide, title, {
    x: MARGIN,
    y,
    w,
    h: titleH,
    size: titleSize,
    bold: true,
    font: HEADING_FONT,
    color: "FFFFFF",
  });
  if (subtitle)
    addText(slide, subtitle, {
      x: MARGIN,
      y: y + titleH + 40,
      w,
      h: subH,
      size: subSize,
      color: t.scale[200],
    });
}

function renderCover(slide, pptx, t, { title, subtitle }) {
  addDecor(slide, pptx, t);
  addHeadingBlock(slide, pptx, t, {
    title: title || "Untitled",
    subtitle,
    titleMax: 132,
    titleMin: 80,
  });
}

function renderSection(slide, pptx, data, t, meta) {
  addDecor(slide, pptx, t);
  addHeadingBlock(slide, pptx, t, {
    kicker: String(meta.sectionIndex).padStart(2, "0"),
    title: data.title,
    subtitle: data.subtitle,
    titleMax: 112,
    titleMin: 64,
  });
}

function renderBullets(slide, pptx, data, t) {
  const area = addTitle(slide, pptx, data.title, t);
  const entries = entriesOf(data);
  const w = 1440;
  const size = fitBlock({ max: 52, min: 28 }, area.bottom - area.top, (s) =>
    listHeight(entries, s, w)
  );
  const h = listHeight(entries, size, w);
  addList(slide, entries, {
    x: MARGIN,
    y: placeIn(area, h),
    w,
    h,
    size,
    color: INK,
    lead: t.scale[700],
  });
}

/** The title on a colored panel to the left of the list. */
function renderSplit(slide, pptx, data, t) {
  const panelW = 760;
  addShape(slide, pptx, { x: 0, y: 0, w: panelW, h: SLIDE_H, color: t.dark });
  const titleW = panelW - 2 * 100;
  const titleSize = headingSize(data.title, {
    w: titleW,
    h: 640,
    max: 80,
    min: 48,
    maxLines: 6,
  });
  const titleH = textHeight(data.title, titleSize, {
    w: titleW,
    glyph: "heading",
  });
  const titleY = (SLIDE_H - titleH) / 2;
  addShape(slide, pptx, {
    x: 100,
    y: titleY - 44,
    w: 72,
    h: 8,
    radius: 4,
    color: t.scale[300],
  });
  addText(slide, data.title, {
    x: 100,
    y: titleY,
    w: titleW,
    h: titleH,
    size: titleSize,
    bold: true,
    font: HEADING_FONT,
    color: "FFFFFF",
  });

  const x = panelW + 120;
  const w = SLIDE_W - x - MARGIN;
  const area = { top: 120, bottom: CONTENT_BOTTOM };
  const entries = entriesOf(data);
  const size = fitBlock({ max: 48, min: 28 }, area.bottom - area.top, (s) =>
    listHeight(entries, s, w)
  );
  const h = listHeight(entries, size, w);
  addList(slide, entries, {
    x,
    y: placeIn(area, h),
    w,
    h,
    size,
    color: INK,
    lead: t.scale[700],
  });
}

/** Columns for a grid of `n` items: one row up to three, then two rows. */
const gridCols = (n) => (n <= 3 ? n : n === 4 ? 2 : 3);

function renderCards(slide, pptx, data, t) {
  const area = addTitle(slide, pptx, data.title, t);
  const items = data.items;
  const cols = gridCols(items.length);
  const rows = Math.ceil(items.length / cols);
  const gap = 32;
  const pad = 40;
  const numberH = 34;
  const cardW = (CONTENT_W - gap * (cols - 1)) / cols;
  const innerW = cardW - 2 * pad;
  const measure = (size) => {
    const titleSize = size + 6;
    const titleH = Math.max(
      0,
      ...items.map((item) =>
        item.title
          ? textHeight(item.title, titleSize, { w: innerW, glyph: "bold" })
          : 0
      )
    );
    const textH = Math.max(
      0,
      ...items.map((item) =>
        item.text ? textHeight(item.text, size, { w: innerW }) : 0
      )
    );
    const cardH =
      pad + numberH + 20 + titleH + (titleH && textH ? 14 : 0) + textH + pad;
    return {
      titleSize,
      titleH,
      textH,
      cardH,
      blockH: rows * cardH + (rows - 1) * gap,
    };
  };
  const size = fitBlock(
    { max: 38, min: 22 },
    area.bottom - area.top,
    (s) => measure(s).blockH
  );
  const m = measure(size);
  const top = placeIn(area, m.blockH);
  items.forEach((item, i) => {
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, items.length - row * cols);
    // A short last row is centred under the full ones.
    const offset = ((cols - inRow) * (cardW + gap)) / 2;
    const x = MARGIN + offset + (i % cols) * (cardW + gap);
    const y = top + row * (m.cardH + gap);
    addShape(slide, pptx, {
      x,
      y,
      w: cardW,
      h: m.cardH,
      radius: 24,
      color: "FFFFFF",
      line: { color: t.scale[100], width: 1 },
    });
    addText(slide, String(i + 1).padStart(2, "0"), {
      x: x + pad,
      y: y + pad,
      w: innerW,
      h: numberH,
      size: 28,
      bold: true,
      font: HEADING_FONT,
      color: t.scale[500],
    });
    let textY = y + pad + numberH + 20;
    if (item.title) {
      addText(slide, item.title, {
        x: x + pad,
        y: textY,
        w: innerW,
        h: m.titleH,
        size: m.titleSize,
        bold: true,
        color: t.scale[950],
      });
      textY += m.titleH + 14;
    }
    if (item.text)
      addText(slide, item.text, {
        x: x + pad,
        y: textY,
        w: innerW,
        h: m.textH,
        size,
        color: INK,
      });
  });
}

/** Up to four steps side by side on a line of numbered badges. */
function renderStepsRow(slide, pptx, data, t, area) {
  const items = data.items;
  const gap = 48;
  const badge = 72;
  const colW = (CONTENT_W - gap * (items.length - 1)) / items.length;
  const measure = (size) => {
    const titleSize = size + 6;
    const titleH = Math.max(
      ...items.map((item) =>
        textHeight(item.title || " ", titleSize, { w: colW, glyph: "bold" })
      )
    );
    const textH = Math.max(
      0,
      ...items.map((item) =>
        item.text ? textHeight(item.text, size, { w: colW }) : 0
      )
    );
    return {
      titleSize,
      titleH,
      textH,
      blockH: badge + 32 + titleH + 12 + textH,
    };
  };
  const size = fitBlock(
    { max: 38, min: 22 },
    area.bottom - area.top,
    (s) => measure(s).blockH
  );
  const m = measure(size);
  const top = placeIn(area, m.blockH);
  addShape(slide, pptx, {
    x: MARGIN + badge / 2,
    y: top + badge / 2 - 2,
    w: (items.length - 1) * (colW + gap),
    h: 4,
    color: t.scale[200],
  });
  items.forEach((item, i) => {
    const x = MARGIN + i * (colW + gap);
    addShape(slide, pptx, {
      x,
      y: top,
      w: badge,
      h: badge,
      ellipse: true,
      color: t.dark,
    });
    addText(slide, String(i + 1), {
      x,
      y: top,
      w: badge,
      h: badge,
      size: 32,
      bold: true,
      color: "FFFFFF",
      align: "center",
      valign: "middle",
    });
    const titleY = top + badge + 32;
    addText(slide, item.title, {
      x,
      y: titleY,
      w: colW,
      h: m.titleH,
      size: m.titleSize,
      bold: true,
      color: t.scale[950],
    });
    if (item.text)
      addText(slide, item.text, {
        x,
        y: titleY + m.titleH + 12,
        w: colW,
        h: m.textH,
        size,
        color: INK,
      });
  });
}

/** Five or six steps as a numbered list. */
function renderStepsList(slide, pptx, data, t, area) {
  const items = data.items;
  const badge = 56;
  const gap = 24;
  const x = MARGIN + badge + 40;
  const w = 1440 - badge - 40;
  // Every row gets the tallest row's height, so the list keeps one rhythm.
  const rowH = (size) =>
    Math.max(
      badge,
      ...items.map((item) => textHeight(entryText(item), size, { w }))
    );
  const blockH = (size) => items.length * rowH(size) + gap * (items.length - 1);
  const size = fitBlock({ max: 42, min: 24 }, area.bottom - area.top, blockH);
  const pitch = rowH(size);
  let y = placeIn(area, blockH(size));
  items.forEach((item, i) => {
    addShape(slide, pptx, {
      x: MARGIN,
      y,
      w: badge,
      h: badge,
      ellipse: true,
      color: t.dark,
    });
    addText(slide, String(i + 1), {
      x: MARGIN,
      y,
      w: badge,
      h: badge,
      size: 26,
      bold: true,
      color: "FFFFFF",
      align: "center",
      valign: "middle",
    });
    const runs = [
      item.title && {
        text: item.text ? `${item.title} — ` : item.title,
        options: { bold: true, color: t.scale[950] },
      },
      item.text && { text: item.text, options: { color: INK } },
    ].filter(Boolean);
    slide.addText(runs, {
      x: inches(x),
      y: inches(y + Math.max(0, (badge - size * LINE_H) / 2)),
      w: inches(w),
      h: inches(pitch),
      margin: 0,
      fontFace: FONT,
      fontSize: points(size),
      valign: "top",
    });
    y += pitch + gap;
  });
}

function renderSteps(slide, pptx, data, t) {
  const area = addTitle(slide, pptx, data.title, t);
  if (data.items.length <= 4) renderStepsRow(slide, pptx, data, t, area);
  else renderStepsList(slide, pptx, data, t, area);
}

/** Two cards side by side, each under a colored heading. */
function renderComparison(slide, pptx, data, t) {
  const area = addTitle(slide, pptx, data.title, t);
  const items = data.items.slice(0, 2);
  const gap = 48;
  const pad = 44;
  const radius = 24;
  const cardW = (CONTENT_W - gap) / 2;
  const innerW = cardW - 2 * pad;
  const measure = (size) => {
    const headSize = size + 8;
    const headH = Math.max(
      ...items.map((item) =>
        textHeight(item.title || " ", headSize, { w: innerW, glyph: "bold" })
      )
    );
    const bodyH = Math.max(
      ...items.map((item) => textHeight(item.text || " ", size, { w: innerW }))
    );
    const headerH = headH + 2 * pad;
    return {
      headSize,
      headH,
      bodyH,
      headerH,
      cardH: headerH + bodyH + 2 * pad,
    };
  };
  const size = fitBlock(
    { max: 42, min: 24 },
    area.bottom - area.top,
    (s) => measure(s).cardH
  );
  const m = measure(size);
  const top = placeIn(area, m.cardH);
  items.forEach((item, i) => {
    const x = MARGIN + i * (cardW + gap);
    const headColor = i === 0 ? t.dark : t.scale[600];
    addShape(slide, pptx, {
      x,
      y: top,
      w: cardW,
      h: m.cardH,
      radius,
      color: "FFFFFF",
      line: { color: t.scale[100], width: 1 },
    });
    addShape(slide, pptx, {
      x,
      y: top,
      w: cardW,
      h: m.headerH + radius,
      radius,
      color: headColor,
    });
    // Squares off the bottom of the heading where it meets the card body.
    addShape(slide, pptx, {
      x,
      y: top + m.headerH,
      w: cardW,
      h: radius,
      color: "FFFFFF",
    });
    addText(slide, item.title, {
      x: x + pad,
      y: top + pad,
      w: innerW,
      h: m.headH,
      size: m.headSize,
      bold: true,
      color: "FFFFFF",
    });
    addText(slide, item.text, {
      x: x + pad,
      y: top + m.headerH + pad,
      w: innerW,
      h: m.bodyH,
      size,
      color: INK,
    });
  });
}

function renderStats(slide, pptx, data, t) {
  const area = addTitle(slide, pptx, data.title, t);
  const figures = data.figures;
  const cols = gridCols(figures.length);
  const rows = Math.ceil(figures.length / cols);
  const gap = 64;
  const colW = (CONTENT_W - gap * (cols - 1)) / cols;
  const valueSize = sharedSize(
    figures.map((f) => f.value),
    { w: colW, h: 170, max: 136, min: 64, maxLines: 1, glyph: "heading" }
  );
  const valueH = valueSize * LINE_H;
  const measure = (size) => {
    const labelH = Math.max(
      0,
      ...figures.map((f) =>
        f.label ? textHeight(f.label, size, { w: colW }) : 0
      )
    );
    const cellH = 8 + 28 + valueH + 12 + labelH;
    return { labelH, cellH, blockH: rows * cellH + (rows - 1) * gap };
  };
  const size = fitBlock(
    { max: 36, min: 22 },
    area.bottom - area.top,
    (s) => measure(s).blockH
  );
  const m = measure(size);
  const top = placeIn(area, m.blockH);
  figures.forEach((figure, i) => {
    const x = MARGIN + (i % cols) * (colW + gap);
    const y = top + Math.floor(i / cols) * (m.cellH + gap);
    addShape(slide, pptx, {
      x,
      y,
      w: 80,
      h: 8,
      radius: 4,
      color: t.scale[400],
    });
    addText(slide, figure.value, {
      x,
      y: y + 36,
      w: colW,
      h: valueH,
      size: valueSize,
      bold: true,
      font: HEADING_FONT,
      color: t.scale[600],
    });
    if (figure.label)
      addText(slide, figure.label, {
        x,
        y: y + 36 + valueH + 12,
        w: colW,
        h: m.labelH,
        size,
        color: INK,
      });
  });
}

function renderChart(slide, pptx, data, t) {
  const area = addTitle(slide, pptx, data.title, t);
  const { type, categories, values } = data.chart;
  const isRound = type === "pie" || type === "doughnut";
  const entries = entriesOf(data);
  const hasList = entries.length > 0;
  const chart = {
    x: MARGIN - 20,
    y: area.top - 20,
    w: hasList ? 1060 : CONTENT_W + 40,
    h: area.bottom - area.top + 20,
  };
  const ink = t.scale[900];
  // Darkest first, so a bar chart steps down the scale.
  const shades = [800, 700, 600, 500, 400, 300, 200].map((s) => t.scale[s]);
  const axisLabel = (size) => ({
    color: ink,
    fontFace: FONT,
    fontSize: points(size),
  });
  const val = axisLabel(24);
  const cat = axisLabel(24);

  slide.addChart(
    pptx.ChartType[type],
    [{ name: data.title, labels: categories, values }],
    {
      x: inches(chart.x),
      y: inches(chart.y),
      w: inches(chart.w),
      h: inches(chart.h),
      chartColors: type === "line" || type === "area" ? [t.scale[600]] : shades,
      showValue: !isRound,
      showPercent: isRound,
      showLegend: isRound,
      legendPos: "r",
      legendColor: ink,
      legendFontFace: FONT,
      legendFontSize: points(24),
      dataLabelColor: isRound ? "FFFFFF" : ink,
      dataLabelPosition: isRound ? undefined : "outEnd",
      dataLabelFontFace: FONT,
      dataLabelFontSize: points(22),
      dataLabelFontBold: true,
      dataLabelFormatCode: isRound ? "0%" : "General",
      valAxisLabelFormatCode: "General",
      // Bars are compared by length, so a cropped axis exaggerates gaps.
      ...(type === "bar" && Math.min(...values) >= 0 && { valAxisMinVal: 0 }),
      valAxisLabelColor: MUTED,
      valAxisLabelFontFace: val.fontFace,
      valAxisLabelFontSize: val.fontSize,
      catAxisLabelColor: cat.color,
      catAxisLabelFontFace: cat.fontFace,
      catAxisLabelFontSize: cat.fontSize,
      catAxisLineShow: false,
      valAxisLineShow: false,
      valGridLine: { color: t.scale[100], style: "solid", size: 1 },
      catGridLine: { style: "none" },
      barGapWidthPct: 40,
      lineSize: 4,
      lineDataSymbolSize: 10,
      holeSize: 55,
    }
  );

  if (hasList) {
    const x = 1240;
    const w = SLIDE_W - x - MARGIN;
    const size = fitBlock({ max: 36, min: 22 }, area.bottom - area.top, (s) =>
      listHeight(entries, s, w)
    );
    const h = listHeight(entries, size, w);
    addList(slide, entries, {
      x,
      y: placeIn(area, h),
      w,
      h,
      size,
      color: INK,
      lead: t.scale[700],
    });
  }
}

function renderTable(slide, pptx, data, t) {
  const area = addTitle(slide, pptx, data.title, t);
  const { headers, rows: body } = data.table;
  const rows = headers.length ? [headers, ...body] : body;
  const cols = rows[0].length;
  const colW = CONTENT_W / cols;
  const padX = 24;
  // Dense tables trade padding for room to wrap.
  const padY = rows.length > 5 ? 12 : 24;
  const cellW = colW - 2 * padX;
  const rowHeights = (size) =>
    rows.map(
      (row, r) =>
        Math.max(
          ...row.map((cell) =>
            textHeight(cell || " ", size, {
              w: cellW,
              glyph: headers.length && r === 0 ? "bold" : "regular",
            })
          )
        ) +
        2 * padY
    );
  const size = fitBlock({ max: 36, min: 20 }, area.bottom - area.top, (s) =>
    rowHeights(s).reduce((sum, h) => sum + h, 0)
  );
  const heights = rowHeights(size);
  const total = heights.reduce((sum, h) => sum + h, 0);
  const line = { pt: 1, color: t.scale[200] };
  const none = { type: "none" };
  const tableRows = rows.map((row, r) => {
    const isHeader = headers.length > 0 && r === 0;
    const bodyIndex = headers.length ? r - 1 : r;
    return row.map((cell) => ({
      text: cell,
      options: {
        bold: isHeader,
        color: isHeader ? "FFFFFF" : INK,
        fill: {
          color: isHeader ? t.dark : bodyIndex % 2 ? t.light : "FFFFFF",
        },
        border: [none, none, isHeader ? none : line, none],
      },
    }));
  });
  slide.addTable(tableRows, {
    x: inches(MARGIN),
    y: inches(placeIn(area, total)),
    w: inches(CONTENT_W),
    colW: Array(cols).fill(inches(colW)),
    rowH: heights.map(inches),
    fontFace: FONT,
    fontSize: points(size),
    valign: "middle",
    margin: [padY, padX, padY, padX].map(inches),
  });
}

function renderQuote(slide, pptx, data, t) {
  addDecor(slide, pptx, t);
  const w = 1500;
  const { text, by } = data.quote;
  const size = fitText(text, { w, h: 520, max: 76, min: 44, maxLines: 7 });
  const textH = textHeight(text, size, { w });
  const markH = 150;
  const byH = by ? 40 + 40 : 0;
  let y = (SLIDE_H - (markH + textH + byH)) / 2;
  addText(slide, "“", {
    x: MARGIN - 8,
    y,
    w: 200,
    h: 290,
    size: 240,
    bold: true,
    font: HEADING_FONT,
    color: t.scale[300],
  });
  y += markH;
  addText(slide, text, {
    x: MARGIN,
    y,
    w,
    h: textH,
    size,
    font: HEADING_FONT,
    color: "FFFFFF",
  });
  if (by)
    addText(slide, `— ${by}`, {
      x: MARGIN,
      y: y + textH + 40,
      w,
      h: 40,
      size: 30,
      color: t.scale[200],
    });
}

const RENDERERS = {
  section: renderSection,
  bullets: renderBullets,
  split: renderSplit,
  cards: renderCards,
  steps: renderSteps,
  comparison: renderComparison,
  stats: renderStats,
  chart: renderChart,
  table: renderTable,
  quote: renderQuote,
};

// Layouts drawn on the theme's dark shade.
const DARK_LAYOUTS = new Set(["section", "quote"]);

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
  renderCover(cover, pptx, theme, { title, subtitle });
  addBrand(cover, true);

  let sectionIndex = 0;
  slides.forEach((data) => {
    if (data.layout === "section") sectionIndex++;
    const dark = DARK_LAYOUTS.has(data.layout);
    const slide = pptx.addSlide();
    slide.background = { color: dark ? theme.dark : theme.light };
    RENDERERS[data.layout](slide, pptx, data, theme, { sectionIndex });
    // The split layout's label sits on its dark panel.
    const labelOnDark = dark || data.layout === "split";
    addLabel(slide, title, labelOnDark ? theme.scale[200] : MUTED);
    addBrand(slide, dark);
    if (data.notes) slide.addNotes(data.notes);
  });

  return pptx.write({ outputType: "nodebuffer" });
}

module.exports = { renderDeck, fitText, textHeight };
