const { safeJsonParse } = require("../../../../http");
const { BrowserAgent } = require("./agent");
const { BrowserBridge } = require("./bridge");
const { BrowserTraces } = require("./traces");

/**
 * Browser Use - hands a task to a browser sub-agent, on the user's saved profile (sign-ins carry
 * over) or incognito. Where the browser runs is bridge.js's business; this file is the same in the
 * server and the desktop app.
 *
 * Only offered in the main chat UI: the session card needs a live websocket. API, Telegram and
 * scheduled jobs never see the tool.
 */
const browserUse = {
  name: "browser-use",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        if (!isMainChatSession(aibitat)) return;
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "A real web browser for going through websites: anything needing clicks, scrolling, forms, filters or comparing several pages (shops, travel sites, web apps, long lists). It uses the user's own browser, so sites they signed in to before stay signed in; if a site needs them to sign in, the browser agent asks them to do it in the session card. Set incognito for private browsing. Not for reading one URL (use web-scraping) or looking things up (use web-browsing). Sessions are saved: pass resume for follow-ups.",
          examples: [
            {
              prompt: "Find me some cheap flights to SFO this week",
              call: JSON.stringify({
                task: "Search Google Flights for the cheapest round-trip flights to San Francisco (SFO) departing this week. Return the 3 cheapest options with airline, dates, times, stops and price.",
                start_url: "https://www.google.com/travel/flights",
              }),
            },
            {
              prompt:
                "Compare the 3 cheapest 27 inch 4K monitors on bestbuy.com",
              call: JSON.stringify({
                task: "On bestbuy.com, find 27 inch 4K monitors, sort by price low to high, and compare the 3 cheapest: name, price, refresh rate and link.",
                start_url: "https://www.bestbuy.com",
              }),
            },
            {
              prompt: "Now check if the second one is in stock near 94103",
              call: JSON.stringify({
                task: "Open the second monitor from the earlier comparison and check store availability for ZIP code 94103.",
                resume: "monitors",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              task: {
                type: "string",
                description: "Full task: what to do and bring back.",
              },
              start_url: {
                type: "string",
                description:
                  "Start address when known, e.g. https://www.bestbuy.com",
              },
              resume: {
                type: "string",
                description:
                  'Continue a saved session: "last" or words naming it (e.g. "amazon cart"). Use for any follow-up on what the browser did.',
              },
              incognito: {
                type: "boolean",
                description:
                  "true only when the user asks for private, incognito or anonymous browsing: a signed-out browser that keeps nothing.",
              },
            },
            required: ["task"],
            additionalProperties: false,
          },
          handler: async function ({
            task,
            start_url = null,
            resume = null,
            incognito = null,
          }) {
            if (!task) return "No task was given to the browser agent.";
            const aibitat = this.super;
            const owner = await profileOwner(aibitat);
            if (!owner)
              return "The browser agent needs a signed-in user to run.";
            // Web tool calls later in this turn are the model's own follow-up, never a misroute.
            ranInTurn.set(aibitat, userTurn(aibitat));
            const { path, workspaceSlug, threadSlug } =
              await chatContext(aibitat);
            // Some models send `resume: true` - that means the most recent session.
            const resumeQuery =
              typeof resume === "string" ? resume.trim() : resume ? "last" : "";
            const found = resumeQuery
              ? BrowserTraces.findResumable({
                  query: resumeQuery,
                  workspaceSlug,
                  threadSlug,
                  userId: aibitat.handlerProps?.invocation?.user_id ?? null,
                })
              : null;
            // Never taken from the trace: the profile is always this user's own. A follow-up stays
            // incognito (or not) like the session it continues, unless the model said otherwise.
            const useIncognito =
              incognito === null || incognito === undefined
                ? !!found?.resume?.profile?.ephemeral
                : incognito === true || incognito === "true";
            const agent = new BrowserAgent({
              aibitat,
              task,
              profile: BrowserBridge.profileKey(owner.userId, {
                incognito: useIncognito,
              }),
              startUrl: start_url,
              attentionPath: path,
              threadSlug,
              resumeFrom: found ? BrowserTraces.get(found.id) : null,
              resumeQuery: resumeQuery || null,
              onUpdate: (snapshot) =>
                aibitat.socket?.send("browserUseSession", snapshot),
            });

            const stopListening = listenToCard(aibitat, agent);
            try {
              const result = await agent.run();
              // Saved with the chat so the card survives reloads.
              aibitat._pendingOutputs ??= [];
              aibitat._pendingOutputs.push({
                type: "browserUseSession",
                payload: agent.snapshot,
              });
              return result;
            } finally {
              stopListening();
            }
          },
        });
        scopeGeneralWebTools(aibitat);
        redirectMisroutedCalls(aibitat);
      },
    };
  },
};

