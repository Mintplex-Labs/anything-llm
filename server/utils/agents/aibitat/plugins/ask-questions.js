const VALID_INPUT_TYPES = [
  "text",
  "url",
  "number",
  "date",
  "email",
  "textarea",
];

/**
 * Format a result as a numbered transcript so the LLM can map each answer
 * back to the question it asked. Single-question batches still get the same
 * format — the LLM treats it as "1. Q: ... A: ..." which is unambiguous.
 */
function formatAnswersForAgent(questions, result) {
  if (result.timedOut)
    return "[no response within the time limit — proceed using your best judgment]";
  if (result.skipped)
    return "[user skipped — proceed using your best judgment]";

  const lines = questions.map((q, i) => {
    const a = result.answers[i] || { skipped: true };
    let answerText;
    if (a.skipped) answerText = "[skipped]";
    else if (Array.isArray(a.answer)) answerText = a.answer.join(", ");
    else if (a.answer === null || a.answer === undefined || a.answer === "")
      answerText = "[no answer]";
    else answerText = String(a.answer);
    return `${i + 1}. Q: ${q.question}\n   A: ${answerText}`;
  });
  return lines.join("\n");
}

function ensureState(aibitat) {
  const cfg = aibitat._clarifyConfig || {};
  if (!aibitat._clarifyState) {
    aibitat._clarifyState = {
      asked: 0,
      maxPerTurn: Number.isFinite(Number(cfg.maxPerTurn))
        ? Math.max(1, Math.floor(Number(cfg.maxPerTurn)))
        : 3,
      timeoutMs: Number.isFinite(Number(cfg.timeoutMs))
        ? Math.max(10_000, Math.floor(Number(cfg.timeoutMs)))
        : 120_000,
    };
  }
  return aibitat._clarifyState;
}

/**
 * Validate and normalize a single question. Drops malformed entries rather
 * than rejecting the whole call.
 */
function normalizeQuestion(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.question !== "string" || !raw.question.trim()) return null;

  if (raw.kind === "input") {
    const inputType = VALID_INPUT_TYPES.includes(raw.inputType)
      ? raw.inputType
      : "text";
    return {
      kind: "input",
      question: raw.question.trim(),
      inputType,
      placeholder: typeof raw.placeholder === "string" ? raw.placeholder : null,
    };
  }

  if (raw.kind === "choice") {
    if (!Array.isArray(raw.options) || raw.options.length < 2) return null;
    return {
      kind: "choice",
      question: raw.question.trim(),
      options: raw.options.map(String),
      optionDescriptions: Array.isArray(raw.optionDescriptions)
        ? raw.optionDescriptions.map(String)
        : [],
      multiSelect: !!raw.multiSelect,
      allowOther: raw.allowOther !== false,
    };
  }

  return null;
}

const AskUser = {
  name: "ask-user",
  plugin: function () {
    return {
      name: "ask-user",
      setup(aibitat) {
        // Tool is meaningless without a websocket to ask through (API runs).
        if (!aibitat.socket) return;

        aibitat.function({
          super: aibitat,
          name: "ask-user",
          description:
            "Ask the user one or more clarifying questions and wait for answers. " +
            "USE WHEN: the user's request is ambiguous and you genuinely cannot proceed without a missing detail. " +
            "DO NOT USE WHEN: the answer is already in the conversation, obvious from context, or you can make a reasonable choice and proceed. " +
            "Pass an array of question objects in 'questions'. Each item has kind:'input' (free-form, with inputType: text|url|number|date|email|textarea) or kind:'choice' (with options[]). " +
            "BATCH questions that don't depend on each other into one call (e.g. PRD intake: name + users + deadline). " +
            "Use SEPARATE sequential calls when a later question's wording or options depend on the user's answer to an earlier one. " +
            "Each question counts toward the per-turn cap. The response is a numbered Q/A transcript.",
          examples: [
            {
              prompt: "Scrape a link for me",
              call: JSON.stringify({
                questions: [
                  {
                    kind: "input",
                    question: "Which URL would you like me to scrape?",
                    inputType: "url",
                  },
                ],
              }),
            },
            {
              prompt: "What format should I use?",
              call: JSON.stringify({
                questions: [
                  {
                    kind: "choice",
                    question: "Which output format would you like?",
                    options: ["JSON", "CSV", "Markdown table", "Plain text"],
                    allowOther: true,
                  },
                ],
              }),
            },
            {
              prompt: "Help me write a PRD",
              call: JSON.stringify({
                questions: [
                  {
                    kind: "input",
                    question: "What is the product or feature?",
                    inputType: "text",
                  },
                  {
                    kind: "input",
                    question: "Who are the target users?",
                    inputType: "text",
                  },
                  {
                    kind: "choice",
                    question: "What's the priority?",
                    options: ["P0", "P1", "P2"],
                    allowOther: false,
                  },
                ],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              questions: {
                type: "array",
                minItems: 1,
                maxItems: 10,
                description:
                  "Array of independent question objects. Use one for a single clarifying question; batch multiple when they don't depend on each other.",
                items: {
                  type: "object",
                  required: ["kind", "question"],
                  properties: {
                    kind: {
                      type: "string",
                      enum: ["input", "choice"],
                      description:
                        "'input' for free-form, 'choice' for a fixed list.",
                    },
                    question: {
                      type: "string",
                      description: "The question to show the user.",
                    },
                    inputType: {
                      type: "string",
                      enum: VALID_INPUT_TYPES,
                      description:
                        "Required when kind='input'. text|url|number|date|email|textarea.",
                    },
                    placeholder: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Required when kind='choice'. The list of choices.",
                    },
                    optionDescriptions: {
                      type: "array",
                      items: { type: "string" },
                    },
                    multiSelect: { type: "boolean" },
                    allowOther: { type: "boolean" },
                  },
                },
              },
            },
            required: ["questions"],
            additionalProperties: false,
          },
          handler: async function ({ questions = [] }) {
            if (!Array.isArray(questions) || questions.length < 1)
              return "[ask-user requires a 'questions' array with at least 1 entry]";

            const normalized = questions
              .map((q) => normalizeQuestion(q))
              .filter((q) => !!q);
            if (normalized.length < 1)
              return "[ask-user received no well-formed questions after validation]";

            const state = ensureState(this.super);
            const remaining = state.maxPerTurn - state.asked;
            if (remaining <= 0) {
              return `[clarification limit of ${state.maxPerTurn} reached for this turn — do not ask again, proceed with best judgment]`;
            }

            // Truncate to remaining cap rather than rejecting the whole call.
            const truncated = normalized.slice(0, remaining);
            const truncatedNote =
              truncated.length < normalized.length
                ? ` (truncated from ${normalized.length} to fit the per-turn cap of ${state.maxPerTurn})`
                : "";
            state.asked += truncated.length;

            this.super.introspect(
              `Asking the user ${truncated.length} clarifying question${truncated.length === 1 ? "" : "s"}${truncatedNote}.`
            );
            const result = await this.super.requestUserClarification({
              questions: truncated,
              allowSkip: true,
              timeoutMs: state.timeoutMs,
            });
            return formatAnswersForAgent(truncated, result) + truncatedNote;
          },
        });
      },
    };
  },
};

const askQuestions = {
  name: "ask-questions",
  startupConfig: {
    params: {},
  },
  plugin: [AskUser],
};

module.exports = { askQuestions };
