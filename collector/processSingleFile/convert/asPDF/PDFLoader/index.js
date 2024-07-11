const fs = require("fs").promises;
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve(
  "pdfjs-dist/legacy/build/pdf.worker.js"
);

class PDFLoader {
  constructor(filePath, { splitPages = true } = {}) {
    this.filePath = filePath;
    this.splitPages = splitPages;
  }

  async load() {
    const data = await fs.readFile(this.filePath);
    const pdf = await pdfjsLib.getDocument({
      data,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    }).promise;

    const meta = await pdf.getMetadata().catch(() => null);
    const documents = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      if (content.items.length === 0) {
        continue;
      }

      let lastY;
      const textItems = [];
      for (const item of content.items) {
        if ("str" in item) {
          if (lastY === item.transform[5] || !lastY) {
            textItems.push(item.str);
          } else {
            textItems.push(`\n${item.str}`);
          }
          lastY = item.transform[5];
        }
      }

      const text = textItems.join("");

      documents.push({
        pageContent: text.trim(),
        metadata: {
          source: this.filePath,
          pdf: {
            version: pdf._pdfInfo.version,
            info: meta?.info,
            metadata: meta?.metadata,
            totalPages: pdf.numPages,
          },
          loc: {
            pageNumber: i,
          },
        },
      });
    }

    if (this.splitPages) {
      return documents;
    } else {
      return [
        {
          pageContent: documents.map((doc) => doc.pageContent).join("\n\n"),
          metadata: {
            source: this.filePath,
            pdf: {
              version: pdf._pdfInfo.version,
              info: meta?.info,
              metadata: meta?.metadata,
              totalPages: pdf.numPages,
            },
          },
        },
      ];
    }
  }
}

module.exports = PDFLoader;
