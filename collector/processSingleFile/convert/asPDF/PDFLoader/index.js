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

      let text = '';

      const content = await page.getTextContent();

      if (content.items.length !== 0) {
        let lastY;
        let isNewLine = true; // 개행 이후 첫 문자열을 확인하는 변수
        let isEncoded = content.items.some(item => "str" in item && item.str.includes("{LF}")); // 문서가 인코딩되었는지 판별
        const textItems = [];
        for (const item of content.items) {
          if ("str" in item) {
            if (isEncoded) {
              // 기존에 인코딩된 문서 처리
              let processedStr = item.str.replace(/{LF}/g, "\n");
              
              if (isNewLine) {
                  textItems.push(processedStr); // 개행 후 첫 문자열은 그대로 추가
              } else {
                  textItems.push(" " + processedStr); // 이후 문자열은 앞에 공백 추가
              }
  
              // 마지막 줄바꿈이 포함되어 있다면 다음 문자는 첫 번째 단어가 됨
              isNewLine = processedStr.includes("\n");
  
            } else {
              // 인코딩된 줄바꿈이 없는 일반 문서 처리
              if (lastY === item.transform[5] || !lastY) {
                textItems.push(item.str);
              } else {
                textItems.push(`\n${item.str}`);
              }
              lastY = item.transform[5];
            }
          }
        }
        text = textItems.join("");
      }

      if (content.items.length === 0 || !text.trim()) {
        try {
          await this.loader.parsePageToImage(pageNum);
          text = await this.loader.loadPage(pageNum, true);
          
          if (!text || !text.trim().length) {
            return null;
          }
        } catch (error) {
          console.error(`[Page ${pageNum}] OCR processing error:`, error);
          return null;
        }
      }

      return {
        pageContent: text.trim(),
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
