/**
 * Utilities for generating Vietnamese Administrative Documents (Văn bản hành chính)
 * following Decree 30/2020/NĐ-CP (Nghị định 30/2020/NĐ-CP về công tác văn thư).
 *
 * Reference: Phụ lục I - Thể thức và kỹ thuật trình bày văn bản hành chính
 */

const { loadLibraries, htmlToDocxElements, fetchImage, DEFAULT_NUMBERING_CONFIG } = require("./utils.js");

// ---------------------------------------------------------------------------
// 1. Constants & Styles
// ---------------------------------------------------------------------------

/**
 * Vietnamese administrative document styles per Decree 30/2020/NĐ-CP Appendix I.
 * All measurements in twips (1 inch = 1440 twips, 1mm ≈ 56.7 twips).
 * Font sizes are in half-points (size 26 = 13pt).
 */
const VN_ADMIN_STYLES = {
  font: "Times New Roman",
  // A4 margins: top/bottom 20-25mm, left 30-35mm, right 15-20mm
  margins: {
    top: 1134,    // ~20mm
    bottom: 1134, // ~20mm
    left: 1701,   // ~30mm
    right: 1134,  // ~20mm
  },
  sizes: {
    quocHieu: 26,        // 13pt – Quốc hiệu (in hoa, đậm)
    tieuNgu: 28,         // 14pt – Tiêu ngữ (đậm)
    coQuan: 26,          // 13pt – Tên cơ quan
    soKyHieu: 26,        // 13pt – Số, ký hiệu
    diaDanh: 28,         // 14pt – Địa danh, ngày tháng (nghiêng)
    tenLoaiVB: 28,       // 14pt – Tên loại văn bản (in hoa, đậm)
    trichYeu: 28,        // 14pt – Trích yếu văn bản có tên loại (đậm)
    trichYeuCongVan: 24, // 12pt – Trích yếu công văn (V/v)
    body: 28,            // 14pt – Nội dung
    canCu: 26,           // 13pt – Căn cứ pháp lý (nghiêng)
    chucVuKy: 28,        // 14pt – Chức vụ người ký (in hoa, đậm)
    hoTen: 28,           // 14pt – Họ tên người ký (đậm)
    noiNhanLabel: 24,    // 12pt – "Nơi nhận:" label (nghiêng, đậm)
    noiNhanItem: 22,     // 11pt – Nơi nhận items
    pageNumber: 28,      // 14pt – Số trang
  },
  spacing: {
    sectionGap: 120,     // 6pt between major sections
    lineSpacing: 264,    // ~1.15 lines (twips) – within single-spaced range
    paragraphAfter: 120, // 6pt after paragraph
  },
};

/**
 * Vietnamese administrative document types per Decree 30/2020/NĐ-CP.
 * Maps document type key → { name, abbreviation, templateType }
 *   templateType: "named" (có tên loại) or "cong-van" (công văn, không tên loại)
 */
