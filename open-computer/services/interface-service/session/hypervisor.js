const { settings } = require("../config");
const { workspace } = require("../workspace");
const { broadcast } = require("../broadcast");
const {
  launchPiProcess,
  SYSTEM_PROMPT,
  cleanupDesktop,
  writeTrace,
} = require("../pi/process");
const {
  checkForLoop,
  checkForToolLoop,
  resetLoopDetector,
  onToolCall,
  onTextMessage,
  alertLoopingAgent,
} = require("../loop-detect");

// ─── Token usage tracking ──────────────────────────────────────────────────
// Tracks one logical task's LLM usage.  Reset on each new launchPiAgent call.
// Rough estimate: 1 token ≈ 4 chars (English); provider-reported counts take
// precedence when available.

function estimateTokens(text) {
  return text ? Math.ceil(text.length / 4) : 0;
}

function freshUsage() {
  return {
    turns: 0,
    toolCalls: 0,
    toolCallsByName: {},
    inputTokensReported: 0,
    outputTokensReported: 0,
    inputTokensEstimated: 0,
    outputTokensEstimated: 0,
    toolResultCharsTotal: 0,
    toolArgCharsTotal: 0,
    systemPromptTokens: 0,
    startedAt: Date.now(),
  };
}

let taskUsage = freshUsage();

function getTaskUsage() {
  return taskUsage;
}

// ─── Extension info-notification patterns ─────────────────────────────────
// Auto-dismiss these from pi-hermes-memory and similar extensions so they
// don't surface as interactive "Agent needs your input" prompts.

const EXTENSION_INFO_PATTERNS = [
  /session backfill/i,
  /memory.sync/i,
  /backfill complete/i,
  /indexed.*skipped.*messages/i,
  /markdown.*sync complete/i,
];

// ─── Hypervisor RPC event handler ─────────────────────────────────────────
// Processes all JSON-lines events from the main pi agent.  Handles:
//   - Text streaming (message_start, message_update, message_end)
//   - Tool tracking and loop detection (tool_execution_start/end)
//   - User help requests from extensions (extension_ui_request)
//   - Usage accounting (response)

