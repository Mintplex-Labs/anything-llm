/**
 * Đuôi file có thể xem trước (khớp với danh sách PREVIEWABLE ở backend
 * server/utils/files/documentPreview.js). File khác chỉ tải xuống.
 */
export const PREVIEWABLE_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "ppt",
  "pptx",
  "txt",
  "rtf",
  "odt",
  "ods",
  "odp",
]);
