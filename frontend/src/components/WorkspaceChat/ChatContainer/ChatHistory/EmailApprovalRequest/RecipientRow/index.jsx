import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

/**
 * Splits a comma-separated recipient string into individual addresses.
 * @param {string} [value]
 * @returns {string[]}
 */
export function splitRecipients(value = "") {
  return String(value)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

/**
 * One recipient line (To/Cc/Bcc) of the email approval card: removable address
 * chips plus, while editing, an inline input to add more.
 * @param {string} props.label
 * @param {string[]} props.recipients
 * @param {(recipients: string[]) => void} props.onChange
 * @param {boolean} props.editing
 * @param {boolean} [props.readOnly] - Recipients are fixed (e.g. a reply), so chips cannot be removed
 * @param {React.ReactNode} [props.trailing] - Rendered at the row's right edge
 */
export default function RecipientRow({
  label,
  recipients,
  onChange,
  editing,
  readOnly = false,
  trailing = null,
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  function commit() {
    const added = splitRecipients(value).filter(
      (email) => !recipients.includes(email)
    );
    if (added.length) onChange([...recipients, ...added]);
    setValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
      return;
    }
    if (e.key === "Backspace" && !value && recipients.length)
      onChange(recipients.slice(0, -1));
  }

  return (
    <div className="flex items-start justify-between gap-2.5 w-full pb-2 border-b border-zinc-700 light:border-slate-200">
      <div className="flex flex-wrap items-center gap-2.5 min-w-0">
        <span className="text-sm leading-5 text-zinc-400 light:text-slate-600 shrink-0">
          {label}
        </span>
        {recipients.map((email) => (
          <RecipientChip
            key={email}
            email={email}
            onRemove={
              readOnly
                ? null
                : () =>
                    onChange(
                      recipients.filter((recipient) => recipient !== email)
                    )
            }
          />
        ))}
        {editing && (
          <input
            type="email"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            placeholder={t("chat_window.agent_invocation.email.add_recipient")}
            className="flex-1 min-w-[160px] bg-transparent border-none outline-none p-0 text-sm leading-5 text-white light:text-slate-950 placeholder:text-zinc-500 light:placeholder:text-slate-400"
          />
        )}
      </div>
      {trailing}
    </div>
  );
}

function RecipientChip({ email, onRemove }) {
  const { t } = useTranslation();
  return (
    <span className="flex items-center gap-1.5 max-w-full rounded-full px-3 py-1 bg-zinc-700 light:bg-slate-100">
      <span className="text-sm leading-5 text-zinc-300 light:text-slate-800 truncate">
        {email}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("chat_window.agent_invocation.email.remove_recipient", {
            email,
          })}
          className="border-none bg-transparent p-0 flex items-center text-zinc-300 light:text-slate-800 hover:text-white light:hover:text-slate-950"
        >
          <X size={12} weight="bold" />
        </button>
      )}
    </span>
  );
}
