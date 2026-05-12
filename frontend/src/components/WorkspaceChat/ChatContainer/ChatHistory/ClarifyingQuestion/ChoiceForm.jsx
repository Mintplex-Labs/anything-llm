import { PencilSimple } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

/**
 * Numbered-card choice list. Supports single-select (click auto-advances via
 * onAutoAdvance) and multi-select (clicks toggle selection, parent owns the
 * submit step). An "Other" row reveals a free-text input when activated;
 * its value is merged into the answer at submit time by `answerForDraft`.
 *
 * When the question allows skipping, the Skip button renders inline next to
 * the Other row instead of in the Footer.
 */
export default function ChoiceForm({
  question,
  draft,
  onChange,
  onAutoAdvance,
  allowSkip,
  onSkip,
}) {
  const { t } = useTranslation();
  const showOther = question.allowOther !== false;

  function isChecked(opt) {
    if (question.multiSelect)
      return Array.isArray(draft.selected) && draft.selected.includes(opt);
    return draft.selected === opt;
  }

  function handleSelect(opt) {
    if (question.multiSelect) {
      const list = Array.isArray(draft.selected) ? draft.selected : [];
      const next = list.includes(opt)
        ? list.filter((o) => o !== opt)
        : [...list, opt];
      onChange({ selected: next, otherSelected: false });
      return;
    }
    onChange({ selected: opt, otherSelected: false });
    onAutoAdvance?.();
  }

  function handleOtherToggle() {
    if (question.multiSelect) {
      onChange({ otherSelected: !draft.otherSelected });
      return;
    }
    onChange({ selected: null, otherSelected: !draft.otherSelected });
  }

  return (
    <div className="flex flex-col w-full">
      {question.options.map((opt, idx) => {
        const selected = isChecked(opt);
        return (
          <button
            key={`${opt}-${idx}`}
            type="button"
            aria-pressed={selected}
            onClick={() => handleSelect(opt)}
            className={`border-none w-full flex items-center gap-[9px] p-2 rounded-lg text-left transition-colors ${
              selected
                ? "bg-zinc-800 light:bg-slate-200"
                : "bg-transparent hover:bg-zinc-800/60 light:hover:bg-slate-200/60"
            }`}
          >
            <span className="flex items-center justify-center shrink-0 w-7 h-7 rounded-lg bg-zinc-700 light:bg-slate-300 text-white light:text-slate-900 text-base font-medium leading-6">
              {idx + 1}
            </span>
            <span className="flex flex-col min-w-0">
              <span className="text-white light:text-slate-900 text-sm leading-5">
                {opt}
              </span>
              {question.optionDescriptions?.[idx] && (
                <span className="text-xs text-zinc-400 light:text-slate-500 leading-4">
                  {question.optionDescriptions[idx]}
                </span>
              )}
            </span>
          </button>
        );
      })}

      {showOther && (
        <div className="flex items-center w-full">
          <button
            type="button"
            aria-pressed={!!draft.otherSelected}
            onClick={handleOtherToggle}
            className={`border-none flex flex-1 min-w-0 items-center gap-[9px] p-2 rounded-lg text-left transition-colors ${
              draft.otherSelected
                ? "bg-zinc-800 light:bg-slate-200"
                : "bg-transparent hover:bg-zinc-800/60 light:hover:bg-slate-200/60"
            }`}
          >
            <span className="flex items-center justify-center shrink-0 w-7 h-7 rounded-lg bg-zinc-700 light:bg-slate-300 text-white light:text-slate-900">
              <PencilSimple size={16} />
            </span>
            <span
              className={`text-sm leading-5 ${
                draft.otherSelected
                  ? "text-white light:text-slate-900"
                  : "text-zinc-400 light:text-slate-600"
              }`}
            >
              {t("chat_window.agent_invocation.clarifying_other")}
            </span>
          </button>

          {allowSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="border border-solid border-zinc-600 light:border-slate-300 bg-transparent rounded-lg h-7 px-3 flex items-center justify-center text-white light:text-slate-900 text-xs font-medium leading-4 shrink-0 hover:bg-zinc-700/40 light:hover:bg-slate-200/60"
            >
              {t("chat_window.agent_invocation.batch_skip_this")}
            </button>
          )}
        </div>
      )}

      {showOther && draft.otherSelected && (
        <input
          autoFocus
          type="text"
          value={draft.otherText || ""}
          onChange={(e) => onChange({ otherText: e.target.value })}
          placeholder={t(
            "chat_window.agent_invocation.clarifying_other_placeholder"
          )}
          className="mt-2 w-full border border-solid border-zinc-700 light:border-slate-500 bg-zinc-800 light:bg-white text-white light:text-slate-900 placeholder:text-zinc-500 light:placeholder:text-slate-500 text-sm rounded-lg focus:outline-white light:focus:outline-slate-400 outline-none p-2"
        />
      )}
    </div>
  );
}
