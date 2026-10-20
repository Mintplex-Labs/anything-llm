const { v4: uuidv4 } = require("uuid");
const Provider = require("../../providers/ai-provider");
const { safeJsonParse } = require("../../../../http");
const { MODEL_PRICING } = require("../../../../helpers/modelPricing");
const { BrowserBridge } = require("./bridge");
const { BrowserTraces, sitesOf } = require("./traces");
const {
  BROWSER_TOOLS,
  SCREENSHOT_TOOL,
  CONTROL_TOOLS,
  BROWSER_TOOL_NAMES,
  BORROWABLE_SKILLS,
  systemPrompt,
  jsonProtocolPrompt,
  stepLabel,
  clip,
  taskTerms,
} = require("./tools");

const MAX_STEPS = 40;
const MAX_NUDGES = 2;
const HELP_TIMEOUT_MS = 15 * 60_000;
const ACTION_TIMEOUT_MS = 60_000;
// Made-up stand-ins for real values ("YOUR_PASSWORD", "[Your Apple ID]") must never be typed.
const PLACEHOLDER_TEXT = [
  /^\s*[[<{(]\s*(your|enter|insert)\b[^\]>})]*[\]>})]\s*$/i,
  /^\s*(your|enter|insert)[\s_-]+(user ?name|email|e-mail|password|passcode|phone( number)?|apple id|id|code|otp|account)\b/i,
  /^[A-Z0-9]+(_[A-Z0-9]+)*_(USER(NAME)?|EMAIL|PASSWORD|PHONE|CODE|OTP|NAME|ID)\b/,
];
// A cycle of 1-3 actions repeated this many times in a row counts as a loop.
const LOOP_REPEATS = 3;
// Steps in a row that showed nothing new (page, content or note): warn, then end the session.
const STALL_WARN = 5;
const STALL_LIMIT = 8;
// All calls, prompt + completion.
const MAX_SESSION_TOKENS = 200_000;
// Drift: new pages keep coming but none relate to the task. Triggers a progress check, then ends.
const DRIFT_CHECK = 4;
const DRIFT_LIMIT = 12;
const CHECK_EVERY = 10;
const MAX_CHECKPOINTS = 4;
// Ids in a URL path (product 695807, ASIN B0CHX1W1XY) cannot be guessed - see #madeUpUrl.
const ID_TOKEN = /\d{5,}|\b(?=[A-Z0-9]*\d)(?=[A-Z0-9]*[A-Z])[A-Z0-9]{8,12}\b/g;

// Page digests (see #digest): task-relevant lines kept per visited page, purely lexical.
const DIGEST_LINES = 5;
const DIGEST_PAGES = 6;
const PAGE_TEXT_CHARS = 4_000;
// How often #finalAnswer may send the agent back to work - small models stop after the first site.
const MAX_DONE_CHECKS = 2;

const MAX_SCREENSHOTS = 3;

const RESUME_NOTES = 10;
const RESUME_PROGRESS = 5;
const RESUME_LINES = 3;
const RESUME_SUMMARY_CHARS = 2_000;

/** How a resolved blocker is described in the agent's progress notes after a context reset. */
const BLOCKER_RESOLVED = {
  login: "signed in",
  captcha: "completed the human check",
  verification: "entered the verification code",
};

/** What the user is asked at a sign-in wall, bot check or verification step. */
const BLOCKER_QUESTIONS = {
  login: (site) =>
    `${site} is asking you to sign in. ${BrowserBridge.TAKE_CONTROL_HINT}, sign in, then press Continue - or reply with how you would like me to proceed.`,
  captcha: (site) =>
    `${site} wants to check that you are human. ${BrowserBridge.TAKE_CONTROL_HINT}, complete the check, then press Continue.`,
  verification: (site) =>
    `${site} is asking for a verification code. ${BrowserBridge.TAKE_CONTROL_HINT} and enter it, or reply with the code, then press Continue.`,
};

/**
 * @typedef {Object} BrowserAgentRecord - one executed tool call in the sub-agent history
 * @property {{name: string, args: Object, raw: Object}} call
 * @property {string} full - result as shown when it is the latest record
 * @property {string} short - one-line result once it is older
 * @property {string|null} medium - trimmed result kept a little longer (reads, user replies)
 */

/**
 * The browser sub-agent. It runs its own tool loop with the workspace's agent model and drives
 * the browser through BrowserBridge, so it never knows where that browser runs.
 * Built for small models: only the latest page state is kept in full, older steps collapse to one
 * line, and screenshots are rare and vision-only.
 */
class BrowserAgent {
  /**
   * @param {Object} opts
   * @param {import("../../index.js")} opts.aibitat - parent AIbitat instance
   * @param {string} opts.task
   * @param {string} opts.profile - browser profile key, chosen for the user by the plugin
   * @param {string|null} opts.startUrl
   * @param {string|null} opts.attentionPath - in-app path to the chat for notifications
   * @param {string|null} [opts.threadSlug] - thread the chat runs in (null for the default chat)
   * @param {import("./traces").BrowserTrace|null} [opts.resumeFrom] - earlier session to continue
   * @param {string|null} [opts.resumeQuery] - what the model passed as `resume`, when it did
   * @param {(update: Object) => void} opts.onUpdate
   */
  constructor({
    aibitat,
    task,
    profile,
    startUrl,
    attentionPath,
    threadSlug = null,
    resumeFrom = null,
    resumeQuery = null,
    onUpdate,
  }) {
    this.aibitat = aibitat;
    this.task = task;
    this.startUrl = startUrl || null;
    this.attentionPath = attentionPath || null;
    this.resumeFrom = resumeFrom?.resume ? resumeFrom : null;
    this.resumeQuery = resumeQuery || null;
    const resume = this.resumeFrom?.resume || null;
    this.profileRequest = profile;
    // A resumed run reopens the page the earlier session ended on - unless the model asked for
    // another site. Windows are never kept between runs; the profile keeps the cookies.
    const savedUrl = resume?.url || resume?.pages?.[0]?.url || null;
    this.reopening =
      !!savedUrl &&
      (!this.startUrl || hostOf(this.startUrl) === hostOf(savedUrl));
    if (this.reopening) this.startUrl = savedUrl;
    this.onUpdate = onUpdate || (() => {});
    this.id = uuidv4();

    /** @type {BrowserAgentRecord[]} */
    this.records = [];
    this.initialState = "The browser is open on a blank page.";
    this.question = null;
    this.nudges = 0;
    this.stopReason = null;
    this.estimatedTokens = false;
    this.pendingReply = null;
    // "host:kind" walls the user already helped with - never pause twice for the same one.
    this.acknowledged = new Set();
    this.lastBlocker = null;
    // Notes carried across context resets (see #resetContext).
    this.progress = [];
    this.loopWarnings = 0;
    // "url|top" / "url|bottom" ends of pages the agent already scrolled into.
    this.edges = new Set();
    this.pageLines = new Map();
    this.seenLines = new Set();
    this.seenUrls = new Set();
    this.stall = 0;
    this.stallWarned = false;
    this.drift = 0;
    this.giveUpReason = null;
    this.checkpoints = 0;
    this.lastCheckpoint = 0;
    this.wentBack = false;
    // One-line plan from the latest progress check.
    this.plan = null;
    this.taskTerms = taskTerms(task);
    // A navigated URL may only use ids seen here (see #madeUpUrl).
    this.seenIds = new Set(`${task} ${startUrl || ""}`.match(ID_TOKEN) || []);
    this.notes = [];
    this.noteFacts = new Set();
    this.opens = new Map();
    /** @type {Map<string, {url: string, title: string, lines: Array<{line: string, score: number, matched: boolean}>, score: number, relevant: number}>} page -> key lines (see #digest) */
    this.visited = new Map();
    if (resume) this.#seedFromResume(resume);
    this.currentUrl = null;
    this.doneChecks = 0;
    this.stopped = new Promise((resolve) => (this.resolveStopped = resolve));

    const { defaultProvider = {} } = aibitat;
    this.trace = {
      id: this.id,
      task,
      profile,
      status: "running",
      summary: null,
      workspace: aibitat.handlerProps?.invocation?.workspace
        ? {
            slug: aibitat.handlerProps.invocation.workspace.slug,
            name: aibitat.handlerProps.invocation.workspace.name,
          }
        : null,
      threadSlug: threadSlug || null,
      userId: aibitat.handlerProps?.invocation?.user_id ?? null,
      resumedFrom: this.resumeFrom?.id || null,
      resumedFromTask: this.resumeFrom ? clip(this.resumeFrom.task, 300) : null,
      model: defaultProvider.model || null,
      tokens: { prompt: 0, completion: 0, total: 0 },
      startedAt: new Date().toISOString(),
      endedAt: null,
      steps: [],
    };
  }

