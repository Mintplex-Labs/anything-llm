const { workspace } = require("../workspace");
const { broadcast } = require("../broadcast");
const { launchPiProcess, SYSTEM_PROMPT, cleanupDesktop, writeTrace } = require("../pi/process");
const { getLlmRequestStatus } = require("../llm-proxy");
const {
  normalizeWorkUnits,
  buildSubagentPrompt,
  buildSynthesisPrompt,
} = require("../orchestration/subagents");

// ─── Constants ─────────────────────────────────────────────────────────────

// If a subagent step produces no activity (no tool calls, no output) for this
// long, it is considered hung and force-completed.  Resets on every event so
// legitimately long-running agents are never killed prematurely.
const STEP_INACTIVITY_MS = 3 * 60 * 1000; // 3 minutes of silence = hung

// ─── Accessors ─────────────────────────────────────────────────────────────

function activeSubagentStep(run = workspace.subagentRun) {
  if (!run || run.activeIndex < 0) return null;
  return run.units[run.activeIndex] || null;
}

// ─── Heartbeat ─────────────────────────────────────────────────────────────
// Resets the inactivity timer for the active step on every meaningful event.
// If the timer fires it means the child process is alive but completely silent.

function resetStepHeartbeat(runId) {
  const run = workspace.subagentRun;
  if (!run || run.id !== runId) return;
  const unit = activeSubagentStep(run);
  if (!unit || unit.finished) return;

  clearTimeout(unit.stepTimeout);
  unit.stepTimeout = setTimeout(() => {
    const currentRun = workspace.subagentRun;
    const currentUnit = activeSubagentStep(currentRun);
    if (!currentRun || currentRun.id !== runId || currentUnit !== unit || unit.finished) return;
    broadcast({
      type: "agent_log",
      content: (() => {
        const llm = getLlmRequestStatus();
        if (llm) {
          const detail = llm.phase === "connecting"
            ? `waiting ${llm.elapsedSec}s for response headers — upstream may be hung`
            : `streaming for ${llm.elapsedSec}s — no tool events reaching agent`;
          return `[subagents] ⚠ Step "${unit.title}" silent for ${STEP_INACTIVITY_MS / 1000}s — LLM call in flight: ${detail}`;
        }
        return `[subagents] ⚠ Step "${unit.title}" silent for ${STEP_INACTIVITY_MS / 1000}s — no LLM call in flight, agent appears idle`;
      })(),
    });
    // Reschedule so the warning keeps firing every interval until manually aborted.
    resetStepHeartbeat(runId);
  }, STEP_INACTIVITY_MS);
}

// ─── Run lifecycle ─────────────────────────────────────────────────────────

function clearSubagentRun() {
  const run = workspace.subagentRun;
  if (run?.activeProcess) {
    try {
      run.activeProcess.kill("SIGTERM");
    } catch {}
  }
  workspace.subagentRun = null;
}

function abortSubagentRun(reason = "aborted") {
  const run = workspace.subagentRun;
  if (!run) return false;
  if (run.activeProcess) {
    try {
      run.activeProcess.kill("SIGKILL");
    } catch {}
  }
  const activeUnit = activeSubagentStep(run);
  if (activeUnit) {
    clearTimeout(activeUnit.finishTimer);
    clearTimeout(activeUnit.stepTimeout);
  }
  run.status = "aborted";
  broadcast({
    type: "subagent_aborted",
    runId: run.id,
    stepId: activeSubagentStep(run)?.id,
    reason,
  });
  broadcast({ type: "agent_log", content: `[subagents] ${reason}` });
  workspace.subagentRun = null;
  return true;
}

// ─── Output accumulation ───────────────────────────────────────────────────
// Child agents stream text deltas.  We accumulate into run.activeOutput,
// deduplicating common patterns where the full text is re-sent on each event.

function extractRpcText(event) {
  if (event.message?.content) {
    if (event.message.role !== "assistant") return "";
    return event.message.content
      .filter((part) => part.type === "text" && part.text)
      .map((part) => part.text)
      .join("");
  }
  const ae = event.assistantMessageEvent;
  if (ae?.type === "text_delta" && ae.delta) return ae.delta;
  return "";
}

function appendSubagentOutput(text) {
  const run = workspace.subagentRun;
  if (!run || !text) return;
  const current = run.activeOutput || "";
  if (text === current || current.includes(text)) return;
  if (text.startsWith(current)) {
    run.activeOutput = text;
    return;
  }
  run.activeOutput = current + text;
}

function replaceSubagentOutput(text) {
  const run = workspace.subagentRun;
  if (!run || !text) return;
  run.activeOutput = text;
}

