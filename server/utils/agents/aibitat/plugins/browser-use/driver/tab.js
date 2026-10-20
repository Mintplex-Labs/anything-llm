const { EventEmitter } = require("events");
const { PASSKEY_BLOCK_SCRIPT } = require("./pageScript");

const VIEWPORT = { width: 1280, height: 800 };
// Nobody is at the browser to answer a permission prompt - headless Chrome would leave it pending
// forever. Every powerful feature is denied outright instead. Names the running Chrome does not
// know are skipped.
const DENIED_PERMISSIONS = [
  "accelerometer",
  "ambient-light-sensor",
  "background-fetch",
  "background-sync",
  "camera",
  "captured-surface-control",
  "clipboard-read",
  "clipboard-write",
  "display-capture",
  "geolocation",
  "gyroscope",
  "idle-detection",
  "keyboard-lock",
  "local-fonts",
  "magnetometer",
  "microphone",
  "midi",
  "nfc",
  "notifications",
  "payment-handler",
  "periodic-background-sync",
  "pointer-lock",
  "protected-media-identifier",
  "screen-wake-lock",
  "speaker-selection",
  "system-wake-lock",
  "window-management",
];
// The page script runs in its own JS world - pages can neither see nor tamper with it.
const WORLD = "anythingllm-browser-use";

/**
 * One session's page, driven over CDP: a tab in the saved profile's browser (its cookies and
 * storage), or for an incognito session a tab in its own browser context (fresh cookies and
 * storage, thrown away with the tab). Everything the session needs from the browser goes
 * through here; the agent-facing logic lives in session.js.
 *
 * Events:
 *   "cdp" (method, params, sessionId) - every CDP event of the page ("" ) and of the cross-origin
 *                                        frames attached below it (their own CDP session id)
 *   "notice" (text)                   - something the page did that the agent should know about
 *   "frame" (base64 jpeg)             - a screencast frame, while streaming
 */
class Tab extends EventEmitter {
  /** @param {import("./chromium").Connection} connection */
  constructor(connection) {
    super();
    this.setMaxListeners(50);
    this.connection = connection;
    this.contextId = null;
    this.targetId = null;
    this.session = null;
    this.url = "";
    this.title = "";
    this.closed = false;
    this.history = null;
    this.world = null;
    this.windowFitted = false;
    /** Cross-origin frame targets attached below the page: CDP session -> {frameId, parent} */
    this.frameTargets = new Map();
    this.loading = new Set();
    this.loadWaiters = new Set();
    this.onEvent = (method, params, sessionId) =>
      this.#route(method, params, sessionId);
    connection.on("event", this.onEvent);
  }

  /**
   * @param {import("./chromium").Connection} connection
   * @param {{isolated?: boolean}} opts - isolated: open in a fresh browser context of its own
   * @returns {Promise<Tab>}
   */
  static async open(connection, { isolated = true } = {}) {
    const tab = new Tab(connection);
    try {
      await tab.#init(isolated);
      return tab;
    } catch (error) {
      await tab.close();
      throw error;
    }
  }

  async #init(isolated) {
    const send = (method, params) => this.connection.send(method, params);
    if (isolated)
      ({ browserContextId: this.contextId } = await send(
        "Target.createBrowserContext",
        { disposeOnDetach: true }
      ));
    const context = this.contextId ? { browserContextId: this.contextId } : {};
    // Files are never downloaded; the event still lets the agent know one was blocked.
    await send("Browser.setDownloadBehavior", {
      behavior: "deny",
      ...context,
      eventsEnabled: true,
    }).catch(() => {});
    await Promise.all(
      DENIED_PERMISSIONS.map((name) =>
        send("Browser.setPermission", {
          permission: { name },
          setting: "denied",
          ...context,
        }).catch(() => {})
      )
    );
    // Popups the page opens are reported (see #onBrowserEvent) so they can be closed.
    await send("Target.setDiscoverTargets", { discover: true }).catch(() => {});
    ({ targetId: this.targetId } = await send("Target.createTarget", {
      url: "about:blank",
      ...context,
    }));
    ({ sessionId: this.session } = await send("Target.attachToTarget", {
      targetId: this.targetId,
      flatten: true,
    }));

