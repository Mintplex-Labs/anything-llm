import "./palettes.css";
import { API_BASE } from "@/utils/constants";
import { baseHeaders, safeJsonParse } from "@/utils/request";

/**
 * The fixed colors every palette provides, used for both light and dark mode:
 *   main   - regenerates the neutral scales (zinc for dark mode, slate for light)
 *            so the page background, sidebar and content become shades of it
 *   accent - regenerates the sky and blue scales used for buttons, links and focus
 */
export const PALETTE_SEEDS = ["main", "accent"];

/**
 * @typedef {Record<typeof PALETTE_SEEDS[number], string>} PaletteColors
 */

/**
 * Built-in palettes. "default" is never applied - it leaves the stock
 * Tailwind colors untouched - its colors only seed a new instance palette.
 * `shades` replaces generated steps outright, for looks a hue alone cannot
 * reach like pure black. Keys are `scale-step`, values are `r g b` channels.
 * @type {Record<string, {name: string, shades?: Record<string, string>} & PaletteColors>}
 */
const BUILT_IN_PALETTES = {
  default: { name: "Default", main: "#71717a", accent: "#0ea5e9" },
  // Pure black page background with near-black surfaces, for OLED screens.
  "true-dark": {
    name: "True Dark",
    main: "#000000",
    accent: "#0ea5e9",
    shades: {
      "zinc-950": "0 0 0",
      "zinc-925": "8 8 8",
      "zinc-900": "14 14 14",
      "zinc-800": "28 28 28",
      "zinc-700": "46 46 46",
      "zinc-600": "69 69 69",
    },
  },
  ocean: { name: "Ocean", main: "#1d4ed8", accent: "#38bdf8" },
  forest: { name: "Forest", main: "#15803d", accent: "#34d399" },
  plum: { name: "Plum", main: "#7e22ce", accent: "#c084fc" },
  ember: { name: "Ember", main: "#c2410c", accent: "#fb923c" },
};

const USER_PALETTE_KEY = "palette";
const INSTANCE_CACHE_KEY = "theme_palettes";

/**
 * @typedef {{id: string, name: string} & PaletteColors} InstancePalette
 * @typedef {{palettes: InstancePalette[], defaultPalette: string|null, enforced: boolean}} ThemePalettes
 * @typedef {{key: string, name: string, colors: PaletteColors, shades?: Record<string, string>, isInstance: boolean}} PaletteOption
 */

/** @type {ThemePalettes} */
const EMPTY_INSTANCE = { palettes: [], defaultPalette: null, enforced: false };

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Skips cached palettes saved in an older format. */
function isCompletePalette(palette) {
  return (
    typeof palette?.id === "string" &&
    typeof palette?.name === "string" &&
    PALETTE_SEEDS.every((seed) => HEX_COLOR.test(palette?.[seed]))
  );
}

/**
 * Coerces cached or fetched instance palettes into a valid shape, so a
 * malformed cache can never break rendering.
 * @param {any} value
 * @returns {ThemePalettes}
 */
function normalizeInstance(value) {
  if (!value || typeof value !== "object") return EMPTY_INSTANCE;
  return {
    palettes: Array.isArray(value.palettes)
      ? value.palettes.filter(isCompletePalette)
      : [],
    defaultPalette:
      typeof value.defaultPalette === "string" ? value.defaultPalette : null,
    enforced: value.enforced === true,
  };
}

// Shared across every useTheme() instance so they never disagree on the palette.
let state = {
  /** The palette the user picked, or null to follow the instance default. */
  choice: localStorage.getItem(USER_PALETTE_KEY) || null,
  /** Cached until the server responds so the palette applies without a flash. */
  instance: normalizeInstance(
    safeJsonParse(localStorage.getItem(INSTANCE_CACHE_KEY), EMPTY_INSTANCE)
  ),
  /**
   * Unsaved admin changes shown across the app until saved or discarded.
   * `colors` is null to preview the stock theme.
   * @type {{colors: PaletteColors|null, shades?: Record<string, string>}|null}
   */
  preview: null,
};
const listeners = new Set();

function setState(next) {
  state = { ...state, ...next };
  if (state.choice) localStorage.setItem(USER_PALETTE_KEY, state.choice);
  else localStorage.removeItem(USER_PALETTE_KEY);
  localStorage.setItem(INSTANCE_CACHE_KEY, JSON.stringify(state.instance));
  listeners.forEach((listener) => listener());
}

/**
 * Every selectable palette, built-in palettes first.
 * @param {ThemePalettes} instance
 * @returns {PaletteOption[]}
 */
export function listPalettes(instance) {
  return [
    ...Object.entries(BUILT_IN_PALETTES).map(
      ([key, { name, main, accent, shades }]) => ({
        key,
        name,
        colors: { main, accent },
        shades,
        isInstance: false,
      })
    ),
    ...(instance?.palettes ?? [])
      .filter(isCompletePalette)
      .map(({ id, name, main, accent }) => ({
        key: id,
        name,
        colors: { main, accent },
        isInstance: true,
      })),
  ];
}

/**
 * Resolves which palette is active. An enforced instance default always wins,
 * then the user's choice, then the instance default, then the stock theme.
 * @param {typeof state} paletteState
 * @returns {string}
 */
export function resolvePalette({ choice, instance }) {
  const keys = listPalettes(instance).map(({ key }) => key);
  const instanceDefault = keys.includes(instance?.defaultPalette)
    ? instance.defaultPalette
    : "default";
  if (instance?.enforced) return instanceDefault;
  return keys.includes(choice) ? choice : instanceDefault;
}

