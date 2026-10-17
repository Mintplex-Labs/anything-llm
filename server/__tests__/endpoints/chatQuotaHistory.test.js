/* eslint-env jest, node */

// Exercise the real routes/models and migrations against a disposable SQLite
// database. Quota workers use separate OS processes, not an in-memory mutex.
jest.mock("../../utils/prisma", () => {
  const { PrismaClient } = require("@prisma/client");
  const { mkdtempSync } = require("fs");
  const { join } = require("path");
  const directory = mkdtempSync(join(require("os").tmpdir(), "chat-quota-"));
  const url = `file:${join(directory, "test.db")}?connection_limit=1`;
  const client = new PrismaClient({ datasources: { db: { url } } });
  client.testDirectory = directory;
  client.testUrl = url;
  return client;
});
jest.mock("../../utils/http", () => ({
  reqBody: (request) => request.body,
  userFromSession: async (_request, response) => response.locals.user,
  multiUserMode: (response) => response.locals.multiUserMode,
}));
jest.mock("../../utils/middleware/multiUserProtected", () => ({
  ROLES: { admin: "admin", manager: "manager", all: "all" },
  flexUserRoleValid: jest.fn(),
}));
jest.mock("../../utils/middleware/validatedRequest", () => ({}));
jest.mock("../../utils/middleware/validWorkspace", () => ({}));
jest.mock("../../utils/middleware/workspaceDeletionProtection", () => ({}));
jest.mock("../../utils/files", () => ({}));
jest.mock("../../utils/files/multer", () => ({
  handleFileUpload: { single: jest.fn() },
}));
jest.mock("../../utils/files/purgeDocument", () => ({}));
jest.mock("../../utils/helpers", () => ({}));
jest.mock("../../utils/helpers/reasoningEffort", () => ({}));
jest.mock("../../utils/helpers/chat/responses", () => ({}));
jest.mock("../../utils/helpers/search", () => ({}));
jest.mock("../../utils/collectorApi", () => ({}));
jest.mock("../../utils/TextToSpeech", () => ({}));
jest.mock("../../utils/TextToSpeech/audioFormat", () => ({}));
jest.mock("../../utils/TextToSpeech/messageToSpeech", () => ({}));
jest.mock("../../models/workspace", () => ({}));
jest.mock("../../models/documents", () => ({}));
jest.mock("../../models/vectors", () => ({}));
jest.mock("../../models/workspacesSuggestedMessages", () => ({}));
jest.mock("../../models/telemetry", () => ({}));
jest.mock("../../endpoints/utils", () => ({}));
jest.mock("../../endpoints/workspacesParsedFiles", () => ({
  workspaceParsedFilesEndpoints: jest.fn(),
}));

const { join } = require("path");
const { cpSync, readFileSync, writeFileSync, rmSync } = require("fs");
const { execFileSync, fork } = require("child_process");
const prisma = require("../../utils/prisma");
const { User } = require("../../models/user");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { workspaceEndpoints } = require("../../endpoints/workspaces");
const {
  workspaceThreadEndpoints,
} = require("../../endpoints/workspaceThreads");

const routes = {};
const app = Object.fromEntries(
  ["get", "post", "put", "delete"].map((method) => [
    method,
    (path, ...handlers) => (routes[`${method} ${path}`] = handlers.at(-1)),
  ])
);
workspaceEndpoints(app);
workspaceThreadEndpoints(app);

let user;
let workspace;
let thread;
let chat;
let untouched;

beforeAll(() => {
  const sourceSchema = readFileSync(
    join(__dirname, "../../prisma/schema.prisma"),
    "utf8"
  );
  const schema = sourceSchema.replace(
    /url\s*=\s*"file:\.\.\/storage\/anythingllm\.db"/,
    'url = env("QUOTA_TEST_DATABASE_URL")'
  );
  if (schema === sourceSchema)
    throw new Error(
      "This integration test requires the default SQLite schema; refusing to migrate an unknown database URL."
    );
  writeFileSync(join(prisma.testDirectory, "schema.prisma"), schema);
  cpSync(
    join(__dirname, "../../prisma/migrations"),
    join(prisma.testDirectory, "migrations"),
    { recursive: true }
  );
  execFileSync(
    process.execPath,
    [
      require.resolve("prisma"),
      "migrate",
      "deploy",
      "--schema",
      join(prisma.testDirectory, "schema.prisma"),
    ],
    {
      env: {
        ...process.env,
        CHECKPOINT_DISABLE: "1",
        QUOTA_TEST_DATABASE_URL: prisma.testUrl,
      },
      timeout: 30000,
    }
  );
}, 35000);

