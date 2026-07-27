const path = require("path");
const { settings, HEADLESS, AGENT_NAME, DELIVERABLES_DIR } = require("../config");
const { workspace, currentAgentStatus } = require("../workspace");
const { broadcast } = require("../broadcast");
const { clearPendingInterrupt } = require("../interrupt");
const { runPromptPreflight } = require("../preflight");
const { cleanupDesktop, sendRpcPrompt } = require("../pi/process");
const { launchPiAgent, getTaskUsage } = require("../session/hypervisor");
const { getProxyUsage, resetProxyUsage } = require("../llm-proxy");
const {
  normalizePlanItems,
  promptWithApprovedPlan,
  clearPendingPlan,
  launchPlanningPi,
} = require("../session/planning");
const { launchDelegationPi } = require("../session/delegation");
const { clearSubagentRun, abortSubagentRun } = require("../session/subagent-run");
const { resolveBaseUrlForGuest } = require("../utils/env");
const {
  endSession,
  currentSession,
  listSessions,
  getSessionMessages,
} = require("../session/chat-log");

function registerApiRoutes(app) {
  // ── Health check ───────────────────────────────────────────────────────

  app.get("/api/v1/ping", (_req, res) => {
    res.json({
      service: "interface-service",
      agent: AGENT_NAME,
      status: "ok",
      uptime_seconds: Math.floor(process.uptime()),
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      memory_mb: Math.floor(process.memoryUsage.rss() / 1024 / 1024),
      port: process.env.PORT || 8080,
    });
  });

  // ── Agent status ───────────────────────────────────────────────────────

  app.get("/api/v1/status", (_req, res) => {
    res.json({
      workspace_id: workspace.id,
      name: workspace.name,
      status: "running",
      agent_status: currentAgentStatus(),
      last_exit_code: workspace.lastExitCode,
      subagent_run: workspace.subagentRun
        ? {
            id: workspace.subagentRun.id,
            status: workspace.subagentRun.status,
            active_index: workspace.subagentRun.activeIndex,
            total: workspace.subagentRun.units.length,
          }
        : null,
    });
  });

  // ── Context compaction ─────────────────────────────────────────────────

  app.post("/api/v1/compact", (_req, res) => {
    const rpc = workspace.subagentRun?.activeRpc || workspace.piRpc;
    if (!rpc) return res.json({ status: "no_agent_running" });
    rpc.write(JSON.stringify({ type: "compact" }) + "\n");
    console.log("[pi] Manual compaction triggered");
    broadcast({ type: "agent_log", content: "[compact] Manual compaction triggered" });
    res.json({ status: "ok" });
  });

  // ── Abort ──────────────────────────────────────────────────────────────

  app.post("/api/v1/abort", (_req, res) => {
    if (
      !workspace.piProcess &&
      !workspace.planningProcess &&
      !workspace.pendingPlan &&
      !workspace.subagentRun
    ) {
      return res.json({ status: "no_agent_running" });
    }
    abortSubagentRun("Subagent run aborted by operator");
    if (workspace.piProcess) {
      console.log(`[pi] Aborting agent (pid ${workspace.piProcess.pid})`);
      workspace.piProcess.kill("SIGKILL");
    }
    workspace.piProcess = null;
    workspace.piRpc = null;
    workspace.pendingHelp = null;
    clearPendingPlan();
    clearPendingInterrupt();
    broadcast({ type: "agent_log", content: "[ABORTED] Agent killed by operator" });
    broadcast({ type: "agent_done", code: -1 });
    cleanupDesktop();
    res.json({ status: "aborted" });
  });

  app.post("/api/v1/subagents/:runId/abort", (req, res) => {
    const { runId } = req.params;
    if (!workspace.subagentRun || workspace.subagentRun.id !== runId) {
      return res.status(404).json({ error: "subagent run not found" });
    }
    abortSubagentRun("Subagent run aborted by operator");
    cleanupDesktop();
    res.json({ status: "aborted", runId });
  });

  // ── Runtime config ─────────────────────────────────────────────────────

  app.post("/api/v1/config", (req, res) => {
    const { api_key, model, base_url, parallel_tool_calls } = req.body;
    if (api_key !== undefined) settings.OPENAI_API_KEY = api_key;
    if (model !== undefined) settings.OPENAI_MODEL = model;
    if (base_url !== undefined) settings.OPENAI_BASE_URL = base_url;
    if (parallel_tool_calls !== undefined)
      settings.PARALLEL_TOOL_CALLS = !!parallel_tool_calls;

    const masked = settings.OPENAI_API_KEY
      ? `${settings.OPENAI_API_KEY.slice(0, 7)}...${settings.OPENAI_API_KEY.slice(-4)}`
      : "(not set)";
    console.log(
      `[config] Updated — key=${masked}, model=${settings.OPENAI_MODEL}, base_url=${settings.OPENAI_BASE_URL || "(default)"}`,
    );
    res.json({
      status: "ok",
      model: settings.OPENAI_MODEL,
      api_key_set: !!settings.OPENAI_API_KEY,
      base_url: settings.OPENAI_BASE_URL,
      parallel_tool_calls: settings.PARALLEL_TOOL_CALLS,
    });
  });

  app.get("/api/v1/config", (_req, res) => {
    res.json({
      model: settings.OPENAI_MODEL,
      api_key_set: !!settings.OPENAI_API_KEY,
      base_url: settings.OPENAI_BASE_URL,
      context_window: settings.CONTEXT_WINDOW,
      parallel_tool_calls: settings.PARALLEL_TOOL_CALLS,
    });
  });

  // ── Models discovery ───────────────────────────────────────────────────

  app.get("/api/v1/models", async (req, res) => {
    const baseUrl =
      req.query.base_url || settings.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const apiKey = req.query.api_key || settings.OPENAI_API_KEY;
    if (!apiKey && baseUrl === "https://api.openai.com/v1")
      return res.json({ models: [] });

    const modelsUrl =
      resolveBaseUrlForGuest(baseUrl).replace(/\/+$/, "") + "/models";
    console.log(`[models] Fetching ${modelsUrl} (from base_url=${baseUrl})`);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const headers = {};
      if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
      const resp = await fetch(modelsUrl, { headers, signal: controller.signal });
      clearTimeout(timeout);
      if (!resp.ok) {
        console.warn(`[models] ${modelsUrl} returned ${resp.status}`);
        return res.json({ models: [] });
      }
      const body = await resp.json();
      const models = (body.data || []).map((m) => m.id).sort();
      console.log(
        `[models] Found ${models.length} models: ${models.slice(0, 5).join(", ")}${models.length > 5 ? "..." : ""}`,
      );
      res.json({ models });
    } catch (err) {
      console.error(`[models] Failed to fetch ${modelsUrl}: ${err.message}`);
      res.json({ models: [] });
    }
  });

  // ── Token usage ────────────────────────────────────────────────────────
  // Proxy-reported tokens (from actual OpenAI usage fields) take precedence
  // over the hypervisor's char-based estimates.  The proxy accumulates
  // session-wide; task usage tracks per-agent-invocation tool activity.

  app.get("/api/v1/usage", (_req, res) => {
    const u = { ...getTaskUsage() };
    const proxy = getProxyUsage();
    u.elapsedMs = u.startedAt ? Date.now() - u.startedAt : 0;
    u.toolResultTokensEstimated = Math.ceil(u.toolResultCharsTotal / 4);
    u.toolArgTokensEstimated = Math.ceil(u.toolArgCharsTotal / 4);
    if (proxy.inputTokens > 0 || proxy.outputTokens > 0) {
      u.inputTokensReported  = proxy.inputTokens;
      u.outputTokensReported = proxy.outputTokens;
    }
    u.proxyCalls        = proxy.calls;
    u.lastInputTokens   = proxy.lastInputTokens || 0;
    u.contextWindow     = settings.CONTEXT_WINDOW || 0;
    res.json(u);
  });

  // ── Session history ────────────────────────────────────────────────────

  app.get("/api/v1/sessions", (_req, res) => {
    const limit = parseInt(_req.query.limit) || 50;
    res.json({ sessions: listSessions(limit) });
  });

  app.get("/api/v1/sessions/current", (_req, res) => {
    res.json({ session: currentSession() });
  });

  app.get("/api/v1/sessions/:id/messages", (req, res) => {
    const messages = getSessionMessages(req.params.id);
    if (!messages.length) {
      const active = currentSession();
      if (active && active.id !== req.params.id) {
        return res.status(404).json({ error: "session not found" });
      }
    }
    res.json({ session_id: req.params.id, messages });
  });

  // ── Send prompt ────────────────────────────────────────────────────────
  // Routes incoming prompts to the right handler depending on session state:
  //   1. Pending help → send as help response to the requesting agent
  //   2. Active hypervisor → send as follow-up RPC prompt
  //   3. No agent running → run preflight classifier, then dispatch

  app.post("/api/v1/prompt", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });
    if (!settings.OPENAI_API_KEY && !settings.OPENAI_BASE_URL) {
      return res.status(500).json({
        error:
          "OPENAI_API_KEY not configured — POST /api/v1/config with api_key " +
          "(or set base_url for local providers)",
      });
    }

    // If an agent has asked for help, this prompt is the user's response.
    if (workspace.pendingHelp) {
      const responseRpc = workspace.pendingHelp.rpc || workspace.piRpc;
      if (responseRpc) {
        responseRpc.write(
          JSON.stringify({
            type: "extension_ui_response",
            id: workspace.pendingHelp.id,
            value: prompt,
          }) + "\n",
        );
        broadcast({ type: "agent_log", content: `[help] Response sent: ${prompt}` });
        broadcast({ type: "chat_message", content: prompt, role: "user" });
        workspace.pendingHelp = null;
        return res.json({ status: "prompt_sent", workspace_id: workspace.id });
      }
      workspace.pendingHelp = null;
    }

    // A new prompt while a subagent is active — tear it down first.
    if (workspace.subagentRun) {
      clearSubagentRun();
      broadcast({ type: "agent_log", content: "[subagents] Cleared subagent run for new prompt" });
    }

    // Hypervisor is running — forward as a follow-up prompt.
    if (workspace.piRpc) {
      sendRpcPrompt(prompt);
      broadcast({ type: "agent_log", content: `Prompt sent: ${prompt}` });
      broadcast({ type: "chat_message", content: prompt, role: "user" });
      return res.json({ status: "prompt_sent", workspace_id: workspace.id });
    }

    if (workspace.pendingPlan || workspace.planningProcess) {
      clearPendingPlan();
    }

    // After a subagent run, continue in hypervisor mode without re-running preflight.
    if (workspace.subagentContext) {
      broadcast({ type: "agent_log", content: `Prompt sent: ${prompt}` });
      broadcast({ type: "chat_message", content: prompt, role: "user" });
      launchPiAgent(prompt);
      return res.json({ status: "prompt_sent", workspace_id: workspace.id });
    }

    const preflight = await runPromptPreflight(prompt);
    const preflightLine = `[preflight] ${preflight.mode}: ${preflight.reason}`;
    console.log(preflightLine);
    broadcast({ type: "agent_log", content: preflightLine });
    broadcast({ type: "agent_log", content: `Prompt sent: ${prompt}` });
    broadcast({ type: "chat_message", content: prompt, role: "user" });

    if (preflight.mode === "delegate_sequential") {
      const requestId = launchDelegationPi(prompt, {
        preflight,
        reason: preflight.reason,
      });
      return res.json({ status: "subagents_pending", workspace_id: workspace.id, requestId });
    }

    if (preflight.mode === "plan_first") {
      const requestId = launchPlanningPi(prompt, { preflight });
      return res.json({ status: "plan_pending", workspace_id: workspace.id, requestId });
    }

    launchPiAgent(prompt);
    res.json({ status: "prompt_sent", workspace_id: workspace.id });
  });

  // ── Plan review response ───────────────────────────────────────────────

  app.post("/api/v1/plan-response", (req, res) => {
    const { requestId, action, items, feedback, answers } = req.body || {};
    if (!requestId) return res.status(400).json({ error: "requestId is required" });
    if (!workspace.pendingPlan || workspace.pendingPlan.id !== requestId) {
      return res.status(404).json({ error: "no pending plan with that id" });
    }

    const editedItems = normalizePlanItems(items);
    const plan = workspace.pendingPlan;

    if (action === "approve") {
      clearPendingPlan();
      const approvedPrompt = promptWithApprovedPlan(
        plan.prompt,
        editedItems.length > 0 ? editedItems : plan.items,
        answers,
      );
      broadcast({
        type: "agent_log",
        content: `[planning] Approved ${editedItems.length || plan.items.length} plan item(s)`,
      });
      broadcast({ type: "plan_resolved", requestId, status: "Approved" });
      launchDelegationPi(approvedPrompt, {
        id: `subagents-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        planItems: editedItems.length > 0 ? editedItems : plan.items,
        reason: "approved plan execution",
      });
      return res.json({ status: "approved", workspace_id: workspace.id });
    }

    if (action === "deny") {
      const attempt = (plan.attempt || 1) + 1;
      workspace.pendingPlan = null;
      const newRequestId = launchPlanningPi(plan.prompt, {
        id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        attempt,
        previousItems: editedItems.length > 0 ? editedItems : plan.items,
        feedback,
        answers,
        preflight: {
          mode: "plan_first",
          reason: `previous plan denied${feedback ? `: ${feedback}` : ""}`,
          plan_hint: editedItems.length > 0 ? editedItems : plan.items,
        },
      });
      broadcast({
        type: "agent_log",
        content: `[planning] Plan denied; generating revision ${attempt}`,
      });
      broadcast({ type: "plan_resolved", requestId, status: "Denied; waiting for revision" });
      return res.json({ status: "regenerating", workspace_id: workspace.id, requestId: newRequestId });
    }

    return res.status(400).json({ error: "action must be approve or deny" });
  });

  // ── New session ────────────────────────────────────────────────────────

  app.post("/api/v1/new-session", (_req, res) => {
    endSession();
    clearSubagentRun();
    resetProxyUsage();
    broadcast({ type: "proxy_usage", inputTokens: 0, outputTokens: 0, calls: 0, reset: true });
    workspace.subagentContext = null;
    if (workspace.piProcess) {
      console.log(`[pi] User requested new session — killing agent`);
      workspace.piProcess.kill("SIGTERM");
      workspace.piProcess = null;
      workspace.piRpc = null;
      workspace.pendingHelp = null;
      clearPendingPlan();
      clearPendingInterrupt();
      workspace.lastActivityTs = 0;
      workspace.idleSuppressedUntil = 0;
      cleanupDesktop();
    }
    clearPendingPlan();
    workspace.logBuffer = [];
    broadcast({ type: "agent_log", content: "[session] New session started" });
    res.json({ status: "ok" });
  });

  // ── Help response ──────────────────────────────────────────────────────
  // The UI can also respond to ask_for_help via this endpoint (alternative
  // to the next /api/v1/prompt call).

  app.post("/api/v1/help-response", (req, res) => {
    const { requestId, response } = req.body;
    if (!requestId) return res.status(400).json({ error: "requestId is required" });

    if (workspace.pendingHelp?.id === requestId) {
      // Idle/loop-triggered prompts are sent as RPC follow-ups.
      if (requestId.startsWith("idle-") || requestId.startsWith("loop-")) {
        const isLoop = requestId.startsWith("loop-");
        workspace.pendingHelp = null;
        workspace.lastActivityTs = Date.now();
        if (isLoop) {
          const loopDetect = require("../loop-detect");
          loopDetect.resetLoopDetector();
        }
        if (response && workspace.piRpc) {
          sendRpcPrompt(response);
          broadcast({
            type: "agent_log",
            content: `[${isLoop ? "loop nudge" : "idle nudge"}] Sent: ${response}`,
          });
        } else {
          workspace.idleSuppressedUntil = Date.now() + 5 * 60 * 1000;
        }
        console.log(`[pi] ${isLoop ? "Loop" : "Idle"} response: ${response || "(dismissed)"}`);
        return res.json({ status: "ok" });
      }

      const responseRpc = workspace.pendingHelp.rpc || workspace.piRpc;
      if (responseRpc) {
        responseRpc.write(
          JSON.stringify({
            type: "extension_ui_response",
            id: requestId,
            value: response || "",
          }) + "\n",
        );
        workspace.pendingHelp = null;
        console.log(`[pi] Help response sent: ${response}`);
        return res.json({ status: "ok" });
      }
      return res.status(500).json({ error: "agent not running" });
    }

    return res.status(404).json({ error: "no pending help request with that id" });
  });

  // ── Headless root ──────────────────────────────────────────────────────

  app.get("/", (req, res, next) => {
    if (!HEADLESS) return next();
    res.json({
      service: "interface-service",
      agent: AGENT_NAME,
      status: "ok",
      agent_status: currentAgentStatus(),
      headless: true,
      uptime_seconds: Math.floor(process.uptime()),
      platform: process.platform,
      arch: process.arch,
      memory_mb: Math.floor(process.memoryUsage.rss() / 1024 / 1024),
      port: process.env.PORT || 8080,
      endpoints: {
        api: "/api/v1/",
        events: "/ws/events",
        upload: "/ws/upload",
        desktop: "/desktop/",
      },
    });
  });
}

module.exports = { registerApiRoutes };
