/* eslint-env jest */
// Regression tests for https://github.com/Mintplex-Labs/anything-llm/issues/6659
// The create-scheduled-job approval request must carry the job's prompt —
// not just name/schedule/tools — so the approver can review what the job
// will run unattended before it is scheduled.

jest.mock("../../../../../../models/scheduledJob", () => ({
  ScheduledJob: {
    availableTools: jest.fn(async () => []),
    isValidCron: jest.fn(() => true),
    canActivate: jest.fn(async () => ({ allowed: true, limit: 10 })),
    create: jest.fn(async (data) => ({
      job: { id: 1, name: data.name, nextRunAt: null },
      error: null,
    })),
  },
}));
jest.mock("../../../../../../utils/BackgroundWorkers", () => ({
  BackgroundService: jest.fn().mockImplementation(() => ({
    addScheduledJob: jest.fn(),
  })),
}));
jest.mock("../../../../../../utils/userLocale", () => ({
  UserMetaCache: {
    get: jest.fn(() => ({ timezone: "UTC" })),
  },
}));

const { ScheduledJob } = require("../../../../../../models/scheduledJob");

const {
  createScheduledJob,
} = require("../../../../../../utils/agents/aibitat/plugins/create-scheduled-job/index.js");

function setupPlugin() {
  const requests = [];
  const aibitat = {
    introspect: jest.fn(),
    handlerProps: { log: jest.fn(), invocation: { user_id: 1 } },
    requestToolApproval: jest.fn(async (req) => {
      requests.push(req);
      return { approved: true };
    }),
    function: (config) => (aibitat._fn = config),
  };
  createScheduledJob.plugin.call(createScheduledJob).setup(aibitat);
  const handler = aibitat._fn.handler.bind(aibitat._fn);
  return { handler, requests };
}

describe("create-scheduled-job approval payload", () => {
  test("includes the job prompt", async () => {
    const { handler, requests } = setupPlugin();
    await handler({
      name: "Weekday inbox summary",
      prompt: "Summarize my unread inbox emails and send me a summary email.",
      schedule: "0 9 * * 1-5",
    });
    expect(requests).toHaveLength(1);
    expect(requests[0].payload).toEqual({
      name: "Weekday inbox summary",
      schedule: "0 9 * * 1-5",
      prompt: "Summarize my unread inbox emails and send me a summary email.",
      tools: [],
    });
    expect(ScheduledJob.create).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: "Summarize my unread inbox emails and send me a summary email.",
      })
    );
  });
});
