import SurveyBody from "../../ClarifyingQuestion/SurveyBody";

/**
 * Read-only render of clarifying-question surveys persisted on a chat record.
 * Mirrors the live ClarifyingQuestionCard's post-submit view: same card chrome,
 * no header (the question/answer pairs in SurveyBody are self-describing). One
 * card per survey (an agent can call `ask-user` multiple times in a single turn).
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
  const questions = Array.isArray(survey?.questions) ? survey.questions : [];
  const result = survey?.result || {};

  if (questions.length === 0) return null;

  return (
    <div
      style={{ borderRadius: "20px" }}
      className="border border-solid border-zinc-700 light:border-zinc-300 bg-transparent p-[18px] flex flex-col gap-[18px]"
    >
      <SurveyBody questions={questions} result={result} />
    </div>
  );
}
