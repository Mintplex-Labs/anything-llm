const createFilesLib = require("../lib.js");
const { getTheme, getAvailableThemes } = require("./themes.js");
const {
  renderTitleSlide,
  renderSectionSlide,
  renderContentSlide,
  renderBlankSlide,
  renderQuoteSlide,
  renderClosingSlide,
} = require("./utils.js");
const { runSectionAgent } = require("./section-agent.js");
const pexels = require("./pexels.js");

/**
 * Coerces the `sections` argument into an array of section objects.
 *
 * Smaller models routinely serialize an array-of-objects argument as a JSON
 * *string* rather than a JSON array. Left alone that reaches `sections.length`
 * as a character count and `sections.map` as undefined, so the tool dies with
 * "sections.map is not a function" after the user has already waited through
 * approval. Parsing here costs nothing and turns a hard failure into a retry
 * the model can actually act on.
 *
 * @param {unknown} sections
 * @returns {object[]}
 */
function normalizeSections(sections) {
  let value = sections;

  if (typeof value === "string") {
    try {
      value = JSON.parse(value.trim());
    } catch (e) {
      throw new Error(
        `The "sections" argument was a string that is not valid JSON (${e.message}). ` +
          `Pass sections as a JSON array of objects, not as a quoted string.`
      );
    }
  }

  // Some models wrap the array in the property it was asked for.
  if (value && !Array.isArray(value) && Array.isArray(value.sections))
    value = value.sections;

  if (!Array.isArray(value) || value.length === 0)
    throw new Error(
      `The "sections" argument must be a non-empty array of { title, keyPoints } objects.`
    );

  return value.map((raw, i) => {
    const section = typeof raw === "string" ? { title: raw } : raw || {};
    let keyPoints = section.keyPoints;
    // A single key point sometimes arrives as a bare string, or as a JSON array
    // string for the same reason `sections` does.
    if (typeof keyPoints === "string") {
      try {
        const parsed = JSON.parse(keyPoints);
        keyPoints = Array.isArray(parsed) ? parsed : [keyPoints];
      } catch {
        keyPoints = [keyPoints];
      }
    }
    return {
      ...section,
      title: String(section.title || `Phần ${i + 1}`),
      keyPoints: Array.isArray(keyPoints) ? keyPoints.map(String) : [],
    };
  });
}

/**
 * Guarantees the section opens on a divider slide, and that the divider carries
 * the section's photo query.
 *
 * The section sub-agent is told to set `imageQuery` on its divider, but smaller
 * models skip optional fields, and a deck with no photos was the result. The
 * query the *parent* model supplied is authoritative: applying it here makes the
 * photo a property of the outline rather than of the sub-agent's compliance.
 *
 * @param {object[]} slides - The sub-agent's slides for one section, mutated.
 * @param {object} section - The outline entry, possibly carrying `imageQuery`.
 */
function ensureSectionDivider(slides, section) {
  let divider = slides.find((s) => s && s.layout === "section");
  if (!divider) {
    divider = { layout: "section", title: section.title };
    slides.unshift(divider);
  }

  const query =
    typeof section.imageQuery === "string" ? section.imageQuery.trim() : "";
  if (query) divider.imageQuery = query;
}

/**
 * Extracts recent conversation history from the parent AIbitat's chat log
 * to provide context to each section sub-agent.
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

// Total-slide budget. The user thinks in finished slides, not in sections, so
// the deck is sized to a slide count and the section fan-out is bent to fit it.
const SLIDES_DEFAULT = 10;
const SLIDES_MIN = 10;
const SLIDES_MAX = 30;

/**
 * Resolves the requested total slide count to an honored value:
 * unspecified -> 10, otherwise clamped into [10, 30]. Asking for more than 30
 * still yields 30; asking for fewer than 10 (or garbage) yields 10.
 * @param {unknown} requested
 * @returns {number}
 */
function clampSlideCount(requested) {
  let n = Number(requested);
  if (!Number.isFinite(n) || n <= 0) n = SLIDES_DEFAULT;
  n = Math.round(n);
  return Math.max(SLIDES_MIN, Math.min(SLIDES_MAX, n));
}

