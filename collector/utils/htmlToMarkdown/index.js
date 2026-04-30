const { NodeHtmlMarkdown } = require("node-html-markdown");
const { parse } = require("node-html-parser");

const nhm = new NodeHtmlMarkdown({
  maxConsecutiveNewlines: 3,
  bulletMarker: "-",
  ignore: ["script", "style", "noscript"],
});

/**
 * Strip elements that are explicitly marked as hidden via attributes or
 * inline styles. Acts as a safety net for the fetch fallback path where
 * we can't rely on computed styles (no live browser to evaluate against).
 * The puppeteer path already does a stronger pass using getComputedStyle.
 * @param {string} html
 * @returns {string}
 */
function stripHiddenAttrs(html) {
  const root = parse(html);
  root
    .querySelectorAll('[hidden], [aria-hidden="true"]')
    .forEach((n) => n.remove());
  for (const el of root.querySelectorAll("[style]")) {
    const style = el.getAttribute("style") || "";
    if (
      /display\s*:\s*none/i.test(style) ||
      /visibility\s*:\s*hidden/i.test(style)
    ) {
      el.remove();
    }
  }
  return root.toString();
}

/**
 * Resolve relative <a href> and <img src> URLs to absolute URLs against
 * the page URL so the LLM sees followable links. Removes <img> with
 * data-uri (base64) sources entirely - they bloat tokens with no value.
 * @param {string} html
 * @param {string} baseUrl - The page URL the HTML was scraped from
 * @returns {string} - HTML with absolute URLs and base64 images stripped
 */
function normalizeUrls(html, baseUrl) {
  if (!baseUrl) return html;
  const root = parse(html);

  for (const a of root.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href || /^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) continue;
    try {
      a.setAttribute("href", new URL(href, baseUrl).toString());
    } catch {}
  }

  for (const img of root.querySelectorAll("img[src]")) {
    const src = img.getAttribute("src");
    if (!src) continue;
    if (src.startsWith("data:")) {
      img.remove();
      continue;
    }
    if (/^https?:/i.test(src)) continue;
    try {
      img.setAttribute("src", new URL(src, baseUrl).toString());
    } catch {}
  }

  return root.toString();
}

/**
 * Flatten <table> structure into divs/spans before markdown conversion.
 * Many sites use tables for layout rather than tabular data; rendering
 * them as markdown tables produces unreadable output. Flattening keeps
 * content order without forcing a grid.
 * @param {string} html
 * @returns {string}
 */
function flattenTables(html) {
  return html
    .replace(/<table[^>]*>/gi, "<div>")
    .replace(/<\/table>/gi, "</div>")
    .replace(/<\/?(thead|tbody)[^>]*>/gi, "")
    .replace(/<tr[^>]*>/gi, "<div>")
    .replace(/<\/tr>/gi, "</div>")
    .replace(/<(td|th)[^>]*>/gi, "<span> ")
    .replace(/<\/(td|th)>/gi, " </span>");
}

/**
 * Strip empty markdown anchors of the form `[](url)`. These come from
 * `<a href><img alt=""></a>` patterns where the image was decorative
 * (or removed) and only the wrapping anchor survived. A link without
 * anchor text is unfollowable in any meaningful UI and gives the LLM
 * a URL with no semantic context, so it costs tokens for no value.
 * @param {string} markdown
 * @returns {string}
 */
function stripEmptyAnchors(markdown) {
  return markdown.replace(/(?<!!)\[\]\([^)]*\)\s*/g, "");
}

/**
 * Convert raw HTML into Markdown that preserves hyperlinks and images
 * so scraped pages keep references the LLM can follow. Resolves relative
 * URLs against `baseUrl` and strips base64 inline images. Falls back to
 * plain text extraction if conversion throws.
 * @param {string} html - Raw HTML string from a scraped page
 * @param {string} baseUrl - The URL the HTML was scraped from
 * @returns {string} - Markdown content
 */
function htmlToMarkdown(html, baseUrl) {
  if (!html || typeof html !== "string") return "";
  try {
    const cleaned = stripHiddenAttrs(html);
    const absolute = normalizeUrls(cleaned, baseUrl);
    const flattened = flattenTables(absolute);
    const markdown = nhm.translate(flattened).trim();
    return stripEmptyAnchors(markdown);
  } catch (error) {
    console.error("htmlToMarkdown failed, falling back to plain text:", error);
    try {
      return parse(html).text.trim();
    } catch {
      return "";
    }
  }
}

module.exports = { htmlToMarkdown };
