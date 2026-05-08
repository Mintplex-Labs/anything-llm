/**
 * Free-form text/url/number/date/email/textarea input. The server's
 * normalizeQuestion has already constrained `inputType` to a known value
 * before sending, so we just trust it here and fall back to "text" if missing.
 */
export default function InputForm({ question, draft, onChange, onSubmit }) {
  const inputType = question.inputType || "text";
  const isTextarea = inputType === "textarea";
  const sharedClass =
    "w-full border border-white/10 bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5";

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
        rows={3}
        value={draft.value || ""}
        placeholder={question.placeholder || ""}
        onChange={(e) => onChange(e.target.value)}
        className={sharedClass}
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
