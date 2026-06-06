const { EventEmitter } = require("events");
const path = require("path");

describe("desktop runtime launcher foundation", () => {
  const repoRoot = path.resolve(__dirname, "../../..");
  const launcherPath = path.resolve(
    repoRoot,
    "desktop/foundation/runtimeLauncher.cjs"
  );

  function createMockChild({ pid = 12345 } = {}) {
    const child = new EventEmitter();
    child.pid = pid;
    child.exitCode = null;
    child.signalCode = null;
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.kill = jest.fn((signal) => {
      child.signalCode = signal;
      child.emit("exit", 0, signal);
      return true;
    });
    return child;
  }

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not auto-start runtime by default", () => {
    const { isDesktopRuntimeAutoStartEnabled } = require(launcherPath);
    expect(isDesktopRuntimeAutoStartEnabled({ env: {} })).toBe(false);
  });

  it("enables auto-start only when explicitly true", () => {
    const { isDesktopRuntimeAutoStartEnabled } = require(launcherPath);
    expect(
      isDesktopRuntimeAutoStartEnabled({
        env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      })
    ).toBe(true);
    expect(
      isDesktopRuntimeAutoStartEnabled({
        env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "TRUE" },
      })
    ).toBe(true);
    expect(
      isDesktopRuntimeAutoStartEnabled({
        env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "1" },
      })
    ).toBe(false);
  });

  it("resolves allowlisted runtime script and rejects unsafe env script names", () => {
    const { resolveRuntimeLaunchScript } = require(launcherPath);
    expect(
      resolveRuntimeLaunchScript({
        env: {},
        packageScripts: {
          "desktop:runtime:dev": "yarn dev:all",
        },
      })
    ).toEqual(
      expect.objectContaining({
        ok: true,
        scriptName: "desktop:runtime:dev",
      })
    );

    expect(
      resolveRuntimeLaunchScript({
        env: {
          SWARMSY_DESKTOP_RUNTIME_SCRIPT: "node dangerous.js",
        },
        packageScripts: {
          "desktop:runtime:dev": "yarn dev:all",
          "node dangerous.js": "node dangerous.js",
        },
      })
    ).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "unsafe_runtime_script",
      })
    );
  });

  it("launcher does not spawn when auto-start flag is disabled", async () => {
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const spawnImpl = jest.fn();
    const result = await launchDesktopLocalRuntime({
      env: {},
      spawnImpl,
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    });
    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_auto_start_disabled",
      })
    );
    expect(spawnImpl).not.toHaveBeenCalled();
  });

  it("launcher spawns allowlisted runtime script when auto-start is enabled", async () => {
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 4242 });
    const spawnImpl = jest.fn(() => {
      setImmediate(() => child.emit("spawn"));
      return child;
    });
    const result = await launchDesktopLocalRuntime({
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      spawnImpl,
      platform: "linux",
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        pid: 4242,
        mode: "desktop_local_runtime_launcher",
        scriptName: "desktop:runtime:dev",
      })
    );
    expect(spawnImpl).toHaveBeenCalledWith(
      "yarn",
      ["run", "desktop:runtime:dev"],
      expect.objectContaining({
        shell: false,
        detached: true,
      })
    );
  });

  it("launcher uses shell:true with yarn.cmd on Windows", async () => {
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 4545 });
    const spawnImpl = jest.fn(() => {
      setImmediate(() => child.emit("spawn"));
      return child;
    });
    const result = await launchDesktopLocalRuntime({
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      spawnImpl,
      platform: "win32",
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        pid: 4545,
        scriptName: "desktop:runtime:dev",
      })
    );
    expect(spawnImpl).toHaveBeenCalledWith(
      "yarn.cmd",
      ["run", "desktop:runtime:dev"],
      expect.objectContaining({
        shell: true,
        detached: false,
      })
    );
  });




  it("rejects unsafe managed runtime delete paths", () => {
    const { assertSafeManagedRuntimePath } = require(launcherPath);
    const fsRoot = path.parse(process.cwd()).root;

    expect(() => assertSafeManagedRuntimePath("", path.join("", "app"))).toThrow(
      /Refusing to clear managed runtime root/
    );
    expect(() =>
      assertSafeManagedRuntimePath(fsRoot, path.join(fsRoot, "app"))
    ).toThrow(/Refusing to clear managed runtime root/);
    expect(() =>
      assertSafeManagedRuntimePath("/tmp/swarmsy-safe", "/tmp/swarmsy-safe-code")
    ).toThrow(/Refusing to clear unexpected managed app root/);
    expect(
      assertSafeManagedRuntimePath(
        "/tmp/swarmsy-safe",
        "/tmp/swarmsy-safe/app"
      )
    ).toEqual({
      managedRoot: "/tmp/swarmsy-safe",
      managedAppRoot: "/tmp/swarmsy-safe/app",
    });
  });

  it("only excludes app-owned runtime data paths and keeps vendored internals", () => {
    const { shouldExcludeRuntimeCopy } = require(launcherPath);

    expect(
      shouldExcludeRuntimeCopy(path.join(repoRoot, "server", "storage"))
    ).toBe(true);
    expect(
      shouldExcludeRuntimeCopy(path.join(repoRoot, "server", "documents"))
    ).toBe(true);
    expect(
      shouldExcludeRuntimeCopy(path.join(repoRoot, "server", "vector-cache"))
    ).toBe(true);
    expect(
      shouldExcludeRuntimeCopy(path.join(repoRoot, "collector", "hotdir"))
    ).toBe(true);
    expect(
      shouldExcludeRuntimeCopy(
        path.join(
          repoRoot,
          "server",
          "node_modules",
          "multer",
          "storage",
          "disk.js"
        )
      )
    ).toBe(false);
    expect(
      shouldExcludeRuntimeCopy(
        path.join(
          repoRoot,
          "server",
          "node_modules",
          "somepkg",
          "documents",
          "index.js"
        )
      )
    ).toBe(false);
    expect(
      shouldExcludeRuntimeCopy(
        path.join(repoRoot, "server", "node_modules", "pkg", ".env")
      )
    ).toBe(true);
    expect(
      shouldExcludeRuntimeCopy(
        path.join(repoRoot, "server", "node_modules", "pkg", "config.local")
      )
    ).toBe(true);
  });

  it("replaces managed app code on version changes while preserving runtime data", () => {
    const fs = require("fs");
    const os = require("os");
    const { preparePackagedRuntimeRoot } = require(launcherPath);
    const sourceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "swarmsy-runtime-upgrade-source-")
    );
    const userData = fs.mkdtempSync(
      path.join(os.tmpdir(), "swarmsy-runtime-upgrade-user-")
    );
    const runtimeDataRoot = path.join(userData, "local-user-data", "runtime");
    fs.mkdirSync(path.join(sourceRoot, "desktop/runtime"), { recursive: true });
    fs.mkdirSync(path.join(sourceRoot, "server"), { recursive: true });
    fs.mkdirSync(path.join(runtimeDataRoot, "documents"), { recursive: true });
    fs.mkdirSync(path.join(runtimeDataRoot, "assets"), { recursive: true });
    fs.writeFileSync(path.join(runtimeDataRoot, "anythingllm.db"), "db-v1");
    fs.writeFileSync(path.join(runtimeDataRoot, "local-runtime.jwt"), "jwt-v1");
    fs.writeFileSync(path.join(runtimeDataRoot, "documents", "doc.txt"), "doc");
    fs.writeFileSync(path.join(runtimeDataRoot, "assets", "asset.txt"), "asset");
    fs.writeFileSync(
      path.join(sourceRoot, "desktop/runtime/start-local-runtime.cjs"),
      "module.exports = {};\n"
    );
    fs.writeFileSync(path.join(sourceRoot, "server/index.js"), "v1");
    fs.writeFileSync(
      path.join(sourceRoot, "package.json"),
      JSON.stringify({ version: "1.0.0" })
    );

    preparePackagedRuntimeRoot({
      rootDir: sourceRoot,
      env: { SWARMSY_DESKTOP_USER_DATA_DIR: userData },
    });

    fs.writeFileSync(path.join(sourceRoot, "server/index.js"), "v2");
    fs.writeFileSync(
      path.join(sourceRoot, "package.json"),
      JSON.stringify({ version: "2.0.0" })
    );
    preparePackagedRuntimeRoot({
      rootDir: sourceRoot,
      env: { SWARMSY_DESKTOP_USER_DATA_DIR: userData },
    });

    expect(
      fs.readFileSync(
        path.join(userData, "managed-local-runtime", "app", "server", "index.js"),
        "utf8"
      )
    ).toBe("v2");
    expect(fs.readFileSync(path.join(runtimeDataRoot, "anythingllm.db"), "utf8")).toBe(
      "db-v1"
    );
    expect(fs.readFileSync(path.join(runtimeDataRoot, "local-runtime.jwt"), "utf8")).toBe(
      "jwt-v1"
    );
    expect(fs.existsSync(path.join(runtimeDataRoot, "documents", "doc.txt"))).toBe(
      true
    );
    expect(fs.existsSync(path.join(runtimeDataRoot, "assets", "asset.txt"))).toBe(true);
  });

  it("returns packaged_runtime_missing without falling back to Yarn dev scripts", async () => {
    const fs = require("fs");
    const os = require("os");
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const sourceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "swarmsy-runtime-missing-")
    );
    fs.writeFileSync(
      path.join(sourceRoot, "package.json"),
      JSON.stringify({ version: "1.0.0" })
    );
    const spawnImpl = jest.fn();

    const result = await launchDesktopLocalRuntime({
      rootDir: sourceRoot,
      env: { SWARMSY_DESKTOP_USER_DATA_DIR: os.tmpdir() },
      spawnImpl,
      packagedRuntime: true,
      packageScripts: { "desktop:runtime:dev": "yarn dev:all" },
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "packaged_runtime_missing",
      })
    );
    expect(spawnImpl).not.toHaveBeenCalled();
  });

  it("prepares packaged runtime in Local User data without copying app-owned runtime data", () => {
    const fs = require("fs");
    const os = require("os");
    const {
      preparePackagedRuntimeRoot,
      PACKAGED_RUNTIME_ENTRY,
    } = require(launcherPath);
    const sourceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "swarmsy-runtime-source-")
    );
    const userData = fs.mkdtempSync(
      path.join(os.tmpdir(), "swarmsy-runtime-user-")
    );
    fs.mkdirSync(path.join(sourceRoot, "desktop/runtime"), { recursive: true });
    fs.mkdirSync(path.join(sourceRoot, "server/storage"), { recursive: true });
    fs.mkdirSync(path.join(sourceRoot, "server/documents"), { recursive: true });
    fs.mkdirSync(path.join(sourceRoot, "server/vector-cache"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(sourceRoot, "server/prisma/migrations"), {
      recursive: true,
    });
    fs.mkdirSync(
      path.join(sourceRoot, "server/node_modules/multer/storage"),
      { recursive: true }
    );
    fs.mkdirSync(
      path.join(sourceRoot, "server/node_modules/somepkg/documents"),
      { recursive: true }
    );
    fs.writeFileSync(
      path.join(sourceRoot, "package.json"),
      JSON.stringify({ version: "9.9.9" })
    );
    fs.writeFileSync(
      path.join(sourceRoot, "desktop/runtime/start-local-runtime.cjs"),
      "module.exports = {};\n"
    );
    fs.writeFileSync(
      path.join(sourceRoot, "server/index.js"),
      "module.exports = {};\n"
    );
    fs.writeFileSync(path.join(sourceRoot, "server/storage/anythingllm.db"), "hosted-db");
    fs.writeFileSync(path.join(sourceRoot, "server/documents/private.txt"), "doc");
    fs.writeFileSync(path.join(sourceRoot, "server/vector-cache/cache.json"), "cache");
    fs.writeFileSync(
      path.join(sourceRoot, "server/node_modules/multer/storage/disk.js"),
      "module.exports = {};\n"
    );
    fs.writeFileSync(
      path.join(sourceRoot, "server/node_modules/somepkg/documents/index.js"),
      "module.exports = {};\n"
    );
    fs.writeFileSync(path.join(sourceRoot, "server/.env"), "SECRET=1");

    const entry = preparePackagedRuntimeRoot({
      rootDir: sourceRoot,
      env: { SWARMSY_DESKTOP_USER_DATA_DIR: userData },
    });

    expect(entry).toBe(
      path.join(userData, "managed-local-runtime", "app", PACKAGED_RUNTIME_ENTRY)
    );
    expect(fs.existsSync(entry)).toBe(true);
    expect(
      fs.existsSync(path.join(userData, "managed-local-runtime/app/server/index.js"))
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(userData, "managed-local-runtime/app/server/storage/anythingllm.db")
      )
    ).toBe(false);
    expect(
      fs.existsSync(
        path.join(userData, "managed-local-runtime/app/server/documents/private.txt")
      )
    ).toBe(false);
    expect(
      fs.existsSync(
        path.join(
          userData,
          "managed-local-runtime/app/server/vector-cache/cache.json"
        )
      )
    ).toBe(false);
    expect(
      fs.existsSync(path.join(userData, "managed-local-runtime/app/server/.env"))
    ).toBe(false);
    expect(
      fs.existsSync(
        path.join(
          userData,
          "managed-local-runtime/app/server/node_modules/multer/storage/disk.js"
        )
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(
          userData,
          "managed-local-runtime/app/server/node_modules/somepkg/documents/index.js"
        )
      )
    ).toBe(true);
  });

  it("launcher starts packaged runtime without requiring the dev auto-start env flag", async () => {
    const fs = require("fs");
    const os = require("os");
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const sourceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "swarmsy-runtime-launch-")
    );
    const userData = fs.mkdtempSync(
      path.join(os.tmpdir(), "swarmsy-runtime-launch-user-")
    );
    fs.mkdirSync(path.join(sourceRoot, "desktop/runtime"), { recursive: true });
    fs.mkdirSync(path.join(sourceRoot, "server"), { recursive: true });
    fs.writeFileSync(
      path.join(sourceRoot, "package.json"),
      JSON.stringify({ version: "1.2.3" })
    );
    fs.writeFileSync(
      path.join(sourceRoot, "desktop/runtime/start-local-runtime.cjs"),
      "module.exports = {};\n"
    );
    fs.writeFileSync(
      path.join(sourceRoot, "server/index.js"),
      "module.exports = {};\n"
    );

    const child = createMockChild({ pid: 7777 });
    const spawnImpl = jest.fn(() => {
      setImmediate(() => child.emit("spawn"));
      return child;
    });

    const result = await launchDesktopLocalRuntime({
      rootDir: sourceRoot,
      env: { SWARMSY_DESKTOP_USER_DATA_DIR: userData },
      spawnImpl,
      platform: "win32",
      packagedRuntime: true,
      execPath: "C:\\Program Files\\SWARMSY Desktop\\SWARMSY Desktop.exe",
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        pid: 7777,
        scriptName: "desktop:runtime:packaged",
      })
    );
    expect(spawnImpl).toHaveBeenCalledWith(
      "C:\\Program Files\\SWARMSY Desktop\\SWARMSY Desktop.exe",
      [
        path.join(
          userData,
          "managed-local-runtime",
          "app",
          "desktop/runtime/start-local-runtime.cjs"
        ),
      ],
      expect.objectContaining({
        shell: false,
        env: expect.objectContaining({ ELECTRON_RUN_AS_NODE: "1" }),
      })
    );
  });

  it("launcher returns structured failure on spawn error", async () => {
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 6789 });
    const spawnImpl = jest.fn(() => {
      setImmediate(() => child.emit("error", new Error("spawn failed")));
      return child;
    });
    const result = await launchDesktopLocalRuntime({
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      spawnImpl,
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    });
    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_launch_failed",
        message: "Failed to start SWARMSY local runtime.",
      })
    );
  });

  it("launcher resolves success only after spawn event", async () => {
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 5555 });
    const spawnImpl = jest.fn(() => child);
    let settled = false;
    const launchPromise = launchDesktopLocalRuntime({
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      spawnImpl,
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    }).then((result) => {
      settled = true;
      return result;
    });
    await Promise.resolve();
    expect(settled).toBe(false);
    child.emit("spawn");
    await expect(launchPromise).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        pid: 5555,
      })
    );
  });

  it("launcher returns structured failure when spawn never fires", async () => {
    jest.useFakeTimers();
    const { launchDesktopLocalRuntime, DEFAULT_LAUNCH_SPAWN_TIMEOUT_MS } = require(
      launcherPath
    );
    const child = createMockChild({ pid: 8181 });
    const spawnImpl = jest.fn(() => child);
    const launchPromise = launchDesktopLocalRuntime({
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      spawnImpl,
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    });
    jest.advanceTimersByTime(DEFAULT_LAUNCH_SPAWN_TIMEOUT_MS);
    await expect(launchPromise).resolves.toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_launch_failed",
        message: "Timed out waiting for SWARMSY local runtime process to spawn.",
      })
    );
    jest.useRealTimers();
  });

  it("launcher clears spawn timeout when spawn event wins", async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 6060 });
    const spawnImpl = jest.fn(() => child);
    const launchPromise = launchDesktopLocalRuntime({
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      spawnImpl,
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    });
    child.emit("spawn");
    await expect(launchPromise).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        pid: 6060,
      })
    );
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });

  it("launcher clears spawn timeout when error event wins", async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { launchDesktopLocalRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 7070 });
    const spawnImpl = jest.fn(() => child);
    const launchPromise = launchDesktopLocalRuntime({
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      spawnImpl,
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    });
    child.emit("error", new Error("spawn failed"));
    await expect(launchPromise).resolves.toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_launch_failed",
        message: "Failed to start SWARMSY local runtime.",
      })
    );
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });

  it("launcher does not double-settle in spawn/error/timeout races", async () => {
    jest.useFakeTimers();
    const { launchDesktopLocalRuntime, DEFAULT_LAUNCH_SPAWN_TIMEOUT_MS } = require(
      launcherPath
    );
    const child = createMockChild({ pid: 9090 });
    const spawnImpl = jest.fn(() => child);
    const launchPromise = launchDesktopLocalRuntime({
      env: { SWARMSY_DESKTOP_AUTO_START_RUNTIME: "true" },
      spawnImpl,
      packageScripts: {
        "desktop:runtime:dev": "yarn dev:all",
      },
    });
    child.emit("error", new Error("first error wins"));
    jest.advanceTimersByTime(DEFAULT_LAUNCH_SPAWN_TIMEOUT_MS);
    child.emit("spawn");
    await expect(launchPromise).resolves.toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_launch_failed",
      })
    );
  });

  it("healthcheck retry succeeds after initial failure", async () => {
    const { waitForRuntimeHealthcheck } = require(launcherPath);
    const runtimeHealthcheckImpl = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        reason: "runtime_unreachable",
      })
      .mockResolvedValueOnce({
        ok: true,
        startUrl: "http://127.0.0.1:3000",
        origin: "http://127.0.0.1:3000",
      });
    const result = await waitForRuntimeHealthcheck({
      startUrl: "http://127.0.0.1:3000",
      retryIntervalMs: 1,
      timeoutMs: 100,
      runtimeHealthcheckImpl,
      launchResult: { child: createMockChild() },
    });
    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        mode: "desktop_local_runtime_launcher",
      })
    );
  });

  it("healthcheck timeout returns structured timeout failure", async () => {
    const { waitForRuntimeHealthcheck } = require(launcherPath);
    const runtimeHealthcheckImpl = jest.fn().mockResolvedValue({
      ok: false,
      reason: "runtime_unreachable",
    });
    const result = await waitForRuntimeHealthcheck({
      startUrl: "http://127.0.0.1:3000",
      retryIntervalMs: 1,
      timeoutMs: 5,
      runtimeHealthcheckImpl,
      launchResult: { child: createMockChild() },
    });
    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_healthcheck_timeout",
      })
    );
  });

  it("cleanup on quit stops only tracked child process", async () => {
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const processKillSpy = jest.spyOn(process, "kill").mockImplementation(() => true);
    const child = createMockChild({ pid: 2222 });
    setImmediate(() => child.emit("exit", 0, "SIGTERM"));
    try {
      const result = await stopDesktopLaunchedRuntime({
        child,
        platform: "linux",
      });
      expect(result.ok).toBe(true);
      expect(processKillSpy).toHaveBeenCalledWith(-2222, "SIGTERM");
    } finally {
      processKillSpy.mockRestore();
    }
  });

  it("waitForChildExit resolves true and clears timeout when child exits", async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { waitForChildExit } = require(launcherPath);
    const child = createMockChild({ pid: 3333 });
    const waitPromise = waitForChildExit(child, 5000);
    child.emit("exit", 0, "SIGTERM");

    await expect(waitPromise).resolves.toBe(true);
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);

    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });

  it("waitForChildExit resolves true immediately for already-exited child", async () => {
    const { waitForChildExit } = require(launcherPath);
    const child = createMockChild({ pid: 3434 });
    child.exitCode = 0;
    await expect(waitForChildExit(child, 5000)).resolves.toBe(true);
  });

  it("waitForChildExit resolves false on timeout and removes exit listener", async () => {
    jest.useFakeTimers();
    const { waitForChildExit } = require(launcherPath);
    const child = createMockChild({ pid: 4444 });
    const removeListenerSpy = jest.spyOn(child, "removeListener");
    const waitPromise = waitForChildExit(child, 5);

    jest.advanceTimersByTime(5);
    await expect(waitPromise).resolves.toBe(false);
    expect(removeListenerSpy).toHaveBeenCalledWith("exit", expect.any(Function));
    expect(child.listenerCount("exit")).toBe(0);
    expect(jest.getTimerCount()).toBe(0);

    removeListenerSpy.mockRestore();
    jest.useRealTimers();
  });

  it("win32 taskkill exit code 0 returns success and clears timeout", async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 5656 });
    const killer = new EventEmitter();
    const spawnImpl = jest.fn(() => killer);
    const stopPromise = stopDesktopLaunchedRuntime({
      child,
      platform: "win32",
      spawnImpl,
    });
    killer.emit("exit", 0);
    await expect(stopPromise).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        mode: "desktop_local_runtime_launcher",
      })
    );
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });

  it("win32 taskkill error returns structured runtime_stop_failed", async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 5757 });
    const killer = new EventEmitter();
    const spawnImpl = jest.fn(() => killer);
    const stopPromise = stopDesktopLaunchedRuntime({
      child,
      platform: "win32",
      spawnImpl,
    });
    killer.emit("error", new Error("taskkill failed"));
    await expect(stopPromise).resolves.toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_stop_failed",
        message: "Failed to stop SWARMSY local runtime with Windows taskkill.",
      })
    );
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });

  it("win32 taskkill non-zero exit returns structured runtime_stop_failed", async () => {
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 5758 });
    const killer = new EventEmitter();
    const spawnImpl = jest.fn(() => killer);
    const stopPromise = stopDesktopLaunchedRuntime({
      child,
      platform: "win32",
      spawnImpl,
    });
    killer.emit("exit", 1);
    await expect(stopPromise).resolves.toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_stop_failed",
        message: "Failed to stop SWARMSY local runtime with Windows taskkill.",
      })
    );
  });

  it("win32 taskkill settle path does not double-resolve", async () => {
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 5759 });
    const killer = new EventEmitter();
    const spawnImpl = jest.fn(() => killer);
    const stopPromise = stopDesktopLaunchedRuntime({
      child,
      platform: "win32",
      spawnImpl,
    });
    killer.emit("exit", 0);
    killer.emit("exit", 1);
    await expect(stopPromise).resolves.toEqual(
      expect.objectContaining({
        ok: true,
      })
    );
  });

  it("win32 taskkill timeout returns structured timeout failure", async () => {
    const setTimeoutSpy = jest
      .spyOn(global, "setTimeout")
      .mockImplementation((fn) => {
        fn();
        return 1;
      });
    const clearTimeoutSpy = jest
      .spyOn(global, "clearTimeout")
      .mockImplementation(() => {});
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 5858 });
    const killer = new EventEmitter();
    const spawnImpl = jest.fn(() => killer);
    try {
      await expect(
        stopDesktopLaunchedRuntime({
          child,
          platform: "win32",
          spawnImpl,
        })
      ).resolves.toEqual(
        expect.objectContaining({
          ok: false,
          reason: "runtime_stop_timeout",
          message:
            "Timed out waiting for Windows taskkill to stop SWARMSY local runtime.",
        })
      );
    } finally {
      setTimeoutSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
    }
  });

  it("win32 taskkill spawn throw is caught and child.kill is called as fallback", async () => {
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 6868 });
    const spawnImpl = jest.fn(() => {
      throw new Error("taskkill not found");
    });
    const result = await stopDesktopLaunchedRuntime({
      child,
      platform: "win32",
      spawnImpl,
    });
    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_stop_failed",
      })
    );
    expect(child.kill).toHaveBeenCalled();
  });

  it("win32 stop returns success without taskkill when child already exited", async () => {
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 6870 });
    child.exitCode = 0;
    const spawnImpl = jest.fn();
    await expect(
      stopDesktopLaunchedRuntime({
        child,
        platform: "win32",
        spawnImpl,
      })
    ).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        mode: "desktop_local_runtime_launcher",
      })
    );
    expect(spawnImpl).not.toHaveBeenCalled();
  });

  it("win32 taskkill failure does not crash shutdown", async () => {
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = createMockChild({ pid: 6969 });
    const spawnImpl = jest.fn(() => {
      throw new Error("spawn failed");
    });
    let threw = false;
    let result;
    try {
      result = await stopDesktopLaunchedRuntime({
        child,
        platform: "win32",
        spawnImpl,
      });
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
    expect(result).toBeDefined();
    expect(result.ok).toBe(false);
  });

  it("returns structured timeout failure when child survives SIGKILL", async () => {
    const setTimeoutSpy = jest
      .spyOn(global, "setTimeout")
      .mockImplementation((fn) => {
        fn();
        return 1;
      });
    const clearTimeoutSpy = jest
      .spyOn(global, "clearTimeout")
      .mockImplementation(() => {});
    const { stopDesktopLaunchedRuntime } = require(launcherPath);
    const child = new EventEmitter();
    child.pid = 7979;
    child.exitCode = null;
    child.signalCode = null;
    child.kill = jest.fn(() => true);
    const processKillSpy = jest.spyOn(process, "kill").mockImplementation(() => true);
    try {
      await expect(
        stopDesktopLaunchedRuntime({
          child,
          platform: "linux",
        })
      ).resolves.toEqual(
        expect.objectContaining({
          ok: false,
          reason: "runtime_stop_timeout",
          message: "Timed out waiting for SWARMSY local runtime to exit.",
        })
      );
    } finally {
      processKillSpy.mockRestore();
      setTimeoutSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
    }
  });
});
