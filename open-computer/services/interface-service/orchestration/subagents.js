function normalizeWorkUnits(units, fallbackItems = []) {
  const source = Array.isArray(units) && units.length
    ? units
    : fallbackItems.map((item, idx) => ({
        id: `step-${idx + 1}`,
        title: `Step ${idx + 1}`,
        role: "worker",
        objective: item,
        expected_output: "Concise result, facts gathered, files changed, blockers, and next step.",
      }));

  return source
    .map((unit, idx) => {
      const objective = String(unit.objective || unit.task || unit.title || "").trim();
      if (!objective) return null;
      return {
        id: String(unit.id || `step-${idx + 1}`).replace(/[^a-zA-Z0-9._-]/g, "_"),
        title: String(unit.title || `Step ${idx + 1}`).trim().slice(0, 80),
        role: String(unit.role || "worker").trim().slice(0, 40),
        objective,
        allowed_tools: Array.isArray(unit.allowed_tools)
          ? unit.allowed_tools.map((tool) => String(tool || "").trim()).filter(Boolean)
          : [],
        expected_output: String(
          unit.expected_output ||
            "Concise result, facts gathered, files changed, blockers, and next step.",
        ).trim(),
        depends_on: Array.isArray(unit.depends_on)
          ? unit.depends_on.map((dep) => String(dep || "").trim()).filter(Boolean)
          : [],
        requires_user_approval: unit.requires_user_approval === true,
      };
    })
    .filter(Boolean)
    .slice(0, 8);
}

function shouldDelegateFromPrompt(prompt) {
  const text = String(prompt || "").toLowerCase();
  return /\b(subagent|subagents|delegate|delegation|worker|workers|sequential|split (this|it|the task))\b/.test(text);
}

function isTinyPrompt(prompt) {
  const text = String(prompt || "").trim().toLowerCase();
  if (!text) return true;
  if (/^(hi|hey|hello|yo|sup|thanks|thank you|ok|okay|yes|no)[.!?]*$/.test(text)) {
    return true;
  }
  const words = text.split(/\s+/).filter(Boolean);
  return words.length <= 4 && !/[.,;:]/.test(text);
}

function shouldAutoDelegateFromPrompt(prompt) {
  const text = String(prompt || "").toLowerCase();
  if (isTinyPrompt(text)) return false;
  if (shouldDelegateFromPrompt(text)) return true;

  const substantiveSignals = [
    /\b(open|visit|browse|research|find|summarize|compare|analyze|investigate|implement|fix|debug|refactor|create|generate|save|download|upload|install|test|verify)\b/,
    /\b(pdf|docx|xlsx|deliverable|screenshot|report|article|articles|top \d+|multiple|several|then|and save|ask for filename)\b/,
    /\b(browser|hackernews|google|website|page|file|files|desktop|app)\b/,
  ];

  const signalCount = substantiveSignals.filter((re) => re.test(text)).length;
  if (signalCount >= 1 && text.split(/\s+/).length >= 8) return true;

  return false;
}

function buildDelegationPrompt(prompt, planItems = []) {
  const planText = normalizeWorkUnits([], planItems)
    .map((unit) => `- ${unit.objective}`)
    .join("\n");

  return `Break this user task into a short sequential subagent queue. Call propose_delegation exactly once.

Requirements:
- Use 1-6 work units.
- Each work unit must be independently understandable by a fresh child agent.
- Keep units sequential and local-model friendly; do not create parallel work.
- Use role names like scout, researcher, worker, reviewer, or synthesizer when helpful.
- Do not execute the task.

${planText ? `Approved plan items:\n${planText}\n` : ""}
User task:
${prompt}`;
}

function buildSubagentPrompt({ originalPrompt, unit, previousOutputs = [] }) {
  const prior = previousOutputs.length
    ? previousOutputs
        .map((output, idx) => {
          const title = output.title || output.id || `Step ${idx + 1}`;
          return `### ${title}\n${output.output || "(no output)"}`;
        })
        .join("\n\n")
    : "(none)";

  return `You are a focused child subagent. Complete only your assigned subtask, then stop.

Original user task:
${originalPrompt}

Your role:
${unit.role}

Your subtask:
${unit.objective}

Expected output:
${unit.expected_output}

Previous subagent outputs:
${prior}

Rules:
- Do not spawn or propose subagents.
- Use tools only when needed for this subtask.
- If the subtask involves articles, search results, or external pages, open the actual link/href with open_browser or page_open_link before summarizing. Do not summarize from a listing page alone.
- Do not ask the user unless blocked by a decision that changes the output or workflow.
- End with a compact handoff using these headings:
  Result
  Facts gathered
  Files changed or deliverables
  Blockers
  Suggested next step`;
}

function buildSynthesisPrompt({ originalPrompt, units = [], outputs = [] }) {
  const unitText = units
    .map((unit, idx) => `${idx + 1}. ${unit.title}: ${unit.objective}`)
    .join("\n");
  const outputText = outputs
    .map((output, idx) => {
      const title = output.title || output.id || `Step ${idx + 1}`;
      return `## ${title}\n${output.output || "(no output)"}`;
    })
    .join("\n\n");

  return `Assemble the final response for the user from sequential child subagent outputs.

Original user task:
${originalPrompt}

Delegated work units:
${unitText || "(none)"}

Child outputs:
${outputText || "(none)"}

Write the final answer or final deliverable instructions. Be concise, do not invent missing facts, and mention any blockers or incomplete child work.`;
}

module.exports = {
  buildDelegationPrompt,
  buildSubagentPrompt,
  buildSynthesisPrompt,
  normalizeWorkUnits,
  shouldAutoDelegateFromPrompt,
  shouldDelegateFromPrompt,
};
