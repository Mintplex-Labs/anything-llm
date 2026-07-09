const path = require("path");
const fs = require("fs");
const os = require("os");
const { execFile } = require("child_process");

/**
 * documentPreview.js
 * ----------------------------------------------------------------------------
 * Chuyển tài liệu do agent tạo (docx/xlsx/pptx/csv/txt...) sang PDF để XEM
 * TRƯỚC inline trong trình duyệt. PDF sẵn có thì trả thẳng (passthrough).
 *
 * - Convert bằng LibreOffice headless (lệnh `libreoffice` hoặc `soffice`).
 *   Đặt biến môi trường SOFFICE_BIN nếu binary nằm ở đường dẫn khác.
 * - File sinh ra có tên UUID cố định (bất biến) nên cache theo tên là an toàn:
 *   chỉ convert 1 lần cho mỗi file. Cache tại storage/preview-cache/.
 *
 * Yêu cầu máy chủ: đã cài LibreOffice.
 *   Ubuntu/Debian : sudo apt-get install -y libreoffice
 *   Docker (alpine): apk add --no-cache libreoffice
 */

const SOFFICE_CANDIDATES = [process.env.SOFFICE_BIN, "libreoffice", "soffice"].filter(Boolean);

// Các đuôi có thể xem trước (được LibreOffice render, hoặc pdf passthrough).
const PREVIEWABLE = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "csv",
  "ppt", "pptx", "txt", "rtf", "odt", "ods", "odp",
]);

function isPreviewable(extension) {
  return PREVIEWABLE.has(String(extension || "").toLowerCase());
}

function storageRoot() {
  // Khớp với cách create-files/lib.js xác định STORAGE_DIR.
  return process.env.STORAGE_DIR || path.resolve(__dirname, "../../../storage");
}

function cacheDir() {
  const dir = path.join(storageRoot(), "preview-cache");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Chạy LibreOffice, thử lần lượt các tên binary khả dĩ. */
function runSoffice(args) {
  return new Promise((resolve, reject) => {
    let i = 0;
    const tryNext = () => {
      if (i >= SOFFICE_CANDIDATES.length) {
        return reject(
          new Error("Không tìm thấy LibreOffice (đặt biến môi trường SOFFICE_BIN).")
        );
      }
      const bin = SOFFICE_CANDIDATES[i++];
      execFile(bin, args, { timeout: 90_000 }, (err) => {
        if (err && err.code === "ENOENT") return tryNext(); // thử binary kế tiếp
        if (err) return reject(err);
        resolve();
      });
    };
    tryNext();
  });
}

/**
 * Trả về đường dẫn PDF để xem trước cho file gốc.
 * @param {string} storagePath - đường dẫn file gốc (từ getGeneratedFile().storagePath)
 * @param {string} filename    - tên file lưu trữ ({type}-{uuid}.{ext})
 * @returns {Promise<string>}  - đường dẫn PDF (đã cache)
 */
async function renderToPdf(storagePath, filename) {
  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (ext === "pdf") return storagePath; // đã là PDF

  const outDir = cacheDir();
  const out = path.join(outDir, filename.replace(/\.[^.]+$/, "") + ".pdf");
  if (fs.existsSync(out)) return out; // cache hit

  // Dùng profile riêng trong /tmp để tránh khoá khi có nhiều request đồng thời.
  const profile = "file://" + path.join(os.tmpdir(), "lo-profile-" + process.pid);

  await runSoffice([
    "--headless",
    "-env:UserInstallation=" + profile,
    "--convert-to", "pdf",
    "--outdir", outDir,
    storagePath,
  ]);

  // LibreOffice đặt tên output theo basename của file nguồn.
  const produced = path.join(
    outDir,
    path.basename(storagePath).replace(/\.[^.]+$/, "") + ".pdf"
  );
  if (produced !== out && fs.existsSync(produced)) fs.renameSync(produced, out);

  if (!fs.existsSync(out)) throw new Error("Convert PDF không tạo ra file output.");
  return out;
}

module.exports = { renderToPdf, isPreviewable, PREVIEWABLE };