const VN_DOCUMENT_TYPES = {
  "nghi-quyet":        { name: "NGHỊ QUYẾT",        abbr: "NQ",   template: "named" },
  "quyet-dinh":        { name: "QUYẾT ĐỊNH",        abbr: "QĐ",   template: "named" },
  "chi-thi":           { name: "CHỈ THỊ",            abbr: "CT",   template: "named" },
  "quy-che":           { name: "QUY CHẾ",            abbr: "QC",   template: "named" },
  "quy-dinh":          { name: "QUY ĐỊNH",           abbr: "QĐi",  template: "named" },
  "thong-cao":         { name: "THÔNG CÁO",          abbr: "TC",   template: "named" },
  "thong-bao":         { name: "THÔNG BÁO",          abbr: "TB",   template: "named" },
  "huong-dan":         { name: "HƯỚNG DẪN",          abbr: "HD",   template: "named" },
  "chuong-trinh":      { name: "CHƯƠNG TRÌNH",       abbr: "CTr",  template: "named" },
  "ke-hoach":          { name: "KẾ HOẠCH",           abbr: "KH",   template: "named" },
  "phuong-an":         { name: "PHƯƠNG ÁN",          abbr: "PA",   template: "named" },
  "de-an":             { name: "ĐỀ ÁN",              abbr: "ĐA",   template: "named" },
  "du-an":             { name: "DỰ ÁN",              abbr: "DA",   template: "named" },
  "bao-cao":           { name: "BÁO CÁO",            abbr: "BC",   template: "named" },
  "bien-ban":          { name: "BIÊN BẢN",            abbr: "BB",   template: "named" },
  "to-trinh":          { name: "TỜ TRÌNH",            abbr: "TTr",  template: "named" },
  "hop-dong":          { name: "HỢP ĐỒNG",           abbr: "HĐ",   template: "named" },
  "cong-van":          { name: "CÔNG VĂN",            abbr: "",     template: "cong-van" },
  "cong-dien":         { name: "CÔNG ĐIỆN",           abbr: "CĐ",   template: "named" },
  "ban-ghi-nho":       { name: "BẢN GHI NHỚ",        abbr: "BGN",  template: "named" },
  "ban-thoa-thuan":    { name: "BẢN THỎA THUẬN",     abbr: "BTT",  template: "named" },
  "giay-uy-quyen":     { name: "GIẤY ỦY QUYỀN",      abbr: "GUQ",  template: "named" },
  "giay-moi":          { name: "GIẤY MỜI",            abbr: "GM",   template: "named" },
  "giay-gioi-thieu":   { name: "GIẤY GIỚI THIỆU",    abbr: "GGT",  template: "named" },
  "giay-nghi-phep":    { name: "GIẤY NGHỈ PHÉP",     abbr: "GNP",  template: "named" },
  "phieu-gui":         { name: "PHIẾU GỬI",           abbr: "PG",   template: "named" },
  "phieu-chuyen":      { name: "PHIẾU CHUYỂN",        abbr: "PC",   template: "named" },
  "phieu-bao":         { name: "PHIẾU BÁO",           abbr: "PB",   template: "named" },
  "thu-cong":          { name: "THƯ CÔNG",             abbr: "",     template: "named" },
};

/**
 * Returns the list of document type keys for use in JSON schema enums.
 */
function getDocumentTypeKeys() {
  return Object.keys(VN_DOCUMENT_TYPES);
}

/**
 * Looks up document type info by key, with a fallback.
 */
function getDocumentType(key) {
  return VN_DOCUMENT_TYPES[key] || VN_DOCUMENT_TYPES["cong-van"];
}

/**
 * Extracts legal basis ("Căn cứ...") lines from the beginning of draft content.
 * Returns the cleaned content and an array of extracted bases.
 */
function extractLegalBasisFromContent(content) {
  if (!content) return { cleanContent: "", extractedBases: [] };
  
  const lines = content.split(/\r?\n/);
  const extractedBases = [];
  const bodyLines = [];
  let reachedBody = false;

  for (let line of lines) {
    const trimmed = line.trim();
    if (reachedBody) {
      bodyLines.push(line);
      continue;
    }

    if (trimmed === "") {
      // Skip empty lines at the very beginning or between bases,
      // but do not mark as reached body yet
      continue;
    }

    // Bỏ qua tiêu đề bị duplicate ở đầu (VD: "# QUYẾT ĐỊNH" hoặc "# V/v...")
    if (/^#+\s/.test(trimmed) && extractedBases.length === 0 && !reachedBody) {
      continue;
    }

    // Match list markers or numbering followed by "Căn cứ" (case-insensitive)
    const match = trimmed.match(/^([-*•\d\.\s]*)\s*(Căn\s+cứ\s+.*)$/i);
    if (match) {
      const basisText = match[2].trim();
      extractedBases.push(basisText);
    } else {
      // Reached the first non-empty line that doesn't start with "Căn cứ"
      reachedBody = true;
      bodyLines.push(line);
    }
  }

  return {
    cleanContent: bodyLines.join("\n").trim(),
    extractedBases,
  };
}

// ---------------------------------------------------------------------------
// 2. DOCX rendering helpers
// ---------------------------------------------------------------------------

/**
 * Creates the header area of a Vietnamese administrative document.
 * Left column: Tên cơ quan chủ quản + Tên cơ quan ban hành
 * Right column: Quốc hiệu + Tiêu ngữ
 *
 * Layout uses a 2-column table with no visible borders.
 */
