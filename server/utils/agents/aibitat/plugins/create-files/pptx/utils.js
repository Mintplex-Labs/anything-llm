const createFilesLib = require("../lib.js");

// All positioning assumes LAYOUT_16x9: 10 × 5.625 in.
const MARGIN_X = 0.7;
const CONTENT_W = 8.6; // 10 - 2 × MARGIN_X
const SLIDE_H = 5.625;

function isDarkColor(hexColor) {
  const hex = (hexColor || "FFFFFF").replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

const DEFAULT_ACCENTS = ["2563EB", "EA580C", "059669", "7C3AED", "DC2626"];

function themeAccents(theme) {
  return Array.isArray(theme?.accents) && theme.accents.length > 0
    ? theme.accents
    : DEFAULT_ACCENTS;
}

/**
 * The accent hue for one slide. Rotating per slide is what stops a deck from
 * reading as two colors; within a slide the hue stays fixed so it identifies
 * that slide rather than ranking anything on it.
 */
function slideAccent(theme, slideNumber) {
  const accents = themeAccents(theme);
  const n = Number.isFinite(slideNumber) ? slideNumber : 1;
  return accents[(Math.max(1, n) - 1) % accents.length];
}

function mixHex(fromHex, toHex, weight) {
  const parse = (h) => {
    const s = String(h || "000000").replace("#", "");
    return [0, 2, 4].map((i) => parseInt(s.substr(i, 2), 16) || 0);
  };
  const a = parse(fromHex);
  const b = parse(toHex);
  return a
    .map((v, i) => Math.round(v + (b[i] - v) * weight))
    .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/**
 * A barely-there wash of the accent over the slide surface, used as card and
 * callout fill. Kept faint so body text on top keeps its own contrast: the
 * accent identifies the block, it does not carry the text.
 */
function accentSurface(theme, accent, strength = 0.07) {
  return isDarkColor(theme.background)
    ? mixHex(theme.background, accent, strength + 0.05)
    : mixHex("FFFFFF", accent, strength);
}

// Brand lockup geometry: the "Gov AI VN168" wordmark stacked directly above the
// VN168 mark. The two are centred on one vertical axis rather than sharing a
// right edge - the logo is narrower than the wordmark, so right-aligning them
// would throw the lockup off balance. The axis is placed so the wider element
// (the wordmark) ends at the content margin.
const BRAND_AXIS = 8.8; // just inside the 9.3 content margin
// Deliberately far wider than the wordmark needs. A renderer that substitutes
// Calibri picks its own metrics, and a box sized to the nominal text width ends
// up wrapping or clipping the last glyph. The box is invisible, so overshooting
// costs nothing.
const BRAND_TEXT_W = 2.4;
const BRAND_TEXT_H = 0.16;
const BRAND_TEXT_Y = 5.05;
const BRAND_LOGO_H = 0.3;
const BRAND_LOGO_Y = BRAND_TEXT_Y + BRAND_TEXT_H + 0.02; // 5.23 -> bottom 5.53
const FALLBACK_LOGO_RATIO = 1.879; // gov-ai-vn168-logo.png is 684x364

let _brandLogo; // { data, ratio } - resolved once per process

/**
 * Loads the brand logo (custom system logo if configured, else the bundled
 * VN168 mark) as a data URI plus its true aspect ratio, so it is never
 * stretched into a mismatched box. Returns null when no logo is available.
 */
function getBrandLogo() {
  if (_brandLogo !== undefined) return _brandLogo;

  const readRatio = (buffer) => {
    // PNG: width/height are big-endian uint32 at byte 16/20 of the IHDR chunk
    if (buffer.length > 24 && buffer.slice(1, 4).toString() === "PNG") {
      const w = buffer.readUInt32BE(16);
      const h = buffer.readUInt32BE(20);
      if (w > 0 && h > 0) return w / h;
    }
    return FALLBACK_LOGO_RATIO;
  };

  try {
    const custom = createFilesLib.getLogo({ format: "buffer" });
    const customUri = createFilesLib.getLogo({ format: "dataUri" });
    if (custom && customUri && createFilesLib._customLogoBuffer) {
      _brandLogo = { data: customUri, ratio: readRatio(custom) };
      return _brandLogo;
    }

    const fs = require("fs");
    const path = require("path");
    const assets = path.join(__dirname, "..", "assets");
    // The -small variant is the same mark downscaled to 263x140; pptxgenjs
    // embeds the logo once per slide, so the full-size file bloats the deck.
    const small = path.join(assets, "gov-ai-vn168-logo-small.png");
    const logoPath = fs.existsSync(small)
      ? small
      : path.join(assets, "gov-ai-vn168-logo.png");
    const buffer = fs.readFileSync(logoPath);
    _brandLogo = {
      data: `image/png;base64,${buffer.toString("base64")}`,
      ratio: readRatio(buffer),
    };
  } catch {
    _brandLogo = null;
  }
  return _brandLogo;
}

function addBranding(slide, bgColor) {
  const isDark = isDarkColor(bgColor);
  const textColor = isDark ? "FFFFFF" : "000000";
  const logo = getBrandLogo();

  slide.addText("Gov AI VN168", {
    x: BRAND_AXIS - BRAND_TEXT_W / 2,
    y: BRAND_TEXT_Y,
    w: BRAND_TEXT_W,
    h: BRAND_TEXT_H,
    fontSize: 8,
    color: textColor,
    transparency: 35,
    fontFace: "Calibri",
    align: "center",
    valign: "middle",
    bold: true,
    margin: 0,
  });

  if (!logo) return;
  // Logo keeps its intrinsic aspect ratio; only the height is fixed.
  const logoW = BRAND_LOGO_H * logo.ratio;
  slide.addImage({
    data: logo.data,
    x: BRAND_AXIS - logoW / 2,
    y: BRAND_LOGO_Y,
    w: logoW,
    h: BRAND_LOGO_H,
  });
}

function addTopAccentBar(slide, pptx, theme) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.08,
    fill: { color: theme.accentColor },
    line: { color: theme.accentColor },
  });
}

