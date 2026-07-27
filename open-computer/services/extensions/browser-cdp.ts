import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { execFileSync } from "child_process";

const CDP_EVAL_SCRIPT = "/opt/open-computer/interface-service/utils/cdp-eval.js";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "browser_cdp",
    label: "Browser CDP",
    description:
      "Execute JavaScript in the browser page via Chrome DevTools Protocol. " +
      "The code runs in the ACTUAL browser page context (like the Chrome console), so " +
      "document, window, fetch, etc. are all available. " +
      "The browser MUST already be open (use open_browser first and wait for it to complete). " +
      "Returns the result of the last expression. " +
      "Examples: " +
      "  document.title | " +
      "  document.body.innerText.slice(0, 3000) | " +
      "  JSON.stringify([...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.href}))) | " +
      "  document.querySelector('#search').value = 'test'",
    parameters: Type.Object({
      code: Type.String({
        description:
          "JavaScript to execute in the browser page context. " +
          "Use document, window, fetch, etc. as if typing in Chrome DevTools console. " +
          "The result of the last expression is returned.",
      }),
      target_url: Type.Optional(
        Type.String({
          description:
            "Optional: match a specific tab by URL substring (e.g. 'ycombinator'). " +
            "If omitted, uses the most recently opened page tab.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const args = [CDP_EVAL_SCRIPT, params.code];
        if (params.target_url) args.push(params.target_url);

        const result = execFileSync("node", args, {
          encoding: "utf8",
          timeout: 30000,
          maxBuffer: 1024 * 1024,
          env: { ...process.env, NODE_PATH: "/opt/open-computer/node_modules" },
        });

        const text = result.length > 10000
          ? result.slice(0, 10000) + "\n... (truncated)"
          : result;

        return {
          content: [{ type: "text", text: text || "(no return value)" }],
          details: {},
        };
      } catch (err: unknown) {
        const error = err as { stderr?: string; message?: string };
        const msg = error.stderr?.trim() || error.message || "Unknown error";

        if (msg.includes("ECONNREFUSED") || msg.includes("No browser pages")) {
          return {
            content: [{ type: "text", text: `Error: ${msg}\nMake sure the browser is open (use open_browser first).` }],
            details: {},
          };
        }

        return {
          content: [{ type: "text", text: msg }],
          details: {},
        };
      }
    },
  });
}
