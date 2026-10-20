const { Tab, VIEWPORT } = require("./tab");
const { PAGE_SCRIPT } = require("./pageScript");

/**  ATTN: SECURITY RESEARCHERS
 * To Security researchers about to submit an SSRF report CVE - please don't.
 * The browser opening any address - localhost, private networks, internal hostnames - is intended.
 * Browsing an organization's internal sites is a supported use of this skill, and there are endless
 * ways to map a hostname to another IP anyway, so the browser does not try to block any of them.
 * Only an admin can turn the skill on. We communicate already that deployment (and security) of an
 * instance is on the deployer and system admin deploying it. This would include isolation,
 * firewalls, and the general security of the instance.
 */

/**
 * One agent browsing session: a browser tab on the user's saved profile (or an incognito one),
 * driven with trusted input and read through the isolated-world page script. Ported from the desktop app's
 * electron/main/utils/BrowserUse/session.ts - same page representation, same actions,
 * same outcomes - over a headless Chromium instead of an Electron window.
 */

const MAX_NOTICES = 20;
const MAX_FRAMES = 6;
// Ad slots are cross-origin frames too, but nothing in them is part of the task.
const AD_FRAME_HOST =
  /(^|\.)(doubleclick\.net|googlesyndication\.com|googleadservices\.com|amazon-adsystem\.com|adnxs\.com|taboola\.com|outbrain\.com|criteo\.(com|net)|rubiconproject\.com|pubmatic\.com|openx\.net|moatads\.com|adsafeprotected\.com|3lift\.com|teads\.tv|casalemedia\.com|media\.net)$/i;
// Analytics, logging and tracking endpoints POST constantly - they are not "the page sent something".
const TRACKING_PATH =
  /\/(track|tracking|collect|beacon|log|logs|logging|analytics|metrics|telemetry|events?|rum|pixel|ping|sentry|csp-report|li\/track|jot|1p-user-list|pagead)\b/i;