beforeEach(async () => {
  await prisma.chat_quota_reservations.deleteMany();
  await prisma.workspace_chats.deleteMany();
  await prisma.workspace_threads.deleteMany();
  await prisma.workspace_agent_invocations.deleteMany();
  await prisma.users.deleteMany();
  await prisma.workspaces.deleteMany();
  user = await prisma.users.create({
    data: { username: "quota-test", password: "unused", dailyMessageLimit: 1 },
  });
  workspace = await prisma.workspaces.create({
    data: { name: "Quota test", slug: "quota-test" },
  });
  thread = await prisma.workspace_threads.create({
    data: {
      name: "Thread",
      slug: "test-thread",
      workspace_id: workspace.id,
      user_id: user.id,
    },
  });
  chat = await prisma.workspace_chats.create({
    data: {
      workspaceId: workspace.id,
      user_id: user.id,
      prompt: "original",
      response: "{}",
    },
  });
  const otherUser = await prisma.users.create({
    data: { username: "other", password: "unused" },
  });
  untouched = await prisma.workspace_chats.create({
    data: {
      workspaceId: workspace.id,
      user_id: otherUser.id,
      prompt: "other user",
      response: "{}",
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  rmSync(prisma.testDirectory, { recursive: true, force: true });
});

async function invoke(route, body, multiUserMode = true) {
  const response = {
    locals: { workspace, thread, user, multiUserMode },
    sendStatus: jest.fn().mockReturnThis(),
    end: jest.fn(),
  };
  await routes[route]({ body }, response);
  expect(response.sendStatus).toHaveBeenCalledWith(200);
}

const deletions = [
  [
    "Regenerate / selected messages",
    "delete /workspace/:slug/delete-chats",
    () => ({ chatIds: [chat.id, untouched.id] }),
    false,
  ],
  [
    "edit default thread",
    "delete /workspace/:slug/delete-edited-chats",
    () => ({ startingId: chat.id }),
    false,
  ],
  [
    "edit named thread",
    "delete /workspace/:slug/thread/:threadSlug/delete-edited-chats",
    () => ({ startingId: chat.id }),
    true,
  ],
  [
    "delete thread",
    "delete /workspace/:slug/thread/:threadSlug",
    () => ({}),
    true,
  ],
  [
    "bulk delete threads",
    "delete /workspace/:slug/thread-bulk-delete",
    () => ({ slugs: [thread.slug] }),
    true,
  ],
];

describe.each(deletions)("%s", (_name, route, body, threaded) => {
  test("hides history but keeps the daily quota exhausted", async () => {
    if (threaded)
      await prisma.workspace_chats.update({
        where: { id: chat.id },
        data: { thread_id: thread.id },
      });
    await invoke(route, body());
    expect(
      await prisma.workspace_chats.findUnique({ where: { id: chat.id } })
    ).toMatchObject({ include: false });
    expect(
      await prisma.workspace_chats.findUnique({ where: { id: untouched.id } })
    ).toMatchObject({ include: true });
    expect(
      await WorkspaceChats.forWorkspaceByUser(workspace.id, user.id)
    ).toEqual([]);
    expect(await User.canSendChat(user)).toBe(false);
    expect(await User.reserveChatQuota(user)).toEqual({
      allowed: false,
      reservationId: null,
    });
    expect(await prisma.chat_quota_reservations.count()).toBe(0);
  });

  test("keeps physical deletion in single-user mode", async () => {
    if (threaded)
      await prisma.workspace_chats.update({
        where: { id: chat.id },
        data: { thread_id: thread.id },
      });
    // The supplied session user is only relevant to the ownership filter;
    // single-user mode controls the retention behavior independently.
    await invoke(route, body(), false);
    expect(
      await prisma.workspace_chats.findUnique({ where: { id: chat.id } })
    ).toBeNull();
  });
});

test("old hidden usage and expired reservations do not consume today's slots", async () => {
  await prisma.workspace_chats.update({
    where: { id: chat.id },
    data: { include: false, createdAt: new Date(Date.now() - 25 * 3600000) },
  });
  await prisma.chat_quota_reservations.create({
    data: {
      id: "expired",
      user_id: user.id,
      expiresAt: new Date(Date.now() - 1000),
    },
  });
  const reservation = await User.reserveChatQuota(user);
  expect(reservation.allowed).toBe(true);
  expect(await prisma.chat_quota_reservations.count()).toBe(1);
  await User.releaseChatQuotaReservation(reservation.reservationId);
  await User.releaseChatQuotaReservation(reservation.reservationId);
  expect(await prisma.chat_quota_reservations.count()).toBe(0);
});

test("separate server processes cannot claim the same final slot", async () => {
  await prisma.workspace_chats.deleteMany({ where: { user_id: user.id } });
  const workers = [];
  try {
    const ready = Array.from(
      { length: 3 },
      () =>
        new Promise((resolve, reject) => {
          const worker = fork(
            join(__dirname, "../fixtures/quota-worker.cjs"),
            [],
            {
              env: { ...process.env, QUOTA_TEST_DATABASE_URL: prisma.testUrl },
              stdio: ["ignore", "pipe", "pipe", "ipc"],
            }
          );
          workers.push(worker);
          worker.once("error", reject);
          worker.once("exit", (code) => {
            if (code) reject(new Error(`Quota worker exited ${code}`));
          });
          worker.once("message", (message) =>
            message.ready
              ? resolve(worker)
              : reject(new Error(JSON.stringify(message)))
          );
        })
    );
    await Promise.all(ready);
    const results = await Promise.all(
      workers.map(
        (worker) =>
          new Promise((resolve, reject) => {
            worker.once("error", reject);
            worker.once("message", resolve);
            worker.send(user);
          })
      )
    );
    expect(results.filter((result) => result.error)).toEqual([]);
    expect(results.filter(({ result }) => result.allowed)).toHaveLength(1);
    expect(await prisma.chat_quota_reservations.count()).toBe(1);
    const granted = results.find(({ result }) => result.allowed).result;
    await User.releaseChatQuotaReservation(granted.reservationId);
    expect((await User.reserveChatQuota(user)).allowed).toBe(true);
  } finally {
    for (const worker of workers) worker.kill();
  }
}, 30000);
