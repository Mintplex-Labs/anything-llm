const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const axios = require("axios");
// const mupdfjs = require("mupdf/mupdfjs");
// const mupdfjs = import("mupdf/mupdfjs"); 
// import * as mupdfjs from "mupdf/mupdfjs"

class PdfOcrLoader {
    /**
     * 생성자
     * 
     * @param {string} pdfPath - 분석할 PDF 파일의 절대 경로
     * @throws {Error} - 제공된 경로에 PDF 파일이 없을 경우
     */
    constructor(pdfPath) {
        if (!fs.existsSync(pdfPath)) {
            throw new Error("❌ PDF 파일을 찾을 수 없습니다.");
        }
        this.pdfPath = pdfPath;
        // this.document = mupdfjs.PDFDocument.openDocument(fs.readFileSync(this.pdfPath), "application/pdf");
        // this.numPages = this.document.countPages();
        // console.log(`📄 ${pdfPath}: 총 ${this.numPages} 페이지 확인`);
        // this.outputDir = this.parseToImage();
    }

    /**
     * PdfOcrLoader 인스턴스를 초기화하는 async 팩토리 함수.
     * mupdf 모듈을 로드하고 문서를 초기화한 후 인스턴스를 반환합니다.
     *
     * @param {string} pdfPath
     * @returns {Promise<PdfOcrLoader>}
     */
    static async create(pdfPath) {
        const loader = new PdfOcrLoader(pdfPath);
        loader.mupdfjs = await import("mupdf/mupdfjs");
        loader.document = loader.mupdfjs.PDFDocument.openDocument(
            fs.readFileSync(loader.pdfPath),
            "application/pdf"
        );
        loader.numPages = loader.document.countPages();
        console.log(`📄 ${pdfPath}: 총 ${loader.numPages} 페이지 확인`);
        loader.outputDir = loader._createOutputDir();
        return loader;
    }

        /**
     * PDF 파일 경로로부터 출력 디렉토리 경로를 생성하고 디렉토리를 만듭니다.
     * 
     * @returns {string} outputDir - 생성된 디렉토리 경로
     * @private
     */
    _createOutputDir() {
        const { dir, name } = path.parse(this.pdfPath);
        const outputDir = path.join(dir, name);
        fs.ensureDirSync(outputDir);
        console.log(`📂 출력 디렉토리 생성: ${outputDir}`);
        return outputDir;
    }

    /**
     * 단일 PDF 페이지를 이미지로 변환
     * 
     * @param {number} pageIndex - 변환할 페이지 인덱스 (1-based)
     * @param {number} [scaleFactor=2.0] - 생성할 이미지의 해상도 스케일 팩터
     * @returns {string} outputPath - 생성된 이미지 파일 경로
     */
    parsePageToImage(pageIndex, scaleFactor = 2.0) {
        const highResMatrix = this.mupdfjs.Matrix.scale(scaleFactor, scaleFactor);
        let page = new this.mupdfjs.PDFPage(this.document, pageIndex - 1);
        let pixmap = page.toPixmap(highResMatrix, this.mupdfjs.ColorSpace.DeviceRGB, false, true);
        let pngImage = pixmap.asPNG();
        const outputPath = path.join(this.outputDir, `${pageIndex}.png`);
        fs.writeFileSync(outputPath, pngImage);
        console.log(`✅ 페이지 ${pageIndex} 변환 완료: ${outputPath}`);
        return outputPath;
    }

    /**
     * PDF 페이지를 이미지로 변환하여 추출
     * 제공된 PDF 파일 경로에 동일한 basename으로 디렉토리를 생성한 후,
     * 각 페이지 인덱스를 파일명으로 하는 PNG 이미지 파일을 생성.
     * 
     * 예)
     *   입력: /home/test/1.pdf
     *   출력: 디렉토리 /home/test/1 생성 및
     *         /home/test/1/1.png, 
     *         /home/test/1/2.png, ... 파일 생성
     * 
     * @param {number} [scaleFactor=2.0] - 생성할 이미지의 해상도 스케일 팩터
     */
    parseToImage(scaleFactor = 2.0) {
        for (let i = 1; i <= this.numPages; i++) {
            this.parsePageToImage(i, scaleFactor);
        }
    }