const READ_ONLY_GRAPHQL = /"query"\s*:\s*"\s*(query\b|\{)/;
const ACTIONS_THAT_SUBMIT = new Set(["click", "press_key", "type"]);
// Keep-alives sockets send on a timer (socket.io "2", {"type":"ping"}, Discord {"op":1,...}), not because of the agent.
const WS_HEARTBEAT =
  /["'](type|event|op|action|cmd|method|msg)["']\s*:\s*["']?(ping|pong|heartbeat|hb|keep_?alive)\b|^\s*\{\s*"op"\s*:\s*1\s*,|^\s*"?(ping|pong|heartbeat|keep_?alive)"?\s*$/i;
// Screenshots are a last resort for vision models, so keep them small.
const SCREENSHOT_WIDTH = 768;
const SCREENSHOT_QUALITY = 50;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BLOCKER_NOTICE = {
  login: {
    wall: "STOP: this is a sign-in page. Do not type anything or look for a way around it - call ask_user.",
    present:
      "This page has a sign-in form, but its content may still be available. Only if the task really needs you to be signed in, call ask_user. Never sign in yourself unless the user gave you the credentials for this task.",
  },
  captcha: {
    wall: 'STOP: this page is a captcha / "are you human" check. Do not try to solve it - call ask_user.',
    present:
      "This page contains a captcha. If you need to get past it, call ask_user - never try to solve it yourself.",
  },
  verification: {
    wall: "STOP: this page asks for a verification code. Do not guess it - call ask_user.",
    present:
      "This page has a verification code field. If it must be filled in, call ask_user for the code.",
  },
};

/**
 * @typedef {Object} ActionResult
 * @property {boolean} ok
 * @property {string} outcome - one line, what happened - kept in the agent's history
 * @property {string} state - the full page state - only the latest is kept in context
 * @property {{url: string, title: string, favicon: string}} page
 * @property {string|null} thumbnail - small jpeg (base64) for the session trace
 * @property {string} [target] - label of the element acted on
 * @property {boolean} [sensitive] - the action typed into a password field
 * @property {{kind: string, wall: boolean, score: number}|null} [blocker] - sign-in / bot check / verification on the page
 * @property {boolean} [tookOver] - the user drove the browser themselves since the agent last looked
 * @property {string} [image] - screenshot action only
 * @property {Array<{label: string, method: string, target: string, status: number|null, ok: boolean|null}>} [sent]
 */

class BrowserSession {
  /** @param {{id: string, tab: Tab, maxChars: number, terms: string[]}} opts */
  constructor({ id, tab, maxChars, terms }) {
    this.id = id;
    this.tab = tab;
    this.maxChars = maxChars;
    /** Words of the task (stems) - long navigation lists keep the links that mention them. */
    this.terms = terms;
    this.notices = [];
    /** Write requests seen since the current action started (null when no action is running). */
    this.sentLog = null;
    /** Open websockets by CDP request id - frames only carry the id, the URL comes with webSocketCreated. */
    this.socketUrls = new Map();
    /** Isolated world execution contexts of cross-origin frames, by `${session}|${frameId}`. */
    this.worlds = new Map();
    this.idRanges = [];
    this.scrollFrame = null;
    this.queue = Promise.resolve();
    this.lastFrame = null;
    this.tookOverSinceRead = false;
    this.userInputAt = 0;
    this.closed = false;
    tab.on("notice", (text) => this.#notice(text));
    tab.on("frame", (frame) => (this.lastFrame = frame));
    tab.on("cdp", (method, params, sessionId) => {
      if (method.startsWith("Network."))
        this.#onNetwork(method, params, sessionId);
      else if (method === "Target.detachedFromTarget")
        for (const key of this.worlds.keys())
          if (key.startsWith(`${params.sessionId}|`)) this.worlds.delete(key);
    });
  }

  /**
   * @param {{id: string, connection: import("./chromium").Connection, isolated?: boolean, maxChars?: number, terms?: string[]}} opts
   * @returns {Promise<BrowserSession>}
   */
  static async create({
    id,
    connection,
    isolated = true,
    maxChars = 8000,
    terms = [],
  }) {
    const words = Array.isArray(terms)
      ? terms.filter((t) => typeof t === "string").slice(0, 40)
      : [];
    const tab = await Tab.open(connection, { isolated });
    return new BrowserSession({ id, tab, maxChars, terms: words });
  }

  #notice(text) {
    if (this.notices.length < MAX_NOTICES && !this.notices.includes(text))
      this.notices.push(text);
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.tab.close();
  }

  /////////////////////////////
  // Taking over from the chat card
  /////////////////////////////

  /**
   * Input from the person helping in the chat card. Coordinates are fractions (0-1) of the
   * live view, so the card's size does not matter. Events apply strictly in order - a press
   * must land before its release, however quickly they arrive.
   * down / move / up are the mouse as the person moves it, so they can press and hold
   * ("press and hold" checks) or drag (sliders).
   * @param {{type: "click"|"down"|"move"|"up"|"scroll"|"key"|"text", x?: number, y?: number, deltaY?: number, key?: string, text?: string}} event
   */
  userInput(event = {}) {
    this.inputQueue = (this.inputQueue || Promise.resolve())
      .then(() => this.#applyInput(event))
      .catch(() => {});
    return this.inputQueue;
  }

  async #applyInput(event) {
    if (this.closed) return;
    this.tookOverSinceRead = true;
    this.userInputAt = Date.now();
    const at = (fraction, size) =>
      Math.round(Math.min(Math.max(Number(fraction) || 0, 0), 1) * size);
    const x = at(event.x, VIEWPORT.width);
    const y = at(event.y, VIEWPORT.height);
    switch (event.type) {
      case "click":
        return await this.#click(x, y);
      case "down":
        // A press whose release never arrived (the card went away) is let go first.
        if (this.mouseHeld) await this.tab.mouse("up", x, y);
        await this.tab.mouse("move", x, y);
        this.mouseHeld = true;
        return await this.tab.mouse("down", x, y);
      case "move":
        return await this.tab.mouse("move", x, y, { held: this.mouseHeld });
      case "up":
        if (!this.mouseHeld) return;
        this.mouseHeld = false;
        return await this.tab.mouse("up", x, y);
      case "scroll":
        return await this.tab.wheel(
          x,
          y,
          Math.max(-2000, Math.min(2000, Number(event.deltaY) || 0))
        );
      case "key":
        return await this.#key(String(event.key || "")).catch(() => {});
      case "text":
        return await this.tab.insertText(
          String(event.text || "").slice(0, 500)
        );
    }
  }

  /** Last time the user typed or clicked in the chat card. */
  get lastUserInput() {
    return this.userInputAt;
  }

  /** Screencast only while someone is watching - every frame is a jpeg encode and a websocket message. */
  setStreaming(on) {
    return this.tab.setStreaming(on);
  }

  /** A current picture for a card that starts watching (the screencast only sends frames on repaint). */
  async currentFrame() {
    this.lastFrame =
      (await this.tab.capture({ width: VIEWPORT.width, quality: 60 })) ||
      this.lastFrame;
    return this.lastFrame;
  }

  /////////////////////////////
  // Page access
  /////////////////////////////

  /** Run a page-script call in the main frame's isolated world, or in a cross-origin frame's. */
  async #page(call, frame = null) {
    if (!frame) return await this.tab.evaluate(`${PAGE_SCRIPT};${call}`);
    return await this.#inFrame(frame, `${PAGE_SCRIPT};${call}`);
  }

  async #inFrame(frame, expression, retry = true) {
    const key = `${frame.session}|${frame.frameId}`;
    let contextId = this.worlds.get(key);
    if (!contextId) {
      ({ executionContextId: contextId } = await this.tab.send(
        "Page.createIsolatedWorld",
        { frameId: frame.frameId, worldName: "anythingllm-browser-use" },
        frame.session
      ));
      this.worlds.set(key, contextId);
    }
    let response;
    try {
      response = await this.tab.send(
        "Runtime.evaluate",
        { expression, contextId, returnByValue: true },
        frame.session
      );
    } catch (error) {
      // The frame navigated and its world went with the old document - make a new one, once.
      this.worlds.delete(key);
      if (retry) return await this.#inFrame(frame, expression, false);
      throw error;
    }
    if (response.exceptionDetails)
      throw new Error(
        response.exceptionDetails.exception?.description ||
          response.exceptionDetails.text
      );
    return response.result?.value;
  }

  /**
   * Cross-origin frames worth reading, largest first, with their place in the viewport. The main frame's
   * page script walks same-origin iframes itself; anything with another origin than the frame it would be
   * reached from is read on its own. Cross-site frames live in other renderers (their own CDP sessions).
   */
  async #foreignFrames() {
    const found = [];
    const walk = (session, node, walkOrigin) => {
      for (const child of node.childFrames || []) {
        const { id, url, securityOrigin } = child.frame;
        // about:blank and srcdoc frames inherit their parent's origin, so the parent's walk reaches them.
        const separate = /^https?:/i.test(url) && securityOrigin !== walkOrigin;
        if (separate && !AD_FRAME_HOST.test(hostOf(url)))
          found.push({ session, frameId: id, host: hostOf(url) });
        walk(session, child, separate ? securityOrigin : walkOrigin);
      }
    };
    for (const session of ["", ...this.tab.frameTargets.keys()]) {
      const tree = await this.tab
        .send("Page.getFrameTree", {}, session)
        .catch(() => null);
      if (!tree?.frameTree) continue;
      const root = tree.frameTree.frame;
      if (session && !AD_FRAME_HOST.test(hostOf(root.url)))
        found.push({ session, frameId: root.id, host: hostOf(root.url) });
      walk(session, tree.frameTree, root.securityOrigin);
    }

    const visible = [];
    for (const frame of found.slice(0, 30)) {
      const box = await this.#frameBox(frame, true).catch(() => null);
      // Tracking pixels and frames far outside the part of the page the snapshot covers are skipped.
      if (!box || box.w < 24 || box.h < 24) continue;
      if (
        box.x + box.w <= 0 ||
        box.x >= VIEWPORT.width ||
        box.y + box.h < -0.25 * VIEWPORT.height ||
        box.y > 2.5 * VIEWPORT.height
      )
        continue;
      visible.push({ ...frame, box });
    }
    return visible
      .sort((a, b) => b.box.w * b.box.h - a.box.w * a.box.h)
      .slice(0, MAX_FRAMES);
  }

  /**
   * Where a frame's viewport sits in the page's viewport. Box model coordinates are relative to the
   * renderer's local root, so frames in other renderers add up their own frame's offset.
   * With `visibleOnly`, a frame that is hidden or covered at its center comes back null.
   */
  async #frameBox(frame, visibleOnly = false) {
    const target = frame.session
      ? this.tab.frameTargets.get(frame.session)
      : null;
    if (frame.session && !target) return null;
    // The <iframe> element lives in the parent frame: the same renderer, unless this is a renderer's root frame.
    const owner =
      target && target.frameId === frame.frameId
        ? target.parent
        : frame.session;
    const { backendNodeId } = await this.tab.send(
      "DOM.getFrameOwner",
      { frameId: frame.frameId },
      owner
    );
    const { model } = await this.tab.send(
      "DOM.getBoxModel",
      { backendNodeId },
      owner
    );
    const [x1, y1, x2, , , y3] = model.content;
    const local = { x: x1, y: y1, w: x2 - x1, h: y3 - y1 };
    if (visibleOnly && local.w > 0 && local.h > 0) {
      const hit = await this.tab
        .send(
          "DOM.getNodeForLocation",
          {
            x: Math.round(local.x + local.w / 2),
            y: Math.round(local.y + local.h / 2),
            ignorePointerEventsNone: true,
          },
          owner
        )
        .catch(() => null);
      // The hit is the <iframe> itself, or a node inside it when the hit test descends into the frame.
      // No answer (below the fold) counts as visible.
      if (
        hit &&
        hit.backendNodeId !== backendNodeId &&
        hit.frameId !== frame.frameId
      )
        return null;
    }
    if (!owner) return local;
    const parent = this.tab.frameTargets.get(owner);
    if (!parent) return null;
    const base = await this.#frameBox({
      session: owner,
      frameId: parent.frameId,
      host: "",
    });
    return base ? { ...local, x: local.x + base.x, y: local.y + base.y } : null;
  }

  /** The frame an element ([n]) or text ([Tn]) id of the latest page state belongs to. */
  #frameOf(id, text = false) {
    const range = this.idRanges.find((r) =>
      text
        ? id > r.textBase && id <= r.textBase + r.textCount
        : id > r.base && id <= r.base + r.count
    );
    return range?.frame || null;
  }

  /** Keyboard focus is on a text field inside a cross-origin frame. */
  async #focusedFrame() {
    if (!(await this.#page("window.__bu.focusInFrame()").catch(() => false)))
      return null;
    for (const { frame } of this.idRanges) {
      if (
        frame &&
        (await this.#page("window.__bu.hasFocusedField()", frame).catch(
          () => false
        ))
      )
        return frame;
    }
    return null;
  }

  /** An element's center in viewport coordinates, scrolled into view. */
  async #locate(id) {
    const frame = this.#frameOf(id);
    const target = await this.#page(`window.__bu.locate(${id})`, frame);
    if (target.error || !frame) return target;
    // Scrolling the element into view can scroll the page as well, so read the frame's place afterwards.
    const box = await this.#frameBox(frame).catch(() => null);
    const x = Math.round((box?.x ?? NaN) + target.x);
    const y = Math.round((box?.y ?? NaN) + target.y);
    if (!(x >= 0 && y >= 0 && x <= VIEWPORT.width && y <= VIEWPORT.height))
      return {
        error: `[${id}] is hidden off-screen, so it cannot be clicked. Use a visible element from the latest page state.`,
      };
    return { ...target, x, y };
  }

  async #fingerprint(frame) {
    const main = await this.#page("window.__bu.fingerprint()").catch(() => "");
    return frame
      ? main +
          (await this.#page("window.__bu.fingerprint()", frame).catch(() => ""))
      : main;
  }

  async #info() {
    const favicon = await this.#page("window.__bu.favicon()").catch(() => "");
    return {
      url: this.tab.url,
      title: this.tab.title || this.tab.url,
      favicon,
    };
  }

  /** The token-light page representation handed to the LLM after every action. */
  async state(hints = {}) {
    const snap = await this.#page(
      `window.__bu.snapshot(${JSON.stringify({ maxChars: this.maxChars, hints, terms: this.terms })})`
    ).catch(() => null);
    if (!snap) {
      this.idRanges = [];
      return {
        text: `URL: ${this.tab.url}\nThe page could not be read (it may still be loading). Try wait or navigate again.${this.#noticeText()}`,
        blocker: null,
      };
    }
    this.idRanges = [
      {
        frame: null,
        base: 0,
        count: snap.count,
        textBase: 0,
        textCount: snap.textCount,
      },
    ];
    let blocker = snap.blocker || null;
    let more = snap.truncated + snap.belowFold;

    // Cross-origin frames (embedded checkouts, sign-in and consent frames) are numbered after the page's
    // own items and listed where they sit on the page.
    const frames = await this.#foreignFrames().catch(() => []);
    const budget = Math.max(
      400,
      Math.floor(
        Math.max(0, this.maxChars - snap.used) / Math.max(1, frames.length)
      )
    );
    const blocks = [];
    let base = snap.count;
    let textBase = snap.textCount;
    for (const frame of frames) {
      const sub = await this.#page(
        `window.__bu.snapshot(${JSON.stringify({ maxChars: budget, idBase: base, textBase, terms: this.terms })})`,
        frame
      ).catch(() => null);
      if (!sub) continue;
      this.idRanges.push({
        frame,
        base,
        count: sub.count,
        textBase,
        textCount: sub.textCount,
      });
      base += sub.count;
      textBase += sub.textCount;
      more += sub.truncated + sub.belowFold;
      if (sub.lines.length)
        blocks.push({
          y: frame.box.y,
          lines: [`(embedded frame from ${frame.host}:)`, ...sub.lines],
        });
      blocker = pickBlocker(blocker, sub.blocker, viewportShare(frame.box));
    }
    blocks.sort((a, b) => a.y - b.y);
    const body = [];
    snap.lines.forEach((line, i) => {
      while (blocks.length && blocks[0].y < snap.lineY[i])
        body.push(...blocks.shift().lines);
      body.push(line);
    });
    blocks.forEach((block) => body.push(...block.lines));

    const lines = [
      `URL: ${snap.url}`,
      `Title: ${snap.title}`,
      `Scroll: ${snap.scrollY}/${snap.maxScrollY}px`,
      "",
      ...(body.length ? body : ["(no visible content)"]),
    ];
    if (more)
      lines.push(
        `(${more} more items further down - scroll down or use read_page to see them)`
      );
    return { text: lines.join("\n") + this.#noticeText(blocker), blocker };
  }

  /** Hand pending notices (and the blocker warning) to the agent, once. */
  #noticeText(blocker = null) {
    const notices = this.notices.splice(0);
    if (blocker)
      notices.unshift(
        BLOCKER_NOTICE[blocker.kind][blocker.wall ? "wall" : "present"]
      );
    return notices.length
      ? `\n\nNotices:\n${notices.map((n) => `- ${n}`).join("\n")}`
      : "";
  }

  /**
   * Wait for any navigation to finish and the DOM to stop changing. Single-page apps keep rendering
   * long after "loaded", so the DOM must hold still for ~0.5s and not be a bare shell.
   */
  async #settle(maxMs = 10_000) {
    await sleep(200);
    const started = Date.now();
    while (this.tab.isLoading && Date.now() - started < maxMs) await sleep(150);
    let last = -1;
    let stable = 0;
    for (let i = 0; i < 20; i++) {
      const size = await this.#page("window.__bu.domSize()").catch(() => -1);
      stable = size === last ? stable + 1 : 0;
      if (stable >= 2 && size > 1_000) break;
      last = size;
      await sleep(250);
    }
  }

  async #click(x, y) {
    await this.tab.mouse("move", x, y);
    await sleep(40 + Math.random() * 40);
    await this.tab.mouse("down", x, y);
    await sleep(30 + Math.random() * 50);
    await this.tab.mouse("up", x, y);
  }

  /** Press a key or a combination ("Enter", "Control+A", "Shift+Tab", "Meta+K") with trusted CDP key events. */
  async #key(input) {
    const { modifiers, key, commands } = parseKeys(input);
    const send = (params) => this.tab.send("Input.dispatchKeyEvent", params);
    const def = (k) => ({
      key: k.key,
      code: k.code,
      windowsVirtualKeyCode: k.keyCode,
      nativeVirtualKeyCode: k.keyCode,
    });
    let bits = 0;
    for (const mod of modifiers) {
      bits |= mod.bit;
      await send({ type: "rawKeyDown", modifiers: bits, ...def(mod) });
    }
    // Shortcuts (Control+A) type nothing; plain keys and Shift+key do.
    const text =
      key.text && !(bits & (ALT.bit | CONTROL.bit | META.bit))
        ? key.text
        : undefined;
    await send({
      type: text ? "keyDown" : "rawKeyDown",
      modifiers: bits,
      ...def(key),
      text,
      unmodifiedText: text,
      ...(commands ? { commands } : {}),
    });
    await sleep(30);
    await send({ type: "keyUp", modifiers: bits, ...def(key) });
    for (const mod of [...modifiers].reverse()) {
      bits &= ~mod.bit;
      await send({ type: "keyUp", modifiers: bits, ...def(mod) });
    }
  }

  /////////////////////////////
  // Network write log
  /////////////////////////////

  /** Record same-site write requests (POST/PUT/PATCH/DELETE, websocket sends) while an action runs. */
  #onNetwork(method, params, sessionId) {
    const id = `${sessionId}|${params.requestId}`;
    if (method === "Network.webSocketCreated") {
      if (this.socketUrls.size > 200) this.socketUrls.clear();
      this.socketUrls.set(id, params.url);
      return;
    }
    if (method === "Network.webSocketClosed") {
      this.socketUrls.delete(id);
      return;
    }
    const log = this.sentLog;
    if (!log) return;
    if (method === "Network.requestWillBeSent") {
      const { request, type } = params;
      if (
        /^(GET|HEAD|OPTIONS)$/i.test(request.method) ||
        type === "Ping" ||
        type === "CSPViolationReport"
      )
        return;
      const url = parseUrl(request.url);
      if (!url || !this.#isSiteWrite(url)) return;
      const body = String(request.postData || "").slice(0, 4096);
      if (READ_ONLY_GRAPHQL.test(body)) return; // GraphQL reads sent as POST
      const operation =
        body.match(/"operationName"\s*:\s*"([\w-]{2,60})"/)?.[1] || null;
      log.set(id, {
        label: operation || lastSegment(url),
        method: request.method.toUpperCase(),
        target: shortTarget(url),
        status: null,
        ok: null,
      });
    } else if (method === "Network.responseReceived" && log.has(id)) {
      const entry = log.get(id);
      entry.status = params.response.status;
      entry.ok = params.response.status < 400;
    } else if (method === "Network.loadingFailed" && log.has(id)) {
      const entry = log.get(id);
      if (entry.status === null) entry.ok = params.canceled ? null : false;
    } else if (
      method === "Network.webSocketFrameSent" &&
      !log.has(`ws:${id}`)
    ) {
      const url = parseUrl(this.socketUrls.get(id) || "");
      if (!url || !this.#isSiteWrite(url) || isHeartbeat(params.response))
        return;
      log.set(`ws:${id}`, {
        label: "websocket message",
        method: "WS",
        target: url.host.replace(/^www\./, ""),
        status: null,
        ok: true,
      });
    }
  }

  #isSiteWrite(url) {
    return (
      sameSite(url.hostname, this.tab.url) && !TRACKING_PATH.test(url.pathname)
    );
  }

  /** Stop recording - after giving in-flight requests a moment to come back - and summarize. */
  async #collectSent() {
    const log = this.sentLog;
    if (!log) return [];
    const started = Date.now();
    while (
      [...log.values()].some((r) => r.ok === null && r.method !== "WS") &&
      Date.now() - started < 2_000
    )
      await sleep(150);
    this.sentLog = null;
    return [...log.values()];
  }

  /////////////////////////////
  // Actions
  /////////////////////////////

  /**
   * Run one agent action and return its outcome with the fresh page state. Actions run one at a time:
   * a request the agent already gave up on can still be running, and actions share the network log,
   * the notices and the element refs.
   * @returns {Promise<ActionResult>}
   */
  run(tool, args = {}) {
    const result = this.queue.then(() => this.#execute(tool, args));
    this.queue = result.catch(() => {});
    return result;
  }

  async #execute(tool, args) {
    if (this.closed) throw new Error("The browser session has ended.");
    if (ACTIONS_THAT_SUBMIT.has(tool) || tool === "select_option")
      this.sentLog = new Map();
    let outcome = "";
    let ok = true;
    let sensitive = false;
    let label = "";
    let requested = null;
    let readText = null; // read_page and find_text answer with page text instead of the page state
    let image;
    try {
      switch (tool) {
        case "navigate": {
          const url = normalizeUrl(args.url);
          if (!url)
            throw new Error(`"${args.url}" is not a valid web address.`);
          requested = url;
          await this.tab.load(url).catch(() => {}); // load failures still leave an error page to read
          outcome = `Opened ${url}`;
          break;
        }
        case "click": {
          const id = Number(args.id);
          const frame = this.#frameOf(id);
          const target = await this.#locate(id);
          if (target.error) throw new Error(target.error);
          const before = await this.#fingerprint(frame);
          const urlBefore = this.tab.url;
          const was = await this.#page(
            `window.__bu.elementState(${id})`,
            frame
          ).catch(() => null);
          await sleep(60);
          await this.#click(target.x, target.y);
          label = target.label;
          outcome = `Clicked [${args.id}] ${target.tag} "${target.label}"`;
          await this.#settle();
          const after = await this.#fingerprint(frame);
          // The clicked element itself changed ("Add to cart" -> "Remove") - say so, or the model clicks again.
          // Re-rendered buttons are looked up at the click point - main frame only, on the same page.
          const at =
            frame || this.tab.url !== urlBefore
              ? ""
              : `, ${target.x}, ${target.y}`;
          const now = was
            ? await this.#page(
                `window.__bu.elementState(${id}${at})`,
                frame
              ).catch(() => null)
            : null;
          const change = was && now ? describeChange(was, now) : "";
          if (change) outcome += ` - ${change}`;
          else if (before && before === after)
            outcome += " - but nothing on the page changed";
          break;
        }
        case "type": {
          const id =
            args.id === undefined || args.id === null || args.id === ""
              ? 0
              : Number(args.id);
          if (Number.isNaN(id))
            throw new Error(
              `"${args.id}" is not an element id from the page state.`
            );
          let frame = id ? this.#frameOf(id) : await this.#focusedFrame();
          let typeId = id;
          if (id) {
            const target = await this.#locate(id);
            if (target.error) throw new Error(target.error);
            if (target.isSelect)
              throw new Error(
                `[${id}] is a dropdown. Use select_option instead.`
              );
            label = target.label;
            await this.#click(target.x, target.y);
            // Clicking something that is not a field ("Start a post") usually opens the real editor.
            if (!target.editable) await this.#settle(4_000);
            else await sleep(80);
          }
          const clear = args.clear !== false;
          let prep = await this.#page(
            `window.__bu.prepareType(${typeId}, ${clear})`,
            frame
          );
          if (prep.error && !frame && id) {
            // The click may have put the focus in a field inside an embedded frame (a card number box).
            const inner = await this.#focusedFrame();
            if (inner) {
              frame = inner;
              typeId = 0;
              prep = await this.#page(
                `window.__bu.prepareType(0, ${clear})`,
                frame
              );
            }
          }
          if (prep.error) throw new Error(prep.error);
          const text = String(args.text ?? "");
          await this.tab.insertText(text);
          await sleep(120);
          const check = await this.#page(
            `window.__bu.typedInto(${typeId}, ${JSON.stringify(text)})`,
            frame
          );
          sensitive = !!check.password;
          if (!check.ok) {
            const hint = await this.#page(
              "window.__bu.textFieldHint()",
              frame
            ).catch(() => "");
            throw new Error(
              `The text did not go into ${id ? `[${id}]` : "the field"} - ${check.reason}. Nothing was typed. ${hint}`
            );
          }
          if (args.submit) {
            await sleep(100);
            await this.#key("Enter");
          }
          const where = check.field
            ? `the "${check.field}" field`
            : id
              ? `[${id}]`
              : "the focused field";
          outcome = `Typed into ${where}${sensitive ? " (password field)" : ` - it now reads "${check.value}"`}${args.submit ? " and pressed Enter" : ""}`;
          break;
        }
        case "select_option": {
          const id = Number(args.id);
          const result = await this.#page(
            `window.__bu.selectOption(${id}, ${JSON.stringify(String(args.option ?? ""))})`,
            this.#frameOf(id)
          );
          if (result.error) throw new Error(result.error);
          label = result.selected;
          outcome = `Selected "${result.selected}" in [${args.id}]`;
          break;
        }
        case "press_key": {
          const key = String(args.key || "Enter");
          await this.#key(key);
          outcome = `Pressed ${key}`;
          break;
        }
        case "scroll": {
          const down = args.direction !== "up";
          const amount = Math.min(
            Math.max(Number(args.amount) || 600, 100),
            3000
          );
          const id = Number(args.id) || 0;
          const frame = id ? this.#frameOf(id) : null;
          this.scrollFrame = frame;
          const target = await this.#page(
            `window.__bu.scrollTarget(${id})`,
            frame
          );
          const box = frame
            ? await this.#frameBox(frame).catch(() => null)
            : { x: 0, y: 0 };
          if (!box)
            throw new Error(
              `[${id}] is in an embedded frame that is no longer on the page.`
            );
          // Trusted wheel over the thing that should move; JS scroll as a fallback when the wheel is swallowed.
          await this.tab.wheel(
            Math.round(box.x + target.x),
            Math.round(box.y + target.y),
            down ? amount : -amount
          );
          await sleep(350);
          let pos = await this.#page(
            "window.__bu.scrollPos()",
            this.scrollFrame
          );
          if (pos === target.pos)
            pos = await this.#page(
              `window.__bu.scrollByJs(${down ? amount : -amount})`,
              this.scrollFrame
            );
          const where = target.panel ? ` the "${target.panel}" panel` : "";
          const page = target.panel
            ? `the "${target.panel}" panel`
            : "the page";
          const atEdge = down ? target.pos >= target.max - 2 : target.pos <= 2;
          if (pos === target.pos) {
            // Starts with "Already at the" - the agent loop treats that as no progress, not as a loop.
            outcome =
              atEdge || target.max <= 0
                ? `Already at the ${down ? "bottom" : "top"} of ${page} - nothing more ${down ? "below" : "above"}.`
                : `Scrolled ${down ? "down" : "up"}${where} - but nothing moved`;
          } else {
            const max = await this.#page(
              "window.__bu.scrollMax()",
              this.scrollFrame
            ).catch(() => target.max);
            const edge = down ? pos >= max - 2 : pos <= 2;
            outcome = `Scrolled ${down ? "down" : "up"}${where}${edge ? ` - reached the ${down ? "bottom" : "top"} of ${page}` : ""}`;
          }
          break;
        }
        case "go_back": {
          if (!this.tab.canGoBack)
            throw new Error("There is no previous page to go back to.");
          this.tab.goBack();
          outcome = "Went back to the previous page";
          break;
        }
        case "wait": {
          const seconds = Math.min(Math.max(Number(args.seconds) || 2, 1), 10);
          await sleep(seconds * 1000);
          outcome = `Waited ${seconds}s`;
          break;
        }
        case "read_page": {
          // Small models sometimes send the list as a string ("[1, 2, 3]").
          const raw = Array.isArray(args.text_ids)
            ? args.text_ids
            : String(args.text_ids ?? "").match(/\d+/g) || [];
          const ids = raw.map(Number).filter(Boolean);
          readText = await this.#read(ids, Math.round(this.maxChars * 0.9));
          outcome = `Read ${ids.length ? `text ${ids.map((i) => `T${i}`).join(", ")}` : "the page"}`;
          break;
        }
        case "find_text": {
          const query = String(args.text ?? "").trim();
          if (!query) throw new Error("Give the text to find.");
          const found = await this.#page(
            `window.__bu.find(${JSON.stringify(query)}, ${Math.round(this.maxChars * 0.5)}, ${JSON.stringify(this.terms)})`
          );
          if (found.error) throw new Error(found.error);
          if (!found.count) {
            // Not an error: the agent learns the text is not on this page without paging through it.
            outcome = `"${query}" is not on this page. Try other words, or look elsewhere.`;
            readText = "";
            break;
          }
          outcome = `Found "${query}" ${found.count === 1 ? "once" : `${found.count >= 50 ? "50+" : found.count} times`} and scrolled to the first match`;
          readText = found.text;
          break;
        }
        case "state":
          outcome = "Looked at the page";
          break;
        case "screenshot": {
          image = await this.tab.capture({
            width: SCREENSHOT_WIDTH,
            quality: SCREENSHOT_QUALITY,
          });
          if (!image) throw new Error("The screen could not be captured.");
          outcome = "Took a screenshot";
          break;
        }
        default:
          throw new Error(`Unknown browser action "${tool}".`);
      }
    } catch (error) {
      ok = false;
      readText = null;
      outcome = `Failed: ${error?.message || error}`;
    }

    // Looking at the page changes nothing, so there is nothing to wait for. Click settles itself.
    if (
      ![
        "wait",
        "state",
        "click",
        "read_page",
        "find_text",
        "screenshot",
      ].includes(tool)
    )
      await this.#settle();
    const sent = await this.#collectSent();
    if (sent.length) outcome += `\nSent to the site: ${describeSent(sent)}`;
    else if (
      ok &&
      (tool === "click" ||
        tool === "press_key" ||
        (tool === "type" && args.submit))
    )
      outcome += "\nNothing was sent to the site.";
    const tookOver = this.tookOverSinceRead;
    this.tookOverSinceRead = false;
    if (readText !== null)
      return {
        ok,
        outcome,
        sent,
        tookOver,
        state: readText + this.#noticeText(),
        page: await this.#info(),
        thumbnail: null,
      };
    // Asking for one page and landing on another is a strong sign of a sign-in redirect.
    const { text, blocker } = await this.state({
      redirected: !!requested && bouncedAway(requested, this.tab.url),
    });
    return {
      ok,
      outcome,
      target: label,
      sensitive,
      blocker,
      tookOver,
      sent,
      image,
      state: text,
      page: await this.#info(),
      thumbnail: await this.tab.capture({ width: 480, quality: 55 }),
    };
  }

  /** Full page text, or the given [Tn] blocks - wherever on the page (or in which frame) they are. */
  async #read(ids, maxChars) {
    const parts = [];
    if (ids.length) {
      const byFrame = new Map();
      for (const id of ids) {
        const frame = this.#frameOf(id, true);
        byFrame.set(frame, [...(byFrame.get(frame) || []), id]);
      }
      for (const [frame, list] of byFrame)
        parts.push(
          await this.#page(
            `window.__bu.read(${JSON.stringify(list)}, ${maxChars})`,
            frame
          )
        );
    } else {
      parts.push(await this.#page(`window.__bu.read([], ${maxChars})`));
      for (const { frame, textCount } of this.idRanges) {
        if (!frame || !textCount) continue;
        const text = await this.#page(
          "window.__bu.read([], 1500)",
          frame
        ).catch(() => "");
        if (text) parts.push(`(embedded frame from ${frame.host}:)\n${text}`);
      }
    }
    const text = parts.join("\n\n");
    return text.length > maxChars
      ? `${text.slice(0, maxChars)}\n…(truncated)`
      : text;
  }
}

