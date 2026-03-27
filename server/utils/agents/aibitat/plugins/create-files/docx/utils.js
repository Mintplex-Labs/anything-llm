/**
 * Utilities for converting markdown to DOCX format.
 * Uses marked for parsing, jsdom for HTML traversal, and docx for document generation.
 */

/**
 * Lazy-loads the required libraries for docx generation.
 * @returns {Promise<Object>} The loaded libraries
 */
async function loadLibraries() {
  const { marked } = await import("marked");
  const { JSDOM } = await import("jsdom");
  const docx = await import("docx");

  return {
    marked,
    JSDOM,
    docx,
  };
}

/**
 * Fetches an image from a URL or processes a base64 data string.
 * @param {string} src - Image source (URL or base64)
 * @param {Function} log - Logging function
 * @returns {Promise<{buffer: Buffer, type: string, width: number, height: number} | null>}
 */
async function fetchImage(src, log) {
  try {
    let imageBuffer;
    let imageType = "png";

    if (src.startsWith("data:")) {
      const match = src.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        imageType = match[1] === "jpeg" ? "jpg" : match[1];
        imageBuffer = Buffer.from(match[2], "base64");
        log(
          `create-docx-file: Processed base64 image, type: ${imageType}, size: ${imageBuffer.length} bytes`
        );
      } else {
        log(`create-docx-file: Invalid base64 image format, skipping`);
        return null;
      }
    } else if (src.startsWith("http://") || src.startsWith("https://")) {
      try {
        const response = await fetch(src, {
          headers: { "User-Agent": "AnythingLLM-DocxGenerator/1.0" },
        });

        if (!response.ok) {
          log(
            `create-docx-file: Failed to fetch image from ${src}: ${response.status}`
          );
          return null;
        }

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("jpeg") || contentType.includes("jpg")) {
          imageType = "jpg";
        } else if (contentType.includes("gif")) {
          imageType = "gif";
        } else if (contentType.includes("bmp")) {
          imageType = "bmp";
        } else {
          imageType = "png";
        }

        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
        log(
          `create-docx-file: Fetched remote image from ${src}, type: ${imageType}, size: ${imageBuffer.length} bytes`
        );
      } catch (fetchError) {
        log(
          `create-docx-file: Error fetching image from ${src}: ${fetchError.message}`
        );
        return null;
      }
    } else {
      log(`create-docx-file: Unsupported image source: ${src}`);
      return null;
    }

    const { imageSize: getImageSize } = await import("image-size");
    let width = 400;
    let height = 300;

    try {
      const dimensions = getImageSize(imageBuffer);
      if (dimensions.width && dimensions.height) {
        width = dimensions.width;
        height = dimensions.height;

        const maxWidth = 600;
        const maxHeight = 400;

        if (width > maxWidth) {
          const scale = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * scale);
        }

        if (height > maxHeight) {
          const scale = maxHeight / height;
          height = maxHeight;
          width = Math.round(width * scale);
        }
      }
    } catch (sizeError) {
      log(
        `create-docx-file: Could not determine image size: ${sizeError.message}, using defaults`
      );
    }

    return { buffer: imageBuffer, type: imageType, width, height };
  } catch (error) {
    log(`create-docx-file: Image processing error: ${error.message}`);
    return null;
  }
}

/**
 * Converts HTML to docx paragraph children (TextRun, etc.)
 * @param {Element} element - DOM element to process
 * @param {Object} docx - The docx library
 * @param {Object} styles - Current text styles
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of docx elements
 */
async function processInlineElements(element, docx, styles = {}, log) {
  const { TextRun, ExternalHyperlink, ImageRun } = docx;
  const children = [];

  for (const node of element.childNodes) {
    if (node.nodeType === 3) {
      const text = node.textContent;
      if (text && text.trim()) {
        children.push(
          new TextRun({
            text,
            bold: styles.bold || false,
            italics: styles.italics || false,
            strike: styles.strike || false,
            font: styles.font || "Calibri",
            size: styles.size || 24,
            color: styles.color,
          })
        );
      } else if (text && text.includes(" ")) {
        children.push(new TextRun({ text: " " }));
      }
    } else if (node.nodeType === 1) {
      const tagName = node.tagName.toLowerCase();

      switch (tagName) {
        case "strong":
        case "b":
          children.push(
            ...(await processInlineElements(
              node,
              docx,
              { ...styles, bold: true },
              log
            ))
          );
          break;
        case "em":
        case "i":
          children.push(
            ...(await processInlineElements(
              node,
              docx,
              { ...styles, italics: true },
              log
            ))
          );
          break;
        case "del":
        case "s":
          children.push(
            ...(await processInlineElements(
              node,
              docx,
              { ...styles, strike: true },
              log
            ))
          );
          break;
        case "code":
          children.push(
            new TextRun({
              text: node.textContent,
              font: "Consolas",
              size: 20,
              shading: { fill: "E8E8E8" },
            })
          );
          break;
        case "a": {
          const href = node.getAttribute("href");
          if (href) {
            children.push(
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: node.textContent,
                    style: "Hyperlink",
                    color: "0563C1",
                    underline: { type: "single" },
                  }),
                ],
                link: href,
              })
            );
          } else {
            children.push(new TextRun({ text: node.textContent }));
          }
          break;
        }
        case "img": {
          const src = node.getAttribute("src");
          if (src) {
            const imageData = await fetchImage(src, log);
            if (imageData) {
              children.push(
                new ImageRun({
                  data: imageData.buffer,
                  transformation: {
                    width: imageData.width,
                    height: imageData.height,
                  },
                  type: imageData.type,
                })
              );
            }
          }
          break;
        }
        case "br":
          children.push(new TextRun({ break: 1 }));
          break;
        default:
          children.push(
            ...(await processInlineElements(node, docx, styles, log))
          );
      }
    }
  }

  return children;
}