    const { userAgent, product } = await send("Browser.getVersion");
    this.userAgent = userAgent.replace(/HeadlessChrome/g, "Chrome");
    this.chromeVersion = product.split("/")[1] || "0.0.0.0";
    await this.send("Emulation.setDeviceMetricsOverride", {
      ...VIEWPORT,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await this.send("Emulation.setFocusEmulationEnabled", { enabled: true });
    await this.#setupTarget(this.session);
    // Cross-origin iframes run in their own renderer, a separate CDP target that page-level setup
    // does not reach. Each is held until it is set up, so init scripts still beat its own scripts.
    await this.send("Target.setAutoAttach", {
      autoAttach: true,
      waitForDebuggerOnStart: true,
      flatten: true,
    });
    this.#refreshHistory();
  }

  /** Per-target setup, for the page itself and for every cross-origin frame. */
  #setupTarget(sessionId) {
    const send = (method, params = {}) =>
      this.connection.send(method, params, sessionId);
    return Promise.all([
      send("Page.enable"),
      send("Page.addScriptToEvaluateOnNewDocument", {
        source: PASSKEY_BLOCK_SCRIPT,
      }),
      // A file picker has no one to answer it.
      send("Page.setInterceptFileChooserDialog", { enabled: true }),
      // Nor does a USB / Bluetooth / serial / HID device picker - they are cancelled (see #route).
      send("DeviceAccess.enable").catch(() => {}),
      // Network events tell the agent when the page actually sent something (a post, a message).
      send("Network.enable", { maxPostDataSize: 4096 }).catch(() => {}),
      // Sites see a regular Chrome, client hints included - not "HeadlessChrome".
      send("Emulation.setUserAgentOverride", {
        userAgent: this.userAgent,
        userAgentMetadata: this.#userAgentMetadata(),
      }).catch(() => {}),
    ]);
  }

