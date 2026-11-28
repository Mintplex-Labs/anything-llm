const { BackgroundService } = require("../../../utils/BackgroundWorkers");

const JOB_NAME = "sync-watched-documents";

function makeFakeBree(registeredJobs = []) {
  return {
    config: { jobs: registeredJobs },
    add: jest.fn().mockResolvedValue(undefined),
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
}

describe("BackgroundService.syncDocumentSyncJob", () => {
  let bgService;

  beforeEach(() => {
    jest.clearAllMocks();
    // BackgroundService is a singleton - reset the per-test state directly.
    bgService = new BackgroundService();
    bgService.bree = null;
    bgService.documentSyncEnabled = false;
  });

  it("adds and starts only the sync job when enabled and not yet registered", async () => {
    const bree = makeFakeBree();
    bgService.bree = bree;

    await bgService.syncDocumentSyncJob(true);

    expect(bree.add).toHaveBeenCalledTimes(1);
    expect(bree.add).toHaveBeenCalledWith(
      expect.objectContaining({ name: JOB_NAME })
    );
    expect(bree.start).toHaveBeenCalledTimes(1);
    expect(bree.start).toHaveBeenCalledWith(JOB_NAME);
    expect(bree.stop).not.toHaveBeenCalled();
    expect(bree.remove).not.toHaveBeenCalled();
    expect(bgService.documentSyncEnabled).toBe(true);
  });

  it("is a no-op when enabled but the sync job is already registered", async () => {
    const bree = makeFakeBree([{ name: JOB_NAME, interval: "1hr" }]);
    bgService.bree = bree;

    await bgService.syncDocumentSyncJob(true);

    expect(bree.add).not.toHaveBeenCalled();
    expect(bree.start).not.toHaveBeenCalled();
    expect(bree.stop).not.toHaveBeenCalled();
    expect(bree.remove).not.toHaveBeenCalled();
    expect(bgService.documentSyncEnabled).toBe(false);
  });

  it("stops and removes only the sync job when disabled", async () => {
    const bree = makeFakeBree([{ name: JOB_NAME, interval: "1hr" }]);
    bgService.bree = bree;

    await bgService.syncDocumentSyncJob(false);

    expect(bree.stop).toHaveBeenCalledTimes(1);
    expect(bree.stop).toHaveBeenCalledWith(JOB_NAME);
    expect(bree.remove).toHaveBeenCalledTimes(1);
    expect(bree.remove).toHaveBeenCalledWith(JOB_NAME);
    expect(bree.add).not.toHaveBeenCalled();
    expect(bree.start).not.toHaveBeenCalled();
    expect(bgService.documentSyncEnabled).toBe(false);
  });

  it("is a no-op when disabled but the sync job is not registered", async () => {
    const bree = makeFakeBree();
    bgService.bree = bree;

    await bgService.syncDocumentSyncJob(false);

    expect(bree.add).not.toHaveBeenCalled();
    expect(bree.start).not.toHaveBeenCalled();
    expect(bree.stop).not.toHaveBeenCalled();
    expect(bree.remove).not.toHaveBeenCalled();
    expect(bgService.documentSyncEnabled).toBe(false);
  });

  it("does not throw in either direction when the service has not been booted", async () => {
    bgService.bree = null;

    await expect(bgService.syncDocumentSyncJob(true)).resolves.toBeUndefined();
    await expect(bgService.syncDocumentSyncJob(false)).resolves.toBeUndefined();
  });
});