/////////////////////////////
// Helpers (same as the desktop driver)
/////////////////////////////

const STATE_FLAGS = new Set(["checked", "selected", "expanded", "disabled"]);

/** How a click changed the element it hit: its label ("now reads "Remove"") or a flag (checked, expanded). */
function describeChange(was, now) {
  if (now.label && now.label !== was.label)
    return `it now reads "${now.label}"`;
  const flags = (s) => new Set(s.split(" ").filter((f) => STATE_FLAGS.has(f)));
  const [a, b] = [flags(was.state), flags(now.state)];
  const on = [...b].filter((f) => !a.has(f));
  const off = [...a].filter((f) => !b.has(f));
  return [
    ...(on.length ? [`it is now ${on.join(", ")}`] : []),
    ...(off.length ? [`it is no longer ${off.join(", ")}`] : []),
  ].join(" and ");
}

/** Prefer a confident wall, the page's own first. A frame's blocker only counts when the frame is a big part of the screen. */
function pickBlocker(current, inFrame, share) {
  if (!inFrame || share < 0.1) return current;
  const candidate = { ...inFrame, wall: inFrame.wall && share >= 0.25 };
  if (current?.wall) return current;
  if (candidate.wall) return candidate;
  return current || candidate;
}

function viewportShare(box) {
  const w = Math.max(
    0,
    Math.min(box.x + box.w, VIEWPORT.width) - Math.max(box.x, 0)
  );
  const h = Math.max(
    0,
    Math.min(box.y + box.h, VIEWPORT.height) - Math.max(box.y, 0)
  );
  return (w * h) / (VIEWPORT.width * VIEWPORT.height);
}