  log(text, ...args) {
    console.log(`\x1b[36m[BrowserAgent]\x1b[0m ${text}`, ...args);
  }

  /////////////////////////////
  // Lifecycle
  /////////////////////////////

  /**
   * Run the task to completion.
   * @returns {Promise<string>} the result handed back to the parent agent
   */
  async run() {
    const onAbort = () => this.stop("aborted");
    this.aibitat.emitter?.once?.("abort", onAbort);
    try {
      await this.#setupProvider();
      await this.#startBrowser();
      await this.#loop();
    } catch (error) {
      if (!this.stopReason) {
        this.log("Session failed:", error.message);
        this.#finish("failed", error.message);
      }
    } finally {
      this.aibitat.emitter?.removeListener?.("abort", onAbort);
      if (this.stopReason && !this.trace.endedAt) this.#finish("stopped", null);
      if (this.browserStarted) this.#saveResumePoint();
      // A stop can land while "start" is still in flight - close once it settles, or the window
      // it opens is left behind.
      Promise.resolve(this.starting)
        .catch(() => {})
        .then(() =>
          BrowserBridge.request("close", { sessionId: this.id }).catch(() => {})
        );
      BrowserTraces.save(this.trace);
      BrowserTraces.prune();
    }
    return this.#resultForParent();
  }

  /** Stop the session. `reason` is "user" (stop button) or "aborted" (whole agent run). */
  stop(reason = "user") {
    if (this.stopReason) return;
    this.stopReason = reason;
    this.pendingReply?.(null);
    this.resolveStopped({ stopped: true });
  }

  /** The user answered an ask_user request from the chat UI. */
  reply(text) {
    if (!this.pendingReply) return false;
    this.pendingReply(
      String(text || "").trim() || "I have done it, please continue."
    );
    return true;
  }

  async #setupProvider() {
    const { aibitat } = this;
    this.provider = aibitat.getProviderForConfig({
      ...aibitat.defaultProvider,
    });
    this.provider.attachHandlerProps?.(aibitat.handlerProps);
    this.native = (await this.provider.supportsNativeToolCalling?.()) !== false;

    const { provider, model } = aibitat.defaultProvider || {};
    this.contextLimit =
      (typeof provider === "string" &&
        Provider.contextLimit(provider, model)) ||
      8_000;
    // ~15% of the context window per page state (4 chars/token), capped at ~1.5k tokens -
    // read_page/scroll get the rest.
    this.maxChars = Math.min(
      Math.max(Math.round(this.contextLimit * 0.6), 3_000),
      6_000
    );

