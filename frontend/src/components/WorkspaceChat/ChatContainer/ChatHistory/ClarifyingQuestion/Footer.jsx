import { SkipForward, Check, ArrowRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

/**
 * Survey footer: progress count (multi-question only), skip button (when
 * allowed) and the primary advance/submit button. The primary button switches
 * between "Next" mid-batch and "Submit" on the last question.
 */
export default function Footer({
  isSingle,
  isLast,
  allowSkip,
  answeredCount,
  total,
  onSkipThis,
  onNext,
  onSubmitAll,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-2 mt-1">
      {!isSingle && (
        <div className="text-xs text-white/50 light:text-slate-500">
          {t("chat_window.agent_invocation.batch_progress", {
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
              ? t("chat_window.agent_invocation.clarifying_skip")
              : t("chat_window.agent_invocation.batch_skip_this")}
          </button>
        )}
        {isLast ? (
          <button
            type="button"
            onClick={onSubmitAll}
            className="border-none transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm flex items-center gap-1"
          >
            <Check size={14} weight="bold" />
            {isSingle
              ? t("chat_window.agent_invocation.clarifying_submit")
              : t("chat_window.agent_invocation.batch_submit_all")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="border-none transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm flex items-center gap-1"
          >
            {t("chat_window.agent_invocation.batch_next")}
            <ArrowRight size={14} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}
