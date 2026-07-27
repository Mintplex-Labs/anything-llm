#!/usr/bin/env node
//
// CDP input dispatcher — sends trusted mouse/keyboard events via Chrome DevTools Protocol.
// These produce isTrusted: true events that pass anti-bot checks (LinkedIn, Cloudflare, etc.)
//
// Usage:
//   node cdp-input.js click <x> <y> [target_url]
//   node cdp-input.js type <text> [target_url]
//   node cdp-input.js key <key> [target_url]           (e.g. "Enter", "Tab", "Escape")
//
// Connects to http://127.0.0.1:9222, attaches to a page target, dispatches native input.

const WebSocket = require("ws");
const http = require("http");

const action = process.argv[2];
if (!action || !["click", "type", "key"].includes(action)) {
  process.stderr.write("Usage: node cdp-input.js <click|type|key> <args...> [target_url]\n");
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
      try { parsed = JSON.parse(raw.toString()); } catch { return; }
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Randomized human-like delay between keystrokes
function keystrokeDelay() {
  return 30 + Math.floor(Math.random() * 60);
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
    // Find target page
    const { targetInfos } = await cdpSend(ws, "Target.getTargets");
    const pages = targetInfos.filter(
      (t) => t.type === "page" && !t.url.startsWith("chrome://") && !t.url.startsWith("devtools://")
    );
    if (pages.length === 0) throw new Error("No browser pages open.");

    // Determine target URL filter (always last arg if it doesn't look like a coordinate/text)
    let targetUrl = "";
    if (action === "click") {
      targetUrl = process.argv[5] || "";
    } else if (action === "type") {
      targetUrl = process.argv[4] || "";
    } else if (action === "key") {
      targetUrl = process.argv[4] || "";
    }

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

    if (action === "click") {
      const x = parseFloat(process.argv[3]);
      const y = parseFloat(process.argv[4]);
      if (isNaN(x) || isNaN(y)) throw new Error("click requires <x> <y> coordinates");

      // Move mouse to position first (triggers hover states)
      await cdpSend(ws, "Input.dispatchMouseEvent", {
        type: "mouseMoved", x, y
      }, sessionId);
      await sleep(50);

      // Press
      await cdpSend(ws, "Input.dispatchMouseEvent", {
        type: "mousePressed", x, y, button: "left", clickCount: 1
      }, sessionId);
      await sleep(30 + Math.floor(Math.random() * 40));

      // Release
      await cdpSend(ws, "Input.dispatchMouseEvent", {
        type: "mouseReleased", x, y, button: "left", clickCount: 1
      }, sessionId);

      process.stdout.write(`clicked at (${x}, ${y})`);

    } else if (action === "type") {
      const text = process.argv[3];
      if (!text) throw new Error("type requires <text> argument");

      // Type each character individually with realistic delays
      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // dispatchKeyEvent with char sends the character as a trusted keyboard input
        await cdpSend(ws, "Input.dispatchKeyEvent", {
          type: "keyDown",
          text: char,
          key: char,
          code: charToCode(char),
          unmodifiedText: char,
        }, sessionId);

        await cdpSend(ws, "Input.dispatchKeyEvent", {
          type: "keyUp",
          key: char,
          code: charToCode(char),
        }, sessionId);

        await sleep(keystrokeDelay());
      }

      process.stdout.write(`typed ${text.length} chars`);

    } else if (action === "key") {
      const key = process.argv[3];
      if (!key) throw new Error("key requires <key> argument (e.g. Enter, Tab, Escape)");

      const keyDef = specialKeys[key] || { key, code: `Key${key.toUpperCase()}` };

      await cdpSend(ws, "Input.dispatchKeyEvent", {
        type: "keyDown",
        key: keyDef.key,
        code: keyDef.code,
        windowsVirtualKeyCode: keyDef.keyCode || 0,
        nativeVirtualKeyCode: keyDef.keyCode || 0,
      }, sessionId);
      await sleep(50);

      await cdpSend(ws, "Input.dispatchKeyEvent", {
        type: "keyUp",
        key: keyDef.key,
        code: keyDef.code,
        windowsVirtualKeyCode: keyDef.keyCode || 0,
        nativeVirtualKeyCode: keyDef.keyCode || 0,
      }, sessionId);

      process.stdout.write(`pressed ${key}`);
    }

  } finally {
    ws.close();
  }
}

// Maps common characters to their Key code values
function charToCode(char) {
  if (char >= 'a' && char <= 'z') return `Key${char.toUpperCase()}`;
  if (char >= 'A' && char <= 'Z') return `Key${char}`;
  if (char >= '0' && char <= '9') return `Digit${char}`;
  if (char === ' ') return 'Space';
  if (char === '.') return 'Period';
  if (char === ',') return 'Comma';
  if (char === '/') return 'Slash';
  if (char === '@') return 'Digit2';
  if (char === '-') return 'Minus';
  if (char === '=') return 'Equal';
  if (char === '[') return 'BracketLeft';
  if (char === ']') return 'BracketRight';
  if (char === ';') return 'Semicolon';
  if (char === "'") return 'Quote';
  if (char === '\\') return 'Backslash';
  if (char === '`') return 'Backquote';
  return '';
}

const specialKeys = {
  Enter:     { key: "Enter",     code: "Enter",     keyCode: 13 },
  Tab:       { key: "Tab",       code: "Tab",       keyCode: 9 },
  Escape:    { key: "Escape",    code: "Escape",    keyCode: 27 },
  Backspace: { key: "Backspace", code: "Backspace", keyCode: 8 },
  Delete:    { key: "Delete",    code: "Delete",    keyCode: 46 },
  ArrowUp:   { key: "ArrowUp",   code: "ArrowUp",   keyCode: 38 },
  ArrowDown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  ArrowLeft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  ArrowRight:{ key: "ArrowRight",code: "ArrowRight",keyCode: 39 },
  Home:      { key: "Home",      code: "Home",      keyCode: 36 },
  End:       { key: "End",       code: "End",       keyCode: 35 },
  PageUp:    { key: "PageUp",    code: "PageUp",    keyCode: 33 },
  PageDown:  { key: "PageDown",  code: "PageDown",  keyCode: 34 },
  Space:     { key: " ",         code: "Space",     keyCode: 32 },
};

main().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