function addAccentUnderline(slide, pptx, x, y, color) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 1.5,
    h: 0.035,
    fill: { color },
    line: { color },
  });
}

function addSlideFooter(slide, pptx, theme, slideNumber, totalSlides) {
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN_X,
    y: 5.0,
    w: CONTENT_W,
    h: 0.007,
    fill: { color: theme.footerLineColor },
    line: { color: theme.footerLineColor },
  });

  slide.addText(`${slideNumber}  /  ${totalSlides}`, {
    x: MARGIN_X,
    y: 5.07,
    w: 1.2,
    h: 0.25,
    fontSize: 8,
    color: theme.footerColor,
    fontFace: theme.fontBody,
    align: "left",
  });
}

/**
 * Translucent geometry behind the cover title. Purely decorative: it carries no
 * data, so it is drawn first and kept far enough from the type that nothing
 * competes with the title for contrast.
 */
function addTitleSlideDecor(slide, pptx, theme) {
  const accents = themeAccents(theme);
  // The bottom-right stays empty: that is where the brand lockup sits, and a
  // tinted disc behind it drags the logo's contrast down.
  const bleed = [
    // Large disc bleeding off the top-right, clear of the centred title block.
    { type: "ellipse", x: 8.1, y: -1.5, w: 3.5, h: 3.5, color: accents[3 % accents.length], transparency: 80 },
    // Smaller disc anchored off the bottom-left.
    { type: "ellipse", x: -1.0, y: 3.9, w: 2.9, h: 2.9, color: accents[2 % accents.length], transparency: 78 },
    // Wedge on the left flank, between the two discs.
    { type: "triangle", x: -0.7, y: 0.4, w: 2.0, h: 2.0, color: accents[0], transparency: 86, rotate: 195 },
    // Thin vertical rule that ties the cover to the content slides' top bar.
    { type: "rect", x: 0, y: 0, w: 0.14, h: SLIDE_H, color: accents[0], transparency: 0 },
  ];

  for (const s of bleed) {
    slide.addShape(pptx.ShapeType[s.type], {
      x: s.x,
      y: s.y,
      w: s.w,
      h: s.h,
      fill: { color: s.color, transparency: s.transparency },
      line: { color: s.color, transparency: 100 },
      ...(s.rotate ? { rotate: s.rotate } : {}),
    });
  }
}

function renderTitleSlide(slide, pptx, { title, author }, theme) {
  slide.background = { color: theme.titleSlideBackground };
  addTitleSlideDecor(slide, pptx, theme);

  slide.addText(title || "Untitled", {
    x: 1.0,
    y: 1.3,
    w: 8.0,
    h: 1.4,
    fontSize: 36,
    bold: true,
    color: theme.titleSlideTitleColor,
    fontFace: theme.fontTitle,
    align: "center",
    valign: "bottom",
  });

  addAccentUnderline(slide, pptx, 4.25, 2.9, theme.titleSlideAccentColor);

  if (author) {
    // The byline reads as a chip rather than a line of italic text - it sits
    // against decorative geometry, and an outline holds it apart from that.
    const chipH = 0.4;
    const chipW = Math.min(6.0, Math.max(1.6, String(author).length * 0.1 + 0.7));
    const chipX = 5.0 - chipW / 2;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: chipX,
      y: 3.18,
      w: chipW,
      h: chipH,
      fill: { color: theme.titleSlideAccentColor, transparency: 85 },
      line: { color: theme.titleSlideAccentColor, width: 1 },
      rectRadius: chipH / 2,
    });
    slide.addText(author, {
      x: chipX,
      y: 3.18,
      w: chipW,
      h: chipH,
      fontSize: 12,
      bold: true,
      color: theme.titleSlideTitleColor,
      fontFace: theme.fontBody,
      align: "center",
      valign: "middle",
      shrinkText: true,
    });
  }

  // Bottom accent strip
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: SLIDE_H - 0.1,
    w: "100%",
    h: 0.1,
    fill: { color: theme.titleSlideAccentColor },
    line: { color: theme.titleSlideAccentColor },
  });

  addBranding(slide, theme.titleSlideBackground);
}

/**
 * pptxgenjs takes an embedded image as `data` and a remote/local one as `path`.
 * Photos fetched from Pexels arrive as bytes so the deck opens offline.
 */
function imageSource(image) {
  if (!image) return null;
  if (image.data) return { data: image.data };
  if (image.url) return { path: image.url };
  return null;
}

