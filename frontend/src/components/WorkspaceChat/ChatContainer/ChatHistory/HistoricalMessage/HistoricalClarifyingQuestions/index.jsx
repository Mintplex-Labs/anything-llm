import { Question } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import SurveyBody from "../../ClarifyingQuestion/SurveyBody";

/**
 * Read-only render of clarifying-question surveys persisted on a chat record.
 * Mirrors the visual treatment of the live ClarifyingQuestionCard's post-submit
 * view by reusing the same SurveyBody component. One card per survey (an agent
 * can call `ask-user` multiple times in a single turn).
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
            {t("chat_window.agent_invocation.clarifying_question_header")}
          </span>
        </div>
      </div>

      <SurveyBody questions={questions} result={result} />
    </div>
  );
}