// The general web tools win on keywords ("browse the web", "visit a URL") even for requests
// about the user's own accounts, so while browser-use is offered, say where their scope ends.
const SCOPE_NOTES = {
  "web-scraping":
    " Grabs the raw content of one URL in a single fetch. It does not browse: for going through a site, following links, clicking, scrolling, filters or forms, use browser-use.",
  "web-browsing":
    " Searches the public web only - it cannot click through or fill in websites. Use browser-use for that.",
};

function scopeGeneralWebTools(aibitat) {
  for (const [name, note] of Object.entries(SCOPE_NOTES)) {
    const fn = aibitat.functions.get(name);
    if (!fn || fn.browserUseScoped) continue;
    let description = fn.description;
    // Only while browser-use is registered - the skill can be toggled off mid-session.
    Object.defineProperty(fn, "description", {
      enumerable: true,
      configurable: true,
      get: () =>
        aibitat.functions.has("browser-use") ? description + note : description,
      set: (value) => {
        description = value;
      },
    });
    fn.browserUseScoped = true;
  }
}

// Small models mix up the web tools: Qwen 9B called web-browsing with "browser-use: Navigate to ..."
// right after the user said "use browser use". Catch those calls in code instead of more prompt text.
const MENTIONS_BROWSER_USE =
  /\bbrowser[\s_-]?(use|agent)\b|\buse (the|a|your) (real )?browser\b/i;
