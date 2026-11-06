/* eslint-env jest */
const later = require("@breejs/later");
const { ScheduledJob } = require("../../models/scheduledJob");

function runWeekdays(cron) {
  const runs = later
    .schedule(ScheduledJob.parseCron(cron))
    .next(14, new Date("2026-11-02T00:00:00Z"));
  return [...new Set(runs.map((run) => run.getUTCDay()))].sort((a, b) => a - b);
}

describe("ScheduledJob.parseCron", () => {
  it("reads weekday 7 as Sunday, alone, in a list and at the end of a range", () => {
    expect(runWeekdays("0 9 * * 7")).toEqual([0]);
    expect(runWeekdays("0 9 * * 1,7")).toEqual([0, 1]);
    expect(runWeekdays("0 9 * * 5-7")).toEqual([0, 5, 6]);
    expect(runWeekdays("0 9 * * 1-7")).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("leaves other day-of-week fields as they are", () => {
    expect(runWeekdays("0 9 * * 0")).toEqual([0]);
    expect(runWeekdays("0 9 * * MON-FRI")).toEqual([1, 2, 3, 4, 5]);
    expect(runWeekdays("0 9 * * */7")).toEqual([0]);
  });
});

describe("ScheduledJob.computeNextRunAt", () => {
  it("schedules a weekday 7 job on a Sunday", () => {
    expect(ScheduledJob.computeNextRunAt("0 9 * * 7").getUTCDay()).toBe(0);
  });
});
