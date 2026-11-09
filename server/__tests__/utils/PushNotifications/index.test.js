const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("web-push", () => ({
  setVapidDetails: jest.fn(),
  sendNotification: jest.fn(),
  generateVAPIDKeys: jest.fn(() => ({
    publicKey: "test-public-key",
    privateKey: "test-private-key",
  })),
}));

jest.mock("../../../models/user", () => ({
  User: {
    _update: jest.fn().mockResolvedValue(undefined),
    _where: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn().mockResolvedValue(false) },
}));

jest.mock("../../../utils/http", () => ({
  safeJsonParse: (value, fallback = null) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },
}));

const SUB_A = {
  endpoint: "https://push.example/user-a",
  keys: { p256dh: "a", auth: "a" },
};
const SUB_B = {
  endpoint: "https://push.example/user-b",
  keys: { p256dh: "b", auth: "b" },
};
const SUB_PRIMARY = {
  endpoint: "https://push.example/primary",
  keys: { p256dh: "p", auth: "p" },
};
const PAYLOAD = { title: "Job done", body: "hello" };

describe("PushNotifications.sendNotification", () => {
  let tmpDir;
  let webpush;
  let service;

  beforeEach(() => {
    jest.resetModules();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "push-notifications-"));
    process.env.STORAGE_DIR = tmpDir;
    // storagePath is <STORAGE_DIR>/push-notifications
    fs.mkdirSync(path.join(tmpDir, "push-notifications"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(tmpDir, "push-notifications", "vapid-keys.json"),
      JSON.stringify({
        publicKey: "test-public-key",
        privateKey: "test-private-key",
      })
    );
    webpush = require("web-push");
    webpush.sendNotification.mockResolvedValue({ statusCode: 201 });
    const {
      pushNotificationService,
    } = require("../../../utils/PushNotifications/index.js");
    service = pushNotificationService;
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  async function registerTwoUsers() {
    await service.registerSubscription({ id: 1 }, SUB_A);
    await service.registerSubscription({ id: 2 }, SUB_B);
  }

  test("sends to every stored subscription when to is 'all'", async () => {
    await registerTwoUsers();
    const results = await service.sendNotification({
      to: "all",
      payload: PAYLOAD,
    });

    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
    expect(webpush.sendNotification).toHaveBeenCalledWith(
      SUB_A,
      JSON.stringify(PAYLOAD)
    );
    expect(webpush.sendNotification).toHaveBeenCalledWith(
      SUB_B,
      JSON.stringify(PAYLOAD)
    );
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.status === "fulfilled")).toBe(true);
  });

  test("still sends to only the primary subscription when to is 'primary'", async () => {
    await service.registerSubscription(null, SUB_PRIMARY);
    await registerTwoUsers();
    await service.sendNotification({ to: "primary", payload: PAYLOAD });

    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
    expect(webpush.sendNotification).toHaveBeenCalledWith(
      SUB_PRIMARY,
      JSON.stringify(PAYLOAD)
    );
  });

  test("sends to a single user id and ignores the rest", async () => {
    await registerTwoUsers();
    await service.sendNotification({ to: 2, payload: PAYLOAD });

    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
    expect(webpush.sendNotification).toHaveBeenCalledWith(
      SUB_B,
      JSON.stringify(PAYLOAD)
    );
  });

  test("does not send anything for an unknown user id", async () => {
    await registerTwoUsers();
    await service.sendNotification({ to: 99, payload: PAYLOAD });

    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  test("a failed delivery to one subscription does not block the others", async () => {
    await registerTwoUsers();
    webpush.sendNotification
      .mockRejectedValueOnce(new Error("410 Gone"))
      .mockResolvedValue({ statusCode: 201 });
    const results = await service.sendNotification({
      to: "all",
      payload: PAYLOAD,
    });

    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
    expect(results.map((r) => r.status)).toEqual(["fulfilled", "fulfilled"]);
  });
});
