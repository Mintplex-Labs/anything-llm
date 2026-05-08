import { Question, ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

/**
 * Survey header: leading icon, "Agent needs more information" label, current
 * question text, pagination chrome (only while the user is still answering),
 * and a close-and-skip button.
 */
export default function Header({
  question,
  index,
  total,
  isSingle,
  responded,
  onPrev,
  onNext,
  onClose,
  isFirst,
  isLast,
}) {
  const { t } = useTranslation();
  const showPagination = !isSingle && !responded;

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <Question
          size={18}
          className="mt-0.5 shrink-0 text-sky-400 light:text-sky-600"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-white/60 light:text-slate-700 text-xs uppercase tracking-wide">
            {t("chat_window.agent_invocation.clarifying_question_header")}
          </span>
          <span className="text-white light:text-slate-900 text-sm font-medium break-words">
            {question}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {showPagination && (
          <>
            <button
              type="button"
              onClick={onPrev}
              disabled={isFirst}
              aria-label={t(
                "chat_window.agent_invocation.clarifying_prev_aria"
              )}
              className="border-none p-1 rounded text-white/70 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} />
            </button>
            <span className="text-xs text-white/70 light:text-slate-700 px-2 select-none">
              {t("chat_window.agent_invocation.clarifying_pagination", {
                current: index + 1,
                total,
              })}
            </span>
            <button
              type="button"
              onClick={onNext}
              disabled={isLast}
              aria-label={t(
                "chat_window.agent_invocation.clarifying_next_aria"
              )}
              className="border-none p-1 rounded text-white/70 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight size={14} />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          disabled={responded}
          aria-label={t("chat_window.agent_invocation.clarifying_close_aria")}
          className="border-none p-1 rounded text-white/70 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-300 disabled:opacity-30"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
