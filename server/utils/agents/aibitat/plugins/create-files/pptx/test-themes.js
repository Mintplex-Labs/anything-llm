/**
 * Renders a preview deck for every theme through the production pipeline:
 * sample section content as a model would submit it, normalized, given
 * layouts and dividers the way deck-builder.js does, then rendered. Every
 * layout appears, with both sparse and full content. Run from repo root:
 *
 *   node server/utils/agents/aibitat/plugins/create-files/pptx/test-themes.js [outputDir] [theme ...]
 *
 * Output → storage/generated-files/theme-previews/ unless a directory is given.
 */

const path = require("path");
const fs = require("fs/promises");
const createFilesLib = require("../lib.js");
const { PALETTES, getTheme } = require("./themes.js");
const { normalizeSlides, assignLayouts, sectionSlide } = require("./slides.js");
const { renderDeck } = require("./render.js");

const SAMPLE_SECTIONS = [
  {
    title: "Why AnythingLLM",
    intro: "One private workspace for every model and document",
    slides: [
      {
        title: "What AnythingLLM Is",
        points: [
          "A desktop and Docker app for chatting with your documents",
          "Works with local models or any cloud provider",
          "Your data stays on your machine by default",
        ],
      },
      {
        title: "Built for Privacy",
        items: [
          {
            title: "Local first",
            text: "Documents, embeddings and chats are stored on your own hardware.",
          },
          {
            title: "Bring your own model",
            text: "Run Ollama or LM Studio locally, or connect OpenAI, Anthropic and others.",
          },
        ],
      },
    ],
  },
  {
    title: "Core Features",
    intro: "What teams use every day",
    slides: [
      {
        title: "Workspaces and Agents",
        items: [
          {
            title: "Workspaces",
            text: "Separate document sets and settings per team or project.",
          },
          {
            title: "Agents",
            text: "Agents browse the web, query SQL and create files on request.",
          },
          {
            title: "Embeddable chat",
            text: "Drop a chat widget trained on your docs into any website.",
          },
        ],
      },
      {
        title: "Getting Started",
        ordered: true,
        items: [
          {
            title: "Install",
            text: "Download the desktop app or pull the Docker image.",
          },
          {
            title: "Pick a model",
            text: "Choose a local or cloud LLM in settings.",
          },
          {
            title: "Add documents",
            text: "Upload files or sync a website or repository.",
          },
          {
            title: "Chat",
            text: "Ask questions and get answers with citations.",
          },
        ],
      },
      {
        title: "Usage at a Glance",
        figures: [
          { value: "54k", label: "GitHub stars" },
          { value: "30+", label: "LLM providers supported" },
          { value: "1M+", label: "Desktop downloads" },
        ],
      },
    ],
  },
  {
    title: "Deployment Options",
    intro: "Desktop for individuals, Docker for teams",
    slides: [
      {
        title: "Desktop vs Docker",
        table: {
          headers: ["", "Desktop", "Docker"],
          rows: [
            ["Users", "Single user", "Multi-user with roles"],
            ["Setup", "One installer", "One container"],
            ["Best for", "Personal knowledge base", "Teams and businesses"],
            ["Updates", "Automatic", "Pull a new image"],
          ],
        },
      },
      {
        title: "Monthly Active Workspaces",
        chart: {
          type: "bar",
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [1200, 1850, 2400, 3100, 3900, 4600],
        },
        points: [
          "Growth nearly quadrupled in six months",
          "Docker installs drove most of the gain",
        ],
      },
      {
        title: "Rollout Plan",
        ordered: true,
        items: [
          {
            title: "Pilot",
            text: "One team runs the Docker build for two weeks.",
          },
          {
            title: "Security review",
            text: "IT checks storage, auth and network access.",
          },
          {
            title: "Connect data",
            text: "Sync the wiki, drive and support docs.",
          },
          {
            title: "Train users",
            text: "A one-hour session on workspaces and agents.",
          },
          { title: "Company launch", text: "Open access to every department." },
          {
            title: "Review",
            text: "Measure usage and gather feedback after 30 days.",
          },
        ],
      },
    ],
  },
  {
    title: "Customer Stories",
    intro: "How teams describe it",
    slides: [
      {
        title: "What Users Say",
        quote: {
          text: "We replaced three internal tools with one private assistant our whole support team actually uses.",
          by: "Head of Customer Success",
        },
      },
      {
        title: "Results After One Quarter",
        figures: [
          { value: "38%", label: "Fewer escalated tickets" },
          { value: "2.4x", label: "Faster answers for new hires" },
          { value: "$180k", label: "Annual tooling savings" },
          { value: "94%", label: "Weekly active staff" },
          { value: "12", label: "Departments onboarded" },
          { value: "4.8/5", label: "Internal satisfaction score" },
        ],
      },
      {
        title: "Where It Helps Most",
        items: [
          {
            title: "Support",
            text: "Answers from the help center in seconds.",
          },
          { title: "Sales", text: "Proposal drafts from past wins." },
          {
            title: "Engineering",
            text: "Search across code, docs and tickets.",
          },
          { title: "HR", text: "Policy questions answered privately." },
          { title: "Legal", text: "Contract review against templates." },
          { title: "Finance", text: "Summaries of reports and filings." },
        ],
      },
      {
        title: "Next Steps",
        points: [
          "Expand agent access to the CRM and ticketing system",
          "Add a second local model for code questions",
          "Publish an internal guide to writing good prompts",
          "Review costs and usage again at the end of next quarter",
        ],
      },
    ],
  },
];

/** The sample deck's slides, built the way deck-builder.js builds them. */
function sampleSlides() {
  const layouts = { used: {}, previous: null };
  return SAMPLE_SECTIONS.flatMap((section) => [
    sectionSlide(section.title, section.intro),
    ...assignLayouts(
      normalizeSlides(section.slides, { fallbackTitle: section.title }),
      layouts
    ),
  ]);
}

async function main() {
  const [dir, ...names] = process.argv.slice(2);
  const outputDir =
    dir ||
    path.join(await createFilesLib.getOutputDirectory(), "theme-previews");
  await fs.mkdir(outputDir, { recursive: true });
  const slides = sampleSlides();
  for (const name of names.length ? names : Object.keys(PALETTES)) {
    const theme = getTheme(name);
    const buffer = await renderDeck(
      {
        title: "AnythingLLM Features",
        subtitle: "A private AI workspace for every team",
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

if (require.main === module) main().catch(console.error);

module.exports = { sampleSlides };
