// Analytics, logging and tracking endpoints POST constantly - they are not "the page sent something".
const TRACKING_PATH =
  /\/(track|tracking|collect|beacon|log|logs|logging|analytics|metrics|telemetry|events?|rum|pixel|ping|sentry|csp-report|li\/track|jot|1p-user-list|pagead)\b/i;
const READ_ONLY_GRAPHQL = /"query"\s*:\s*"\s*(query\b|\{)/;
// Keep-alives sockets send on a timer (socket.io "2", {"type":"ping"}, Discord {"op":1,...}), not because of the agent.
const WS_HEARTBEAT =
  /["'](type|event|op|action|cmd|method|msg)["']\s*:\s*["']?(ping|pong|heartbeat|hb|keep_?alive)\b|^\s*\{\s*"op"\s*:\s*1\s*,|^\s*"?(ping|pong|heartbeat|keep_?alive)"?\s*$/i;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @typedef {Object} SentRequest
 * @property {string} label - GraphQL operation or last path segment ("CreateTweet", "comments")
 * @property {string} method - POST, PUT, PATCH, DELETE or WS
 * @property {string} target - host + path with ids collapsed
 * @property {number|null} status
 * @property {boolean|null} ok - null while there is no reply
 */

/**
 * Write requests and websocket messages the page sent to its own site during one action (metadata
 * only). The agent's ground truth for "was it posted / sent / ordered".
 */
class SentLog {
  /** @param {() => string} pageUrl - the tab's current URL; only requests to its site count */
  constructor(pageUrl) {
    this.pageUrl = pageUrl;
    /** @type {Map<string, SentRequest>|null} null while no action is recording */
    this.entries = null;
    /** Open websockets by CDP request id - frames only carry the id, the URL comes with webSocketCreated. */
    this.socketUrls = new Map();
  }

  /** Start recording for an action. */
  start() {
    this.entries = new Map();
  }

  /** Feed every Network.* CDP event of the page and its frames. */
  onEvent(method, params, sessionId) {
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
    const log = this.entries;
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
      sameSite(url.hostname, this.pageUrl()) &&
      !TRACKING_PATH.test(url.pathname)
    );
  }

  /**
   * Stop recording - after giving in-flight requests a moment to come back.
   * @returns {Promise<SentRequest[]>}
   */
  async collect() {
    const log = this.entries;
    if (!log) return [];
    const started = Date.now();
    while (
      [...log.values()].some((r) => r.ok === null && r.method !== "WS") &&
      Date.now() - started < 2_000
    )
      await sleep(150);
    this.entries = null;
    return [...log.values()];
  }

  /**
   * One line for the agent: "POST x.com/i/api/graphql/…/CreateTweet (CreateTweet) -> 200 OK".
   * @param {SentRequest[]} sent
   */
  static describe(sent) {
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
      shown.join("; ") +
      (sent.length > 3 ? `; and ${sent.length - 3} more` : "")
    );
  }
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

function lastSegmentOf(target) {
  return target.split("/").filter(Boolean).at(-1) || "";
}

module.exports = { SentLog };