    /**
     * 이미지 전처리(회전) 수행
     * 기존 이미지 파일명에 `_deskew` 를 추가하여 새로운 파일을 생성.
     *
     * 입력:
     *   - imagePath: 전처리할 이미지 파일의 절대 경로 (예: "/home/test/1/1.png")
     *
     * 출력:
     *   - 처리된 이미지 파일의 경로를 반환합니다 (예: "/home/test/1/1_deskew.png")
     *
     * 에러:
     *   - 이미지 전처리(Deskew) 작업 중 오류가 발생하면, 해당 에러를 reject 합니다.
     *
     * 예시:
     *   입력: /home/test/1/1.png
     *   출력: /home/test/1/1_deskew.png
     *
     * @param {string} imagePath - 전처리할 이미지 파일의 경로
     * @returns {Promise<string>} - 전처리(Deskew) 처리된 이미지 파일 경로를 resolve 하는 Promise
     * @throws {Error} - 전처리 작업 실패 시 reject 되는 에러
     */
    deskewImage(imagePath) {
        return new Promise((resolve, reject) => {
            const deskewOutputPath = imagePath.replace(/\.png$/, "_deskew.png");
            console.log(`🖼️ Deskew 처리 중: ${imagePath}`);

            const command = `convert "${imagePath}" -auto-orient -deskew 40% "${deskewOutputPath}"`;
            exec(command, (error) => {
                if (error) {
                    console.error(`⚠️ Deskew 오류: ${error.message}`);
                    reject(error);
                } else {
                    console.log(`✅ Deskew 완료: ${deskewOutputPath}`);
                    resolve(deskewOutputPath);
                }
            });
        });
    }

