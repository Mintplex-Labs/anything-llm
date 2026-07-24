const {
  settings,
  SUBAGENTS_MODE,
  PROMPT_PREFLIGHT_TIMEOUT_MS,
  PROMPT_PREFLIGHT_MAX_TOKENS,
  PROMPT_PREFLIGHT_TOOL_NAME,
} = require("../config");
const { resolveBaseUrlForGuest } = require("../utils/env");
const {
  shouldAutoDelegateFromPrompt,
  shouldDelegateFromPrompt,
} = require("../orchestration/subagents");

// ─── Short-circuit decisions ───────────────────────────────────────────────

function simplePreflightDecision(reason = "default simple") {
  return { mode: "simple", reason, plan_hint: [] };
}

function delegatePreflightDecision(reason = "explicit delegation requested") {
  return { mode: "delegate_sequential", reason, plan_hint: [] };
}

function normalizePlanHint(planHint) {
  const items = Array.isArray(planHint)
    ? planHint
    : String(planHint || "")
        .split(/\n+/)
        .map((line) => line.replace(/^[-*\d.)\s]+/, ""));
  return items
    .map((line) => String(line || "").trim())
    .filter(Boolean)
    .slice(0, 6);
}

function parsePreflightToolArgs(message) {
  const toolCall = message?.tool_calls?.find(
    (tc) => tc.function?.name === PROMPT_PREFLIGHT_TOOL_NAME,
  );
  const rawArgs = toolCall?.function?.arguments || message?.content || "{}";
  try {
    return JSON.parse(rawArgs);
  } catch {
    return {};
  }
}

// ─── Preflight classifier ──────────────────────────────────────────────────
// Calls the LLM with a constrained tool to classify the prompt before
// dispatching.  Falls back to "simple" on any error or timeout.

async function runPromptPreflight(prompt) {
  if (process.env.SKIP_PLANNING === "1" || process.env.SKIP_PLANNING === "true") {
    return simplePreflightDecision("SKIP_PLANNING enabled");
  }
  if (SUBAGENTS_MODE === "off") {
    return simplePreflightDecision("SUBAGENTS_MODE=off");
  }
  if (SUBAGENTS_MODE === "auto" && shouldAutoDelegateFromPrompt(prompt)) {
    return delegatePreflightDecision("auto delegation heuristic");
  }
  if (SUBAGENTS_MODE === "explicit" && shouldDelegateFromPrompt(prompt)) {
    return delegatePreflightDecision("explicit delegation requested");
  }
  if (process.env.PROMPT_PREFLIGHT === "false") {
    return simplePreflightDecision("disabled");
  }
  if (!settings.OPENAI_API_KEY && !settings.OPENAI_BASE_URL) {
    return simplePreflightDecision("no model configured");
  }

  const baseUrl = resolveBaseUrlForGuest(
    settings.OPENAI_BASE_URL || "https://api.openai.com/v1",
  );
  const targetUrl = `${baseUrl}/chat/completions`;
  const headers = { "Content-Type": "application/json" };
  if (settings.OPENAI_API_KEY)
    headers["Authorization"] = `Bearer ${settings.OPENAI_API_KEY}`;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    PROMPT_PREFLIGHT_TIMEOUT_MS,
  );

  try {
    const resp = await fetch(targetUrl, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: settings.OPENAI_MODEL,
        stream: false,
        temperature: 0,
        max_tokens: PROMPT_PREFLIGHT_MAX_TOKENS,
        messages: [
          {
            role: "system",
            content:
              "Classify the user's task before an autonomous desktop agent starts. " +
              "Call choose_execution_mode exactly once. Err on the side of caution and clarity. Choose simple only for greetings, tiny acknowledgements, " +
              "one-shot factual questions, direct commands, or obvious single-tool tasks. Choose " +
              "delegate_sequential for most substantive tasks, including browser work, research, files, deliverables, summaries, multi-step workflows, " +
              "screenshots, native apps, installations, testing, debugging, or implementation. Choose plan_first only when the user must review/edit the plan before execution. " +
              "For plan_first or delegate_sequential, provide 3-6 short execution hints. Mention ask_user " +
              "when clarification is genuinely needed before choosing an output or workflow.",
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: PROMPT_PREFLIGHT_TOOL_NAME,
              description:
                "Choose whether the prompt can be executed directly or should start with a brief plan.",
              parameters: {
                type: "object",
                additionalProperties: false,
                properties: {
                  mode: {
                    type: "string",
                    enum: ["simple", "plan_first", "delegate_sequential"],
                    description:
                      "simple sends the prompt unchanged; plan_first asks for an editable plan; delegate_sequential decomposes into child subagents.",
                  },
                  reason: {
                    type: "string",
                    description: "Short reason for the routing decision.",
                  },
                  plan_hint: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "For plan_first or delegate_sequential: 3-6 compact bullets to guide execution.",
                  },
                },
                required: ["mode", "reason"],
              },
            },
          },
        ],
        tool_choice: "required",
      }),
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      throw new Error(
        `HTTP ${resp.status}: ${(await resp.text()).slice(0, 200)}`,
      );
    }

    const data = await resp.json();
    const args = parsePreflightToolArgs(data.choices?.[0]?.message);
    const mode =
      args.mode === "delegate_sequential"
        ? "delegate_sequential"
        : args.mode === "plan_first"
          ? "plan_first"
          : "simple";
    return {
      mode,
      reason: String(args.reason || "model decision").slice(0, 200),
      plan_hint: mode !== "simple" ? normalizePlanHint(args.plan_hint) : [],
    };
  } catch (err) {
    clearTimeout(timeout);
    console.warn(`[preflight] failed, defaulting to simple: ${err.message}`);
    return simplePreflightDecision(`failed: ${err.message}`);
  }
}

module.exports = {
  runPromptPreflight,
  simplePreflightDecision,
  delegatePreflightDecision,
  normalizePlanHint,
};
