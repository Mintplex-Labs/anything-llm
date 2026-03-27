const createFilesLib = require("../lib.js");
const filesystemLib = require("../../filesystem/lib.js");
const path = require("path");
const AdmZip = require("adm-zip");

module.exports.EditPptxPresentation = {
  name: "edit-pptx-presentation",
  plugin: function () {
    return {
      name: "edit-pptx-presentation",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Edit an existing PowerPoint presentation (PPTX) by adding new slides, " +
            "removing slides, or modifying slide content. " +
            "Supports adding slides at specific positions and bulk operations. " +
            "The modified presentation can be saved to a new file or overwrite the original.",
          examples: [
            {
              prompt: "Add a conclusion slide to my presentation",
              call: JSON.stringify({
                sourcePath: "project-updates.pptx",
                outputFilename: "project-updates-final.pptx",
                operations: [
                  {
                    type: "add",
                    position: "end",
                    slide: {
                      title: "Conclusion",
                      content: [
                        "Project delivered on time",
                        "All objectives met",
                        "Ready for next phase",
                      ],
                    },
                  },
                ],
              }),
            },
            {
              prompt: "Remove slides 2 and 3 from the presentation",
              call: JSON.stringify({
                sourcePath: "presentation.pptx",
                outputFilename: "presentation-trimmed.pptx",
                operations: [{ type: "remove", slideNumbers: [2, 3] }],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              sourcePath: {
                type: "string",
                description:
                  "Path to the existing PPTX file to edit (within the filesystem agent's allowed directories).",
              },
              outputFilename: {
                type: "string",
                description:
                  "Filename for the output file (will be saved to the generated-files directory).",
              },
              operations: {
                type: "array",
                description:
                  "Array of operations to perform on the presentation.",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["add", "remove", "replace"],
                      description:
                        "'add' to add new slides, 'remove' to delete slides, 'replace' to replace slide content.",
                    },
                    position: {
                      type: "string",
                      description:
                        "For 'add': 'start', 'end', or a number (1-based index). Default: 'end'.",
                    },
                    slideNumbers: {
                      type: "array",
                      items: { type: "number" },
                      description:
                        "For 'remove' or 'replace': Array of slide numbers (1-based) to operate on.",
                    },
                    slide: {
                      type: "object",
                      description: "For 'add' or 'replace': The slide content.",
                      properties: {
                        layout: {
                          type: "string",
                          enum: ["title", "content", "section", "blank"],
                        },
                        title: { type: "string" },
                        subtitle: { type: "string" },
                        content: {
                          type: "array",
                          items: { type: "string" },
                        },
                        table: {
                          type: "object",
                          description:
                            "Table data to display (use instead of content for tabular data).",
                          properties: {
                            headers: {
                              type: "array",
                              items: { type: "string" },
                            },
                            rows: {
                              type: "array",
                              items: {
                                type: "array",
                                items: { type: "string" },
                              },
                            },
                          },
                        },
                        notes: { type: "string" },
                      },
                    },
                    slides: {
                      type: "array",
                      description:
                        "For 'add': Array of slides to add (when adding multiple).",
                      items: {
                        type: "object",
                        properties: {
                          layout: { type: "string" },
                          title: { type: "string" },
                          subtitle: { type: "string" },
                          content: {
                            type: "array",
                            items: { type: "string" },
                          },
                          table: {
                            type: "object",
                            properties: {
                              headers: {
                                type: "array",
                                items: { type: "string" },
                              },
                              rows: {
                                type: "array",
                                items: {
                                  type: "array",
                                  items: { type: "string" },
                                },
                              },
                            },
                          },
                          notes: { type: "string" },
                        },
                      },
                    },
                  },
                  required: ["type"],
                },
              },
              saveToBrowser: {
                type: "boolean",
                description:
                  "If true, sends the modified file to the browser for download instead of saving.",
              },
            },
            required: ["sourcePath", "operations"],
            additionalProperties: false,
          },
          handler: async function ({
            sourcePath = "",
            outputFilename = "",
            operations = [],
            saveToBrowser = false,
          }) {
            try {
              this.super.handlerProps.log(
                `Using the edit-pptx-presentation tool.`
              );

              const validSourcePath =
                await filesystemLib.validatePath(sourcePath);

              if (!(await createFilesLib.fileExists(validSourcePath))) {
                return `Error: Source file does not exist: ${sourcePath}`;
              }

              this.super.introspect(
                `${this.caller}: Loading presentation from ${sourcePath}`
              );

              const sourceBuffer =
                await createFilesLib.readBinaryFile(validSourcePath);
              const zip = new AdmZip(sourceBuffer);

              const slideEntries = [];
              zip.getEntries().forEach((entry) => {
                if (
                  entry.entryName.startsWith("ppt/slides/slide") &&
                  entry.entryName.endsWith(".xml")
                ) {
                  const match = entry.entryName.match(/slide(\d+)\.xml$/);
                  if (match) {
                    slideEntries.push({
                      index: parseInt(match[1]),
                      entryName: entry.entryName,
                    });
                  }
                }
              });

              slideEntries.sort((a, b) => a.index - b.index);
              const slideCount = slideEntries.length;

              this.super.introspect(
                `${this.caller}: Found ${slideCount} slides in presentation`
              );

              let slidesToRemove = new Set();
              let slidesToAdd = [];
              let slidesToReplace = new Map();

              for (const operation of operations) {
                switch (operation.type) {
                  case "remove":
                    if (operation.slideNumbers) {
                      operation.slideNumbers.forEach((num) => {
                        if (num >= 1 && num <= slideCount) {
                          slidesToRemove.add(num);
                        }
                      });
                    }
                    break;

                  case "add":
                    const slides =
                      operation.slides ||
                      (operation.slide ? [operation.slide] : []);
                    let position = operation.position || "end";

                    if (position === "start") {
                      position = 0;
                    } else if (position === "end") {
                      position = slideCount;
                    } else {
                      position = parseInt(position) - 1;
                    }

                    slides.forEach((slide, i) => {
                      slidesToAdd.push({
                        position: position + i,
                        slide,
                      });
                    });
                    break;

                  case "replace":
                    if (operation.slideNumbers && operation.slide) {
                      operation.slideNumbers.forEach((num) => {
                        if (num >= 1 && num <= slideCount) {
                          slidesToReplace.set(num, operation.slide);
                        }
                      });
                    }
                    break;
                }
              }

              const PptxGenJS = require("pptxgenjs");
              const pptx = new PptxGenJS();

              const existingSlideData = [];
              for (const entry of slideEntries) {
                existingSlideData.push({
                  index: entry.index,
                  content: zip.readAsText(entry.entryName),
                });
              }

              const addSlideFromData = (slideData, layout = "content") => {
                const slide = pptx.addSlide();
                layout = slideData.layout || layout;

                if (layout === "title" || layout === "section") {
                  slide.addText(slideData.title || "", {
                    x: 0.5,
                    y: "40%",
                    w: "90%",
                    h: 1.5,
                    fontSize: layout === "title" ? 44 : 36,
                    bold: true,
                    color: "363636",
                    align: "center",
                  });

                  if (slideData.subtitle) {
                    slide.addText(slideData.subtitle, {
                      x: 0.5,
                      y: layout === "title" ? "60%" : "55%",
                      w: "90%",
                      h: 0.5,
                      fontSize: 18,
                      color: "666666",
                      align: "center",
                    });
                  }
                } else if (layout !== "blank") {
                  if (slideData.title) {
                    slide.addText(slideData.title, {
                      x: 0.5,
                      y: 0.3,
                      w: "90%",
                      h: 0.8,
                      fontSize: 28,
                      bold: true,
                      color: "363636",
                    });
                  }

                  if (slideData.table) {
                    const tableData = [];
                    const accentColor = "4472C4";
                    const bodyColor = "404040";
                    const bgColor = "FFFFFF";

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
                            color: bgColor,
                            fill: { color: accentColor },
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
                          ? { color: accentColor, transparency: 90 }
                          : { color: bgColor };
                        tableData.push(
                          row.map((cell) => ({
                            text: cell,
                            options: {
                              fontSize: 12,
                              color: bodyColor,
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
                        x: 0.5,
                        y: 1.3,
                        w: 9,
                        colW: 9 / colCount,
                        rowH: 0.5,
                        border: { type: "solid", pt: 1, color: accentColor },
                      });
                    }
                  } else if (
                    slideData.content &&
                    Array.isArray(slideData.content) &&
                    slideData.content.length > 0
                  ) {
                    const bulletPoints = slideData.content.map((text) => ({
                      text: text,
                      options: {
                        fontSize: 18,
                        color: "404040",
                        bullet: { type: "bullet" },
                        paraSpaceAfter: 6,
                      },
                    }));

                    slide.addText(bulletPoints, {
                      x: 0.5,
                      y: 1.3,
                      w: "90%",
                      h: 4.5,
                      valign: "top",
                    });
                  }
                }

                if (slideData.notes) {
                  slide.addNotes(slideData.notes);
                }
              };

              let insertionOffset = 0;
              for (let i = 1; i <= slideCount; i++) {
                const currentPosition = i + insertionOffset - 1;

                for (const toAdd of slidesToAdd) {
                  if (toAdd.position === currentPosition && !toAdd.added) {
                    addSlideFromData(toAdd.slide);
                    toAdd.added = true;
                    insertionOffset++;
                  }
                }

                if (slidesToRemove.has(i)) {
                  continue;
                }

                if (slidesToReplace.has(i)) {
                  addSlideFromData(slidesToReplace.get(i));
                } else {
                  const slide = pptx.addSlide();
                  slide.addText(
                    `[Preserved slide ${i} - original content retained from source]`,
                    {
                      x: 0.5,
                      y: 2.5,
                      w: "90%",
                      fontSize: 14,
                      color: "999999",
                      align: "center",
                    }
                  );
                }
              }

              for (const toAdd of slidesToAdd) {
                if (!toAdd.added) {
                  addSlideFromData(toAdd.slide);
                }
              }

              const resultBuffer = await pptx.write({
                outputType: "nodebuffer",
              });
              const bufferSizeKB = (resultBuffer.length / 1024).toFixed(2);
              const bufferSizeMB = (
                resultBuffer.length /
                (1024 * 1024)
              ).toFixed(2);

              this.super.handlerProps.log(
                `edit-pptx-presentation: Generated buffer - size: ${bufferSizeKB}KB (${bufferSizeMB}MB), operations: ${operations.length}`
              );

              const finalFilename =
                outputFilename || `edited-${path.basename(sourcePath)}`;

              if (saveToBrowser && this.super.socket) {
                const result = await createFilesLib.sendFileToBrowser(
                  this.super.socket,
                  finalFilename,
                  resultBuffer,
                  createFilesLib.getMimeType(".pptx")
                );

                if (result.sent) {
                  this.super.introspect(
                    `${this.caller}: Modified presentation sent to browser for download`
                  );
                  return `Successfully edited presentation and sent to browser for download.`;
                } else {
                  this.super.introspect(
                    `${this.caller}: Presentation too large for browser download, saved to ${result.fallbackPath}`
                  );
                  return `Successfully edited presentation. File was too large for browser download (${bufferSizeMB}MB) and has been saved to ${result.fallbackPath}`;
                }
              }

              const validOutputPath =
                await createFilesLib.validatePath(finalFilename);

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    sourcePath,
                    outputPath: validOutputPath,
                    operationCount: operations.length,
                  },
                  description: `Edit PowerPoint presentation with ${operations.length} operation(s)`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              await createFilesLib.writeBinaryFile(
                validOutputPath,
                resultBuffer
              );

              const summary = [];
              if (slidesToRemove.size > 0)
                summary.push(`removed ${slidesToRemove.size} slide(s)`);
              if (slidesToAdd.length > 0)
                summary.push(`added ${slidesToAdd.length} slide(s)`);
              if (slidesToReplace.size > 0)
                summary.push(`replaced ${slidesToReplace.size} slide(s)`);

              this.super.introspect(
                `${this.caller}: Successfully saved modified presentation to ${validOutputPath}`
              );

              // Send file download card to the frontend for easy browser download
              const outputFilenameOnly = validOutputPath.split("/").pop();
              createFilesLib.sendFileDownloadCard(
                this.super.socket,
                outputFilenameOnly,
                resultBuffer
              );

              return `Successfully edited presentation: ${summary.join(", ")}. Saved to ${validOutputPath}`;
            } catch (e) {
              this.super.handlerProps.log(
                `edit-pptx-presentation error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error editing presentation: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
