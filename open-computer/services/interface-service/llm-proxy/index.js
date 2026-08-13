const {
  settings,
  LLM_PROXY_DEFAULT_MAX_TOKENS,
  LLM_PROXY_STREAM_MAX_BYTES,
} = require("../config");
const { broadcast } = require("../broadcast");
const { getPendingInterrupt, clearPendingInterrupt, setPendingInterrupt } = require("../interrupt");
const { optimizeRequest, emergencyCompress } = require("../utils/context-optimizer");
const { classifyLlmError, ERROR_TYPES } = require("../utils/llm-error");

// In-flight LLM request tracker.
// phase: "connecting" = waiting for response headers from upstream
//        "streaming"  = headers received, reading body chunks
//        null         = no request in flight
let activeLlmRequest = null;

function getLlmRequestStatus() {
  if (!activeLlmRequest) return null;
  const elapsedSec = ((Date.now() - activeLlmRequest.startedAt) / 1000).toFixed(1);
  return { phase: activeLlmRequest.phase, elapsedSec };
}

// ─── Repetition detection ──────────────────────────────────────────────────
// We accumulate the actual LLM text content from SSE delta frames into a
// rolling buffer and periodically check whether the agent is generating the
// same structural lines over and over (e.g. hundreds of ax.annotate() calls).
// If repetition is found we halt the stream early and inject a guidance
// interrupt so the agent writes to a file instead.

const REPETITION_TEXT_BUF = 6000;   // chars of LLM text to keep
const REPETITION_CHECK_EVERY = 20 * 1024; // bytes streamed between checks
const REPETITION_MIN_LINES = 8;     // minimum lines before we bother checking
const REPETITION_LINE_PREFIX = 50;  // chars used as a line fingerprint
const REPETITION_LINE_HITS = 4;     // same prefix this many times → repetitive

function _isRepetitive(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 15);
  if (lines.length < REPETITION_MIN_LINES) return false;
  const counts = {};
  for (const l of lines) {
    const key = l.slice(0, REPETITION_LINE_PREFIX);
    counts[key] = (counts[key] || 0) + 1;
    if (counts[key] >= REPETITION_LINE_HITS) return true;
  }
  return false;
}

// ─── Session-scoped proxy usage ────────────────────────────────────────────
// Accumulates tokens reported by the upstream LLM for the current session.
// Resets when the user starts a new session.  These are the authoritative
// numbers shown in the UI header — preferred over hypervisor estimates.

let _proxyUsage = { inputTokens: 0, outputTokens: 0, calls: 0, lastInputTokens: 0 };

function resetProxyUsage() {
  _proxyUsage = { inputTokens: 0, outputTokens: 0, calls: 0, lastInputTokens: 0 };
}

function getProxyUsage() {
  return { ..._proxyUsage };
}

function _accumulateUsage(usage) {
  if (!usage) return;
  const callIn  = usage.prompt_tokens     || usage.input_tokens     || 0;
  const callOut = usage.completion_tokens || usage.output_tokens    || 0;
  _proxyUsage.inputTokens  += callIn;
  _proxyUsage.outputTokens += callOut;
  _proxyUsage.lastInputTokens = callIn;   // context size of the most recent call
  _proxyUsage.calls++;
  broadcast({
    type:            "proxy_usage",
    inputTokens:     _proxyUsage.inputTokens,
    outputTokens:    _proxyUsage.outputTokens,
    calls:           _proxyUsage.calls,
    lastInputTokens: _proxyUsage.lastInputTokens,
    contextWindow:   settings.CONTEXT_WINDOW || 0,
  });
}

// ─── Error broadcast helper ────────────────────────────────────────────────
// Surfaces a structured error to every connected WebSocket client so the UI
// can display it prominently rather than silently dropping the request.

function broadcastLlmError(classified, detail = "") {
  const msg = detail
    ? `${classified.userMessage}\n${detail}`
    : classified.userMessage;
  console.error(`[llm-proxy] ${classified.type}: ${msg}`);
  broadcast({ type: "agent_error", errorType: classified.type, content: msg });
  broadcast({ type: "agent_log",   content: `[error] ${msg}` });
}