    this.borrowed = BORROWABLE_SKILLS.map((name) =>
      aibitat.functions.get(name)
    ).filter(Boolean);
    this.vision = await detectVision(provider, model);
    this.screenshotsLeft = this.vision ? MAX_SCREENSHOTS : 0;
    this.functions = [
      ...BROWSER_TOOLS,
      ...(this.vision ? [SCREENSHOT_TOOL] : []),
      ...CONTROL_TOOLS,
      ...this.borrowed.map(({ name, description, parameters }) => ({
        name,
        description,
        parameters,
      })),
    ];
    this.log(
      `Using ${provider}:${model} (${this.native ? "native tools" : "JSON actions"}, ${this.contextLimit} ctx${this.vision ? ", screenshots allowed" : ""})`
    );
  }

  async #startBrowser() {
    const started = await this.#requestStart(this.profileRequest);
    if (this.stopReason) return;
    this.browserStarted = true;
    const { profile, result } = started;
    this.trace.profile = profile.name;
    this.profileInfo = {
      name: profile.name,
      id: profile.id || null,
      ephemeral: !!profile.ephemeral,
    };
    if (result) {
      this.initialState = result.state;
      this.lastBlocker = result.blocker || null;
      this.#madeProgress(result);
      this.#recordStep(
        this.reopening ? "resume" : "navigate",
        { url: this.startUrl },
        result
      );
    }
    this.#emit();
    if (result) await this.#pauseForBlocker(result, 0);
  }

  #requestStart(profile) {
    this.starting = BrowserBridge.request(
      "start",
      {
        sessionId: this.id,
        profile,
        maxChars: this.maxChars,
        startUrl: this.startUrl,
        // Long navigation lists in the page state keep the links that mention these.
        terms: this.taskTerms,
      },
      ACTION_TIMEOUT_MS
    );
    return this.#orStop(this.starting);
  }

  /////////////////////////////
  // The loop
  /////////////////////////////

  async #loop() {
    for (let step = 1; step <= MAX_STEPS; step++) {
      if (this.stopReason) return;
      if (this.#overBudget()) return this.#giveUp(this.giveUpReason);
      const call = await this.#nextCall();
      if (this.stopReason) return;

      // Only plain-text replies in a row end the session - one now and then just gets a nudge.
      if (call) this.nudges = 0;
      else {
        if (this.nudges++ >= MAX_NUDGES)
          return this.#finish(
            "incomplete",
            this.lastText ||
              "The browser agent stopped responding with actions."
          );
        this.#pushNudge(
          "You must reply with a tool call. If the task is complete, call done."
        );
        continue;
      }

      if (call.name === "done") {
        const { success = true, result = "" } = call.args || {};
        const draft = String(result || this.lastText || "");
        const { missing, answer } = await this.#finalAnswer(draft, {
          canContinue: step < MAX_STEPS - 2 && !this.#overBudget(),
        });
        if (this.stopReason) return;
        if (missing) {
          this.records.push({
            call,
            full: `Not finished yet - ${missing}. Keep working on the task, then call done again.\n\n[Step ${step} of ${MAX_STEPS}]`,
            short: `Tried to finish early - missing: ${clip(missing, 120)}`,
            medium: null,
          });
          continue;
        }
        return this.#finish(
          success === false || success === "false" ? "incomplete" : "done",
          answer
        );
      }
      await this.#execute(call, step);
      if (this.stopReason) return;
      this.#overBudget();
      if (this.giveUpReason) return this.#giveUp(this.giveUpReason);
      if (this.#checkpointDue(step) && (await this.#checkpoint(step))) return;
    }

    // Out of steps: one last done call if budget allows; the final answer is always written.
    let call = null;
    if (!this.#overBudget()) {
      this.#pushNudge(
        "You are out of steps. Call done now with everything you found so far."
      );
      call = await this.#nextCall([
        CONTROL_TOOLS.find((t) => t.name === "done"),
      ]);
      if (this.stopReason) return;
    }
    const draft = call?.name === "done" ? call.args?.result : this.lastText;
    const { answer } = await this.#finalAnswer(String(draft || ""), {
      canContinue: false,
    });
    if (this.stopReason) return;
    this.#finish(
      "incomplete",
      answer ||
        this.#collected() ||
        "The browser agent ran out of steps before finishing."
    );
  }

  /**
   * Whether the session used up its token budget - sets the give-up reason when it did. Checked
   * before every model call except the final answer, so the user always gets one.
   */
  #overBudget() {
    if (this.trace.tokens.total < MAX_SESSION_TOKENS) return false;
    this.giveUpReason ??= `I used up this session's budget of ${MAX_SESSION_TOKENS / 1000}k tokens`;
    return true;
  }

  /** Resolves with `{stopped: true}` as soon as the session is stopped, even while `promise` is still pending. */
  #orStop(promise) {
    promise.catch(() => {}); // a stop can leave the request in flight
    return Promise.race([promise, this.stopped]);
  }

  /** Ask the model for the next tool call. Resolves null when it answered with plain text. */
  async #nextCall(functions = this.functions) {
    const messages = this.#messages(functions);
    const before = this.provider.getCumulativeUsage?.() || {};
    const startedAt = Date.now();
    let response;
    try {
      response = await this.#orStop(
        this.provider.complete(messages, this.native ? functions : [])
      );
    } catch (error) {
      if (this.stopReason || !this.records.at(-1)?.image) throw error;
      // The model turned out not to take images - carry on without screenshots.
      this.log(
        `Image request failed (${error.message}) - disabling screenshots`
      );
      this.#disableScreenshots();
      return this.#nextCall(
        functions.filter((f) => f.name !== SCREENSHOT_TOOL.name)
      );
    }
    if (response?.stopped) return null;

    this.#trackUsage(before, messages, response, Date.now() - startedAt);
    this.lastText = stripThinking(response?.textResponse || "");
    if (response?.functionCall?.name) {
      const raw = {
        ...response.functionCall,
        id: response.functionCall.id || `call_${uuidv4()}`,
      };
      return { name: raw.name, args: normalizeArgs(raw.arguments), raw };
    }
    const parsed = parseJsonAction(this.lastText);
    if (!parsed) return null;
    return {
      ...parsed,
      synthetic: true,
      raw: {
        id: `call_${uuidv4()}`,
        name: parsed.name,
        arguments: parsed.args,
      },
    };
  }

  async #execute(call, step) {
    const { name } = call;
    const { note, ...args } = call.args || {};
    // A note is progress only when it records a new fact - small models write a fresh plan
    // ("Scroll down to find X", "Retrying the main page") with every action, which is not progress.
    const noted =
      typeof note === "string" && note.trim()
        ? this.#saveNote(note) && this.#newFacts(note)
        : false;
    let full,
      short,
      medium = null,
      result = null,
      progressed = false,
      relevant = noted;

    if (
      name === "type" &&
      PLACEHOLDER_TEXT.some((re) => re.test(String(args.text ?? "")))
    ) {
      const refusal = `Not typed: "${clip(args.text, 60)}" is a placeholder, not a real value. Never type made-up credentials or details. If you need them, call ask_user and ask the user to sign in in the browser.`;
      this.records.push({
        call,
        full: `${refusal}\n\n[Step ${step} of ${MAX_STEPS}]`,
        short: refusal,
        medium: null,
      });
      this.stall++;
      this.drift++;
      return;
    }

    const madeUp = name === "navigate" ? this.#madeUpUrl(args.url) : null;
    if (madeUp) {
      const refusal = `Not opened: ${clip(args.url, 120)} contains an id (${madeUp}) that is not on any page you saw, so the address is probably made up. Click the link on the page, or use the site's search, instead.`;
      this.records.push({
        call,
        full: `${refusal}\n\n[Step ${step} of ${MAX_STEPS}]`,
        short: refusal,
        medium: null,
      });
      this.stall++;
      this.drift++;
      return;
    }

    if (name === "screenshot") {
      const refusal = !this.vision
        ? 'There is no tool named "screenshot".'
        : this.screenshotsLeft <= 0
          ? "No screenshots left for this session. Use the page state."
          : this.records.at(-1)?.call?.name === "screenshot"
            ? "You just took a screenshot. Act on it or use the page state."
            : null;
      if (refusal) {
        this.records.push({
          call,
          full: `${refusal}\n\n[Step ${step} of ${MAX_STEPS}]`,
          short: refusal,
          medium: null,
        });
        this.stall++;
        this.drift++;
        return;
      }
      this.screenshotsLeft--;
    }

    if (name === "ask_user") {
      const reply = await this.#askUser(
        String(args.question || "I need your help to continue.")
      );
      if (this.stopReason) return;
      this.#resetStall();
      if (reply.reset) return;
      full = reply.full;
      short = medium = reply.short;
      progressed = relevant = true;
    } else if (BROWSER_TOOL_NAMES.has(name)) {
      result = await this.#orStop(
        BrowserBridge.request(
          "act",
          { sessionId: this.id, tool: name, args },
          ACTION_TIMEOUT_MS
        ).catch((error) => ({
          ok: false,
          outcome: `Failed: ${error.message}`,
          state: "",
          page: {},
        }))
      );
      if (this.stopReason) return;
      this.#recordStep(name, args, result);
      this.lastBlocker = result.blocker || null;
      // Element ids change as a page lazy-loads; the label and page say what was really clicked.
      if (result.target)
        call.target = `${result.target}@${result.page?.url || ""}`;
      const seen = this.#madeProgress(result);
      progressed = seen.fresh || noted;
      relevant ||= seen.relevant;
      full = `${result.outcome}\n\n${result.state}`;
      short = `${result.outcome}${result.page?.title ? ` (on "${clip(result.page.title, 60)}")` : ""}`;
      if (name === "read_page" || name === "find_text")
        medium = clip(result.state, 1_500);
      if (name === "screenshot" && result.image)
        full += `\n\nThe screenshot is attached below. ${this.screenshotsLeft} screenshot(s) left.`;
    } else if (this.borrowed.some((fn) => fn.name === name)) {
      const output = await this.#orStop(this.#runBorrowed(name, args));
      if (this.stopReason) return;
      full = clip(output, this.maxChars);
      medium = clip(output, 1_500);
      short = clip(output, 200);
      this.#recordStep(name, args, { ok: true, page: {} });
      progressed = relevant = !this.seenLines.has(`tool:${output}`) || noted;
      this.seenLines.add(`tool:${output}`);
    } else {
      full =
        short = `There is no tool named "${name}". Use one of: ${this.functions.map((f) => f.name).join(", ")}.`;
    }

    // Repeating an action is fine while it keeps showing new things (scrolling a long list). Clicks
    // and keys must show something related to the task - pages that lazy-load keep changing anyway.
    const moved = ["scroll", "read_page", "find_text", "wait"].includes(name)
      ? progressed
      : relevant;
    // Scrolling into the end of a page is no progress, but the first time is not a loop either -
    // usually the agent just read to the end. Tell it plainly that there is nothing more.
    const edge =
      name === "scroll" &&
      /^Already at the (top|bottom)/.test(String(result?.outcome || ""))
        ? `${this.currentUrl}|${args.direction === "up" ? "top" : "bottom"}`
        : null;
    const firstEdge = !!edge && !this.edges.has(edge);
    if (edge) this.edges.add(edge);
    if (firstEdge)
      full += `\n\nYou have seen the whole page. If what you saw on it (your notes and the earlier page states) answers the task, call done now. Otherwise scroll ${args.direction === "up" ? "down" : "up"}, read_page, or go elsewhere - scrolling ${args.direction === "up" ? "up" : "down"} again shows nothing new.`;
    // Re-opening the same address with other steps in between escapes #loopOf - count it instead.
    const opened = result?.page?.url
      ? String(result.page.url)
          .replace(/[#?].*$/, "")
          .replace(/\/$/, "")
      : null;
    const reopened =
      name === "navigate" && opened ? (this.opens.get(opened) || 0) + 1 : 0;
    if (reopened) this.opens.set(opened, reopened);
    if (reopened >= 3)
      full += `\n\nYou have opened this address ${reopened} times. Opening it again will not change anything. If the site is down or the page does not have what you need, call done with success=false and say what is in the way.`;
    const loop = moved || firstEdge ? null : this.#loopOf(call);
    if (loop && this.loopWarnings++ === 0)
      full += `\n\nSTOP: you are repeating the same actions in a loop (${loop}) and it is not working. Try a completely different approach - a different element, a direct URL, or a keyboard key. If you are stuck, call ask_user.`;
    else if (loop && this.loopWarnings > 1)
      this.giveUpReason = `I kept repeating the same actions (${loop}) without getting anywhere`;

    if (relevant && !loop) this.drift = 0;
    else if (++this.drift >= DRIFT_LIMIT)
      this.giveUpReason ??= `the last ${this.drift} steps found nothing related to the task`;

    if (progressed) this.#resetStall({ drift: false });
    else if (++this.stall >= STALL_LIMIT)
      this.giveUpReason ??= `I made no progress in the last ${this.stall} steps`;
    else if (this.stall >= STALL_WARN && !this.stallWarned) {
      this.stallWarned = true;
      full += `\n\nWARNING: your last ${this.stall} actions showed nothing new - you are not making progress. Try a completely different approach (a direct URL, a different element, the site's search). If the site will not cooperate, call done with success=false and explain what is in the way. After ${STALL_LIMIT - this.stall} more steps without progress this session ends.`;
    }

    this.records.push({
      call,
      full: `${full}\n\n[Step ${step} of ${MAX_STEPS}]`,
      short,
      medium,
      // Only ever sent while this is the latest record (see #messages).
      image: name === "screenshot" ? result?.image || null : null,
      // It showed something new - a repeat of it is not part of a loop (see #loopOf).
      moved: !!moved,
    });
    if (result && (await this.#pauseForBlocker(result, step)))
      this.#resetStall();
  }

  /**
   * What a step showed that was not seen this session. `fresh`: a new URL or new page lines (ids and
   * digits ignored, so renumbering and counters do not count). `relevant`: a new line mentions the task.
   * A failed action never counts, but what it showed is still remembered.
   */
  #madeProgress(result) {
    let fresh = false,
      relevant = false;
    const url = result?.page?.url;
    if (url && !this.seenUrls.has(url)) {
      this.seenUrls.add(url);
      fresh = true;
    }
    const state = String(result?.state || "");
    for (const id of state.match(ID_TOKEN) || []) this.seenIds.add(id);
    for (const id of String(url || "").match(ID_TOKEN) || [])
      this.seenIds.add(id);
    const terms = this.#terms(hostOf(url));
    for (const line of state.split("\n")) {
      const key = line
        .replace(/^\s*\[T?\d+\]/, "")
        .replace(/\d+/g, "#")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      if (key.length < 3 || this.seenLines.has(key)) continue;
      this.seenLines.add(key);
      fresh = true;
      if (!relevant && /^\s*\[T?\d+\]/.test(line))
        relevant = terms.some((term) => key.includes(term));
    }
    if (result?.ok === false) return { fresh: false, relevant: false };
    return { fresh, relevant };
  }

  /** Task words that count on this site - the site's own name ("Micro Center" on microcenter.com) is on every page. */
  #terms(host) {
    const compact = String(host || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    return this.taskTerms.filter((term) => !compact.includes(term));
  }

  /**
   * A navigate to an address with an id (product, listing, post) that never appeared on a page,
   * in the task or in a visited URL - small models make these up. Only the path is checked, so
   * search URLs with any query still work.
   * @returns {string|null} the made-up id
   */
  #madeUpUrl(url) {
    let path;
    try {
      path = decodeURIComponent(
        new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).pathname
      );
    } catch {
      return null;
    }
    return (
      (path.match(ID_TOKEN) || []).find((id) => !this.seenIds.has(id)) || null
    );
  }

  /** @param {{drift?: boolean}} opts - drift: false when the step only showed new (maybe unrelated) content */
  #resetStall({ drift = true } = {}) {
    this.stall = 0;
    this.stallWarned = false;
    if (!drift) return;
    // Lazy-loading noise must not wipe a loop warning - only real help or going back does.
    this.drift = 0;
    this.loopWarnings = 0;
  }

  /////////////////////////////
  // Progress checks
  /////////////////////////////

  #checkpointDue(step) {
    if (
      step < 5 ||
      this.#overBudget() ||
      this.checkpoints >= MAX_CHECKPOINTS ||
      step - this.lastCheckpoint < 3
    )
      return false;
    if (this.drift >= DRIFT_CHECK) return true;
    // Left a page that really had task content (not just a weekly-ad price) and found nothing since.
    const best = this.#bestPage();
    if (best?.relevant >= 2 && best.url !== this.currentUrl && this.drift >= 2)
      return true;
    return step - this.lastCheckpoint >= CHECK_EVERY;
  }

  /**
   * One short call outside the action loop: keep going, answer now, go back to the best page, or
   * give up. Small models judge this far better as its own question than while picking clicks.
   * @returns {Promise<boolean>} whether the session ended
   */
  async #checkpoint(step) {
    this.checkpoints++;
    this.lastCheckpoint = step;
    const best = this.#bestPage();
    const struggling = this.drift >= DRIFT_CHECK || this.stall >= STALL_WARN;
    const recent = this.trace.steps
      .slice(-8)
      .map(
        (s) =>
          `- ${s.label}${s.ok ? "" : " (failed)"}${s.title ? ` - on "${clip(s.title, 60)}"` : ""}`
      )
      .join("\n");
    const notes = this.notes.map((n) => `- ${n}`).join("\n") || "(none)";
    const messages = [
      {
        role: "system",
        content: `You check on a browser agent that is doing a task for the user. Decide what it should do next. Reply with ONE word on the first line:
CONTINUE - it is on track and the task needs more work.
FINISH - the information below already answers the task (or the task's action is done), so it should stop and answer now.
BACK - it wandered off to pages unrelated to the task and should return to the most useful page.
GIVE_UP - the site clearly does not have what the task needs, or there is no realistic way forward.
Prefer FINISH over BACK when the useful pages above already show what the task asks for.
On the second line write one short sentence: for CONTINUE or BACK, the single next step to take; for FINISH or GIVE_UP, why.`,
      },
      {
        role: "user",
        content: `Task: ${this.task}\n\nAgent notes:\n${notes}${this.#visitedSummary({ includeCurrent: true })}${this.#sentSummary()}\n\nLast steps:\n${recent}\n\nCurrent page:\n${clip(this.records.at(-1)?.full || this.initialState, 2_000)}`,
      },
    ];
    let verdict, reason;
    try {
      const before = this.provider.getCumulativeUsage?.() || {};
      const startedAt = Date.now();
      const response = await this.#orStop(this.provider.complete(messages, []));
      if (response?.stopped) return true;
      this.#trackUsage(before, messages, response, Date.now() - startedAt);
      const parsed = parseVerdict(response?.textResponse);
      if (!parsed) return false;
      ({ verdict, reason } = parsed);
    } catch (error) {
      this.log("Progress check failed:", error.message);
      return false;
    }
    // A healthy run is never ended by a check - giving up needs real signs of being stuck.
    if (verdict === "GIVE_UP" && !struggling) verdict = "CONTINUE";
    if (verdict === "BACK" && (!best || best.url === this.currentUrl))
      verdict = "CONTINUE";
    // Sent back once and wandered off again: answer with what the best page had.
    if (verdict === "BACK" && this.wentBack) verdict = "FINISH";
    this.log(
      `Progress check at step ${step}: ${verdict}${reason ? ` - ${reason}` : ""}`
    );
    this.#recordStep(
      "checkpoint",
      { verdict, title: best?.title },
      { ok: true, page: this.trace.steps.at(-1) || {} }
    );

    if (verdict === "GIVE_UP") {
      this.giveUpReason = `I could not find a way forward${reason ? ` (${reason.replace(/\.$/, "")})` : ""}`;
      await this.#giveUp(this.giveUpReason);
      return true;
    }
    if (verdict === "FINISH") {
      const { missing, answer } = await this.#finalAnswer(this.lastText || "", {
        canContinue: step < MAX_STEPS - 2 && !this.#overBudget(),
        context: reason ? `A progress check found: ${reason}` : null,
      });
      if (this.stopReason) return true;
      if (!missing) {
        this.#finish(
          "done",
          answer || this.#collected() || "The browser agent finished the task."
        );
        return true;
      }
      this.plan = `Still missing: ${missing}`;
      this.drift = 0;
      return false;
    }
    if (verdict === "BACK") {
      this.wentBack = true;
      const args = { url: best.url };
      const result = await this.#orStop(
        BrowserBridge.request(
          "act",
          { sessionId: this.id, tool: "navigate", args },
          ACTION_TIMEOUT_MS
        ).catch(() => null)
      );
      if (this.stopReason) return true;
      if (result) {
        this.#recordStep("navigate", args, result);
        this.#madeProgress(result);
        this.lastBlocker = result.blocker || null;
        const call = {
          name: "navigate",
          args,
          synthetic: true,
          raw: { id: `call_${uuidv4()}`, name: "navigate", arguments: args },
        };
        this.records.push({
          call,
          full: `You had wandered away from the task, so you were taken back to the most useful page so far.${reason ? ` Next: ${reason}` : ""}\n\n${result.outcome}\n\n${result.state}\n\n[Step ${step} of ${MAX_STEPS}]`,
          short: `Taken back to "${clip(best.title, 60)}" after wandering off`,
          medium: null,
        });
      }
    }
    this.plan = reason || this.plan;
    // "Keep going" does not reset the stall and drift counters - only actually going back does.
    if (verdict === "BACK") this.#resetStall();
    return false;
  }

  /** The visited page with the most task-related content (prices alone do not count). */
  #bestPage() {
    let best = null;
    for (const page of this.visited.values())
      if (page.relevant && (!best || page.score > best.score)) best = page;
    return best;
  }

  /**
   * The agent is clearly not getting anywhere (or hit its budget): end the session and hand back
   * to the user with whatever was found, instead of letting a struggling model spin.
   */
  async #giveUp(reason) {
    this.log(`Giving up: ${reason}`);
    const { answer, answered } = await this.#finalAnswer(this.lastText || "", {
      canContinue: false,
      giveUp: true,
      context: `The agent stopped early because ${reason}. If the information above already answers the task, give that full answer. Otherwise say what was found so far and where it got stuck.`,
    });
    if (this.stopReason) return;
    // It had already seen what the task asks for (it scrolled past the answer, then got stuck).
    if (answered && answer) {
      this.log(`Stopped early (${reason}), but what it saw answers the task`);
      return this.#finish("done", answer);
    }
    this.trace.gaveUp = reason;
    const found = answer || this.#collected();
    this.#finish(
      "incomplete",
      `I stopped early because ${reason}.${found ? `\n\n${found}` : ""}`
    );
  }

  /**
   * Sign-in walls, bot checks and verification codes are a hard stop: when the page is
   * confidently one of those, ask the user before the model gets another turn.
   * @returns {Promise<boolean>} whether the session paused
   */
  async #pauseForBlocker(result, step) {
    const blocker = result?.blocker;
    if (!blocker?.wall || this.stopReason) return false;
    const site = hostOf(result.page?.url) || "This site";
    const key = `${site}:${blocker.kind}`;
    if (this.acknowledged.has(key)) return false;
    this.acknowledged.add(key);

    const question = BLOCKER_QUESTIONS[blocker.kind](site);
    this.log(`Paused for ${blocker.kind} on ${site} (score ${blocker.score})`);
    const reply = await this.#askUser(question, blocker);
    if (reply.reset) return true;
    const call = {
      name: "ask_user",
      args: { question },
      synthetic: true,
      raw: {
        id: `call_${uuidv4()}`,
        name: "ask_user",
        arguments: { question },
      },
    };
    this.records.push({
      call,
      full: step
        ? `${reply.full}\n\n[Step ${step} of ${MAX_STEPS}]`
        : reply.full,
      short: reply.short,
      medium: reply.short,
    });
    return true;
  }

  async #runBorrowed(name, args) {
    const fn = this.aibitat.functions.get(name);
    if (!fn) return `The ${name} tool is no longer available.`;
    try {
      fn.caller = "browser-agent";
      const output = await fn.handler(args);
      return typeof output === "string" ? output : JSON.stringify(output);
    } catch (error) {
      return `The ${name} tool failed: ${error.message}`;
    }
  }

  /**
   * Pause until the user replies in the chat (or takes over the browser and continues).
   * The reply comes back with a fresh page state, since the user may have changed the page.
   * When the user got past a blocker or drove the browser themselves, the context is reset instead.
   * @param {string} question
   * @param {{kind: string}|null} blocker - blocker on the page the question is about
   * @returns {Promise<{full: string, short: string, reset?: boolean}>}
   */
  async #askUser(question, blocker = this.lastBlocker) {
    this.question = question;
    this.trace.status = "needs-help";
    this.#recordStep(
      "ask_user",
      { question },
      { ok: true, page: this.trace.steps.at(-1) || {} }
    );
    this.#emit();
    BrowserBridge.request("attention", {
      sessionId: this.id,
      title: "Your browser agent needs help",
      body: question,
      path: this.attentionPath,
    }).catch(() => {});

    let timer;
    const reply = await Promise.race([
      new Promise((resolve) => (this.pendingReply = resolve)),
      new Promise(
        (resolve) =>
          (timer = setTimeout(() => resolve(undefined), HELP_TIMEOUT_MS))
      ),
      // Also covers a stop that landed before pendingReply was set.
      this.stopped.then(() => null),
    ]);
    clearTimeout(timer);
    this.pendingReply = null;
    this.question = null;
    if (this.stopReason)
      return {
        full: "The session was stopped.",
        short: "The session was stopped.",
      };

    this.trace.status = "running";
    this.#emit();
    BrowserBridge.request("hide", { sessionId: this.id }).catch(() => {});
    const short =
      reply === undefined
        ? "The user did not reply in time. Continue without their help, or call done and explain what you need."
        : `The user replied: ${reply}`;

    const page = await this.#orStop(
      BrowserBridge.request(
        "act",
        { sessionId: this.id, tool: "state" },
        ACTION_TIMEOUT_MS
      ).catch(() => null)
    );
    if (this.stopReason)
      return {
        full: "The session was stopped.",
        short: "The session was stopped.",
      };
    if (!page?.state) return { full: short, short };
    if ((blocker || page.tookOver) && !page.blocker?.wall) {
      this.#resetContext({ blocker, tookOver: page.tookOver, reply, page });
      return { full: short, short, reset: true };
    }
    let full = `${short}\n\nCurrent page state:\n${page.state}`;
    if (page.blocker?.wall)
      full +=
        "\n\nThe page is still blocked. Do not try to get past it on your own. If the user's reply gives you what you need (like credentials or a code), use exactly that. Otherwise call ask_user again, or call done and explain.";
    return { full, short };
  }

  /////////////////////////////
  // Context management
  /////////////////////////////

  /**
   * After the user signs in or drives the browser the step history is stale. Start over from the
   * task with a short note of what happened and the current page.
   */
  #resetContext({ blocker, tookOver, reply, page }) {
    const before = this.trace.steps
      .filter((step) => step.action !== "ask_user")
      .slice(-6)
      .map((step) => step.label)
      .join("; ");
    const what = blocker
      ? BLOCKER_RESOLVED[blocker.kind] || "handled the page"
      : tookOver
        ? "used the browser themselves"
        : "helped";
    const said = reply ? ` and said: "${clip(reply, 200)}"` : "";
    this.progress.push(
      `${before ? `Steps before: ${before}. ` : ""}Then the user ${what}${said}.`
    );
    this.records = [];
    this.nudges = 0;
    this.#resetStall();
    this.#madeProgress(page);
    this.initialState = page.state;
    this.lastBlocker = page.blocker || null;
    this.log(`Context reset after the user ${what}`);
  }

  /** Build the compacted message list: system, task, then records (only the latest in full). */
  #messages(functions) {
    const system =
      systemPrompt({
        maxSteps: MAX_STEPS,
        borrowed: this.borrowed.map((f) => f.name),
        screenshots: this.vision ? MAX_SCREENSHOTS : 0,
      }) + (this.native ? "" : jsonProtocolPrompt(functions));
    const progress = this.progress.length
      ? `\n\nProgress so far:\n${this.progress.map((note) => `- ${note}`).join("\n")}`
      : "";
    const notes = this.notes.length
      ? `\n\nYour notes:\n${this.notes.map((n) => `- ${n}`).join("\n")}`
      : "";
    // The date sits next to the task too - small models otherwise fall back to their training year.
    const sites = this.#visitedSummary();
    const plan = this.plan
      ? `\n\nNext step (from your last progress check): ${this.plan}`
      : "";
    const task = `Task: ${this.task}\nToday is ${new Date().toDateString()}.${this.#resumeContext()}${progress}${notes}${sites}${plan}`;
    const intro = this.records.length
      ? task
      : `${task}\n\nCurrent page state${progress ? " (the page has changed - read it fresh and only use ids from here)" : ""}:\n${this.initialState}`;

    const budget = this.contextLimit * 4 * 0.7 - system.length - intro.length;
    const contents = this.records.map((record, i) => {
      if (i === this.records.length - 1) return record.full;
      if (record.medium && i >= this.records.length - 3) return record.medium;
      return record.short;
    });
    // Over budget: shorten from the oldest record forward, then drop the oldest records.
    let size = contents.reduce((sum, c) => sum + c.length + 80, 0);
    for (let i = 0; i < contents.length - 1 && size > budget; i++) {
      size -= contents[i].length - this.records[i].short.length;
      contents[i] = this.records[i].short;
    }
    let first = 0;
    while (size > budget && first < contents.length - 1)
      size -= contents[first++].length + 80;

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: first ? `${intro}\n\n(${first} earlier steps omitted)` : intro,
      },
    ];
    for (let i = first; i < this.records.length; i++) {
      const { call } = this.records[i];
      // A screenshot is only shown while it is the latest step - images are expensive.
      const image =
        this.vision && i === this.records.length - 1 && this.records[i].image
          ? [
              {
                name: "screenshot.jpg",
                mime: "image/jpeg",
                contentString: `data:image/jpeg;base64,${this.records[i].image}`,
              },
            ]
          : null;
      if (this.native && call.synthetic) {
        // A call the model never made (the agent paused for a blocker, a checkpoint went back, or the
        // model wrote its action as text) has no provider-issued tool call to pair with - Gemini
        // rejects a tool call without its thought_signature. It goes in as a note instead.
        messages.push({
          role: "user",
          content: `[${call.name} ${JSON.stringify(compactCall({ arguments: call.args }).arguments)}]\nResult:\n${contents[i]}`,
          ...(image ? { attachments: image } : {}),
        });
      } else if (this.native) {
        messages.push({
          role: "function",
          name: call.name,
          content: contents[i],
          originalFunctionCall: compactCall(call.raw),
        });
        if (image)
          messages.push({
            role: "user",
            content: "Screenshot of the current screen:",
            attachments: image,
          });
      } else {
        messages.push({
          role: "assistant",
          content: JSON.stringify({
            tool: call.name,
            args: compactCall({ arguments: call.args }).arguments,
          }),
        });
        messages.push({
          role: "user",
          content: `Result:\n${contents[i]}`,
          ...(image ? { attachments: image } : {}),
        });
      }
    }
    if (this.nudge) messages.push({ role: "user", content: this.nudge });
    this.nudge = null;
    return messages;
  }

  /**
   * Keep the lines of a page that look relevant to the task: task words, prices, and the line right
   * after a match (labels are often followed by their value).
   */
  #digest(result) {
    const url = String(result?.page?.url || "").split("#")[0];
    if (!/^https?:/i.test(url) || !result.state) return;
    this.currentUrl = url;
    const terms = this.#terms(hostOf(url));
    this.#rememberText(url, result.state);
    // Rows of one block are merged with " · " - score each part, so one price does not hide another
    // past the clip. Links are scored on their label: "/category/" in a URL is not about the task.
    const lines = String(result.state)
      .split("\n")
      .filter((line) => /^\[T?\d+\]/.test(line))
      .flatMap((line) =>
        /^\[T\d+\]/.test(line)
          ? line.replace(/^\[T\d+\]\s*/, "").split(" · ")
          : [line.replace(/^\[\d+\]\s*/, "")]
      );
    let previousMatched = false;
    const scored = lines.map((line) => {
      const lower = line.replace(/ -> \S+$/, "").toLowerCase();
      let score = terms.filter((term) => lower.includes(term)).length;
      const matched = score > 0;
      if (/[$€£¥]\s?\d|\d[\d,.]*\s?(usd|eur|gbp|%)\b/i.test(line)) score += 1.5;
      if (previousMatched) score += 1;
      previousMatched = matched;
      return { line: clip(line, 160), score, matched };
    });
    const page = this.visited.get(url) || {
      url,
      title: "",
      lines: [],
      score: 0,
    };
    page.title = clip(result.page.title || page.title, 60);
    const merged = new Map(page.lines.map((entry) => [entry.line, entry]));
    for (const entry of scored)
      if (entry.score >= 1.5 && !merged.has(entry.line))
        merged.set(entry.line, entry);
    page.lines = [...merged.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, DIGEST_LINES);
    page.score = page.lines.reduce((sum, entry) => sum + entry.score, 0);
    page.relevant = page.lines.filter((entry) => entry.matched).length;
    if (!page.lines.length) return;
    this.visited.set(url, page);
    while (this.visited.size > DIGEST_PAGES) {
      const worst = [...this.visited.values()]
        .filter((p) => p.url !== url)
        .sort((a, b) => a.score - b.score)[0];
      this.visited.delete(worst.url);
    }
  }

  /** Keep every text line of a page the agent has seen, at any scroll position (few pages, capped). */
  #rememberText(url, state) {
    const page = this.pageLines.get(url) || { lines: new Set(), size: 0 };
    for (const raw of String(state).split("\n")) {
      if (!/^\[T\d+\]/.test(raw) || page.size > PAGE_TEXT_CHARS) continue;
      const line = raw.replace(/^\[T\d+\]\s*/, "");
      if (page.lines.has(line)) continue;
      page.lines.add(line);
      page.size += line.length + 1;
    }
    this.pageLines.delete(url);
    this.pageLines.set(url, page); // most recent last
    while (this.pageLines.size > 3)
      this.pageLines.delete(this.pageLines.keys().next().value);
  }

  /**
   * Text of the current page the latest state no longer shows (scrolled past) - the final answer
   * must not lose the price it scrolled by on the way to the bottom of a list.
   */
  #seenEarlier(latest) {
    const page = this.pageLines.get(this.currentUrl);
    if (!page) return "";
    const now = String(latest || "");
    const earlier = [...page.lines].filter((line) => !now.includes(line));
    if (!earlier.length) return "";
    return `\n\nAlso seen on this page earlier (scrolled out of view now):\n${earlier.join("\n").slice(0, PAGE_TEXT_CHARS)}`;
  }

  #visitedSummary({ includeCurrent = false } = {}) {
    const pages = [...this.visited.values()]
      .filter((page) => includeCurrent || page.url !== this.currentUrl)
      .sort((a, b) => b.score - a.score);
    if (!pages.length) return "";
    return `\n\nMost useful pages so far (key lines - their ids are no longer valid, but you can navigate back to the URL):\n${pages
      .map(
        ({ url, title, lines }) =>
          `- ${title ? `"${title}" ` : ""}${clip(url, 120)}: ${lines.map((e) => e.line).join(" | ")}`
      )
      .join("\n")}`;
  }

  /**
   * Write the final answer from everything collected, since small models write `done` from the last
   * page only. Can send the agent back to work when part of the task is missing.
   * @param {string} draft - the result the agent passed to done
   * @param {{canContinue: boolean, context?: string|null}} options - context: why the answer is
   *   written now (a give-up or a progress check) when the agent did not call done itself
   * @returns {Promise<{missing: string|null, answer: string}>} answer is "" when there is nothing to say
   */
  async #finalAnswer(draft, { canContinue, context = null, giveUp = false }) {
    const notes = this.notes.map((n) => `- ${n}`).join("\n") || "(none)";
    const latest = this.records.at(-1)?.full || this.initialState;
    // Text the agent asked for (read_page, find_text) is often the answer itself - keep all of it.
    const lastRead = ["read_page", "find_text"].includes(
      this.records.at(-1)?.call?.name
    );
    const askMissing = canContinue && this.doneChecks < MAX_DONE_CHECKS;
    const firstLine = giveUp
      ? "ANSWERED if the information above fully answers the task, otherwise PARTIAL"
      : askMissing
        ? "COMPLETE, or MISSING: <what part of the task has no information yet, in a few words>"
        : "COMPLETE";
    const messages = [
      {
        role: "system",
        content:
          'You write the final answer of a browser agent for the user, using ONLY the information collected below - never invent facts. Include the concrete values, names and links the task asks for. If the agent hit a real blocker (sign-in needed, site blocked, item does not exist), explain it. If the task was to post, send or submit something, only say it went through when "Data sent to sites" shows it - otherwise say it may not have been sent.',
      },
      {
        role: "user",
        content: `Task: ${this.task}\n\nAgent notes:\n${notes}${this.#visitedSummary({ includeCurrent: true })}${this.#sentSummary()}\n\nLast page:\n${clip(latest, lastRead ? this.maxChars : 3_000)}${this.#seenEarlier(latest)}\n\nAgent's draft answer:\n${draft || "(none)"}${context ? `\n\nNote: ${context}` : ""}\n\nReply in this format:\nFirst line: ${firstLine}\nThen a blank line, then the final answer for the user.`,
      },
    ];
    try {
      const before = this.provider.getCumulativeUsage?.() || {};
      const startedAt = Date.now();
      const response = await this.#orStop(this.provider.complete(messages, []));
      if (response?.stopped) return { missing: null, answer: draft };
      this.#trackUsage(before, messages, response, Date.now() - startedAt);
      const text = stripThinking(response?.textResponse || "").trim();
      const [first, ...rest] = text.split("\n");
      const answer = rest.join("\n").trim() || draft;
      const missing = first.match(/^\W*MISSING\W*:?\s*(.+)$/i)?.[1];
      if (askMissing && missing) {
        this.doneChecks++;
        this.log(`Final answer check: not finished - ${missing}`);
        return { missing: clip(missing, 200), answer };
      }
      const answered = giveUp && /^\W*ANSWERED\b/i.test(first);
      return { missing: null, answer, answered };
    } catch (error) {
      this.log("Final answer step failed:", error.message);
      return { missing: null, answer: draft };
    }
  }

  /** What the agent collected (notes, then page digests) - the answer when no model call wrote one. */
  #collected() {
    const notes = this.notes.map((n) => `- ${n}`).join("\n");
    const pages = this.#visitedSummary({ includeCurrent: true }).trim();
    return [notes ? `What I noted:\n${notes}` : "", pages]
      .filter(Boolean)
      .join("\n\n");
  }

  /** Everything the page sent to sites this session - ground truth for "was it posted/sent". */
  #sentSummary() {
    const sent = this.trace.steps.flatMap((step) =>
      (step.sent || []).map(
        (r) =>
          `${step.label}: ${r.method} ${r.label} -> ${r.method === "WS" ? "sent" : r.status ? `${r.status}${r.ok ? " OK" : " failed"}` : r.ok === false ? "failed" : "no reply"}`
      )
    );
    if (!sent.length)
      return "\n\nData sent to sites: nothing was sent this session.";
    return `\n\nData sent to sites (the site really received these):\n${sent
      .slice(-10)
      .map((s) => `- ${s}`)
      .join("\n")}`;
  }

  /** @returns {boolean} whether the note is new */
  #saveNote(note) {
    const text = clip(note, 300);
    if (this.notes.includes(text)) return false;
    this.notes.push(text);
    if (this.notes.length > 20) this.notes.shift();
    return true;
  }

  /**
   * Whether a note holds a fact the earlier notes and the task do not: a number, a quoted string,
   * a URL or a name (two or more capitalized words).
   * @returns {boolean}
   */
  #newFacts(note) {
    const task = String(this.task || "").toLowerCase();
    const facts = (
      String(note).match(
        /https?:\/\/\S+|"[^"]{2,}"|“[^”]{2,}”|[$£€]?\d[\d.,:%/-]*|\p{Lu}[\p{L}'-]+(?:\s+\p{Lu}[\p{L}'-]+)+/gu
      ) || []
    )
      .map((fact) => fact.toLowerCase())
      .filter((fact) => !task.includes(fact) && !this.noteFacts.has(fact));
    for (const fact of facts) this.noteFacts.add(fact);
    return facts.length > 0;
  }

  #disableScreenshots() {
    this.vision = false;
    this.screenshotsLeft = 0;
    this.functions = this.functions.filter(
      (f) => f.name !== SCREENSHOT_TOOL.name
    );
    for (const record of this.records) record.image = null;
    const latest = this.records.at(-1);
    if (latest)
      latest.full +=
        "\n\n(Screenshots are not supported by this model - use the page state.)";
  }

  #pushNudge(text) {
    this.nudge = text;
  }

  /**
   * Detects the agent cycling through the same 1-3 actions (e.g. click "Post" -> type -> click "Post"...).
   * @returns {string|null} a short description of the repeated cycle
   */
  #loopOf(call) {
    const sig = (c) => {
      // A changing note does not make a repeated action new, nor does a renumbered id for the same element.
      const { note: _note, id, ...args } = c.args || {};
      return `${c.name}:${c.target || id}:${JSON.stringify(args)}`;
    };
    const history = [...this.records.map((r) => sig(r.call)), sig(call)];
    for (let size = 1; size <= 3; size++) {
      const span = size * LOOP_REPEATS;
      if (history.length < span) break;
      const tail = history.slice(-span);
      // Scrolling down a long list three times is reading it, not a loop - only repeats that
      // showed nothing new count.
      if (this.records.slice(-(span - 1)).some((r) => r.moved)) continue;
      if (tail.every((s, i) => s === tail[i % size]))
        return [...this.records.map((r) => r.call), call]
          .slice(-size)
          .map((c) => c.name)
          .join(" -> ");
    }
    return null;
  }

  /** Sub-agent tokens count toward this session and toward the parent agent's reported usage. */
  #trackUsage(before, messages, response, durationMs) {
    const after = this.provider.getCumulativeUsage?.() || {};
    let prompt = (after.prompt_tokens || 0) - (before.prompt_tokens || 0);
    let completion =
      (after.completion_tokens || 0) - (before.completion_tokens || 0);
    if (prompt + completion > 0) {
      this.aibitat.providerInstance?.applyUsage?.({
        prompt_tokens: prompt,
        completion_tokens: completion,
        total_tokens: prompt + completion,
        duration: durationMs / 1000,
      });
    } else {
      // Provider did not report usage - estimate so the user still sees what the session costs.
      this.estimatedTokens = true;
      prompt = Math.ceil(JSON.stringify(messages).length / 4);
      completion = Math.ceil(
        JSON.stringify(response?.functionCall || response?.textResponse || "")
          .length / 4
      );
    }
    this.trace.tokens.prompt += prompt;
    this.trace.tokens.completion += completion;
    this.trace.tokens.total += prompt + completion;
    this.#emit();
  }

  /////////////////////////////
  // Resuming
  /////////////////////////////

  /**
   * Carry an earlier session's notes and page digests into this run, so the agent knows what it
   * already did and can navigate back to those pages (their ids no longer count as made up).
   * The pages start with a low score: they are forgotten first and never count as this run's best.
   * @param {import("./traces").BrowserResumePoint} resume
   */
  #seedFromResume(resume) {
    for (const note of (resume.notes || []).slice(-RESUME_NOTES))
      if (this.#saveNote(note)) this.#newFacts(note);
    for (const page of (resume.pages || []).slice(0, DIGEST_PAGES)) {
      if (!page?.url) continue;
      const lines = (page.lines || []).map((line) => ({
        line: clip(line, 160),
        score: 0.1,
        matched: false,
      }));
      this.visited.set(page.url, {
        url: page.url,
        title: clip(page.title || "", 60),
        lines,
        score: 0.1 * lines.length,
        relevant: 0,
      });
      for (const id of `${page.url} ${(page.lines || []).join(" ")}`.match(
        ID_TOKEN
      ) || [])
        this.seenIds.add(id);
    }
    for (const id of String(resume.url || "").match(ID_TOKEN) || [])
      this.seenIds.add(id);
  }

  /** What the earlier session did, shown next to the task (its notes and pages are seeded). */
  #resumeContext() {
    if (!this.resumeFrom) {
      return this.resumeQuery
        ? `\n\nNo earlier browser session matched "${clip(this.resumeQuery, 60)}"; starting fresh.`
        : "";
    }
    const { resume, task, startedAt, summary } = this.resumeFrom;
    const started = startedAt ? new Date(startedAt).toDateString() : "earlier";
    const lines = [
      `Continuing from a saved browser session (started ${started}), ${this.profileInfo?.ephemeral ? "in a fresh browser (its sign-ins and cookies are gone)" : "in the same browser profile (same sign-ins and cookies)"}${this.reopening ? ". The browser reopened the page it ended on" : ""}. Your notes and useful pages below include what it found.`,
      `Earlier task: ${clip(task, 300)}`,
      `What it did / result: ${clip(resume.summary || summary || "(no result)", 600)}`,
    ];
    if (resume.progress?.length)
      lines.push(
        `Earlier progress: ${resume.progress
          .slice(-2)
          .map((line) => clip(line, 200))
          .join(" ")}`
      );
    if (resume.url)
      lines.push(
        `It ended on: ${resume.title ? `"${clip(resume.title, 60)}" ` : ""}${clip(resume.url, 120)}`
      );
    return `\n\n${lines.join("\n")}`;
  }

  /**
   * Save where this session ended, so a later run can pick it up (see BrowserTraces.findResumable).
   * The page is the last one that loaded fine - never about:blank or a browser error page.
   */
  #saveResumePoint() {
    const pages = this.trace.steps.filter((step) =>
      /^https?:/i.test(step.url || "")
    );
    const last =
      [...pages].reverse().find((step) => step.ok !== false) ||
      pages.at(-1) ||
      null;
    this.trace.resume = {
      url: last?.url || null,
      title: last?.title || null,
      favicon: last?.favicon || null,
      profile: this.profileInfo || { name: this.trace.profile, id: null },
      summary: this.trace.summary
        ? String(this.trace.summary).slice(0, RESUME_SUMMARY_CHARS)
        : null,
      notes: this.notes.slice(-RESUME_NOTES),
      progress: this.progress.slice(-RESUME_PROGRESS),
      pages: [...this.visited.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, DIGEST_PAGES)
        .map(({ url, title, lines }) => ({
          url,
          title,
          lines: lines.slice(0, RESUME_LINES).map((entry) => entry.line),
        })),
      endedAt: this.trace.endedAt,
    };
  }

  /** Tells the parent agent the session can be continued - and how. */
  #resumeHint() {
    if (!this.trace.resume) return "";
    const site = siteName(this.trace.resume.url);
    return `\n\nThis browser session was saved where it ended. For a follow-up on it, call browser-use with resume: "${site || "last"}" to continue from there instead of starting over.`;
  }

  /////////////////////////////
  // Trace + UI
  /////////////////////////////

  #recordStep(action, args, result = {}) {
    if (result.state) this.#digest(result);
    const page = result.page || {};
    this.trace.steps.push({
      at: new Date().toISOString(),
      action,
      label: stepLabel(action, args, result),
      ok: result.ok !== false,
      url: page.url || null,
      title: page.title || null,
      favicon: page.favicon || null,
      thumbnail: result.thumbnail || null,
      // Metadata only, recorded by the driver.
      sent:
        Array.isArray(result.sent) && result.sent.length
          ? result.sent.slice(0, 5).map(({ label, method, status, ok }) => ({
              label,
              method,
              status,
              ok,
            }))
          : null,
    });
    BrowserTraces.saveSoon(this.trace);
    this.#emit();
  }

  #finish(status, summary) {
    this.trace.status = status;
    this.trace.summary = summary;
    this.trace.endedAt = new Date().toISOString();
    this.question = null;
    this.#emit();
  }

  /** The live state shown in the chat card. Thumbnails never go over the socket - the live view has its own frames. */
  get snapshot() {
    const last = this.trace.steps.at(-1) || null;
    return {
      sessionId: this.id,
      task: this.task,
      profile: this.trace.profile,
      status: this.trace.status,
      summary: this.trace.summary,
      question: this.question,
      tokens: { ...this.trace.tokens, estimated: this.estimatedTokens },
      stepCount: this.trace.steps.length,
      step: last
        ? {
            label: last.label,
            ok: last.ok,
            url: last.url,
            title: last.title,
            favicon: last.favicon,
          }
        : null,
      recentSteps: this.trace.steps
        .slice(-6)
        .map(({ label, ok, favicon, url }) => ({ label, ok, favicon, url })),
      sites: sitesOf(this.trace.steps),
      resumedFrom: this.resumeFrom
        ? { id: this.resumeFrom.id, task: this.trace.resumedFromTask }
        : null,
      startedAt: this.trace.startedAt,
      endedAt: this.trace.endedAt,
    };
  }

  #emit() {
    try {
      this.onUpdate(this.snapshot);
    } catch {}
  }

  #resultForParent() {
    const { status, summary, steps } = this.trace;
    const visited =
      sitesOf(steps)
        .map((s) => s.host)
        .join(", ") || "none";
    const last = steps.filter((s) => s.url).at(-1);
    const lastPage = last ? `"${last.title || ""}" (${last.url})` : "none";
    const fresh =
      this.resumeQuery && !this.resumeFrom
        ? `No earlier browser session matched "${clip(this.resumeQuery, 60)}", so this one started fresh.

`
        : "";
    const hint = this.#resumeHint();
    switch (status) {
      case "done":
        return `${fresh}The browser task is complete.

Result:
${summary}

Sites visited: ${visited}${hint}`;
      case "incomplete":
        if (this.trace.gaveUp)
          return `${fresh}The browser agent gave up: ${this.trace.gaveUp}. Do NOT start the browser task again on your own. Tell the user what it found, and suggest they do the step themselves or try a more capable model.

What it found:
${summary}

Sites visited: ${visited}${hint}`;
        return `${fresh}The browser agent could not fully complete the task.

What it found:
${summary}

Sites visited: ${visited}${hint}`;
      case "stopped":
        return this.stopReason === "aborted"
          ? "The browser session was cancelled."
          : `The user stopped the browser session before it finished. Steps taken: ${steps
              .map((s) => s.label)
              .slice(-8)
              .join(
                "; "
              )}. Last page: ${lastPage}. Do not retry the browser task; ask the user how they want to proceed.${hint}`;
      default:
        return `The browser session failed: ${summary}. Let the user know.`;
    }
  }
}