function buildHeaderSection(docx, {
  parentAgency = "",
  issuingAgency = "",
}) {
  const {
    Paragraph, TextRun, AlignmentType,
    Table, TableRow, TableCell, WidthType,
    UnderlineType,
  } = docx;
  const S = VN_ADMIN_STYLES;
  const noBorders = {
    top: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    bottom: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    left: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    right: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
  };

  // --- Left column: Cơ quan ---
  const leftChildren = [];
  if (parentAgency) {
    leftChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: parentAgency.toUpperCase(),
            font: S.font,
            size: S.sizes.coQuan,
          }),
        ],
      })
    );
  }
  leftChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [
        new TextRun({
          text: issuingAgency.toUpperCase(),
          font: S.font,
          size: S.sizes.coQuan,
          bold: true,
        }),
      ],
    })
  );
  // Gạch ngang dưới tên cơ quan ban hành (NĐ30: 1/3-1/4 chiều rộng cột)
  leftChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [
        new TextRun({
          text: "────",
          font: S.font,
          size: S.sizes.coQuan,
        }),
      ],
    })
  );

  // --- Right column: Quốc hiệu + Tiêu ngữ ---
  const rightChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [
        new TextRun({
          text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
          font: S.font,
          size: S.sizes.quocHieu,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [
        new TextRun({
          text: "Độc lập - Tự do - Hạnh phúc",
          font: S.font,
          size: S.sizes.tieuNgu,
          bold: true,
          underline: { type: "single" },
        }),
      ],
    }),
  ];

  return new Table({
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
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: noBorders,
            children: leftChildren,
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            borders: noBorders,
            children: rightChildren,
          }),
        ],
      }),
    ],
  });
}

/**
 * Creates the Số/Ký hiệu (left) and Địa danh, ngày tháng (right) row.
 */
function buildNumberDateSection(docx, {
  documentNumber = "",
  symbol = "",
  location = "",
  date = null,
  documentTypeInfo = null,
  title = "",
}) {
  const {
    Paragraph, TextRun, AlignmentType,
    Table, TableRow, TableCell, WidthType,
  } = docx;
  const S = VN_ADMIN_STYLES;
  const noBorders = {
    top: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    bottom: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    left: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    right: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
  };

  // Build symbol string: Số: XX/YYYY-ABBR
  const abbr = documentTypeInfo?.abbr || "";
  let symbolText = `Số: ${documentNumber || "[Số]"}`;
  if (symbol) {
    symbolText += `/${symbol}`;
    if (abbr) symbolText += `-${abbr}`;
  } else if (abbr) {
    symbolText += `/${abbr}`;
  } else {
    symbolText += `/...`;
  }

  // Build date string
  const dateObj = date ? new Date(date) : new Date();
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const dateText = `${location || "[Địa danh]"},  ngày ${String(day).padStart(2, "0")} tháng ${String(month).padStart(2, "0")} năm ${year}`;

  const leftChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: symbolText,
          font: S.font,
          size: S.sizes.soKyHieu,
        }),
      ],
    }),
  ];

  // If this is a cong-van, the trích yếu goes here below the number
  if (documentTypeInfo && documentTypeInfo.template === "cong-van" && title) {
    leftChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 0 },
        children: [
          new TextRun({
            text: `V/v: ${title}`,
            font: S.font,
            size: S.sizes.trichYeuCongVan,
          }),
        ],
      }),
      // Gạch ngang cho trích yếu công văn
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [
          new TextRun({
            text: "─────────────",
            font: S.font,
            size: 20,
          }),
        ],
      })
    );
  }

  return new Table({
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
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: noBorders,
            children: leftChildren,
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            borders: noBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: dateText,
                    font: S.font,
                    size: S.sizes.diaDanh,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Creates the document type name and summary/title section (centered).
 */
function buildTitleSection(docx, { documentTypeInfo, title }) {
  const { Paragraph, TextRun, AlignmentType } = docx;
  const S = VN_ADMIN_STYLES;
  const elements = [];

  // Tên loại văn bản và Trích yếu CÓ TÊN LOẠI
  if (documentTypeInfo && documentTypeInfo.template === "named") {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 0 },
        children: [
          new TextRun({
            text: documentTypeInfo.name,
            font: S.font,
            size: S.sizes.tenLoaiVB,
            bold: true,
          }),
        ],
      })
    );

    if (title) {
      elements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 60, after: 0 },
          children: [
            new TextRun({
              text: title,
              font: S.font,
              size: S.sizes.trichYeu,
              bold: true,
            }),
          ],
        })
      );
      // Gạch ngang dưới trích yếu
      elements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: "─────────────",
              font: S.font,
              size: 20,
            }),
          ],
        })
      );
    }
  }

  return elements;
}

