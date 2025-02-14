const fs = require("fs").promises;

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
    const { fork } = require("child_process");
    const path = require("path");
    const timeout = 300_000;
    const ocrDataDirectory =
      process.env.NODE_ENV === "development"
        ? path.resolve(__dirname, `../../../../../server/storage/models/ocr`)
        : path.resolve(
            process.env.STORAGE_DIR ??
              path.resolve(__dirname, `../../../../../server/storage`),
            `models/ocr`
          );

    return new Promise((resolve, _) => {
      const worker = fork(path.join(__dirname, "ocrWorker.js"));
      let isResolved = false;

      const cleanupAndResolve = (result = []) => {
        if (!isResolved) {
          isResolved = true;
          worker.kill("SIGTERM");
          resolve(result);
        }
      };

      worker.on("message", (result) => {
        if (result.error) {
          console.log(
            `[PDFLoader] Error parsing PDF with OCR engine: ${result.error}`
          );
          cleanupAndResolve([]);
        } else {
          cleanupAndResolve([
            {
              pageContent: result.textContent,
              metadata: {
                ...this.metadata,
                source: this.filePath,
              },
            },
          ]);
        }
      });

      setTimeout(() => {
        console.log(
          `[PDFLoader] OCR Worker timeout (${timeout / 1000} seconds)`
        );
        cleanupAndResolve([]);
      }, timeout);

      worker.on("error", (error) => {
        console.error(`[PDFLoader] OCR Worker error: ${error}`);
        cleanupAndResolve([]);
      });

      worker.send({
        filePath: this.filePath,
        mode: "speed", // TODO: Make this configurable
        langs: ["eng"], // TODO: Make this configurable
        runDir: ocrDataDirectory,
      });
    });
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
