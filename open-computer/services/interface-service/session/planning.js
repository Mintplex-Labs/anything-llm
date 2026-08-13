const { workspace } = require("../workspace");
const { broadcast } = require("../broadcast");
const { launchPiProcess, writeTrace } = require("../pi/process");

// ─── Plan item helpers ─────────────────────────────────────────────────────

function normalizePlanItems(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 12);
}

function normalizePlanPayload(payload, fallback = {}) {
  const items = normalizePlanItems(payload?.items);
  return {
    title: String(payload?.title || fallback.title || "Execution Plan").trim(),
    reason: String(payload?.reason || fallback.reason || "").trim(),
    items: items.length > 0 ? items : normalizePlanItems(fallback.items),
    questions: normalizePlanItems(
      payload?.questions || fallback.questions,
    ).slice(0, 5),
  };
}

// ─── Prompt builders ───────────────────────────────────────────────────────

function buildPlanningPrompt(prompt, context = {}) {
  const previous = normalizePlanItems(context.previousItems);
  const feedback = String(context.feedback || "").trim();
  const answers =
    context.answers && typeof context.answers === "object"
      ? JSON.stringify(context.answers, null, 2)
      : "";

  return (
    `Create a concise, editable execution plan for this user task. Call propose_plan exactly once.\n\n` +
    `Requirements:\n` +
    `- Return 3-8 concrete plan items.\n` +
    `- Include only questions that materially affect the output or workflow.\n` +
    `- Keep each item short enough for a user to edit in a list.\n` +
    `- Do not perform the task. Do not browse, use desktop apps, write files, or call any other tool.\n\n` +
    (previous.length ? `Previous rejected plan:\n${previous.map((item) => `- ${item}`).join("\n")}\n` : "") +
    (feedback ? `User rejection feedback:\n${feedback}\n` : "") +
    (answers ? `User answers/context:\n${answers}\n` : "") +
    `User task:\n${prompt}`
  );
}

function promptWithApprovedPlan(prompt, items, answers = {}) {
  const planText = normalizePlanItems(items)
    .map((item) => `- ${item}`)
    .join("\n");
  const answerText =
    answers && Object.keys(answers).length > 0
      ? `\nUser answers to planning questions:\n${JSON.stringify(answers, null, 2)}\n`
      : "";

  return (
    `Approved execution plan:\n${planText || "- Execute the user task carefully."}\n` +
    `${answerText}` +
    `Follow this approved plan. If a later blocker or ambiguity changes the output or workflow, ` +
    `use ask_user before proceeding. Otherwise execute without asking for routine operations.\n\n` +
    `User task:\n${prompt}`
  );
}

// promptWithPreflightGuidance is used when plan_first mode is chosen but we
// skip the full plan-review cycle and just give the agent hints inline.
function promptWithPreflightGuidance(prompt, decision) {
  if (decision.mode !== "plan_first") return prompt;

  const hints = (Array.isArray(decision.plan_hint) ? decision.plan_hint : [])
    .map((h) => String(h || "").trim())
    .filter(Boolean)
    .slice(0, 6);

  const hintText = hints.length
    ? hints.map((hint) => `- ${hint}`).join("\n")
    : "- Make a brief checklist before acting.\n- Verify real content before producing outputs.";

  return (
    `Preflight execution guidance:\n` +
    `Before acting, write a brief visible plan for the user. Your first assistant response must ` +
    `contain only the plan: do not call any tools in the same turn as the plan. After that, ` +
    `execute the plan step by step. If the request is ambiguous in a way that changes the output ` +
    `or workflow, use ask_user before proceeding. Do not ask for routine operations; choose ` +
    `sensible defaults when safe.\n\nPreflight hint:\n${hintText}\n\nUser task:\n${prompt}`
  );
}

// ─── Broadcast helpers ─────────────────────────────────────────────────────

function broadcastPlanReview() {
  if (!workspace.pendingPlan) return;
  broadcast({
    type: "plan_review",
    requestId: workspace.pendingPlan.id,
    prompt: workspace.pendingPlan.prompt,
    title: workspace.pendingPlan.title,
    reason: workspace.pendingPlan.reason,
    items: workspace.pendingPlan.items,
    questions: workspace.pendingPlan.questions,
    attempt: workspace.pendingPlan.attempt,
  });
}

