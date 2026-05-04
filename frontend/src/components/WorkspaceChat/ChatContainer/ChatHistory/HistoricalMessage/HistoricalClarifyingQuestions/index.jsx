import { Question } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

/**
 * Read-only render of clarifying-question surveys persisted on a chat record.
 * Mirrors the visual treatment of the live ClarifyingQuestion component's
 * post-submit Summary view but strips all interactivity. One card per survey
 * (an agent can call `ask-user` multiple times in a single turn).
 */
export default function HistoricalClarifyingQuestions({ surveys = [] }) {
  if (!Array.isArray(surveys) || surveys.length === 0) return null;

  return (
    <div className="flex flex-col gap-y-2 mb-3">
      {surveys.map((survey, i) => (
        <SurveyCard key={i} survey={survey} />
      ))}
    </div>
  );
}

function SurveyCard({ survey }) {
  const { t } = useTranslation();
  const questions = Array.isArray(survey?.questions) ? survey.questions : [];
  const result = survey?.result || {};

  if (questions.length === 0) return null;

  return (
    <div
      style={{ borderRadius: "16px" }}
      className="bg-zinc-800 light:bg-slate-100 p-4 flex flex-col gap-y-3"
    >
      <div className="flex items-start gap-2">
        <Question
          size={18}
          className="mt-0.5 shrink-0 text-sky-400 light:text-sky-600"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-white/60 light:text-slate-700 text-xs uppercase tracking-wide">
            {t("chat_window.agent_invocation.clarifying_question_header", {
              defaultValue: "Agent needs more information",
            })}
          </span>
        </div>
      </div>

      <SurveyBody questions={questions} result={result} t={t} />
    </div>
  );
}

function SurveyBody({ questions, result, t }) {
  if (result.timedOut) {
    return (
      <div className="text-xs text-white/60 light:text-slate-600">
        {t("chat_window.agent_invocation.clarifying_timeout", {
          defaultValue: "No response submitted in time.",
        })}
      </div>
    );
  }

  if (result.skipped) {
    return (
      <div className="text-xs text-white/60 light:text-slate-600">
        {t("chat_window.agent_invocation.clarifying_skipped", {
          defaultValue: "You let the agent decide.",
        })}
      </div>
    );
  }

  const answers = Array.isArray(result.answers) ? result.answers : [];
  const showNumbers = questions.length > 1;

  return (
    <div className="flex flex-col gap-y-1.5 text-xs text-white/70 light:text-slate-700">
      {questions.map((q, i) => {
        const a = answers[i] || { skipped: true };
        let display;
        if (a.skipped) display = "[skipped]";
        else if (Array.isArray(a.answer)) display = a.answer.join(", ");
        else display = String(a.answer ?? "");
        return (
          <div key={i} className="flex gap-2">
            {showNumbers && (
              <span className="text-white/50 light:text-slate-500 shrink-0">
                {i + 1}.
              </span>
            )}
            <div className="flex flex-col">
              <span className="text-white/60 light:text-slate-600">
                {q.question}
              </span>
              <span className="font-medium text-white light:text-slate-900">
                {display}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
