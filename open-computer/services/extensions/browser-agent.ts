import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { execFileSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const CDP_EVAL_SCRIPT = "/opt/open-computer/interface-service/utils/cdp-eval.js";
const CDP_INPUT_SCRIPT = "/opt/open-computer/interface-service/utils/cdp-input.js";
const HARVEST_SCRIPT_PATH = "/opt/open-computer/interface-service/utils/browser-harvest.js";
const ACTIVE_TAB_FILE = "/tmp/.open-computer-active-tab";
let _harvestScript: string | null = null;

const NODE_OPTS = {
  encoding: "utf8" as const,
  timeout: 30000,
  maxBuffer: 2 * 1024 * 1024,
  env: { ...process.env, NODE_PATH: "/opt/open-computer/node_modules" },
};

type ExecError = {
  stderr?: string;
  message?: string;
};

function getHarvestScript(): string {
  if (!_harvestScript) {
    _harvestScript = readFileSync(HARVEST_SCRIPT_PATH, "utf-8");
  }
  return _harvestScript;
}

function cdpEval(code: string, targetUrl?: string): string {
  const args = [CDP_EVAL_SCRIPT, code];
  const url = targetUrl || getActiveTab();
  if (url) args.push(url);
  return execCdp(args, Boolean(targetUrl));
}

function cdpClick(x: number, y: number, targetUrl?: string): string {
  const args = [CDP_INPUT_SCRIPT, "click", String(x), String(y)];
  const url = targetUrl || getActiveTab();
  if (url) args.push(url);
  return execCdp(args, Boolean(targetUrl));
}

function cdpType(text: string, targetUrl?: string): string {
  const args = [CDP_INPUT_SCRIPT, "type", text];
  const url = targetUrl || getActiveTab();
  if (url) args.push(url);
  return execCdp(args, Boolean(targetUrl), { ...NODE_OPTS, timeout: Math.max(30000, text.length * 150) });
}

function cdpKey(key: string, targetUrl?: string): string {
  const args = [CDP_INPUT_SCRIPT, "key", key];
  const url = targetUrl || getActiveTab();
  if (url) args.push(url);
  return execCdp(args, Boolean(targetUrl));
}

/**
 * Returns inline JS that briefly highlights an element on the page so the
 * user watching the desktop stream can see what the agent is interacting with.
 * `elExpr` is the JS variable name holding the element reference.
 */
function highlightJs(elExpr: string, color = "rgba(0, 120, 255, 0.25)", borderColor = "#0078ff"): string {
  return `
    (function(el) {
      if (!el) return;
      var prev = el.style.cssText;
      el.style.outline = '3px solid ${borderColor}';
      el.style.backgroundColor = '${color}';
      el.style.transition = 'outline 0.2s, background-color 0.2s';
      setTimeout(function() { el.style.cssText = prev; }, 1500);
    })(${elExpr});`;
}

function parseTextIdSelector(selector?: string): number[] {
  const raw = String(selector || "").trim();
  if (!raw) return [];

  // Be forgiving for small models that pass page_state text refs as selectors:
  // "[T4-T7]", "[T3, T8, T13]", "[T3],[T8]", or "T4-T7".
  const normalized = raw
    .replace(/\]\s*,\s*\[/g, ",")
    .replace(/^\[/g, "")
    .replace(/\]$/g, "")
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .trim();

  if (!/^T?\d+(\s*-\s*T?\d+)?(\s*,\s*T?\d+(\s*-\s*T?\d+)?)*$/i.test(normalized)) {
    return [];
  }

  const ids: number[] = [];
  for (const part of normalized.split(",")) {
    const match = part.trim().match(/^T?(\d+)(?:\s*-\s*T?(\d+))?$/i);
    if (!match) continue;
    const from = Number(match[1]);
    const to = match[2] != null ? Number(match[2]) : from;
    if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
    const step = from <= to ? 1 : -1;
    for (let id = from; step > 0 ? id <= to : id >= to; id += step) {
      ids.push(id);
    }
  }

  return ids;
}

function getActiveTab(): string {
  try {
    return readFileSync(ACTIVE_TAB_FILE, "utf-8").trim();
  } catch {
    return "";
  }
}

function setActiveTab(url: string): void {
  try {
    writeFileSync(ACTIVE_TAB_FILE, url);
  } catch {}
}

function clearActiveTab(): void {
  setActiveTab("");
}

function activeTabMismatch(err: ExecError): boolean {
  const msg = `${err.stderr || ""}\n${err.message || ""}`;
  return msg.includes("No browser tab matching");
}

function execCdp(args: string[], explicitTarget: boolean, opts = NODE_OPTS): string {
  try {
    return execFileSync("node", args, opts);
  } catch (err: unknown) {
    const error = err as ExecError;
    if (!explicitTarget && args.length > 2 && activeTabMismatch(error)) {
      clearActiveTab();
      return execFileSync("node", args.slice(0, -1), opts);
    }
    throw err;
  }
}

function formatPageState(raw: string): string {
  const data = JSON.parse(raw);
  const lines: string[] = [];

  lines.push(`URL: ${data.url}`);
  lines.push(`Title: ${data.title}`);
  lines.push(
    `Scroll: ${data.scroll.y}/${data.scroll.maxY}px | Viewport: ${data.viewport.w}x${data.viewport.h}`
  );
  lines.push("");

  if (data.actions.length > 0) {
    lines.push("--- ACTIONS ---");
    for (const a of data.actions) {
      let line = `[${a.id}] ${a.tag}`;
      if (a.state) line += ` (${a.state})`;
      line += ` "${a.label}"`;
      if (a.href) line += ` -> ${a.href}`;
      lines.push(line);
    }
  } else {
    lines.push("--- NO INTERACTIVE ELEMENTS VISIBLE ---");
  }

  if (data.texts.length > 0) {
    lines.push("");
    lines.push("--- TEXT ---");
    for (const t of data.texts) {
      lines.push(`[T${t.id}] ${t.tag}: ${t.text}`);
    }
  }

  return lines.join("\n");
}

export default function (pi: ExtensionAPI) {
  // Tool 1: Get page state as a flat-map
  pi.registerTool({
    name: "page_state",
    label: "Page State",
    description:
      "Get a compact flat-map of the current page showing all visible interactive elements " +
      "(buttons, links, inputs) and key text content. Link entries include hrefs when available. Each element has an [id] you can use " +
      "with page_click or page_type. Much faster and cheaper than reading raw DOM. " +
      "Use this FIRST to understand what's on screen before acting; for lists of articles/results, use page_open_link on link IDs or shown hrefs before reading/summarizing.",
    parameters: Type.Object({
      target_url: Type.Optional(
        Type.String({
          description: "Select an already-open tab by URL substring. Does not navigate; use open_browser to open a URL. If omitted, uses the most recent tab.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = cdpEval(getHarvestScript(), params.target_url);
        const data = JSON.parse(raw);
        if (data.url) setActiveTab(new URL(data.url).hostname);
        const formatted = formatPageState(raw);
        return {
          content: [{ type: "text", text: formatted }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        const msg = error.stderr?.trim() || error.message || "Unknown error";
        return {
          content: [{ type: "text", text: `Error: ${msg}\nMake sure the browser is open (use open_browser first). If a clicked link just navigated the tab, retry without target_url or call page_tabs.` }],
          details: {},
        };
      }
    },
  });

  // Tool 2: Click an element by harvest ID
  pi.registerTool({
    name: "page_click",
    label: "Page Click",
    description:
      "Click an interactive element by its [id] from page_state. " +
      "Uses trusted CDP Input.dispatchMouseEvent (isTrusted=true) so it passes " +
      "anti-bot checks on sites like LinkedIn, Cloudflare-protected pages, etc. " +
      "Call page_state first to see available elements and their IDs.",
    parameters: Type.Object({
      id: Type.Number({
        description: "The element [id] from page_state output to click.",
      }),
      target_url: Type.Optional(
        Type.String({
          description: "Select an already-open tab by URL substring. Does not navigate.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        // Scroll element into view and get its center coordinates
        const coordCode = `(function() {
          const el = document.querySelector('[data-harvest-id="${params.id}"]');
          if (!el) return JSON.stringify({error: "Element [${params.id}] not found. Run page_state again."});
          el.scrollIntoViewIfNeeded?.();
          ${highlightJs("el", "rgba(255, 140, 0, 0.3)", "#ff8c00")}
          const r = el.getBoundingClientRect();
          return JSON.stringify({
            x: Math.round(r.left + r.width/2),
            y: Math.round(r.top + r.height/2),
            label: (el.innerText?.trim().slice(0, 60) || el.tagName)
          });
        })()`;
        const coordRaw = cdpEval(coordCode, params.target_url);
        const coord = JSON.parse(coordRaw);

        if (coord.error) {
          return { content: [{ type: "text", text: coord.error }], details: {} };
        }

        // Dispatch trusted mouse event via CDP Input.dispatchMouseEvent
        const result = cdpClick(coord.x, coord.y, params.target_url);
        return {
          content: [{ type: "text", text: `${result} — "${coord.label}"` }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Click failed" }],
          details: {},
        };
      }
    },
  });

  // Tool 3: Open a link by page_state ID or direct URL
  pi.registerTool({
    name: "page_open_link",
    label: "Page Open Link",
    description:
      "Open a link/article/result from the current page. Prefer this for lists of articles or search results: " +
      "use the link [id] from page_state, or pass a direct href/url. After opening, call page_read to read the article page. " +
      "Do not summarize articles from the listing page alone.",
    parameters: Type.Object({
      id: Type.Optional(
        Type.Number({
          description: "The link [id] from page_state to open.",
        })
      ),
      url: Type.Optional(
        Type.String({
          description: "Direct URL/href to open if you already have it from page_state/open_browser.",
        })
      ),
      new_tab: Type.Optional(
        Type.Boolean({
          description: "Open in a new tab instead of navigating the current tab. Default false.",
        })
      ),
      target_url: Type.Optional(
        Type.String({
          description: "Select an already-open tab by URL substring. Does not navigate by itself.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        let href = String(params.url || "").trim();
        if (!href && params.id != null) {
          const hrefCode = `(function() {
            const el = document.querySelector('[data-harvest-id="${params.id}"]');
            if (!el) return "";
            const link = el.closest("a") || (el.tagName === "A" ? el : null);
            return link ? link.href : "";
          })()`;
          href = cdpEval(hrefCode, params.target_url).trim();
        }

        if (!href) {
          return {
            content: [{ type: "text", text: "No link URL found. Run page_state and pass a link [id], or pass url." }],
            details: {},
          };
        }

        const navCode = `(function() {
          const href = ${JSON.stringify(href)};
          if (${params.new_tab === true ? "true" : "false"}) {
            window.open(href, "_blank", "noopener");
          } else {
            location.href = href;
          }
          return "Opening link: " + href;
        })()`;
        const result = cdpEval(navCode, params.target_url);
        try {
          setActiveTab(new URL(href).hostname);
        } catch {}
        return {
          content: [{ type: "text", text: `${result}\nNext: call page_read({}) after the article page loads.` }],
          details: { url: href },
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Open link failed" }],
          details: {},
        };
      }
    },
  });

  // Tool 4: Type into an element by harvest ID
  pi.registerTool({
    name: "page_type",
    label: "Page Type",
    description:
      "Focus an input/textarea by its [id] from page_state and type text into it " +
      "using trusted CDP Input.dispatchKeyEvent (isTrusted=true). Works on sites like " +
      "LinkedIn that reject synthetic input events. " +
      "Optionally clear existing content first. " +
      "Call page_state first to see available input elements. " +
      "If id is omitted, uses the focused field or the first visible search/text input.",
    parameters: Type.Object({
      id: Type.Optional(
        Type.Number({
          description:
            "The element [id] from page_state to type into. Optional: omit to use the focused field or first visible search/text input.",
        })
      ),
      text: Type.String({
        description: "The text to type into the element.",
      }),
      clear: Type.Optional(
        Type.Boolean({
          description: "Clear existing content before typing (default: true).",
        })
      ),
      submit: Type.Optional(
        Type.Boolean({
          description: "Press Enter after typing to submit (default: false).",
        })
      ),
      target_url: Type.Optional(
        Type.String({
          description: "Select an already-open tab by URL substring. Does not navigate.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const clearFirst = params.clear !== false;
      const submitAfter = params.submit === true;

      try {
        // Step 1: Click the element to focus it (trusted click)
        const coordCode = `(function() {
          const requestedId = ${params.id == null ? "null" : JSON.stringify(params.id)};
          document.querySelectorAll('[data-page-type-target]').forEach(e => e.removeAttribute('data-page-type-target'));
          let el = requestedId == null ? null : document.querySelector('[data-harvest-id="' + requestedId + '"]');
          if (!el && requestedId != null) return JSON.stringify({error: "Element [" + requestedId + "] not found. Run page_state again."});
          if (!el) {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) el = active;
          }
          if (!el) {
            const candidates = [...document.querySelectorAll('textarea,input:not([type]),input[type="text"],input[type="search"],input[name="q"],input[aria-label*="Search" i],input[title*="Search" i],[contenteditable="true"]')];
            el = candidates.find(node => {
              const r = node.getBoundingClientRect();
              const s = getComputedStyle(node);
              return r.width > 0 && r.height > 0 && r.bottom >= 0 && r.top <= innerHeight && s.display !== 'none' && s.visibility !== 'hidden' && !node.disabled && !node.readOnly;
            });
          }
          if (!el) return JSON.stringify({error: "No focused or visible text/search input found. Run page_state and pass an input id."});
          el.setAttribute('data-page-type-target', 'true');
          el.scrollIntoViewIfNeeded?.();
          ${highlightJs("el", "rgba(0, 200, 100, 0.25)", "#00c864")}
          const r = el.getBoundingClientRect();
          return JSON.stringify({
            x: Math.round(r.left + r.width/2),
            y: Math.round(r.top + r.height/2),
            label: el.getAttribute('aria-label') || el.getAttribute('name') || el.getAttribute('placeholder') || el.tagName
          });
        })()`;
        const coordRaw = cdpEval(coordCode, params.target_url);
        const coord = JSON.parse(coordRaw);

        if (coord.error) {
          return { content: [{ type: "text", text: coord.error }], details: {} };
        }

        // Click to focus the input field
        cdpClick(coord.x, coord.y, params.target_url);

        // Step 2: Clear existing content if requested (select all + delete)
        if (clearFirst) {
          // Ctrl+A to select all, then Backspace to delete
          const selectAllCode = `(function() {
            const el = document.activeElement;
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
              el.select();
            } else {
              document.execCommand('selectAll');
            }
            return "selected";
          })()`;
          cdpEval(selectAllCode, params.target_url);
          cdpKey("Backspace", params.target_url);
        }

        // Step 3: Type each character with trusted key events
        cdpType(params.text, params.target_url);

        // Step 4: Submit if requested
        if (submitAfter) {
          cdpKey("Enter", params.target_url);
        }

        // Read back the value for confirmation
        const confirmCode = `(function() {
          const el = document.querySelector('[data-page-type-target]') || document.activeElement;
          if (!el) return "(element gone)";
          return el.value?.slice(0, 80) || el.innerText?.trim().slice(0, 80) || "(typed)";
        })()`;
        const finalValue = cdpEval(confirmCode, params.target_url);

        return {
          content: [{ type: "text", text: `typed into ${params.id == null ? coord.label : `[${params.id}]`}: "${finalValue}"${submitAfter ? " (submitted)" : ""}` }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Type failed" }],
          details: {},
        };
      }
    },
  });

  // Tool 4: Scroll the page
  pi.registerTool({
    name: "page_scroll",
    label: "Page Scroll",
    description:
      "Scroll the page up or down to reveal more content. " +
      "After scrolling, call page_state to see the new visible elements.",
    parameters: Type.Object({
      direction: Type.Union([Type.Literal("up"), Type.Literal("down")], {
        description: "Scroll direction.",
      }),
      amount: Type.Optional(
        Type.Number({
          description: "Pixels to scroll (default: 600, roughly one viewport).",
        })
      ),
      target_url: Type.Optional(
        Type.String({
          description: "Select an already-open tab by URL substring. Does not navigate.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const px = params.amount || 600;
      const dir = params.direction === "up" ? -px : px;

      try {
        const scrollCode = `(function() {
          window.scrollBy(0, ${dir});
          return "scrolled ${params.direction} ${px}px — now at " + window.scrollY + "/" + (document.body.scrollHeight - window.innerHeight) + "px";
        })()`;

        const result = cdpEval(scrollCode, params.target_url);
        return {
          content: [{ type: "text", text: result }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Scroll failed" }],
          details: {},
        };
      }
    },
  });

  // Tool 5: Read specific text content from the page
  pi.registerTool({
    name: "page_read",
    label: "Page Read",
    description:
      "Read the full text content of text elements from page_state, or get the body text of the page. " +
      "Batch reads are preferred: pass text_ids/ids as an array (e.g. [1,2,3]) or from_text_id/to_text_id " +
      "for a range. Do not call page_read repeatedly for adjacent IDs.",
    parameters: Type.Object({
      text_id: Type.Optional(
        Type.Union([
          Type.Number(),
          Type.Array(Type.Number()),
        ], {
          description: "A single text element [Tn] ID from page_state, or an array of IDs to batch read.",
        }),
      ),
      text_ids: Type.Optional(
        Type.Array(Type.Number(), {
          description: "Multiple text element IDs to read at once (e.g. [1, 2, 3, 4, 5]). Much more efficient than calling page_read repeatedly.",
        })
      ),
      ids: Type.Optional(
        Type.Array(Type.Number(), {
          description: "Alias for text_ids. Use this to batch read many [Tn] IDs in one call.",
        })
      ),
      from_text_id: Type.Optional(
        Type.Number({
          description: "Start of an inclusive text ID range to read, e.g. 16.",
        })
      ),
      to_text_id: Type.Optional(
        Type.Number({
          description: "End of an inclusive text ID range to read, e.g. 41.",
        })
      ),
      selector: Type.Optional(
        Type.String({
          description: "CSS selector to read text from (e.g. 'main', 'article', '.content'). Also accepts page_state text refs like '[T4-T7]' or '[T3, T8, T13]'.",
        })
      ),
      target_url: Type.Optional(
        Type.String({
          description: "Select an already-open tab by URL substring. Does not navigate.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        let readCode: string;

        const rawIds = [
          ...(Array.isArray(params.text_ids) ? params.text_ids : []),
          ...(Array.isArray(params.ids) ? params.ids : []),
          ...parseTextIdSelector(params.selector),
          ...(Array.isArray(params.text_id)
            ? params.text_id
            : params.text_id != null
              ? [params.text_id]
              : []),
        ];
        if (params.from_text_id != null || params.to_text_id != null) {
          const from = Number(params.from_text_id);
          const to = Number(params.to_text_id);
          if (Number.isFinite(from) && Number.isFinite(to)) {
            const step = from <= to ? 1 : -1;
            for (let id = from; step > 0 ? id <= to : id >= to; id += step) {
              rawIds.push(id);
            }
          }
        }
        const ids: number[] = [...new Set(
          rawIds
            .map((id) => Number(id))
            .filter((id) => Number.isFinite(id))
            .map((id) => Math.trunc(id))
        )].slice(0, 80);

        if (ids.length > 0) {
          const idsJson = JSON.stringify(ids);
          readCode = `(function() {
            const ids = ${idsJson};
            const results = [];
            for (const id of ids) {
              const el = document.querySelector('[data-harvest-tid="' + id + '"]');
              if (el) {
                ${highlightJs("el")}
                results.push("[T" + id + "] " + el.innerText.slice(0, 2000));
              } else {
                results.push("[T" + id + "] (not found)");
              }
            }
            return results.join("\\n\\n---\\n\\n");
          })()`;
        } else if (params.selector) {
          const sel = params.selector.replace(/"/g, '\\"');
          readCode = `(function() {
            const el = document.querySelector("${sel}");
            if (!el) return "No element found for selector: ${sel}";
            ${highlightJs("el")}
            return el.innerText.slice(0, 8000);
          })()`;
        } else {
          readCode = `(function() {
            const main = document.querySelector('main') || document.querySelector('article') || document.body;
            return main.innerText.slice(0, 8000);
          })()`;
        }

        const result = cdpEval(readCode, params.target_url);
        const text = result.length > 10000
          ? result.slice(0, 10000) + "\n... (truncated)"
          : result;

        return {
          content: [{ type: "text", text: text || "(no text content)" }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Read failed" }],
          details: {},
        };
      }
    },
  });

  // Tool 6: Press a special key (trusted CDP event)
  pi.registerTool({
    name: "page_key",
    label: "Page Key",
    description:
      "Press a keyboard key using trusted CDP Input.dispatchKeyEvent. " +
      "Useful for Enter (submit), Tab (next field), Escape (close modal), " +
      "arrow keys, Backspace, Delete, etc. " +
      "The key is dispatched to whatever element currently has focus.",
    parameters: Type.Object({
      key: Type.String({
        description:
          "Key to press: Enter, Tab, Escape, Backspace, Delete, Space, " +
          "ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, End, PageUp, PageDown.",
      }),
      target_url: Type.Optional(
        Type.String({
          description: "Select an already-open tab by URL substring. Does not navigate.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const result = cdpKey(params.key, params.target_url);
        return {
          content: [{ type: "text", text: result }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Key press failed" }],
          details: {},
        };
      }
    },
  });

  // Tool 7: List all open tabs
  pi.registerTool({
    name: "page_tabs",
    label: "Page Tabs",
    description:
      "List all open browser tabs with their URLs and titles. " +
      "Shows which tab is currently active (marked with *). " +
      "Use this to see what's open and pick a target_url for other tools.",
    parameters: Type.Object({}),
    async execute(_toolCallId, _params, _signal, _onUpdate, _ctx) {
      try {
        const listCode = `
          const http = require("http");
          const get = (url) => new Promise((res, rej) => {
            http.get(url, r => { let d=""; r.on("data",c=>d+=c); r.on("end",()=>res(d)); }).on("error",rej);
          });
          (async () => {
            const raw = await get("http://127.0.0.1:9222/json");
            const targets = JSON.parse(raw).filter(t => t.type === "page" && !t.url.startsWith("chrome://"));
            process.stdout.write(JSON.stringify(targets.map(t => ({ url: t.url, title: t.title }))));
          })();
        `;
        const raw = execFileSync("node", ["-e", listCode], NODE_OPTS);
        const tabs = JSON.parse(raw);
        const activeTab = getActiveTab();

        const lines: string[] = ["--- OPEN TABS ---"];
        for (let i = 0; i < tabs.length; i++) {
          const t = tabs[i];
          const isActive = activeTab && (t.url.includes(activeTab) || t.title.toLowerCase().includes(activeTab.toLowerCase()));
          lines.push(`${isActive ? "* " : "  "}[${i + 1}] ${t.title}`);
          lines.push(`      ${t.url}`);
        }
        if (tabs.length === 0) {
          lines.push("(no tabs open)");
        }
        return {
          content: [{ type: "text", text: lines.join("\n") }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Failed to list tabs" }],
          details: {},
        };
      }
    },
  });

  // Tool 8: Switch active tab
  pi.registerTool({
    name: "page_switch",
    label: "Page Switch",
    description:
      "Switch the active tab by URL substring or tab number from page_tabs. " +
      "After switching, all page tools (page_state, page_scroll, page_click, etc.) " +
      "will target this tab by default.",
    parameters: Type.Object({
      tab: Type.Union([Type.String(), Type.Number()], {
        description: "Tab number from page_tabs (e.g. 2) or a URL substring to match (e.g. 'github').",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const listCode = `
          const http = require("http");
          const get = (url) => new Promise((res, rej) => {
            http.get(url, r => { let d=""; r.on("data",c=>d+=c); r.on("end",()=>res(d)); }).on("error",rej);
          });
          (async () => {
            const raw = await get("http://127.0.0.1:9222/json");
            const targets = JSON.parse(raw).filter(t => t.type === "page" && !t.url.startsWith("chrome://"));
            process.stdout.write(JSON.stringify(targets.map(t => ({ url: t.url, title: t.title }))));
          })();
        `;
        const raw = execFileSync("node", ["-e", listCode], NODE_OPTS);
        const tabs = JSON.parse(raw);

        let target: { url: string; title: string } | undefined;
        const tabNum = Number(params.tab);
        if (!isNaN(tabNum) && tabNum === Math.floor(tabNum)) {
          const idx = tabNum - 1;
          if (idx >= 0 && idx < tabs.length) target = tabs[idx];
        } else {
          const q = String(params.tab).toLowerCase();
          target = tabs.find((t: { url: string; title: string }) =>
            t.url.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)
          );
        }

        if (!target) {
          return {
            content: [{ type: "text", text: `No tab matching "${params.tab}". Use page_tabs to see open tabs.` }],
            details: {},
          };
        }

        const hostname = new URL(target.url).hostname;
        setActiveTab(hostname);
        return {
          content: [{ type: "text", text: `Switched to: ${target.title}\n${target.url}` }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Switch failed" }],
          details: {},
        };
      }
    },
  });

  // Tool 9: Close a tab
  pi.registerTool({
    name: "page_close",
    label: "Page Close",
    description:
      "Close a browser tab by URL substring or tab number from page_tabs. " +
      "Useful for cleaning up after research to avoid tab confusion.",
    parameters: Type.Object({
      tab: Type.Union([Type.String(), Type.Number()], {
        description: "Tab number from page_tabs (e.g. 2) or a URL substring to match (e.g. 'google').",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const tabNum = Number(params.tab);
        const isNumeric = !isNaN(tabNum) && tabNum === Math.floor(tabNum);
        const tabSelector = isNumeric
          ? `targets[${tabNum - 1}]`
          : `targets.find(t => t.url.toLowerCase().includes(${JSON.stringify(String(params.tab).toLowerCase())}) || t.title.toLowerCase().includes(${JSON.stringify(String(params.tab).toLowerCase())}))`;

        const listCode = `
          const http = require("http");
          const get = (url) => new Promise((res, rej) => {
            http.get(url, r => { let d=""; r.on("data",c=>d+=c); r.on("end",()=>res(d)); }).on("error",rej);
          });
          (async () => {
            const raw = await get("http://127.0.0.1:9222/json");
            const targets = JSON.parse(raw).filter(t => t.type === "page" && !t.url.startsWith("chrome://"));
            const tab = ${tabSelector};
            if (!tab) { process.stdout.write(JSON.stringify({error:"not found"})); return; }
            await get("http://127.0.0.1:9222/json/close/" + tab.id);
            process.stdout.write(JSON.stringify({closed: tab.url, title: tab.title}));
          })();
        `;
        const raw = execFileSync("node", ["-e", listCode], {
          ...NODE_OPTS,
          env: { ...NODE_OPTS.env, NODE_PATH: "/opt/open-computer/node_modules" },
        });
        const result = JSON.parse(raw);

        if (result.error) {
          return {
            content: [{ type: "text", text: `No tab matching "${params.tab}". Use page_tabs to see open tabs.` }],
            details: {},
          };
        }

        return {
          content: [{ type: "text", text: `Closed: ${result.title}\n${result.closed}` }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        return {
          content: [{ type: "text", text: error.stderr?.trim() || error.message || "Close failed" }],
          details: {},
        };
      }
    },
  });
}
