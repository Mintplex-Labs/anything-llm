/**
 * Utilities for converting markdown to DOCX format.
 * Uses marked for parsing, jsdom for HTML traversal, and docx for document generation.
 */

/**
 * Document style presets for professional-looking documents.
 */
const DOCUMENT_STYLES = {
  margins: {
    normal: { top: 1440, bottom: 1440, left: 1800, right: 1800 },
    narrow: { top: 720, bottom: 720, left: 720, right: 720 },
    wide: { top: 1440, bottom: 1440, left: 2880, right: 2880 },
  },
  themes: {
    neutral: {
      heading: "2E4057",
      accent: "048A81",
      tableHeader: "E7E6E6",
      border: "CCCCCC",
      coverBg: "2E4057",
      coverText: "FFFFFF",
      footerText: "666666",
    },
    blue: {
      heading: "1B3A6B",
      accent: "2E86AB",
      tableHeader: "D6E8F5",
      border: "A8C8E8",
      coverBg: "1B3A6B",
      coverText: "FFFFFF",
      footerText: "2E86AB",
    },
    warm: {
      heading: "5C3317",
      accent: "C1440E",
      tableHeader: "F5ECD7",
      border: "D4B896",
      coverBg: "5C3317",
      coverText: "FFFFFF",
      footerText: "8B6914",
    },
  },
  fonts: {
    body: "Calibri",
    heading: "Calibri",
    mono: "Consolas",
  },
  borders: {
    none: {
      top: { style: "none" },
      bottom: { style: "none" },
      left: { style: "none" },
      right: { style: "none" },
    },
  },
};

/**
 * Gets the theme colors, falling back to neutral if not found.
 * @param {string} themeName - The theme name
 * @returns {Object} Theme color configuration
 */
function getTheme(themeName) {
  return DOCUMENT_STYLES.themes[themeName] || DOCUMENT_STYLES.themes.neutral;
}

/**
 * Gets the margin configuration, falling back to normal if not found.
 * @param {string} marginName - The margin preset name
 * @returns {Object} Margin configuration
 */
function getMargins(marginName) {
  return DOCUMENT_STYLES.margins[marginName] || DOCUMENT_STYLES.margins.normal;
}

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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const IMAGE_FETCH_TIMEOUT_MS = 2000;

/**
 * Image magic bytes and their corresponding types.
 * This is hardcoded and there might be a better way to do this but this is for simple image validation.
 * @type {Object}
 */
const IMAGE_MAGIC_BYTES = {
  png: { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], type: "png" },
  jpg: { bytes: [0xff, 0xd8, 0xff], type: "jpg" },
  gif87a: { bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], type: "gif" },
  gif89a: { bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], type: "gif" },
  bmp: { bytes: [0x42, 0x4d], type: "bmp" },
  webp: {
    bytes: [0x52, 0x49, 0x46, 0x46],
    type: "webp",
    offset4: [0x57, 0x45, 0x42, 0x50],
  },
};

/**
 * Validates image buffer by checking magic bytes to determine actual image type.
 * @param {Buffer} buffer - The image buffer to validate
 * @returns {{valid: boolean, type: string|null}} Validation result with detected type
 */
function validateImageMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) {
    return { valid: false, type: null };
  }

  for (const [, signature] of Object.entries(IMAGE_MAGIC_BYTES)) {
    const matches = signature.bytes.every((byte, i) => buffer[i] === byte);
    if (matches) {
      if (signature.offset4) {
        const offset4Matches = signature.offset4.every(
          (byte, i) => buffer[8 + i] === byte
        );
        if (!offset4Matches) continue;
      }
      return { valid: true, type: signature.type };
    }
  }

  return { valid: false, type: null };
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
        imageBuffer = Buffer.from(match[2], "base64");

        if (imageBuffer.length > MAX_IMAGE_SIZE) {
          log(
            `create-docx-file: Base64 image too large (${(imageBuffer.length / 1024 / 1024).toFixed(2)}MB), max ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
          );
          return null;
        }

        const validation = validateImageMagicBytes(imageBuffer);
        if (!validation.valid) {
          log(
            `create-docx-file: Base64 data is not a valid image (magic bytes check failed)`
          );
          return null;
        }
        imageType = validation.type;

        log(
          `create-docx-file: Processed base64 image, type: ${imageType}, size: ${imageBuffer.length} bytes`
        );
      } else {
        log(`create-docx-file: Invalid base64 image format, skipping`);
        return null;
      }
    } else if (src.startsWith("http://") || src.startsWith("https://")) {
      let parsedUrl;
      try {
        parsedUrl = new URL(src);
      } catch {
        log(`create-docx-file: Invalid URL: ${src}`);
        return null;
      }

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        log(`create-docx-file: Invalid URL protocol: ${parsedUrl.protocol}`);
        return null;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        IMAGE_FETCH_TIMEOUT_MS
      );

      try {
        const response = await fetch(src, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          log(
            `create-docx-file: Failed to fetch image from ${src}: ${response.status}`
          );
          return null;
        }

        const contentLength = response.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > MAX_IMAGE_SIZE) {
          log(
            `create-docx-file: Image too large (${(parseInt(contentLength, 10) / 1024 / 1024).toFixed(2)}MB), max ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
          );
          return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);

        if (imageBuffer.length > MAX_IMAGE_SIZE) {
          log(
            `create-docx-file: Downloaded image too large (${(imageBuffer.length / 1024 / 1024).toFixed(2)}MB), max ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
          );
          return null;
        }

        const validation = validateImageMagicBytes(imageBuffer);
        if (!validation.valid) {
          log(
            `create-docx-file: Fetched content is not a valid image (magic bytes check failed)`
          );
          return null;
        }
        imageType = validation.type;

        log(
          `create-docx-file: Fetched remote image from ${src}, type: ${imageType}, size: ${imageBuffer.length} bytes`
        );
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          log(
            `create-docx-file: Image fetch timed out after ${IMAGE_FETCH_TIMEOUT_MS}ms: ${src}`
          );
        } else {
          log(
            `create-docx-file: Error fetching image from ${src}: ${fetchError.message}`
          );
        }
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
          const isValidHref = href && /^https?:\/\//i.test(href);
          if (isValidHref) {
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
 * @param {Object} theme - Theme color configuration
 * @returns {Promise<Object>} A docx Table
 */
async function processTable(tableElement, docx, log, theme = null) {
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

  const colors = theme || DOCUMENT_STYLES.themes.neutral;
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
      shadingFill = colors.tableHeader;
    } else if (dataRowIndex % 2 === 1) {
      shadingFill = "F9F9F9";
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
      top: { style: BorderStyle.SINGLE, size: 1, color: colors.border },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: colors.border },
      left: { style: BorderStyle.SINGLE, size: 1, color: colors.border },
      right: { style: BorderStyle.SINGLE, size: 1, color: colors.border },
      insideHorizontal: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: colors.border,
      },
      insideVertical: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: colors.border,
      },
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
 * @param {Object} theme - Theme color configuration
 * @returns {Promise<Array>} Array of docx elements for sections
 */
async function htmlToDocxElements(html, libs, log, theme = null) {
  const { JSDOM, docx } = libs;
  const { Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } = docx;

  const colors = theme || DOCUMENT_STYLES.themes.neutral;
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
          { size, bold: true, color: colors.heading },
          log
        );
        elements.push(
          new Paragraph({
            children:
              inlineChildren.length > 0
                ? inlineChildren
                : [
                    new TextRun({
                      text: child.textContent,
                      bold: true,
                      size,
                      color: colors.heading,
                    }),
                  ],
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
        elements.push(await processTable(child, docx, log, colors));
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
              left: { style: "single", size: 24, color: colors.accent },
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
                  font: DOCUMENT_STYLES.fonts.mono,
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
            border: {
              bottom: { style: "single", size: 6, color: colors.border },
            },
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
 * Creates a cover/title page section with colored background and centered title block.
 * @param {Object} docx - The docx library
 * @param {Object} options - Cover page options
 * @param {string} options.title - Document title
 * @param {string} options.subtitle - Optional subtitle
 * @param {string} options.author - Optional author name
 * @param {string} options.date - Optional date string
 * @param {Object} options.theme - Theme color configuration
 * @param {Object} options.margins - Margin configuration
 * @param {Buffer|null} options.logoBuffer - Logo buffer for footer
 * @returns {Object} Section configuration for cover page
 */
function createCoverPageSection(docx, options) {
  const { Paragraph, TextRun, AlignmentType, Footer, ImageRun, SectionType } =
    docx;

  const { title, subtitle, author, date, theme, margins, logoBuffer } = options;

  const coverChildren = [];

  coverChildren.push(
    new Paragraph({
      children: [],
      spacing: { before: 2400 },
    })
  );

  coverChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 72,
          color: theme.heading,
          font: DOCUMENT_STYLES.fonts.heading,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  if (subtitle) {
    coverChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: subtitle,
            size: 32,
            color: theme.accent,
            font: DOCUMENT_STYLES.fonts.body,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
      })
    );
  }

  coverChildren.push(
    new Paragraph({
      children: [],
      spacing: { before: 4800 },
    })
  );

  if (author) {
    coverChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: author,
            size: 24,
            color: "666666",
            font: DOCUMENT_STYLES.fonts.body,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  if (date) {
    coverChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: date,
            size: 22,
            color: "888888",
            font: DOCUMENT_STYLES.fonts.body,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  const coverFooterChildren = [];
  if (logoBuffer) {
    coverFooterChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: 100, height: 16 },
            type: "png",
          }),
        ],
      })
    );
  }

  return {
    properties: {
      page: {
        margin: margins,
      },
      type: SectionType.NEXT_PAGE,
    },
    children: coverChildren,
    footers: {
      default: new Footer({ children: coverFooterChildren }),
    },
  };
}

/**
 * Creates a running header for content pages (pages 2+).
 * @param {Object} docx - The docx library
 * @param {string} documentTitle - The document title to display
 * @param {Object} theme - Theme color configuration
 * @returns {Object} Header configuration
 */
function createRunningHeader(docx, documentTitle, theme) {
  const {
    Header,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
  } = docx;

  const noBorders = DOCUMENT_STYLES.borders.none;

  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          ...noBorders,
          insideHorizontal: { style: "none" },
          insideVertical: { style: "none" },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: theme.border },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: noBorders,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: documentTitle,
                        size: 18,
                        color: theme.footerText,
                        font: DOCUMENT_STYLES.fonts.body,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: noBorders,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({ children: [], spacing: { after: 200 } }),
    ],
  });
}

/**
 * Creates a running footer with Page X of Y and branding.
 * @param {Object} docx - The docx library
 * @param {Buffer|null} logoBuffer - Logo buffer or null
 * @param {Object} theme - Theme color configuration
 * @returns {Object} Footer configuration
 */
function createRunningFooter(docx, logoBuffer, theme) {
  const {
    Footer,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    ImageRun,
    PageNumber,
  } = docx;

  const noBorders = DOCUMENT_STYLES.borders.none;

  const pageNumberParagraph = new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES],
        size: 18,
        color: theme.footerText,
        font: DOCUMENT_STYLES.fonts.body,
      }),
    ],
  });

  const brandingCell = logoBuffer
    ? new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: 80, height: 13 },
            type: "png",
          }),
        ],
      })
    : new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: "Generated by AnythingLLM",
            size: 16,
            color: theme.footerText,
            font: DOCUMENT_STYLES.fonts.body,
          }),
        ],
      });

  return new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          ...noBorders,
          insideHorizontal: { style: "none" },
          insideVertical: { style: "none" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: noBorders,
                children: [pageNumberParagraph],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: noBorders,
                children: [brandingCell],
              }),
            ],
          }),
        ],
      }),
    ],
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
  DOCUMENT_STYLES,
  getTheme,
  getMargins,
  loadLibraries,
  htmlToDocxElements,
  createCoverPageSection,
  createRunningHeader,
  createRunningFooter,
  DEFAULT_NUMBERING_CONFIG,
};