// Divider photo panel: bleeds off the top and right edges, but stops short of
// the bottom so the slide number and the brand lockup keep a light surface to
// sit on. A photo that ran the full height would put the logo on a stranger's
// face - and its contrast would change with every deck. The frame is widened
// and heightened (vs. the original 5.55 / 4.75) so a "cover" crop zooms the
// photo less and the panel breathes instead of reading as a tight box.
const PANEL_X = 5.25;
const PANEL_W = 10 - PANEL_X;
const PANEL_H = 4.95;

/**
 * Draws the divider's photo panel. `sizing: cover` crops a 1200x627 landscape
 * photo into this taller frame; the alternative, `contain`, letterboxes it and
 * leaves two dead bands. No rule caps the panel - a bare bleeding photo reads
 * cleaner than one pinned by a colored bar along its foot.
 */
function addPhotoPanel(slide, source) {
  slide.addImage({
    ...source,
    x: PANEL_X,
    y: 0,
    w: PANEL_W,
    h: PANEL_H,
    sizing: { type: "cover", w: PANEL_W, h: PANEL_H },
  });
}

/**
 * Translucent geometry for a divider that has no photo, so an image-less deck
 * still reads as designed rather than as an empty slide with a heading.
 * Kept out of the bottom-right, where the brand lockup sits.
 */
function addDividerDecor(slide, pptx, accent) {
  const shapes = [
    { type: "ellipse", x: 6.6, y: -1.2, w: 4.4, h: 4.4, transparency: 88 },
    { type: "triangle", x: 5.9, y: 2.9, w: 1.7, h: 1.7, transparency: 92, rotate: 195 },
  ];
  for (const s of shapes) {
    slide.addShape(pptx.ShapeType[s.type], {
      x: s.x,
      y: s.y,
      w: s.w,
      h: s.h,
      fill: { color: accent, transparency: s.transparency },
      line: { color: accent, transparency: 100 },
      ...(s.rotate ? { rotate: s.rotate } : {}),
    });
  }
}

/**
 * Section divider. Shares the content slides' light surface: only the cover
 * carries a colored background, so the deck no longer flips dark/light every
 * few slides. The divider earns its separation from the accent rule, the
 * oversized numeral and the photo panel instead.
 */
function renderSectionSlide(
  slide,
  pptx,
  slideData,
  theme,
  slideNumber,
  totalSlides
) {
  slide.background = { color: theme.background };

  const accent = slideAccent(theme, slideNumber);
  const panel = imageSource(slideData.image);
  // Every non-cover slide wears the same frame - top accent bar and footer rule.
  // A divider that skipped them made the rules look like they came and went.
  const slideTheme = { ...theme, accentColor: accent };

  // Panel and decor go down first so the top bar lands on top of them and reads
  // as one unbroken rule across the slide, photo or not.
  if (panel) addPhotoPanel(slide, panel);
  else addDividerDecor(slide, pptx, accent);

  addTopAccentBar(slide, pptx, slideTheme);

  const textX = 0.62;
  const textW = panel ? PANEL_X - textX - 0.33 : 8.4;

  // Oversized numeral, sunk into the surface as texture rather than read as a
  // number - it marks position in the deck without competing with the title.
  slide.addText(String(slideNumber).padStart(2, "0"), {
    x: textX,
    y: 0.55,
    w: 2.2,
    h: 1.5,
    fontSize: 88,
    bold: true,
    color: accent,
    transparency: 80,
    fontFace: theme.fontTitle,
    valign: "middle",
  });

  slide.addText(slideData.title || "", {
    x: textX,
    y: 2.05,
    w: textW,
    h: 1.3,
    fontSize: panel ? 26 : 32,
    bold: true,
    color: theme.titleColor,
    fontFace: theme.fontTitle,
    valign: "bottom",
    shrinkText: true,
  });

  addAccentUnderline(slide, pptx, textX + 0.1, 3.5, accent);

  if (slideData.subtitle) {
    slide.addText(slideData.subtitle, {
      x: textX,
      y: 3.68,
      w: textW,
      h: 0.9,
      fontSize: panel ? 13 : 16,
      color: theme.subtitleColor,
      fontFace: theme.fontBody,
      valign: "top",
      shrinkText: true,
    });
  }

  addSlideFooter(slide, pptx, slideTheme, slideNumber, totalSlides);
  addBranding(slide, theme.background);

  if (slideData.notes) slide.addNotes(slideData.notes);
}