/**
 * Creates the legal basis (Căn cứ pháp lý) paragraphs.
 * Each basis is italic, ends with ";", last one ends with ".".
 */
function buildLegalBasisParagraphs(docx, legalBases = []) {
  if (!legalBases || legalBases.length === 0) return [];
  const { Paragraph, TextRun } = docx;
  const S = VN_ADMIN_STYLES;

  return legalBases.map((basis, index) => {
    const isLast = index === legalBases.length - 1;
    const separator = isLast ? "." : ";";
    // Clean any trailing punctuation from basis text
    const cleanBasis = basis.replace(/[;.,]+\s*$/, "");
    return new Paragraph({
      spacing: { after: 60 },
      indent: { firstLine: 720 }, // ~0.5 inch indent
      children: [
        new TextRun({
          text: `${cleanBasis}${separator}`,
          font: S.font,
          size: S.sizes.canCu,
          italics: false,
        }),
      ],
    });
  });
}

/**
 * Converts HTML content to an array of docx elements tailored to Vietnamese administrative standards
 * (Decree 30/2020/NĐ-CP). All text is Times New Roman, black, and size-hierarchy compliant.
 */
async function htmlToVnAdminDocxElements(html, libs, log) {
  const { JSDOM, docx } = libs;
  const { Paragraph, TextRun, AlignmentType, ImageRun } = docx;
  const S = VN_ADMIN_STYLES;

  const dom = new JSDOM(html);
  const body = dom.window.document.body;
  const elements = [];

  // Helper for processing inline text elements
  async function processVnInline(element, styles = {}) {
    return processVnInlineNodes(element.childNodes, styles);
  }

  // Same as processVnInline but over an arbitrary list of sibling nodes, so a
  // paragraph can be rendered one <br>-separated line at a time.
  async function processVnInlineNodes(nodes, styles = {}) {
    const { TextRun, ExternalHyperlink, ImageRun } = docx;
    const children = [];

    for (const node of nodes) {
      if (node.nodeType === 3) {
        const text = node.textContent;
        if (text && text.trim()) {
          children.push(
            new TextRun({
              text,
              bold: styles.bold || false,
              italics: styles.italics || false,
              strike: styles.strike || false,
              font: S.font,
              size: styles.size || S.sizes.body,
              color: "000000",
            })
          );
        } else if (text && text.includes(" ")) {
          children.push(new TextRun({ text: " ", font: S.font }));
        }
      } else if (node.nodeType === 1) {
        const tagName = node.tagName.toLowerCase();
        switch (tagName) {
          case "strong":
          case "b":
            children.push(...(await processVnInline(node, { ...styles, bold: true })));
            break;
          case "em":
          case "i":
            children.push(...(await processVnInline(node, { ...styles, italics: true })));
            break;
          case "del":
          case "s":
            children.push(...(await processVnInline(node, { ...styles, strike: true })));
            break;
          case "code":
            children.push(
              new TextRun({
                text: node.textContent,
                font: "Consolas",
                size: 22,
                color: "000000",
                shading: { fill: "F2F2F2" },
              })
            );
            break;
          case "a": {
            const href = node.getAttribute("href");
            const isValidHref = href && /^https?:\/\//i.test(href);
            if (isValidHref) {
              children.push(
                new docx.ExternalHyperlink({
                  children: [
                    new TextRun({
                      text: node.textContent,
                      color: "0000EE",
                      underline: { type: "single" },
                      font: S.font,
                      size: styles.size || S.sizes.body,
                    }),
                  ],
                  link: href,
                })
              );
            } else {
              children.push(
                new TextRun({
                  text: node.textContent,
                  font: S.font,
                  size: styles.size || S.sizes.body,
                  color: "000000",
                })
              );
            }
            break;
          }
          case "br":
            children.push(new TextRun({ break: 1 }));
            break;
          default:
            children.push(...(await processVnInline(node, styles)));
        }
      }
    }
    return children;
  }

  // Splits a paragraph's child nodes at every <br> so each visual line becomes
  // its own Paragraph. Word only exempts the LAST line of a paragraph from
  // justification stretching - a line ending in a manual break (<w:br/>) is
  // stretched across the full page width, which is what made short heading
  // lines look letter-spaced.
  function splitNodesByBr(nodes) {
    const groups = [[]];
    for (const node of nodes) {
      const isBr =
        node.nodeType === 1 && node.tagName.toLowerCase() === "br";
      if (isBr) groups.push([]);
      else groups[groups.length - 1].push(node);
    }
    return groups.filter((g) =>
      g.some((n) => (n.textContent || "").trim() !== "" || n.nodeType === 1)
    );
  }

  // A "đề mục" line (I., 1., a), Điều 1., or an all-bold line) is left-aligned
  // per Decree 30 - only explanatory body text is justified.
  function isHeadingLine(nodes) {
    const text = nodes.map((n) => n.textContent || "").join("").trim();
    if (!text) return false;

    const meaningful = nodes.filter(
      (n) => n.nodeType !== 3 || (n.textContent || "").trim() !== ""
    );
    const allBold =
      meaningful.length > 0 &&
      meaningful.every(
        (n) =>
          n.nodeType === 1 &&
          ["strong", "b"].includes(n.tagName.toLowerCase())
      );
    if (allBold) return true;

    // An unbolded line only counts as a heading when it is short and has no
    // terminal punctuation - otherwise "1. Nâng cao chất lượng..." (a khoản,
    // i.e. body text) would lose its justification.
    if (text.length > 80 || /[.;:,]$/.test(text)) return false;
    return (
      /^(PHẦN|CHƯƠNG|MỤC|Điều)\s/i.test(text) ||
      /^([IVXLC]+|\d+(\.\d+)*|[a-zA-Z])\s*[.)]\s+\S/.test(text)
    );
  }

  // Helper for lists
  async function processVnList(listElement, isOrdered, level = 0) {
    const listParagraphs = [];
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
            inlineChildren.push(...(await processVnInline(wrapper, {})));
          }
        } else if (child.nodeType === 3 && child.textContent.trim()) {
          const wrapper = li.ownerDocument.createElement("span");
          wrapper.textContent = child.textContent;
          inlineChildren.push(...(await processVnInline(wrapper, {})));
        }
      }

      if (inlineChildren.length > 0) {
        let hasOwnNumbering = false;
        if (!isOrdered) {
          const text = li.textContent.trim();
          if (/^(?:(?:\d+\.)+(?:\d+)?|\d+\)|Điều\s+\d+(?:[\.\:])?|Khoản\s+\d+(?:[\.\:])?|[a-zA-Z][\.\)])(\s|:)/.test(text)) {
            hasOwnNumbering = true;
          }
        }

        listParagraphs.push(
          new Paragraph({
            children: inlineChildren,
            bullet: (isOrdered || hasOwnNumbering) ? undefined : { level },
            numbering: isOrdered
              ? { reference: "default-numbering", level }
              : undefined,
            indent: hasOwnNumbering 
              ? { left: 720 + (level * 360), hanging: 360 } 
              : undefined,
            spacing: { after: 60, line: S.spacing.lineSpacing },
          })
        );
      }

      for (const nested of nestedLists) {
        listParagraphs.push(
          ...(await processVnList(nested.element, nested.ordered, level + 1))
        );
      }
    }
    return listParagraphs;
  }

  // Helper for tables conforming to VN administrative format
  async function processVnTable(tableElement) {
    const { Table, TableRow, TableCell, WidthType, BorderStyle, TableLayoutType } = docx;
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

      // Table header gets bold text and clean light grey shading
      let shadingFill;
      if (isHeader) {
        shadingFill = "EAEAEA"; // light grey for headers
      } else if (dataRowIndex % 2 === 1) {
        shadingFill = "F9F9F9"; // zebra striping
      }

      for (const cell of cellElements) {
        // Table cell content should be slightly smaller (13pt / size 26) to look clean
        const cellChildren = await processVnInline(cell, {
          size: 26, 
          bold: isHeader
        });
        
        cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: cellChildren.length > 0 ? cellChildren : [new TextRun({ text: "", font: S.font, size: 26 })],
                alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
                spacing: { before: 80, after: 80 },
              }),
            ],
            width: { size: columnWidthPercent, type: WidthType.PERCENTAGE },
            shading: shadingFill ? { fill: shadingFill } : undefined,
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
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
        top: { style: BorderStyle.SINGLE, size: 4, color: "555555" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "555555" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "888888" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "888888" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
      },
    });
  }

  // Iterate top-level DOM nodes in body
  for (const child of body.children) {
    const tagName = child.tagName.toLowerCase();

    try {
      if (tagName === "h1") {
        // H1: Phần, Chương
        // Style: Centered, Bold, uppercase
        const rawText = child.textContent.trim();
        const upperText = rawText.toUpperCase();
        
        elements.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: upperText,
                bold: true,
                font: S.font,
                size: 28, // 14pt
                color: "000000",
              }),
            ],
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (tagName === "h2") {
        // H2: Mục, Điều
        // Style: Bold, Sentence case, left-aligned, indent first line
        const inlineChildren = await processVnInline(child, { bold: true, size: 28 });
        elements.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            indent: { firstLine: 720 }, // ~1.27cm
            children: inlineChildren.length > 0 ? inlineChildren : [
              new TextRun({
                text: child.textContent,
                bold: true,
                font: S.font,
                size: 28,
                color: "000000",
              })
            ],
            spacing: { before: 180, after: 120 },
          })
        );
      } else if (tagName === "h3") {
        // H3: Tiểu mục, Khoản
        // Style: Bold, left-aligned, indent first line
        const inlineChildren = await processVnInline(child, { bold: true, size: 28 });
        elements.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            indent: { firstLine: 720 },
            children: inlineChildren.length > 0 ? inlineChildren : [
              new TextRun({
                text: child.textContent,
                bold: true,
                font: S.font,
                size: 28,
                color: "000000",
              })
            ],
            spacing: { before: 120, after: 60 },
          })
        );
      } else if (tagName === "h4" || tagName === "h5" || tagName === "h6") {
        // H4/H5/H6: Điểm
        // Style: Italics, left-aligned, indent first line
        const inlineChildren = await processVnInline(child, { italics: true, size: 28 });
        elements.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            indent: { firstLine: 720 },
            children: inlineChildren.length > 0 ? inlineChildren : [
              new TextRun({
                text: child.textContent,
                italics: true,
                font: S.font,
                size: 28,
                color: "000000",
              })
            ],
            spacing: { before: 120, after: 60 },
          })
        );
      } else if (tagName === "p") {
        // One Paragraph per <br>-separated line: a justified line that ends in
        // a manual break gets stretched full-width by Word.
        for (const lineNodes of splitNodesByBr(child.childNodes)) {
          const inlineChildren = await processVnInlineNodes(lineNodes, { size: 28 });
          if (inlineChildren.length === 0) continue;
          const heading = isHeadingLine(lineNodes);
          elements.push(
            new Paragraph({
              children: inlineChildren,
              alignment: heading
                ? AlignmentType.LEFT
                : AlignmentType.JUSTIFIED,
              indent: { firstLine: 720 }, // 1.27cm indent
              spacing: { after: 120, line: S.spacing.lineSpacing },
            })
          );
        }
      } else if (tagName === "ul") {
        elements.push(...(await processVnList(child, false, 0)));
      } else if (tagName === "ol") {
        elements.push(...(await processVnList(child, true, 0)));
      } else if (tagName === "table") {
        elements.push(await processVnTable(child));
        elements.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      } else if (tagName === "blockquote") {
        const inlineChildren = await processVnInline(child, { italics: true, size: 26 });
        elements.push(
          new Paragraph({
            children: inlineChildren,
            indent: { left: 720 },
            border: {
              left: { style: "single", size: 18, color: "888888" },
            },
            spacing: { before: 120, after: 120 },
          })
        );
      } else if (tagName === "hr") {
        elements.push(
          new Paragraph({
            children: [],
            border: {
              bottom: { style: "single", size: 6, color: "CCCCCC" },
            },
            spacing: { before: 120, after: 120 },
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
        const inlineChildren = await processVnInline(child, {});
        if (inlineChildren.length > 0) {
          elements.push(
            new Paragraph({
              children: inlineChildren,
              spacing: { after: 120 },
            })
          );
        }
      }
    } catch (err) {
      log(`htmlToVnAdminDocxElements error processing tag ${tagName}: ${err.message}`);
    }
  }

  return elements;
}