export const paletteStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  /** @param {string|null} choice - null follows the instance default */
  setChoice(choice) {
    setState({ choice });
  },
  /** @param {ThemePalettes} instance */
  setInstance(instance) {
    setState({ instance: normalizeInstance(instance) });
  },
  /** @param {{colors: PaletteColors|null, shades?: Record<string, string>}|null} preview */
  setPreview(preview) {
    setState({ preview });
  },
  /** Fetches the instance palettes the admin has defined. */
  async refresh() {
    const { themePalettes } = await fetch(`${API_BASE}/system/theme-palettes`, {
      method: "GET",
      cache: "no-cache",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return {};
      });
    if (themePalettes) this.setInstance(themePalettes);
  },
};

/**
 * Stock Tailwind values for every scale a palette regenerates, must match
 * `paletteScale` in tailwind.config.js. zinc-925 is the sidebar shade.
 */
const STOCK_SCALES = {
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    925: "#0e0f0f",
    950: "#09090b",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
};
const NEUTRAL_SCALES = ["zinc", "slate"];
const ACCENT_SCALES = ["sky", "blue"];
// Chroma each neutral step gets, as a share of NEUTRAL_MAX_CHROMA. Low on the
// light steps so text stays clean, steady on the dark steps that form surfaces.
const NEUTRAL_CHROMA = {
  50: 0.16,
  100: 0.24,
  200: 0.32,
  300: 0.4,
  400: 0.56,
  500: 0.68,
  600: 0.76,
  700: 0.84,
  800: 0.9,
  900: 0.96,
  925: 1,
  950: 1,
};
// Neutral shades never get more saturated than this, however vivid the main color.
const NEUTRAL_MAX_CHROMA = 0.045;

function hexToRgb(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

/** @returns {[number, number, number]} OKLCH lightness, chroma and hue (radians). */
function hexToOklch(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}

/** @returns {number[]|null} sRGB channels 0-255, or null when out of gamut. */
function oklchToRgb(L, C, h) {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  if (linear.some((c) => c < -0.0001 || c > 1.0001)) return null;
  return linear.map((c) => {
    const v = Math.min(Math.max(c, 0), 1);
    const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.round(srgb * 255);
  });
}

/** Reduces chroma until the color fits in sRGB. */
function toGamutRgb(L, C, h) {
  for (let chroma = C; chroma > 0.0005; chroma *= 0.92) {
    const rgb = oklchToRgb(L, chroma, h);
    if (rgb) return rgb;
  }
  return oklchToRgb(L, 0, h);
}

/**
 * Regenerates a stock Tailwind scale in the hue of `color`, keeping every
 * step's stock lightness so contrast between steps never changes. Channels
 * are `r g b`, the format Tailwind needs for opacity modifiers like `bg-zinc-900/50`.
 * @param {string} color
 * @param {"zinc"|"slate"|"sky"|"blue"} name
 * @returns {Record<string, string>}
 */
function buildScale(color, name) {
  const [, colorChroma, hue] = hexToOklch(color);
  const stock = Object.entries(STOCK_SCALES[name]).map(([step, hex]) => [
    step,
    hexToOklch(hex),
  ]);
  const stockPeak = Math.max(...stock.map(([, [, c]]) => c));
  const neutral = NEUTRAL_SCALES.includes(name);
  return Object.fromEntries(
    stock.map(([step, [L, stockChroma]]) => {
      const chroma = neutral
        ? Math.min(colorChroma, NEUTRAL_MAX_CHROMA) * NEUTRAL_CHROMA[step]
        : (stockChroma / stockPeak) * colorChroma;
      return [step, toGamutRgb(L, chroma, hue).join(" ")];
    })
  );
}

/**
 * White text when it reaches 3:1 contrast (WCAG for UI and large text) since
 * brand colors usually carry white text, otherwise near-black.
 * @param {number[]} rgb
 */
function readableTextOn(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (luminance + 0.05) >= 3 ? "#ffffff" : "#0e0f0f";
}

/**
 * Applies the active palette, or a preview, to the document.
 * @param {typeof state} paletteState
 * @param {"dark" | "light"} mode
 */
export function applyPalette(paletteState, mode) {
  const root = document.documentElement;
  const key = resolvePalette(paletteState);
  const option = listPalettes(paletteState.instance).find((p) => p.key === key);
  const { preview } = paletteState;
  const colors = preview
    ? preview.colors
    : key === "default"
      ? null
      : option?.colors;
  const shades = (preview ? preview.shades : option?.shades) ?? {};

  const attribute = preview ? "preview" : key;
  root.setAttribute("data-palette", colors ? attribute : "default");

  const properties = {};
  if (colors) {
    for (const name of [...NEUTRAL_SCALES, ...ACCENT_SCALES]) {
      const color = NEUTRAL_SCALES.includes(name) ? colors.main : colors.accent;
      for (const [step, rgb] of Object.entries(buildScale(color, name)))
        properties[`--palette-${name}-${step}`] = rgb;
    }
    for (const [shade, rgb] of Object.entries(shades))
      properties[`--palette-${shade}`] = rgb;
    // Primary buttons use sky-400 in dark mode and sky-500 in light mode.
    const button = properties[`--palette-sky-${mode === "light" ? 500 : 400}`];
    properties["--palette-accent-text"] = readableTextOn(
      button.split(" ").map(Number)
    );
  }

  // Clear everything this function may have set before, then set the new values.
  [...root.style]
    .filter((property) => property.startsWith("--palette-"))
    .forEach((property) => root.style.removeProperty(property));
  Object.entries(properties).forEach(([property, value]) =>
    root.style.setProperty(property, value)
  );
}

/** @returns {PaletteColors} A copy of a palette's colors to start editing from. */
export function copyPaletteColors(key, instance) {
  const option =
    listPalettes(instance).find((p) => p.key === key) ??
    listPalettes(instance)[0];
  return { ...option.colors };
}
