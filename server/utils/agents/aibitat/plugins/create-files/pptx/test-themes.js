/**
 * Renders a preview deck for every theme, exercising every layout through the
 * production pipeline. Run from repo root:
 *
 *   node server/utils/agents/aibitat/plugins/create-files/pptx/test-themes.js
 *
 * Output → storage/generated-files/theme-previews/
 */

const path = require("path");
const fs = require("fs/promises");
const createFilesLib = require("../lib.js");
const { PALETTES, getTheme } = require("./themes.js");
const { normalizeSlides } = require("./slides.js");
const { renderDeck } = require("./render.js");

const SAMPLE_SLIDES = [
  {
    layout: "section",
    title: "Executive Summary",
    subtitle: "Where we are and where we are going",
  },
  {
    layout: "bullets",
    title: "Highlights",
    subtitle: "FY2025 at a glance",
    bullets: [
      "Revenue grew 23% year-over-year to $4.2B",
      "Operating margin expanded 180bps to 28.4%",
      "Customer retention rate improved to 94.7%",
      "Three strategic acquisitions completed in Q3",
    ],
    notes: "Emphasize the margin expansion story",
  },
  {
    layout: "stats",
    title: "By the Numbers",
    items: [
      { title: "$4.2B", text: "Annual revenue, up 23% YoY" },
      { title: "28.4%", text: "Operating margin" },
      { title: "94.7%", text: "Net customer retention" },
    ],
  },
  {
    layout: "two-column",
    title: "Opportunities vs. Risks",
    items: [
      {
        title: "Opportunities",
        bullets: [
          "Global TAM estimated at $180B by 2027",
          "Two adjacent markets ready for entry",
          "Pricing power in enterprise tier",
        ],
      },
      {
        title: "Risks",
        bullets: [
          "FX headwinds in EMEA",
          "Integration load from three acquisitions",
          "Talent competition in core engineering",
        ],
      },
    ],
  },
  {
    layout: "cards",
    title: "Strategic Priorities",
    items: [
      {
        title: "Platform Modernization",
        text: "Migrate the core stack to a unified cloud architecture by Q3.",
      },
      {
        title: "Geographic Expansion",
        text: "Open two new regional hubs with local go-to-market teams.",
      },
      {
        title: "Customer Success",
        text: "Cut time-to-value in half through guided onboarding.",
      },
      {
        title: "Operational Excellence",
        text: "Automate reporting and reduce close cycle to five days.",
      },
    ],
  },
  {
    layout: "steps",
    title: "Roadmap",
    items: [
      { title: "Q1", text: "Launch Phase 2 of platform modernization" },
      { title: "Q2", text: "Complete integration of acquired entities" },
      { title: "Q3", text: "Enter two new geographic markets" },
      { title: "Q4", text: "Reach $5B annual revenue run-rate" },
    ],
  },
  {
    layout: "chart",
    title: "Revenue by Quarter",
    chart: {
      type: "bar",
      categories: ["Q1", "Q2", "Q3", "Q4"],
      values: [950, 1000, 1100, 1150],
    },
    bullets: [
      "Every quarter beat the prior year",
      "Q4 driven by enterprise renewals",
      "Run-rate now above $4.5B",
    ],
  },
  {
    layout: "chart",
    title: "Revenue Mix",
    chart: {
      type: "doughnut",
      categories: ["Enterprise", "Mid-market", "SMB", "Services"],
      values: [52, 24, 16, 8],
    },
  },
  {
    layout: "table",
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
    layout: "quote",
    title:
      "The best way to predict the future is to build it. This year we built more than ever.",
    subtitle: "Jane Doe, Chief Executive Officer",
  },
];

async function main() {
  const outputDir = path.join(
    await createFilesLib.getOutputDirectory(),
    "theme-previews"
  );
  await fs.mkdir(outputDir, { recursive: true });
  const slides = normalizeSlides(SAMPLE_SLIDES);
  for (const name of Object.keys(PALETTES)) {
    const theme = getTheme(name);
    const buffer = await renderDeck(
      {
        title: `${theme.name} Theme`,
        subtitle: "FY2025 Annual Review",
        author: "AnythingLLM",
        slides,
      },
      theme
    );
    await fs.writeFile(
      path.join(outputDir, `theme-preview-${name}.pptx`),
      buffer
    );
    console.log(`  ✓ ${theme.name}`);
  }
  console.log(`\nDone! Previews saved to:\n  ${outputDir}`);
}

main().catch(console.error);