function handleRpcEvent(line) {
  let event;
  try {
    event = JSON.parse(line);
  } catch {
    process.stdout.write(`[pi] ${line}\n`);
    return;
  }

  const ts = new Date().toISOString();
  const etype = event.type || event.event;

  writeTrace({ ts, event: "raw_rpc", type: etype, raw: event });

  if (event.usage) {
    taskUsage.inputTokensReported +=
      event.usage.input_tokens || event.usage.prompt_tokens || 0;
    taskUsage.outputTokensReported +=
      event.usage.output_tokens || event.usage.completion_tokens || 0;
    console.log(
      `[tokens] Reported usage: in=${event.usage.input_tokens || event.usage.prompt_tokens || 0} out=${event.usage.output_tokens || event.usage.completion_tokens || 0}`,
    );
  }

  // Only advance the activity timestamp for events that indicate active work.
  // Terminal events (response, streaming_end) must not re-arm the idle detector.
  const passiveEvents = new Set(["response", "streaming_end", "agent_status"]);
  if (!passiveEvents.has(etype)) {
    workspace.lastActivityTs = Date.now();
  }

  switch (etype) {
    case "message_start": {
      taskUsage.turns++;
      onTextMessage();
      const msg = event.message;
      if (msg?.role === "assistant" && msg?.content) {
        const fullText = msg.content.map((p) => p.text || "").join("");
        for (const part of msg.content) {
          if (part.type === "text" && part.text) {
            broadcast({ type: "agent_log", content: part.text });
            broadcast({ type: "chat_message", content: part.text, role: "assistant" });
            workspace.lastAgentText = part.text;
          }
        }
        taskUsage.outputTokensEstimated += estimateTokens(fullText);
        writeTrace({ ts, event: "message_start", role: msg.role, content: msg.content });
        if (checkForLoop(fullText)) {
          alertLoopingAgent("repetitive text in message_start");
          return;
        }
      }
      break;
    }

    case "message_end": {
      if (workspace._textBuf && workspace._textBuf.trim()) {
        broadcast({ type: "agent_delta", content: workspace._textBuf.trim() });
        workspace._textBuf = "";
      }
      break;
    }

    case "message_update": {
      const ae = event.assistantMessageEvent;
      if (!ae) break;
      if (ae.type === "text_delta" && ae.delta) {
        workspace._textBuf = (workspace._textBuf || "") + ae.delta;
        taskUsage.outputTokensEstimated += estimateTokens(ae.delta);
        if (/[.!?\n]$/.test(workspace._textBuf.trim())) {
          const flushed = workspace._textBuf.trim();
          broadcast({ type: "agent_delta", content: flushed });
          broadcast({ type: "chat_message", content: flushed, role: "assistant" });
          workspace.lastAgentText = flushed;
          workspace._textBuf = "";
          if (checkForLoop(flushed)) {
            alertLoopingAgent("repetitive text in streaming deltas");
            return;
          }
        }
      }
      break;
    }

    case "tool_execution_start": {
      if (workspace._textBuf && workspace._textBuf.trim()) {
        broadcast({ type: "agent_delta", content: workspace._textBuf.trim() });
        workspace._textBuf = "";
      }
      onToolCall();
      if (event.toolName) {
        taskUsage.toolCalls++;
        taskUsage.toolCallsByName[event.toolName] =
          (taskUsage.toolCallsByName[event.toolName] || 0) + 1;

        const argsJson = event.args ? JSON.stringify(event.args) : "";
        taskUsage.toolArgCharsTotal += argsJson.length;
        taskUsage.outputTokensEstimated += estimateTokens(argsJson);

        const loopReason = checkForToolLoop(event.toolName, argsJson);
        if (loopReason) alertLoopingAgent(loopReason);

        const argsStr = argsJson.slice(0, 300);
        const summary =
          event.toolName === "bash"
            ? `$ ${(event.args?.command || "").slice(0, 300)}`
            : `${event.toolName}(${argsStr})`;
        broadcast({ type: "agent_log", content: `[running] ${summary}` });
        broadcast({ type: "chat_tool_hint", tool: event.toolName, summary });
        writeTrace({ ts, event: "tool_start", tool: event.toolName, args: event.args });
      }
      break;
    }

    case "tool_execution_end": {
      if (event.toolName) {
        let resultFull = "";
        if (event.result?.content) {
          for (const part of event.result.content) {
            if (part.type === "text" && part.text) resultFull += part.text;
          }
        }
        taskUsage.toolResultCharsTotal += resultFull.length;
        taskUsage.inputTokensEstimated += estimateTokens(resultFull);

        if (resultFull) {
          const PREVIEW = 1500;
          const preview =
            resultFull.length > PREVIEW
              ? `${resultFull.slice(0, PREVIEW)}… (+${resultFull.length - PREVIEW} chars)`
              : resultFull;
          broadcast({ type: "agent_log", content: `[result] ${preview}` });
        }
        writeTrace({
          ts,
          event: "tool_end",
          tool: event.toolName,
          result: resultFull,
          resultChars: resultFull.length,
        });
      }
      break;
    }

    case "extension_ui_request": {
      if (
        event.method === "input" ||
        event.method === "confirm" ||
        event.method === "select"
      ) {
        console.log(`[pi] extension_ui_request: ${JSON.stringify(event)}`);
        const question =
          event.placeholder || event.message || event.prompt ||
          "The agent has a question.";

        // Auto-dismiss informational extension notifications (e.g. memory
        // backfill status) without surfacing them to the user.
        const isInfoNotification = EXTENSION_INFO_PATTERNS.some((p) =>
          p.test(question),
        );
        if (isInfoNotification) {
          console.log(`[pi] Auto-dismissed extension notification: ${question}`);
          broadcast({ type: "agent_log", content: `[extension] ${question}` });
          if (workspace.piRpc) {
            workspace.piRpc.write(
              JSON.stringify({
                type: "extension_ui_response",
                id: event.id,
                value: "",
              }) + "\n",
            );
          }
          break;
        }

        workspace.pendingHelp = { id: event.id, method: event.method };
        broadcast({
          type: "ask_for_help",
          requestId: event.id,
          method: event.method,
          content: question,
          title: event.title || "Agent Question",
        });
        console.log(`[pi] User question: ${question}`);
      }
      break;
    }

    case "response": {
      // "response" means pi finished processing the current prompt — NOT that
      // the overall session is done. The user controls session lifetime.
      if (event.success === false && event.error) {
        const errMsg = String(event.error);
        broadcast({ type: "agent_log",   content: `[error] ${errMsg}` });
        broadcast({ type: "agent_error", errorType: "pi_error", content: errMsg });
      }
      taskUsage.elapsedMs = Date.now() - taskUsage.startedAt;
      if (taskUsage.turns > 0 || taskUsage.toolCalls > 0) {
        const usageLine =
          `[usage] turns=${taskUsage.turns} tools=${taskUsage.toolCalls} | ` +
          `reported(in=${taskUsage.inputTokensReported} out=${taskUsage.outputTokensReported}) ` +
          `est(in=${taskUsage.inputTokensEstimated} out=${taskUsage.outputTokensEstimated}) | ` +
          `resultChars=${taskUsage.toolResultCharsTotal} argChars=${taskUsage.toolArgCharsTotal} | ` +
          Object.entries(taskUsage.toolCallsByName)
            .map(([k, v]) => `${k}:${v}`)
            .join(" ");
        console.log(`[tokens] ${usageLine}`);
        broadcast({ type: "agent_log", content: usageLine });
        writeTrace({ ts, event: "usage_summary", usage: { ...taskUsage } });
        broadcast({ type: "task_usage", usage: { ...taskUsage } });
      }
      break;
    }

    case "streaming_start":
      broadcast({ type: "agent_log", content: "[thinking...]" });
      break;

    case "streaming_end":
    case "agent_status":
      break;

    default:
      break;
  }
}

