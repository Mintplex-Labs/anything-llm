jest.mock("../../utils/prisma", () => ({
  $transaction: jest.fn(),
  scheduled_job_runs: {
    findFirst: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
}));
jest.mock("../../models/scheduledJob", () => ({
  ScheduledJob: { get: jest.fn(), updateRunTimestamps: jest.fn() },
}));
jest.mock("../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn(async () => false) },
}));
jest.mock("@ladjs/graceful", () => jest.fn(), { virtual: true });
jest.mock("@mintplex-labs/bree", () => jest.fn(), { virtual: true });
jest.mock(
  "@breejs/later",
  () => ({
    date: { UTC: jest.fn() },
    parse: { cron: jest.fn() },
    setInterval: jest.fn(() => ({ clear: jest.fn() })),
  }),
  { virtual: true }
);
jest.mock(
  "p-queue",
  () => ({
    default: class {
      constructor() {
        this.tasks = [];
        this.concurrency = 1;
      }
      add(task) {
        this.tasks.push(task);
      }
      clear() {
        this.tasks = [];
      }
    },
  }),
  { virtual: true }
);
jest.mock("../../utils/logger", () => () => ({ info: jest.fn() }));
jest.mock("../../jobs/helpers/index.js", () => ({
  log: jest.fn(),
  conclude: jest.fn(),
}));
jest.mock("../../utils/http", () => ({ safeJsonParse: JSON.parse }));
jest.mock("uuid", () => ({ v4: () => "test-uuid" }), { virtual: true });
jest.mock("../../jobs/helpers/scheduled-job-helper.js", () => ({
  SCHEDULED_JOB_TIMEOUT_MS: 1000,
  sendWebPushNotification: jest.fn(),
  agentActionCb: () => ({
    handler: {},
    thoughts: [],
    toolCalls: [],
    state: {},
  }),
}));
jest.mock("../../utils/agents/ephemeral.js", () => ({
  EphemeralAgentHandler: jest.fn(),
}));

const prisma = require("../../utils/prisma");
const { ScheduledJob } = require("../../models/scheduledJob");
const { ScheduledJobRun } = require("../../models/scheduledJobRun");
const { BackgroundService } = require("../../utils/BackgroundWorkers");
const { EphemeralAgentHandler } = require("../../utils/agents/ephemeral.js");
const { conclude } = require("../../jobs/helpers/index.js");
const Queue = require("p-queue").default;
const { EventEmitter } = require("events");

let rows;
let jobs;
let service;
let tasks;
let runWorker;
const matches = (row, where) =>
  Object.entries(where).every(([key, value]) =>
    value && typeof value === "object"
      ? value.in.includes(row[key])
      : row[key] === value
  );

beforeEach(() => {
  jest.clearAllMocks();
  rows = [];
  jobs = new Map([
    [
      1,
      {
        id: 1,
        name: "Task",
        enabled: true,
        tools: "[]",
        schedule: "0 * * * *",
      },
    ],
  ]);
  prisma.$transaction.mockImplementation((callback) => callback(prisma));
  prisma.scheduled_job_runs.findFirst.mockImplementation(
    async ({ where }) => rows.find((row) => matches(row, where)) || null
  );
  prisma.scheduled_job_runs.create.mockImplementation(async ({ data }) => {
    const row = { id: rows.length + 1, ...data };
    rows.push(row);
    return row;
  });
  prisma.scheduled_job_runs.updateMany.mockImplementation(
    async ({ where, data }) => {
      const matching = rows.filter((row) => matches(row, where));
      matching.forEach((row) => Object.assign(row, data));
      return { count: matching.length };
    }
  );
  ScheduledJob.get.mockImplementation(async ({ id }) => jobs.get(id) || null);
  const startAgentCluster = jest.fn(async () => {});
  EphemeralAgentHandler.mockImplementation(() => ({
    init: async function () {
      return this;
    },
    createAIbitat: async function () {
      this.aibitat = { onToolCallResult() {} };
    },
    startAgentCluster,
    getPendingOutputs: () => [],
  }));

  // Capture the worker's real IPC handler without registering process listeners.
  const on = jest.spyOn(process, "on").mockImplementation((event, handler) => {
    if (event === "message") runWorker = handler;
    return process;
  });
  jest.isolateModules(() => require("../../jobs/run-scheduled-job"));
  on.mockRestore();

  BackgroundService._instance = null;
  const originalAdd = Queue.prototype.add;
  const add = jest
    .spyOn(Queue.prototype, "add")
    .mockImplementation(function (task) {
      tasks = this.tasks;
      return originalAdd.call(this, task);
    });
  service = new BackgroundService();
  service.spawnWorker = jest.fn(async () => {
    const worker = new EventEmitter();
    worker.send = (payload) => {
      conclude.mockImplementationOnce(() =>
        setImmediate(() => worker.emit("exit", 0, null))
      );
      runWorker(payload);
    };
    worker.kill = jest.fn(() => worker.emit("exit", null, "SIGTERM"));
    return { worker, jobId: "test-worker" };
  });
  service.removeJob = jest.fn(async () => {});
  // Keep the spy only while calls are queued; restore in afterEach.
  service._restoreQueueSpy = () => add.mockRestore();
});

afterEach(() => {
  service._restoreQueueSpy();
  jest.restoreAllMocks();
});

test("disabling a waiting job prevents its queued worker from invoking the agent", async () => {
  const run = await service.enqueueScheduledJob(1);
  jobs.get(1).enabled = false;
  await service.syncScheduledJob(1);
  await tasks.shift()();
  expect(run.status).toBe("failed");
  expect(run.error).toBe("Job killed by user");
  expect(EphemeralAgentHandler).not.toHaveBeenCalled();
});