// CDP key definitions. `text` makes Chromium send a char/keypress event too.
const NAMED_KEYS = {
  enter: { key: "Enter", code: "Enter", keyCode: 13, text: "\r" },
  tab: { key: "Tab", code: "Tab", keyCode: 9 },
  escape: { key: "Escape", code: "Escape", keyCode: 27 },
  backspace: { key: "Backspace", code: "Backspace", keyCode: 8 },
  delete: { key: "Delete", code: "Delete", keyCode: 46 },
  insert: { key: "Insert", code: "Insert", keyCode: 45 },
  space: { key: " ", code: "Space", keyCode: 32, text: " " },
  arrowup: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
  arrowdown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  arrowleft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  arrowright: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
  pageup: { key: "PageUp", code: "PageUp", keyCode: 33 },
  pagedown: { key: "PageDown", code: "PageDown", keyCode: 34 },
  home: { key: "Home", code: "Home", keyCode: 36 },
  end: { key: "End", code: "End", keyCode: 35 },
};
for (let n = 1; n <= 12; n++)
  NAMED_KEYS[`f${n}`] = { key: `F${n}`, code: `F${n}`, keyCode: 111 + n };
const KEY_ALIASES = {
  return: "enter",
  esc: "escape",
  del: "delete",
  spacebar: "space",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
};
// CDP modifier bits: Alt=1, Ctrl=2, Meta/Command=4, Shift=8.
const ALT = { bit: 1, key: "Alt", code: "AltLeft", keyCode: 18 };
const CONTROL = { bit: 2, key: "Control", code: "ControlLeft", keyCode: 17 };
const META = { bit: 4, key: "Meta", code: "MetaLeft", keyCode: 91 };
const SHIFT = { bit: 8, key: "Shift", code: "ShiftLeft", keyCode: 16 };
const IS_MAC = process.platform === "darwin";
const MODIFIERS = {
  alt: ALT,
  option: ALT,
  control: CONTROL,
  ctrl: CONTROL,
  meta: META,
  cmd: META,
  command: META,
  super: META,
  win: META,
  windows: META,
  shift: SHIFT,
  // "the platform's shortcut key"
  mod: IS_MAC ? META : CONTROL,
  cmdorctrl: IS_MAC ? META : CONTROL,
  commandorcontrol: IS_MAC ? META : CONTROL,
};
const PUNCTUATION_KEYCODES = {
  ";": 186,
  "=": 187,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "`": 192,
  "[": 219,
  "\\": 220,
  "]": 221,
  "'": 222,
};
// Synthetic key events never reach the macOS text system, so editing shortcuts need their command named.
const MAC_EDIT_COMMANDS = {
  a: "selectAll",
  c: "copy",
  v: "paste",
  x: "cut",
  z: "undo",
};

