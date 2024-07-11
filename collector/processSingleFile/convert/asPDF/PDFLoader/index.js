const fs = require("fs").promises;
const pdf = require("pdf-parse");

class PDFLoader {
  constructor(filePath, { splitPages = true } = {}) {
    this.filePath = filePath;
    this.splitPages = splitPages;
  }

  async load() {
    const buffer = await fs.readFile(this.filePath);

    const options = {
      pagerender: this.splitPages ? this.renderPage : null,
    };

    const { text, numpages, info, metadata, version } = await pdf(
      buffer,
      options
    );

    if (!this.splitPages) {
      return [
        {
          pageContent: text.trim(),
          metadata: {
            source: this.filePath,
            pdf: { version, info, metadata, totalPages: numpages },
          },
        },
      ];
    }

    return this.pages.map((pageContent, index) => ({
      pageContent: pageContent.trim(),
      metadata: {
        source: this.filePath,
        pdf: { version, info, metadata, totalPages: numpages },
        loc: { pageNumber: index + 1 },
      },
    }));
  }

  pages = [];

  renderPage = async (pageData) => {
    const textContent = await pageData.getTextContent();
    let lastY,
      text = "";
    for (const item of textContent.items) {
      if (lastY !== item.transform[5] && lastY !== undefined) {
        text += "\n";
      }
      text += item.str;
      lastY = item.transform[5];
    }
    this.pages.push(text);
    return text;
  };
}

module.exports = PDFLoader;
