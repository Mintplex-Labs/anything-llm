const createFilesLib = require("../lib.js");

// All positioning assumes LAYOUT_16x9: 10 × 5.625 in.
const MARGIN_X = 0.6;
const CONTENT_W = 8.8; // 10 - 2 × MARGIN_X
const FOOTER_Y = 5.15;

function isDarkColor(hexColor) {
  const hex = (hexColor || "FFFFFF").replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.6;
}

/** Mixes `amount` (0-1) of `into` into `hex`. */
function mix(hex, into, amount) {
  const c = (h, i) => parseInt(h.substr(i, 2), 16);
  return [0, 2, 4]
    .map((i) => Math.round(c(hex, i) * (1 - amount) + c(into, i) * amount))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/**
 * The same palette with the dark canvas as the slide background, so any
 * content layout can render as a dark slide without knowing about it.
 */
function invert(theme) {
  if (isDarkColor(theme.bg)) return theme;
  return {
    ...theme,
    bg: theme.dark,
    surface: mix(theme.dark, "FFFFFF", 0.1),
    text: theme.onDark,
    muted: theme.onDarkMuted,
  };
}

function addBranding(slide, bgColor) {
  const isDark = isDarkColor(bgColor);
  const textColor = isDark ? "FFFFFF" : "000000";
  const logo = createFilesLib.getLogo({
    forDarkBackground: isDark,
    format: "dataUri",
  });

  slide.addText("Created with", {
    x: 7.85,
    y: 5.1,
    w: 1.85,
    h: 0.12,
    fontSize: 5.5,
    color: textColor,
    transparency: 78,
    fontFace: "Calibri",
    align: "center",
    italic: true,
  });

  if (logo) {
    slide.addImage({
      data: logo,
      x: 8.025,
      y: 5.21,
      w: 1.5,
      h: 0.24,
      transparency: 78,
    });
  } else {
    slide.addText("AnythingLLM", {
      x: 7.85,
      y: 5.21,
      w: 1.85,
      h: 0.24,
      fontSize: 8,
      color: textColor,
      transparency: 78,
      fontFace: "Calibri",
      align: "center",
    });
  }
}

function addRect(slide, pptx, { shape = pptx.ShapeType.rect, ...opts }) {
  const { color, transparency, ...rest } = opts;
  slide.addShape(shape, {
    fill: { color, transparency },
    line: { color, transparency: transparency ?? 0, width: 0 },
    ...rest,
  });
}

function addFooter(slide, theme, { n, total }, onDark) {
  slide.addText(`${n}  /  ${total}`, {
    x: MARGIN_X,
    y: FOOTER_Y,
    w: 1.2,
    h: 0.25,
    fontSize: 8,
    color: onDark ? theme.onDarkMuted : theme.muted,
    fontFace: theme.fontBody,
  });
}

/**
 * Title block for content slides: accent bar, title, optional subtitle.
 * @returns {number} y coordinate where slide content should start
 */
function addTitle(slide, pptx, theme, { title, subtitle }) {
  const style = styleOf(theme);
  const bandInk = isDarkColor(theme.accent) ? "FFFFFF" : theme.dark;
  if (style.band) {
    addRect(slide, pptx, {
      x: 0,
      y: 0,
      w: 10,
      h: subtitle ? 1.55 : 1.25,
      color: theme.accent,
    });
  } else if (style.cardFill) {
    addRect(slide, pptx, {
      x: MARGIN_X,
      y: 0.5,
      w: 0.07,
      h: 0.5,
      color: theme.accent,
    });
  }
  const x = style.cardFill && !style.band ? MARGIN_X + 0.22 : MARGIN_X;
  const titleW = CONTENT_W - (x - MARGIN_X);
  slide.addText(title || "", {
    x,
    y: 0.38,
    w: titleW,
    h: 0.75,
    fontSize: fitText(title, {
      w: titleW,
      h: 0.75,
      max: style.band ? 28 : 26,
      font: "title",
    }),
    bold: true,
    color: style.band ? bandInk : theme.text,
    fontFace: theme.fontTitle,
    valign: "middle",
  });
  if (!style.cardFill) {
    addRect(slide, pptx, {
      x: MARGIN_X,
      y: subtitle ? 1.5 : 1.2,
      w: CONTENT_W,
      h: 0.012,
      color: theme.muted,
      transparency: 50,
    });
  }
  if (!subtitle) return 1.4;
  slide.addText(subtitle, {
    x,
    y: 1.1,
    w: CONTENT_W - (x - MARGIN_X),
    h: 0.35,
    fontSize: 13,
    color: style.band ? bandInk : theme.muted,
    transparency: style.band ? 30 : 0,
    fontFace: theme.fontBody,
    valign: "top",
  });
  return 1.65;
}

// Average glyph width as a fraction of the font size. Titles are bold and may
// be serif (Georgia), body text is Calibri; both are on the safe side so text
// never overflows. Word wrapping wastes part of every line, hence WRAP_SLACK.
const GLYPH_W = { title: 0.62, body: 0.52 };
const LINE_H = 1.2;
const WRAP_SLACK = 0.85;

/**
 * Largest font size (pt) at which `lines` of text fit a box, estimated from
 * character counts. PowerPoint does not apply "shrink text on overflow" until
 * a box is edited, so sizes are decided here and nothing relies on autofit.
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

function addBullets(slide, theme, bullets, { x, y, w, h, max = 20 }) {
  if (bullets.length === 0) return;
  const size = fitText(bullets, { w: w - 0.4, h, max, lineGap: 0.7 });
  slide.addText(
    bullets.map((text) => ({
      text: String(text),
      options: {
        fontSize: size,
        color: theme.text,
        fontFace: theme.fontBody,
        bullet: { code: "25AA", color: theme.accent, indent: size * 1.2 },
        paraSpaceAfter: size * 0.7,
      },
    })),
    { x, y, w, h, valign: "top" }
  );
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

/**
 * Design knobs derived from `theme.style`. Every layout reads these instead
 * of branching on the style name, so a new style is one more case here.
 *   geometric – dark canvases with translucent circles, filled cards
 *   minimal   – no shapes, thin rules, outlined cards, generous whitespace
 *   bold      – accent-colored canvases, left color band, dark filled cards
 */
function styleOf(theme) {
  switch (theme.style) {
    case "minimal":
      return {
        canvas: theme.bg,
        shapes: false,
        band: false,
        cardFill: null,
        cardTitle: theme.text,
        cardText: theme.muted,
        marker: "number",
      };
    case "bold": {
      const cardFill = isDarkColor(theme.bg) ? theme.surface : theme.dark;
      return {
        canvas: theme.accent,
        shapes: false,
        band: true,
        cardFill,
        cardTitle: isDarkColor(cardFill) ? theme.onDark : theme.text,
        cardText: isDarkColor(cardFill) ? theme.onDarkMuted : theme.muted,
        marker: "square",
      };
    }
    default:
      return {
        canvas: theme.dark,
        shapes: true,
        band: false,
        cardFill: theme.surface,
        cardTitle: theme.text,
        cardText: theme.muted,
        marker: "circle",
      };
  }
}

/** Text colors that read on a given canvas color. */
function onCanvas(theme, canvas) {
  if (isDarkColor(canvas))
    return { text: "FFFFFF", muted: "FFFFFF", mutedTransparency: 35 };
  return { text: theme.dark, muted: theme.dark, mutedTransparency: 45 };
}

/** Decorative translucent circles for dark canvases in the geometric style. */
function addCircles(slide, pptx, theme, circles) {
  circles.forEach(([x, y, size, transparency]) =>
    addRect(slide, pptx, {
      shape: pptx.ShapeType.ellipse,
      x,
      y,
      w: size,
      h: size,
      color: theme.accent,
      transparency,
    })
  );
}

/**
 * Card background for stats and cards. Returns the text colors to use inside.
 */
function addCard(slide, pptx, theme, cell, radius) {
  const style = styleOf(theme);
  if (style.cardFill) {
    addRect(slide, pptx, {
      shape: pptx.ShapeType.roundRect,
      rectRadius: radius,
      ...cell,
      color: style.cardFill,
    });
  } else {
    slide.addShape(pptx.ShapeType.rect, {
      ...cell,
      fill: { color: theme.bg, transparency: 100 },
      line: { color: theme.muted, transparency: 55, width: 0.75 },
    });
  }
  return { title: style.cardTitle, text: style.cardText };
}

function renderCover(slide, pptx, { title, subtitle, author }, theme) {
  const style = styleOf(theme);
  const ink = onCanvas(theme, style.canvas);
  slide.background = { color: style.canvas };
  if (style.shapes)
    addCircles(slide, pptx, theme, [
      [6.6, -1.6, 5.2, 82],
      [8.4, 2.4, 3.2, 72],
    ]);
  addRect(slide, pptx, {
    x: 0.8,
    y: 1.75,
    w: style.band ? 8.4 : 0.7,
    h: style.band ? 0.04 : 0.07,
    color: style.band ? ink.text : theme.accent,
  });
  const titleText = title || "Untitled";
  slide.addText(titleText, {
    x: 0.8,
    y: 1.9,
    w: 8.4,
    h: 1.8,
    fontSize: fitText(titleText, {
      w: 8.4,
      h: 1.8,
      max: 44,
      min: 24,
      font: "title",
    }),
    bold: true,
    color: ink.text,
    fontFace: theme.fontTitle,
    valign: "top",
  });
  const line = [subtitle, author].filter(Boolean).join("  ·  ");
  if (line) {
    slide.addText(line, {
      x: 0.8,
      y: 3.8,
      w: 8.4,
      h: 0.5,
      fontSize: 16,
      color: ink.muted,
      transparency: ink.mutedTransparency,
      fontFace: theme.fontBody,
      valign: "top",
    });
  }
  addBranding(slide, style.canvas);
}

function renderSection(slide, pptx, data, theme, meta) {
  const style = styleOf(theme);
  const ink = onCanvas(theme, style.canvas);
  slide.background = { color: style.canvas };
  if (style.shapes) addCircles(slide, pptx, theme, [[7.4, 3.0, 4.4, 84]]);
  if (meta.sectionIndex) {
    slide.addText(String(meta.sectionIndex).padStart(2, "0"), {
      x: 0.8,
      y: 0.9,
      w: 4,
      h: 1.3,
      fontSize: 72,
      bold: true,
      color: style.band ? ink.text : theme.accent,
      transparency: style.band ? 60 : 0,
      fontFace: theme.fontTitle,
      valign: "top",
    });
  }
  slide.addText(data.title, {
    x: 0.8,
    y: 2.3,
    w: 8.4,
    h: 1.2,
    fontSize: fitText(data.title, {
      w: 8.4,
      h: 1.2,
      max: 36,
      min: 22,
      font: "title",
    }),
    bold: true,
    color: ink.text,
    fontFace: theme.fontTitle,
    valign: "top",
  });
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.8,
      y: 3.55,
      w: 8.4,
      h: 0.8,
      fontSize: 16,
      color: ink.muted,
      transparency: ink.mutedTransparency,
      fontFace: theme.fontBody,
      valign: "top",
    });
  }
  addFooter(slide, theme, meta, isDarkColor(style.canvas));
  addBranding(slide, style.canvas);
}