/**
 * Converts an HTML table to docx Table.
 * @param {Element} tableElement - The table DOM element
 * @param {Object} docx - The docx library
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} A docx Table
 */
async function processTable(tableElement, docx, log) {
  const {
    Table,
    TableRow,
    TableCell,
    Paragraph,
    WidthType,
    BorderStyle,
    AlignmentType,
    TextRun,
    TableLayoutType,
  } = docx;

  const rows = [];
  const tableRows = tableElement.querySelectorAll("tr");

  const firstRow = tableRows[0];
  const columnCount = firstRow ? firstRow.querySelectorAll("th, td").length : 1;
  const columnWidthPercent = Math.floor(100 / columnCount);

  let dataRowIndex = 0;
  for (const tr of tableRows) {
    const cells = [];
    const cellElements = tr.querySelectorAll("th, td");
    const isHeader = tr.querySelector("th") !== null;

    let shadingFill;
    if (isHeader) {
      shadingFill = "E7E6E6";
    } else if (dataRowIndex % 2 === 1) {
      shadingFill = "F5F5F5";
    }

    for (const cell of cellElements) {
      const cellChildren = await processInlineElements(cell, docx, {}, log);
      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children:
                cellChildren.length > 0
                  ? cellChildren
                  : [new TextRun({ text: "" })],
              alignment: AlignmentType.LEFT,
            }),
          ],
          width: { size: columnWidthPercent, type: WidthType.PERCENTAGE },
          shading: shadingFill ? { fill: shadingFill } : undefined,
        })
      );
    }

    if (cells.length > 0) {
      rows.push(new TableRow({ children: cells }));
    }

    if (!isHeader) {
      dataRowIndex++;
    }
  }

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
  });
}

/**
 * Processes a list element (ul/ol) into docx paragraphs.
 * @param {Element} listElement - The list DOM element
 * @param {Object} docx - The docx library
 * @param {boolean} isOrdered - Whether the list is ordered
 * @param {number} level - Nesting level
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of docx Paragraphs
 */
async function processList(listElement, docx, isOrdered, level = 0, log) {
  const { Paragraph } = docx;
  const paragraphs = [];
  const items = listElement.querySelectorAll(":scope > li");

  for (const li of items) {
    const inlineChildren = [];
    const nestedLists = [];

    for (const child of li.childNodes) {
      if (child.nodeType === 1) {
        const tagName = child.tagName.toLowerCase();
        if (tagName === "ul" || tagName === "ol") {
          nestedLists.push({ element: child, ordered: tagName === "ol" });
        } else {
          const wrapper = li.ownerDocument.createElement("span");
          wrapper.appendChild(child.cloneNode(true));
          inlineChildren.push(
            ...(await processInlineElements(wrapper, docx, {}, log))
          );
        }
      } else if (child.nodeType === 3 && child.textContent.trim()) {
        const wrapper = li.ownerDocument.createElement("span");
        wrapper.textContent = child.textContent;
        inlineChildren.push(
          ...(await processInlineElements(wrapper, docx, {}, log))
        );
      }
    }

    if (inlineChildren.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: inlineChildren,
          bullet: isOrdered ? undefined : { level },
          numbering: isOrdered
            ? { reference: "default-numbering", level }
            : undefined,
        })
      );
    }

    for (const nested of nestedLists) {
      paragraphs.push(
        ...(await processList(
          nested.element,
          docx,
          nested.ordered,
          level + 1,
          log
        ))
      );
    }
  }

  return paragraphs;
}

/**
 * Converts HTML content to an array of docx elements.
 * @param {string} html - The HTML content
 * @param {Object} libs - The loaded libraries
 * @param {Function} log - Logging function
 * @returns {Promise<Array>} Array of docx elements for sections
 */
