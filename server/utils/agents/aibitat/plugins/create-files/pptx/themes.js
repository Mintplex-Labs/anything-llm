/**
 * Curated presentation themes for pptxgenjs.
 *
 * Each theme is a complete design system: title-slide palette, content-slide
 * palette, table styling, footer colors, and typography.  The rendering code
 * in utils.js consumes these tokens to produce consistent, professional slides.
 *
 * Themes: default · corporate · dark · minimal · creative
 */

const THEMES = {
  default: {
    name: "Professional",
    description: "Clean and versatile — works for any presentation",

    titleSlideBackground: "1E293B",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "94A3B8",
    titleSlideAccentColor: "3B82F6",

    background: "FFFFFF",
    titleColor: "0F172A",
    subtitleColor: "64748B",
    bodyColor: "334155",
    accentColor: "2563EB",
    bulletColor: "2563EB",

    tableHeaderBg: "1E293B",
    tableHeaderColor: "FFFFFF",
    tableAltRowBg: "F8FAFC",
    tableBorderColor: "E2E8F0",

    footerColor: "94A3B8",
    footerLineColor: "E2E8F0",

    fontTitle: "Calibri",
    fontBody: "Calibri",
  },

  corporate: {
    name: "Corporate",
    description: "Refined and authoritative — ideal for business and finance",

    titleSlideBackground: "0C1929",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "7B96B5",
    titleSlideAccentColor: "C9943E",

    background: "FFFFFF",
    titleColor: "0C1929",
    subtitleColor: "5A6D82",
    bodyColor: "2C3E50",
    accentColor: "1A5276",
    bulletColor: "1A5276",

    tableHeaderBg: "0C1929",
    tableHeaderColor: "FFFFFF",
    tableAltRowBg: "F4F7FA",
    tableBorderColor: "D5DBE2",

    footerColor: "8B9DB3",
    footerLineColor: "D5DBE2",

    fontTitle: "Calibri",
    fontBody: "Calibri",
  },

  dark: {
    name: "Dark",
    description: "Sleek dark theme — great for tech and product presentations",

    titleSlideBackground: "0F0F1A",
    titleSlideTitleColor: "F8FAFC",
    titleSlideSubtitleColor: "7C8DB5",
    titleSlideAccentColor: "818CF8",

    background: "18181B",
    titleColor: "F4F4F5",
    subtitleColor: "A1A1AA",
    bodyColor: "D4D4D8",
    accentColor: "6366F1",
    bulletColor: "818CF8",

    tableHeaderBg: "6366F1",
    tableHeaderColor: "FFFFFF",
    tableAltRowBg: "1F1F24",
    tableBorderColor: "3F3F46",

    footerColor: "71717A",
    footerLineColor: "3F3F46",

    fontTitle: "Calibri",
    fontBody: "Calibri",
  },

  minimal: {
    name: "Minimal",
    description: "Ultra-clean with maximum whitespace — lets content speak",

    titleSlideBackground: "F5F5F5",
    titleSlideTitleColor: "171717",
    titleSlideSubtitleColor: "737373",
    titleSlideAccentColor: "A3A3A3",

    background: "FFFFFF",
    titleColor: "171717",
    subtitleColor: "737373",
    bodyColor: "404040",
    accentColor: "525252",
    bulletColor: "A3A3A3",

    tableHeaderBg: "262626",
    tableHeaderColor: "FFFFFF",
    tableAltRowBg: "FAFAFA",
    tableBorderColor: "E5E5E5",

    footerColor: "A3A3A3",
    footerLineColor: "E5E5E5",

    fontTitle: "Calibri",
    fontBody: "Calibri Light",
  },

  creative: {
    name: "Creative",
    description: "Bold and expressive — perfect for pitches and creative work",

    titleSlideBackground: "2E1065",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "C4B5FD",
    titleSlideAccentColor: "A78BFA",

    background: "FFFFFF",
    titleColor: "3B0764",
    subtitleColor: "7C3AED",
    bodyColor: "374151",
    accentColor: "7C3AED",
    bulletColor: "7C3AED",

    tableHeaderBg: "5B21B6",
    tableHeaderColor: "FFFFFF",
    tableAltRowBg: "FAF5FF",
    tableBorderColor: "E9D5FF",

    footerColor: "A78BFA",
    footerLineColor: "E9D5FF",

    fontTitle: "Calibri",
    fontBody: "Calibri",
  },
};

/**
 * Get a theme by name, falling back to default if not found.
 * @param {string} themeName
 * @returns {object} Theme configuration
 */
function getTheme(themeName) {
  const key = (themeName || "default").toLowerCase().trim();
  return THEMES[key] || THEMES.default;
}

/**
 * @returns {string[]} Available theme identifiers
 */
function getAvailableThemes() {
  return Object.keys(THEMES);
}

/**
 * @returns {object[]} Array of { id, name, description } for documentation
 */
function getThemeDescriptions() {
  return Object.entries(THEMES).map(([id, t]) => ({
    id,
    name: t.name,
    description: t.description,
  }));
}

module.exports = { THEMES, getTheme, getAvailableThemes, getThemeDescriptions };