/**
 * Converts markdown content to DOCX paragraphs using the standard
 * body text style (Times New Roman, 14pt).
 */
async function buildBodyContent(docx, libs, content, log) {
  const { marked } = libs;
  marked.setOptions({ gfm: true, breaks: true });
  const html = marked.parse(content);
  const elements = await htmlToVnAdminDocxElements(html, libs, log);

  if (elements.length === 0) {
    const { Paragraph, TextRun, AlignmentType } = docx;
    elements.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: content,
            font: VN_ADMIN_STYLES.font,
            size: VN_ADMIN_STYLES.sizes.body,
            color: "000000",
          }),
        ],
      })
    );
  }

  return elements;
}

/**
 * Creates the signature block (Khối chữ ký).
 * Right-aligned: Title line → [space for signature] → Full name
 */
function buildFooterBlock(docx, { recipients = [], signers = [], documentTypeInfo = null }) {
  const { Paragraph, TextRun, AlignmentType,
    Table, TableRow, TableCell, WidthType } = docx;
  const S = VN_ADMIN_STYLES;
  const noBorders = {
    top: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    bottom: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    left: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
    right: { style: docx.BorderStyle.NONE, size: 0, color: "auto" },
  };

  // --- Left: Nơi nhận ---
  const leftChildren = [];
  leftChildren.push(
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: "Nơi nhận:",
          font: S.font,
          size: S.sizes.noiNhanLabel,
          bold: true,
          italics: true,
        }),
      ],
    })
  );

  const recipientList = recipients && recipients.length > 0
    ? recipients
    : ["- Như trên;", "- Lưu: VT."];

  recipientList.forEach((recipient, index) => {
    const isLast = index === recipientList.length - 1;
    let text = recipient.replace(/^[-–•]\s*/, "");
    if (!text.match(/[;.]$/)) {
      text += isLast ? "." : ";";
    }
    leftChildren.push(
      new Paragraph({
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: `- ${text}`,
            font: S.font,
            size: S.sizes.noiNhanItem,
          }),
        ],
      })
    );
  });

  // --- Dynamic Layout cho Nơi nhận và (Các) Chữ ký ---
  const numSigners = signers && signers.length > 0 ? signers.length : 1;
  const noNhanWidth = numSigners === 1 ? 50 : Math.floor(100 / (numSigners + 1));
  const signerWidth = Math.floor((100 - noNhanWidth) / numSigners);

  const rowCells = [];
  
  // Nơi nhận
  rowCells.push(
    new TableCell({
      width: { size: noNhanWidth, type: WidthType.PERCENTAGE },
      borders: noBorders,
      children: leftChildren,
    })
  );

  // Signers
  let finalSigners = signers;
  if (!finalSigners || finalSigners.length === 0) {
    finalSigners = [{ title: "[CHỨC VỤ NGƯỜI KÝ]", name: "[Họ và tên người ký]" }];
  }

  finalSigners.forEach(signer => {
    const signerChildren = [];
    let signerTitleText = signer.title || "[CHỨC VỤ NGƯỜI KÝ]";

    // Handle TM. (Thay mặt) and KT. (Ký thay) prefixes per NĐ30
    const tmMatch = signerTitleText.match(/^(TM\.|Thay mặt)\s*(.+)/i);
    const ktMatch = signerTitleText.match(/^(KT\.|Ký thay)\s*(.+)/i);

    if (tmMatch) {
      signerChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
          children: [
            new TextRun({
              text: "TM. " + tmMatch[2].toUpperCase(),
              font: S.font,
              size: S.sizes.chucVuKy,
              bold: true,
            }),
          ],
        })
      );
    } else if (ktMatch) {
      signerChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
          children: [
            new TextRun({
              text: "KT. " + ktMatch[2].toUpperCase(),
              font: S.font,
              size: S.sizes.chucVuKy,
              bold: true,
            }),
          ],
        })
      );
    } else {
      const titles = signerTitleText.split(/\n|<br>/i);
      titles.forEach(t => {
        signerChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
            children: [
              new TextRun({
                text: t.toUpperCase(),
                font: S.font,
                size: S.sizes.chucVuKy,
                bold: true,
              }),
            ],
          })
        );
      });
    }

    for (let i = 0; i < 4; i++) {
      signerChildren.push(
        new Paragraph({
          spacing: { after: 0 },
          children: [new TextRun({ text: "", font: S.font, size: S.sizes.body })],
        })
      );
    }

    signerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: signer.name || "[Họ và tên người ký]",
            font: S.font,
            size: S.sizes.hoTen,
            bold: true,
          }),
        ],
      })
    );

    rowCells.push(
      new TableCell({
        width: { size: signerWidth, type: WidthType.PERCENTAGE },
        borders: noBorders,
        children: signerChildren,
      })
    );
  });

  return [
    new Paragraph({ spacing: { before: 240 }, children: [] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        ...noBorders,
        insideHorizontal: { style: "none" },
        insideVertical: { style: "none" },
      },
      rows: [
        new TableRow({
          children: rowCells,
        }),
      ],
    })
  ];
}

