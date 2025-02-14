const fs = require("fs").promises;
const path = require("path");
const NodeCanvasFactory = require("./CanvasFactory");

class PDFLoader {
  constructor(filePath, { splitPages = true } = {}) {
    this.filePath = filePath;
    this.splitPages = splitPages;
    this.metadata = {};
  }

  /**
   * Loads a PDF file and returns an array of documents.
   * This function is reserved to parsing for DIGITAL documents - scanned documents are not supported in this function
   * For scanned documents, use the `asOCR` function instead.
   * @returns {Promise<{pageContent: string, metadata: object}[]>} An array of documents with page content and metadata.
   */
  async load() {
    const documents = [];
    const buffer = await fs.readFile(this.filePath);
    const { getDocument, version } = await this.getPdfJS();

    const pdf = await getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    }).promise;

    const meta = await pdf.getMetadata().catch(() => null);
    this.metadata = {
      source: this.filePath,
      pdf: {
        version,
        info: meta?.info,
        metadata: meta?.metadata,
        totalPages: pdf.numPages,
      },
    };

    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      if (content.items.length === 0) continue;

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
          ...this.metadata,
          loc: { pageNumber: i },
        },
      });
    }

    if (this.splitPages) return documents;
    if (documents.length === 0) return [];

    return [
      {
        pageContent: documents.map((doc) => doc.pageContent).join("\n\n"),
        metadata: this.metadata,
      },
    ];
  }

  /**
   * Loads a PDF file and returns an array of documents.
   * This function is reserved to parsing for SCANNED documents - digital documents are not supported in this function
   * For digital documents, use the `load` function instead.
   * @returns {Promise<{pageContent: string, metadata: object}[]>} An array of documents with page content and metadata.
   */
  async asOCR() {
    const documents = [];
    const pdfjs = await import("pdf-parse/lib/pdf.js/v2.0.550/build/pdf.js");
    const buffer = await fs.readFile(this.filePath);
    const canvasFactory = new NodeCanvasFactory();
    await canvasFactory.init();
    global.Image = canvasFactory.Image;

    const pdfDocument = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      canvasFactory,
    }).promise;

    async function getPageAsBuffer(pageNumber, scale = 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport(scale);
      const { canvas, context } = canvasFactory.create(
        viewport.width,
        viewport.height,
        false
      );

      await page.render({
        canvasFactory,
        canvasContext: context,
        viewport,
      }).promise;

      return canvas.toBuffer();
    }

    const { createWorker, setLogging, OEM } = require("tesseract.js");
    setLogging(false);
    const worker = await createWorker("eng", OEM.LSTM_ONLY, {
      cachePath: path.resolve(__dirname, `../../../../storage/tmp`),
    });

    for (let i = 1; i <= pdfDocument.numPages; i += 1) {
      const image = await getPageAsBuffer(i, 5);
      const { data } = await worker.recognize(image, {}, "text");
      documents.push({
        pageContent: data.text,
        metadata: {
          ...this.metadata,
          loc: { pageNumber: i },
        },
      });
    }

    return documents;
  }

  async getPdfJS() {
    try {
      const pdfjs = await import("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js");
      return {
        getDocument: pdfjs.getDocument,
        version: pdfjs.version,
      };
    } catch (e) {
      console.error(e);
      throw new Error(
        "Failed to load pdf-parse. Please install it with eg. `npm install pdf-parse`."
      );
    }
  }
}

module.exports = PDFLoader;