/** "Control+A" / "shift + tab" / "Enter" / "k" -> CDP key definitions. */
function parseKeys(input) {
  const raw = String(input || "").trim() || "Enter";
  // "+" itself can be the key ("Control++").
  const parts =
    raw === "+"
      ? ["+"]
      : raw.endsWith("++")
        ? [...raw.slice(0, -2).split(/\s*\+\s*/), "+"]
        : raw.split(/\s*\+\s*/);
  const last = parts.pop();
  const modifiers = [];
  for (const part of parts) {
    const mod = MODIFIERS[part.toLowerCase()];
    if (!mod)
      throw new Error(
        `"${part}" in "${raw}" is not a modifier key. Use Control, Shift, Alt or Meta, e.g. "Control+A".`
      );
    if (!modifiers.includes(mod)) modifiers.push(mod);
  }
  const name = last.toLowerCase().replace(/\s+/g, "");
  const loneModifier = MODIFIERS[name];
  if (loneModifier && !modifiers.length)
    return {
      modifiers: [],
      key: {
        key: loneModifier.key,
        code: loneModifier.code,
        keyCode: loneModifier.keyCode,
      },
    };
  let key = NAMED_KEYS[KEY_ALIASES[name] || name];
  if (!key && [...last].length === 1) key = charKey(last, modifiers);
  if (!key)
    throw new Error(
      `"${last}" is not a key press_key knows. Use a key name (Enter, Tab, Escape, ArrowDown, PageDown, F5...), a single character, or a combination like "Control+A".`
    );

  let commands;
  const letter = key.code.startsWith("Key")
    ? key.code.slice(3).toLowerCase()
    : "";
  if (
    IS_MAC &&
    MAC_EDIT_COMMANDS[letter] &&
    (modifiers.includes(META) || modifiers.includes(CONTROL)) &&
    !modifiers.includes(ALT)
  ) {
    // Models write "Control+A" whatever the platform - on a Mac the shortcut is Command+A.
    const i = modifiers.indexOf(CONTROL);
    if (i !== -1 && !modifiers.includes(META)) modifiers[i] = META;
    commands = [
      letter === "z" && modifiers.includes(SHIFT)
        ? "redo"
        : MAC_EDIT_COMMANDS[letter],
    ];
  }
  return { modifiers, key, commands };
}

