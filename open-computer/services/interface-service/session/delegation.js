const { workspace } = require("../workspace");
const { broadcast } = require("../broadcast");
const { launchPiProcess, writeTrace } = require("../pi/process");
const { normalizeWorkUnits, buildDelegationPrompt } = require("../orchestration/subagents");
const { normalizePlanItems, stopPlanningPi } = require("./planning");
const { startSubagentRun } = require("./subagent-run");

// ─── Payload extraction ────────────────────────────────────────────────────
// The propose_delegation tool result can arrive as JSON string, nested object,
// or content array.  Walk the structure until we find a usable payload.

function extractDelegationPayload(value) {
  if (!value) return null;
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return null; }
  }
  if (typeof value !== "object") return null;
  if (value.details) return extractDelegationPayload(value.details);
  if (Array.isArray(value.content)) {
    const text = value.content
      .filter((part) => part?.type === "text" && part.text)
      .map((part) => part.text)
      .join("");
    return extractDelegationPayload(text);
  }
  if (Array.isArray(value.units) || value.title || value.reason) return value;
  if (value.args) return extractDelegationPayload(value.args);
  if (value.input) return extractDelegationPayload(value.input);
  return null;
}

// ─── Delegation RPC event handler ──────────────────────────────────────────
// Handles events from the delegation pi.  Only the propose_delegation
// tool_execution_end is actionable; everything else is logged.

function handleDelegationRpcEvent(line, context) {
  let event;
  try {
    event = JSON.parse(line);
  } catch {
    console.log(`[delegation-pi] ${line}`);
    return;
  }

  writeTrace({
    ts: new Date().toISOString(),
    event: "delegation_raw_rpc",
    type: event.type || event.event,
    raw: event,
  });

  if (event.type === "tool_execution_start" && event.toolName) {
    broadcast({
      type: "agent_log",
      content: `[delegation] ${event.toolName}(${JSON.stringify(event.args || {}).slice(0, 300)})`,
    });
    return;
  }

  if (
    event.type !== "tool_execution_end" ||
    event.toolName !== "propose_delegation"
  ) {
    return;
  }

  const payload =
    extractDelegationPayload(event.result) ||
    extractDelegationPayload(event.args) ||
    extractDelegationPayload(event.input) ||
    extractDelegationPayload(event.toolCall);

  const units = normalizeWorkUnits(payload?.units, context.planItems);
  if (!units.length) {
    broadcast({
      type: "agent_log",
      content: "[delegation] No work units proposed; falling back to main agent",
    });
    context.readyToStart = true;
    context.fallbackToMain = true;
    stopPlanningPi();
    return;
  }

  context.readyToStart = true;
  context.delegation = {
    units,
    title: payload?.title || "Sequential Subagents",
    reason: payload?.reason || context.reason,
  };
  stopPlanningPi();
}

// ─── Delegation launcher ───────────────────────────────────────────────────
// Starts a constrained pi process that must call propose_delegation once to
// decompose the task.  On close, either starts a subagent run or falls back
// to the main hypervisor agent if decomposition fails.

function launchDelegationPi(prompt, options = {}) {
  stopPlanningPi();

  const context = {
    id:
      options.id ||
      `subagents-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt,
    reason: options.reason || "delegated sequential execution",
    planItems: normalizePlanItems(
      options.planItems || options.preflight?.plan_hint,
    ),
    readyToStart: false,
    fallbackToMain: false,
    started: false,
    delegation: null,
  };

  broadcast({ type: "agent_log", content: "[delegation] Decomposing task..." });
  broadcast({ type: "chat_tool_hint", tool: "subagents", summary: "Assigning subagent tasks..." });

  launchPiProcess({
    label: "delegation",
    sessionId: `delegation-${context.id}`,
    extensions: ["delegate-plan.ts"],
    systemPrompt:
      "You are a delegation-planning agent. You must call propose_delegation exactly once. You cannot execute the task.",
    prompt: buildDelegationPrompt(prompt, context.planItems),
    onSpawn(proc) {
      workspace.planningProcess = proc;
    },
    onEvent(line) {
      handleDelegationRpcEvent(line, context);
    },
    onClose(code, proc) {
      if (workspace.planningProcess === proc) workspace.planningProcess = null;
      if (context.readyToStart && !context.started) {
        context.started = true;
        if (context.fallbackToMain || !context.delegation) {
          // Lazy require to avoid circular dep: delegation ↔ hypervisor
          require("./hypervisor").launchPiAgent(context.prompt);
        } else {
          startSubagentRun(context.prompt, context.delegation.units, {
            id: context.id,
            title: context.delegation.title,
            reason: context.delegation.reason,
          });
        }
        return;
      }
      if (!workspace.subagentRun && code !== 0) {
        broadcast({
          type: "agent_log",
          content: `[delegation] Failed to decompose task (exit ${code})`,
        });
      }
    },
  });

  return context.id;
}

module.exports = {
  extractDelegationPayload,
  handleDelegationRpcEvent,
  launchDelegationPi,
};
