import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const NAV_BUTTON_CLASS =
  "border-none p-0 flex items-center justify-center text-white/70 light:text-slate-700 hover:text-white light:hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed";

function QuestionText({ children }) {
  return (
    <p className="flex-1 min-w-0 text-white light:text-slate-900 text-sm font-medium leading-5 break-words">
      {children}
    </p>
  );
}

function PaginationControls({ index, total, onPrev, onNext, isFirst, isLast }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        aria-label={t("chat_window.agent_invocation.clarifying_prev_aria")}
        className={NAV_BUTTON_CLASS}
      >
        <CaretLeft size={16} />
      </button>
      <span className="text-xs text-zinc-400 light:text-zinc-400 leading-4 whitespace-nowrap select-none">
        {t("chat_window.agent_invocation.clarifying_pagination", {
          current: index + 1,
          total,
        })}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        aria-label={t("chat_window.agent_invocation.clarifying_next_aria")}
        className={NAV_BUTTON_CLASS}
      >
        <CaretRight size={16} />
      </button>
    </div>
  );
}

function CloseButton({ disabled, onClick }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={t("chat_window.agent_invocation.clarifying_close_aria")}
      className="border-none p-0 flex items-center justify-center text-white/70 light:text-slate-700 hover:text-white light:hover:text-slate-900 disabled:opacity-30 shrink-0"
    >
      <X size={16} />
    </button>
  );
}

/**
 * Survey header: current question text on the left, pagination chrome and a
 * close-and-skip button on the right. Pagination is hidden for single-question
 * surveys and after the user has responded.
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
  const showPagination = !isSingle && !responded;

  return (
    <div className="flex items-center gap-[18px] w-full">
      <QuestionText>{question}</QuestionText>
      {showPagination && (
        <PaginationControls
          index={index}
          total={total}
          onPrev={onPrev}
          onNext={onNext}
          isFirst={isFirst}
          isLast={isLast}
        />
      )}
      <CloseButton disabled={responded} onClick={onClose} />
    </div>
  );
}
