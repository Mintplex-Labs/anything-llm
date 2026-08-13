#!/usr/bin/env node
//
// Evaluates JavaScript in a Chromium browser page via CDP.
// Usage: node cdp-eval.js <code> [target_url_substring]
//
// Connects to http://127.0.0.1:9222, finds a page target,
// attaches, runs Runtime.evaluate, prints the result to stdout.
// Exits 0 on success, 1 on error (error message on stderr).

const WebSocket = require("ws");
const http = require("http");

const code = process.argv[2];
const targetUrl = process.argv[3] || "";

if (!code) {
  process.stderr.write("Usage: node cdp-eval.js <code> [target_url]\n");
  process.exit(1);
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

let msgId = 1;

function cdpSend(ws, method, params, sessionId) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    const msg = { id, method, params: params || {} };
    if (sessionId) msg.sessionId = sessionId;

    const timeout = setTimeout(() => {
      ws.off("message", handler);
      reject(new Error(`CDP timeout: ${method}`));
    }, 15000);

    function handler(raw) {
      let parsed;
      try {
        parsed = JSON.parse(raw.toString());
      } catch {
        return;
      }
      if (parsed.id !== id) return;
      ws.off("message", handler);
      clearTimeout(timeout);
      if (parsed.error) {
        reject(new Error(`CDP error: ${parsed.error.message}`));
      } else {
        resolve(parsed.result);
      }
    }

    ws.on("message", handler);
    ws.send(JSON.stringify(msg));
  });
}

async function main() {
  const versionRaw = await httpGet("http://127.0.0.1:9222/json/version");
  const version = JSON.parse(versionRaw);
  const browserWsUrl = version.webSocketDebuggerUrl;
  if (!browserWsUrl) throw new Error("No webSocketDebuggerUrl — is Chromium running?");

  const ws = await new Promise((resolve, reject) => {
    const socket = new WebSocket(browserWsUrl);
    const t = setTimeout(() => reject(new Error("WS connect timeout")), 5000);
    socket.on("open", () => { clearTimeout(t); resolve(socket); });
    socket.on("error", (err) => { clearTimeout(t); reject(err); });
  });

  try {
    const { targetInfos } = await cdpSend(ws, "Target.getTargets");
    const pages = targetInfos.filter(
      (t) => t.type === "page" && !t.url.startsWith("chrome://") && !t.url.startsWith("devtools://")
    );
    if (pages.length === 0) throw new Error("No browser pages open.");

    let target = pages[pages.length - 1];
    if (targetUrl) {
      const match = pages.find(
        (p) => p.url.includes(targetUrl) || p.title.toLowerCase().includes(targetUrl.toLowerCase())
      );
      if (!match) {
        const openTabs = pages.map((p) => `- ${p.title} ${p.url}`).join("\n");
        throw new Error(`No browser tab matching "${targetUrl}". Open tabs:\n${openTabs}`);
      }
      if (match) target = match;
    }

    const { sessionId } = await cdpSend(ws, "Target.attachToTarget", {
      targetId: target.targetId,
      flatten: true,
    });

    await cdpSend(ws, "Runtime.enable", {}, sessionId);

    const evalResult = await cdpSend(ws, "Runtime.evaluate", {
      expression: code,
      returnByValue: true,
      awaitPromise: true,
      userGesture: true,
    }, sessionId);

    if (evalResult.exceptionDetails) {
      const errMsg =
        evalResult.exceptionDetails.exception?.description ||
        evalResult.exceptionDetails.text ||
        "Unknown JS error";
      process.stderr.write(`JS Error: ${errMsg}\n`);
      process.exit(1);
    }

    const val = evalResult.result;
    let out;
    if (val.type === "undefined") {
      out = "(no return value)";
    } else if (val.type === "string") {
      out = val.value;
    } else if (val.value !== undefined) {
      out = typeof val.value === "string" ? val.value : JSON.stringify(val.value, null, 2);
    } else {
      out = val.description || "(no value)";
    }

    process.stdout.write(out);
  } finally {
    ws.close();
  }
}

main().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
