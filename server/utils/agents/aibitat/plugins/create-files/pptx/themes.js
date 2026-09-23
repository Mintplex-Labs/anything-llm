/**
 * Themes for generated presentations. A theme is a palette plus a visual
 * style; the model picks one by name and never writes styling itself, so
 * every layout in render.js works with every theme.
 *
 * A palette is deliberately tiny: a dark canvas color and two accents. Every
 * other color a slide needs (text, muted text, card surfaces) is derived from
 * the background it sits on in `onBackground`, so adding a theme is a few
 * lines and contrast is never hand-tuned per theme.
 */

const PALETTES = {
  midnight: {
    name: "Midnight",
    description:
      "Navy and electric blue with soft geometric shapes. Safe default for any business deck.",
    style: "geometric",
    dark: "0F172A",
    accent: "2563EB",
    accent2: "F59E0B",
  },
  corporate: {
    name: "Corporate",
    description:
      "Deep navy with gold, minimal editorial look with serif titles. Finance, legal, board meetings.",
    style: "minimal",
    dark: "0C1929",
    accent: "C9943E",
    accent2: "1A5276",
    fontTitle: "Georgia",
  },
  forest: {
    name: "Forest",
    description:
      "Deep green with warm gold and soft shapes. Sustainability, health, growth.",
    style: "geometric",
    dark: "0B2E1F",
    accent: "1F8A5B",
    accent2: "D9A441",
  },
  ember: {
    name: "Ember",
    description:
      "Charcoal with orange, bold full-color slides and big type. Pitches and launches.",
    style: "bold",
    dark: "1C1917",
    accent: "EA580C",
    accent2: "F5B301",
  },
  ocean: {
    name: "Ocean",
    description:
      "Bright cyan and teal, bold full-color slides. Tech, SaaS, product updates.",
    style: "bold",
    dark: "0A2540",
    accent: "0284C7",
    accent2: "14B8A6",
  },
  plum: {
    name: "Plum",
    description:
      "Deep purple with violet and pink shapes. Creative and marketing.",
    style: "geometric",
    dark: "2E1065",
    accent: "7C3AED",
    accent2: "EC4899",
  },
  mono: {
    name: "Mono",
    description:
      "Black, white and gray, minimal editorial with thin rules. Lets content speak.",
    style: "minimal",
    dark: "171717",
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
    bg: "18181B",
    accent: "818CF8",
    accent2: "34D399",
  },
};

/**
 * How each style draws. `canvas` is the palette color behind cover, section
 * and quote slides; `cards` is how card backgrounds are filled; `marker` is
 * the step-number treatment. Layouts read these knobs and never branch on
 * the style name, so a new style is one more entry here.
 */
const STYLES = {
  geometric: {
    canvas: "dark",
    shapes: true,
    band: false,
    cards: "surface",
    marker: "circle",
  },
  minimal: {
    canvas: "bg",
    shapes: false,
    band: false,
    cards: "outline",
    marker: "number",
  },
  bold: {
    canvas: "accent",
    shapes: false,
    band: true,
    cards: "dark",
    marker: "square",
  },
};

const DEFAULTS = { bg: "FFFFFF", fontTitle: "Calibri", fontBody: "Calibri" };

/**
 * Perceived brightness of a hex color, 0 (black) to 1 (white).
 * @param {string} hex - 6-digit hex, with or without `#`
 * @returns {number}
 */
function luminance(hex) {
  const clean = (hex || "FFFFFF").replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.substr(i, 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// Mid-tones read better with white text, so the cutoff sits above 0.5.
const isDark = (hex) => luminance(hex) < 0.6;

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
 * The theme with `bg` as the slide background and text, muted and surface
 * colors that read on it. Any layout can render on any background by
 * drawing with the returned theme.
 * @param {object} theme
 * @param {string} bg - 6-digit hex
 * @returns {object}
 */
function onBackground(theme, bg) {
  const dark = isDark(bg);
  const text = dark ? "FFFFFF" : theme.dark;
  // Muted text sits 40% of the way to the background; surfaces (cards, table
  // stripes) are a faint tint of the text color, stronger on dark slides
  // where 5% would vanish.
  return {
    ...theme,
    bg,
    text,
    muted: mix(text, bg, 0.4),
    surface: mix(bg, text, dark ? 0.1 : 0.05),
  };
}

/**
 * Resolves a theme name into the flat token object render.js draws with,
 * falling back to midnight for unknown names.
 * @param {string} name - A key of PALETTES
 * @param {string} [accentColor] - Optional hex override for the accent (brand color)
 * @returns {object}
 */
function getTheme(name, accentColor) {
  const palette =
    PALETTES[
      String(name || "")
        .toLowerCase()
        .trim()
    ] ?? PALETTES.midnight;
  const accent = String(accentColor || "")
    .replace("#", "")
    .toUpperCase();
  // An accent must read against both the dark canvas and the light slides,
  // so near-black and near-white overrides are ignored.
  const accentLum = luminance(accent);
  const accentOk =
    /^[0-9A-F]{6}$/.test(accent) && accentLum >= 0.2 && accentLum <= 0.85;
  const base = {
    ...DEFAULTS,
    ...palette,
    accent: accentOk ? accent : palette.accent,
  };
  const style = STYLES[palette.style];
  return onBackground(
    { ...base, ...style, canvas: base[style.canvas] },
    base.bg
  );
}

module.exports = { PALETTES, getTheme, onBackground, isDark };
