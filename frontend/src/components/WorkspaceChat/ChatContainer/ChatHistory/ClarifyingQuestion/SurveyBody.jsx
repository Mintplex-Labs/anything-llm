import { useTranslation } from "react-i18next";
import { formatAnswerDisplay } from "./utils";

/**
 * Read-only render of a completed clarifying-question survey. Used by the
 * live ClarifyingQuestionCard once the user submits and by HistoricalClarifyingQuestions
 * when replaying past chats. Any UI change for filled-in surveys lives here.
 *
 * @param {Object} props
 * @param {Array<Object>} props.questions - Question objects (kind, question, ...).
 * @param {{ timedOut?: boolean, skipped?: boolean, answers?: Array<{ skipped: boolean, answer: any }> }} props.result
 *   The survey's resolution payload — same shape returned by the websocket.
 */
export default function SurveyBody({ questions = [], result = {} }) {
  const { t } = useTranslation();

  if (result.timedOut) {
    return (
      <div className="text-xs text-white/60 light:text-slate-600">
        {t("chat_window.agent_invocation.clarifying_timeout")}
      </div>
    );
  }

  if (result.skipped) {
    return (
      <div className="text-xs text-white/60 light:text-slate-600">
        {t("chat_window.agent_invocation.clarifying_skipped")}
      </div>
    );
  }

  const answers = Array.isArray(result.answers) ? result.answers : [];
  const showNumbers = questions.length > 1;
  const skippedLabel = t("chat_window.agent_invocation.answer_skipped");

  return (
    <div className="flex flex-col gap-y-1.5 text-xs text-white/70 light:text-slate-700">
      {questions.map((q, i) => {
        const answer = answers[i] || { skipped: true };
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
                {formatAnswerDisplay(answer, skippedLabel)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
