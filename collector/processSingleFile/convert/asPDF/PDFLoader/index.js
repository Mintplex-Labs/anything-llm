const fs = require("fs").promises;

class PDFLoader {
  constructor(filePath, { splitPages = true } = {}) {
    this.filePath = filePath;
    this.splitPages = splitPages;
  }

  async load() {
    const MAX_PDF_FILE_SIZE_MB =
      parseInt(process.env.MAX_PDF_FILE_SIZE_MB) || 250;
    const stats = await fs.stat(this.filePath);
    if (stats.size > MAX_PDF_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(
        `PDF file size (${(stats.size / (1024 * 1024)).toFixed(2)}MB) exceeds the maximum allowed size of ${MAX_PDF_FILE_SIZE_MB}MB.`
      );
    }

    const buffer = await fs.readFile(this.filePath);
    const { getDocument, version } = await this.getPdfJS();

    let pdf;
    try {
      pdf = await getDocument({
        data: new Uint8Array(buffer),
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      }).promise;
    } catch (e) {
      if (e.name === "PasswordException" || e.type === "password" || /password/i.test(e.message || "")) {
        throw new Error(
          `PDF file "${this.filePath}" is password protected. This loader does not support password-protected PDFs.`
        );
      }
      throw e;
    }

    const meta = await pdf.getMetadata().catch(() => null);
    const documents = [];

    for (let i = 1; i <= pdf.numPages; i += 1) {
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
            version,
            info: meta?.info,
            metadata: meta?.metadata,
            totalPages: pdf.numPages,
          },
          loc: { pageNumber: i },
        },
      });
    }

    if (this.splitPages) {
      return documents;
    }

    if (documents.length === 0) {
      return [];
    }

    return [
      {
        pageContent: documents.map((doc) => doc.pageContent).join("\n\n"),
        metadata: {
          source: this.filePath,
          pdf: {
            version,
            info: meta?.info,
            metadata: meta?.metadata,
            totalPages: pdf.numPages,
          },
        },
      },
    ];
  }

  async getPdfJS() {
    try {
      const pdfjs = await import("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js");
      return { getDocument: pdfjs.getDocument, version: pdfjs.version };
    } catch (e) {
      console.error(e);
      throw new Error(
        "Failed to load pdf-parse. Please install it with eg. `npm install pdf-parse`."
      );
    }
  }
}

module.exports = PDFLoader;