// ─── Hypervisor agent launcher ─────────────────────────────────────────────
// Starts the main pi agent for a new task.  If a prior subagent run exists,
// its context is prepended so the agent can continue the thread.

function launchPiAgent(prompt) {
  const sessionId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  workspace.currentSessionId = sessionId;
  broadcast({ type: "agent_log", content: "Starting Pi agent (RPC mode)..." });

  let effectivePrompt = prompt;
  if (workspace.subagentContext) {
    const ctx = workspace.subagentContext;
    const outputSummary = ctx.outputs
      .map((o) => `- ${o.title}: ${o.output}`)
      .join("\n");
    effectivePrompt =
      `[Previous task context — the user's original request was handled by subagents. ` +
      `Original: "${ctx.originalPrompt.slice(0, 300)}"\n` +
      `Subagent results:\n${outputSummary}\n` +
      `Final answer given:\n${ctx.synthesis}]\n\n` +
      `User follow-up: ${prompt}`;
    workspace.subagentContext = null;
  }

  try {
    launchPiProcess({
      label: "pi",
      sessionId,
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
      prompt: effectivePrompt,
      autoCompaction: true,
      onSpawn(proc) {
        workspace.piProcess = proc;
        workspace.piRpc = proc.stdin;
        workspace.pendingHelp = null;
        workspace.lastActivityTs = Date.now();
        workspace.lastAgentText = "";
        resetLoopDetector();
        taskUsage = freshUsage();
        taskUsage.systemPromptTokens = estimateTokens(SYSTEM_PROMPT);
      },
      onEvent(line) {
        handleRpcEvent(line);
      },
      onClose(code, proc) {
        if (workspace.piProcess !== proc) return;
        workspace.lastExitCode = code;

        // Detect silent failures: agent exited abnormally without producing
        // any visible output — common with context-overflow on local models.
        if (code !== 0 && !workspace.lastAgentText) {
          const errMsg =
            `Agent process exited with code ${code} without producing output. ` +
            `This often means the context window was exceeded or the LLM endpoint ` +
            `is unreachable. Check the LMStudio / Ollama server and model settings.`;
          console.error(`[pi] ${errMsg}`);
          broadcast({ type: "agent_error", errorType: "silent_exit", content: errMsg });
        }

        broadcast({ type: "agent_done", code });
        workspace.piProcess = null;
        workspace.piRpc = null;
        workspace.pendingHelp = null;
        workspace.pendingPlan = null;
        cleanupDesktop();
      },
    });
  } catch (err) {
    console.error(`[pi] Failed to launch agent:`, err.message);
    broadcast({
      type: "agent_log",
      content: `[error] Failed to launch agent: ${err.message}`,
    });
    workspace.piProcess = null;
    workspace.piRpc = null;
  }
}

module.exports = { launchPiAgent, handleRpcEvent, getTaskUsage, estimateTokens, freshUsage };
