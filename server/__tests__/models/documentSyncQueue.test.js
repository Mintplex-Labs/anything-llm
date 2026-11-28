const mockSyncDocumentSyncJob = jest.fn().mockResolvedValue(undefined);

jest.mock("../../utils/BackgroundWorkers", () => ({
  BackgroundService: jest.fn().mockImplementation(() => ({
    syncDocumentSyncJob: mockSyncDocumentSyncJob,
  })),
}));

const { DocumentSyncQueue } = require("../../models/documentSyncQueue");

const DEFAULT_STALE_AFTER = 604800000; // 7 days in MS
const MIN_STALE_AFTER = 3600000; // 1 hour in MS

describe("DocumentSyncQueue.defaultStaleAfter", () => {
  const ORIGINAL_ENV = process.env.DOCUMENT_SYNC_STALE_AFTER_MS;

  afterEach(() => {
    if (ORIGINAL_ENV === undefined)
      delete process.env.DOCUMENT_SYNC_STALE_AFTER_MS;
    else process.env.DOCUMENT_SYNC_STALE_AFTER_MS = ORIGINAL_ENV;
  });

  it("defaults to 7 days when the env var is unset", () => {
    delete process.env.DOCUMENT_SYNC_STALE_AFTER_MS;
    expect(DocumentSyncQueue.defaultStaleAfter).toBe(DEFAULT_STALE_AFTER);
  });

  it("uses a valid env value (e.g. 1 day)", () => {
    process.env.DOCUMENT_SYNC_STALE_AFTER_MS = "86400000";
    expect(DocumentSyncQueue.defaultStaleAfter).toBe(86400000);
  });

  it("clamps values below the 1 hour minimum", () => {
    process.env.DOCUMENT_SYNC_STALE_AFTER_MS = "60000"; // 1 minute
    expect(DocumentSyncQueue.defaultStaleAfter).toBe(MIN_STALE_AFTER);
  });

  it("falls back to the default for non-numeric values", () => {
    process.env.DOCUMENT_SYNC_STALE_AFTER_MS = "not-a-number";
    expect(DocumentSyncQueue.defaultStaleAfter).toBe(DEFAULT_STALE_AFTER);
  });

  it("falls back to the default for non-positive values", () => {
    process.env.DOCUMENT_SYNC_STALE_AFTER_MS = "0"; // 1 minute
    expect(DocumentSyncQueue.defaultStaleAfter).toBe(DEFAULT_STALE_AFTER);

    process.env.DOCUMENT_SYNC_STALE_AFTER_MS = "-5000";
    expect(DocumentSyncQueue.defaultStaleAfter).toBe(DEFAULT_STALE_AFTER);
  });
});

describe("DocumentSyncQueue.bootWorkers/killWorkers", () => {
  beforeEach(() => {
    mockSyncDocumentSyncJob.mockClear();
    mockSyncDocumentSyncJob.mockResolvedValue(undefined);
  });

  it("routes bootWorkers to syncDocumentSyncJob(true)", async () => {
    await DocumentSyncQueue.bootWorkers();
    expect(mockSyncDocumentSyncJob).toHaveBeenCalledTimes(1);
    expect(mockSyncDocumentSyncJob).toHaveBeenCalledWith(true);
  });

  it("routes killWorkers to syncDocumentSyncJob(false)", async () => {
    await DocumentSyncQueue.killWorkers();
    expect(mockSyncDocumentSyncJob).toHaveBeenCalledTimes(1);
    expect(mockSyncDocumentSyncJob).toHaveBeenCalledWith(false);
  });
});