// ─── Planning pi process management ───────────────────────────────────────

function stopPlanningPi() {
  if (workspace.planningProcess) {
    try {
      workspace.planningProcess.kill("SIGTERM");
    } catch {}
  }
  workspace.planningProcess = null;
}

function clearPendingPlan() {
  workspace.pendingPlan = null;
  stopPlanningPi();
}

// ─── Planning RPC event handler ────────────────────────────────────────────
// Handles events from the planning pi process.  Listens only for
// tool_execution_end of "propose_plan" to extract the plan payload.

function handlePlanningRpcEvent(line, planContext) {
  let event;
  try {
    event = JSON.parse(line);
  } catch {
    console.log(`[planning-pi] ${line}`);
    return;
  }

  writeTrace({
    ts: new Date().toISOString(),
    event: "planning_raw_rpc",
    type: event.type || event.event,
    raw: event,
  });

  if (event.type === "tool_execution_start" && event.toolName) {
    broadcast({
      type: "agent_log",
      content: `[planning] ${event.toolName}(${JSON.stringify(event.args || {}).slice(0, 300)})`,
    });
    return;
  }

  if (
    event.type !== "tool_execution_end" ||
    event.toolName !== "propose_plan"
  ) {
    return;
  }

  let payload = event.result?.details;
  if (!payload && event.result?.content) {
    const text = event.result.content
      .filter((part) => part.type === "text" && part.text)
      .map((part) => part.text)
      .join("");
    try {
      payload = JSON.parse(text);
    } catch {
      payload = {};
    }
  }

  const normalized = normalizePlanPayload(payload, {
    items: planContext.preflight?.plan_hint,
    reason: planContext.preflight?.reason,
  });

  workspace.pendingPlan = {
    id: planContext.id,
    prompt: planContext.prompt,
    title: normalized.title,
    reason: normalized.reason,
    items: normalized.items,
    questions: normalized.questions,
    attempt: planContext.attempt,
    createdAt: new Date().toISOString(),
  };

  console.log(
    `[planning] Proposed plan ${planContext.id} (${normalized.items.length} items)`,
  );
  broadcastPlanReview();
  stopPlanningPi();
}

// ─── Plan-first launcher ───────────────────────────────────────────────────
// Starts a constrained pi process whose only job is to call propose_plan once.
// The result is broadcast as a plan_review event for the user to approve/edit.

function launchPlanningPi(prompt, options = {}) {
  stopPlanningPi();

  const planContext = {
    id:
      options.id ||
      `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt,
    attempt: options.attempt || 1,
    preflight: options.preflight || null,
  };

  broadcast({ type: "agent_log", content: "[planning] Generating plan..." });

  launchPiProcess({
    label: "planning",
    sessionId: `planning-${planContext.id}`,
    extensions: ["plan-review.ts"],
    systemPrompt:
      "You are a planning-only agent. You must call propose_plan exactly once. You cannot execute the task.",
    prompt: buildPlanningPrompt(prompt, options),
    onSpawn(proc) {
      workspace.planningProcess = proc;
    },
    onEvent(line) {
      handlePlanningRpcEvent(line, planContext);
    },
    onClose(code, proc) {
      if (workspace.planningProcess === proc) workspace.planningProcess = null;
      if (
        !workspace.pendingPlan ||
        workspace.pendingPlan.id !== planContext.id
      ) {
        if (code !== 0) {
          broadcast({
            type: "agent_log",
            content: `[planning] Failed to generate plan (exit ${code})`,
          });
        }
      }
    },
  });

  return planContext.id;
}

module.exports = {
  normalizePlanItems,
  normalizePlanPayload,
  buildPlanningPrompt,
  promptWithApprovedPlan,
  promptWithPreflightGuidance,
  broadcastPlanReview,
  stopPlanningPi,
  clearPendingPlan,
  handlePlanningRpcEvent,
  launchPlanningPi,
};