const URL_PATTERN = /https?:\/\/[^\s"'<>)\]]+/i;
const WEB_TOOL_ARG = { "web-browsing": "query", "web-scraping": "url" };

// aibitat -> user turn (see userTurn) in which browser-use last ran.
const ranInTurn = new WeakMap();

function redirectMisroutedCalls(aibitat) {
  for (const [name, argName] of Object.entries(WEB_TOOL_ARG)) {
    const fn = aibitat.functions.get(name);
    if (!fn || fn.browserUseRedirect) continue;
    const original = fn.handler;
    fn.handler = async function (args = {}) {
      const value = String(args?.[argName] || "").trim();
      // Looked up per call: the skill can be toggled off (or re-registered) mid-session.
      const browser = aibitat.functions.get("browser-use");
      const forward =
        browser && ranInTurn.get(aibitat) !== userTurn(aibitat)
          ? misroutedTask(aibitat, value)
          : null;
      if (forward) {
        aibitat.introspect?.(
          `Using the browser agent for this instead of ${name}.`
        );
        return browser.handler(forward);
      }
      // A search engine cannot open an address - point the model at the tools that can.
      if (
        name === "web-browsing" &&
        /^\S+$/.test(value) &&
        URL_PATTERN.test(value)
      )
        return `web-browsing only runs web searches and cannot open ${value}. To read that page call web-scraping with the url. To fill in, click, sign in or go through it, call browser-use with start_url set to it.`;
      return original.call(this, args);
    };
    fn.browserUseRedirect = true;
  }
}

/**
 * A web-browsing / web-scraping call that was really meant for browser-use: the call itself names
 * browser-use, or the user's latest message explicitly asked for the browser.
 * @returns {{task: string, start_url: string|null}|null}
 */
function misroutedTask(aibitat, value) {
  const said = (aibitat.chats || [])
    .filter((chat) => chat.from === "USER" && typeof chat.content === "string")
    .map((chat) => chat.content);
  const latest = said.at(-1) || "";
  if (!MENTIONS_BROWSER_USE.test(value) && !MENTIONS_BROWSER_USE.test(latest))
    return null;
  // The latest message often only says "use browser use" - the earlier ones hold the task and link.
  const recent = said.slice(-3);
  const start_url =
    value.match(URL_PATTERN)?.[0] ||
    [...recent]
      .reverse()
      .map((text) => text.match(URL_PATTERN)?.[0])
      .find(Boolean) ||
    null;
  const asked = value.replace(/^\s*browser[\s_-]?use\s*:?\s*/i, "");
  const task = [
    `The user asked: ${recent.map((text) => `"${text}"`).join(" then ")}`,
    asked && asked !== start_url ? `Do: ${asked}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  return { task, start_url };
}

/** Count of the user's messages so far - changes with every new user turn. */
function userTurn(aibitat) {
  return (aibitat.chats || []).filter((chat) => chat.from === "USER").length;
}

/**
 * The session card's control messages: stop, help replies, live view and the helper's input.
 * @returns {() => void} stop listening
 */
function listenToCard(aibitat, agent) {
  let stopWatching = null;
  const watch = (watching) => {
    stopWatching?.();
    stopWatching = watching
      ? BrowserBridge.watch(agent.id, (frame) =>
          aibitat.socket?.send("browserUseFrame", {
            sessionId: agent.id,
            frame,
          })
        )
      : null;
  };

  const unlisten = aibitat.onControlMessage((message) => {
    const data = safeJsonParse(message, {});
    if (data?.type !== "browserUseControl" || data?.sessionId !== agent.id)
      return false;
    switch (data.action) {
      case "stop":
        agent.stop("user");
        return true;
      case "watch":
        watch(!!data.watching);
        return true;
      // Only while the agent asks for help - the card offers Take control then, and a client that
      // sends input at any other time would be driving the browser behind the agent's back. A
      // release always goes through, so handing control back never leaves the button held down.
      case "input":
        if (agent.trace.status === "needs-help" || data.input?.type === "up")
          BrowserBridge.input(agent.id, data.input);
        return true;
      case "reply":
        if (agent.reply(data.text)) return true;
        console.log(
          `[BrowserUse] Ignoring a reply for session ${agent.id} - it is not waiting for one.`
        );
        return false;
      default:
        return false;
    }
  });

  return () => {
    unlisten();
    stopWatching?.();
  };
}

/**
 * A chat in the web UI: only the agent websocket (plugins/websocket.js) lets a tool take its own
 * control messages, which the session card needs. API, Telegram and scheduled job runs have none.
 */
function isMainChatSession(aibitat) {
  const { invocation } = aibitat.handlerProps || {};
  if (!invocation?.uuid) return false;
  if (typeof aibitat.onControlMessage !== "function") return false;
  return BrowserBridge.offeredIn(aibitat);
}

/**
 * Whose saved browser profile the session uses: the user's own in multi-user mode, the one shared
 * profile in single-user mode.
 * @returns {Promise<{userId: number|null}|null>} null when there is no user to tie it to
 */
async function profileOwner(aibitat) {
  const { SystemSettings } = require("../../../../../models/systemSettings");
  const userId = aibitat.handlerProps?.invocation?.user_id ?? null;
  if (!(await SystemSettings.isMultiUserMode())) return { userId: null };
  return userId === null ? null : { userId };
}

/**
 * The chat that started the session: its in-app path (so a help notification can bring the user
 * back) and its workspace and thread (so a follow-up resumes this chat's sessions first).
 * @returns {Promise<{path: string|null, workspaceSlug: string|null, threadSlug: string|null}>}
 */
async function chatContext(aibitat) {
  const { invocation } = aibitat.handlerProps || {};
  const slug = invocation?.workspace?.slug;
  if (!slug) return { path: null, workspaceSlug: null, threadSlug: null };
  const thread = invocation.thread_id
    ? await require("../../../../../models/workspaceThread")
        .WorkspaceThread.get({ id: Number(invocation.thread_id) })
        .catch(() => null)
    : null;
  return {
    path: thread ? `/workspace/${slug}/t/${thread.slug}` : `/workspace/${slug}`,
    workspaceSlug: slug,
    threadSlug: thread?.slug || null,
  };
}

module.exports = { browserUse };
