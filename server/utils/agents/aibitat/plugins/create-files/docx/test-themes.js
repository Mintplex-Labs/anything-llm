#!/usr/bin/env node
/**
 * Test utility to generate sample Word documents for all themes and configurations.
 * Run from the server directory: node utils/agents/aibitat/plugins/create-files/docx/test-themes.js
 *
 * Output goes to: storage/generated-files/docx-theme-previews/
 */

const path = require("path");
const fs = require("fs/promises");
const {
  DOCUMENT_STYLES,
  getTheme,
  getMargins,
  loadLibraries,
  htmlToDocxElements,
  createCoverPageSection,
  createRunningHeader,
  createRunningFooter,
  DEFAULT_NUMBERING_CONFIG,
} = require("./utils.js");

const OUTPUT_DIR = path.resolve(
  __dirname,
  "../../../../../../storage/generated-files/docx-theme-previews"
);

const SAMPLE_CONTENT = `# Sample Document

## Executive Summary

This document demonstrates the **styling capabilities** of the Word document generator. It includes various content types to showcase how themes affect the visual appearance.

## Key Features

- Professional title pages with centered content
- Running headers with document title
- Page X of Y footer numbering
- Color-coordinated themes throughout

## Data Overview

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|-----|-----|-----|-----|
| Revenue | $1.2M | $1.5M | $1.8M | $2.1M |
| Growth | +15% | +25% | +20% | +17% |
| Users | 10K | 15K | 22K | 30K |

## Technical Details

Here is an example code block:

\`\`\`javascript
const config = {
  theme: "blue",
  margins: "normal",
  includeTitlePage: true
};
\`\`\`

> **Note:** This blockquote demonstrates how accent colors are applied to the left border. Blockquotes are useful for callouts and important notes.

## Conclusion

The themed document system provides a consistent, professional look across all generated documents. Each theme cascades colors through:

1. Heading text colors
2. Table header backgrounds
3. Blockquote borders
4. Footer text styling

---

Thank you for reviewing this sample document.
`;

const MINIMAL_CONTENT = `# Quick Report

## Summary

A brief document to test minimal content rendering.

- Point one
- Point two
- Point three

| Item | Value |
|------|-------|
| A | 100 |
| B | 200 |
`;

async function generateThemePreview(themeName, themeConfig, options = {}) {
  const libs = await loadLibraries();
  const { marked, docx } = libs;
  const { Document, Packer, Paragraph, TextRun } = docx;

  marked.setOptions({ gfm: true, breaks: true });

  const {
    margins = "normal",
    includeTitlePage = false,
    content = SAMPLE_CONTENT,
    subtitle = null,
    author = null,
  } = options;

  const marginConfig = getMargins(margins);
  const title = `${themeConfig.name || themeName} Theme Preview`;

  const html = marked.parse(content);
  const docElements = await htmlToDocxElements(
    html,
    libs,
    console.log,
    themeConfig
  );

  if (docElements.length === 0) {
    docElements.push(
      new Paragraph({
        children: [new TextRun({ text: content })],
      })
    );
  }

  const sections = [];

  if (includeTitlePage) {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    sections.push(
      createCoverPageSection(docx, {
        title,
        subtitle: subtitle || `Demonstrating the ${themeName} color scheme`,
        author: author || "AnythingLLM Theme Tester",
        date: currentDate,
        theme: themeConfig,
        margins: marginConfig,
        logoBuffer: null,
      })
    );

    sections.push({
      properties: {
        page: { margin: marginConfig },
        titlePage: true,
      },
      children: docElements,
      headers: {
        default: createRunningHeader(docx, title, themeConfig),
      },
      footers: {
        default: createRunningFooter(docx, null, themeConfig),
      },
    });
  } else {
    sections.push({
      properties: {
        page: { margin: marginConfig },
      },
      children: docElements,
      footers: {
        default: createRunningFooter(docx, null, themeConfig),
      },
    });
  }

  const doc = new Document({
    title,
    creator: "AnythingLLM Theme Tester",
    description: `Theme preview for ${themeName}`,
    numbering: DEFAULT_NUMBERING_CONFIG,
    sections,
  });

  return Packer.toBuffer(doc);
}

