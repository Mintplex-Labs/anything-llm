const pluralize = require("pluralize");
const createFilesLib = require("../lib.js");
const { safeJsonParse } = require("../../../../../http");
const { PALETTES, getTheme } = require("./themes.js");
const { buildDeck } = require("./deck-builder.js");
const { renderDeck } = require("./render.js");

const MAX_SECTIONS = 5;
// Recent chat passed to every section call, so it is kept small enough not to
// crowd out the outline and research on small local models.
const CONTEXT_MESSAGES = 10;
const CONTEXT_MESSAGE_CHARS = 500;
const THEME_HELP = Object.entries(PALETTES)
  .map(([id, t]) => `${id} (${t.description})`)
  .join("; ");

module.exports.CreatePptxPresentation = {
  name: "create-pptx-presentation",
  plugin: function () {
    return {
      name: "create-pptx-presentation",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a professional PowerPoint presentation (PPTX). " +
            "Provide a title, a theme you choose to fit the topic, and section outlines with key points. " +
            "The user does not need to specify a theme, layouts or slide count; pick them yourself. " +
            `Use 3-${MAX_SECTIONS} sections; a typical deck is 10-16 slides. ` +
            "Each section is built separately; set research to true to run a web search first.",
          examples: [
            {
              prompt: "Create a presentation about project updates",
              call: JSON.stringify({
                filename: "project-updates.pptx",
                title: "Q1 Project Updates",
                theme: "corporate",
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
              prompt: "Make a powerpoint about AI trends",
              call: JSON.stringify({
                filename: "ai-trends.pptx",
                title: "AI Trends 2025",
                theme: "carbon",
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
                  "Color palette for the presentation. Choose the one that best fits the topic and audience: " +
                  THEME_HELP,
              },
              accentColor: {
                type: "string",
                description:
                  "Optional 6-digit hex color (e.g. 'ED1C24') to use as the accent color instead of the palette default. Use for brand colors when the user asks.",
              },
              research: {
                type: "boolean",
                description:
                  "Search the web before writing. Only set true when the user explicitly asks to research or look something up. Otherwise false.",
              },
              sections: {
                type: "array",
                description: `Section outlines for the presentation, 3-${MAX_SECTIONS} of them. Each section becomes a divider plus 2-3 content slides.`,
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
                        "Key points this section should cover. They are expanded into detailed slides.",
                    },
                    instructions: {
                      type: "string",
                      description:
                        "Optional guidance for the section builder (e.g. 'research recent statistics', 'compare with competitors', 'include a data table').",
                    },
                  },
                  required: ["title"],
                },
              },
            },
            required: ["filename", "title", "theme", "sections"],
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
            sections,
          }) {
            try {
              this.super.handlerProps.log(
                `Using the create-pptx-presentation tool.`
              );
              const say = (msg) =>
                this.super.introspect(`${this.caller}: ${msg}`);

              // Small models pass arrays as JSON strings and booleans as strings.
              if (typeof sections === "string")
                sections = safeJsonParse(sections, []);
              sections = (Array.isArray(sections) ? sections : [])
                .filter((s) => s && typeof s === "object" && s.title)
                .slice(0, MAX_SECTIONS);
              research = research === true || research === "true";
              if (!filename.toLowerCase().endsWith(".pptx"))
                filename += ".pptx";
              const theme = getTheme(themeName, accentColor);

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
                  },
                  description: `Create PowerPoint presentation "${title}" with ${sections.length} sections`,
                });
                if (!approval.approved) {
                  say(`User rejected the ${this.name} request.`);
                  return approval.message;
                }
              }

              const context = (this.super._chats ?? [])
                .filter(
                  (c) => c.state === "success" && typeof c.content === "string"
                )
                .slice(-CONTEXT_MESSAGES)
                .map(
                  (c) =>
                    `${c.from}: ${c.content.slice(0, CONTEXT_MESSAGE_CHARS)}`
                )
                .join("\n");
              const { slides, citations } = await buildDeck(this.super, {
                say,
                title,
                subtitle,
                sections,
                research,
                context,
              });
              if (citations.length) this.super.addCitation(citations);

              say(
                `Assembling final deck — ${pluralize("slide", slides.length, true)}`
              );
              // Model output can carry XML 1.0 illegal control characters (e.g.
              // a form feed from a LaTeX `\frac`); strip them so PowerPoint can
              // open the deck.
              const buffer = await renderDeck(
                createFilesLib.stripInvalidXmlChars({
                  title,
                  subtitle,
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
              return `Successfully created presentation "${title}" with ${slides.length} slides across ${sections.length} sections using the ${theme.name} theme.`;
            } catch (e) {
              this.super.handlerProps.log(
                `create-pptx-presentation error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating presentation: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
