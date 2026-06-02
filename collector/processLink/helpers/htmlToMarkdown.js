const TurndownService = require("turndown");
const { parse } = require("node-html-parser");

// Image URL base paths to strip entirely - these are typically proxied badges,
// tracking pixels, avatars, or other non-content images that bloat token counts.
const IGNORED_IMG_BASEPATHS = [
  "https://camo.githubusercontent.com",
  "https://avatars.githubusercontent.com",
  "https://img.shields.io",
  "https://badge.fury.io",
  "https://badges.gitter.im",
  "https://coveralls.io/repos",
  "https://travis-ci.org",
  "https://circleci.com",
  "https://github.com/favicon",
];

/**
 * Convert raw page HTML into clean markdown using Turndown.
 * Strips non-content elements (nav, footer, ads, etc.), hidden elements,
 * base64 images, scripts, styles, and resolves relative URLs before converting.
 * @param {string} html - Raw HTML string
 * @param {string} baseUrl - The URL the page was scraped from
 * @returns {string} Cleaned markdown string
 */
function htmlToMarkdown(html, baseUrl) {
  if (!html || typeof html !== "string") return "";
  try {
    let root = parse(html);

    // Prefer the narrowest content container to avoid page chrome.
    // article > main because sites like GitHub put the file tree inside <main>
    // but scope the README to <article>.
    const content =
      root.querySelector("article") ||
      root.querySelector("main") ||
      root.querySelector('[role="main"]');
    if (content) root = content;

    const junkSelectors = [
      "script",
      "style",
      "noscript",
      "nav",
      "footer",
      "header",
      "aside",
      "iframe",
      "svg",
      '[role="navigation"]',
      '[role="banner"]',
      '[role="contentinfo"]',
      '[aria-hidden="true"]',
      "[hidden]",
    ];
    for (const sel of junkSelectors) {
      root.querySelectorAll(sel).forEach((el) => el.remove());
    }

    for (const el of root.querySelectorAll("[style]")) {
      const style = el.getAttribute("style") || "";
      if (
        /display\s*:\s*none/i.test(style) ||
        /visibility\s*:\s*hidden/i.test(style)
      ) {
        el.remove();
      }
    }

    if (baseUrl) {
      resolveUrls(root, baseUrl);
    }

    stripCitations(root);

    const cleanedHtml = root.toString();

    const turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });
    turndown.remove(["script", "style", "noscript", "iframe", "svg"]);

    turndown.addRule("compactLinks", {
      filter: "a",
      replacement: function (content, node) {
        const href = node.getAttribute("href");
        if (!href) return content;
        const text = content.replace(/\s+/g, " ").trim();
        if (!text) return "";
        return `[${text}](${href})`;
      },
    });

    let markdown = turndown.turndown(cleanedHtml);

    // Strip links and images with excessively long URLs (200+ chars)
    markdown = markdown.replace(/!\[[^\]]*\]\([^)]{200,}\)\s*/g, "");
    markdown = markdown.replace(/\[[^\]]*\]\([^)]{200,}\)/g, (match) => {
      const textMatch = match.match(/\[([^\]]*)\]/);
      return textMatch ? textMatch[1] : "";
    });

    markdown = markdown.replace(/\[[\d]+\]/g, "");
    markdown = markdown.replace(/\[#cite[^\]]*\]/g, "");
    markdown = markdown.replace(/\[edit\]/gi, "");

    markdown = markdown.replace(/\n{4,}/g, "\n\n\n").trim();
    return markdown;
  } catch (error) {
    console.error("htmlToMarkdown failed:", error);
    try {
      return parse(html).text.trim();
    } catch {
      return "";
    }
  }
}

/**
 * Resolve relative URLs for links and images. Strips base64 and
 * ignored-basepath images entirely. Gives alt-less images a filename-based alt.
 * @param {import('node-html-parser').HTMLElement} root
 * @param {string} baseUrl
 */
function resolveUrls(root, baseUrl) {
  for (const a of root.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href || /^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) continue;
    try {
      a.setAttribute("href", new URL(href, baseUrl).toString());
    } catch {}
  }

  for (const img of root.querySelectorAll("img[src]")) {
    const src = img.getAttribute("src");
    if (!src) {
      img.remove();
      continue;
    }
    if (src.startsWith("data:")) {
      img.remove();
      continue;
    }

    const resolvedSrc = /^https?:/i.test(src)
      ? src
      : (() => {
          try {
            return new URL(src, baseUrl).toString();
          } catch {
            return src;
          }
        })();

    if (IGNORED_IMG_BASEPATHS.some((base) => resolvedSrc.startsWith(base))) {
      img.remove();
      continue;
    }

    if (!/^https?:/i.test(src)) {
      try {
        img.setAttribute("src", new URL(src, baseUrl).toString());
      } catch {}
    }

    const alt = (img.getAttribute("alt") || "").trim();
    if (!alt) {
      try {
        const pathname = new URL(img.getAttribute("src")).pathname;
        const filename = pathname.split("/").pop() || "image";
        img.setAttribute("alt", filename);
      } catch {
        img.setAttribute("alt", "image");
      }
    }
  }
}

/**
 * Strip citation/reference superscripts and reference sections
 * commonly found on Wikipedia and similar sites.
 * @param {import('node-html-parser').HTMLElement} root
 */
function stripCitations(root) {
  for (const sup of root.querySelectorAll("sup.reference, sup.noprint")) {
    sup.remove();
  }

  for (const sel of [
    ".reflist",
    ".references",
    ".refbegin",
    "#References",
    ".catlinks",
    ".mw-authority-control",
  ]) {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  }
}

module.exports = { htmlToMarkdown };
