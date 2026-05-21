import { SkipForward, Check, ArrowRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

function ProgressIndicator({ answeredCount, total }) {
  const { t } = useTranslation();
  return (
    <div className="text-xs text-zinc-400 light:text-slate-500">
      {t("chat_window.agent_invocation.batch_progress", {
        answered: answeredCount,
        total,
      })}
    </div>
  );
}

function SkipButton({ isSingle, onClick }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-none text-white light:text-slate-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 light:hover:bg-slate-300 flex items-center gap-1"
    >
      <SkipForward size={14} />
      {isSingle
        ? t("chat_window.agent_invocation.clarifying_skip")
        : t("chat_window.agent_invocation.batch_skip_this")}
    </button>
  );
}

function SubmitButton({ isSingle, onClick }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-none transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm flex items-center gap-1"
    >
      <Check size={14} weight="bold" />
      {isSingle
        ? t("chat_window.agent_invocation.clarifying_submit")
        : t("chat_window.agent_invocation.batch_submit_all")}
    </button>
  );
}

function NextButton({ onClick }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-none transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm flex items-center gap-1"
    >
      {t("chat_window.agent_invocation.batch_next")}
      <ArrowRight size={14} weight="bold" />
    </button>
  );
}

/**
 * Survey footer for explicit-submit flows (input questions, multi-select
 * choice, or single-select choice with the free-text "Other" entry active).
 * For choice questions Skip lives inline in ChoiceForm; for input questions
 * there is no inline anchor so Skip rides along here when `allowSkip` is set.
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
  return (
    <div className="flex items-center justify-between gap-2 mt-1">
      {!isSingle && (
        <ProgressIndicator answeredCount={answeredCount} total={total} />
      )}
      <div className="flex items-center gap-2 ml-auto">
        {allowSkip && <SkipButton isSingle={isSingle} onClick={onSkipThis} />}
        {isLast ? (
          <SubmitButton isSingle={isSingle} onClick={onSubmitAll} />
        ) : (
          <NextButton onClick={onNext} />
        )}
      </div>
    </div>
  );
}
