const fs = require("fs");
const os = require("os");
const path = require("path");
const { VALID_LANGUAGE_CODES } = require("./validLangs");

class OCRLoader {
  /**
   * The language code(s) to use for the OCR.
   * @type {string[]}
   */
  language;
  /**
   * The cache directory for the OCR.
   * @type {string}
   */
  cacheDir;

  /**
   * The constructor for the OCRLoader.
   * @param {Object} options - The options for the OCRLoader.
   * @param {string} options.targetLanguages - The target languages to use for the OCR as a comma separated string. eg: "eng,deu,..."
   */
  constructor({ targetLanguages = "eng" } = {}) {
    this.language = this.parseLanguages(targetLanguages);
    this.cacheDir = path.resolve(
      process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `models`, `tesseract`)
        : path.resolve(__dirname, `../../../server/storage/models/tesseract`)
    );

    // Ensure the cache directory exists or else Tesseract will persist the cache in the default location.
    if (!fs.existsSync(this.cacheDir))
      fs.mkdirSync(this.cacheDir, { recursive: true });
    this.log(
      `OCRLoader initialized with language support for:`,
      this.language.map((lang) => VALID_LANGUAGE_CODES[lang]).join(", ")
    );
  }

  /**
   * Parses the language code from a provided comma separated string of language codes.
   * @param {string} language - The language code to parse.
   * @returns {string[]} The parsed language code.
   */
  parseLanguages(language = null) {
    try {
      if (!language || typeof language !== "string") return ["eng"];
      const langList = language
        .split(",")
        .map((lang) => (lang.trim() !== "" ? lang.trim() : null))
        .filter(Boolean)
        .filter((lang) => VALID_LANGUAGE_CODES.hasOwnProperty(lang));
      if (langList.length === 0) return ["eng"];
      return langList;
    } catch (e) {
      this.log(`Error parsing languages: ${e.message}`, e.stack);
      return ["eng"];
    }
  }

  log(text, ...args) {
    console.log(`\x1b[36m[OCRLoader]\x1b[0m ${text}`, ...args);
  }

  /**
   * Loads a PDF file and returns an array of documents.
   * This function is reserved to parsing for SCANNED documents - digital documents are not supported in this function
   * @param {string} filePath - The path to the PDF file.
   * @param {Object} options - The options for the OCR.
   * @param {number} options.maxExecutionTime - The maximum execution time of the OCR in milliseconds.
   * @param {number} options.batchSize - The number of pages OCRed per batch.
   * @param {number|null} options.maxWorkers - The number of concurrent OCR workers.
   * @param {number[]|null} options.pageNumbers - Specific 1-indexed pages to OCR. When null, every page is OCRed.
   * @returns {Promise<{pageContent: string, metadata: object}[]>} An array of documents with page content and metadata.
   */
  async ocrPDF(
    filePath,
    {
      maxExecutionTime = 300_000,
      batchSize = 10,
      maxWorkers = null,
      pageNumbers = null,
    } = {}
  ) {
    if (
      !filePath ||
      !fs.existsSync(filePath) ||
      !fs.statSync(filePath).isFile()
    ) {
      this.log(`File ${filePath} does not exist. Skipping OCR.`);
      return [];
    }

    const documentTitle = path.basename(filePath);
    this.log(`Starting OCR of ${documentTitle}`);

    let pdfDocument, pdfjs, buffer;
    try {
      pdfjs = await import("pdf-parse/lib/pdf.js/v2.0.550/build/pdf.js");
      buffer = fs.readFileSync(filePath);
      pdfDocument = await pdfjs.getDocument({ data: buffer }).promise;
    } catch (e) {
      this.log(
        `Failed to open ${documentTitle} for OCR - file may be corrupt, password-protected, or not a valid PDF. ${e.message}`
      );
      return [];
    }

    const documents = [];
    const meta = await pdfDocument.getMetadata().catch(() => null);
    const metadata = {
      source: filePath,
      pdf: {
        version: "v2.0.550",
        info: meta?.info,
        metadata: meta?.metadata,
        totalPages: pdfDocument.numPages,
      },
    };

    const BATCH_SIZE = batchSize;
    const MAX_EXECUTION_TIME = maxExecutionTime;
    const NUM_WORKERS = maxWorkers ?? Math.min(os.cpus().length, 4);
    const totalPages = pdfDocument.numPages;
    const targetPages =
      Array.isArray(pageNumbers) && pageNumbers.length > 0
        ? [...new Set(pageNumbers)]
            .filter(
              (num) => Number.isInteger(num) && num >= 1 && num <= totalPages
            )
            .sort((a, b) => a - b)
        : Array.from({ length: totalPages }, (_, i) => i + 1);

    let pdfSharp, workerPool;
    try {
      pdfSharp = new PDFSharp({
        validOps: [
          pdfjs.OPS.paintJpegXObject,
          pdfjs.OPS.paintImageXObject,
          pdfjs.OPS.paintInlineImageXObject,
        ],
      });
      await pdfSharp.init();

      const { createWorker, OEM } = require("tesseract.js");
      workerPool = await Promise.all(
        Array(NUM_WORKERS)
          .fill(0)
          .map(() =>
            createWorker(this.language, OEM.LSTM_ONLY, {
              cachePath: this.cacheDir,
            })
          )
      );
    } catch (e) {
      this.log(`Failed to bootstrap OCR workers for ${documentTitle}. ${e.message}`);
      return [];
    }

    const startTime = Date.now();
    try {
      this.log("Bootstrapping OCR completed successfully!", {
        MAX_EXECUTION_TIME_MS: MAX_EXECUTION_TIME,
        BATCH_SIZE,
        MAX_CONCURRENT_WORKERS: NUM_WORKERS,
        TOTAL_PAGES: totalPages,
        PAGES_TO_OCR: targetPages.length,
      });
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              `OCR job took too long to complete (${
                MAX_EXECUTION_TIME / 1000
              } seconds)`
            )
          );
        }, MAX_EXECUTION_TIME);
      });

      const processPages = async () => {
        for (
          let batchStart = 0;
          batchStart < targetPages.length;
          batchStart += BATCH_SIZE
        ) {
          const batchPages = targetPages.slice(
            batchStart,
            batchStart + BATCH_SIZE
          );
          this.log(
            `Working on pages ${batchPages[0]} - ${
              batchPages[batchPages.length - 1]
            }`
          );

          const pageQueue = [...batchPages];
          const results = [];
          const workerPromises = workerPool.map(async (worker, workerIndex) => {
            while (pageQueue.length > 0) {
              const pageNum = pageQueue.shift();
              this.log(
                `\x1b[34m[Worker ${
                  workerIndex + 1
                }]\x1b[0m assigned pg${pageNum}`
              );
              const page = await pdfDocument.getPage(pageNum);
              const imageBuffer = await pdfSharp.pageToBuffer({ page });
              if (!imageBuffer) continue;
              const { data } = await worker.recognize(imageBuffer, {}, "text");
              this.log(
                `✅ \x1b[34m[Worker ${
                  workerIndex + 1
                }]\x1b[0m completed pg${pageNum}`
              );
              results.push({
                pageContent: data.text,
                metadata: {
                  ...metadata,
                  loc: { pageNumber: pageNum },
                },
              });
            }
          });

          await Promise.all(workerPromises);
          documents.push(
            ...results.sort(
              (a, b) => a.metadata.loc.pageNumber - b.metadata.loc.pageNumber
            )
          );
        }
        return documents;
      };

      await Promise.race([timeoutPromise, processPages()]);
    } catch (e) {
      this.log(`Error: ${e.message}`, e.stack);
    } finally {
      global.Image = undefined;
      await Promise.all(workerPool.map((worker) => worker.terminate()));
    }

    this.log(`Completed OCR of ${documentTitle}!`, {
      documentsParsed: documents.length,
      totalPages: totalPages,
      executionTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
    });
    return documents;
  }

  /**
   * Loads an image file and returns the OCRed text.
   * @param {string} filePath - The path to the image file.
   * @param {Object} options - The options for the OCR.
   * @param {number} options.maxExecutionTime - The maximum execution time of the OCR in milliseconds.
   * @returns {Promise<string>} The OCRed text.
   */
  async ocrImage(filePath, { maxExecutionTime = 300_000 } = {}) {
    let content = "";
    let worker = null;
    if (
      !filePath ||
      !fs.existsSync(filePath) ||
      !fs.statSync(filePath).isFile()
    ) {
      this.log(`File ${filePath} does not exist. Skipping OCR.`);
      return null;
    }

    const documentTitle = path.basename(filePath);
    try {
      this.log(`Starting OCR of ${documentTitle}`);
      const startTime = Date.now();
      const { createWorker, OEM } = require("tesseract.js");
      worker = await createWorker(this.language, OEM.LSTM_ONLY, {
        cachePath: this.cacheDir,
      });

      // Race the timeout with the OCR
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              `OCR job took too long to complete (${
                maxExecutionTime / 1000
              } seconds)`
            )
          );
        }, maxExecutionTime);
      });

      const processImage = async () => {
        const { data } = await worker.recognize(filePath, {}, "text");
        content = data.text;
      };

      await Promise.race([timeoutPromise, processImage()]);
      this.log(`Completed OCR of ${documentTitle}!`, {
        executionTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      });

      return content;
    } catch (e) {
      this.log(`Error: ${e.message}`);
      return null;
    } finally {
      //eslint-disable-next-line
      if (!worker) return;
      await worker.terminate();
    }
  }
}