test("resync cancels only that job's queued runs and preserves running and terminal records", async () => {
  rows.push(
    { id: 1, jobId: 1, status: "queued" },
    { id: 2, jobId: 1, status: "running" },
    { id: 3, jobId: 1, status: "completed" },
    { id: 4, jobId: 2, status: "queued" }
  );
  await service.syncScheduledJob(1);
  expect(rows.map((row) => row.status)).toEqual([
    "failed",
    "running",
    "completed",
    "queued",
  ]);
  expect(rows[0].completedAt).toBeInstanceOf(Date);
  expect(rows[0].readAt).toBeInstanceOf(Date);
  expect(await ScheduledJobRun.markRunning(1)).toBe(false);
});

test("Run Now can still execute a disabled job after an earlier queued run was cancelled", async () => {
  await service.enqueueScheduledJob(1);
  jobs.get(1).enabled = false;
  await service.syncScheduledJob(1);
  await tasks.shift()();
  const manual = await service.enqueueScheduledJob(1);
  expect(manual).not.toBeNull();
  await tasks.shift()();
  expect(manual.status).toBe("completed");
  expect(EphemeralAgentHandler).toHaveBeenCalledTimes(1);
});

test("other queued jobs still execute when one job is disabled", async () => {
  jobs.set(2, { ...jobs.get(1), id: 2 });
  await service.enqueueScheduledJob(1);
  const other = await service.enqueueScheduledJob(2);
  jobs.get(1).enabled = false;
  await service.syncScheduledJob(1);
  await tasks.shift()();
  await tasks.shift()();
  expect(other.status).toBe("completed");
  expect(EphemeralAgentHandler).toHaveBeenCalledTimes(1);
});

test("cancellation failures reject resync rather than report success", async () => {
  const run = await service.enqueueScheduledJob(1);
  jobs.get(1).enabled = false;
  prisma.scheduled_job_runs.updateMany.mockRejectedValueOnce(
    new Error("Database unavailable")
  );
  await expect(service.syncScheduledJob(1)).rejects.toThrow(
    "Database unavailable"
  );
  expect(run.status).toBe("queued");
});

test("resync still stops an already running worker", async () => {
  const run = await service.enqueueScheduledJob(1);
  run.status = "running";
  const worker = new EventEmitter();
  worker.send = jest.fn();
  worker.kill = jest.fn(() => worker.emit("exit", null, "SIGTERM"));
  service.spawnWorker.mockResolvedValueOnce({
    worker,
    jobId: "running-worker",
  });
  const finished = tasks.shift()();
  await Promise.resolve();
  jobs.get(1).enabled = false;
  await service.syncScheduledJob(1);
  await finished;
  expect(worker.kill).toHaveBeenCalledWith("SIGTERM");
  expect(run.status).toBe("failed");
});

test("resync stops the timer first and kills a worker that starts during cancellation", async () => {
  service.addScheduledJob(jobs.get(1));
  const timer = require("@breejs/later").setInterval.mock.results[0].value;
  const run = await service.enqueueScheduledJob(1);
  const worker = new EventEmitter();
  worker.send = jest.fn();
  worker.kill = jest.fn(() => worker.emit("exit", null, "SIGTERM"));
  let finishSpawn;
  service.spawnWorker.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishSpawn = () => resolve({ worker, jobId: "racing-worker" });
      })
  );
  const finished = tasks.shift()();
  const updateMany =
    prisma.scheduled_job_runs.updateMany.getMockImplementation();
  prisma.scheduled_job_runs.updateMany.mockImplementationOnce(async (args) => {
    expect(timer.clear).toHaveBeenCalled();
    finishSpawn();
    await Promise.resolve();
    run.status = "running";
    return updateMany(args);
  });
  jobs.get(1).enabled = false;
  await service.syncScheduledJob(1);
  await finished;
  expect(worker.kill).toHaveBeenCalledWith("SIGTERM");
  expect(run.status).toBe("failed");
});

test("a run claimed after resync is cancelled while a new manual run remains allowed", async () => {
  let releaseCreate;
  let enteredCreate;
  const entered = new Promise((resolve) => {
    enteredCreate = resolve;
  });
  const create = prisma.scheduled_job_runs.create.getMockImplementation();
  prisma.scheduled_job_runs.create.mockImplementationOnce(async (args) => {
    enteredCreate();
    await new Promise((resolve) => {
      releaseCreate = resolve;
    });
    return create(args);
  });
  const pending = service.enqueueScheduledJob(1);
  await entered;
  jobs.get(1).enabled = false;
  await service.syncScheduledJob(1);
  releaseCreate();
  expect(await pending).toBeNull();
  expect(rows[0].status).toBe("failed");
  expect(service.spawnWorker).not.toHaveBeenCalled();
  const manual = await service.enqueueScheduledJob(1);
  await tasks.shift()();
  expect(manual.status).toBe("completed");
  expect(EphemeralAgentHandler).toHaveBeenCalledTimes(1);
});

test("a timer callback awaiting the mode check cannot claim a run after resync", async () => {
  const { SystemSettings } = require("../../models/systemSettings");
  let releaseCheck;
  SystemSettings.isMultiUserMode.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        releaseCheck = () => resolve(false);
      })
  );
  const pending = service.enqueueScheduledJob(1);
  jobs.get(1).enabled = false;
  await service.syncScheduledJob(1);
  releaseCheck();
  expect(await pending).toBeNull();
  expect(prisma.scheduled_job_runs.create).not.toHaveBeenCalled();
});
