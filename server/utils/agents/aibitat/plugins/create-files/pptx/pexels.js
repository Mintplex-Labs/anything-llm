/**
 * Optional stock photography for generated decks, via the Pexels API.
 *
 * Disabled unless PEXELS_API_KEY is set. Every failure path - no key, no
 * network, no result, a slow response - degrades to `null`, and the slide
 * renders with its vector layout instead. A deck must never fail to build
 * because a photo could not be fetched.
 *
 * Photos are downloaded and embedded into the .pptx as bytes rather than
 * hotlinked, so the file opens offline. The Pexels license permits commercial
 * use and does not require attribution.
 */

const SEARCH_ENDPOINT = "https://api.pexels.com/v1/search";

// The `landscape` variant is 1200x627 at roughly 150KB. `large2x` is ~3x the
// bytes for pixels no projector will show.
const SRC_VARIANT = "landscape";

const SEARCH_TIMEOUT_MS = 6000;
const DOWNLOAD_TIMEOUT_MS = 8000;

// A hard ceiling on photos per deck: each one costs a round trip plus ~150KB,
// and a deck that is mostly stock photography stops being a deck. Sized so a
// six-section deck can still give every divider its photo.
const MAX_IMAGES_PER_DECK = 8;

/** @type {Map<string, object|null>} query -> resolved photo, per process */
const _cache = new Map();

// Shared demo key so a fresh clone/build ships with working stock photos even
// without a configured PEXELS_API_KEY. This is an internal company demo default,
// not a secret to protect - a per-deployment PEXELS_API_KEY still overrides it.
// When this key hits its Pexels quota, swap the value here (or set the env var).
const DEFAULT_API_KEY = "cBoa1QlkHhoZJlxqKDb8N5kNA2su6imIQPmD3pn8NOQ8ETOOCrD9dejg";

function apiKey() {
  const key = process.env.PEXELS_API_KEY;
  if (typeof key === "string" && key.trim().length > 0) return key.trim();
  return DEFAULT_API_KEY;
}

function isEnabled() {
  return apiKey() !== null;
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Finds one landscape photo for a query and returns it as a pptxgenjs data URI.
 * @param {string} query - Search terms. English performs markedly better than
 *   Vietnamese: the Pexels index is keyword-matched, not translated.
 * @returns {Promise<{data: string, photographer: string, pageUrl: string}|null>}
 */
async function findPhoto(query) {
  const key = apiKey();
  if (!key) return null;

  const q = String(query || "").trim();
  if (!q) return null;
  if (_cache.has(q)) return _cache.get(q);

  let result = null;
  try {
    const url = `${SEARCH_ENDPOINT}?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`;
    const res = await fetchWithTimeout(
      url,
      { headers: { Authorization: key } },
      SEARCH_TIMEOUT_MS
    );
    if (!res.ok) throw new Error(`Pexels search HTTP ${res.status}`);

    const body = await res.json();
    const photo = body?.photos?.[0];
    const src = photo?.src?.[SRC_VARIANT];
    if (!src) throw new Error("Pexels returned no photo");

    const imgRes = await fetchWithTimeout(src, {}, DOWNLOAD_TIMEOUT_MS);
    if (!imgRes.ok) throw new Error(`Pexels image HTTP ${imgRes.status}`);
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    result = {
      data: `image/jpeg;base64,${buffer.toString("base64")}`,
      photographer: photo.photographer || "",
      pageUrl: photo.url || "",
    };
  } catch {
    result = null;
  }

  _cache.set(q, result);
  return result;
}

/**
 * Resolves `imageQuery` on each slide into an embedded `image`, in place.
 * Slides whose photo cannot be fetched simply lose the field and render as
 * vector-only. Always returns the number of photos actually embedded.
 *
 * @param {object[]} slides - Slide data, mutated in place.
 * @param {(msg: string) => void} [log]
 */
async function attachImages(slides, log = () => {}) {
  if (!Array.isArray(slides) || !isEnabled()) return 0;

  const wanted = slides.filter((s) => s && typeof s.imageQuery === "string" && s.imageQuery.trim());
  if (wanted.length === 0) return 0;

  let embedded = 0;
  for (const slide of wanted) {
    const query = slide.imageQuery;
    delete slide.imageQuery;

    if (embedded >= MAX_IMAGES_PER_DECK) continue;

    const photo = await findPhoto(query);
    if (!photo) {
      log(`[pexels] no photo for "${query}" - slide falls back to vector layout`);
      continue;
    }

    // A divider gives the photo a tall panel bleeding off the right edge; a
    // content slide gets a smaller side image beside its bullets. Neither is a
    // full-bleed background - only the cover slide carries a colored surface.
    const position = slide.layout === "section" ? "panel" : "right";
    slide.image = { data: photo.data, position };
    embedded++;
  }

  log(`[pexels] embedded ${embedded} photo(s)`);
  return embedded;
}

module.exports = { isEnabled, findPhoto, attachImages, MAX_IMAGES_PER_DECK };