// ─── Handoff detection ─────────────────────────────────────────────────────
// Subagents are expected to end with a compact handoff using five headings.
// When all headings are present, we can advance to the next step without
// waiting for the pi process to fully exit.

function subagentHandoffComplete(text) {
  const normalized = String(text || "").toLowerCase();
  if (normalized.includes("you are a focused child subagent")) return false;
  if (normalized.includes("end with a compact handoff using these headings"))
    return false;
  return [
    "result",
    "facts gathered",
    "files changed or deliverables",
    "blockers",
    "suggested next step",
  ].every((heading) => normalized.includes(heading));
}

function scheduleSubagentHandoffFinish(runId, phase) {
  const run = workspace.subagentRun;
  if (!run || run.id !== runId || phase !== "child") return;
  const unit = activeSubagentStep(run);
  if (!unit || unit.finished || !subagentHandoffComplete(run.activeOutput)) return;

  clearTimeout(unit.finishTimer);
  unit.finishTimer = setTimeout(() => {
    const currentRun = workspace.subagentRun;
    const currentUnit = activeSubagentStep(currentRun);
    if (
      !currentRun ||
      currentRun.id !== runId ||
      currentUnit !== unit ||
      unit.finished
    )
      return;
    broadcast({
      type: "agent_log",
      content: `[subagents] Handoff complete for "${unit.title}"; advancing to next step`,
    });
    finishActiveSubagent(0);
  }, 1500);
}

// ─── Step completion ───────────────────────────────────────────────────────

function finishActiveSubagent(code = 0, options = {}) {
  const run = workspace.subagentRun;
  const unit = activeSubagentStep(run);
  if (!run || !unit || unit.finished) return;

  unit.finished = true;
  const proc = run.activeProcess;
  const output = String(run.activeOutput || "").trim();
  clearTimeout(unit.finishTimer);
  clearTimeout(unit.stepTimeout);
  if (!output && code === 0) code = 1;

  run.outputs.push({
    id: unit.id,
    title: unit.title,
    role: unit.role,
    output,
    code,
  });

  broadcast({ type: "subagent_output", runId: run.id, stepId: unit.id, title: unit.title, output: output || "(no output)" });
  broadcast({ type: "subagent_step_done", runId: run.id, stepId: unit.id, title: unit.title, code });

  if (code !== 0) {
    run.status = "failed";
    const reason = `Subagent "${unit.title}" exited without a usable result (code ${code})`;
    broadcast({
      type: "subagent_aborted",
      runId: run.id,
      stepId: unit.id,
      reason,
    });
    broadcast({ type: "agent_error", errorType: "subagent_failed", content: reason });
    workspace.lastExitCode = code;
    broadcast({ type: "agent_done", code });
    workspace.subagentRun = null;
    if (proc) { try { proc.kill("SIGTERM"); } catch {} }
    cleanupDesktop();
    return;
  }

  if (!options.fromClose && proc) {
    run.waitingForChildClose = true;
    try { proc.kill("SIGTERM"); } catch {}
    return;
  }

  run.activeProcess = null;
  run.activeRpc = null;
  run.activeOutput = "";
  run.waitingForChildClose = false;
  setTimeout(() => launchNextSubagentStep(run.id), 250);
}

// ─── Child RPC event handler ───────────────────────────────────────────────
// Processes events from child subagent and synthesis pi processes.

