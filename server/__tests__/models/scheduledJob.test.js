/* eslint-env jest */
const mockPrisma = {
  scheduled_jobs: {
    findFirst: jest.fn(),
    update: jest.fn(async ({ data }) => ({ id: 1, ...data })),
  },
};
jest.mock("../../utils/prisma", () => mockPrisma);

const { ScheduledJob } = require("../../models/scheduledJob");

describe("ScheduledJob.update", () => {
  test("turning a job back on moves its next run past the current time", async () => {
    mockPrisma.scheduled_jobs.findFirst.mockResolvedValue({
      id: 1,
      schedule: "0 9 * * *",
      enabled: false,
      nextRunAt: new Date("2020-01-01T09:00:00Z"),
    });

    const { job } = await ScheduledJob.update(1, { enabled: true });

    expect(job.enabled).toBe(true);
    expect(job.nextRunAt).toBeInstanceOf(Date);
    expect(job.nextRunAt.getTime()).toBeGreaterThan(Date.now());
  });
});