function renderContentSlide(
  slide,
  pptx,
  slideData,
  theme,
  slideNumber,
  totalSlides
) {
  // Content slides all share one light surface. Color arrives through the accent,
  // never through the background.
  slide.background = { color: theme.background };

  // Every slide takes the next hue in the theme's fixed accent order. The hue
  // then drives the top bar, the title rule, bullets and every block on the
  // slide, so the deck reads as a sequence of colors rather than one.
  const accent = slideAccent(theme, slideNumber);

  const slideTheme = {
    ...theme,
    accentColor: accent,
    bulletColor: accent,
  };

  addTopAccentBar(slide, pptx, slideTheme);

  let contentStartY = 0.4;

  if (slideData.title) {
    slide.addText(slideData.title, {
      x: MARGIN_X,
      y: 0.3,
      w: CONTENT_W,
      h: 0.65,
      fontSize: 24,
      bold: true,
      color: slideTheme.titleColor,
      fontFace: slideTheme.fontTitle,
      valign: "bottom",
    });
    contentStartY = 1.0;

    if (slideData.subtitle) {
      slide.addText(slideData.subtitle, {
        x: MARGIN_X,
        y: 1.0,
        w: CONTENT_W,
        h: 0.3,
        fontSize: 13,
        color: slideTheme.subtitleColor,
        fontFace: slideTheme.fontBody,
      });
      contentStartY = 1.35;
    }

    addAccentUnderline(
      slide,
      pptx,
      MARGIN_X,
      contentStartY + 0.05,
      slideTheme.accentColor
    );
    contentStartY += 0.25;
  }

  const footerY = 5.0;
  const contentHeight = footerY - contentStartY - 0.15;

  // A callout may either be the whole slide, or a closing statement beneath
  // bullets / cards / chips. It never shares a slide with a chart or a table -
  // those already fill the frame.
  const calloutText =
    typeof slideData.callout === "string"
      ? slideData.callout
      : slideData.callout?.text;
  const hasStructuredBody = !!(
    slideData.chart ||
    slideData.stats ||
    slideData.comparison ||
    slideData.timeline ||
    slideData.table
  );
  const hasLooseBody = !!(
    slideData.cards ||
    slideData.chips ||
    (Array.isArray(slideData.content) && slideData.content.length > 0)
  );
  const trailingCallout = !!calloutText && !hasStructuredBody && hasLooseBody;
  const CALLOUT_BLOCK = 1.1;
  const bodyHeight = trailingCallout
    ? contentHeight - CALLOUT_BLOCK
    : contentHeight;

  if (calloutText && !hasStructuredBody && !hasLooseBody) {
    addCalloutContent(
      slide,
      pptx,
      slideData.callout,
      slideTheme,
      contentStartY + Math.max(0, (contentHeight - 1.6) / 2),
      1.6
    );
  } else if (slideData.chart) {
    addChartContent(
      slide,
      pptx,
      slideData.chart,
      slideTheme,
      contentStartY,
      contentHeight
    );
  } else if (slideData.stats) {
    addStatsContent(slide, pptx, slideData.stats, slideTheme, contentStartY, contentHeight);
  } else if (slideData.cards) {
    addCardsContent(slide, pptx, slideData.cards, slideTheme, contentStartY, bodyHeight);
  } else if (slideData.comparison) {
    addComparisonContent(
      slide,
      pptx,
      slideData.comparison,
      slideTheme,
      contentStartY,
      contentHeight
    );
  } else if (slideData.timeline) {
    addTimelineContent(
      slide,
      pptx,
      slideData.timeline,
      slideTheme,
      contentStartY,
      contentHeight
    );
  } else if (slideData.table) {
    addTableContent(slide, pptx, slideData.table, slideTheme, contentStartY);
  } else if (slideData.chips) {
    addChipsContent(slide, pptx, slideData.chips, slideTheme, contentStartY, bodyHeight);
  } else {
    const sideSource = imageSource(slideData.image);
    if (sideSource) {
      const imagePos = slideData.image?.position || "right";
      const imgW = 3.8;
      const textW = 4.4;
      const gap = 0.4;

      let textX = MARGIN_X;
      let imgX = MARGIN_X + textW + gap;

      if (imagePos === "left") {
        imgX = MARGIN_X;
        textX = MARGIN_X + imgW + gap;
      }

      const imgH = bodyHeight - 0.1;
      try {
        slide.addImage({
          ...sideSource,
          x: imgX,
          y: contentStartY + 0.1,
          w: imgW,
          h: imgH,
          // "cover" crops to fill the box; "contain" would letterbox a 1200x627
          // photo inside a taller frame and leave dead space beside the text.
          sizing: { type: "cover", w: imgW, h: imgH },
          rounding: false,
        });
      } catch (e) {
        console.error("Failed to add image to slide:", e);
      }

      addBulletContent(
        slide,
        slideData.content,
        slideTheme,
        contentStartY,
        bodyHeight,
        textX,
        textW
      );
    } else {
      addBulletContent(
        slide,
        slideData.content,
        slideTheme,
        contentStartY,
        bodyHeight
      );
    }
  }

  if (trailingCallout) {
    addCalloutContent(
      slide,
      pptx,
      slideData.callout,
      slideTheme,
      contentStartY + bodyHeight + 0.16,
      CALLOUT_BLOCK - 0.22
    );
  }

  addSlideFooter(slide, pptx, slideTheme, slideNumber, totalSlides);
  addBranding(slide, slideTheme.background);

  if (slideData.notes) slide.addNotes(slideData.notes);
}

/**
 * Closing slide. Shares the content slides' light surface and framing, but is
 * deliberately sparse: one large "Cảm ơn" set against the accent, with the deck
 * title recessive beneath it. Added as the final slide of every deck so the
 * presentation ends on a proper sign-off rather than trailing off after the
 * last content slide.
 */
