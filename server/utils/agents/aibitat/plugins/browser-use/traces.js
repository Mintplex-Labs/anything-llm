const fs = require("fs");
const path = require("path");
const { taskTerms } = require("./tools");

const tracesPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../../../../storage/browser-use/traces`)
    : path.resolve(process.env.STORAGE_DIR, `browser-use/traces`);

const MAX_TRACES = 200;
// Steps carry base64 thumbnails, so a running session writes its trace at most this often (see saveSoon).
const SAVE_THROTTLE_MS = 2_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Words that only say "the earlier session" ("continue the last one") - they name no session.
// Stemmed like the query (see taskTerms).
const GENERIC_RESUME_WORDS = new Set(
  taskTerms(
    "last latest previous prior earlier recent before session sessions browser same again continue resume one tab page window left off"
  )
);

/**
 * @typedef {Object} BrowserTraceStep
 * @property {string} at - ISO timestamp
 * @property {string} action - tool name the agent called
 * @property {string} label - human readable description of the step
 * @property {boolean} ok
 * @property {string|null} url
 * @property {string|null} title
 * @property {string|null} favicon
 * @property {string|null} thumbnail - base64 jpeg
 * @property {Array<{label: string, method: string, status: number|null, ok: boolean}>|null} sent
 */

/**
 * @typedef {Object} BrowserTrace
 * @property {string} id
 * @property {string} task
 * @property {string} profile
 * @property {"running"|"needs-help"|"done"|"incomplete"|"failed"|"stopped"} status
 * @property {string|null} summary
 * @property {string} [gaveUp] - why the agent gave up, when it did
 * @property {{slug: string, name: string}|null} workspace
 * @property {string|null} model
 * @property {{prompt: number, completion: number, total: number}} tokens
 * @property {string} startedAt
 * @property {string|null} endedAt
 * @property {string|null} threadSlug - thread the session ran in (null for the workspace's default chat)
 * @property {number|null} userId - who ran the session (null in single-user mode)
 * @property {string|null} resumedFrom - id of the earlier session this run continued
 * @property {string|null} resumedFromTask - that session's task
 * @property {BrowserResumePoint} [resume] - where the session ended, so a later run can continue it
 * @property {BrowserTraceStep[]} steps
 */

/**
 * @typedef {Object} BrowserResumePoint
 * @property {string|null} url - last useful page (never about:blank or a browser error page)
 * @property {string|null} title
 * @property {string|null} favicon
 * @property {{name: string, id: string|null}} profile
 * @property {string|null} summary - the session's final answer
 * @property {string[]} notes - the agent's notes
 * @property {string[]} progress - its "progress so far" lines
 * @property {Array<{url: string, title: string, lines: string[]}>} pages - visited-page digest
 * @property {string|null} endedAt
 */

/**
 * Meta files carry only the resume point's page and profile - the notes and digests are read from
 * the full trace of the one session being resumed.
 * @typedef {Omit<BrowserTrace, "steps"|"resume"> & {stepCount: number, sites: Array<{host: string, favicon: string|null}>, resume?: Pick<BrowserResumePoint, "url"|"title"|"favicon"|"profile"|"endedAt">}} BrowserTraceSummary
 */

/** Pending throttled saves: trace id -> {timer, trace}. */
const pending = new Map();

/**
 * On-device history of every browser session the agent ran, so the user can
 * always review which sites it visited and what it did there.
 *
 * Each session is `<id>.json` (the full trace) plus `<id>.meta.json` (the summary without steps),
 * so listing and pruning never parse the thumbnails.
 */
const BrowserTraces = {
  fileFor(id) {
    if (!UUID.test(String(id))) return null;
    return path.join(tracesPath, `${id}.json`);
  },

  metaFileFor(id) {
    if (!UUID.test(String(id))) return null;
    return path.join(tracesPath, `${id}.meta.json`);
  },

  /**
   * Write the trace now, replacing any throttled save still waiting.
   * @param {BrowserTrace} trace
   */
  save(trace) {
    const queued = pending.get(trace.id);
    if (queued) clearTimeout(queued.timer);
    pending.delete(trace.id);
    try {
      const file = this.fileFor(trace.id);
      if (!file) return;
      fs.mkdirSync(tracesPath, { recursive: true });
      writeAtomic(file, JSON.stringify(trace));
      // Written after the trace, so a meta file older than its trace is stale (see summaryOf).
      writeAtomic(this.metaFileFor(trace.id), JSON.stringify(summarize(trace)));
    } catch (error) {
      console.error("[BrowserTraces] Failed to save trace:", error.message);
    }
  },

  /**
   * Save a running session's trace at most every SAVE_THROTTLE_MS. Always end with save() to flush.
   * @param {BrowserTrace} trace
   */
  saveSoon(trace) {
    const queued = pending.get(trace.id);
    if (queued) {
      queued.trace = trace;
      return;
    }
    const entry = { trace, timer: null };
    entry.timer = setTimeout(() => this.save(entry.trace), SAVE_THROTTLE_MS);
    entry.timer.unref?.();
    pending.set(trace.id, entry);
  },

  /** @returns {BrowserTrace|null} */
  get(id) {
    try {
      const file = this.fileFor(id);
      if (!file || !fs.existsSync(file)) return null;
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return null;
    }
  },

  /**
   * Trace summaries (no steps) newest first.
   * @returns {BrowserTraceSummary[]}
   */
  list() {
    if (!fs.existsSync(tracesPath)) return [];
    const traces = [];
    for (const name of fs.readdirSync(tracesPath)) {
      if (!name.endsWith(".json") || name.endsWith(".meta.json")) continue;
      const summary = this.summaryOf(name.replace(/\.json$/, ""));
      if (summary) traces.push(summary);
    }
    return traces.sort((a, b) =>
      String(b.startedAt || "").localeCompare(String(a.startedAt || ""))
    );
  },

  /**
   * The summary from `<id>.meta.json`, or rebuilt from the full trace when the meta file is
   * missing (traces from before meta files) or older than the trace (a crash between the writes).
   * @returns {BrowserTraceSummary|null}
   */
  summaryOf(id) {
    const file = this.fileFor(id);
    const metaFile = this.metaFileFor(id);
    if (!file) return null;
    try {
      const traceStat = fs.statSync(file);
      const metaStat = fs.existsSync(metaFile) ? fs.statSync(metaFile) : null;
      if (metaStat && metaStat.mtimeMs >= traceStat.mtimeMs)
        return JSON.parse(fs.readFileSync(metaFile, "utf8"));
    } catch {}
    const trace = this.get(id);
    if (!trace) return null;
    const summary = summarize(trace);
    try {
      writeAtomic(metaFile, JSON.stringify(summary));
    } catch {}
    return summary;
  },

  delete(id) {
    const queued = pending.get(id);
    if (queued) clearTimeout(queued.timer);
    pending.delete(id);
    for (const file of [this.fileFor(id), this.metaFileFor(id)])
      if (file && fs.existsSync(file)) fs.rmSync(file);
  },

  /**
   * The earlier session a new run should continue. Only sessions with a saved resume point count.
   * Scopes, in order: the same thread, the same workspace, anywhere. A query that only says "the
   * last one" (or nothing) takes the most recent session of the first scope that has any. Otherwise
   * the session must share at least half of the query's words with its task, result, sites or last
   * page; the best match of the first scope with one wins, the most recent on a tie.
   * Only the same user's sessions are ever candidates (userId is null in single-user mode).
   * @param {{query?: string, workspaceSlug?: string|null, threadSlug?: string|null, userId?: number|null}} opts
   * @returns {BrowserTraceSummary|null} null when nothing matches - the run starts fresh
   */
  findResumable({
    query = "",
    workspaceSlug = null,
    threadSlug = null,
    userId = null,
  } = {}) {
    const candidates = this.list()
      .filter(
        (trace) =>
          trace.resume &&
          !ACTIVE.has(trace.status) &&
          (trace.userId ?? null) === (userId ?? null)
      )
      .sort((a, b) => endedOf(b).localeCompare(endedOf(a)));
    const sameWorkspace = (trace) =>
      !!workspaceSlug && trace.workspace?.slug === workspaceSlug;
    const scopes = [
      candidates.filter(
        (trace) =>
          sameWorkspace(trace) &&
          (trace.threadSlug || null) === (threadSlug || null)
      ),
      candidates.filter(sameWorkspace),
      candidates,
    ];
    const terms = taskTerms(query).filter(
      (term) => !GENERIC_RESUME_WORDS.has(term)
    );
    if (!terms.length) return scopes.find((scope) => scope.length)?.[0] || null;

    const needed = Math.ceil(terms.length / 2);
    for (const scope of scopes) {
      let best = null;
      let bestScore = 0;
      for (const trace of scope) {
        const text = resumeText(trace);
        const score = terms.filter((term) => text.includes(term)).length;
        // Newest first, so only a strictly better match replaces a more recent one.
        if (score >= needed && score > bestScore) {
          best = trace;
          bestScore = score;
        }
      }
      if (best) return best;
    }
    return null;
  },

  /** Keep the history from growing forever. */
  prune() {
    try {
      this.list()
        .slice(MAX_TRACES)
        .forEach((trace) => this.delete(trace.id));
    } catch {}
  },
};

const ACTIVE = new Set(["running", "needs-help"]);

/** @returns {BrowserTraceSummary} */
function summarize(trace) {
  const { steps = [], resume, ...meta } = trace;
  const summary = { ...meta, stepCount: steps.length, sites: sitesOf(steps) };
  if (resume) {
    const { url, title, favicon, profile, endedAt } = resume;
    summary.resume = { url, title, favicon, profile, endedAt };
  }
  return summary;
}

function endedOf(trace) {
  return String(
    trace.resume?.endedAt || trace.endedAt || trace.startedAt || ""
  );
}

/** What a resume query is matched against: the task, the result, the sites and the last page. */
function resumeText(trace) {
  return [
    trace.task,
    String(trace.summary || "").slice(0, 1_000),
    ...(trace.sites || []).map((site) => site.host),
    trace.resume?.title,
    trace.resume?.url,
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

function writeAtomic(file, content) {
  fs.writeFileSync(`${file}.tmp`, content);
  fs.renameSync(`${file}.tmp`, file);
}

/** Distinct sites a session visited, in visit order. */
function sitesOf(steps = []) {
  const seen = new Map();
  for (const step of steps) {
    if (!step.url) continue;
    try {
      const { host, protocol } = new URL(step.url);
      if (!protocol.startsWith("http") || seen.has(host)) continue;
      seen.set(host, { host, favicon: step.favicon || null });
    } catch {}
  }
  return [...seen.values()];
}

module.exports = { BrowserTraces, sitesOf };
