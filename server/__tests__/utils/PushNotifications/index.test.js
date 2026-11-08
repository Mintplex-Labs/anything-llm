/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("web-push", () => ({
  sendNotification: jest.fn(),
  generateVAPIDKeys: jest.fn(() => ({
    publicKey: "test-public-key",
    privateKey: "test-private-key",
  })),
  setVapidDetails: jest.fn(),
}));

jest.mock("../../../models/user", () => ({
  User: {
    _update: jest.fn(async () => true),
    _where: jest.fn(async () => []),
  },
}));

jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: {
    isMultiUserMode: jest.fn(async () => false),
  },
}));

// The real utils/http pulls in heavy runtime deps (jsonwebtoken, prisma-backed
// models). PushNotifications only uses safeJsonParse from it.
jest.mock("../../../utils/http", () => ({
  safeJsonParse: (json, fallback) => {
    try {
      const parsed = JSON.parse(json);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  },
}));

const subscriptionFor = (endpoint) => ({
  endpoint,
  keys: { p256dh: "p256dh-key", auth: "auth-key" },
});

describe("PushNotifications.sendNotification", () => {
  let service;
  let webpush;
  let storageDir;

  beforeEach(async () => {
    // PushNotifications is a module-level singleton, so every test gets a
    // fresh module registry (fresh #subscriptions map and fresh mocks).
    jest.resetModules();
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "allm-push-test-"));
    process.env.STORAGE_DIR = storageDir;
    fs.mkdirSync(path.join(storageDir, "push-notifications"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(storageDir, "push-notifications", "vapid-keys.json"),
      JSON.stringify({
        publicKey: "test-public-key",
        privateKey: "test-private-key",
      })
    );

    webpush = require("web-push");
    webpush.sendNotification.mockReset();
    webpush.sendNotification.mockResolvedValue({ statusCode: 201 });

    ({
      pushNotificationService: service,
    } = require("../../../utils/PushNotifications"));
    await service.registerSubscription(
      { id: 1 },
      subscriptionFor("https://push.example/1")
    );
  });

  afterEach(() => {
    fs.rmSync(storageDir, { recursive: true, force: true });
    delete process.env.STORAGE_DIR;
  });

  it("delivers to every registered subscription when to is 'all'", async () => {
    await service.registerSubscription(
      { id: 2 },
      subscriptionFor("https://push.example/2")
    );

    await service.sendNotification({
      to: "all",
      payload: { title: "Job completed", body: "ok" },
    });

    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
    const targets = webpush.sendNotification.mock.calls.map(
      ([subscription]) => subscription.endpoint
    );
    expect(targets.sort()).toEqual([
      "https://push.example/1",
      "https://push.example/2",
    ]);
    // Every target gets the exact same serialized payload.
    for (const [, payload] of webpush.sendNotification.mock.calls)
      expect(payload).toBe(
        JSON.stringify({ title: "Job completed", body: "ok" })
      );
  });

  it("still delivers to a single registered target unchanged", async () => {
    await service.sendNotification({
      to: 1,
      payload: { title: "Job completed" },
    });

    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
    expect(webpush.sendNotification.mock.calls[0][0].endpoint).toBe(
      "https://push.example/1"
    );
  });

  it("sends nothing for an unregistered target", async () => {
    await service.sendNotification({
      to: 999,
      payload: { title: "Job completed" },
    });

    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  it("keeps broadcasting to the remaining targets when one delivery fails", async () => {
    await service.registerSubscription(
      { id: 2 },
      subscriptionFor("https://push.example/2")
    );
    webpush.sendNotification.mockImplementation((subscription) =>
      subscription.endpoint === "https://push.example/1"
        ? Promise.reject(new Error("gone"))
        : Promise.resolve({ statusCode: 201 })
    );

    await expect(
      service.sendNotification({
        to: "all",
        payload: { title: "Job completed" },
      })
    ).resolves.toBeUndefined();

    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
  });
});
