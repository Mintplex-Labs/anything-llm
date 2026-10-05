const { EventEmitter, once } = require("events");
const { spawn } = require("child_process");

jest.mock("../../utils/prisma", () => ({
  $transaction: jest.fn(),
  scheduled_job_runs: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
}));
jest.mock("../../models/scheduledJob", () => ({
  ScheduledJob: { get: jest.fn() },
}));
jest.mock("../../models/telemetry", () => ({ Telemetry: {} }));
jest.mock("../../utils/middleware/validatedRequest", () => ({
  validatedRequest: jest.fn(),
}));
jest.mock("../../utils/middleware/multiUserProtected", () => ({
  isSingleUserMode: jest.fn(),
}));
jest.mock("../../utils/http", () => ({
  reqBody: (request) => request.body,
  safeJsonParse: JSON.parse,
}));
jest.mock("../../utils/logger", () => jest.fn());
jest.mock("@ladjs/graceful", () => jest.fn(), { virtual: true });
jest.mock("@mintplex-labs/bree", () => jest.fn(), { virtual: true });
jest.mock("@breejs/later", () => ({ date: { UTC: jest.fn() } }), {
  virtual: true,
});
const mockWorkerTasks = [];
jest.mock(
  "p-queue",
  () => ({
    default: class {
      add(task) {
        const pending = task();
        mockWorkerTasks.push(pending);
        return pending;
      }
    },
  }),
  { virtual: true }
);

const prisma = require("../../utils/prisma");
const { ScheduledJob } = require("../../models/scheduledJob");
const { ScheduledJobRun } = require("../../models/scheduledJobRun");
const { BackgroundService } = require("../../utils/BackgroundWorkers");
const { scheduledJobEndpoints } = require("../../endpoints/scheduledJobs");

const service = new BackgroundService();
let killEndpoint;
scheduledJobEndpoints({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  post: (route, _middleware, handler) => {
    if (route === "/scheduled-jobs/runs/:runId/:action") killEndpoint = handler;
  },
});

describe("stopping scheduled job runs", () => {
  let rows;
  let workers;
  const matches = (row, where) =>
    Object.entries(where).every(([key, value]) =>
      value?.in ? value.in.includes(row[key]) : row[key] === value
    );

  beforeEach(() => {
    rows = [];
    workers = [];
    mockWorkerTasks.length = 0;
    jest.spyOn(console, "log").mockImplementation(() => {});
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
    prisma.scheduled_job_runs.findFirst.mockImplementation(
      async ({ where }) => rows.find((row) => matches(row, where)) || null
    );
    prisma.scheduled_job_runs.create.mockImplementation(async ({ data }) => {
      const row = { id: rows.length + 1, ...data };
      rows.push(row);
      return row;
    });
    prisma.scheduled_job_runs.update.mockImplementation(
      async ({ where, data }) => {
        const row = rows.find((row) => matches(row, where));
        Object.assign(row, data);
        return row;
      }
    );
    prisma.scheduled_job_runs.updateMany.mockImplementation(
      async ({ where, data }) => {
        const matched = rows.filter((row) => matches(row, where));
        matched.forEach((row) => Object.assign(row, data));
        return { count: matched.length };
      }
    );
    jest.spyOn(service, "removeJob").mockResolvedValue();
    jest.spyOn(service, "spawnWorker").mockImplementation(async () => {
      const worker = new EventEmitter();
      worker.send = jest.fn();
      worker.kill = jest.fn((signal) => {
        queueMicrotask(() => worker.emit("exit", null, signal));
        return true;
      });
      workers.push(worker);
      return { worker, jobId: "worker" };
    });
  });

  afterEach(async () => {
    workers.forEach((worker) => worker.kill("SIGTERM"));
    await Promise.all(mockWorkerTasks);
    jest.restoreAllMocks();
  });

  async function runningRun() {
    const run = await service.enqueueScheduledJob(3);
    await new Promise(setImmediate);
    await ScheduledJobRun.markRunning(run.id);
    return run;
  }

  async function kill(run) {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
    await killEndpoint(
      { params: { action: "kill", runId: String(run.id) } },
      response
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ success: true });
  }

  it("finalizes a killed worker in the parent and allows a new run", async () => {
    const run = await runningRun();
    // The endpoint must finalize the row even before the worker exits.
    workers[0].kill.mockImplementationOnce(() => true);
    await kill(run);
    expect(run).toMatchObject({
      status: "failed",
      error: "Job killed by user",
    });
    expect(run.completedAt).toBeInstanceOf(Date);
    expect(run.readAt).toBeInstanceOf(Date);
    workers[0].emit("exit", null, "SIGTERM");
    await Promise.all(mockWorkerTasks);
    expect(await ScheduledJobRun.start(3)).not.toBeNull();
  });

  it("can cancel a queued run that has no worker", async () => {
    const run = await ScheduledJobRun.start(3);
    await kill(run);
    expect(run.status).toBe("failed");
    expect(await ScheduledJobRun.markRunning(run.id)).toBe(false);
  });

  it("finalizes a stopped worker when disabling an active job", async () => {
    const run = await runningRun();
    ScheduledJob.get.mockResolvedValue({ id: 3, enabled: false });
    await service.syncScheduledJob(3);
    await Promise.all(mockWorkerTasks);
    expect(run.status).toBe("failed");
    expect(await ScheduledJobRun.start(3)).not.toBeNull();
  });

  it("does not overwrite a completion that wins the stop race", async () => {
    const run = await runningRun();
    await ScheduledJobRun.complete(run.id, { result: "done" });
    service.killRun(3, run.id);
    await Promise.all(mockWorkerTasks);
    expect(run).toMatchObject({ status: "completed", result: "done" });
    expect(run.readAt).toBeUndefined();
  });

  it("does not let a late worker completion overwrite cancellation", async () => {
    const run = await ScheduledJobRun.start(3);
    await ScheduledJobRun.kill(run.id);
    expect(
      await ScheduledJobRun.complete(run.id, { result: "too late" })
    ).toBeNull();
    expect(run).toMatchObject({
      status: "failed",
      error: "Job killed by user",
    });
    expect(run.result).toBeUndefined();
  });

  (process.platform === "win32" ? it : it.skip)(
    "clears the run after a real Windows worker exits without its SIGTERM handler",
    async () => {
      const worker = spawn(
        process.execPath,
        [
          "-e",
          `
          process.on("SIGTERM", () => process.send("handled"));
          process.on("message", () => {});
          setInterval(() => {}, 1000);
          process.send("ready");
        `,
        ],
        { stdio: ["ignore", "ignore", "ignore", "ipc"], windowsHide: true }
      );
      workers.push(worker);
      const exit = once(worker, "exit");
      let handlerRan = false;
      worker.on("message", (message) => {
        if (message === "handled") handlerRan = true;
      });
      await once(worker, "message");
      service.spawnWorker.mockResolvedValue({
        worker,
        jobId: "windows-worker",
      });
      const run = await runningRun();
      await kill(run);
      expect(await exit).toEqual([null, "SIGTERM"]);
      await Promise.all(mockWorkerTasks);
      expect(handlerRan).toBe(false);
      expect(run.status).toBe("failed");
      expect(await ScheduledJobRun.start(3)).not.toBeNull();
    },
    10000
  );
});