/**
 * Converts a PDF page to a buffer using Sharp.
 * @param {Object} options - The options for the Sharp PDF page object.
 * @param {Object} options.page - The PDFJS page proxy object.
 * @returns {Promise<Buffer>} The buffer of the page.
 */
class PDFSharp {
  constructor({ validOps = [] } = {}) {
    this.sharp = null;
    this.validOps = validOps;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[PDFSharp]\x1b[0m ${text}`, ...args);
  }

  async init() {
    this.sharp = (await import("sharp")).default;
  }

  /**
   * Unpacks a bit-packed 1-bit-per-pixel (bitonal) image buffer into a
   * standard 1-byte-per-pixel grayscale buffer (0 = black, 255 = white).
   * @param {Uint8Array} data - The bit-packed image data.
   * @param {number} width - The image width in pixels.
   * @param {number} height - The image height in pixels.
   * @param {number} rowBytes - The number of bytes per row (width bits, padded to a byte boundary).
   * @returns {Uint8Array} The unpacked grayscale buffer.
   */
  unpackBitonal(data, width, height, rowBytes) {
    const out = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const byte = data[y * rowBytes + (x >> 3)];
        const bit = (byte >> (7 - (x & 7))) & 1;
        out[y * width + x] = bit ? 255 : 0;
      }
    }
    return out;
  }

  /**
   * Converts a PDF page to a buffer.
   * @param {Object} options - The options for the Sharp PDF page object.
   * @param {Object} options.page - The PDFJS page proxy object.
   * @returns {Promise<Buffer>} The buffer of the page.
   */
  async pageToBuffer({ page }) {
    if (!this.sharp) await this.init();
    try {
      this.log(`Converting page ${page.pageNumber} to image...`);
      const ops = await page.getOperatorList();
      const pageImages = ops.fnArray.length;

      for (let i = 0; i < pageImages; i++) {
        try {
          if (!this.validOps.includes(ops.fnArray[i])) continue;

          const name = ops.argsArray[i][0];
          const img = await page.objs.get(name);
          const { width, height } = img;
          const size = img.data.length;
          let channels = size / width / height;
          let pixelData = img.data;

          // Some scanned/faxed documents (common for signed government PDFs)
          // embed images as bitonal (1-bit-per-pixel, bit-packed) data rather than
          // one byte per pixel per channel. `channels` won't be a whole number in
          // that case and sharp will reject the raw buffer outright, so unpack the
          // bits into a standard 1-byte-per-pixel grayscale buffer first.
          if (!Number.isInteger(channels) || channels < 1 || channels > 4) {
            const rowBytes = Math.ceil(width / 8);
            if (size === rowBytes * height) {
              pixelData = this.unpackBitonal(img.data, width, height, rowBytes);
              channels = 1;
            } else {
              this.log(
                `Skipping unsupported image on page ${page.pageNumber} (size=${size}, width=${width}, height=${height})`
              );
              continue;
            }
          }

          const targetDPI = 70;
          const targetWidth = Math.floor(width * (targetDPI / 72));
          const targetHeight = Math.floor(height * (targetDPI / 72));

          const image = this.sharp(pixelData, {
            raw: { width, height, channels },
            density: targetDPI,
          })
            .resize({
              width: targetWidth,
              height: targetHeight,
              fit: "fill",
            })
            .withMetadata({
              density: targetDPI,
              resolution: targetDPI,
            })
            .png();

          // For debugging purposes
          // await image.toFile(path.resolve(__dirname, `../../storage/`, `pg${page.pageNumber}.png`));
          return await image.toBuffer();
        } catch (error) {
          this.log(`Iteration error: ${error.message}`, error.stack);
          continue;
        }
      }
      this.log(`No valid images found on page ${page.pageNumber}`);
      return null;
    } catch (error) {
      this.log(`Error: ${error.message}`, error.stack);
      return null;
    }
  }
}

module.exports = OCRLoader;
