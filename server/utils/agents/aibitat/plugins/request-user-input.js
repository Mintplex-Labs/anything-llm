const { SystemSettings } = require("../../../../models/systemSettings");

const VALID_INPUT_TYPES = [
  "text",
  "url",
  "number",
  "date",
  "email",
  "textarea",
];

const DEFAULT_MAX_PER_TURN = 3;
const DEFAULT_TIMEOUT_MS = 120_000;

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
    if (a.skipped) answerText = "[user skipped]";
    else if (Array.isArray(a.answer)) answerText = a.answer.join(", ");
    else if (a.answer === null || a.answer === undefined || a.answer === "")
      answerText = "[no answer]";
    else answerText = String(a.answer);
    return `${i + 1}. Q: ${q.question}\n   A: ${answerText}`;
  });
  return lines.join("\n");
}

/**
 * Lazy-load the per-turn cap and timeout from SystemSettings on first call,
 * cache on the aibitat instance, and track how many questions have been asked
 * this turn. Done lazily (rather than in setup) so the plugin stays self-
 * contained and works for both regular and ephemeral agent runs.
 */
async function ensureState(aibitat) {
  if (aibitat._clarifyState) return aibitat._clarifyState;

  const maxPerTurnRaw = await SystemSettings.getValueOrFallback(
    { label: "agent_clarifying_questions_max_per_turn" },
    String(DEFAULT_MAX_PER_TURN)
  );

  const maxPerTurn = Number(maxPerTurnRaw);

  aibitat._clarifyState = {
    asked: 0,
    maxPerTurn: Number.isFinite(maxPerTurn)
      ? Math.max(1, Math.floor(maxPerTurn))
      : DEFAULT_MAX_PER_TURN,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };
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
  name: "request-user-input",
  plugin: function () {
    return {
      name: "request-user-input",
      setup(aibitat) {
        // Skip when the runtime can't actually prompt the user. The websocket
        // plugin attaches `requestUserClarification` only when a socket is
        // present, so API/ephemeral runs would otherwise crash on call.
        if (typeof aibitat.requestUserClarification !== "function") return;

        aibitat.function({
          super: aibitat,
          name: "request-user-input",
          description:
            "Prompt the user for input via an interactive form. " +
            "This is the ONLY way to ask the user questions - text responses cannot receive replies. " +
            "Call this tool when you need a URL, file path, name, date, preference, or any other detail to proceed. " +
            "The user will see a form and their answers are returned to you.",
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

            const state = await ensureState(this.super);
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

            // Buffer the completed survey on the aibitat instance so the
            // chat-history plugin can persist it to workspace_chats.response
            // alongside citations/outputs when the agent reply is saved.
            this.super.addClarifyingQuestionSurvey({
              questions: truncated,
              result,
            });

            return formatAnswersForAgent(truncated, result) + truncatedNote;
          },
        });
      },
    };
  },
};

const requestUserInput = {
  name: "request-user-input",
  startupConfig: {
    params: {},
  },
  plugin: [AskUser],
};

module.exports = { requestUserInput };
