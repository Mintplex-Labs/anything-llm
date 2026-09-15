jest.mock("../../../models/telemetry", () => ({
  Telemetry: { flush: jest.fn() },
}));
jest.mock("../../../utils/BackgroundWorkers", () => ({
  BackgroundService: jest.fn(() => ({ boot() {} })),
}));
jest.mock("../../../utils/EncryptionManager", () => ({
  EncryptionManager: jest.fn(),
}));
jest.mock("../../../utils/comKey", () => ({ CommunicationKey: jest.fn() }));
jest.mock("../../../utils/telemetry", () => jest.fn());
jest.mock("../../../utils/boot/eagerLoadContextWindows", () => jest.fn());
jest.mock("../../../utils/boot/markOnboarded", () => jest.fn());
jest.mock("../../../utils/boot/migrateWebBrowsingToDefault", () => jest.fn());
jest.mock("../../../utils/PushNotifications", () => ({
  PushNotifications: { setupPushNotificationService: jest.fn() },
}));
jest.mock("../../../utils/telegramBot", () => ({
  TelegramBotService: { bootIfActive: jest.fn() },
}));
jest.mock("../../../utils/larkChannel", () => ({
  LarkChannelService: Object.assign(jest.fn(), { bootIfActive: jest.fn() }),
}));
jest.mock("../../../utils/larkChannel/attachments", () => ({
  cleanupActiveAttachmentScopes: jest.fn(),
}));
jest.mock("https", () => ({ createServer: jest.fn() }));
jest.mock("@mintplex-labs/express-ws", () => ({ default: jest.fn() }));
const { EventEmitter } = require("node:events");
const { Telemetry } = require("../../../models/telemetry");
const { TelegramBotService } = require("../../../utils/telegramBot");
const { LarkChannelService } = require("../../../utils/larkChannel");
const {
  cleanupActiveAttachmentScopes,
} = require("../../../utils/larkChannel/attachments");
const {
  bootHTTP,
  bootSSL,
  registerShutdownHandlers,
} = require("../../../utils/boot");
let stop, fakeProcess;
beforeEach(() => {
  jest.clearAllMocks();
  stop = jest.fn().mockResolvedValue();
  LarkChannelService.mockImplementation(() => ({ stop }));
  cleanupActiveAttachmentScopes.mockResolvedValue();
  Telemetry.flush.mockResolvedValue();
  LarkChannelService.bootIfActive.mockResolvedValue();
  fakeProcess = Object.assign(new EventEmitter(), {
    exit: jest.fn(),
    kill: jest.fn(),
    pid: 100,
  });
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

test.each(["HTTP", "HTTPS"])(
  "%s boot awaits Telegram then non-fatal Lark restore",
  async (mode) => {
    jest.spyOn(process, "on").mockReturnValue(process);
    jest.spyOn(process, "once").mockReturnValue(process);
    const order = [];
    TelegramBotService.bootIfActive.mockImplementation(async () => {
      order.push("telegram");
    });
    LarkChannelService.bootIfActive.mockImplementation(async () => {
      order.push("lark");
      throw new Error("secret SDK body");
    });
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    let callback;
    const server = {
      listen: jest.fn((_port, handler) => {
        callback = handler;
        return server;
      }),
      on: jest.fn(),
    };
    if (mode === "HTTPS") {
      jest.spyOn(require("fs"), "readFileSync").mockReturnValue("certificate");
      require("https").createServer.mockReturnValue(server);
      bootSSL({});
    } else bootHTTP(server);
    await expect(callback()).resolves.toBeUndefined();
    expect(order).toEqual(["telegram", "lark"]);
    expect(JSON.stringify(warn.mock.calls)).not.toContain("secret");
  }
);

test.each([
  ["SIGINT", 130],
  ["SIGTERM", 143],
])(
  "%s handlers register once, clean once across repeated signals and exit conventionally",
  async (signal, code) => {
    registerShutdownHandlers({ processTarget: fakeProcess, timeoutMs: 100 });
    registerShutdownHandlers({ processTarget: fakeProcess, timeoutMs: 100 });
    expect(fakeProcess.listenerCount("SIGINT")).toBe(1);
    expect(fakeProcess.listenerCount("SIGTERM")).toBe(1);
    fakeProcess.emit(signal);
    fakeProcess.emit(signal);
    fakeProcess.emit(signal === "SIGINT" ? "SIGTERM" : "SIGINT");
    await new Promise(setImmediate);
    expect(stop).toHaveBeenCalledTimes(1);
    expect(cleanupActiveAttachmentScopes).toHaveBeenCalledTimes(1);
    expect(Telemetry.flush).toHaveBeenCalledTimes(1);
    expect(fakeProcess.exit).toHaveBeenCalledTimes(1);
    expect(fakeProcess.exit).toHaveBeenCalledWith(code);
  }
);
test("hung SDK cleanup is bounded and does not delay attachment cleanup or telemetry", async () => {
  jest.useFakeTimers();
  stop.mockImplementation(() => new Promise(() => {}));
  registerShutdownHandlers({ processTarget: fakeProcess, timeoutMs: 100 });
  fakeProcess.emit("SIGTERM");
  await jest.advanceTimersByTimeAsync(99);
  expect(cleanupActiveAttachmentScopes).toHaveBeenCalledTimes(1);
  expect(Telemetry.flush).toHaveBeenCalledTimes(1);
  expect(fakeProcess.exit).not.toHaveBeenCalled();
  await jest.advanceTimersByTimeAsync(1);
  expect(fakeProcess.exit).toHaveBeenCalledWith(143);
});
test("cleanup rejection still exits and SIGUSR2 retains restart behavior", async () => {
  stop.mockRejectedValue(new Error("SDK secret"));
  registerShutdownHandlers({ processTarget: fakeProcess });
  fakeProcess.emit("SIGUSR2");
  await new Promise(setImmediate);
  expect(fakeProcess.kill).toHaveBeenCalledWith(100, "SIGUSR2");
  expect(fakeProcess.exit).not.toHaveBeenCalled();
});