function handleSubagentRpcEvent(line, runId, phase = "child") {
  const run = workspace.subagentRun;
  if (!run || run.id !== runId) return;

  let event;
  try {
    event = JSON.parse(line);
  } catch {
    console.log(`[subagent] ${line}`);
    return;
  }

  const ts = new Date().toISOString();
  const etype = event.type || event.event;
  const unit = activeSubagentStep(run);

  writeTrace({ ts, event: "subagent_raw_rpc", runId, phase, type: etype, raw: event });

  let text = extractRpcText(event);
  if (etype === "message_start" && text) {
    replaceSubagentOutput(text);
    if (unit) unit.sawTaskActivity = true;
    if (phase === "synthesis") run.synthesisSawTaskActivity = true;
  } else if (text) {
    appendSubagentOutput(text);
    if (unit) unit.sawTaskActivity = true;
    if (phase === "synthesis") run.synthesisSawTaskActivity = true;
  }

  // Any meaningful activity from the child resets the inactivity watchdog.
  if (text || etype === "tool_execution_start" || etype === "tool_execution_end") {
    if (phase === "child") resetStepHeartbeat(runId);
  }

  scheduleSubagentHandoffFinish(runId, phase);

  if (etype === "tool_execution_start" && event.toolName) {
    if (unit) unit.sawTaskActivity = true;
    if (phase === "synthesis") run.synthesisSawTaskActivity = true;
    const argsStr = event.args ? JSON.stringify(event.args).slice(0, 200) : "";
    const label = phase === "child" ? (unit?.id ?? phase) : `${runId}:synthesis`;
    broadcast({ type: "subagent_tool", runId, stepId: unit?.id, tool: event.toolName, summary: `${event.toolName}(${argsStr})` });
    broadcast({ type: "agent_log", content: `[subagent:${label}] → ${event.toolName}(${argsStr})` });
  } else if (etype === "tool_execution_end" && event.toolName) {
    let resultFull = "";
    if (event.result?.content) {
      for (const part of event.result.content) {
        if (part.type === "text" && part.text) resultFull += part.text;
      }
    }
    const label = phase === "child" ? (unit?.id ?? phase) : `${runId}:synthesis`;
    const resultSnippet = resultFull ? resultFull.slice(0, 200).replace(/\n/g, " ") : "(no output)";
    broadcast({ type: "subagent_log", runId, stepId: unit?.id, phase, content: `[result] ${resultFull.slice(0, 500)}` });
    broadcast({ type: "agent_log", content: `[subagent:${label}] ← ${event.toolName}: ${resultSnippet}` });
  } else if (etype === "extension_ui_request") {
    // Subagent asking the user for input — route response back to this specific child.
    const question =
      event.placeholder || event.message || event.prompt ||
      "The subagent has a question.";
    workspace.pendingHelp = {
      id: event.id,
      method: event.method,
      rpc: run.activeRpc,
      runId,
    };
    broadcast({
      type: "ask_for_help",
      requestId: event.id,
      method: event.method,
      content: question,
      title: event.title || "Subagent Question",
    });
  } else if (etype === "response") {
    const hasTaskOutput = String(run.activeOutput || "").trim().length > 0;
    const sawTaskActivity =
      phase === "synthesis" ? run.synthesisSawTaskActivity : unit?.sawTaskActivity;

    if (!hasTaskOutput && !sawTaskActivity) {
      if (phase === "synthesis") {
        // The synthesis pi can deliver its full answer inside the response event
        // itself rather than streaming it as text deltas.  Only ignore the event
        // when the response event itself also carries no text — that means pi is
        // sending a spurious startup handshake before the 1 s-deferred prompt
        // has even been delivered.
        const responseText = extractRpcText(event);
        if (!responseText) {
          broadcast({
            type: "agent_log",
            content: `[subagents] Ignoring early synthesis response before task activity`,
          });
          return;
        }
        // Non-streaming batch response: capture the text and fall through.
      } else {
        broadcast({
          type: "agent_log",
          content: `[subagents] Ignoring early ${phase} response before task activity`,
        });
        return;
      }
    }

    if (phase === "synthesis") {
      const responseText = extractRpcText(event);
      if (responseText && !hasTaskOutput) replaceSubagentOutput(responseText);
      finishSubagentSynthesis(event.success === false ? 1 : 0);
    } else {
      finishActiveSubagent(event.success === false ? 1 : 0);
    }
  }
}

// ─── Step sequencer ────────────────────────────────────────────────────────

function launchNextSubagentStep(runId) {
  const run = workspace.subagentRun;
  if (!run || run.id !== runId || run.status !== "running") return;

  if (run.activeProcess) {
    broadcast({
      type: "agent_log",
      content: "[subagents] Waiting for active child before launching next step",
    });
    return;
  }

  run.activeIndex++;
  const unit = activeSubagentStep(run);
  if (!unit) {
    launchSubagentSynthesis(runId);
    return;
  }

  run.activeOutput = "";
  unit.startedAt = new Date().toISOString();
  broadcast({
    type: "subagent_step_started",
    runId,
    stepId: unit.id,
    title: unit.title,
    role: unit.role,
    index: run.activeIndex,
    total: run.units.length,
    objective: unit.objective,
  });
  broadcast({ type: "chat_tool_hint", tool: "subagents", summary: `Running subagent: ${unit.title}` });

  // Start the inactivity watchdog; it resets on every RPC event from this step.
  resetStepHeartbeat(runId);

  const prompt = buildSubagentPrompt({
    originalPrompt: run.prompt,
    unit,
    previousOutputs: run.outputs,
  });

  const proc = launchPiProcess({
    label: `subagent:${unit.id}`,
    sessionId: `${runId}-${unit.id}`,
    extensions: [
      "ask-user.ts",
      "save-deliverable.ts",
      "open-browser.ts",
      "browser-agent.ts",
      "browser-cdp.ts",
      "visible-bash.ts",
      "desktop-apps.ts",
    ],
    systemPrompt: SYSTEM_PROMPT,
    prompt,
    autoCompaction: true,
    onSpawn(child) {
      run.activeProcess = child;
      run.activeRpc = child.stdin;
      workspace.lastActivityTs = Date.now();
    },
    onEvent(line) {
      handleSubagentRpcEvent(line, runId, "child");
    },
    onClose(code, child) {
      if (workspace.subagentRun !== run || run.activeProcess !== child) return;
      const currentUnit = activeSubagentStep(run);
      if (currentUnit?.finished) {
        run.activeProcess = null;
        run.activeRpc = null;
        run.activeOutput = "";
        run.waitingForChildClose = false;
        setTimeout(() => launchNextSubagentStep(run.id), 250);
        return;
      }
      finishActiveSubagent(code, { fromClose: true });
    },
  });

  run.activeProcess = proc;
  run.activeRpc = proc.stdin;
}

