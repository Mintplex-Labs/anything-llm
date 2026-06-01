const createFilesLib = require("../lib.js");

// All positioning assumes LAYOUT_16x9: 10 × 5.625 in.
const MARGIN_X = 0.7;
const CONTENT_W = 8.6; // 10 - 2 × MARGIN_X
const SLIDE_H = 5.625;

function isDarkColor(hexColor) {
  const hex = (hexColor || "FFFFFF").replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

function addBranding(slide, bgColor) {
  const isDark = isDarkColor(bgColor);
  const textColor = isDark ? "FFFFFF" : "000000";
  const logo = createFilesLib.getLogo({
    forDarkBackground: isDark,
    format: "dataUri",
  });

  slide.addText("Created with", {
    x: 7.85,
    y: 5.06,
    w: 1.85,
    h: 0.12,
    fontSize: 5.5,
    color: textColor,
    transparency: 78,
    fontFace: "Calibri",
    align: "center",
    italic: true,
  });

  if (logo) {
    slide.addImage({
      data: logo,
      x: 8.025,
      y: 5.17,
      w: 1.5,
      h: 0.24,
      transparency: 78,
    });
  } else {
    slide.addText("AnythingLLM", {
      x: 7.85,
      y: 5.17,
      w: 1.85,
      h: 0.24,
      fontSize: 8,
      color: textColor,
      transparency: 78,
      fontFace: "Calibri",
      align: "center",
    });
  }
}

function addTopAccentBar(slide, pptx, theme) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.05,
    fill: { color: theme.accentColor },
    line: { color: theme.accentColor },
  });
}

function addAccentUnderline(slide, pptx, x, y, color) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 1.5,
    h: 0.035,
    fill: { color },
    line: { color },
  });
}

function addSlideFooter(slide, pptx, theme, slideNumber, totalSlides) {
  slide.addShape(pptx.ShapeType.rect, {
    x: MARGIN_X,
    y: 5.0,
    w: CONTENT_W,
    h: 0.007,
    fill: { color: theme.footerLineColor },
    line: { color: theme.footerLineColor },
  });

  slide.addText(`${slideNumber}  /  ${totalSlides}`, {
    x: MARGIN_X,
    y: 5.07,
    w: 1.2,
    h: 0.25,
    fontSize: 8,
    color: theme.footerColor,
    fontFace: theme.fontBody,
    align: "left",
  });
}

function renderTitleSlide(slide, pptx, { title, author }, theme) {
  slide.background = { color: theme.titleSlideBackground };

  slide.addText(title || "Untitled", {
    x: 1.0,
    y: 1.3,
    w: 8.0,
    h: 1.4,
    fontSize: 36,
    bold: true,
    color: theme.titleSlideTitleColor,
    fontFace: theme.fontTitle,
    align: "center",
    valign: "bottom",
  });

  addAccentUnderline(slide, pptx, 4.25, 2.9, theme.titleSlideAccentColor);

  if (author) {
    slide.addText(author, {
      x: 1.5,
      y: 3.15,
      w: 7.0,
      h: 0.45,
      fontSize: 14,
      color: theme.titleSlideSubtitleColor,
      fontFace: theme.fontBody,
      align: "center",
      italic: true,
    });
  }

  // Bottom accent strip
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: SLIDE_H - 0.1,
    w: "100%",
    h: 0.1,
    fill: { color: theme.titleSlideAccentColor },
    line: { color: theme.titleSlideAccentColor },
  });

  addBranding(slide, theme.titleSlideBackground);
}

function renderSectionSlide(
  slide,
  pptx,
  slideData,
  theme,
  slideNumber,
  totalSlides
) {
  slide.background = { color: theme.titleSlideBackground };

  slide.addText(slideData.title || "", {
    x: 1.0,
    y: 1.5,
    w: 8.0,
    h: 1.2,
    fontSize: 32,
    bold: true,
    color: theme.titleSlideTitleColor,
    fontFace: theme.fontTitle,
    align: "center",
    valign: "bottom",
  });

  addAccentUnderline(slide, pptx, 4.25, 2.9, theme.titleSlideAccentColor);

  if (slideData.subtitle) {
    slide.addText(slideData.subtitle, {
      x: 1.5,
      y: 3.1,
      w: 7.0,
      h: 0.5,
      fontSize: 16,
      color: theme.titleSlideSubtitleColor,
      fontFace: theme.fontBody,
      align: "center",
    });
  }

  const numColor = isDarkColor(theme.titleSlideBackground)
    ? "FFFFFF"
    : "000000";
  slide.addText(`${slideNumber}  /  ${totalSlides}`, {
    x: MARGIN_X,
    y: 5.1,
    w: 1.2,
    h: 0.25,
    fontSize: 8,
    color: numColor,
    transparency: 65,
    fontFace: theme.fontBody,
    align: "left",
  });

  addBranding(slide, theme.titleSlideBackground);

  if (slideData.notes) slide.addNotes(slideData.notes);
}

