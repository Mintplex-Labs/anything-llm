/**
 * Generate a preview presentation for every theme using the same rendering
 * pipeline as the production tool.  Run from repo root:
 *
 *   node server/utils/agents/aibitat/plugins/create-files/pptx/test-themes.js
 *
 * Output → storage/generated-files/theme-previews/
 */

const path = require("path");
const fs = require("fs");
const PptxGenJS = require("pptxgenjs");
const createFilesLib = require("../lib.js");
const { getTheme, getAvailableThemes } = require("./themes.js");
const {
  renderTitleSlide,
  renderSectionSlide,
  renderContentSlide,
  renderBlankSlide,
} = require("./utils.js");

const SAMPLE_SLIDES = [
  {
    title: "Executive Summary",
    content: [
      "Revenue grew 23% year-over-year to $4.2B",
      "Operating margin expanded 180bps to 28.4%",
      "Customer retention rate improved to 94.7%",
      "Three strategic acquisitions completed in Q3",
    ],
    notes: "Emphasize the margin expansion story",
  },
  {
    layout: "section",
    title: "Strategic Priorities",
    subtitle: "Key initiatives for the next fiscal year",
  },
  {
    title: "Market Opportunity",
    subtitle: "Total addressable market analysis",
    content: [
      "Global TAM estimated at $180B by 2027",
      "Our serviceable market represents $42B opportunity",
      "Current market share: 8.3% with clear path to 15%",
      "Three adjacent markets identified for expansion",
      "Competitive moat strengthening through R&D investment",
    ],
  },
  {
    title: "Financial Performance",
    table: {
      headers: ["Metric", "FY2024", "FY2025", "Growth"],
      rows: [
        ["Revenue", "$3.4B", "$4.2B", "+23%"],
        ["Gross Margin", "62.1%", "64.8%", "+270bps"],
        ["Operating Income", "$910M", "$1.19B", "+31%"],
        ["Free Cash Flow", "$780M", "$1.02B", "+31%"],
      ],
    },
  },
  {
    title: "Next Steps & Timeline",
    content: [
      "Q1: Launch Phase 2 of platform modernization",
      "Q2: Complete integration of acquired entities",
      "Q3: Enter two new geographic markets",
      "Q4: Achieve $5B annual revenue run-rate",
    ],
  },
];

async function generateThemePreview(themeName, outputDir) {
  const theme = getTheme(themeName);
  const pptx = new PptxGenJS();
  pptx.title = `${theme.name} Theme Preview`;
  pptx.author = "AnythingLLM";
  pptx.company = "AnythingLLM";

  const totalSlides = SAMPLE_SLIDES.length;

  const titleSlide = pptx.addSlide();
  renderTitleSlide(
    titleSlide,
    pptx,
    { title: `${theme.name} Theme`, author: "AnythingLLM Theme Preview" },
    theme
  );

  SAMPLE_SLIDES.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    const slideNumber = index + 1;
    const layout = slideData.layout || "content";

    switch (layout) {
      case "title":
      case "section":
        renderSectionSlide(
          slide,
          pptx,
          slideData,
          theme,
          slideNumber,
          totalSlides
        );
        break;
      case "blank":
        renderBlankSlide(slide, pptx, theme, slideNumber, totalSlides);
        break;
      default:
        renderContentSlide(
          slide,
          pptx,
          slideData,
          theme,
          slideNumber,
          totalSlides
        );
        break;
    }
  });

  const filename = `theme-preview-${themeName}.pptx`;
  const filepath = path.join(outputDir, filename);
  await pptx.writeFile({ fileName: filepath });
  console.log(`  ✓ ${theme.name} → ${filename}`);
}

async function main() {
  const baseDir = await createFilesLib.getOutputDirectory();
  const outputDir = path.join(baseDir, "theme-previews");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Generating theme previews…\n");
  const themes = getAvailableThemes();
  for (const themeName of themes) {
    await generateThemePreview(themeName, outputDir);
  }
  console.log(`\nDone! ${themes.length} previews saved to:\n  ${outputDir}`);
}

main().catch(console.error);
