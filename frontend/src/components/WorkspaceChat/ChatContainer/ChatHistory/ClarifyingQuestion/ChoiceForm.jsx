import { useTranslation } from "react-i18next";

/**
 * Radio (single-select) or checkbox (multiSelect) list, with an optional
 * "Other" entry that, when checked, reveals a free-text input. The "Other"
 * value is merged into the answer at submit time by `answerForDraft`.
 */
export default function ChoiceForm({ question, draft, onChange }) {
  const { t } = useTranslation();

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
    if (question.multiSelect)
      return Array.isArray(draft.selected) && draft.selected.includes(opt);
    return draft.selected === opt;
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
              <span>{t("chat_window.agent_invocation.clarifying_other")}</span>
              {draft.otherSelected && (
                <input
                  autoFocus
                  type="text"
                  value={draft.otherText || ""}
                  onChange={(e) => onChange({ otherText: e.target.value })}
                  placeholder={t(
                    "chat_window.agent_invocation.clarifying_other_placeholder"
                  )}
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