/**
 * Whether the model takes image input: models.dev for cloud models, then what the provider
 * itself reports (Ollama, LM Studio, ...). Anything unknown counts as no.
 */
async function detectVision(provider, model) {
  if (typeof provider !== "string" || !model) return false;
  const listed = MODEL_PRICING.supportsVision(provider, model);
  if (listed !== null) return listed;
  try {
    const { getLLMProvider } = require("../../../../helpers");
    const capabilities = await getLLMProvider({
      provider,
      model,
    })?.getModelCapabilities?.();
    return capabilities?.vision === true;
  } catch {
    return false;
  }
}

function hostOf(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** A short name for a site: "amazon" for www.amazon.co.uk, "google" for mail.google.com. */
function siteName(url) {
  const labels = String(hostOf(url) || "")
    .split(".")
    .filter(Boolean);
  if (labels.length < 2) return labels[0] || null;
  const name = labels.at(-2);
  return labels.length > 2 && name.length <= 3 ? labels.at(-3) : name;
}

const VERDICT = /\b(CONTINUE|FINISH|BACK|GIVE[_ ]?UP)\b/i;

/**
 * A progress check's reply: the verdict word on the first line, then a one-sentence reason (on the
 * same line after the word, or on the next line).
 * @returns {{verdict: "CONTINUE"|"FINISH"|"BACK"|"GIVE_UP", reason: string}|null}
 */
function parseVerdict(text = "") {
  const lines = stripThinking(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const word = lines[0]?.match(VERDICT)?.[1];
  if (!word) return null;
  const verdict = word.toUpperCase().replace(/^GIVE[_ ]?UP$/, "GIVE_UP");
  const reason = clip(
    lines[0].replace(/^\W*(CONTINUE|FINISH|BACK|GIVE[_ ]?UP)\W*/i, "") ||
      lines[1] ||
      "",
    200
  );
  return { verdict, reason };
}

function stripThinking(text = "") {
  return String(text)
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();
}

function normalizeArgs(args) {
  if (typeof args === "string") return safeJsonParse(args, {}) || {};
  return args && typeof args === "object" ? args : {};
}

/**
 * A tool call as it is replayed in history: long strings and arrays clipped. Every past call is
 * re-sent on every step, so one runaway argument (a list of 2,000 ids) would cost tokens all session.
 * @param {{arguments?: string|Object}} raw
 */
function compactCall(raw) {
  if (!raw) return raw;
  const args = normalizeArgs(raw.arguments);
  const compact = {};
  for (const [key, value] of Object.entries(args)) {
    if (typeof value === "string") compact[key] = clip(value, 300);
    else if (Array.isArray(value)) compact[key] = value.slice(0, 20);
    else compact[key] = value;
  }
  return {
    ...raw,
    arguments:
      typeof raw.arguments === "string" ? JSON.stringify(compact) : compact,
  };
}

/** Pull a {"tool": ..., "args": ...} action out of a plain-text reply (JSON protocol / stray text calls). */
function parseJsonAction(text = "") {
  const cleaned = String(text).replace(/```(?:json)?/gi, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  const obj = safeJsonParse(cleaned.slice(start, end + 1), null);
  if (!obj || typeof obj !== "object") return null;
  const name = obj.tool || obj.name || obj.action || obj.function;
  if (typeof name !== "string") return null;
  return {
    name,
    args: normalizeArgs(
      obj.args ?? obj.arguments ?? obj.parameters ?? obj.input ?? {}
    ),
  };
}

module.exports = { BrowserAgent, parseJsonAction, parseVerdict, siteName };
