const createFilesLib = require("../lib.js");

/**
 * Applies AnythingLLM branding to a PDF document.
 * Adds a logo watermark or fallback text to the bottom-right of each page.
 * @param {PDFDocument} pdfDoc - The pdf-lib PDFDocument instance
 * @param {Object} pdfLib - The pdf-lib module exports (rgb, StandardFonts)
 * @returns {Promise<void>}
 */
async function applyBranding(pdfDoc, { rgb, StandardFonts }) {
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const pages = pdfDoc.getPages();

  const logoPng = createFilesLib.getLogo({
    forDarkBackground: false,
    format: "buffer",
  });
  const logoImage = logoPng ? await pdfDoc.embedPng(logoPng) : null;

  const logoWidth = 80;
  const logoHeight = logoImage
    ? (logoImage.height / logoImage.width) * logoWidth
    : 0;

  const marginRight = 20;
  const marginBottom = 20;

  for (const page of pages) {
    const { width } = page.getSize();

    if (logoImage) {
      const createdWithText = "created with";
      const fontSize = 7;
      const textWidth = font.widthOfTextAtSize(createdWithText, fontSize);
      const logoX = width - marginRight - logoWidth;

      page.drawText(createdWithText, {
        x: logoX + (logoWidth - textWidth) / 2,
        y: marginBottom + logoHeight + 2,
        size: fontSize,
        font,
        color: rgb(0.6, 0.6, 0.6),
        opacity: 0.6,
      });

      page.drawImage(logoImage, {
        x: logoX,
        y: marginBottom,
        width: logoWidth,
        height: logoHeight,
        opacity: 0.6,
      });
    } else {
      const fallbackText = "Created with AnythingLLM";
      const fontSize = 9;
      const textWidth = font.widthOfTextAtSize(fallbackText, fontSize);
      page.drawText(fallbackText, {
        x: width - marginRight - textWidth,
        y: marginBottom,
        size: fontSize,
        font,
        color: rgb(0.6, 0.6, 0.6),
      });
    }
  }
}

module.exports = {
  applyBranding,
};
