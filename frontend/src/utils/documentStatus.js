export const DOCUMENT_JOB_STATUSES = [
  "PENDING",
  "DOWNLOADING",
  "CHUNKING",
  "EMBEDDING",
  "INDEXING",
  "READY",
  "FAILED",
];

export const DOCUMENT_STATUS_LABELS = {
  PENDING: "Pending",
  DOWNLOADING: "Downloading",
  CHUNKING: "Chunking",
  EMBEDDING: "Embedding",
  INDEXING: "Indexing",
  READY: "Ready",
  FAILED: "Failed",
};

export function isProcessingStatus(status) {
  return (
    status &&
    !["READY", "FAILED"].includes(status.toUpperCase()) &&
    DOCUMENT_JOB_STATUSES.includes(status.toUpperCase())
  );
}