  #userAgentMetadata() {
    const major = this.chromeVersion.split(".")[0];
    const brands = [
      { brand: "Not/A)Brand", version: "8" },
      { brand: "Chromium", version: major },
      { brand: "Google Chrome", version: major },
    ];
    return {
      brands,
      fullVersionList: brands.map((b) => ({
        ...b,
        version: b.brand === "Not/A)Brand" ? "8.0.0.0" : this.chromeVersion,
      })),
      platform:
        process.platform === "darwin"
          ? "macOS"
          : process.platform === "win32"
            ? "Windows"
            : "Linux",
      platformVersion: "",
      architecture: process.arch === "arm64" ? "arm" : "x86",
      model: "",
      mobile: false,
      bitness: "64",
      wow64: false,
    };
  }

  /////////////////////////////
  // Events
  /////////////////////////////

  #route(method, params, sessionId) {
    if (this.closed) return;
    if (!sessionId) return this.#onBrowserEvent(method, params);
    if (sessionId !== this.session && !this.frameTargets.has(sessionId)) return;
    const isPage = sessionId === this.session;

    switch (method) {
      case "Target.attachedToTarget":
        return this.#onAttached(params, sessionId);
      case "Target.detachedFromTarget":
        this.frameTargets.delete(params.sessionId);
        for (const key of [...this.loading])
          if (key.startsWith(`${params.sessionId}|`)) this.loading.delete(key);
        break;
      case "Page.frameStartedLoading":
        this.loading.add(`${sessionId}|${params.frameId}`);
        break;
      case "Page.frameStoppedLoading":
        this.loading.delete(`${sessionId}|${params.frameId}`);
        if (isPage && params.frameId === this.targetId)
          for (const waiter of [...this.loadWaiters]) waiter.onStop();
        break;
      case "Page.frameDetached":
        this.loading.delete(`${sessionId}|${params.frameId}`);
        break;
      case "Page.frameNavigated":
        if (isPage && !params.frame.parentId) {
          this.url =
            params.frame.unreachableUrl ||
            `${params.frame.url}${params.frame.urlFragment || ""}`;
          this.world = null; // a new document has no isolated world yet
          this.#refreshHistory();
        }
        break;
      case "Page.navigatedWithinDocument":
        if (isPage && params.frameId === this.targetId) {
          this.url = params.url;
          this.#refreshHistory();
        }
        break;
      case "Page.loadEventFired":
        if (isPage) for (const waiter of [...this.loadWaiters]) waiter.onLoad();
        break;
      case "Page.javascriptDialogOpening":
        this.#onDialog(params, sessionId);
        break;
      case "DeviceAccess.deviceRequestPrompted":
        this.connection
          .send("DeviceAccess.cancelPrompt", { id: params.id }, sessionId)
          .catch(() => {});
        this.emit(
          "notice",
          "The page asked to connect to a device (USB, Bluetooth or similar). That is not allowed, so it was refused."
        );
        break;
      case "Page.windowOpen":
        // Popups load in this tab - there is one page per session.
        if (/^https?:/i.test(params.url)) this.load(params.url).catch(() => {});
        else
          this.emit(
            "notice",
            `Blocked a link to "${String(params.url).slice(0, 80)}" - only web pages can be opened.`
          );
        break;
      case "Page.fileChooserOpened":
        this.emit(
          "notice",
          "The page opened a file upload picker. Uploading files is not supported, so it was ignored."
        );
        break;
      case "Page.screencastFrame":
        if (!isPage) break;
        this.send("Page.screencastFrameAck", {
          sessionId: params.sessionId,
        }).catch(() => {});
        // Only frames of the whole viewport: the card maps clicks onto it, so a cropped or
        // rescaled frame would put them in the wrong place.
        if (this.#fitsViewport(params.metadata))
          this.emit("frame", params.data);
        break;
    }
    this.emit("cdp", method, params, isPage ? "" : sessionId);
  }

  /**
   * The screencast records the headless window, not the emulated viewport, and the window's view
   * is smaller than its size (by 16x138 on Windows). Grow the window once by what is missing.
   */
  #fitsViewport({ deviceWidth, deviceHeight, pageScaleFactor = 1 } = {}) {
    const missingWidth = Math.round(VIEWPORT.width - deviceWidth);
    const missingHeight = Math.round(VIEWPORT.height - deviceHeight);
    if (!missingWidth && !missingHeight && pageScaleFactor === 1) return true;
    if ((missingWidth > 0 || missingHeight > 0) && !this.windowFitted) {
      this.windowFitted = true;
      this.connection
        .send("Browser.getWindowForTarget", { targetId: this.targetId })
        .then(({ windowId, bounds }) =>
          this.connection.send("Browser.setWindowBounds", {
            windowId,
            bounds: {
              width: bounds.width + Math.max(0, missingWidth),
              height: bounds.height + Math.max(0, missingHeight),
            },
          })
        )
        .catch(() => {});
    }
    return false;
  }

  #onBrowserEvent(method, params) {
    if (method === "Target.targetInfoChanged") {
      if (params.targetInfo.targetId === this.targetId)
        this.title = params.targetInfo.title;
    } else if (method === "Target.targetCreated") {
      // A popup the page opened (window.open, target=_blank) - Page.windowOpen already loaded it here.
      const info = params.targetInfo;
      // Sessions on a saved profile share its context, so only close what this tab opened.
      const ours = this.contextId
        ? info.browserContextId === this.contextId
        : info.openerId === this.targetId;
      // Until createTarget returns, the only new page is this tab itself - never close that.
      if (
        info.type === "page" &&
        ours &&
        this.targetId &&
        info.targetId !== this.targetId
      )
        this.connection
          .send("Target.closeTarget", { targetId: info.targetId })
          .catch(() => {});
    } else if (method === "Browser.downloadWillBegin") {
      if (params.frameId === this.targetId || this.#knowsFrame(params.frameId))
        this.emit(
          "notice",
          `A download of "${params.suggestedFilename || "a file"}" was blocked. Files cannot be downloaded.`
        );
    }
  }

  async #onAttached({ sessionId, targetInfo }, parent) {
    const resume = () =>
      this.connection
        .send("Runtime.runIfWaitingForDebugger", {}, sessionId)
        .catch(() => {});
    if (targetInfo.type !== "iframe") {
      // Workers - nothing to set up, so let them run and stop listening to them.
      await resume();
      this.connection
        .send("Target.detachFromTarget", { sessionId }, parent)
        .catch(() => {});
      return;
    }
    this.frameTargets.set(sessionId, {
      frameId: targetInfo.targetId,
      parent: parent === this.session ? "" : parent,
    });
    try {
      // A hung command must never leave the frame paused, so setup gets a few seconds at most.
      await Promise.race([
        Promise.all([
          this.#setupTarget(sessionId),
          this.connection.send(
            "Target.setAutoAttach",
            { autoAttach: true, waitForDebuggerOnStart: true, flatten: true },
            sessionId
          ),
        ]),
        new Promise((resolve) => setTimeout(resolve, 5_000)),
      ]);
    } catch {
    } finally {
      resume();
    }
  }

  #onDialog({ type, message }, sessionId) {
    // Nobody can answer a dialog: confirm says yes, prompt is dismissed, leaving a page is allowed.
    this.connection
      .send(
        "Page.handleJavaScriptDialog",
        { accept: type !== "prompt" },
        sessionId
      )
      .catch(() => {});
    const text = String(message || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300);
    if (type === "confirm")
      this.emit(
        "notice",
        `The page asked "${text}" and it was automatically confirmed.`
      );
    else if (type === "prompt")
      this.emit("notice", `The page prompted "${text}" and it was dismissed.`);
    else if (type === "alert")
      this.emit("notice", `The page showed an alert: "${text}"`);
  }

  #knowsFrame(frameId) {
    for (const key of this.loading)
      if (key.endsWith(`|${frameId}`)) return true;
    return false;
  }

  #refreshHistory() {
    this.send("Page.getNavigationHistory")
      .then((history) => (this.history = history))
      .catch(() => {});
  }

  /////////////////////////////
  // Page access
  /////////////////////////////

  /**
   * A CDP command for the page, or for a cross-origin frame's own session.
   * @param {string} method
   * @param {Object} params
   * @param {string} [sessionId] - a frame target's session; the page when empty
   */
  send(method, params = {}, sessionId = "") {
    if (this.closed)
      return Promise.reject(new Error("The browser session has ended."));
    return this.connection.send(method, params, sessionId || this.session);
  }

  /** Navigate and wait for the page's load event. Rejects when the navigation fails. */
  load(url) {
    if (this.closed)
      return Promise.reject(new Error("The browser session has ended."));
    return new Promise((resolve, reject) => {
      let navigated = false;
      const waiter = {
        onLoad: () => {
          cleanup();
          resolve();
        },
        onStop: () => {
          if (!navigated) return;
          cleanup();
          reject(new Error(`The page at ${url} did not load.`));
        },
        onClose: () => {
          cleanup();
          reject(new Error("The browser session has ended."));
        },
      };
      const cleanup = () => this.loadWaiters.delete(waiter);
      this.loadWaiters.add(waiter);
      this.send("Page.navigate", { url }).then(
        (response) => {
          navigated = true;
          if (!this.loadWaiters.has(waiter)) return;
          if (response.errorText) {
            cleanup();
            reject(new Error(`${response.errorText} loading ${url}`));
          } else if (!response.loaderId) {
            cleanup(); // same-document navigation
            resolve();
          }
        },
        (error) => {
          cleanup();
          reject(error);
        }
      );
    });
  }

  get isLoading() {
    return this.loading.size > 0;
  }

  get canGoBack() {
    return !!this.history && this.history.currentIndex > 0;
  }

  goBack() {
    const history = this.history;
    if (!history || history.currentIndex <= 0) return;
    const entry = history.entries[history.currentIndex - 1];
    this.history = { ...history, currentIndex: history.currentIndex - 1 };
    this.send("Page.navigateToHistoryEntry", { entryId: entry.id }).catch(
      () => {}
    );
  }

  /** Evaluate in the main frame's isolated world. Results come back as JSON values. */
  async evaluate(expression, retry = true) {
    if (!this.world) {
      ({ executionContextId: this.world } = await this.send(
        "Page.createIsolatedWorld",
        { frameId: this.targetId, worldName: WORLD }
      ));
    }
    const world = this.world;
    let response;
    try {
      response = await this.send("Runtime.evaluate", {
        expression,
        contextId: world,
        returnByValue: true,
        awaitPromise: true,
      });
    } catch (error) {
      // The document changed and took the world with it - make a new one, once.
      if (this.world === world) this.world = null;
      if (retry) return await this.evaluate(expression, false);
      throw error;
    }
    if (response.exceptionDetails)
      throw new Error(
        response.exceptionDetails.exception?.description ||
          response.exceptionDetails.text
      );
    return response.result?.value;
  }

  /////////////////////////////
  // Input and pictures
  /////////////////////////////

  /** Trusted mouse event at viewport coordinates. */
  mouse(type, x, y, { clickCount = 1 } = {}) {
    const params = {
      move: { type: "mouseMoved", button: "none", buttons: 0 },
      down: { type: "mousePressed", button: "left", buttons: 1, clickCount },
      up: { type: "mouseReleased", button: "left", buttons: 0, clickCount },
    }[type];
    return this.send("Input.dispatchMouseEvent", { ...params, x, y });
  }

  /** Wheel scroll at viewport coordinates. Positive deltaY scrolls down. */
  wheel(x, y, deltaY) {
    return this.send("Input.dispatchMouseEvent", {
      type: "mouseWheel",
      x,
      y,
      deltaX: 0,
      deltaY,
    });
  }

  insertText(text) {
    return this.send("Input.insertText", { text: String(text) });
  }

  /**
   * A jpeg of the viewport, scaled to `width`.
   * @returns {Promise<string|null>} base64
   */
  async capture({ width = VIEWPORT.width, quality = 60 } = {}) {
    try {
      // A clip is in page coordinates, so it has to start where the page is scrolled to - at 0,0 a
      // scrolled page captures the unpainted top of the document (a blank image).
      const { cssVisualViewport: viewport } = await this.send(
        "Page.getLayoutMetrics"
      ).catch(() => ({}));
      const { data } = await this.send("Page.captureScreenshot", {
        format: "jpeg",
        quality,
        clip: {
          x: viewport?.pageX || 0,
          y: viewport?.pageY || 0,
          ...VIEWPORT,
          scale: width / VIEWPORT.width,
        },
      });
      return data || null;
    } catch {
      return null;
    }
  }

  setStreaming(on) {
    return this.send(
      on ? "Page.startScreencast" : "Page.stopScreencast",
      on
        ? {
            format: "jpeg",
            quality: 60,
            maxWidth: VIEWPORT.width,
            maxHeight: VIEWPORT.height,
          }
        : {}
    ).catch(() => {});
  }

  async close() {
    if (this.closed) return;
    this.closed = true;
    this.connection.off("event", this.onEvent);
    for (const waiter of [...this.loadWaiters]) waiter.onClose();
    if (this.contextId)
      await this.connection
        .send("Target.disposeBrowserContext", {
          browserContextId: this.contextId,
        })
        .catch(() => {});
    else if (this.targetId)
      await this.connection
        .send("Target.closeTarget", { targetId: this.targetId })
        .catch(() => {});
  }
}

module.exports = { Tab, VIEWPORT };
