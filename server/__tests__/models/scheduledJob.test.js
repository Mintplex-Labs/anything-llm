/* eslint-env jest */
const later = require("@breejs/later");

jest.mock("../../utils/prisma", () => ({
  scheduled_jobs: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
}));

const prisma = require("../../utils/prisma");
const { ScheduledJob } = require("../../models/scheduledJob");

const cron = "0 9 1 * 1";

beforeEach(() => {
  jest.useFakeTimers({ now: new Date("2026-11-16T00:00:00Z") });
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

it("computes the next run when either restricted day field matches", () => {
  expect(ScheduledJob.isValidCron(cron)).toBe(true);
  expect(ScheduledJob.computeNextRunAt(cron)).toEqual(
    new Date("2026-11-16T09:00:00Z")
  );
});

it("recomputes a stored job using its existing cron expression", async () => {
  prisma.scheduled_jobs.findFirst.mockResolvedValue({ id: 1, schedule: cron });

  await ScheduledJob.recomputeNextRunAt(1);

  expect(prisma.scheduled_jobs.update).toHaveBeenCalledWith({
    where: { id: 1 },
    data: {
      nextRunAt: new Date("2026-11-16T09:00:00Z"),
      updatedAt: new Date("2026-11-16T00:00:00Z"),
    },
  });
});

it("fires once on an overlap and also runs on weekdays and dates that match alone", () => {
  jest.setSystemTime(new Date("2026-11-01T00:00:00Z"));
  const run = jest.fn(() => new Date().toISOString());
  const schedule = ScheduledJob.parseCron("15 8 1,5 12 1-2");
  const timer = later.setInterval(run, schedule);

  try {
    jest.advanceTimersByTime(new Date("2026-12-08T08:15:00Z") - Date.now());
    expect(run.mock.results.map(({ value }) => value)).toEqual([
      "2026-12-01T08:15:00.000Z", // Both
      "2026-12-05T08:15:00.000Z", // Day of month
      "2026-12-07T08:15:00.000Z", // Weekday
      "2026-12-08T08:15:00.000Z",
    ]);
  } finally {
    timer.clear();
  }
});

it.each([
  ["0 9 * * *", "2026-11-16T09:00:00Z"],
  ["0 9 * * 1", "2026-11-16T09:00:00Z"],
  ["0 9 1 * *", "2026-12-01T09:00:00Z"],
  ["0 9 */2 * 1", "2026-11-23T09:00:00Z"],
  ["0 9 1 * */2", "2026-12-01T09:00:00Z"],
  ["0 9 1 * 7", "2026-11-22T09:00:00Z"],
])("computes the next run of %s as %s", (expression, nextRun) => {
  expect(ScheduledJob.computeNextRunAt(expression)).toEqual(new Date(nextRun));
});