/**
 * Hard-trims the assembled section slides so the finished deck never exceeds the
 * budget. `maxSectionSlides` excludes the always-present title/cover slide.
 * Trimming happens from the end (whole trailing sections drop first); if the cut
 * lands right after a bare "section" divider, that orphaned divider is dropped
 * too so the deck never ends on an empty divider.
 * @param {object[]} slides
 * @param {number} maxSectionSlides
 * @returns {object[]}
 */
function enforceSlideBudget(slides, maxSectionSlides) {
  if (!Array.isArray(slides) || slides.length <= maxSectionSlides) return slides;
  let trimmed = slides.slice(0, maxSectionSlides);
  while (
    trimmed.length > 0 &&
    trimmed[trimmed.length - 1] &&
    trimmed[trimmed.length - 1].layout === "section"
  )
    trimmed = trimmed.slice(0, -1);
  return trimmed.length > 0 ? trimmed : slides.slice(0, maxSectionSlides);
}

// Exported for tests; the plugin itself calls these from the handler.
module.exports.normalizeSections = normalizeSections;
module.exports.ensureSectionDivider = ensureSectionDivider;
module.exports.clampSlideCount = clampSlideCount;
module.exports.enforceSlideBudget = enforceSlideBudget;

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
            "Provide a title, theme, and section outlines with key points and an " +
            "English imageQuery per section for its illustrative photo. " +
            "Each section is independently researched and built by a focused sub-agent " +
            "that can use web search and web scraping to gather data. " +
            "If the user asks for a specific number of slides, pass it as slideCount " +
            "(honored within 10-30; omit it for the default of 10). Each section " +
            "becomes roughly two slides, so provide about slideCount/2 sections.",
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
                    imageQuery: "team meeting whiteboard",
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
                    imageQuery: "developer typing laptop",
                  },
                ],
              }),
            },
            {
              prompt: "Create a dark themed presentation about AI trends",
              call: JSON.stringify({
                filename: "ai-trends.pptx",
                title: "AI Trends 2025",
                theme: "dark",
                sections: [
                  {
                    title: "Large Language Models",
                    keyPoints: [
                      "Model scaling trends",
                      "Open vs closed source landscape",
                    ],
                    instructions:
                      "Research the latest developments and include recent data",
                    imageQuery: "data center servers",
                  },
                  {
                    title: "AI in Enterprise",
                    keyPoints: ["Adoption rates", "Top use cases", "ROI data"],
                    imageQuery: "office workers computers",
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
              author: {
                type: "string",
                description:
                  "Optional author name for the presentation metadata.",
              },
              theme: {
                type: "string",
                enum: getAvailableThemes(),
                description:
                  "Color theme for the presentation. Options: " +
                  getAvailableThemes().join(", "),
              },
              slideCount: {
                type: "integer",
                minimum: SLIDES_MIN,
                maximum: SLIDES_MAX,
                description:
                  "Desired total number of slides in the finished deck (including the cover). " +
                  "Set this from the user's request. Honored within 10-30: a larger number is " +
                  "capped at 30, a smaller one raised to 10. Omit it to use the default of 10.",
              },
              sections: {
                type: "array",
                description:
                  "Section outlines for the presentation. Each section is independently researched and built by a focused sub-agent and becomes about two slides. " +
                  "Provide ENOUGH sections to fill the deck: roughly slideCount/2 (e.g. ~5 sections for a 10-slide deck, ~10 for a 20-slide deck). " +
                  "Never submit a whole presentation as a single section - break the topic into several distinct sections so the deck is not just 3-4 slides.",
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
                        "Key points this section should cover. The sub-agent will expand these into detailed slides.",
                    },
                    instructions: {
                      type: "string",
                      description:
                        "Optional guidance for the section builder (e.g. 'research recent statistics', 'compare with competitors', 'include a data table').",
                    },
                    imageQuery: {
                      type: "string",
                      description:
                        "ALWAYS provide this. A 2-4 word ENGLISH stock-photo search phrase naming a concrete, photographable subject for this section's divider slide (e.g. 'football stadium crowd', 'vietnamese government office'). Write it in English even for a Vietnamese presentation. Avoid abstractions like 'innovation' — name something a camera could point at.",
                    },
                  },
                  required: ["title", "imageQuery"],
                },
              },
            },
            required: ["filename", "title", "sections"],
            additionalProperties: false,
          },

          handler: async function ({
            filename = "presentation.pptx",
            title = "Untitled Presentation",
            author = "",
            theme: themeName = "default",
            sections = [],
            slideCount,
          }) {
            try {
              this.super.handlerProps.log(
                `Using the create-pptx-presentation tool.`
              );

              // One deck per user request. A single agent run (this.super lives
              // for exactly one user prompt, then the session closes) must never
              // yield a second PPTX: when the user asks for a large deck the model
              // is prone to fan the work out into two tool calls of ~30 slides
              // each, producing two files. The deck is already capped at 30 slides
              // in a single file, so a second call is redundant - short-circuit it
              // and point the model back at the file it already produced.
              if (this.super.__pptxPresentationCreated) {
                const prior = this.super.__pptxPresentationCreated;
                this.super.introspect(
                  `${this.caller}: A presentation was already created in this request — skipping the duplicate.`
                );
                return (
                  `A presentation ("${prior.filename}", ${prior.slideCount} slides) was already ` +
                  `created in this request and is ready for download. Only one presentation file ` +
                  `is produced per request (a single deck, max 30 slides). Do NOT create another — ` +
                  `report the existing file to the user instead of calling this tool again.`
                );
              }

              await createFilesLib.initializeLogo();

              // Strip XML 1.0 illegal control characters so PowerPoint can open
              // the generated deck (slide content is sanitized after assembly).
              title = createFilesLib.stripInvalidXmlChars(title);
              author = createFilesLib.stripInvalidXmlChars(author);

              if (!filename.toLowerCase().endsWith(".pptx"))
                filename += ".pptx";

              sections = normalizeSections(sections);

              const theme = getTheme(themeName);
              const totalSections = sections.length;

              // Size the deck to a slide count, not a section count. The deck
              // always carries a cover slide and a closing slide (2 total), so
              // the sections share the remaining budget.
              const targetSlides = clampSlideCount(slideCount);
              const sectionSlidesTarget = Math.max(1, targetSlides - 2);
              // Slides per section (its divider counts as one). Floored at 2 so a
              // section is never just a bare divider; capped at 8 so a deck with
              // very few sections still asks each sub-agent for enough slides to
              // approach the target (a lone section otherwise yields a 3-4 slide
              // deck). ceil rounds up so the budget fills rather than falls short.
              // The final trim below still enforces the hard ceiling.
              const budgetPerSection = Math.max(
                2,
                Math.min(8, Math.ceil(sectionSlidesTarget / Math.max(1, totalSections)))
              );

              this.super.introspect(
                `${this.caller}: Planning presentation "${title}" — ${totalSections} section${totalSections !== 1 ? "s" : ""}, target ${targetSlides} slides, ${theme.name} theme`
              );

              // Ask for approval BEFORE kicking off the expensive sub-agent work
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

              // Run a focused sub-agent for each section sequentially.
              // Sequential execution is intentional — local models typically serve
              // one request at a time, and it keeps introspection events ordered.
              const allSlides = [];
              const allCitations = [];
              for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                this.super.introspect(
                  `${this.caller}: [${i + 1}/${totalSections}] Building section "${section.title}"…`
                );

                const sectionResult = await runSectionAgent({
                  parentAibitat: this.super,
                  section,
                  presentationTitle: title,
                  conversationContext,
                  sectionPrefix: `${i + 1}/${totalSections}`,
                  slideBudget: budgetPerSection,
                });

                const sectionSlides = sectionResult.slides || [];
                ensureSectionDivider(sectionSlides, section);
                const sectionSlideCount = sectionSlides.length;
                allSlides.push(...sectionSlides);
                if (sectionResult.citations?.length > 0)
                  allCitations.push(...sectionResult.citations);

                this.super.introspect(
                  `${this.caller}: [${i + 1}/${totalSections}] Section "${section.title}" complete — ${sectionSlideCount} slide${sectionSlideCount !== 1 ? "s" : ""}`
                );
              }

              // Roll up all citations from sub-agents to the parent so they
              // appear as sources on the final assistant message.
              if (allCitations.length > 0) this.super.addCitation(allCitations);

              // Enforce the hard ceiling: the sub-agents can overshoot the budget
              // (each floored at two slides), so trim before assembly so the deck
              // never exceeds the requested count. +1 accounts for the title slide.
              const budgetedSlides = enforceSlideBudget(
                allSlides,
                sectionSlidesTarget
              );
              const droppedForBudget = allSlides.length - budgetedSlides.length;

              // Assemble the final PPTX from all section outputs. +2 accounts for
              // the cover and closing slides wrapped around the section slides.
              this.super.introspect(
                `${this.caller}: Assembling final deck — ${budgetedSlides.length + 2} slides` +
                  (droppedForBudget > 0
                    ? ` (trimmed ${droppedForBudget} to stay within ${targetSlides})`
                    : "")
              );

              const PptxGenJS = require("pptxgenjs");
              const pptx = new PptxGenJS();

              pptx.title = title;
              if (author) pptx.author = author;
              pptx.company = "AnythingLLM";

              const totalSlideCount = budgetedSlides.length;

              // Sub-agent output can carry XML 1.0 illegal control characters
              // (e.g. a form feed from a LaTeX `\frac`); strip them recursively
              // from every slide so PowerPoint can open the generated deck.
              const cleanSlides =
                createFilesLib.stripInvalidXmlChars(budgetedSlides);

              // Resolve any requested stock photography. No-op without a
              // PEXELS_API_KEY, and any fetch failure leaves the slide to render
              // with its vector layout - a deck never fails over a photo.
              if (pexels.isEnabled()) {
                this.super.introspect(
                  `${this.caller}: Fetching illustrative photos…`
                );
                await pexels.attachImages(
                  cleanSlides,
                  this.super.handlerProps.log
                );
              } else {
                for (const s of cleanSlides) delete s.imageQuery;
              }

              // Title slide
              const titleSlide = pptx.addSlide();
              renderTitleSlide(titleSlide, pptx, { title, author }, theme);

              // Footer numbering spans the section slides plus the closing slide
              // (the cover is unnumbered), so "n / total" stays honest.
              const numberedTotal = totalSlideCount + 1;

              // Render every slide produced by the section agents
              cleanSlides.forEach((slideData, index) => {
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
                      numberedTotal
                    );
                    break;
                  case "quote":
                    renderQuoteSlide(
                      slide,
                      pptx,
                      slideData,
                      theme,
                      slideNumber,
                      numberedTotal
                    );
                    break;
                  case "blank":
                    renderBlankSlide(
                      slide,
                      pptx,
                      theme,
                      slideNumber,
                      numberedTotal
                    );
                    break;
                  default:
                    renderContentSlide(
                      slide,
                      pptx,
                      slideData,
                      theme,
                      slideNumber,
                      numberedTotal
                    );
                    break;
                }
              });

              // Closing slide — the deck's sign-off, always the final slide.
              const closingSlide = pptx.addSlide();
              renderClosingSlide(
                closingSlide,
                pptx,
                { headline: "Cảm ơn!", subtitle: title },
                theme,
                numberedTotal,
                numberedTotal
              );

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
                workspace: this.super.handlerProps?.invocation?.workspace,
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

              // Include the cover and closing slides so the reported count
              // matches the file exactly.
              const finalSlideCount = totalSlideCount + 2;

              // Latch the one-deck-per-request guard now that a file exists, so
              // any further create-pptx-presentation call this run is refused.
              this.super.__pptxPresentationCreated = {
                filename: savedFile.displayFilename,
                slideCount: finalSlideCount,
              };

              return `Successfully created presentation "${title}" with ${finalSlideCount} slides across ${totalSections} sections using the ${theme.name} theme.`;
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
