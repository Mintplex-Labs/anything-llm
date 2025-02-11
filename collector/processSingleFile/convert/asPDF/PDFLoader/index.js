const fs = require("fs").promises;
const path = require("path");
const os = require("os");  // 임시 폴더 사용 예시
const PdfOcrLoader = require("./pdf-ocr-loader.js");

class PDFLoader {
  constructor(filePath, { splitPages = true } = {}) {
    this.filePath = filePath;
    this.splitPages = splitPages;
    this.loader = null;
  }

  async load() {
    if (!this.loader) {
      this.loader = await PdfOcrLoader.create(this.filePath);
    }

    const buffer = await fs.readFile(this.filePath);
    const { getDocument, version } = await this.getPdfJS();

    const pdf = await getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    }).promise;

    const meta = await pdf.getMetadata().catch(() => null);
    const documents = [];

    // 페이지 번호 배열 생성
    const pageNumbers = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
    
    // 5개씩 동시 처리
    const chunkSize = 5;
    for (let i = 0; i < pageNumbers.length; i += chunkSize) {
      const chunk = pageNumbers.slice(i, i + chunkSize);
      console.log(`Processing pages ${chunk.join(', ')}...`);
      
      const chunkPromises = chunk.map(pageNum => 
        this.processPage(pdf, pageNum, version, meta)
      );
      
      const results = await Promise.all(chunkPromises);
      documents.push(...results.filter(doc => doc !== null));
    }

    if (this.splitPages) {
      return documents;
    }

    if (documents.length === 0) {
      return [];
    }

    return [{
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
    }];
  }

  // 각 페이지 처리를 위한 새로운 메서드
  async processPage(pdf, pageNum, version, meta) {
    try {
      const page = await pdf.getPage(pageNum);
      if (!page) return null;

      const textFromOcr = await this.loader.loadPage(pageNum, true);
      if (!textFromOcr || !textFromOcr.trim().length) {
        return null;
      }

      return {
        pageContent: textFromOcr.trim(),
        metadata: {
          source: this.filePath,
          pdf: {
            version,
            info: meta?.info,
            metadata: meta?.metadata,
            totalPages: pdf.numPages,
          },
          loc: { pageNumber: pageNum },
        },
      };
    } catch (error) {
      console.error(`Error processing page ${pageNum}:`, error);
      return null;
    }
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
