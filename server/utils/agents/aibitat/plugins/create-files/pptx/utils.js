const fs = require("fs");
const path = require("path");

/**
 * Renders a "topbar" layout — thin accent bar across the top of the slide.
 */
function renderTopbarLayout(slide, pptx, slideData, theme) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.07,
    fill: { color: theme.accentColor },
    line: { color: theme.accentColor },
  });

  if (slideData.title) {
    slide.addText(slideData.title, {
      x: theme.margin.x,
      y: 0.25,
      w: 9 - theme.margin.x,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: theme.titleColor,
      fontFace: theme.fontTitle,
      shadow: theme.shadow || undefined,
    });
  }
}

/**
 * Renders a "sidebar" layout — colored vertical bar on the left edge.
 */
function renderSidebarLayout(slide, pptx, slideData, theme) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.12,
    h: "100%",
    fill: { color: theme.accentColor },
    line: { color: theme.accentColor },
  });

  if (slideData.title) {
    slide.addText(slideData.title, {
      x: 0.35,
      y: 0.25,
      w: 9,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: theme.titleColor,
      fontFace: theme.fontTitle,
      shadow: theme.shadow || undefined,
    });
  }
}

/**
 * Renders an "underline" layout — title with a short accent line below it.
 */
function renderUnderlineLayout(slide, pptx, slideData, theme) {
  if (slideData.title) {
    slide.addText(slideData.title, {
      x: theme.margin.x,
      y: 0.3,
      w: 9 - theme.margin.x,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: theme.titleColor,
      fontFace: theme.fontTitle,
      shadow: theme.shadow || undefined,
    });
  }

  slide.addShape(pptx.ShapeType.rect, {
    x: theme.margin.x,
    y: 1.05,
    w: 3.5,
    h: 0.05,
    fill: { color: theme.accentColor },
    line: { color: theme.accentColor },
  });
}

/**
 * Renders a "card" layout — content sits inside a lightly shaded rounded card.
 */
function renderCardLayout(slide, pptx, slideData, theme) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: theme.margin.x - 0.1,
    y: 0.2,
    w: 9.2,
    h: 1.0,
    rectRadius: 0.1,
    fill: { color: theme.accentColor + "22" },
    line: { color: theme.accentColor + "44", pt: 0.5 },
  });

  if (slideData.title) {
    slide.addText(slideData.title, {
      x: theme.margin.x,
      y: 0.35,
      w: 9 - theme.margin.x,
      h: 0.7,
      fontSize: 26,
      bold: true,
      color: theme.titleColor,
      fontFace: theme.fontTitle,
      shadow: theme.shadow || undefined,
    });
  }
}

const LAYOUT_RENDERERS = {
  topbar: renderTopbarLayout,
  sidebar: renderSidebarLayout,
  underline: renderUnderlineLayout,
  card: renderCardLayout,
};

const ASSETS_PATH = path.join(__dirname, "../../../../../../storage/assets");

/**
 * Reads and returns the appropriate logo as a data URI.
 * @param {boolean} forDarkBackground - True to get light logo (for dark backgrounds)
 * @returns {string|null} Data URI with base64-encoded PNG, or null if file not found
 */
function getLogo(forDarkBackground) {
  const filename = forDarkBackground
    ? "anything-llm.png"
    : "anything-llm-invert.png";
  try {
    const base64 = fs.readFileSync(path.join(ASSETS_PATH, filename), "base64");
    return `image/png;base64,${base64}`;
  } catch {
    return null;
  }
}

/**
 * Determines if a hex color is "dark" (should use light text/logo).
 * @param {string} hexColor - Hex color without # (e.g., "1A1A2E")
 * @returns {boolean} True if the color is dark
 */
function isDarkColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

/**
 * Adds subtle AnythingLLM branding to the bottom-right corner of a slide.
 * Uses logo image if available, otherwise falls back to text.
 */
function addBranding(slide, theme) {
  const bgColor = theme.background || "FFFFFF";
  const isDark = isDarkColor(bgColor);
  const textColor = isDark ? "FFFFFF" : "000000";
  const logo = getLogo(isDark);

  slide.addText("created with", {
    x: 8.2,
    y: 4.95,
    w: 1.5,
    h: 0.15,
    fontSize: 6,
    color: textColor,
    transparency: 85,
    fontFace: "Calibri",
    align: "center",
    italic: true,
  });

  if (logo) {
    slide.addImage({
      data: logo,
      x: 8.2,
      y: 5.08,
      w: 1.5,
      h: 0.24,
      transparency: 85,
    });
  } else {
    slide.addText("AnythingLLM", {
      x: 8.2,
      y: 5.08,
      w: 1.5,
      h: 0.25,
      fontSize: 8,
      color: textColor,
      transparency: 85,
      fontFace: "Calibri",
      align: "center",
    });
  }
}

// ─── Content Helpers ─────────────────────────────────────────────────────────

/**
 * Adds body bullet points to a content slide.
 */
function addBulletContent(slide, content, theme, contentY) {
  if (!content || !Array.isArray(content) || content.length === 0) return;

  const bulletPoints = content.map((text) => ({
    text,
    options: {
      fontSize: 16,
      color: theme.bodyColor,
      fontFace: theme.fontBody,
      bullet: { type: "bullet", color: theme.bulletColor },
      paraSpaceAfter: 8,
    },
  }));

  slide.addText(bulletPoints, {
    x: theme.margin.x,
    y: contentY,
    w: 9 - theme.margin.x,
    h: 4.8 - contentY,
    valign: "top",
  });
}

module.exports = {
  LAYOUT_RENDERERS,
  renderTopbarLayout,
  renderSidebarLayout,
  renderUnderlineLayout,
  renderCardLayout,
  getLogo,
  isDarkColor,
  addBranding,
  addBulletContent,
};