function renderBullets(slide, pptx, data, theme, meta) {
  slide.background = { color: theme.bg };
  const y = addTitle(slide, pptx, theme, data);
  addBullets(slide, theme, data.bullets, {
    x: MARGIN_X + 0.22,
    y: y + 0.1,
    w: CONTENT_W - 0.22,
    h: FOOTER_Y - y - 0.3,
  });
  addFooter(slide, theme, meta);
  addBranding(slide, theme.bg);
}

function renderTwoColumn(slide, pptx, data, theme, meta) {
  slide.background = { color: theme.bg };
  const y = addTitle(slide, pptx, theme, data);
  const items = data.items.slice(0, 2);
  const gap = 0.5;
  const colW = (CONTENT_W - gap) / 2;
  const h = FOOTER_Y - y - 0.3;
  addRect(slide, pptx, {
    x: MARGIN_X + colW + gap / 2,
    y: y + 0.15,
    w: 0.01,
    h: h - 0.2,
    color: theme.muted,
    transparency: 60,
  });
  items.forEach((item, i) => {
    const x = MARGIN_X + i * (colW + gap);
    slide.addText(item.title || "", {
      x,
      y: y + 0.05,
      w: colW,
      h: 0.4,
      fontSize: 17,
      bold: true,
      color: theme.accent,
      fontFace: theme.fontTitle,
      valign: "middle",
    });
    const bullets = item.bullets.length ? item.bullets : [item.text];
    addBullets(slide, theme, bullets, {
      x,
      y: y + 0.55,
      w: colW,
      h: h - 0.55,
      max: 18,
    });
  });
  addFooter(slide, theme, meta);
  addBranding(slide, theme.bg);
}