function renderClosingSlide(slide, pptx, slideData, theme, slideNumber, totalSlides) {
  slide.background = { color: theme.background };
  const accent = slideAccent(theme, slideNumber);
  const slideTheme = { ...theme, accentColor: accent };

  addTopAccentBar(slide, pptx, slideTheme);

  // A tinted band anchors the sign-off, matching the quote slide's surface so
  // the closing reads as an intentional bookend, not an empty content slide.
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1.7,
    w: "100%",
    h: 2.1,
    fill: { color: accentSurface(theme, accent, 0.06) },
    line: { color: accent, transparency: 100 },
  });

  slide.addText(slideData.headline || "Cảm ơn!", {
    x: 1.0,
    y: 1.85,
    w: 8.0,
    h: 1.1,
    fontSize: 44,
    bold: true,
    color: accent,
    fontFace: theme.fontTitle,
    align: "center",
    valign: "middle",
    shrinkText: true,
  });

  addAccentUnderline(slide, pptx, 4.25, 3.0, accent);

  if (slideData.subtitle) {
    slide.addText(slideData.subtitle, {
      x: 1.5,
      y: 3.15,
      w: 7.0,
      h: 0.6,
      fontSize: 15,
      color: theme.subtitleColor,
      fontFace: theme.fontBody,
      align: "center",
      valign: "middle",
      shrinkText: true,
    });
  }

  addSlideFooter(slide, pptx, slideTheme, slideNumber, totalSlides);
  addBranding(slide, theme.background);
}

function renderBlankSlide(slide, pptx, theme, slideNumber, totalSlides) {
  slide.background = { color: theme.background };
  const slideTheme = { ...theme, accentColor: slideAccent(theme, slideNumber) };
  addTopAccentBar(slide, pptx, slideTheme);
  addSlideFooter(slide, pptx, slideTheme, slideNumber, totalSlides);
  addBranding(slide, theme.background);
}

function addBulletContent(slide, content, theme, startY, maxHeight, customX, customW) {
  if (!Array.isArray(content) || content.length === 0) return;

  const bulletPoints = content.map((text) => ({
    text,
    options: {
      fontSize: customW !== undefined ? 13 : 15,
      color: theme.bodyColor,
      fontFace: theme.fontBody,
      bullet: { code: "25AA", color: theme.bulletColor },
      paraSpaceAfter: customW !== undefined ? 8 : 10,
    },
  }));

  slide.addText(bulletPoints, {
    x: customX !== undefined ? customX : MARGIN_X,
    y: startY,
    w: customW !== undefined ? customW : CONTENT_W,
    h: maxHeight,
    valign: "top",
  });
}

/**
 * Categorical series colors, assigned in this fixed order and never cycled.
 * Validated (lightness band, chroma floor, CVD separation, contrast) against
 * both light and dark chart surfaces.
 */
const CHART_SERIES_COLORS = [
  "2563EB",
  "EA580C",
  "059669",
  "7C3AED",
  "DC2626",
];

const PPTX_CHART_TYPE = {
  bar: "bar",
  column: "bar",
  line: "line",
  pie: "pie",
  doughnut: "doughnut",
  area: "area",
};

/**
 * Renders a native, editable PowerPoint chart (no image, no network).
 * @param {object} chartData - { type, categories: string[], series: [{name, values:number[]}] }
 */
function addChartContent(slide, pptx, chartData, theme, startY, maxHeight) {
  if (!chartData || !Array.isArray(chartData.categories)) return;
  const series = Array.isArray(chartData.series) ? chartData.series : [];
  if (series.length === 0) return;

  const type = PPTX_CHART_TYPE[String(chartData.type || "bar").toLowerCase()] || "bar";
  const isPie = type === "pie" || type === "doughnut";

  const data = series.slice(0, CHART_SERIES_COLORS.length).map((s, i) => ({
    name: String(s.name || `Chuỗi ${i + 1}`),
    labels: chartData.categories.map(String),
    values: chartData.categories.map((_, j) => {
      const n = Number(s.values?.[j]);
      return Number.isFinite(n) ? n : 0;
    }),
  }));

  // A single series is named by the slide title - no legend box needed.
  const showLegend = !isPie && data.length >= 2;

  slide.addChart(pptx.ChartType[type], data, {
    x: MARGIN_X,
    y: startY,
    w: CONTENT_W,
    h: maxHeight,
    chartColors: CHART_SERIES_COLORS.slice(0, isPie ? chartData.categories.length : data.length),
    showLegend: showLegend || isPie,
    legendPos: "b",
    legendFontFace: theme.fontBody,
    legendFontSize: 10,
    legendColor: theme.bodyColor,
    showTitle: false,
    // Pie slices are unreadable without their share; bars/lines read off the axis.
    showPercent: isPie,
    showValue: false,
    dataLabelFontFace: theme.fontBody,
    dataLabelFontSize: 10,
    dataLabelColor: isPie ? "FFFFFF" : theme.bodyColor,
    catAxisLabelFontFace: theme.fontBody,
    catAxisLabelFontSize: 10,
    catAxisLabelColor: theme.subtitleColor,
    valAxisLabelFontFace: theme.fontBody,
    valAxisLabelFontSize: 10,
    valAxisLabelColor: theme.subtitleColor,
    catGridLine: { style: "none" },
    valGridLine: { color: theme.footerLineColor, size: 0.5 },
    barGapWidthPct: 60,
    lineSize: 2,
    lineSmooth: false,
  });
}

/**
 * Big-number KPI tiles (2-4). A headline figure is not a chart - it is a number
 * set large, with its label recessive underneath.
 */