/**
 * Main function: Assembles a complete Vietnamese administrative document DOCX.
 *
 * @param {Object} docx - The docx library
 * @param {Object} params - Document parameters
 * @param {Object} libs - Loaded libraries (marked, JSDOM, docx)
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} A docx Document ready for packing
 */
async function buildVnAdminDocx(docx, params, libs, log) {
  const {
    Document, Packer, Paragraph, TextRun,
    AlignmentType, PageNumber, Header, Footer,
  } = docx;
  const S = VN_ADMIN_STYLES;

  const documentTypeInfo = getDocumentType(params.documentType);

  // Assemble all document children in order
  const children = [];

  // 1. Header: Cơ quan + Quốc hiệu
  children.push(
    buildHeaderSection(docx, {
      parentAgency: params.parentAgency || "[TÊN CƠ QUAN CHỦ QUẢN]",
      issuingAgency: params.issuingAgency || "[TÊN CƠ QUAN BAN HÀNH]",
    })
  );

  // Spacer
  children.push(new Paragraph({ spacing: { after: 60 }, children: [] }));

  // 2. Số/Ký hiệu + Địa danh, ngày tháng
  children.push(
    buildNumberDateSection(docx, {
      documentNumber: params.documentNumber,
      symbol: params.symbol,
      location: params.location,
      date: params.date,
      documentTypeInfo,
      title: params.title,
    })
  );

  // 3. Tên loại văn bản + Trích yếu
  children.push(
    ...buildTitleSection(docx, {
      documentTypeInfo,
      title: params.title,
    })
  );

  // 4. Căn cứ pháp lý (if any)
  if (params.legalBasis && params.legalBasis.length > 0) {
    children.push(
      ...buildLegalBasisParagraphs(docx, params.legalBasis)
    );
  }

  // 5. Nội dung chính
  if (params.content) {
    const bodyElements = await buildBodyContent(
      docx, libs, params.content, log
    );
    children.push(
      new Paragraph({ spacing: { before: 120 }, children: [] })
    );
    children.push(...bodyElements);
  }

  // 6. Nơi nhận & Khối chữ ký (Footer block)
  children.push(
    ...buildFooterBlock(docx, {
      recipients: params.recipients,
      signers: params.signers,
      documentTypeInfo,
    })
  );

  // --- Build the Document ---
  const doc = new Document({
    title: (params.title || "Văn bản hành chính").replace(/\n/g, " "),
    creator: "AnythingLLM",
    description: `Văn bản hành chính - ${documentTypeInfo.name}`.replace(/\n/g, " "),
    numbering: DEFAULT_NUMBERING_CONFIG,
    styles: {
      default: {
        document: {
          run: {
            font: S.font,
            size: S.sizes.body,
          },
          paragraph: {
            spacing: {
              after: S.spacing.paragraphAfter,
              line: S.spacing.lineSpacing,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          titlePage: true,
          page: {
            margin: S.margins,
            size: {
              width: 11906,  // A4 width in twips (210mm)
              height: 16838, // A4 height in twips (297mm)
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: S.font,
                    size: S.sizes.pageNumber,
                  }),
                ],
              }),
            ],
          }),
          first: new Header({ children: [new Paragraph({ children: [] })] }), // No page number on first page
        },
        children,
      },
    ],
  });

  return doc;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  VN_ADMIN_STYLES,
  VN_DOCUMENT_TYPES,
  getDocumentTypeKeys,
  getDocumentType,
  extractLegalBasisFromContent,
  buildHeaderSection,
  buildNumberDateSection,
  buildTitleSection,
  buildLegalBasisParagraphs,
  buildBodyContent,
  buildFooterBlock,
  buildVnAdminDocx,
};
