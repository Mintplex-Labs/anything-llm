/* eslint-env jest */
const mockIsMultiUserMode = jest.fn();
const mockStart = jest.fn();

jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: mockIsMultiUserMode },
}));
jest.mock("../../../models/scheduledJobRun", () => ({
  ScheduledJobRun: { start: mockStart },
}));

const { BackgroundService } = require("../../../utils/BackgroundWorkers");

describe("BackgroundService.enqueueScheduledJob", () => {
  const service = new BackgroundService();

  beforeEach(() => {
    jest.clearAllMocks();
    mockStart.mockResolvedValue(null);
    jest.spyOn(service, "removeScheduledJob").mockImplementation(() => {});
  });

  it("starts no run and drops the job's timer in multi-user mode", async () => {
    mockIsMultiUserMode.mockResolvedValue(true);

    await expect(service.enqueueScheduledJob(7)).resolves.toBeNull();
    expect(mockStart).not.toHaveBeenCalled();
    expect(service.removeScheduledJob).toHaveBeenCalledWith(7);
  });

  it("still tries to start a run in single-user mode", async () => {
    mockIsMultiUserMode.mockResolvedValue(false);

    await service.enqueueScheduledJob(7);
    expect(mockStart).toHaveBeenCalledWith(7);
    expect(service.removeScheduledJob).not.toHaveBeenCalled();
  });
});