function addStatsContent(slide, pptx, stats, theme, startY, maxHeight) {
  if (!Array.isArray(stats) || stats.length === 0) return;
  const tiles = stats.slice(0, 4);
  const gap = 0.28;
  const tileW = (CONTENT_W - gap * (tiles.length - 1)) / tiles.length;
  const tileH = Math.min(1.9, maxHeight - 0.2);
  const y = startY + Math.max(0, (maxHeight - tileH) / 2 - 0.1);

  const accents = themeAccents(theme);

  tiles.forEach((stat, i) => {
    const x = MARGIN_X + i * (tileW + gap);
    // Each tile is a distinct entity, so it keeps its own hue. The hue never
    // encodes rank - reordering the tiles must not repaint them.
    const accent = accents[i % accents.length];

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: tileW,
      h: tileH,
      fill: { color: accentSurface(theme, accent) },
      line: { color: mixHex(accentSurface(theme, accent), accent, 0.35), width: 0.75 },
      rectRadius: 0.08,
    });
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y: y + tileH - 0.07,
      w: tileW,
      h: 0.07,
      fill: { color: accent },
      line: { color: accent },
    });

    // On a stat tile the number IS the mark, not a value label beside one, so it
    // carries the tile's hue. The caption below stays in text ink.
    slide.addText(String(stat.value ?? ""), {
      x: x + 0.1,
      y: y + 0.28,
      w: tileW - 0.2,
      h: 0.85,
      fontSize: 34,
      bold: true,
      color: accent,
      fontFace: theme.fontTitle,
      align: "center",
      valign: "middle",
      shrinkText: true,
    });

    slide.addText(String(stat.label ?? ""), {
      x: x + 0.12,
      y: y + 1.13,
      w: tileW - 0.24,
      h: tileH - 1.27,
      fontSize: 11,
      color: theme.subtitleColor,
      fontFace: theme.fontBody,
      align: "center",
      valign: "top",
    });
  });
}

/**
 * A grid of 2-4 cards, each a tinted panel with a colored rule along its foot
 * and a large index numeral. Use when several parallel ideas each need a title
 * plus a sentence - a bulleted list flattens that structure.
 */
function addCardsContent(slide, pptx, cards, theme, startY, maxHeight) {
  const items = (Array.isArray(cards) ? cards : []).slice(0, 4);
  if (items.length === 0) return;

  const accents = themeAccents(theme);
  const gap = 0.26;
  const cardW = (CONTENT_W - gap * (items.length - 1)) / items.length;
  const cardH = Math.min(2.6, maxHeight);
  const y = startY + Math.max(0, (maxHeight - cardH) / 2);
  const RULE_H = 0.07;

  items.forEach((card, i) => {
    const x = MARGIN_X + i * (cardW + gap);
    const accent = accents[i % accents.length];
    const surface = accentSurface(theme, accent);

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: cardW,
      h: cardH,
      fill: { color: surface },
      line: { color: mixHex(surface, accent, 0.3), width: 0.75 },
      rectRadius: 0.06,
    });
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y: y + cardH - RULE_H,
      w: cardW,
      h: RULE_H,
      fill: { color: accent },
      line: { color: accent },
    });

    slide.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.16,
      y: y + 0.12,
      w: cardW - 0.32,
      h: 0.42,
      fontSize: 20,
      bold: true,
      color: accent,
      transparency: 45,
      fontFace: theme.fontTitle,
      valign: "middle",
    });

    slide.addText(String(card.title || ""), {
      x: x + 0.16,
      y: y + 0.56,
      w: cardW - 0.32,
      h: 0.5,
      fontSize: 13,
      bold: true,
      color: theme.titleColor,
      fontFace: theme.fontTitle,
      valign: "top",
      shrinkText: true,
    });

    if (!card.text) return;
    slide.addText(String(card.text), {
      x: x + 0.16,
      y: y + 1.08,
      w: cardW - 0.32,
      h: cardH - 1.08 - RULE_H - 0.12,
      fontSize: 11,
      color: theme.bodyColor,
      fontFace: theme.fontBody,
      valign: "top",
      shrinkText: true,
    });
  });
}

/**
 * A tinted box with a thick colored rule down its left edge, for the one
 * sentence the slide exists to deliver.
 */
function addCalloutContent(slide, pptx, callout, theme, startY, height) {
  const text = typeof callout === "string" ? callout : callout?.text;
  if (!text) return;
  const label = typeof callout === "object" ? callout.label : "";

  const accent = theme.accentColor;
  const surface = accentSurface(theme, accent, 0.09);
  const RULE_W = 0.07;

  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN_X,
    y: startY,
    w: CONTENT_W,
    h: height,
    fill: { color: surface },
    line: { color: surface },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN_X,
    y: startY,
    w: RULE_W,
    h: height,
    fill: { color: accent },
    line: { color: accent },
  });

  const textX = MARGIN_X + RULE_W + 0.22;
  const textW = CONTENT_W - RULE_W - 0.42;
  let textY = startY + 0.1;
  let textH = height - 0.2;

  if (label) {
    slide.addText(String(label).toUpperCase(), {
      x: textX,
      y: startY + 0.09,
      w: textW,
      h: 0.24,
      fontSize: 9,
      bold: true,
      charSpacing: 1,
      color: accent,
      fontFace: theme.fontBody,
      valign: "middle",
    });
    textY = startY + 0.36;
    textH = height - 0.46;
  }

  slide.addText(String(text), {
    x: textX,
    y: textY,
    w: textW,
    h: textH,
    fontSize: 14,
    color: theme.titleColor,
    fontFace: theme.fontBody,
    valign: "middle",
    shrinkText: true,
  });
}

