import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { execSync, execFileSync, spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const CDP_EVAL_SCRIPT = "/opt/open-computer/interface-service/utils/cdp-eval.js";
const HARVEST_SCRIPT_PATH = "/opt/open-computer/interface-service/utils/browser-harvest.js";
const ACTIVE_TAB_FILE = "/tmp/.open-computer-active-tab";
let _harvestScript: string | null = null;

const NODE_OPTS = {
  encoding: "utf8" as const,
  timeout: 30000,
  maxBuffer: 2 * 1024 * 1024,
  env: { ...process.env, NODE_PATH: "/opt/open-computer/node_modules" },
};

function getHarvestScript(): string {
  if (!_harvestScript) {
    _harvestScript = readFileSync(HARVEST_SCRIPT_PATH, "utf-8");
  }
  return _harvestScript;
}

function cdpEval(code: string, targetUrl?: string): string {
  const args = [CDP_EVAL_SCRIPT, code];
  if (targetUrl) args.push(targetUrl);
  return execFileSync("node", args, NODE_OPTS);
}

function setActiveTab(url: string): void {
  try {
    writeFileSync(ACTIVE_TAB_FILE, url);
  } catch {}
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
  const links = data.actions
    .filter((a: any) => a.tag === "a" && a.href && a.label)
    .sort((a: any, b: any) => {
      const aScore = Math.min(String(a.label).length, 80);
      const bScore = Math.min(String(b.label).length, 80);
      return bScore - aScore;
    })
    .slice(0, 12);
  if (links.length > 0) {
    lines.push("--- LINKS ---");
    for (const a of links) {
      lines.push(`[${a.id}] "${a.label}" -> ${a.href}`);
    }
    lines.push("");
  }
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
  pi.registerTool({
    name: "open_browser",
    label: "Open Browser",
    description:
      "Open a URL in Chromium on the visible desktop so the user can watch. " +
      "Returns a page_state snapshot automatically — no need to call page_state separately. " +
      "After this, use page_open_link/page_click/page_type to interact, or page_read for full text content. " +
      "For articles/results, open the shown href or link id before summarizing.",
    parameters: Type.Object({
      url: Type.Optional(Type.String({
        description: "The URL to open (e.g. 'https://news.ycombinator.com/')",
      })),
      target_url: Type.Optional(Type.String({
        description: "Deprecated alias for url. Use url for new calls.",
      })),
      exec: Type.Optional(Type.String({
        description: "Deprecated alias for url accepted for compatibility with app_open-style calls.",
      })),
      new_window: Type.Optional(
        Type.Boolean({
          description: "Open in a new window instead of a new tab (default: false)",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const url = params.url || params.target_url || params.exec;
      if (!url) {
        return {
          content: [{ type: "text", text: "Validation error: open_browser requires url." }],
          details: {},
        };
      }

      const args: string[] = ["--disable-session-crashed-bubble"];
      if (params.new_window) args.push("--new-window");
      args.push(url);

      const proc = spawn("chromium", args, {
        env: { ...process.env, DISPLAY: ":0" },
        detached: true,
        stdio: "ignore",
      });
      proc.unref();

      // Wait for page to load and stabilize (up to 10s total)
      let pageState = "";
      const urlFragment = new URL(url).hostname;
      const deadline = Date.now() + 10000;

      // Phase 1: Wait for the tab to exist with the right URL
      let tabFound = false;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 400));
        try {
          const checkCode = `JSON.stringify({ url: location.href, ready: document.readyState })`;
          const raw = cdpEval(checkCode, urlFragment);
          const info = JSON.parse(raw);
          if (info.url && info.url.includes(urlFragment)) {
            tabFound = true;
            if (info.ready === "complete") break;
          }
        } catch {}
      }

      // Phase 2: If tab found, wait briefly for network idle (no new content loading)
      if (tabFound && Date.now() < deadline) {
        // Give dynamic content a moment to render after readyState=complete
        await new Promise((r) => setTimeout(r, 300));

        // Poll for DOM stability — body length stops changing
        let lastLen = -1;
        const stabilityDeadline = Math.min(Date.now() + 2000, deadline);
        while (Date.now() < stabilityDeadline) {
          try {
            const lenRaw = cdpEval(`String(document.body.innerHTML.length)`, urlFragment);
            const len = parseInt(lenRaw, 10);
            if (len === lastLen) break;
            lastLen = len;
          } catch {}
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      // Phase 3: Harvest the page state and set as active tab
      if (tabFound) {
        try {
          const raw = cdpEval(getHarvestScript(), urlFragment);
          const data = JSON.parse(raw);
          if (data.url) {
            pageState = formatPageState(raw);
            setActiveTab(urlFragment);
          }
        } catch {}
      }

      if (pageState) {
        return {
          content: [
            {
              type: "text",
              text: `Browser opened: ${url}\n\n${pageState}`,
            },
          ],
          details: {},
        };
      }

      // Fallback: window exists but page state harvest failed
      try {
        const wmList = execSync("DISPLAY=:0 wmctrl -l 2>/dev/null", {
          encoding: "utf8",
          env: { ...process.env, DISPLAY: ":0" },
        });
        if (wmList.toLowerCase().includes("chromium")) {
          return {
            content: [
              {
                type: "text",
                text: `Browser opened: ${url}\nPage loaded but harvest timed out. Use page_state({"target_url":"${urlFragment}"}) to inspect it.`,
              },
            ],
            details: {},
          };
        }
      } catch {}

      return {
        content: [
          {
            type: "text",
            text: `Browser launched for ${url} but window detection timed out. It may still be loading — try page_state to check.`,
          },
        ],
        details: {},
      };
    },
  });
}
