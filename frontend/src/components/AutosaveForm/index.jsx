import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const AutosaveFormContext = createContext();
const SAVED_INDICATOR_MS = 2000;

/**
 * Form that persists itself as the user edits: text fields save when they lose
 * focus, selects save on change, and custom controls call `markDirty` + `save`
 * from `useAutosaveForm`. Saves are skipped while the form is invalid.
 * @param {(form: HTMLFormElement) => Promise<boolean>} props.onSave - persists the form, resolves true on success
 */
export default function AutosaveForm({ onSave, children, ...props }) {
  const formEl = useRef(null);
  const [dirtyFields, setDirtyFields] = useState([]);
  const [savedFields, setSavedFields] = useState([]);
  const [pending, setPending] = useState(false);

  const markDirty = (name) =>
    setDirtyFields((fields) =>
      fields.includes(name) ? fields : [...fields, name]
    );
  const save = () => setPending(true);

  // Saving runs after render so hidden inputs driven by state hold their new value.
  useEffect(() => {
    if (!pending) return;
    setPending(false);
    if (!dirtyFields.length || !formEl.current.reportValidity()) return;
    const fields = dirtyFields;
    onSave(formEl.current).then((success) => {
      if (!success) return;
      setSavedFields(fields);
      setDirtyFields((current) => current.filter((f) => !fields.includes(f)));
    });
  }, [pending]);

  useEffect(() => {
    if (!savedFields.length) return;
    const timer = setTimeout(() => setSavedFields([]), SAVED_INDICATOR_MS);
    return () => clearTimeout(timer);
  }, [savedFields]);

  return (
    <AutosaveFormContext.Provider
      value={{
        markDirty,
        save,
        savedFields,
        hasChanges: dirtyFields.length > 0,
      }}
    >
      <form
        ref={formEl}
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        onChange={(e) => {
          markDirty(e.target.name);
          if (e.target.tagName === "SELECT") save();
        }}
        onBlur={(e) => {
          if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) save();
        }}
        {...props}
      >
        {children}
      </form>
    </AutosaveFormContext.Provider>
  );
}

export function useAutosaveForm() {
  return useContext(AutosaveFormContext);
}

/**
 * Briefly shows "Saved" after the named field is persisted. Place inside the field's label.
 * @param {string} props.name - form field name
 */
export function SavedIndicator({ name }) {
  const { t } = useTranslation();
  const { savedFields } = useAutosaveForm();
  if (!savedFields.includes(name)) return null;
  return (
    <span className="ml-2 inline-flex items-center gap-x-1 text-xs font-normal text-green-400 light:text-green-600">
      <Check size={12} weight="bold" />
      {t("common.saved")}
    </span>
  );
}