async function main() {
  console.log("DOCX Theme Preview Generator");
  console.log("============================\n");

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const themes = Object.keys(DOCUMENT_STYLES.themes);
  const marginPresets = Object.keys(DOCUMENT_STYLES.margins);

  console.log(`Themes: ${themes.join(", ")}`);
  console.log(`Margins: ${marginPresets.join(", ")}\n`);

  const configs = [];

  for (const themeName of themes) {
    configs.push({
      name: `theme-${themeName}-simple`,
      theme: themeName,
      margins: "normal",
      includeTitlePage: false,
      content: SAMPLE_CONTENT,
    });

    configs.push({
      name: `theme-${themeName}-with-title-page`,
      theme: themeName,
      margins: "normal",
      includeTitlePage: true,
      content: SAMPLE_CONTENT,
    });
  }

  for (const marginName of marginPresets) {
    configs.push({
      name: `margins-${marginName}`,
      theme: "neutral",
      margins: marginName,
      includeTitlePage: true,
      content: SAMPLE_CONTENT,
    });
  }

  configs.push({
    name: `full-featured-blue`,
    theme: "blue",
    margins: "normal",
    includeTitlePage: true,
    content: SAMPLE_CONTENT,
    subtitle: "A Complete Feature Demonstration",
    author: "Documentation Team",
  });

  configs.push({
    name: `minimal-warm`,
    theme: "warm",
    margins: "narrow",
    includeTitlePage: false,
    content: MINIMAL_CONTENT,
  });

  console.log(`Generating ${configs.length} preview documents...\n`);

  for (const config of configs) {
    const themeConfig = getTheme(config.theme);
    try {
      const buffer = await generateThemePreview(config.theme, themeConfig, {
        margins: config.margins,
        includeTitlePage: config.includeTitlePage,
        content: config.content,
        subtitle: config.subtitle,
        author: config.author,
      });

      const filename = `${config.name}.docx`;
      const filepath = path.join(OUTPUT_DIR, filename);
      await fs.writeFile(filepath, buffer);

      const sizeKB = (buffer.length / 1024).toFixed(1);
      const titlePage = config.includeTitlePage ? "✓ title" : "  -    ";
      console.log(
        `✓ ${config.name.padEnd(30)} [${config.theme.padEnd(7)}] [${config.margins.padEnd(6)}] ${titlePage} (${sizeKB}KB)`
      );
    } catch (error) {
      console.error(`✗ ${config.name.padEnd(30)} → Error: ${error.message}`);
      console.error(error.stack);
    }
  }

  console.log(`\n✅ Done! Files saved to: ${OUTPUT_DIR}`);
  console.log(
    "\nOpen the .docx files in Microsoft Word or LibreOffice to preview each configuration."
  );

  console.log("\n--- Theme Color Reference ---");
  for (const [name, colors] of Object.entries(DOCUMENT_STYLES.themes)) {
    console.log(`\n${name.toUpperCase()}:`);
    console.log(`  Heading:      #${colors.heading}`);
    console.log(`  Accent:       #${colors.accent}`);
    console.log(`  Table Header: #${colors.tableHeader}`);
    console.log(`  Border:       #${colors.border}`);
    console.log(`  Cover BG:     #${colors.coverBg}`);
    console.log(`  Footer Text:  #${colors.footerText}`);
  }

  console.log("\n--- Margin Presets (twips) ---");
  for (const [name, margins] of Object.entries(DOCUMENT_STYLES.margins)) {
    const inchTop = (margins.top / 1440).toFixed(2);
    const inchLeft = (margins.left / 1440).toFixed(2);
    console.log(
      `${name.padEnd(8)}: top/bottom=${inchTop}" left/right=${inchLeft}"`
    );
  }
}

main().catch(console.error);
