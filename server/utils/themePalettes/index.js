/**
 * Instance color palettes defined by admins and served to every user.
 * Every palette is exactly these colors, the frontend derives every shade
 * for both dark and light mode from them.
 * Must match PALETTE_SEEDS in frontend/src/palettes/index.js.
 */
const PALETTE_SEEDS = ["main", "accent"];
const MAX_PALETTES = 20;
const MAX_NAME_LENGTH = 40;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
// Custom ids are namespaced so they can never collide with built-in palette keys.
const CUSTOM_ID = /^custom-[a-z0-9]{1,32}$/;
// The default may also be a built-in palette key, which only the frontend knows.
const PALETTE_KEY = /^[a-z0-9-]{1,64}$/;

/**
 * @typedef {{id: string, name: string, main: string, accent: string}} Palette
 * @typedef {{palettes: Palette[], defaultPalette: string|null, enforced: boolean}} ThemePalettes
 */

/** @returns {ThemePalettes} */
function emptyThemePalettes() {
  return { palettes: [], defaultPalette: null, enforced: false };
}

function sanitizeColors(colors) {
  if (!colors || typeof colors !== "object") return null;
  const sanitized = {};
  for (const seed of PALETTE_SEEDS) {
    if (!HEX_COLOR.test(colors[seed])) return null;
    sanitized[seed] = colors[seed].toLowerCase();
  }
  return sanitized;
}

/**
 * Drops anything that is not a complete, valid palette.
 * @param {any} input - object or JSON string
 * @returns {ThemePalettes}
 */
function sanitizeThemePalettes(input) {
  let config = input;
  try {
    if (typeof input === "string") config = JSON.parse(input);
  } catch {
    return emptyThemePalettes();
  }
  if (!config || typeof config !== "object") return emptyThemePalettes();

  const palettes = [];
  for (const palette of Array.isArray(config.palettes) ? config.palettes : []) {
    if (palettes.length >= MAX_PALETTES) break;
    if (!CUSTOM_ID.test(palette?.id)) continue;
    if (palettes.some(({ id }) => id === palette.id)) continue;
    const name = String(palette.name ?? "")
      .trim()
      .slice(0, MAX_NAME_LENGTH);
    const colors = sanitizeColors(palette);
    if (!name || !colors) continue;
    palettes.push({ id: palette.id, name, ...colors });
  }

  let defaultPalette =
    typeof config.defaultPalette === "string" &&
    PALETTE_KEY.test(config.defaultPalette)
      ? config.defaultPalette
      : null;
  // A custom default must still exist.
  if (
    defaultPalette?.startsWith("custom-") &&
    !palettes.some(({ id }) => id === defaultPalette)
  )
    defaultPalette = null;

  return {
    palettes,
    defaultPalette,
    enforced: config.enforced === true && !!defaultPalette,
  };
}

module.exports = {
  PALETTE_SEEDS,
  sanitizeThemePalettes,
  emptyThemePalettes,
};