function renderContentSlide(
  slide,
  pptx,
  slideData,
  theme,
  slideNumber,
  totalSlides
) {
  slide.background = { color: theme.background };

  addTopAccentBar(slide, pptx, theme);

  let contentStartY = 0.4;

  if (slideData.title) {
    slide.addText(slideData.title, {
      x: MARGIN_X,
      y: 0.3,
      w: CONTENT_W,
      h: 0.65,
      fontSize: 24,
      bold: true,
      color: theme.titleColor,
      fontFace: theme.fontTitle,
      valign: "bottom",
    });
    contentStartY = 1.0;

    if (slideData.subtitle) {
      slide.addText(slideData.subtitle, {
        x: MARGIN_X,
        y: 1.0,
        w: CONTENT_W,
        h: 0.3,
        fontSize: 13,
        color: theme.subtitleColor,
        fontFace: theme.fontBody,
      });
      contentStartY = 1.35;
    }

    addAccentUnderline(
      slide,
      pptx,
      MARGIN_X,
      contentStartY + 0.05,
      theme.accentColor
    );
    contentStartY += 0.25;
  }

  const footerY = 5.0;
  const contentHeight = footerY - contentStartY - 0.15;

  if (slideData.table) {
    addTableContent(slide, pptx, slideData.table, theme, contentStartY);
  } else {
    addBulletContent(
      slide,
      slideData.content,
      theme,
      contentStartY,
      contentHeight
    );
  }

  addSlideFooter(slide, pptx, theme, slideNumber, totalSlides);
  addBranding(slide, theme.background);

  if (slideData.notes) slide.addNotes(slideData.notes);
}

function renderBlankSlide(slide, pptx, theme, slideNumber, totalSlides) {
  slide.background = { color: theme.background };
  addSlideFooter(slide, pptx, theme, slideNumber, totalSlides);
  addBranding(slide, theme.background);
}

function addBulletContent(slide, content, theme, startY, maxHeight) {
  if (!Array.isArray(content) || content.length === 0) return;

  const bulletPoints = content.map((text) => ({
    text,
    options: {
      fontSize: 15,
      color: theme.bodyColor,
      fontFace: theme.fontBody,
      bullet: { code: "25AA", color: theme.bulletColor },
      paraSpaceAfter: 10,
    },
  }));

  slide.addText(bulletPoints, {
    x: MARGIN_X,
    y: startY,
    w: CONTENT_W,
    h: maxHeight,
    valign: "top",
  });
}

function addTableContent(slide, pptx, tableData, theme, startY) {
  if (!tableData) return;

  const rows = [];

  if (tableData.headers?.length > 0) {
    rows.push(
      tableData.headers.map((header) => ({
        text: header,
        options: {
          bold: true,
          fontSize: 12,
          fontFace: theme.fontBody,
          color: theme.tableHeaderColor,
          fill: { color: theme.tableHeaderBg },
          align: "left",
          valign: "middle",
          margin: [4, 8, 4, 8],
        },
      }))
    );
  }

  if (tableData.rows?.length > 0) {
    tableData.rows.forEach((row, idx) => {
      rows.push(
        row.map((cell) => ({
          text: cell,
          options: {
            fontSize: 11,
            fontFace: theme.fontBody,
            color: theme.bodyColor,
            fill: {
              color: idx % 2 === 1 ? theme.tableAltRowBg : theme.background,
            },
            align: "left",
            valign: "middle",
            margin: [4, 8, 4, 8],
          },
        }))
      );
    });
  }

  if (rows.length === 0) return;

  const colCount = rows[0].length;
  slide.addTable(rows, {
    x: MARGIN_X,
    y: startY,
    w: CONTENT_W,
    colW: CONTENT_W / colCount,
    rowH: 0.4,
    border: { type: "solid", pt: 0.5, color: theme.tableBorderColor },
  });
}

module.exports = {
  isDarkColor,
  addBranding,
  addTopAccentBar,
  addAccentUnderline,
  addSlideFooter,
  renderTitleSlide,
  renderSectionSlide,
  renderContentSlide,
  renderBlankSlide,
  addBulletContent,
  addTableContent,
};
