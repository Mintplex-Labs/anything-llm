const pluralize = require("pluralize");
const createFilesLib = require("../lib.js");
const { safeJsonParse } = require("../../../../../http");
const { THEMES, getTheme } = require("./themes.js");
const { renderCover, renderSlide } = require("./layouts.js");
const { pruneDividers } = require("./normalize.js");
const { buildSection, searchWeb } = require("./section-agent.js");

const THEME_HELP = Object.entries(THEMES)
  .map(([id, t]) => `${id} (${t.description})`)
  .join("; ");
const MAX_SECTIONS = 5;

/**
 * Extracts recent conversation history from the parent AIbitat's chat log
 * to provide context to each section builder.
 * @param {Array} chats - The parent AIbitat's _chats array
 * @param {number} [maxMessages=10] - Maximum messages to include
 * @returns {string} Formatted conversation context
 */
function extractConversationContext(chats, maxMessages = 10) {
  if (!Array.isArray(chats) || chats.length === 0) return "";

  const recent = chats
    .filter((c) => c.state === "success" && c.content)
    .slice(-maxMessages);

  if (recent.length === 0) return "";

  return recent
    .map((c) => {
      const content =
        typeof c.content === "string" ? c.content.substring(0, 500) : "";
      return `${c.from}: ${content}`;
    })
    .join("\n");
}

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
                enum: Object.keys(THEMES),
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
            theme: themeName = "midnight",
            accentColor = "",
            research = false,
            sections = [],
          }) {
            try {
              this.super.handlerProps.log(
                `Using the create-pptx-presentation tool.`
              );

              // Strip XML 1.0 illegal control characters so PowerPoint can open
              // the generated deck (slide content is sanitized after assembly).
              title = createFilesLib.stripInvalidXmlChars(title);
              subtitle = createFilesLib.stripInvalidXmlChars(subtitle);
              author = createFilesLib.stripInvalidXmlChars(author);

              if (!filename.toLowerCase().endsWith(".pptx"))
                filename += ".pptx";

              // Small models sometimes pass the array as a JSON string and
              // booleans as strings.
              if (typeof sections === "string")
                sections = safeJsonParse(sections, []);
              if (!Array.isArray(sections)) sections = [];
              sections = sections
                .filter((s) => s && typeof s === "object" && s.title)
                .slice(0, MAX_SECTIONS);
              research = research === true || research === "true";

              const theme = getTheme(themeName, accentColor);
              const totalSections = sections.length;

              this.super.introspect(
                `${this.caller}: Planning presentation "${title}" — ${pluralize("section", totalSections, true)}, ${theme.name} theme`
              );

              // Ask for approval BEFORE kicking off the section builds
              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    filename,
                    title,
                    sectionCount: totalSections,
                    sectionTitles: sections.map((s) => s.title),
                  },
                  description: `Create PowerPoint presentation "${title}" with ${totalSections} sections`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              const conversationContext = extractConversationContext(
                this.super._chats
              );

              // One search on the deck topic feeds every section; sections with
              // their own instructions search again for their specific facts.
              let deckNotes = "";
              const deckCitations = [];
              if (research) {
                const found = await searchWeb(
                  this.super,
                  `${title} ${subtitle}`.trim().slice(0, 100)
                );
                deckNotes = found.notes;
                deckCitations.push(...found.citations);
              }

              // Build each section sequentially.
              // Sequential execution is intentional — local models typically serve
              // one request at a time, and it keeps introspection events ordered.
              const allSlides = [];
              const allCitations = [...deckCitations];
              const layoutTally = {};
              for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                this.super.introspect(
                  `${this.caller}: [${i + 1}/${totalSections}] Building section "${section.title}"…`
                );

                const sectionResult = await buildSection({
                  parentAibitat: this.super,
                  section,
                  presentationTitle: title,
                  research,
                  notes: deckNotes,
                  conversationContext,
                  layoutTally,
                  sectionPrefix: `${i + 1}/${totalSections}`,
                });

                const slideCount = sectionResult.slides.length;
                for (const slide of sectionResult.slides)
                  if (slide.layout !== "section")
                    layoutTally[slide.layout] =
                      (layoutTally[slide.layout] || 0) + 1;
                allSlides.push(...sectionResult.slides);
                allCitations.push(...sectionResult.citations);

                this.super.introspect(
                  `${this.caller}: [${i + 1}/${totalSections}] Section "${section.title}" complete — ${pluralize("slide", slideCount, true)}`
                );
              }

              // Roll up all citations from section research to the parent so they
              // appear as sources on the final assistant message.
              if (allCitations.length > 0) this.super.addCitation(allCitations);

              // Assemble the final PPTX from all section outputs
              this.super.introspect(
                `${this.caller}: Assembling final deck — ${allSlides.length} slides total`
              );

              const PptxGenJS = require("pptxgenjs");
              const pptx = new PptxGenJS();

              pptx.title = title;
              if (author) pptx.author = author;
              pptx.company = "AnythingLLM";

              // Section builder output can carry XML 1.0 illegal control characters
              // (e.g. a form feed from a LaTeX `\frac`); strip them recursively
              // from every slide so PowerPoint can open the generated deck.
              const cleanSlides = pruneDividers(
                createFilesLib.stripInvalidXmlChars(allSlides)
              );
              const totalSlideCount = cleanSlides.length;

              // Title slide
              renderCover(
                pptx.addSlide(),
                pptx,
                { title, subtitle, author },
                theme
              );

              // Render every slide produced by the section builders
              let sectionIndex = 0;
              cleanSlides.forEach((slideData, index) => {
                if (slideData.layout === "section") sectionIndex++;
                renderSlide(pptx, slideData, theme, {
                  n: index + 1,
                  total: totalSlideCount,
                  sectionIndex,
                  firstInSection: cleanSlides[index - 1]?.layout === "section",
                });
              });

              const buffer = await pptx.write({ outputType: "nodebuffer" });
              const bufferSizeKB = (buffer.length / 1024).toFixed(2);
              const bufferSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
              this.super.handlerProps.log(
                `create-pptx-presentation: Generated buffer - size: ${bufferSizeKB}KB (${bufferSizeMB}MB), slides: ${totalSlideCount}, theme: ${theme.name}`
              );

              const displayFilename = filename.split("/").pop();

              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "pptx",
                extension: "pptx",
                buffer,
                displayFilename,
              });

              this.super.socket.send("fileDownloadCard", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              createFilesLib.registerOutput(this.super, "PptxFileDownload", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              this.super.introspect(
                `${this.caller}: Successfully created presentation "${title}"`
              );

              return `Successfully created presentation "${title}" with ${totalSlideCount} slides across ${totalSections} sections using the ${theme.name} theme.`;
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
