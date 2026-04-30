import { useEffect, useMemo, useRef, useState } from "react";
import {
  Question,
  ArrowLeft,
  ArrowRight,
  X,
  SkipForward,
  Check,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const VALID_INPUT_TYPES = [
  "text",
  "url",
  "number",
  "date",
  "email",
  "textarea",
];

export default function ClarifyingQuestion({
  requestId,
  questions = [],
  allowSkip = true,
  timeoutMs = null,
  websocket,
}) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [responded, setResponded] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState(null);
  const [drafts, setDrafts] = useState(() =>
    questions.map((q) => emptyDraftFor(q))
  );
  const [timeRemaining, setTimeRemaining] = useState(timeoutMs);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!timeoutMs || responded) return;
    if (startTimeRef.current === null) startTimeRef.current = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, timeoutMs - elapsed);
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(intervalId);
        setResponded(true);
        setSubmittedSummary({ timedOut: true });
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [timeoutMs, responded]);

  const total = questions.length;
  const isSingle = total === 1;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const currentQuestion = questions[index];
  const currentDraft = drafts[index];

  function updateDraft(patch) {
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d))
    );
  }

  function send(payload) {
    if (responded) return;
    setResponded(true);
    setSubmittedSummary(payload);
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

  function answerForDraft(question, draft) {
    if (draft.skipped) return { skipped: true, answer: null };
    if (question.kind === "input") {
      const trimmed = String(draft.value || "").trim();
      if (!trimmed) return { skipped: true, answer: null };
      return { skipped: false, answer: trimmed };
    }
    // choice
    if (draft.otherSelected) {
      const trimmed = String(draft.otherText || "").trim();
      if (!trimmed) return { skipped: true, answer: null };
      if (question.multiSelect)
        return {
          skipped: false,
          answer: [...(draft.selected || []), trimmed],
        };
      return { skipped: false, answer: trimmed };
    }
    if (question.multiSelect) {
      const picks = draft.selected || [];
      if (picks.length === 0) return { skipped: true, answer: null };
      return { skipped: false, answer: picks };
    }
    if (!draft.selected) return { skipped: true, answer: null };
    return { skipped: false, answer: draft.selected };
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

  const answeredCount = useMemo(
    () =>
      questions.reduce((acc, q, i) => {
        const r = answerForDraft(q, drafts[i]);
        return acc + (r.skipped ? 0 : 1);
      }, 0),
    [questions, drafts]
  );

  const progressPercent = timeoutMs ? (timeRemaining / timeoutMs) * 100 : 0;

  if (!total) return null;

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
            onPrev={handlePrev}
            onNext={handleNext}
            onClose={handleClose}
            isFirst={isFirst}
            isLast={isLast}
            disabled={responded}
            t={t}
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
              t={t}
            />
          )}

          {responded && (
            <Summary
              questions={questions}
              drafts={drafts}
              summary={submittedSummary}
              answerForDraft={answerForDraft}
              t={t}
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

function emptyDraftFor(q) {
  if (q?.kind === "choice") {
    return {
      skipped: false,
      selected: q.multiSelect ? [] : null,
      otherSelected: false,
      otherText: "",
    };
  }
  return { skipped: false, value: "" };
}

function Header({
  question,
  index,
  total,
  isSingle,
  onPrev,
  onNext,
  onClose,
  isFirst,
  isLast,
  disabled,
  t,
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-start gap-2 flex-1 min-w-0">
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
          <span className="text-white light:text-slate-900 text-sm font-medium break-words">
            {question}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!isSingle && (
          <>
            <button
              type="button"
              onClick={onPrev}
              disabled={disabled || isFirst}
              aria-label="Previous question"
              className="border-none p-1 rounded text-white/70 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} />
            </button>
            <span className="text-xs text-white/70 light:text-slate-700 px-2 select-none">
              {index + 1} of {total}
            </span>
            <button
              type="button"
              onClick={onNext}
              disabled={disabled || isLast}
              aria-label="Next question"
              className="border-none p-1 rounded text-white/70 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight size={14} />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          disabled={disabled}
          aria-label="Close and skip"
          className="border-none p-1 rounded text-white/70 hover:text-white hover:bg-white/5 disabled:opacity-30"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function InputForm({ question, draft, onChange, onSubmit }) {
  const inputType = VALID_INPUT_TYPES.includes(question.inputType)
    ? question.inputType
    : "text";
  const isTextarea = inputType === "textarea";
  const sharedClass =
    "w-full border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5";

  function handleKeyDown(e) {
    if (e.key === "Enter" && !isTextarea) {
      e.preventDefault();
      onSubmit?.();
    }
  }

  return isTextarea ? (
    <textarea
      autoFocus
      rows={3}
      value={draft.value || ""}
      placeholder={question.placeholder || ""}
      onChange={(e) => onChange(e.target.value)}
      className={sharedClass}
    />
  ) : (
    <input
      autoFocus
      type={inputType}
      value={draft.value || ""}
      placeholder={question.placeholder || ""}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className={sharedClass}
    />
  );
}

function ChoiceForm({ question, draft, onChange }) {
  function toggleSingle(opt) {
    onChange({ selected: opt, otherSelected: false });
  }
  function toggleMulti(opt) {
    const list = Array.isArray(draft.selected) ? draft.selected : [];
    const next = list.includes(opt)
      ? list.filter((o) => o !== opt)
      : [...list, opt];
    onChange({ selected: next, otherSelected: false });
  }
  function isChecked(opt) {
    return question.multiSelect
      ? Array.isArray(draft.selected) && draft.selected.includes(opt)
      : draft.selected === opt;
  }

  return (
    <div className="flex flex-col gap-y-1.5">
      {question.options.map((opt, idx) => (
        <label
          key={`${opt}-${idx}`}
          className="flex items-start gap-2 cursor-pointer text-white/90 light:text-slate-800 text-sm hover:bg-white/5 light:hover:bg-slate-200 px-2 py-1 rounded"
        >
          <input
            type={question.multiSelect ? "checkbox" : "radio"}
            checked={isChecked(opt)}
            onChange={() =>
              question.multiSelect ? toggleMulti(opt) : toggleSingle(opt)
            }
            className="mt-0.5"
          />
          <div className="flex flex-col">
            <span>{opt}</span>
            {question.optionDescriptions?.[idx] && (
              <span className="text-xs text-white/50 light:text-slate-500">
                {question.optionDescriptions[idx]}
              </span>
            )}
          </div>
        </label>
      ))}

      {question.allowOther !== false && (
        <div className="border-t border-white/10 mt-1 pt-2">
          <label className="flex items-start gap-2 cursor-pointer text-white/90 light:text-slate-800 text-sm">
            <input
              type={question.multiSelect ? "checkbox" : "radio"}
              checked={!!draft.otherSelected}
              onChange={() => {
                if (!question.multiSelect)
                  onChange({
                    selected: null,
                    otherSelected: !draft.otherSelected,
                  });
                else onChange({ otherSelected: !draft.otherSelected });
              }}
              className="mt-0.5"
            />
            <div className="flex flex-col w-full">
              <span>Other</span>
              {draft.otherSelected && (
                <input
                  autoFocus
                  type="text"
                  value={draft.otherText || ""}
                  onChange={(e) => onChange({ otherText: e.target.value })}
                  placeholder="Type your answer"
                  className="mt-1 w-full border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2"
                />
              )}
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

function Footer({
  isSingle,
  isLast,
  allowSkip,
  answeredCount,
  total,
  onSkipThis,
  onNext,
  onSubmitAll,
  t,
}) {
  return (
    <div className="flex items-center justify-between gap-2 mt-1">
      {!isSingle && (
        <div className="text-xs text-white/50 light:text-slate-500">
          {t("chat_window.agent_invocation.batch_progress", {
            defaultValue: "{{answered}} of {{total}} answered",
            answered: answeredCount,
            total,
          })}
        </div>
      )}
      <div className="flex items-center gap-2 ml-auto">
        {allowSkip && (
          <button
            type="button"
            onClick={onSkipThis}
            className="border-none text-white light:text-slate-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 light:hover:bg-slate-300 flex items-center gap-1"
          >
            <SkipForward size={14} />
            {isSingle
              ? t("chat_window.agent_invocation.clarifying_skip", {
                  defaultValue: "Let agent decide",
                })
              : t("chat_window.agent_invocation.batch_skip_this", {
                  defaultValue: "Skip",
                })}
          </button>
        )}
        {isLast || isSingle ? (
          <button
            type="button"
            onClick={onSubmitAll}
            className="border-none transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm flex items-center gap-1"
          >
            <Check size={14} weight="bold" />
            {isSingle
              ? t("chat_window.agent_invocation.clarifying_submit", {
                  defaultValue: "Submit",
                })
              : t("chat_window.agent_invocation.batch_submit_all", {
                  defaultValue: "Submit all",
                })}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="border-none transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm flex items-center gap-1"
          >
            {t("chat_window.agent_invocation.batch_next", {
              defaultValue: "Next",
            })}
            <ArrowRight size={14} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}

function Summary({ questions, drafts, summary, answerForDraft, t }) {
  if (summary?.timedOut)
    return (
      <div className="text-xs text-white/60 light:text-slate-600">
        {t("chat_window.agent_invocation.clarifying_timeout", {
          defaultValue: "No response submitted in time.",
        })}
      </div>
    );
  if (summary?.skipped)
    return (
      <div className="text-xs text-white/60 light:text-slate-600">
        {t("chat_window.agent_invocation.clarifying_skipped", {
          defaultValue: "You let the agent decide.",
        })}
      </div>
    );

  return (
    <div className="flex flex-col gap-y-1.5 text-xs text-white/70 light:text-slate-700">
      {questions.map((q, i) => {
        const a = answerForDraft(q, drafts[i]);
        let display;
        if (a.skipped) display = "[skipped]";
        else if (Array.isArray(a.answer)) display = a.answer.join(", ");
        else display = String(a.answer ?? "");
        return (
          <div key={i} className="flex gap-2">
            {questions.length > 1 && (
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
