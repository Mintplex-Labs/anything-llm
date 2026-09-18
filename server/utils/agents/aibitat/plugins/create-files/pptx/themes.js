/**
 * Color palettes for generated presentations.
 *
 * A palette is only color + type. It knows nothing about slide layouts, and
 * every layout in layouts.js renders with every palette, so the model picks
 * the two independently and never writes styling itself.
 *
 * `style` picks the design language in layouts.js (geometric, minimal, bold)
 * so one theme choice sets both color and look.
 *
 * Token roles:
 *   dark / onDark / onDarkMuted  – cover, section and quote slides (dark canvas)
 *   bg / surface / text / muted  – content slides (cards and tables sit on `surface`)
 *   accent / accent2             – highlights, numbers, chart series, decorative shapes
 */

const THEMES = {
  midnight: {
    name: "Midnight",
    description:
      "Navy and electric blue with soft geometric shapes. Safe default for any business deck.",
    style: "geometric",
    dark: "0F172A",
    onDark: "F8FAFC",
    onDarkMuted: "94A3B8",
    bg: "FFFFFF",
    surface: "F1F5F9",
    text: "0F172A",
    muted: "64748B",
    accent: "2563EB",
    accent2: "F59E0B",
    fontTitle: "Calibri",
    fontBody: "Calibri",
  },

  corporate: {
    name: "Corporate",
    description:
      "Deep navy with gold, minimal editorial look with serif titles. Finance, legal, board meetings.",
    style: "minimal",
    dark: "0C1929",
    onDark: "FFFFFF",
    onDarkMuted: "8FA3BC",
    bg: "FFFFFF",
    surface: "F4F6F9",
    text: "0C1929",
    muted: "5A6D82",
    accent: "C9943E",
    accent2: "1A5276",
    fontTitle: "Georgia",
    fontBody: "Calibri",
  },

  forest: {
    name: "Forest",
    description:
      "Deep green with warm gold and soft shapes. Sustainability, health, growth.",
    style: "geometric",
    dark: "0B2E1F",
    onDark: "F0FDF4",
    onDarkMuted: "86B99E",
    bg: "FFFFFF",
    surface: "F0F7F3",
    text: "0B2E1F",
    muted: "5B7267",
    accent: "1F8A5B",
    accent2: "D9A441",
    fontTitle: "Calibri",
    fontBody: "Calibri",
  },

  ember: {
    name: "Ember",
    description:
      "Charcoal with orange, bold full-color slides and big type. Pitches and launches.",
    style: "bold",
    dark: "1C1917",
    onDark: "FAFAF9",
    onDarkMuted: "A8A29E",
    bg: "FFFFFF",
    surface: "F5F5F4",
    text: "1C1917",
    muted: "6B6560",
    accent: "EA580C",
    accent2: "F5B301",
    fontTitle: "Calibri",
    fontBody: "Calibri",
  },

  ocean: {
    name: "Ocean",
    description:
      "Bright cyan and teal, bold full-color slides. Tech, SaaS, product updates.",
    style: "bold",
    dark: "0A2540",
    onDark: "F8FAFC",
    onDarkMuted: "8FB3D9",
    bg: "FFFFFF",
    surface: "EEF5FB",
    text: "0A2540",
    muted: "5A7590",
    accent: "0284C7",
    accent2: "14B8A6",
    fontTitle: "Calibri",
    fontBody: "Calibri",
  },

  plum: {
    name: "Plum",
    description:
      "Deep purple with violet and pink shapes. Creative and marketing.",
    style: "geometric",
    dark: "2E1065",
    onDark: "FAF5FF",
    onDarkMuted: "C4B5FD",
    bg: "FFFFFF",
    surface: "F5F0FF",
    text: "2E1065",
    muted: "6D5A8F",
    accent: "7C3AED",
    accent2: "EC4899",
    fontTitle: "Calibri",
    fontBody: "Calibri",
  },

  mono: {
    name: "Mono",
    description:
      "Black, white and gray, minimal editorial with thin rules. Lets content speak.",
    style: "minimal",
    dark: "171717",
    onDark: "FAFAFA",
    onDarkMuted: "A3A3A3",
    bg: "FFFFFF",
    surface: "F5F5F5",
    text: "171717",
    muted: "737373",
    accent: "525252",
    accent2: "A3A3A3",
    fontTitle: "Georgia",
    fontBody: "Calibri Light",
  },

  carbon: {
    name: "Carbon",
    description:
      "Dark mode throughout with indigo shapes. Developer and AI topics.",
    style: "geometric",
    dark: "09090B",
    onDark: "FAFAFA",
    onDarkMuted: "A1A1AA",
    bg: "18181B",
    surface: "27272A",
    text: "F4F4F5",
    muted: "A1A1AA",
    accent: "818CF8",
    accent2: "34D399",
    fontTitle: "Calibri",
    fontBody: "Calibri",
  },
};

/**
 * Get a palette by name, falling back to midnight if not found.
 * @param {string} themeName
 * @param {string} [accentColor] - Optional hex override for the accent color (e.g. brand color)
 * @returns {object} Palette tokens
 */
function getTheme(themeName, accentColor) {
  const key = (themeName || "midnight").toLowerCase().trim();
  const theme = THEMES[key] || THEMES.midnight;
  const accent = String(accentColor || "")
    .replace("#", "")
    .toUpperCase();
  if (!/^[0-9A-F]{6}$/.test(accent)) return theme;
  // An accent must read against both the dark canvas and the light slides,
  // so near-black and near-white overrides are ignored.
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(accent.substr(i, 2), 16));
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance < 0.2 || luminance > 0.85) return theme;
  return { ...theme, accent };
}

/**
 * @returns {string[]} Available palette identifiers
 */
function getAvailableThemes() {
  return Object.keys(THEMES);
}

module.exports = { THEMES, getTheme, getAvailableThemes };
