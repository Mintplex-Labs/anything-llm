/**
 * Predefined presentation themes for pptxgenjs.
 * Each theme defines colors, typography, layout style, spacing, and visual effects.
 */

const THEMES = {
  default: {
    name: "Default",
    description: "Clean white background with dark text",
    // Colors
    background: "FFFFFF",
    titleSlideBackground: "FFFFFF",
    titleColor: "363636",
    titleSlideTitleColor: "363636",
    titleSlideSubtitleColor: "666666",
    subtitleColor: "666666",
    bodyColor: "404040",
    accentColor: "0078D4",
    bulletColor: "0078D4",
    // Typography
    fontTitle: "Calibri",
    fontBody: "Calibri Light",
    // Layout
    layoutStyle: "topbar", // "topbar" | "sidebar" | "underline" | "card"
    margin: { x: 0.5, y: 0.5 },
    contentY: 1.3,
    // Effects
    shadow: null,
  },

  corporate: {
    name: "Corporate",
    description: "Professional blue tones, ideal for business presentations",
    background: "FFFFFF",
    titleSlideBackground: "1A365D",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "A0C4E8",
    titleColor: "1A365D",
    subtitleColor: "4A6FA5",
    bodyColor: "2D3748",
    accentColor: "2B6CB0",
    bulletColor: "2B6CB0",
    fontTitle: "Cambria",
    fontBody: "Calibri",
    layoutStyle: "sidebar",
    margin: { x: 0.5, y: 0.5 },
    contentY: 1.4,
    shadow: {
      type: "outer",
      blur: 3,
      offset: 2,
      angle: 45,
      color: "AAAAAA",
      opacity: 0.3,
    },
  },

  modern: {
    name: "Modern",
    description: "Contemporary dark theme with vibrant accents",
    background: "1A1A2E",
    titleSlideBackground: "16213E",
    titleSlideTitleColor: "EAEAEA",
    titleSlideSubtitleColor: "A0A0A0",
    titleColor: "EAEAEA",
    subtitleColor: "B0B0B0",
    bodyColor: "CCCCCC",
    accentColor: "E94560",
    bulletColor: "E94560",
    fontTitle: "Segoe UI",
    fontBody: "Segoe UI Light",
    layoutStyle: "underline",
    margin: { x: 0.6, y: 0.5 },
    contentY: 1.35,
    shadow: {
      type: "outer",
      blur: 6,
      offset: 3,
      angle: 45,
      color: "000000",
      opacity: 0.5,
    },
  },

  minimal: {
    name: "Minimal",
    description: "Ultra-clean with subtle gray tones",
    background: "FAFAFA",
    titleSlideBackground: "F5F5F5",
    titleSlideTitleColor: "1A1A1A",
    titleSlideSubtitleColor: "757575",
    titleColor: "1A1A1A",
    subtitleColor: "757575",
    bodyColor: "424242",
    accentColor: "9E9E9E",
    bulletColor: "BDBDBD",
    fontTitle: "Arial",
    fontBody: "Arial",
    layoutStyle: "underline",
    margin: { x: 0.75, y: 0.6 },
    contentY: 1.5,
    shadow: null,
  },

  vibrant: {
    name: "Vibrant",
    description: "Bold and colorful for creative presentations",
    background: "FFFFFF",
    titleSlideBackground: "6B46C1",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "E9D8FD",
    titleColor: "553C9A",
    subtitleColor: "805AD5",
    bodyColor: "2D3748",
    accentColor: "ED8936",
    bulletColor: "ED8936",
    fontTitle: "Trebuchet MS",
    fontBody: "Calibri",
    layoutStyle: "card",
    margin: { x: 0.5, y: 0.5 },
    contentY: 1.3,
    shadow: {
      type: "outer",
      blur: 8,
      offset: 4,
      angle: 45,
      color: "805AD5",
      opacity: 0.2,
    },
  },

  dark: {
    name: "Dark",
    description: "Elegant dark background for high contrast",
    background: "121212",
    titleSlideBackground: "000000",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "B0B0B0",
    titleColor: "FFFFFF",
    subtitleColor: "AAAAAA",
    bodyColor: "E0E0E0",
    accentColor: "BB86FC",
    bulletColor: "BB86FC",
    fontTitle: "Segoe UI",
    fontBody: "Calibri Light",
    layoutStyle: "sidebar",
    margin: { x: 0.5, y: 0.5 },
    contentY: 1.3,
    shadow: {
      type: "outer",
      blur: 10,
      offset: 5,
      angle: 45,
      color: "000000",
      opacity: 0.7,
    },
  },

  nature: {
    name: "Nature",
    description: "Earthy greens and warm tones",
    background: "FFFFFF",
    titleSlideBackground: "2D5016",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "A8D08D",
    titleColor: "2D5016",
    subtitleColor: "538135",
    bodyColor: "3D3D3D",
    accentColor: "70AD47",
    bulletColor: "70AD47",
    fontTitle: "Georgia",
    fontBody: "Calibri",
    layoutStyle: "topbar",
    margin: { x: 0.5, y: 0.5 },
    contentY: 1.3,
    shadow: null,
  },

  ocean: {
    name: "Ocean",
    description: "Calming blue gradients",
    background: "FFFFFF",
    titleSlideBackground: "0077B6",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "90E0EF",
    titleColor: "023E8A",
    subtitleColor: "0077B6",
    bodyColor: "2D3748",
    accentColor: "00B4D8",
    bulletColor: "0096C7",
    fontTitle: "Calibri",
    fontBody: "Calibri Light",
    layoutStyle: "topbar",
    margin: { x: 0.5, y: 0.5 },
    contentY: 1.3,
    shadow: {
      type: "outer",
      blur: 4,
      offset: 2,
      angle: 45,
      color: "0077B6",
      opacity: 0.25,
    },
  },

  sunset: {
    name: "Sunset",
    description: "Warm oranges and reds",
    background: "FFFAF0",
    titleSlideBackground: "C53030",
    titleSlideTitleColor: "FFFFFF",
    titleSlideSubtitleColor: "FED7D7",
    titleColor: "C53030",
    subtitleColor: "E53E3E",
    bodyColor: "2D3748",
    accentColor: "DD6B20",
    bulletColor: "ED8936",
    fontTitle: "Georgia",
    fontBody: "Calibri",
    layoutStyle: "card",
    margin: { x: 0.5, y: 0.5 },
    contentY: 1.3,
    shadow: {
      type: "outer",
      blur: 5,
      offset: 3,
      angle: 45,
      color: "C53030",
      opacity: 0.2,
    },
  },
};

/**
 * Get a theme by name, falling back to default if not found.
 * @param {string} themeName - Name of the theme
 * @returns {object} Theme configuration
 */
function getTheme(themeName) {
  const normalizedName = (themeName || "default").toLowerCase().trim();
  return THEMES[normalizedName] || THEMES.default;
}

/**
 * Get list of available theme names.
 * @returns {string[]} Array of theme names
 */
function getAvailableThemes() {
  return Object.keys(THEMES);
}

/**
 * Get theme descriptions for documentation/help.
 * @returns {object[]} Array of {name, description} objects
 */
function getThemeDescriptions() {
  return Object.entries(THEMES).map(([key, theme]) => ({
    id: key,
    name: theme.name,
    description: theme.description,
    layoutStyle: theme.layoutStyle,
    fonts: { title: theme.fontTitle, body: theme.fontBody },
  }));
}

module.exports = {
  THEMES,
  getTheme,
  getAvailableThemes,
  getThemeDescriptions,
};
