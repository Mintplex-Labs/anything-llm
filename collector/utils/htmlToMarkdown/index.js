const { NodeHtmlMarkdown } = require("node-html-markdown");
const { parse } = require("node-html-parser");

const nhm = new NodeHtmlMarkdown({
  maxConsecutiveNewlines: 3,
  bulletMarker: "-",
  ignore: ["script", "style", "noscript"],
});

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
    const absolute = normalizeUrls(html, baseUrl);
    const flattened = flattenTables(absolute);
    return nhm.translate(flattened).trim();
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