function renderStats(slide, pptx, data, theme, meta) {
  slide.background = { color: theme.bg };
  const y = addTitle(slide, pptx, theme, data);
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
    const ink = addCard(slide, pptx, theme, c, 0.08);
    addRect(slide, pptx, {
      x: c.x + 0.3,
      y: c.y + 0.25,
      w: 0.5,
      h: 0.05,
      color: theme.accent,
    });
    slide.addText(item.title, {
      x: c.x + 0.25,
      y: c.y + 0.35,
      w: innerW,
      h: numberH,
      fontSize: numberSize,
      bold: true,
      color: styleOf(theme).band ? ink.title : theme.accent,
      fontFace: theme.fontTitle,
      valign: "middle",
    });
    const labelY = c.y + 0.4 + numberH;
    const labelH = c.h - (labelY - c.y) - 0.12;
    slide.addText(item.text, {
      x: c.x + 0.25,
      y: labelY,
      w: innerW,
      h: labelH,
      fontSize: fitText(item.text, { w: innerW, h: labelH, max: 14 }),
      color: ink.text,
      fontFace: theme.fontBody,
      valign: "top",
    });
  });
  addFooter(slide, theme, meta);
  addBranding(slide, theme.bg);
}

function renderCards(slide, pptx, data, theme, meta) {
  slide.background = { color: theme.bg };
  const y = addTitle(slide, pptx, theme, data);
  const items = data.items.slice(0, 6);
  const twoRows = items.length > 3;
  const cells = gridCells(items.length, {
    x: MARGIN_X,
    y: y + 0.2,
    w: CONTENT_W,
    h: twoRows ? FOOTER_Y - y - 0.5 : Math.min(2.4, FOOTER_Y - y - 0.5),
  });
  items.forEach((item, i) => {
    const c = cells[i];
    const ink = addCard(slide, pptx, theme, c, 0.06);
    addRect(slide, pptx, {
      x: c.x,
      y: c.y,
      w: styleOf(theme).cardFill ? 0.07 : c.w,
      h: styleOf(theme).cardFill ? c.h : 0.05,
      color: theme.accent,
    });
    const innerW = c.w - 0.4;
    const titleH = twoRows ? 0.4 : 0.55;
    slide.addText(item.title, {
      x: c.x + 0.25,
      y: c.y + 0.15,
      w: innerW,
      h: titleH,
      fontSize: fitText(item.title, {
        w: innerW,
        h: titleH,
        max: twoRows ? 14 : 16,
        font: "title",
      }),
      bold: true,
      color: ink.title,
      fontFace: theme.fontTitle,
      valign: "middle",
    });
    const textY = c.y + 0.2 + titleH;
    const textH = c.h - (textY - c.y) - 0.15;
    slide.addText(item.text, {
      x: c.x + 0.25,
      y: textY,
      w: innerW,
      h: textH,
      fontSize: fitText(item.text, {
        w: innerW,
        h: textH,
        max: twoRows ? 12 : 14,
      }),
      color: ink.text,
      fontFace: theme.fontBody,
      valign: "top",
    });
  });
  addFooter(slide, theme, meta);
  addBranding(slide, theme.bg);
}