async function htmlToDocxElements(html, libs, log) {
  const { JSDOM, docx } = libs;
  const { Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } = docx;

  const dom = new JSDOM(html);
  const body = dom.window.document.body;
  const elements = [];

  const headingSizes = {
    h1: { level: HeadingLevel.HEADING_1, size: 48 },
    h2: { level: HeadingLevel.HEADING_2, size: 40 },
    h3: { level: HeadingLevel.HEADING_3, size: 32 },
    h4: { level: HeadingLevel.HEADING_4, size: 28 },
    h5: { level: HeadingLevel.HEADING_5, size: 24 },
    h6: { level: HeadingLevel.HEADING_6, size: 22 },
  };

  for (const child of body.children) {
    const tagName = child.tagName.toLowerCase();

    try {
      if (headingSizes[tagName]) {
        const { level, size } = headingSizes[tagName];
        const inlineChildren = await processInlineElements(
          child,
          docx,
          { size, bold: true },
          log
        );
        elements.push(
          new Paragraph({
            children:
              inlineChildren.length > 0
                ? inlineChildren
                : [new TextRun({ text: child.textContent, bold: true, size })],
            heading: level,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (tagName === "p") {
        const inlineChildren = await processInlineElements(
          child,
          docx,
          {},
          log
        );
        if (inlineChildren.length > 0) {
          elements.push(
            new Paragraph({
              children: inlineChildren,
              spacing: { after: 200 },
            })
          );
        }
      } else if (tagName === "ul") {
        elements.push(...(await processList(child, docx, false, 0, log)));
      } else if (tagName === "ol") {
        elements.push(...(await processList(child, docx, true, 0, log)));
      } else if (tagName === "table") {
        elements.push(await processTable(child, docx, log));
        elements.push(new Paragraph({ children: [] }));
      } else if (tagName === "blockquote") {
        const inlineChildren = await processInlineElements(
          child,
          docx,
          { italics: true, color: "666666" },
          log
        );
        elements.push(
          new Paragraph({
            children: inlineChildren,
            indent: { left: 720 },
            border: {
              left: { style: "single", size: 24, color: "CCCCCC" },
            },
            spacing: { before: 200, after: 200 },
          })
        );
      } else if (tagName === "pre") {
        const codeElement = child.querySelector("code");
        const codeText = codeElement
          ? codeElement.textContent
          : child.textContent;
        const lines = codeText.split("\n");

        for (const line of lines) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line || " ",
                  font: "Consolas",
                  size: 20,
                }),
              ],
              shading: { fill: "F5F5F5" },
              spacing: { before: 0, after: 0 },
            })
          );
        }
        elements.push(new Paragraph({ children: [], spacing: { after: 200 } }));
      } else if (tagName === "hr") {
        elements.push(
          new Paragraph({
            children: [],
            border: { bottom: { style: "single", size: 6, color: "CCCCCC" } },
            spacing: { before: 200, after: 200 },
          })
        );
      } else if (tagName === "img") {
        const src = child.getAttribute("src");
        if (src) {
          const imageData = await fetchImage(src, log);
          if (imageData) {
            elements.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageData.buffer,
                    transformation: {
                      width: imageData.width,
                      height: imageData.height,
                    },
                    type: imageData.type,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              })
            );
          }
        }
      } else {
        const inlineChildren = await processInlineElements(
          child,
          docx,
          {},
          log
        );
        if (inlineChildren.length > 0) {
          elements.push(new Paragraph({ children: inlineChildren }));
        }
      }
    } catch (err) {
      log(
        `create-docx-file: Error processing element ${tagName}: ${err.message}`
      );
    }
  }

  return elements;
}

/**
 * Creates the branded footer with AnythingLLM logo.
 * @param {Object} docx - The docx library
 * @param {Buffer|null} logoBuffer - The logo buffer or null if not available
 * @returns {Object} Footer configuration
 */
function createBrandedFooter(docx, logoBuffer) {
  const {
    Footer,
    Paragraph,
    TextRun,
    ImageRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
  } = docx;

  const footerChildren = [];

  if (logoBuffer) {
    footerChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: "none" },
          bottom: { style: "none" },
          left: { style: "none" },
          right: { style: "none" },
          insideHorizontal: { style: "none" },
          insideVertical: { style: "none" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 80, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: "none" },
                  bottom: { style: "none" },
                  left: { style: "none" },
                  right: { style: "none" },
                },
                children: [],
              }),
              new TableCell({
                width: { size: 20, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: "none" },
                  bottom: { style: "none" },
                  left: { style: "none" },
                  right: { style: "none" },
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new ImageRun({
                        data: logoBuffer,
                        transformation: {
                          width: 80,
                          height: 13,
                        },
                        type: "png",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  } else {
    footerChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: "Generated by AnythingLLM",
            size: 16,
            color: "999999",
            font: "Arial",
          }),
        ],
      })
    );
  }

  return new Footer({
    children: footerChildren,
  });
}

/**
 * Default numbering configuration for ordered lists.
 */
const DEFAULT_NUMBERING_CONFIG = {
  config: [
    {
      reference: "default-numbering",
      levels: [
        {
          level: 0,
          format: "decimal",
          text: "%1.",
          alignment: "start",
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        },
        {
          level: 1,
          format: "lowerLetter",
          text: "%2.",
          alignment: "start",
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
        },
        {
          level: 2,
          format: "lowerRoman",
          text: "%3.",
          alignment: "start",
          style: { paragraph: { indent: { left: 2160, hanging: 360 } } },
        },
      ],
    },
  ],
};

module.exports = {
  loadLibraries,
  fetchImage,
  processInlineElements,
  processTable,
  processList,
  htmlToDocxElements,
  createBrandedFooter,
  DEFAULT_NUMBERING_CONFIG,
};
