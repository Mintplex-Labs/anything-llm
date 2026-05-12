/**
 * Free-form text/url/number/date/email/textarea input. The server's
 * normalizeQuestion has already constrained `inputType` to a known value
 * before sending, so we just trust it here and fall back to "text" if missing.
 */
export default function InputForm({ question, draft, onChange, onSubmit }) {
  const inputType = question.inputType || "text";
  const isTextarea = inputType === "textarea";
  const sharedClass =
    "w-full border border-solid border-zinc-700 light:border-slate-500 bg-zinc-800 light:bg-white text-white light:text-slate-900 placeholder:text-zinc-500 light:placeholder:text-slate-500 text-sm leading-5 rounded-lg focus:outline-white light:focus:outline-slate-400 outline-none px-[14px] py-[10px]";

  function handleKeyDown(e) {
    if (e.key === "Enter" && !isTextarea) {
      e.preventDefault();
      onSubmit?.();
    }
  }

  if (isTextarea) {
    return (
      <textarea
        autoFocus
        value={draft.value || ""}
        placeholder={question.placeholder || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${sharedClass} min-h-[128px] resize-y`}
      />
    );
  }

  return (
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
