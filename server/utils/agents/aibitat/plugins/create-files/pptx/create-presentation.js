const pluralize = require("pluralize");
const createFilesLib = require("../lib.js");
const { safeJsonParse } = require("../../../../../http");
const { PALETTES, getTheme } = require("./themes.js");
const { buildDeck } = require("./deck-builder.js");
const { renderDeck } = require("./render.js");
const { normalizeCover } = require("./slides.js");
const { slidePreviews, settled } = require("./previews.js");
const {
  attachedPictures,
  webPictures,
  canGenerateImages,
  illustrator,
  assignPictures,
} = require("./images.js");

const MAX_SECTIONS = 5;
const THEME_HELP = Object.entries(PALETTES)
  .map(([id, t]) => `${id} (${t.description})`)
  .join("; ");

/**
 * The tool result for the calling agent. It names every requested section
 * that is missing from the deck and why, so the agent can tell the user.
 */
function deckSummary({ title, slides, theme, requested, built, pictures }) {
  const titles = (list) => list.map((s) => `"${s.title ?? s}"`).join(", ");
  const overCap = requested.slice(MAX_SECTIONS);
  const failed = requested
    .slice(0, MAX_SECTIONS)
    .filter((s) => !built.includes(s.title));
  const lines = [
    `Successfully created presentation "${title}" with ${pluralize("slide", slides.length, true)} using the ${theme.name} theme.`,
    `Sections built: ${built.length ? titles(built) : "none"}.`,
  ];
  if (pictures) lines.push(`It has ${pluralize("picture", pictures, true)}.`);
  if (overCap.length)
    lines.push(
      `Left out because a presentation holds at most ${MAX_SECTIONS} sections: ${titles(overCap)}.`
    );
  if (failed.length)
    lines.push(
      `Left out because no slides could be written: ${titles(failed)}.`
    );
  if (overCap.length || failed.length)
    lines.push("Tell the user which sections were left out.");
  return lines.join(" ");
}

