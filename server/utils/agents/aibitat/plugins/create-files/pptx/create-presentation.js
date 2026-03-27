const createFilesLib = require("../lib.js");
const { getTheme, getAvailableThemes } = require("./themes.js");
const {
  renderTitleSlide,
  renderSectionSlide,
  renderContentSlide,
  renderBlankSlide,
} = require("./utils.js");

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
            "Create a new PowerPoint presentation (PPTX) with slides and optional theming. " +
            "Provide a title and an array of slides with their content. " +
            "Each slide can have a title, content (bullet points), and optional notes.",
          examples: [
            {
              prompt: "Create a presentation about project updates",
              call: JSON.stringify({
                filename: "project-updates.pptx",
                title: "Q1 Project Updates",
                theme: "corporate",
                slides: [
                  {
                    title: "Overview",
                    content: [
                      "Project on track for Q1 delivery",
                      "Team expanded by 2 new members",
                      "Budget within expectations",
                    ],
                  },
                  {
                    title: "Key Achievements",
                    content: [
                      "Launched new feature X",
                      "Reduced bug count by 40%",
                      "Improved performance by 25%",
                    ],
                    notes: "Mention the specific metrics during presentation",
                  },
                ],
              }),
            },
            {
              prompt: "Create a dark themed presentation about AI",
              call: JSON.stringify({
                filename: "ai-overview.pptx",
                title: "Introduction to AI",
                theme: "dark",
                slides: [
                  {
                    title: "What is AI?",
                    content: [
                      "Artificial Intelligence defined",
                      "Machine Learning vs Deep Learning",
                    ],
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
              slides: {
                type: "array",
                description:
                  "Array of slide objects to include in the presentation.",
                items: {
                  type: "object",
                  properties: {
                    layout: {
                      type: "string",
                      enum: ["title", "content", "section", "blank"],
                      description:
                        "Slide layout type. 'title' for title slides, 'content' for bullet content, 'section' for section dividers, 'blank' for empty slides.",
                    },
                    title: {
                      type: "string",
                      description: "The slide title.",
                    },
                    subtitle: {
                      type: "string",
                      description:
                        "Optional subtitle (mainly for title and section layouts).",
                    },
                    content: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Array of bullet points or text content for the slide.",
                    },
                    table: {
                      type: "object",
                      description:
                        "Optional table data to display on the slide.",
                      properties: {
                        headers: {
                          type: "array",
                          items: { type: "string" },
                          description: "Array of column header labels.",
                        },
                        rows: {
                          type: "array",
                          items: {
                            type: "array",
                            items: { type: "string" },
                          },
                          description: "2D array of row data.",
                        },
                      },
                    },
                    notes: {
                      type: "string",
                      description: "Optional speaker notes for this slide.",
                    },
                  },
                  required: ["title"],
                },
              },
            },
            required: ["filename", "title", "slides"],
            additionalProperties: false,
          },

          handler: async function ({
            filename = "presentation.pptx",
            title = "Untitled Presentation",
            author = "",
            theme: themeName = "default",
            slides = [],
          }) {
            try {
              this.super.handlerProps.log(
                `Using the create-pptx-presentation tool.`
              );

              if (!filename.toLowerCase().endsWith(".pptx"))
                filename += ".pptx";

              const theme = getTheme(themeName);
              this.super.introspect(
                `${this.caller}: Creating PowerPoint presentation "${title}" with ${theme.name} theme`
              );

              const PptxGenJS = require("pptxgenjs");
              const pptx = new PptxGenJS();

              pptx.title = title;
              if (author) pptx.author = author;
              pptx.company = "AnythingLLM";

              const totalSlides = slides.length;
              const titleSlide = pptx.addSlide();
              renderTitleSlide(titleSlide, pptx, { title, author }, theme);

              slides.forEach((slideData, index) => {
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
                    renderBlankSlide(
                      slide,
                      pptx,
                      theme,
                      slideNumber,
                      totalSlides
                    );
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

              const buffer = await pptx.write({ outputType: "nodebuffer" });
              const bufferSizeKB = (buffer.length / 1024).toFixed(2);
              const bufferSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
              this.super.handlerProps.log(
                `create-pptx-presentation: Generated buffer - size: ${bufferSizeKB}KB (${bufferSizeMB}MB), slides: ${slides.length}, theme: ${theme.name}`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    filename,
                    title,
                    slideCount: slides.length,
                  },
                  description: `Create PowerPoint presentation with ${slides.length} slides`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

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

              return `Successfully created presentation "${title}" with ${slides.length} slides using the ${theme.name} theme.`;
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
