// Interface Service — entry point
// Wires the Express app, WebSocket servers, and background tasks together.
// All domain logic lives in the modules imported below.

const express = require("express");
const { WebSocketServer } = require("ws");
const { createServer } = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

// Config must be required first — it loads .env before any other module reads
// process.env.  broadcast.js patches console.* as a side effect on require.
const { PORT, SERVICE_ROOT, SUBAGENTS_MODE, PARALLEL_SUBAGENTS } = require("./config");
const { broadcast } = require("./broadcast");

const { registerLlmProxy } = require("./llm-proxy");
const { registerApiRoutes } = require("./routes/api");
const { registerDeliverableRoutes } = require("./routes/deliverables");
const { registerEventsWebSocket } = require("./websocket/events");
const { registerUploadWebSocket } = require("./websocket/upload");
const { startDeliverablesPoller } = require("./deliverables/poller");
const { startIdleDetector } = require("./idle-detector");
const { endSession } = require("./session/chat-log");
const { cleanupDesktop } = require("./pi/process");
const { workspace } = require("./workspace");
const { resolveBaseUrlForGuest } = require("./utils/env");
const { settings } = require("./config");
const { DELIVERABLES_DIR } = require("./config");

// ─── Express app ───────────────────────────────────────────────────────────

const app = express();
const server = createServer(app);

// Selectively apply JSON parsing — LLM proxy uses its own larger limit
app.use((req, res, next) => {
  if (req.path.startsWith("/llm-proxy")) return next();
  express.json()(req, res, next);
});

// ─── WebSocket servers ─────────────────────────────────────────────────────

const streamWss = new WebSocketServer({ noServer: true });
const uploadWss = new WebSocketServer({ noServer: true });

// ─── CORS ──────────────────────────────────────────────────────────────────

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ─── LLM proxy ─────────────────────────────────────────────────────────────

registerLlmProxy(app);

// ─── noVNC proxy ───────────────────────────────────────────────────────────

const desktopProxy = createProxyMiddleware({
  target: "http://localhost:6080",
  changeOrigin: true,
  pathRewrite: { "^/desktop": "" },
});

app.use("/desktop", desktopProxy);

// ─── Static UI + API routes ────────────────────────────────────────────────

registerApiRoutes(app);
registerDeliverableRoutes(app, { deliverablesDir: DELIVERABLES_DIR });
app.use(express.static(path.join(SERVICE_ROOT, "public")));

// ─── WebSocket upgrade router ──────────────────────────────────────────────

server.on("upgrade", (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname.startsWith("/desktop")) {
    desktopProxy.upgrade(request, socket, head);
  } else if (url.pathname === "/ws/events") {
    streamWss.handleUpgrade(request, socket, head, (ws) => {
      streamWss.emit("connection", ws, request);
    });
  } else if (url.pathname === "/ws/upload") {
    uploadWss.handleUpgrade(request, socket, head, (ws) => {
      uploadWss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

registerEventsWebSocket(server, streamWss);
registerUploadWebSocket(uploadWss);

// ─── Background tasks ──────────────────────────────────────────────────────

startDeliverablesPoller();
startIdleDetector();

// ─── Start ─────────────────────────────────────────────────────────────────

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[open-computer] Listening on :${PORT}`);
  console.log(`[open-computer] Agent: ${settings.OPENAI_MODEL ? `${process.env.AGENT_NAME || "agent"} (model: ${settings.OPENAI_MODEL})` : process.env.AGENT_NAME || "agent"}`);
  console.log(`[open-computer] noVNC proxy: /desktop → localhost:6080`);
  console.log(`[open-computer] Extensions: ${path.join(SERVICE_ROOT, "extensions")}`);

  if (!settings.OPENAI_API_KEY && !settings.OPENAI_BASE_URL) {
    console.warn(
      `[open-computer] WARNING: OPENAI_API_KEY not set — prompts will fail ` +
      `(or set OPENAI_BASE_URL for local providers)`,
    );
  }
  if (settings.OPENAI_BASE_URL) {
    console.log(
      `[open-computer] Base URL: ${settings.OPENAI_BASE_URL} ` +
      `(guest: ${resolveBaseUrlForGuest(settings.OPENAI_BASE_URL)})`,
    );
  }

  // Notify reconnecting clients on hot-reload
  setTimeout(() => {
    broadcast({ type: "agent_log", content: `[server] Reloaded at ${new Date().toLocaleTimeString()}` });
    broadcast({ type: "agent_log", content: `[config] SUBAGENTS_MODE=${SUBAGENTS_MODE}` });
    broadcast({ type: "agent_log", content: `[config] PARALLEL_SUBAGENTS=${PARALLEL_SUBAGENTS}` });
  }, 500);
});

// ─── Graceful shutdown ─────────────────────────────────────────────────────
// Close the active session log cleanly on any exit signal so sessions-*.jsonl
// always has a proper ended_at and is never left as an orphan.

function shutdown(signal) {
  console.log(`[open-computer] ${signal} received — shutting down`);
  endSession();
  if (workspace.piProcess) {
    try { workspace.piProcess.kill("SIGTERM"); } catch {}
  }
  cleanupDesktop();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("exit",    () => endSession());
