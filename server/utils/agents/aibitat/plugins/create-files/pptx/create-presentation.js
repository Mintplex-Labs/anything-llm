const createFilesLib = require("../lib.js");
const { getTheme, getAvailableThemes } = require("./themes.js");
const {
  LAYOUT_RENDERERS,
  renderTopbarLayout,
  addBranding,
  addBulletContent,
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
            "Each slide can have a title, content (bullet points), and optional notes. ",
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
                  "The filename for the presentation (should end with .pptx). If a full path is provided, it will be saved there.",
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
                        "Slide layout type. 'title' for title slides, 'content' for content slides with bullets, 'section' for section dividers, 'blank' for empty slides.",
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
                        "Optional table data to display on the slide (use instead of content for tabular data).",
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
                          description:
                            "2D array of row data. Each row is an array of cell values.",
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

              if (!filename.toLowerCase().endsWith(".pptx")) {
                filename += ".pptx";
              }

              const theme = getTheme(themeName);
              this.super.introspect(
                `${this.caller}: Creating PowerPoint presentation "${title}" with ${theme.name} theme (layout: ${theme.layoutStyle})`
              );

              const PptxGenJS = require("pptxgenjs");
              const pptx = new PptxGenJS();

              pptx.title = title;
              if (author) pptx.author = author;
              pptx.company = "AnythingLLM";

              const titleSlide = pptx.addSlide();
              titleSlide.background = {
                color: theme.titleSlideBackground || theme.background,
              };

              titleSlide.addText(title, {
                x: 0.5,
                y: "32%",
                w: "90%",
                h: 1.5,
                fontSize: 44,
                bold: true,
                color: theme.titleSlideTitleColor || theme.titleColor,
                fontFace: theme.fontTitle,
                align: "center",
                shadow: theme.shadow || undefined,
              });

              if (author) {
                titleSlide.addText(author, {
                  x: 0.5,
                  y: "55%",
                  w: "90%",
                  h: 0.5,
                  fontSize: 18,
                  color: theme.titleSlideSubtitleColor || theme.subtitleColor,
                  fontFace: theme.fontBody,
                  align: "center",
                });
              }

              // Add branding to title slide (uses titleSlideBackground for color detection)
              addBranding(titleSlide, {
                ...theme,
                background: theme.titleSlideBackground || theme.background,
              });

              for (const slideData of slides) {
                const slide = pptx.addSlide();
                slide.background = { color: theme.background };
                const layout = slideData.layout || "content";

                if (layout === "title" || layout === "section") {
                  // Section / title slides — mirror the title slide treatment
                  slide.background = {
                    color: theme.titleSlideBackground || theme.background,
                  };

                  slide.addText(slideData.title || "", {
                    x: 0.5,
                    y: "35%",
                    w: "90%",
                    h: 1.5,
                    fontSize: layout === "title" ? 44 : 36,
                    bold: true,
                    color: theme.titleSlideTitleColor || theme.titleColor,
                    fontFace: theme.fontTitle,
                    align: "center",
                    shadow: theme.shadow || undefined,
                  });

                  if (slideData.subtitle) {
                    slide.addText(slideData.subtitle, {
                      x: 0.5,
                      y: layout === "title" ? "58%" : "54%",
                      w: "90%",
                      h: 0.6,
                      fontSize: 20,
                      color:
                        theme.titleSlideSubtitleColor || theme.subtitleColor,
                      fontFace: theme.fontBody,
                      align: "center",
                    });
                  }
                } else if (layout === "blank") {
                  // Blank slide — nothing beyond the background
                } else {
                  // Standard content slide
                  // Render the header using the theme's layout style
                  const renderHeader =
                    LAYOUT_RENDERERS[theme.layoutStyle] || renderTopbarLayout;
                  renderHeader(slide, pptx, slideData, theme);

                  // Body content - table or bullets
                  if (slideData.table) {
                    const tableData = [];
                    const contentX =
                      theme.layoutStyle === "sidebar"
                        ? (theme.margin?.x || 0.5) + 0.3
                        : theme.margin?.x || 0.5;

                    // Add header row
                    if (
                      slideData.table.headers &&
                      slideData.table.headers.length > 0
                    ) {
                      tableData.push(
                        slideData.table.headers.map((header) => ({
                          text: header,
                          options: {
                            bold: true,
                            fontSize: 14,
                            fontFace: theme.fontBody,
                            color: theme.background,
                            fill: { color: theme.accentColor },
                            align: "center",
                            valign: "middle",
                          },
                        }))
                      );
                    }

                    // Add data rows
                    if (
                      slideData.table.rows &&
                      slideData.table.rows.length > 0
                    ) {
                      slideData.table.rows.forEach((row, rowIndex) => {
                        const isAltRow = rowIndex % 2 === 1;
                        const rowFill = isAltRow
                          ? { color: theme.accentColor, transparency: 90 }
                          : { color: theme.background };
                        tableData.push(
                          row.map((cell) => ({
                            text: cell,
                            options: {
                              fontSize: 12,
                              fontFace: theme.fontBody,
                              color: theme.bodyColor,
                              fill: rowFill,
                              align: "center",
                              valign: "middle",
                            },
                          }))
                        );
                      });
                    }

                    if (tableData.length > 0) {
                      const colCount = tableData[0].length;
                      slide.addTable(tableData, {
                        x: contentX,
                        y: theme.contentY || 1.3,
                        w: 9,
                        colW: 9 / colCount,
                        rowH: 0.5,
                        border: {
                          type: "solid",
                          pt: 1,
                          color: theme.accentColor,
                        },
                      });
                    }
                  } else {
                    addBulletContent(
                      slide,
                      slideData.content,
                      theme,
                      theme.contentY
                    );
                  }
                }

                // Add subtle AnythingLLM branding to every slide
                // For section/title slides, use titleSlideBackground for color detection
                const slideBackground =
                  layout === "title" || layout === "section"
                    ? theme.titleSlideBackground || theme.background
                    : theme.background;
                addBranding(slide, { ...theme, background: slideBackground });

                if (slideData.notes) {
                  slide.addNotes(slideData.notes);
                }
              }

              const buffer = await pptx.write({ outputType: "nodebuffer" });
              const bufferSizeKB = (buffer.length / 1024).toFixed(2);
              const bufferSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);

              this.super.handlerProps.log(
                `create-pptx-presentation: Generated buffer - size: ${bufferSizeKB}KB (${bufferSizeMB}MB), slides: ${slides.length}, theme: ${theme.name}, layout: ${theme.layoutStyle}`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { filename, title, slideCount: slides.length },
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

              // Save file to storage with standardized naming (pptx-{uuid}.pptx)
              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "pptx",
                extension: "pptx",
                buffer,
                displayFilename,
              });

              // Send file download card to the frontend with file reference (not base64)
              this.super.socket.send("fileDownloadCard", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              // Register output for chat history persistence (stored as file reference, not base64)
              createFilesLib.registerOutput(this.super, "PptxFileDownload", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              this.super.introspect(
                `${this.caller}: Successfully created presentation "${title}"`
              );

              return `Successfully created presentation "${title}" with ${slides.length} slides using the ${theme.name} theme (${theme.layoutStyle} layout).`;
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