/**
 * A wrapped row of outlined pills. Right when the content is a set of short
 * peer labels (fields, tools, criteria) that carry no order and no measure -
 * bulleting them implies a hierarchy that isn't there.
 */
function addChipsContent(slide, pptx, chips, theme, startY, maxHeight) {
  const items = (Array.isArray(chips) ? chips : [])
    .map((c) => String(c || "").trim())
    .filter(Boolean)
    .slice(0, 12);
  if (items.length === 0) return;

  const accents = themeAccents(theme);
  const CHIP_H = 0.42;
  const ROW_GAP = 0.16;
  const COL_GAP = 0.16;
  const PAD = 0.34; // horizontal padding inside a chip
  // Calibri at 12pt averages ~0.078in per character; close enough to lay out
  // pills without measuring text, and shrinkText absorbs the error.
  const widthOf = (t) => Math.min(CONTENT_W, Math.max(0.9, t.length * 0.078 + PAD * 2));

  // Greedy wrap into rows that fit the content width.
  const rows = [[]];
  let rowW = 0;
  for (const t of items) {
    const w = widthOf(t);
    if (rowW > 0 && rowW + COL_GAP + w > CONTENT_W) {
      rows.push([]);
      rowW = 0;
    }
    rows[rows.length - 1].push({ text: t, w });
    rowW += (rowW > 0 ? COL_GAP : 0) + w;
  }

  const blockH = rows.length * CHIP_H + (rows.length - 1) * ROW_GAP;
  let y = startY + Math.max(0, (maxHeight - blockH) / 2);
  let idx = 0;

  for (const row of rows) {
    const rowWidth =
      row.reduce((s, c) => s + c.w, 0) + COL_GAP * (row.length - 1);
    let x = MARGIN_X + Math.max(0, (CONTENT_W - rowWidth) / 2);

    for (const chip of row) {
      const accent = accents[idx++ % accents.length];
      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: chip.w,
        h: CHIP_H,
        fill: { color: accentSurface(theme, accent, 0.08) },
        line: { color: accent, width: 1 },
        rectRadius: CHIP_H / 2,
      });
      slide.addText(chip.text, {
        x,
        y,
        w: chip.w,
        h: CHIP_H,
        fontSize: 12,
        bold: true,
        color: accent,
        fontFace: theme.fontBody,
        align: "center",
        valign: "middle",
        shrinkText: true,
      });
      x += chip.w + COL_GAP;
    }
    y += CHIP_H + ROW_GAP;
  }
}

/**
 * Two-column comparison (e.g. Hiện trạng vs Đề xuất, Ưu điểm vs Hạn chế).
 */
function addComparisonContent(slide, pptx, comparison, theme, startY, maxHeight) {
  const columns = [comparison?.left, comparison?.right].filter(
    (c) => c && (c.title || Array.isArray(c.points))
  );
  if (columns.length === 0) return;

  const gap = 0.4;
  const colW = (CONTENT_W - gap) / 2;
  const accents = themeAccents(theme);

  columns.slice(0, 2).forEach((col, i) => {
    const x = MARGIN_X + i * (colW + gap);
    const accent = accents[i % accents.length];

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: startY,
      w: colW,
      h: maxHeight,
      fill: { color: accentSurface(theme, accent) },
      line: { color: mixHex(accentSurface(theme, accent), accent, 0.3), width: 0.75 },
      rectRadius: 0.06,
    });

    slide.addShape(pptx.ShapeType.rect, {
      x,
      y: startY,
      w: colW,
      h: 0.42,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(String(col.title || ""), {
      x: x + 0.15,
      y: startY,
      w: colW - 0.3,
      h: 0.42,
      fontSize: 13,
      bold: true,
      color: "FFFFFF",
      fontFace: theme.fontTitle,
      valign: "middle",
    });

    const points = Array.isArray(col.points) ? col.points : [];
    if (points.length === 0) return;
    slide.addText(
      points.map((text) => ({
        text: String(text),
        options: {
          fontSize: 12,
          color: theme.bodyColor,
          fontFace: theme.fontBody,
          bullet: { code: "25AA", color: accent },
          paraSpaceAfter: 8,
        },
      })),
      {
        x: x + 0.18,
        y: startY + 0.58,
        w: colW - 0.36,
        h: maxHeight - 0.75,
        valign: "top",
      }
    );
  });
}

/**
 * Horizontal timeline / roadmap: a connecting rule with numbered nodes.
 */