function renderSteps(slide, pptx, data, theme, meta) {
  slide.background = { color: theme.bg };
  const y = addTitle(slide, pptx, theme, data);
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
    color: theme.muted,
    transparency: 60,
  });
  const marker = styleOf(theme).marker;
  items.forEach((item, i) => {
    const x = MARGIN_X + i * colW;
    if (marker !== "number")
      addRect(slide, pptx, {
        shape:
          marker === "square" ? pptx.ShapeType.rect : pptx.ShapeType.ellipse,
        x: x + colW / 2 - circle / 2,
        y: circleY,
        w: circle,
        h: circle,
        color: theme.accent,
      });
    slide.addText(String(i + 1), {
      x: x + colW / 2 - circle / 2,
      y: circleY,
      w: circle,
      h: circle,
      fontSize: marker === "number" ? 26 : 16,
      bold: true,
      color: marker === "number" ? theme.accent : "FFFFFF",
      fontFace: theme.fontTitle,
      align: "center",
      valign: "middle",
    });
    const innerW = colW - 0.2;
    const titleY = circleY + circle + 0.2;
    const titleH = 0.65;
    const textY = titleY + titleH + 0.05;
    const textH = FOOTER_Y - textY - 0.2;
    slide.addText(item.title, {
      x: x + 0.1,
      y: titleY,
      w: innerW,
      h: titleH,
      fontSize: fitText(item.title, {
        w: innerW,
        h: titleH,
        max: n > 3 ? 13 : 15,
        font: "title",
      }),
      bold: true,
      color: theme.text,
      fontFace: theme.fontTitle,
      align: "center",
      valign: "top",
    });
    slide.addText(item.text, {
      x: x + 0.1,
      y: textY,
      w: innerW,
      h: textH,
      fontSize: fitText(item.text, {
        w: innerW,
        h: textH,
        max: n > 3 ? 12 : 13,
      }),
      color: theme.muted,
      fontFace: theme.fontBody,
      align: "center",
      valign: "top",
    });
  });
  addFooter(slide, theme, meta);
  addBranding(slide, theme.bg);
}