module.exports.CreatePptxPresentation = {
  name: "create-pptx-presentation",
  plugin: function () {
    return {
      name: "create-pptx-presentation",
      setup(aibitat) {
        // Generation is only offered when it can work.
        const canGenerate = canGenerateImages();
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a professional PowerPoint presentation (PPTX). " +
            "Provide a title and section outlines with key points. " +
            "The user does not need to specify colors, layouts or slide count. " +
            `Use 3-${MAX_SECTIONS} sections; a typical deck is 10-16 slides. ` +
            "Each section is built separately; set research to true to run a web search first.",
          examples: [
            {
              prompt: "Create a presentation about project updates",
              call: JSON.stringify({
                filename: "project-updates.pptx",
                title: "Q1 Project Updates",
                sections: [
                  {
                    title: "Overview",
                    keyPoints: [
                      "Project on track for Q1 delivery",
                      "Team expanded by 2 new members",
                      "Budget within expectations",
                    ],
                  },
                  {
                    title: "Key Achievements",
                    keyPoints: [
                      "Launched new feature X",
                      "Reduced bug count by 40%",
                      "Improved performance by 25%",
                    ],
                    instructions:
                      "Include specific metrics and quarter-over-quarter comparisons",
                  },
                ],
              }),
            },
            {
              prompt: "Make a green powerpoint about AI trends",
              call: JSON.stringify({
                filename: "ai-trends.pptx",
                title: "AI Trends 2025",
                theme: "emerald",
                sections: [
                  {
                    title: "Large Language Models",
                    keyPoints: [
                      "Model scaling trends",
                      "Open vs closed source landscape",
                    ],
                    instructions:
                      "Research the latest developments and include recent data",
                  },
                  {
                    title: "AI in Enterprise",
                    keyPoints: ["Adoption rates", "Top use cases", "ROI data"],
                  },
                ],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              filename: {
                type: "string",
                description:
                  "The filename for the presentation (should end with .pptx).",
              },
              title: {
                type: "string",
                description:
                  "The title of the presentation (shown on title slide).",
              },
              subtitle: {
                type: "string",
                description:
                  "Optional subtitle for the title slide (e.g. date, event, tagline).",
              },
              author: {
                type: "string",
                description:
                  "Optional author name for the presentation metadata.",
              },
              theme: {
                type: "string",
                enum: Object.keys(PALETTES),
                description:
                  "Only set this when the user asks for a color or style; otherwise leave it out and the presentation gets a palette of its own. Palettes: " +
                  THEME_HELP,
              },
              accentColor: {
                type: "string",
                description:
                  "Optional 6-digit hex color (e.g. 'ED1C24') to use as the accent color instead of the palette default. Use for brand colors when the user asks.",
              },
              images: {
                type: "string",
                enum: ["none", "web", ...(canGenerate ? ["generate"] : [])],
                description:
                  "Pictures for the slides. Leave it out unless the user asks for images, pictures or visuals. web: photos from web pages found by searching." +
                  (canGenerate
                    ? " generate: new illustrations from the image generator."
                    : "") +
                  " Images the user attached are used without this.",
              },
              research: {
                type: "boolean",
                description:
                  "Search the web before writing. Only set true when the user explicitly asks to research or look something up. Otherwise false.",
              },
              sections: {
                type: "array",
                description: `Section outlines for the presentation, 3-${MAX_SECTIONS} of them. Each section becomes a divider plus 2-3 content slides, or up to 6 when it needs them.`,
                maxItems: MAX_SECTIONS,
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "The section title.",
                    },
                    keyPoints: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Key points this section should cover, expanded into detailed slides. Include every specific number, name and fact from the conversation this section needs; each section is written separately from this outline.",
                    },
                    instructions: {
                      type: "string",
                      description:
                        "Optional guidance for the section builder (e.g. 'research recent statistics', 'compare with competitors', 'include a data table').",
                    },
                    image: {
                      type: "integer",
                      description:
                        "Only when the user attached images: the number of the attached image to show in this section (1 = the first image they attached).",
                    },
                  },
                  required: ["title"],
                },
              },
            },
            required: ["filename", "title", "sections"],
            additionalProperties: false,
          },

          handler: async function ({
            filename = "presentation.pptx",
            title = "Untitled Presentation",
            subtitle = "",
            author = "",
            theme: themeName,
            accentColor,
            research,
            images: imageMode,
            sections,
          }) {
            let previews = null;
            let stopImages = () => {};
            try {
              this.super.handlerProps.log(
                `Using the create-pptx-presentation tool.`
              );
              const say = (msg) =>
                this.super.introspect(`${this.caller}: ${msg}`);

              // Small models pass arrays as JSON strings and booleans as strings.
              if (typeof sections === "string")
                sections = safeJsonParse(sections, []);
              const requested = (
                Array.isArray(sections) ? sections : []
              ).filter((s) => s && typeof s === "object" && s.title);
              sections = requested.slice(0, MAX_SECTIONS);
              research = research === true || research === "true";
              const mode =
                imageMode === "web" ||
                (imageMode === "generate" && canGenerateImages())
                  ? imageMode
                  : "none";
              // Web pictures come from the pages a search finds.
              if (mode === "web") research = true;
              filename = String(filename);
              if (!filename.toLowerCase().endsWith(".pptx"))
                filename += ".pptx";
              const theme = getTheme(themeName, accentColor, title);

              say(
                `Planning presentation "${title}" — ${pluralize("section", sections.length, true)}, ${theme.name} theme`
              );
              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    filename,
                    title,
                    sectionCount: sections.length,
                    sectionTitles: sections.map((s) => s.title),
                    images: mode,
                  },
                  description:
                    `Create PowerPoint presentation "${title}" with ${sections.length} sections` +
                    (mode === "generate"
                      ? ` and ${sections.length + 1} generated images`
                      : ""),
                });
                if (!approval.approved) {
                  say(`User rejected the ${this.name} request.`);
                  return approval.message;
                }
              }

              // Section calls never see the chat directly; they can search it
              // with a lookup tool when the outline leaves a detail out.
              const history = (this.super._chats ?? [])
                .filter(
                  (c) => c.state === "success" && typeof c.content === "string"
                )
                .map((c) => ({ from: c.from, content: c.content }));
              const log = (msg) => this.super.handlerProps.log(msg);
              // Downloads and generations stop when the session is stopped
              // or this call ends early, so a failed deck stops paying for
              // images.
              const imageWork = new AbortController();
              const session = this.super.abortController?.signal;
              const relay = () => imageWork.abort();
              session?.addEventListener("abort", relay, { once: true });
              stopImages = () => {
                session?.removeEventListener("abort", relay);
                imageWork.abort();
              };
              const signal = imageWork.signal;
              const attached = await attachedPictures(
                this.super.chats,
                new Set(sections.map((s) => Number(s.image)))
              );
              const cover = {
                ...normalizeCover({ title, subtitle }),
                image: null,
                credit: "",
              };
              previews = slidePreviews(this.super, cover, theme);
              // Chooses every picture once the deck-level search has found
              // its pages; the cover preview waits for the cover picture.
              const planImages = async ({ links }) => {
                let web = [];
                if (mode === "web" && links.length) {
                  say("Looking for pictures on the pages found");
                  web = await webPictures(links, { log, signal });
                }
                const generate =
                  mode === "generate"
                    ? illustrator({ theme, log, signal })
                    : null;
                if (generate)
                  say(
                    `Generating ${pluralize("illustration", sections.length + 1, true)} while the slides are written`
                  );
                const plan = assignPictures({
                  mode,
                  title: cover.title,
                  sections,
                  attached,
                  web,
                  generate,
                });
                cover.image = plan.cover?.image ?? null;
                cover.credit = plan.cover?.credit ?? "";
                previews.add(null);
                return plan;
              };
              const { slides, citations, built } = await buildDeck(this.super, {
                say,
                title,
                subtitle,
                sections,
                research,
                history,
                onSlides: (batch) => batch.forEach(previews.add),
                planImages,
              });
              if (this.super._aborted)
                return "Presentation generation was cancelled.";
              if (citations.length) this.super.addCitation(citations);

              say(
                `Assembling final deck — ${pluralize("slide", slides.length, true)}`
              );
              cover.image = await settled(cover.image);
              for (const slide of slides)
                if (slide.image) slide.image = await settled(slide.image);
              const pictures =
                slides.filter((s) => s.image).length + (cover.image ? 1 : 0);
              // Model output can carry XML 1.0 illegal control characters (e.g.
              // a form feed from a LaTeX `\frac`); strip them so PowerPoint can
              // open the deck.
              const buffer = await renderDeck(
                createFilesLib.stripInvalidXmlChars({
                  ...cover,
                  author,
                  slides,
                }),
                theme
              );
              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "pptx",
                extension: "pptx",
                buffer,
                displayFilename: filename.split("/").pop(),
              });
              const download = {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              };
              this.super.socket.send("fileDownloadCard", download);
              createFilesLib.registerOutput(
                this.super,
                "PptxFileDownload",
                download
              );

              say(`Successfully created presentation "${title}"`);
              return deckSummary({
                title,
                slides,
                theme,
                requested,
                built,
                pictures,
              });
            } catch (e) {
              this.super.handlerProps.log(
                `create-pptx-presentation error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating presentation: ${e.message}`;
            } finally {
              stopImages();
              previews?.end();
            }
          },
        });
      },
    };
  },
};
