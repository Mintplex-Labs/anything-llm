/**
 * Themes for generated presentations. The model picks one by name and never
 * writes styling itself, so every layout in render.js works with every theme.
 *
 * A theme is one Tailwind color scale plus the shade its dark slides use
 * (700 for bright themes, 950 for deep ones). Layouts pick shades from the
 * scale by number, mirroring the Figma designs they were built from.
 */

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const SCALES = {
  slate:
    "F8FAFC F1F5F9 E2E8F0 CBD5E1 94A3B8 64748B 475569 334155 1E293B 0F172A 020617",
  indigo:
    "EEF2FF E0E7FF C7D2FE A5B4FC 818CF8 6366F1 4F46E5 4338CA 3730A3 312E81 1E1B4B",
  blue: "EFF6FF DBEAFE BFDBFE 93C5FD 60A5FA 3B82F6 2563EB 1D4ED8 1E40AF 1E3A8A 172554",
  emerald:
    "ECFDF5 D1FAE5 A7F3D0 6EE7B7 34D399 10B981 059669 047857 065F46 064E3B 022C22",
  cyan: "ECFEFF CFFAFE A5F3FC 67E8F9 22D3EE 06B6D4 0891B2 0E7490 155E75 164E63 083344",
  sky: "F0F9FF E0F2FE BAE6FD 7DD3FC 38BDF8 0EA5E9 0284C7 0369A1 075985 0C4A6E 082F49",
  violet:
    "F5F3FF EDE9FE DDD6FE C4B5FD A78BFA 8B5CF6 7C3AED 6D28D9 5B21B6 4C1D95 2E1065",
  pink: "FDF2F8 FCE7F3 FBCFE8 F9A8D4 F472B6 EC4899 DB2777 BE185D 9D174D 831843 500724",
};

// `tint` is the scale light slides and table stripes come from, when it is
// not the theme's own scale.
const PALETTES = {
  slate: {
    name: "Slate",
    description:
      "Near-black and cool gray, minimal and monochrome. Safe default for any business deck.",
    dark: 950,
  },
  indigo: {
    name: "Indigo",
    description: "Bright indigo, confident and modern. Product and strategy.",
    dark: 700,
    tint: "slate",
  },
  blue: {
    name: "Blue",
    description: "Classic bright blue. Corporate, finance, consulting.",
    dark: 700,
  },
  emerald: {
    name: "Emerald",
    description: "Deep green. Sustainability, health, growth.",
    dark: 950,
  },
  cyan: {
    name: "Cyan",
    description: "Deep teal and cyan. Data, science, engineering.",
    dark: 950,
  },
  sky: {
    name: "Sky",
    description: "Bright sky blue. SaaS, product updates, education.",
    dark: 700,
  },
  violet: {
    name: "Violet",
    description: "Bright violet. Creative, marketing, AI.",
    dark: 700,
  },
  pink: {
    name: "Pink",
    description: "Deep wine and pink. Brand, consumer, events.",
    dark: 950,
  },
};

const DEFAULT_THEME = "indigo";

/**
 * Perceived brightness of a hex color, 0 (black) to 1 (white).
 * @param {string} hex - 6-digit hex without `#`
 * @returns {number}
 */
function luminance(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Mixes `amount` (0-1) of `into` into `hex`. */
function mix(hex, into, amount) {
  const c = (h, i) => parseInt(h.slice(i, i + 2), 16);
  return [0, 2, 4]
    .map((i) => Math.round(c(hex, i) * (1 - amount) + c(into, i) * amount))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/** A Tailwind scale as `{ 50: "F8FAFC", ..., 950: "020617" }`. */
function scaleOf(name) {
  const hexes = SCALES[name].split(" ");
  return Object.fromEntries(SHADES.map((shade, i) => [shade, hexes[i]]));
}

/**
 * A Tailwind-like scale with `hex` as its 600 shade, for brand colors.
 * Lighter shades mix toward white and darker ones toward black.
 */
function scaleFromColor(hex) {
  const steps = {
    50: ["FFFFFF", 0.95],
    100: ["FFFFFF", 0.9],
    200: ["FFFFFF", 0.75],
    300: ["FFFFFF", 0.55],
    400: ["FFFFFF", 0.3],
    500: ["FFFFFF", 0.15],
    600: ["FFFFFF", 0],
    700: ["000000", 0.15],
    800: ["000000", 0.3],
    900: ["000000", 0.45],
    950: ["000000", 0.65],
  };
  return Object.fromEntries(
    SHADES.map((shade) => [shade, mix(hex, ...steps[shade])])
  );
}

/**
 * Resolves a theme name into the token object render.js draws with, falling
 * back to the default theme for unknown names.
 * @param {string} name - A key of PALETTES
 * @param {string} [accentColor] - Optional hex brand color that replaces the theme's scale
 * @returns {{name: string, scale: Object<number, string>, dark: string, light: string, stripe: string}}
 */
function getTheme(name, accentColor) {
  const key = String(name || "")
    .toLowerCase()
    .trim();
  const id = PALETTES[key] ? key : DEFAULT_THEME;
  const palette = PALETTES[id];
  const accent = String(accentColor || "")
    .replace("#", "")
    .toUpperCase();
  // Near-black and near-white brand colors produce a scale with no usable
  // contrast between its shades, so they are ignored.
  const accentLum = luminance(accent);
  const accentOk =
    /^[0-9A-F]{6}$/.test(accent) && accentLum >= 0.2 && accentLum <= 0.85;
  const scale = accentOk ? scaleFromColor(accent) : scaleOf(id);
  const tint = accentOk || !palette.tint ? scale : scaleOf(palette.tint);
  return {
    name: palette.name,
    scale,
    dark: scale[palette.dark],
    light: tint[50],
    stripe: tint[200],
  };
}

module.exports = { PALETTES, getTheme };
