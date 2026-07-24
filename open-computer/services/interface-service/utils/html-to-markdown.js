#!/usr/bin/env node
// CLI: reads HTML from stdin, writes clean markdown to stdout.
// Usage: echo "<html>...</html>" | node html-to-markdown.js [baseUrl]

const TurndownService = require("turndown");
const { parse } = require("node-html-parser");

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

function htmlToMarkdown(html, baseUrl) {
  if (!html || typeof html !== "string") return "";
  try {
    let root = parse(html);

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
    process.stderr.write("html-to-markdown conversion failed: " + error.message + "\n");
    try {
      return parse(html).text.trim();
    } catch {
      return "";
    }
  }
}

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

// --- CLI entry point ---
let input = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  const baseUrl = process.argv[2] || "";
  const md = htmlToMarkdown(input, baseUrl);
  process.stdout.write(md);
});