function charKey(ch, modifiers) {
  if (/^[a-z]$/i.test(ch)) {
    const upper = ch.toUpperCase();
    // A lone "A" types a capital; in a shortcut the letter's case comes from Shift ("Control+A" is key "a").
    const key = modifiers.includes(SHIFT)
      ? upper
      : modifiers.length
        ? upper.toLowerCase()
        : ch;
    return {
      key,
      code: `Key${upper}`,
      keyCode: upper.charCodeAt(0),
      text: key,
    };
  }
  if (/^\d$/.test(ch))
    return { key: ch, code: `Digit${ch}`, keyCode: ch.charCodeAt(0), text: ch };
  return {
    key: ch,
    code: "",
    keyCode: PUNCTUATION_KEYCODES[ch] || 0,
    text: ch,
  };
}

function isHeartbeat(frame = {}) {
  if (frame.opcode !== undefined && frame.opcode !== 1 && frame.opcode !== 2)
    return true; // control frames
  const payload = String(frame.payloadData || "");
  return payload.trim().length < 16 || WS_HEARTBEAT.test(payload.slice(0, 300));
}

// Second-level labels that belong to a country's public suffix (bbc.co.uk, abc.net.au, gov.br, amazon.co.jp).
const CC_SECOND_LEVEL = new Set(
  "co com net org gov edu ac ne or go gob mil nic ltd plc nom sch gen biz info int res web firm ind nhs me id gr lg ed ad".split(
    " "
  )
);
// Hosting suffixes where every subdomain belongs to someone else.
const SHARED_HOSTS = new Set(
  "github.io gitlab.io herokuapp.com vercel.app netlify.app pages.dev workers.dev web.app firebaseapp.com appspot.com blogspot.com azurewebsites.net cloudfront.net onrender.com fly.dev glitch.me ngrok.io ngrok-free.app".split(
    " "
  )
);