function addTimelineContent(slide, pptx, timeline, theme, startY, maxHeight) {
  const steps = (Array.isArray(timeline) ? timeline : []).slice(0, 5);
  if (steps.length === 0) return;

  const accents = themeAccents(theme);
  const nodeD = 0.44;
  const centerY = startY + Math.min(1.0, maxHeight / 3);
  const stepW = CONTENT_W / steps.length;

  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN_X + stepW / 2,
    y: centerY + nodeD / 2 - 0.02,
    w: CONTENT_W - stepW,
    h: 0.035,
    fill: { color: theme.footerLineColor },
    line: { color: theme.footerLineColor },
  });

  steps.forEach((step, i) => {
    const cx = MARGIN_X + stepW * i + stepW / 2;
    const accent = accents[i % accents.length];

    slide.addShape(pptx.ShapeType.ellipse, {
      x: cx - nodeD / 2,
      y: centerY,
      w: nodeD,
      h: nodeD,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(String(i + 1), {
      x: cx - nodeD / 2,
      y: centerY,
      w: nodeD,
      h: nodeD,
      fontSize: 12,
      bold: true,
      color: "FFFFFF",
      fontFace: theme.fontTitle,
      align: "center",
      valign: "middle",
    });

    slide.addText(String(step.label || ""), {
      x: cx - stepW / 2 + 0.08,
      y: centerY + nodeD + 0.14,
      w: stepW - 0.16,
      h: 0.32,
      fontSize: 12,
      bold: true,
      color: theme.titleColor,
      fontFace: theme.fontTitle,
      align: "center",
      valign: "top",
    });

    if (!step.text) return;
    slide.addText(String(step.text), {
      x: cx - stepW / 2 + 0.08,
      y: centerY + nodeD + 0.5,
      w: stepW - 0.16,
      h: maxHeight - (centerY - startY) - nodeD - 0.6,
      fontSize: 10,
      color: theme.bodyColor,
      fontFace: theme.fontBody,
      align: "center",
      valign: "top",
    });
  });
}

/**
 * Full-slide pull quote. Deliberately sparse - one idea, set large. Light
 * surface like every other non-cover slide; the accent does the work.
 */
function renderQuoteSlide(slide, pptx, slideData, theme, slideNumber, totalSlides) {
  slide.background = { color: theme.background };
  const quote = slideData.quote || slideData.title || "";
  const accent = slideAccent(theme, slideNumber);
  const slideTheme = { ...theme, accentColor: accent };

  addTopAccentBar(slide, pptx, slideTheme);

  // A tinted band behind the quote, so the slide has a surface of its own
  // without introducing a second background color to the deck.
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1.05,
    w: "100%",
    h: 3.0,
    fill: { color: accentSurface(theme, accent, 0.06) },
    line: { color: accent, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1.05,
    w: 0.14,
    h: 3.0,
    fill: { color: accent },
    line: { color: accent },
  });

  slide.addText("“", {
    x: 0.75,
    y: 1.0,
    w: 1.2,
    h: 1.2,
    fontSize: 96,
    bold: true,
    color: accent,
    transparency: 55,
    fontFace: theme.fontTitle,
    valign: "middle",
  });

  slide.addText(String(quote), {
    x: 1.6,
    y: 1.6,
    w: 7.0,
    h: 1.7,
    fontSize: 26,
    italic: true,
    color: theme.titleColor,
    fontFace: theme.fontTitle,
    align: "center",
    valign: "middle",
    shrinkText: true,
  });

  if (slideData.attribution) {
    slide.addText(`— ${slideData.attribution}`, {
      x: 1.6,
      y: 3.35,
      w: 7.0,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: accent,
      fontFace: theme.fontBody,
      align: "center",
    });
  }

  addSlideFooter(slide, pptx, slideTheme, slideNumber, totalSlides);
  addBranding(slide, theme.background);
  if (slideData.notes) slide.addNotes(slideData.notes);
}

function addTableContent(slide, pptx, tableData, theme, startY) {
  if (!tableData) return;

  const rows = [];

  if (tableData.headers?.length > 0) {
    rows.push(
      tableData.headers.map((header) => ({
        text: header,
        options: {
          bold: true,
          fontSize: 12,
          fontFace: theme.fontBody,
          color: theme.tableHeaderColor,
          fill: { color: theme.tableHeaderBg },
          align: "left",
          valign: "middle",
          margin: [4, 8, 4, 8],
        },
      }))
    );
  }

  if (tableData.rows?.length > 0) {
    tableData.rows.forEach((row, idx) => {
      rows.push(
        row.map((cell) => ({
          text: cell,
          options: {
            fontSize: 11,
            fontFace: theme.fontBody,
            color: theme.bodyColor,
            fill: {
              color: idx % 2 === 1 ? theme.tableAltRowBg : theme.background,
            },
            align: "left",
            valign: "middle",
            margin: [4, 8, 4, 8],
          },
        }))
      );
    });
  }

  if (rows.length === 0) return;

  const colCount = rows[0].length;
  slide.addTable(rows, {
    x: MARGIN_X,
    y: startY,
    w: CONTENT_W,
    colW: CONTENT_W / colCount,
    rowH: 0.4,
    border: { type: "solid", pt: 0.5, color: theme.tableBorderColor },
  });
}

module.exports = {
  isDarkColor,
  mixHex,
  slideAccent,
  accentSurface,
  addBranding,
  addTopAccentBar,
  addAccentUnderline,
  addSlideFooter,
  renderTitleSlide,
  renderSectionSlide,
  renderContentSlide,
  renderBlankSlide,
  renderQuoteSlide,
  renderClosingSlide,
  addBulletContent,
  addTableContent,
  addChartContent,
  addStatsContent,
  addCardsContent,
  addCalloutContent,
  addChipsContent,
  addComparisonContent,
  addTimelineContent,
  CHART_SERIES_COLORS,
};