function renderChart(slide, pptx, data, theme, meta) {
  slide.background = { color: theme.bg };
  const y = addTitle(slide, pptx, theme, data);
  const { type, categories, values } = data.chart;
  const series = [{ name: data.title, labels: categories, values }];
  const isRound = type === "pie" || type === "doughnut";
  const hasBullets = data.bullets.length > 0;
  const chartW = hasBullets ? 5.4 : CONTENT_W;
  const h = FOOTER_Y - y - 0.35;

  slide.addChart(pptx.ChartType[type], series, {
    x: MARGIN_X,
    y: y + 0.1,
    w: chartW,
    h,
    chartColors: [
      theme.accent,
      theme.accent2,
      theme.text,
      theme.muted,
      "9CA3AF",
      "D1D5DB",
    ],
    showValue: type === "bar",
    showPercent: isRound,
    showLegend: isRound,
    legendPos: isRound ? "r" : "b",
    legendColor: theme.muted,
    legendFontSize: 11,
    dataLabelColor: theme.muted,
    dataLabelFontSize: 10,
    dataLabelPosition: "outEnd",
    dataLabelFormatCode: isRound ? "0%" : "General",
    valAxisLabelFormatCode: "General",
    catAxisLabelColor: theme.muted,
    valAxisLabelColor: theme.muted,
    catAxisLabelFontSize: 11,
    valAxisLabelFontSize: 10,
    catAxisLineShow: false,
    valAxisLineShow: false,
    valGridLine: { color: theme.surface, style: "solid", size: 0.5 },
    catGridLine: { style: "none" },
    barGapWidthPct: 60,
    lineSize: 2.5,
    lineDataSymbolSize: 7,
    holeSize: 55,
    chartArea: { fill: { color: theme.bg } },
    plotArea: { fill: { color: theme.bg } },
  });

  if (hasBullets) {
    addBullets(slide, theme, data.bullets, {
      x: MARGIN_X + chartW + 0.4,
      y: y + 0.2,
      w: CONTENT_W - chartW - 0.4,
      h: h - 0.2,
      max: 14,
    });
  }
  addFooter(slide, theme, meta);
  addBranding(slide, theme.bg);
}