/**
 * The registrable domain of a host (api.x.com -> x.com, news.bbc.co.uk -> bbc.co.uk). There is no
 * public suffix list here, so country second-level suffixes and shared hosting domains are approximated.
 */
function siteOf(host) {
  const h = host.toLowerCase().replace(/\.$/, "");
  if (!h.includes(".") || h.includes(":") || /^[\d.]+$/.test(h)) return h; // localhost, IPv6, IPv4
  const labels = h.split(".");
  const tld = labels[labels.length - 1];
  const sld = labels[labels.length - 2];
  const multiPart =
    SHARED_HOSTS.has(`${sld}.${tld}`) ||
    (tld.length === 2 && CC_SECOND_LEVEL.has(sld));
  return labels.slice(multiPart ? -3 : -2).join(".");
}

/** Same site = same registrable domain (x.com / api.x.com, www.linkedin.com / linkedin.com). */
function sameSite(host, pageUrl) {
  const page = parseUrl(pageUrl);
  return !!page && siteOf(host) === siteOf(page.hostname);
}

function parseUrl(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function hostOf(url) {
  return parseUrl(url)?.host.replace(/^www\./, "") || "another site";
}

/** host + path with ids/hashes collapsed, e.g. x.com/i/api/graphql/…/CreateTweet */
function shortTarget(url) {
  const path = url.pathname
    .split("/")
    .map((part) => (isOpaqueId(part) ? "…" : part))
    .join("/");
  const text = `${url.host.replace(/^www\./, "")}${path}`;
  return text.length > 80 ? `${text.slice(0, 79)}…` : text;
}

// Ids, hashes and tokens in a path say nothing to the model - collapse them.
function isOpaqueId(part) {
  if (
    part.length > 24 ||
    /^[0-9a-f-]{12,}$/i.test(part) ||
    /^\d{5,}$/.test(part)
  )
    return true;
  return part.length >= 16 && /\d/.test(part) && /[a-z]/i.test(part);
}

function lastSegment(url) {
  const parts = url.pathname
    .split("/")
    .filter((p) => p && p.length <= 40 && !/^\d+$/.test(p));
  return parts.at(-1) || url.host;
}

function describeSent(sent) {
  const status = (r) =>
    r.method === "WS"
      ? "sent"
      : r.status
        ? `${r.status}${r.ok ? " OK" : " (failed)"}`
        : r.ok === false
          ? "failed"
          : "no reply yet";
  const shown = sent
    .slice(0, 3)
    .map((r) =>
      r.method === "WS"
        ? `a websocket message on ${r.target}`
        : `${r.method} ${r.target}${r.label !== lastSegmentOf(r.target) ? ` (${r.label})` : ""} -> ${status(r)}`
    );
  return (
    shown.join("; ") + (sent.length > 3 ? `; and ${sent.length - 3} more` : "")
  );
}

function lastSegmentOf(target) {
  return target.split("/").filter(Boolean).at(-1) || "";
}

/**
 * Asked for a specific page and ended up somewhere else (x.com/home -> x.com/i/flow/login).
 * Homepages are ignored since they legitimately redirect (regional domains, locales).
 */
function bouncedAway(requested, landed) {
  try {
    const [from, to] = [new URL(requested), new URL(landed)];
    const path = (u) => u.pathname.replace(/\/$/, "");
    if (!path(from)) return false;
    return path(from) !== path(to);
  } catch {
    return false;
  }
}

function normalizeUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

module.exports = {
  BrowserSession,
  parseKeys,
  describeChange,
  siteOf,
  sameSite,
};