    /**
     * CLOVA OCR API를 호출하여 이미지 내의 텍스트를 인식.
     * 
     * 입력:
     *   - imagePath: OCR 처리를 위한 이미지 파일의 절대 경로
     * 
     * 처리:
     *   - 이미지를 Base64 인코딩한 후, CLOVA OCR API로 전송합니다.
     * 
     * 출력:
     *   - API의 응답으로 받은 JSON 데이터를 반환합니다.
     * 
     * 에러:
     *   - API 요청 중 오류가 발생하면, 해당 에러를 throw 합니다.
     *
     * @param {string} imagePath - OCR 처리를 위한 이미지 파일의 경로
     * @returns {Promise<Object>} - OCR API 응답 JSON 데이터
     * @throws {Error} - API 호출 실패 시 throw 되는 에러
     */
    async requestOcrImage(imagePath) {
        try {
            const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
            const dirName = path.basename(path.dirname(imagePath));
            const baseName = path.basename(imagePath);
            const imageName = `${dirName}/${baseName}`;

            const requestBody = {
                images: [{
                    format: path.extname(imagePath).substring(1),
                    name: imageName,
                    data: imageData,
                    url: null
                }],
                lang: "ko",
                requestId: "request_" + Date.now(),
                resultType: "string",
                timestamp: Date.now(),
                version: "V2",
                enableTableDetection: false
            };

            const response = await axios.post(
                'https://l0rqyl5f8i.apigw.ntruss.com/custom/v1/37668/4e5993205efdff207e406f55960e71fb292f26df286a4d4850959d3af525efd8/general',
                requestBody,
                {
                    headers: {
                        'X-OCR-SECRET': 'VmhFa1NxTHNlUFBad2VWaXhsZWV1RnVTTlZDZUpkeVQ=',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error requesting OCR:', error);
            throw error;
        }
    }

    /**
     * CLOVA OCR API 응답 JSON 데이터에서 핵심 텍스트만 추출.
     * 
     * 입력:
     *   - jsonData: CLOVA OCR API로부터 반환된 JSON 데이터
     * 
     * 처리:
     *   - 각 이미지의 필드에서 inferText 값을 추출하며, 
     *     lineBreak 플래그에 따라 개행문자를 추가합니다.
     * 
     * 출력:
     *   - 추출된 텍스트 문자열을 반환합니다.
     * 
     * 에러:
     *   - 유효하지 않은 JSON 데이터가 입력되면, 에러를 throw 합니다.
     *
     * @param {Object} jsonData - CLOVA OCR API 응답 JSON 데이터
     * @returns {string} - 추출된 텍스트 문자열
     * @throws {Error} - 입력 JSON 데이터가 유효하지 않을 경우
     */
    parseOcrResponse(jsonData) {
        if (!jsonData || !jsonData.images || !Array.isArray(jsonData.images)) {
            throw new Error("Invalid JSON data");
        }

        let result = "";
        jsonData.images.forEach(image => {
            if (image.fields && Array.isArray(image.fields)) {
                image.fields.forEach(field => {
                    if (field.inferText && typeof field.inferText === "string") {
                        result += field.inferText;
                        result += field.lineBreak ? "\n" : " ";
                    }
                });
            }
        });
        return result.trim();
    }

    /**
     * PDF 파일 단일 페이지에 대해 OCR 수행
     * 
     * @param {number} page - 처리할 페이지 번호
     * @param {boolean} [debug=false] - 파일 생성 및 로그 출력 여부
     * @returns {Promise<string>} - OCR을 통해 추출된 텍스트 데이터
     * @throws {Error} - 처리 과정 중 발생한 에러
     */
    async loadPage(page, debug=false){
        const imagePath = path.join(this.outputDir, `${page}.png`)

        const deskewedImage = await this.deskewImage(imagePath);
        const ocrResponse = await this.requestOcrImage(deskewedImage);
        const parsedText = this.parseOcrResponse(ocrResponse);
        if (debug) {
            const jsonOutputPath = imagePath.replace(/\.png$/, ".json");
            fs.writeFileSync(jsonOutputPath, JSON.stringify(ocrResponse, null, 2));
            console.log(`✅ OCR 응답 저장 완료: ${jsonOutputPath}`);

            // 디버깅을 위해 파싱된 텍스트 파일에 저장
            const txtOutputPath = imagePath.replace(/\.png$/, ".txt");
            fs.writeFileSync(txtOutputPath, parsedText);
            console.log(`✅ 파싱 텍스트 저장 완료: ${txtOutputPath}`);
        }

        return parsedText
    }

    /**
     * PDF 파일에 대한 OCR 처리 파이프라인을 수행.
     * 
     * 처리 단계:
     *   1. 각 페이지별로 아래 순차적 작업 수행:
     *        a. 이미지 전처리(Deskew): deskewImage
     *        b. CLOVA OCR API 호출: requestOcrImage
     *        c. OCR 응답 JSON에서 텍스트 추출: parseOcrResponse
     *   2. 동시에 최대 5개의 페이지에 대해 OCR API 호출을 진행 (concurrency 제한)
     * 
     * 출력:
     *   - 모든 페이지에 대해 추출된 텍스트를 개행 문자로 연결한 최종 문자열을 반환.
     *
     * @param {boolean} [debug=false] - 파일 생성 및 로그 출력 여부
     * @returns {Promise<string>} - 전체 페이지의 OCR 결과가 합쳐진 문자열
     * @throws {Error} - 처리 과정 중 발생한 에러
     */
    async load(debug=false) {
        const imagePaths = [];
        for (let i = 1; i <= this.numPages; i++) {
            imagePaths.push(path.join(this.outputDir, `${i}.png`));
        }
        // 1. OCR 요청 동시 실행
        const concurrencyLimit = 5;
        let currentIndex = 0;
        const results = new Array(imagePaths.length);
        const self = this;

        async function worker() {
            while (currentIndex < imagePaths.length) {
                const index = currentIndex++;
                const imagePath = imagePaths[index];
                try {
                    // a. 이미지 전처리 (Deskew)
                    const deskewedImage = await self.deskewImage(imagePath);
                    // b. CLOVA OCR API 호출
                    const ocrResponse = await self.requestOcrImage(deskewedImage);
                    // c. OCR 결과 파싱
                    const parsedText = self.parseOcrResponse(ocrResponse);
                    
                    results[index] = parsedText;

                    if (debug) {
                        const jsonOutputPath = imagePath.replace(/\.png$/, ".json");
                        fs.writeFileSync(jsonOutputPath, JSON.stringify(ocrResponse, null, 2));
                        console.log(`✅ OCR 응답 저장 완료: ${jsonOutputPath}`);

                        const txtOutputPath = imagePath.replace(/\.png$/, ".txt");
                        fs.writeFileSync(txtOutputPath, parsedText);
                        console.log(`✅ 파싱 텍스트 저장 완료: ${txtOutputPath}`);
                    }

                } catch (error) {
                    const errMsg = `Error processing page ${index + 1}: ${error.message}`;
                    console.error(errMsg);
                    results[index] = errMsg;
                }
            }
        }
        // 2. concurrencyLimit 만큼의 워커 실행
        const workers = [];
        for (let i = 0; i < concurrencyLimit; i++) {
            workers.push(worker());
        }
        await Promise.all(workers);
        // 모든 페이지의 OCR 결과를 합쳐서 반환
        const finalResult = results.join("\n");
        return finalResult;
    }
}

module.exports = PdfOcrLoader;