function renderTable(slide, pptx, data, theme, meta) {
  slide.background = { color: theme.bg };
  const y = addTitle(slide, pptx, theme, data);
  const { headers, rows: body } = data.table;
  const colCount = headers.length || body[0].length;

  const rowBorder = [
    { type: "none" },
    { type: "none" },
    { type: "solid", pt: 0.5, color: theme.surface },
    { type: "none" },
  ];
  const cell = (text, options) => ({
    text: String(text ?? ""),
    options: {
      fontFace: theme.fontBody,
      valign: "middle",
      margin: [4, 8, 4, 8],
      ...options,
    },
  });
  const rows = [];
  if (headers.length) {
    rows.push(
      Array.from({ length: colCount }, (_, c) =>
        cell(headers[c], {
          bold: true,
          fontSize: 12,
          color: "FFFFFF",
          fill: { color: isDarkColor(theme.bg) ? theme.accent : theme.dark },
          border: { type: "none" },
        })
      )
    );
  }
  body.forEach((row, i) => {
    rows.push(
      row.map((value) =>
        cell(value, {
          fontSize: body.length > 5 || colCount > 4 ? 10 : 12,
          color: theme.text,
          fill: { color: i % 2 === 1 ? theme.surface : theme.bg },
          border: rowBorder,
        })
      )
    );
  });

  slide.addTable(rows, {
    x: MARGIN_X,
    y: y + 0.15,
    w: CONTENT_W,
    colW: CONTENT_W / colCount,
    rowH: Math.min(0.5, (FOOTER_Y - y - 0.5) / rows.length),
    autoPage: false,
  });
  addFooter(slide, theme, meta);
  addBranding(slide, theme.bg);
}

function renderQuote(slide, pptx, data, theme, meta) {
  const style = styleOf(theme);
  const ink = onCanvas(theme, style.canvas);
  slide.background = { color: style.canvas };
  slide.addText("“", {
    x: 0.6,
    y: 0.3,
    w: 1.5,
    h: 1.5,
    fontSize: 120,
    bold: true,
    color: style.band ? ink.text : theme.accent,
    transparency: style.band ? 50 : 0,
    fontFace: "Georgia",
    valign: "top",
  });
  slide.addText(data.title, {
    x: 1.2,
    y: 1.5,
    w: 7.6,
    h: 2.2,
    fontSize: fitText(data.title, {
      w: 7.6,
      h: 2.2,
      max: 26,
      min: 16,
      font: "title",
    }),
    italic: true,
    color: ink.text,
    fontFace: theme.fontTitle,
    valign: "middle",
  });
  if (data.subtitle) {
    slide.addText(`—  ${data.subtitle}`, {
      x: 1.2,
      y: 3.85,
      w: 7.6,
      h: 0.5,
      fontSize: 14,
      color: ink.muted,
      transparency: ink.mutedTransparency,
      fontFace: theme.fontBody,
      valign: "top",
    });
  }
  addFooter(slide, theme, meta, isDarkColor(style.canvas));
  addBranding(slide, style.canvas);
}

const LAYOUTS = {
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
 * Renders one model-produced slide into a new pptx slide.
 * @param {import("pptxgenjs")} pptx
 * @param {import("./normalize.js").Slide} data
 * @param {object} theme - Palette from themes.js
 * @param {{n: number, total: number, sectionIndex?: number, firstInSection?: boolean}} meta - Slide position info for footer, numbering and dark/light rhythm
 */
function renderSlide(pptx, data, theme, meta) {
  const slide = pptx.addSlide();
  const { layout } = data;
  // The first content slide of each section and every stats slide render on
  // the dark canvas so a deck alternates instead of reading as one template.
  const onDark = layout === "stats" || meta.firstInSection;
  LAYOUTS[layout](slide, pptx, data, onDark ? invert(theme) : theme, meta);
  if (data.notes) slide.addNotes(data.notes);
}

module.exports = { renderCover, renderSlide };