// ─── Route registration ────────────────────────────────────────────────────

function registerLlmProxy(app) {
  // Large body limit — tool-heavy requests can be many megabytes
  app.use("/llm-proxy", require("express").json({ limit: "50mb" }));

  // Debug logging for every proxied request
  app.use("/llm-proxy", (req, _res, next) => {
    console.log(`[llm-proxy] ${req.method} ${req.originalUrl}`);
    next();
  });

  // ── Chat completions ────────────────────────────────────────────────────

  app.post("/llm-proxy/v1/chat/completions", async (req, res) => {
    const msgCount = req.body?.messages?.length || 0;
    const toolCount = req.body?.tools?.length || 0;
    console.log(
      `[llm-proxy] Intercepted: ${msgCount} msgs, ${toolCount} tools, model=${req.body?.model || "?"}`,
    );

    // If an interrupt is queued, return it as a synthetic response so the
    // agent abandons its current action and follows the instruction.
    const interrupt = getPendingInterrupt();
    if (interrupt) {
      clearPendingInterrupt();
      console.log(`[llm-proxy] Injecting interrupt: "${interrupt.slice(0, 100)}"`);

      const synthetic = {
        id: `interrupt-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: req.body?.model || "local",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content:
                `I need to stop what I'm doing. The user just sent a new instruction:\n\n` +
                `"${interrupt}"\n\n` +
                `I will now follow this instruction instead of continuing my previous action.`,
            },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      };

      if (req.body?.stream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.write(`data: ${JSON.stringify(synthetic)}\n\n`);
        res.write("data: [DONE]\n\n");
        return res.end();
      }

      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(synthetic));
    }

    if (!settings.LLM_PROXY_TARGET) {
      const err = classifyLlmError("LLM proxy target not configured", null);
      broadcastLlmError(
        {
          type: ERROR_TYPES.CONNECTION_ERROR,
          userMessage:
            "LLM proxy target not configured — set LLM_PROXY_TARGET in settings.",
          canRetry: false,
        },
      );
      return res.status(502).json({ error: "LLM proxy target not configured" });
    }

    const targetUrl = `${settings.LLM_PROXY_TARGET}/chat/completions`;

    // ── Upstream request (with one context-compression retry) ──────────────

    const doRequest = async (body, isRetry = false) => {
      const optimized = optimizeRequest(body, {
        contextWindow: settings.CONTEXT_WINDOW,
      });

      // Guard against local models that never stop generating
      if (!optimized.max_tokens && !optimized.max_completion_tokens) {
        optimized.max_tokens = LLM_PROXY_DEFAULT_MAX_TOKENS;
      }

      if (optimized.tools && optimized.tools.length > 0 && !settings.PARALLEL_TOOL_CALLS) {
        optimized.parallel_tool_calls = false;
      }

      // Ask the upstream to include usage in the final streaming chunk so we
      // can count tokens accurately without buffering the whole response.
      if (optimized.stream) {
        optimized.stream_options = optimized.stream_options || { include_usage: true };
      }

      const headers = { "Content-Type": "application/json" };
      if (settings.OPENAI_API_KEY)
        headers["Authorization"] = `Bearer ${settings.OPENAI_API_KEY}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 300_000);

      try {
        const upstream = await fetch(targetUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(optimized),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        return { upstream, optimized };
      } catch (fetchErr) {
        clearTimeout(timeout);
        throw fetchErr;
      }
    };

    try {
      activeLlmRequest = { startedAt: Date.now(), phase: "connecting" };
      broadcast({ type: "llm_status", state: "waiting" });
      const msgCount = req.body?.messages?.length || 0;
      broadcast({ type: "agent_log", content: `[llm-proxy] → waiting for response (${msgCount} msgs)` });

      let body = req.body;
      let { upstream, optimized } = await doRequest(body);

      // ── Context overflow: retry once with emergency compression ──────────
      if (!upstream.ok && (upstream.status === 400 || upstream.status === 413)) {
        const errPeek = await upstream.text();
        const classified = classifyLlmError(errPeek, upstream.status);

        if (classified.type === ERROR_TYPES.CONTEXT_EXCEEDED) {
          console.warn(`[llm-proxy] Context exceeded — applying emergency compression and retrying`);
          broadcast({ type: "agent_log", content: "[llm-proxy] Context exceeded — compressing history…" });

          const compressedMessages = emergencyCompress(body.messages || [], {
            keepRecent: 6,
            maxToolChars: 300,
          });
          body = { ...body, messages: compressedMessages };

          try {
            ({ upstream, optimized } = await doRequest(body, true));
          } catch (retryErr) {
            const retryClassified = classifyLlmError(retryErr.message);
            broadcastLlmError(retryClassified, retryErr.message);
            if (!res.headersSent)
              res.status(502).json({ error: `LLM proxy error: ${retryErr.message}` });
            return;
          }

          if (!upstream.ok) {
            const retryErrBody = await upstream.text();
            const retryClassified = classifyLlmError(retryErrBody, upstream.status);
            broadcastLlmError(retryClassified, retryErrBody.slice(0, 300));
            if (!res.headersSent) {
              res.status(upstream.status);
              res.setHeader("Content-Type", "application/json");
              return res.end(retryErrBody);
            }
            return;
          }
        } else {
          // Non-context error on first attempt
          broadcastLlmError(classified, errPeek.slice(0, 300));
          if (!res.headersSent) {
            res.status(upstream.status);
            res.setHeader(
              "Content-Type",
              upstream.headers.get("content-type") || "application/json",
            );
            return res.end(errPeek);
          }
          return;
        }
      } else if (!upstream.ok) {
        const errBody = await upstream.text();
        const classified = classifyLlmError(errBody, upstream.status);
        broadcastLlmError(classified, errBody.slice(0, 300));
        if (!res.headersSent) {
          res.status(upstream.status);
          res.setHeader(
            "Content-Type",
            upstream.headers.get("content-type") || "application/json",
          );
          return res.end(errBody);
        }
        return;
      }

      // ── Stream forwarding ───────────────────────────────────────────────
      const isStreaming = optimized.stream === true;

      if (isStreaming) {
        if (activeLlmRequest) {
          const waitedSec = ((Date.now() - activeLlmRequest.startedAt) / 1000).toFixed(1);
          activeLlmRequest.phase = "streaming";
          broadcast({ type: "agent_log", content: `[llm-proxy] ← response started (waited ${waitedSec}s) — streaming` });
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let totalBytes = 0;
        let aborted = false;
        let abortReason = "";
        let streamUsage = null;
        let sseLineBuffer = "";
        let llmTextBuf = "";          // rolling window of actual LLM text content
        let nextRepetitionCheck = REPETITION_CHECK_EVERY;
        let nextSizeCheck = LLM_PROXY_STREAM_MAX_BYTES; // soft size gate; extends if content looks clean

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            totalBytes += chunk.length;

            // Scan SSE lines for usage and accumulate LLM text for repetition detection.
            sseLineBuffer += chunk;
            const lines = sseLineBuffer.split("\n");
            sseLineBuffer = lines.pop() || "";
            for (const line of lines) {
              if (line.startsWith("data: ") && !line.includes("[DONE]")) {
                try {
                  const d = JSON.parse(line.slice(6));
                  if (d.usage) streamUsage = d.usage;
                  const content = d.choices?.[0]?.delta?.content;
                  if (content) {
                    llmTextBuf += content;
                    if (llmTextBuf.length > REPETITION_TEXT_BUF)
                      llmTextBuf = llmTextBuf.slice(-REPETITION_TEXT_BUF);
                  }
                } catch {}
              }
            }

            // Early repetition check — catches obvious loops well before the size gate.
            if (totalBytes >= nextRepetitionCheck) {
              nextRepetitionCheck += REPETITION_CHECK_EVERY;
              if (_isRepetitive(llmTextBuf)) {
                res.write(chunk);
                res.write("\ndata: [DONE]\n\n");
                aborted = true;
                abortReason = "repetition";
                try { reader.cancel(); } catch {}
                break;
              }
            }

            // Size gate — check for repetition before deciding to abort or extend.
            if (totalBytes >= nextSizeCheck) {
              if (_isRepetitive(llmTextBuf)) {
                res.write(chunk);
                res.write("\ndata: [DONE]\n\n");
                aborted = true;
                abortReason = "repetition";
                try { reader.cancel(); } catch {}
                break;
              }
              // Content looks non-repetitive — let it run for another window.
              broadcast({
                type: "agent_log",
                content: `[llm-proxy] Stream at ${Math.round(totalBytes / 1024)}KB — content looks non-repetitive, extending by ${Math.round(LLM_PROXY_STREAM_MAX_BYTES / 1024)}KB`,
              });
              nextSizeCheck += LLM_PROXY_STREAM_MAX_BYTES;
            }

            res.write(chunk);
          }

          // Check any data remaining in the line buffer after stream ends.
          if (sseLineBuffer.startsWith("data: ") && !sseLineBuffer.includes("[DONE]")) {
            try {
              const d = JSON.parse(sseLineBuffer.slice(6));
              if (d.usage) streamUsage = d.usage;
            } catch {}
          }
        } catch (streamErr) {
          if (!aborted) {
            const classified = classifyLlmError(streamErr.message);
            broadcastLlmError(classified, streamErr.message);
          }
        } finally {
          res.end();
          _accumulateUsage(streamUsage);
          if (aborted) {
            broadcast({
              type: "agent_log",
              content: `[llm-proxy] ⚠ Repetitive output detected at ${Math.round(totalBytes / 1024)}KB — halting and injecting guidance`,
            });
            setPendingInterrupt(
              "You are repeating the same lines over and over in your response. Stop. " +
              "Write your output directly to a file using the write or bash tool instead of outputting it inline. Keep your reply text short."
            );
          }
        }
      } else {
        const respBody = await upstream.text();
        try {
          const parsed = JSON.parse(respBody);
          if (parsed.usage) _accumulateUsage(parsed.usage);
        } catch {}
        res.setHeader(
          "Content-Type",
          upstream.headers.get("content-type") || "application/json",
        );
        res.end(respBody);
      }
    } catch (err) {
      const classified = classifyLlmError(err.message);
      broadcastLlmError(classified, err.message);
      if (!res.headersSent) {
        res.status(502).json({ error: `LLM proxy error: ${err.message}` });
      }
    } finally {
      if (activeLlmRequest) {
        const elapsed = ((Date.now() - activeLlmRequest.startedAt) / 1000).toFixed(1);
        activeLlmRequest = null;
        broadcast({ type: "llm_status", state: "responded", elapsedSec: elapsed });
      }
    }
  });

  // ── Models pass-through ─────────────────────────────────────────────────
  // pi calls /llm-proxy/v1/models on startup to enumerate available models.

  app.get("/llm-proxy/v1/models", async (_req, res) => {
    if (!settings.LLM_PROXY_TARGET) {
      return res.json({ data: [] });
    }
    try {
      const headers = {};
      if (settings.OPENAI_API_KEY)
        headers["Authorization"] = `Bearer ${settings.OPENAI_API_KEY}`;
      const resp = await fetch(`${settings.LLM_PROXY_TARGET}/models`, { headers });
      const body = await resp.text();
      res.setHeader(
        "Content-Type",
        resp.headers.get("content-type") || "application/json",
      );
      res.end(body);
    } catch (err) {
      const classified = classifyLlmError(err.message);
      // Don't broadcast — models is a background probe, not user-initiated
      console.error(`[llm-proxy] Models fetch error: ${err.message}`);
      if (classified.type === ERROR_TYPES.CONNECTION_ERROR) {
        // Surface once so the user knows the endpoint is unreachable
        broadcast({
          type: "agent_error",
          errorType: ERROR_TYPES.CONNECTION_ERROR,
          content: classified.userMessage,
        });
      }
      res.json({ data: [] });
    }
  });
}

module.exports = { registerLlmProxy, getProxyUsage, resetProxyUsage, getLlmRequestStatus };
