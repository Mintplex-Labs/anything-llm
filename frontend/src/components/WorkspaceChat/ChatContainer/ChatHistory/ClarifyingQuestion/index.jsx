import { useMemo, useState } from "react";
import useTimeoutProgress from "@/hooks/useTimeoutProgress";
import Header from "./Header";
import InputForm from "./InputForm";
import ChoiceForm from "./ChoiceForm";
import Footer from "./Footer";
import SurveyBody from "./SurveyBody";
import { answerForDraft, emptyDraftFor } from "./utils";

/**
 * Live, interactive clarifying-question card. Walks the user through one or
 * more questions in a single batch (paginated), then renders a read-only
 * SurveyBody once the user submits, skips, or the timeout fires.
 *
 * Persisted/historical chats use the same SurveyBody via HistoricalClarifyingQuestions.
 */
export default function ClarifyingQuestionCard({
  requestId,
  questions = [],
  allowSkip = true,
  timeoutMs = null,
  websocket,
}) {
  const [index, setIndex] = useState(0);
  const [responded, setResponded] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [drafts, setDrafts] = useState(() =>
    questions.map((q) => emptyDraftFor(q))
  );

  const progressPercent = useTimeoutProgress(timeoutMs, {
    active: !responded,
    onTimeout: () => {
      setResponded(true);
      setSubmittedResult({ timedOut: true });
    },
  });

  const total = questions.length;
  const isSingle = total === 1;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const currentQuestion = questions[index];
  const currentDraft = drafts[index];

  const answeredCount = useMemo(
    () =>
      questions.reduce((acc, q, i) => {
        const r = answerForDraft(q, drafts[i]);
        return acc + (r.skipped ? 0 : 1);
      }, 0),
    [questions, drafts]
  );

  if (!total) return null;

  function updateDraft(patch) {
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d))
    );
  }

  function send(payload) {
    if (responded) return;
    setResponded(true);
    setSubmittedResult(payload);
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(
        JSON.stringify({
          type: "clarificationResponse",
          requestId,
          ...payload,
        })
      );
    }
  }

  function handleSkipThis() {
    updateDraft({ skipped: true });
    if (!isLast) setIndex(index + 1);
  }

  function handleNext() {
    if (isLast) return handleSubmitAll();
    setIndex(index + 1);
  }

  function handlePrev() {
    if (isFirst) return;
    setIndex(index - 1);
  }

  function handleSubmitAll() {
    const answers = questions.map((q, i) => answerForDraft(q, drafts[i]));
    send({ skipped: false, answers });
  }

  function handleClose() {
    send({ skipped: true });
  }

  return (
    <div className="flex justify-center w-full my-1 pr-4">
      <div className="w-full flex flex-col">
        <div
          style={{ borderRadius: "16px" }}
          className="relative bg-zinc-800 light:bg-slate-100 p-4 pb-3 flex flex-col gap-y-3 overflow-hidden"
        >
          <Header
            question={currentQuestion?.question}
            index={index}
            total={total}
            isSingle={isSingle}
            responded={responded}
            onPrev={handlePrev}
            onNext={handleNext}
            onClose={handleClose}
            isFirst={isFirst}
            isLast={isLast}
          />

          {!responded && currentQuestion?.kind === "input" && (
            <InputForm
              question={currentQuestion}
              draft={currentDraft}
              onChange={(value) => updateDraft({ skipped: false, value })}
              onSubmit={isSingle ? handleSubmitAll : handleNext}
            />
          )}

          {!responded && currentQuestion?.kind === "choice" && (
            <ChoiceForm
              question={currentQuestion}
              draft={currentDraft}
              onChange={(patch) => updateDraft({ skipped: false, ...patch })}
            />
          )}

          {!responded && (
            <Footer
              isSingle={isSingle}
              isLast={isLast}
              allowSkip={allowSkip}
              answeredCount={answeredCount}
              total={total}
              onSkipThis={handleSkipThis}
              onNext={handleNext}
              onSubmitAll={handleSubmitAll}
            />
          )}

          {responded && (
            <SurveyBody
              questions={questions}
              result={
                submittedResult?.timedOut || submittedResult?.skipped
                  ? submittedResult
                  : {
                      answers: questions.map((q, i) =>
                        answerForDraft(q, drafts[i])
                      ),
                    }
              }
            />
          )}

          {timeoutMs && !responded && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700 light:bg-slate-300">
              <div
                className="h-full bg-sky-500 light:bg-sky-600 transition-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
