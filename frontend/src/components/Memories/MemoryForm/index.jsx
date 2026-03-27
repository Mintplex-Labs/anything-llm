import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Shared form for creating and editing memories.
 * @param {Object} props
 * @param {string} [props.initialContent] - Pre-filled content for editing
 * @param {string} [props.placeholder] - Textarea placeholder
 * @param {string} [props.submitLabel] - Submit button label
 * @param {function} props.onSubmit - Called with (content) on submit
 * @param {function} props.onCancel - Called when cancel is clicked
 */
export default function MemoryForm({
  initialContent = "",
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialContent);

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-3 rounded-lg bg-theme-settings-input-bg p-4"
    >
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder || t("personalization.form.placeholder")}
        rows={2}
        className="w-full border-none bg-theme-bg-secondary placeholder:text-theme-settings-input-placeholder text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block p-2.5 resize-none"
      />
      <div className="flex justify-end gap-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/10 text-theme-text-secondary hover:text-white py-1.5 px-3 text-xs"
        >
          {t("personalization.form.cancel")}
        </button>
        <button
          type="submit"
          disabled={!content.trim()}
          className="enabled:hover:bg-secondary enabled:hover:text-white rounded-lg bg-primary-button py-1.5 px-3 text-xs font-semibold disabled:opacity-20 disabled:cursor-not-allowed"
        >
          {submitLabel || t("personalization.form.save")}
        </button>
      </div>
    </form>
  );
}