// ─── Synthesis step ────────────────────────────────────────────────────────
// After all child steps are done, a synthesis agent assembles the final answer.

function finishSubagentSynthesis(code = 0) {
  const run = workspace.subagentRun;
  if (!run || run.status !== "synthesizing") return;
  const finalText = String(run.activeOutput || "").trim();

  if (finalText) {
    broadcast({ type: "chat_message", role: "assistant", content: finalText });
  }
  broadcast({ type: "subagent_run_done", runId: run.id, title: run.title, code, output: finalText });

  // Persist context so follow-up prompts can continue the thread in the hypervisor
  workspace.subagentContext = {
    originalPrompt: run.prompt,
    outputs: (run.outputs || []).map((o) => ({
      title: o.title,
      output: (o.output || "").slice(0, 800),
    })),
    synthesis: (finalText || "").slice(0, 1500),
  };

  workspace.lastExitCode = code;
  broadcast({ type: "agent_done", code });

  const proc = run.activeProcess;
  workspace.subagentRun = null;
  if (proc) { try { proc.kill("SIGTERM"); } catch {} }
  cleanupDesktop();
}

function launchSubagentSynthesis(runId) {
  const run = workspace.subagentRun;
  if (!run || run.id !== runId) return;
  run.status = "synthesizing";
  run.activeOutput = "";
  run.activeIndex = -1;

  broadcast({
    type: "subagent_step_started",
    runId,
    stepId: "synthesis",
    title: "Final synthesis",
    role: "synthesizer",
    index: run.units.length,
    total: run.units.length + 1,
    objective: "Assemble child outputs into the final response.",
  });

  const proc = launchPiProcess({
    label: `subagent:${runId}:synthesis`,
    sessionId: `${runId}-synthesis`,
    extensions: [],
    systemPrompt:
      "You are a final synthesis agent. Assemble child subagent outputs into a concise final response. Do not use tools.",
    prompt: buildSynthesisPrompt({
      originalPrompt: run.prompt,
      units: run.units,
      outputs: run.outputs,
    }),
    onSpawn(child) {
      run.activeProcess = child;
      run.activeRpc = child.stdin;
    },
    onEvent(line) {
      handleSubagentRpcEvent(line, runId, "synthesis");
    },
    onClose(code, child) {
      if (workspace.subagentRun !== run || run.activeProcess !== child) return;
      finishSubagentSynthesis(code);
    },
  });

  run.activeProcess = proc;
  run.activeRpc = proc.stdin;
}

// ─── Run start ─────────────────────────────────────────────────────────────
// Creates a new SubagentRun and launches the first step.  If delegation
// produced no usable units, falls back to a direct hypervisor launch.

function startSubagentRun(prompt, units, meta = {}) {
  clearSubagentRun();
  const normalizedUnits = normalizeWorkUnits(units, meta.planItems);
  if (!normalizedUnits.length) {
    // Circular import guard: require lazily to avoid module initialization order issues
    require("./hypervisor").launchPiAgent(prompt);
    return null;
  }

  const run = {
    id:
      meta.id ||
      `subagents-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt,
    title: meta.title || "Sequential Subagents",
    reason: meta.reason || "",
    units: normalizedUnits,
    outputs: [],
    activeIndex: -1,
    activeProcess: null,
    activeRpc: null,
    activeOutput: "",
    status: "running",
    createdAt: new Date().toISOString(),
  };
  workspace.subagentRun = run;

  broadcast({ type: "subagent_run_started", runId: run.id, title: run.title, reason: run.reason, units: run.units });
  broadcast({ type: "agent_log", content: `[subagents] Starting ${run.units.length} sequential child agent(s)` });
  launchNextSubagentStep(run.id);
  return run.id;
}

module.exports = {
  activeSubagentStep,
  clearSubagentRun,
  abortSubagentRun,
  extractRpcText,
  handleSubagentRpcEvent,
  launchNextSubagentStep,
  finishSubagentSynthesis,
  launchSubagentSynthesis,
  startSubagentRun,
};
