const fs = require("fs");
const path = require("path");
const {
  validateLocalUserStorageManifest,
} = require("../../utils/swarmsy/localUserStorageContract");

describe("SWARMSY desktop wrapper foundation", () => {
  const repoRoot = path.resolve(__dirname, "../../..");

  it("registers desktop foundation scripts at repo root", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(repoRoot, "package.json"), "utf8")
    );

    expect(packageJson.scripts["desktop:dev"]).toBe(
      "node desktop/scripts/run-desktop-dev.cjs"
    );
    expect(packageJson.scripts["desktop:smoke"]).toBe(
      "node desktop/scripts/desktop-smoke-check.cjs"
    );
  });

  it("builds desktop storage contract data from the Local User manifest contract", () => {
    const {
      getDesktopStorageContract,
    } = require(path.resolve(
      repoRoot,
      "desktop/foundation/storageContractBridge.cjs"
    ));

    const contract = getDesktopStorageContract({
      platform: "linux",
      homeDir: "/tmp/swarmsy-home",
      env: {},
    });

    expect(contract.layout.mode).toBe("local_user");
    expect(contract.layout.root).toContain("/tmp/swarmsy-home/.config/swarmsy");

    const validation = validateLocalUserStorageManifest(contract.manifest, {
      layout: contract.layout,
    });
    expect(validation.valid).toBe(true);
  });

  it("resolves the Electron shim path across supported platforms", () => {
    const {
      resolveElectronBinary,
    } = require(path.resolve(repoRoot, "desktop/scripts/run-desktop-dev.cjs"));

    expect(
      resolveElectronBinary({ platform: "linux", rootDir: "/repo" })
    ).toBe(path.posix.join("/repo", "node_modules", ".bin", "electron"));
    expect(
      resolveElectronBinary({ platform: "darwin", rootDir: "/repo" })
    ).toBe(path.posix.join("/repo", "node_modules", ".bin", "electron"));
    expect(
      resolveElectronBinary({ platform: "win32", rootDir: "C:\\repo" })
    ).toBe(path.win32.join("C:\\repo", "node_modules", ".bin", "electron.cmd"));
  });

  it("uses shell: true when spawning the Electron shim on Windows", () => {
    jest.resetModules();
    const fs = require("fs");
    const existsSyncSpy = jest.spyOn(fs, "existsSync").mockReturnValue(true);

    try {
      const { runDesktopDev } = require(path.resolve(
        repoRoot,
        "desktop/scripts/run-desktop-dev.cjs"
      ));

      const spawnImpl = jest.fn(() => ({ on: jest.fn() }));

      runDesktopDev({
        spawnImpl,
        platform: "win32",
        rootDir: path.resolve(repoRoot),
        env: { ...process.env, SWARMSY_DESKTOP_START_URL: "http://localhost:3001" },
      });

      expect(spawnImpl).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.objectContaining({ shell: true })
      );
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it("does not set shell: true when spawning the Electron shim on macOS/Linux", () => {
    jest.resetModules();
    const fs = require("fs");
    const existsSyncSpy = jest.spyOn(fs, "existsSync").mockReturnValue(true);

    try {
      const { runDesktopDev } = require(path.resolve(
        repoRoot,
        "desktop/scripts/run-desktop-dev.cjs"
      ));

      for (const platform of ["linux", "darwin"]) {
        const spawnImpl = jest.fn(() => ({ on: jest.fn() }));

        runDesktopDev({
          spawnImpl,
          platform,
          rootDir: path.resolve(repoRoot),
          env: { ...process.env, SWARMSY_DESKTOP_START_URL: "http://localhost:3001" },
        });

        expect(spawnImpl).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Array),
          expect.not.objectContaining({ shell: true })
        );
      }
    } finally {
      existsSyncSpy.mockRestore();
    }
  });

  it("keeps BrowserWindow sandboxed and routes storage contract IPC through main", async () => {
    jest.resetModules();
    jest.doMock(
      "electron",
      () => ({
        app: {
          whenReady: jest.fn(() => Promise.resolve()),
          on: jest.fn(),
          quit: jest.fn(),
        },
        BrowserWindow: jest.fn(),
        ipcMain: {
          handle: jest.fn(),
          removeHandler: jest.fn(),
        },
        shell: {
          openExternal: jest.fn(),
        },
      }),
      { virtual: true }
    );

    const main = require(path.resolve(repoRoot, "desktop/electron/main.cjs"));
    const shellApi = { openExternal: jest.fn().mockResolvedValue(undefined) };
    const webContents = {
      setWindowOpenHandler: jest.fn(),
      on: jest.fn(),
    };
    const loadURL = jest.fn().mockResolvedValue(undefined);
    const BrowserWindowCtor = jest.fn(() => ({
      webContents,
      loadURL,
    }));

    await main.createWindow({
      BrowserWindowCtor,
      startUrl: "http://127.0.0.1:3000",
      shellApi,
    });

    expect(BrowserWindowCtor).toHaveBeenCalledWith(
      expect.objectContaining({
        webPreferences: expect.objectContaining({
          contextIsolation: true,
          nodeIntegration: false,
          sandbox: true,
          preload: path.resolve(repoRoot, "desktop/electron/preload.cjs"),
        }),
      })
    );
    expect(loadURL).toHaveBeenCalledWith("http://127.0.0.1:3000");

    const windowOpenHandler = webContents.setWindowOpenHandler.mock.calls[0][0];
    expect(windowOpenHandler({ url: "https://example.com/docs" })).toEqual({
      action: "deny",
    });
    expect(shellApi.openExternal).toHaveBeenCalledWith(
      "https://example.com/docs"
    );
    expect(windowOpenHandler({ url: "http://example.com/docs" })).toEqual({
      action: "deny",
    });
    expect(shellApi.openExternal).toHaveBeenCalledWith(
      "http://example.com/docs"
    );

    shellApi.openExternal.mockClear();
    for (const blockedUrl of [
      "file:///tmp/swarmsy.txt",
      "javascript:alert(1)",
      "data:text/html,hello",
      "custom-protocol://open-me",
    ]) {
      expect(windowOpenHandler({ url: blockedUrl })).toEqual({
        action: "deny",
      });
    }
    expect(shellApi.openExternal).not.toHaveBeenCalled();

    const willNavigateHandler = webContents.on.mock.calls.find(
      ([eventName]) => eventName === "will-navigate"
    )[1];
    const externalEvent = { preventDefault: jest.fn() };
    willNavigateHandler(externalEvent, "https://example.com");
    expect(externalEvent.preventDefault).toHaveBeenCalled();
    expect(shellApi.openExternal).toHaveBeenCalledWith("https://example.com");

    const externalHttpEvent = { preventDefault: jest.fn() };
    willNavigateHandler(externalHttpEvent, "http://example.com");
    expect(externalHttpEvent.preventDefault).toHaveBeenCalled();
    expect(shellApi.openExternal).toHaveBeenCalledWith("http://example.com");

    shellApi.openExternal.mockClear();
    for (const blockedUrl of [
      "file:///tmp/swarmsy.txt",
      "javascript:alert(1)",
      "data:text/html,hello",
      "custom-protocol://open-me",
    ]) {
      const blockedEvent = { preventDefault: jest.fn() };
      willNavigateHandler(blockedEvent, blockedUrl);
      expect(blockedEvent.preventDefault).toHaveBeenCalled();
    }
    expect(shellApi.openExternal).not.toHaveBeenCalled();

    const internalEvent = { preventDefault: jest.fn() };
    willNavigateHandler(internalEvent, "http://127.0.0.1:3000/settings");
    expect(internalEvent.preventDefault).not.toHaveBeenCalled();

    const ipcMainApi = {
      handle: jest.fn(),
      removeHandler: jest.fn(),
    };
    main.registerDesktopIpc({ ipcMainApi });
    const ipcHandler = ipcMainApi.handle.mock.calls[0][1];

    const trustedContract = ipcHandler({
      senderFrame: { url: "http://localhost:3000" },
    });
    expect(trustedContract).toEqual(
      expect.objectContaining({
        layout: expect.objectContaining({ mode: "local_user" }),
        manifest: expect.any(Object),
      })
    );
    expect(
      validateLocalUserStorageManifest(trustedContract.manifest, {
        layout: trustedContract.layout,
      }).valid
    ).toBe(true);

    expect(
      ipcHandler({
        senderFrame: { url: "https://hosted.example.com" },
      })
    ).toBeNull();
  });

  it("only exposes the preload bridge on trusted local origins", async () => {
    jest.resetModules();
    const exposeInMainWorld = jest.fn();
    const invoke = jest.fn().mockResolvedValue({ ok: true });
    jest.doMock(
      "electron",
      () => ({
        contextBridge: { exposeInMainWorld },
        ipcRenderer: { invoke },
      }),
      { virtual: true }
    );

    const previousLocation = global.location;
    let preload;
    try {
      global.location = { href: "https://hosted.example.com" };
      preload = require(path.resolve(repoRoot, "desktop/electron/preload.cjs"));
    } finally {
      if (previousLocation === undefined) {
        delete global.location;
      } else {
        global.location = previousLocation;
      }
    }
    expect(exposeInMainWorld).not.toHaveBeenCalled();

    const trustedContextBridge = { exposeInMainWorld: jest.fn() };
    const trustedIpcRenderer = { invoke: jest.fn().mockResolvedValue({ ok: true }) };
    const didExpose = preload.exposeDesktopBridge({
      contextBridgeApi: trustedContextBridge,
      ipcRendererApi: trustedIpcRenderer,
      locationHref: "http://127.0.0.1:3000",
    });

    expect(didExpose).toBe(true);
    expect(trustedContextBridge.exposeInMainWorld).toHaveBeenCalledWith(
      "swarmsyDesktop",
      expect.objectContaining({
        foundation: expect.objectContaining({
          mode: "foundation_only",
          getStorageContract: expect.any(Function),
        }),
      })
    );

    const bridge =
      trustedContextBridge.exposeInMainWorld.mock.calls[0][1].foundation;
    expect(await bridge.getStorageContract()).toEqual({ ok: true });
    expect(trustedIpcRenderer.invoke).toHaveBeenCalledWith(
      "swarmsy:get-storage-contract"
    );
    expect(preload.isTrustedDesktopOrigin("https://hosted.example.com")).toBe(
      false
    );
    expect(preload.isTrustedDesktopOrigin("http://localhost:3000")).toBe(true);
  });

  it("only treats http and https URLs as safe external browser targets", () => {
    jest.resetModules();
    jest.doMock(
      "electron",
      () => ({
        app: {},
        BrowserWindow: jest.fn(),
        ipcMain: { handle: jest.fn(), removeHandler: jest.fn() },
        shell: { openExternal: jest.fn() },
      }),
      { virtual: true }
    );

    const main = require(path.resolve(repoRoot, "desktop/electron/main.cjs"));

    expect(main.isExternalWebUrl("https://example.com")).toBe(true);
    expect(main.isExternalWebUrl("http://example.com")).toBe(true);
    expect(main.isExternalWebUrl("file:///tmp/test.txt")).toBe(false);
    expect(main.isExternalWebUrl("javascript:alert(1)")).toBe(false);
    expect(main.isExternalWebUrl("data:text/plain,hi")).toBe(false);
    expect(main.isExternalWebUrl("custom-protocol://launch")).toBe(false);
  });

  it("handles openExternal rejections without unhandled errors", async () => {
    jest.resetModules();
    jest.doMock(
      "electron",
      () => ({
        app: {},
        BrowserWindow: jest.fn(),
        ipcMain: { handle: jest.fn(), removeHandler: jest.fn() },
        shell: { openExternal: jest.fn() },
      }),
      { virtual: true }
    );

    const main = require(path.resolve(repoRoot, "desktop/electron/main.cjs"));
    const webContents = {
      setWindowOpenHandler: jest.fn(),
      on: jest.fn(),
    };
    const openError = new Error("open failed");
    const shellApi = { openExternal: jest.fn().mockRejectedValue(openError) };
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      main.configureWindowSecurity(
        { webContents },
        "http://127.0.0.1:3000",
        { shellApi }
      );

      const windowOpenHandler = webContents.setWindowOpenHandler.mock.calls[0][0];
      windowOpenHandler({ url: "https://example.com/docs" });

      const willNavigateHandler = webContents.on.mock.calls.find(
        ([eventName]) => eventName === "will-navigate"
      )[1];
      willNavigateHandler({ preventDefault: jest.fn() }, "https://example.com");

      await Promise.resolve();

      expect(shellApi.openExternal).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[desktop] Failed to open external URL:",
        openError
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it.each([
    ["malformed start URL", "not a valid url"],
    ["unsupported protocol", "file:///tmp/swarmsy.txt"],
  ])("renders the launch failure page for %s", async (_label, configuredUrl) => {
    jest.resetModules();
    jest.doMock(
      "electron",
      () => ({
        app: {},
        BrowserWindow: jest.fn(),
        ipcMain: { handle: jest.fn(), removeHandler: jest.fn() },
        shell: { openExternal: jest.fn() },
      }),
      { virtual: true }
    );

    const previousStartUrl = process.env.SWARMSY_DESKTOP_START_URL;
    process.env.SWARMSY_DESKTOP_START_URL = configuredUrl;

    try {
      const main = require(path.resolve(repoRoot, "desktop/electron/main.cjs"));
      const webContents = {
        setWindowOpenHandler: jest.fn(),
        on: jest.fn(),
      };
      const loadURL = jest.fn().mockResolvedValue(undefined);
      const BrowserWindowCtor = jest.fn(() => ({
        webContents,
        loadURL,
      }));

      await main.createWindow({ BrowserWindowCtor });

      expect(loadURL).toHaveBeenCalledTimes(1);
      expect(loadURL).toHaveBeenCalledWith(
        expect.stringMatching(/^data:text\/html;charset=utf-8,/)
      );

      const failureMarkup = decodeURIComponent(loadURL.mock.calls[0][0].split(",")[1]);
      expect(failureMarkup).toContain("SWARMSY Desktop Foundation Launch Failed");
      expect(failureMarkup).toContain("SWARMSY_DESKTOP_START_URL");
      expect(webContents.setWindowOpenHandler).not.toHaveBeenCalled();
    } finally {
      if (previousStartUrl === undefined) {
        delete process.env.SWARMSY_DESKTOP_START_URL;
      } else {
        process.env.SWARMSY_DESKTOP_START_URL = previousStartUrl;
      }
    }
  });

  it("bootstrapDesktopApp renders the launch failure page without unhandled rejection", async () => {
    jest.resetModules();
    jest.doMock(
      "electron",
      () => ({
        app: {},
        BrowserWindow: jest.fn(),
        ipcMain: { handle: jest.fn(), removeHandler: jest.fn() },
        shell: { openExternal: jest.fn() },
      }),
      { virtual: true }
    );

    const previousStartUrl = process.env.SWARMSY_DESKTOP_START_URL;
    process.env.SWARMSY_DESKTOP_START_URL = "bad:// url";

    const unhandledRejections = [];
    const onUnhandledRejection = (error) => unhandledRejections.push(error);
    process.on("unhandledRejection", onUnhandledRejection);

    try {
      const main = require(path.resolve(repoRoot, "desktop/electron/main.cjs"));
      const webContents = {
        setWindowOpenHandler: jest.fn(),
        on: jest.fn(),
      };
      const loadURL = jest.fn().mockResolvedValue(undefined);
      const BrowserWindowCtor = jest.fn(() => ({
        webContents,
        loadURL,
      }));
      BrowserWindowCtor.getAllWindows = jest.fn(() => []);

      const appInstance = {
        whenReady: jest.fn(() => Promise.resolve()),
        on: jest.fn(),
        quit: jest.fn(),
      };
      const ipcMainApi = {
        handle: jest.fn(),
        removeHandler: jest.fn(),
      };

      main.bootstrapDesktopApp({
        appInstance,
        BrowserWindowCtor,
        ipcMainApi,
        shellApi: { openExternal: jest.fn() },
      });

      await Promise.resolve();
      await new Promise((resolve) => setImmediate(resolve));

      expect(unhandledRejections).toHaveLength(0);
      expect(loadURL).toHaveBeenCalledTimes(1);
      expect(loadURL).toHaveBeenCalledWith(
        expect.stringMatching(/^data:text\/html;charset=utf-8,/)
      );
    } finally {
      process.off("unhandledRejection", onUnhandledRejection);
      if (previousStartUrl === undefined) {
        delete process.env.SWARMSY_DESKTOP_START_URL;
      } else {
        process.env.SWARMSY_DESKTOP_START_URL = previousStartUrl;
      }
    }
  });
});
