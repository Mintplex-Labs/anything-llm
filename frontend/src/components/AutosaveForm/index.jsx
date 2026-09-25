import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const AutosaveFormContext = createContext();
const SAVED_INDICATOR_MS = 2000;

/**
 * Form that persists itself as the user edits: text fields save when they lose
 * focus, selects save on change, and custom controls call `markDirty` + `save`
 * from `useAutosaveForm`. An invalid input reverts to its last saved value; any
 * other invalid field blocks the save and shows the browser's validation message.
 * @param {(form: HTMLFormElement) => Promise<boolean>} props.onSave - persists the form, resolves true on success
 */
export default function AutosaveForm({ onSave, children, ...props }) {
  const formEl = useRef(null);
  const [dirtyFields, setDirtyFields] = useState([]);
  const [savedFields, setSavedFields] = useState([]);
  const [pending, setPending] = useState(false);
  // Last persisted value of each named <input>, used to revert invalid edits.
  const savedInputValues = useRef({});

  const markDirty = (name) =>
    setDirtyFields((fields) =>
      fields.includes(name) ? fields : [...fields, name]
    );
  const save = () => setPending(true);

  function revertInvalidInputs() {
    const reverted = [];
    for (const el of formEl.current.elements) {
      if (el.tagName !== "INPUT" || el.checkValidity()) continue;
      if (!(el.name in savedInputValues.current)) continue;
      el.value = savedInputValues.current[el.name];
      reverted.push(el.name);
    }
    return reverted;
  }

  function inputValues(fields) {
    const values = {};
    for (const name of fields) {
      const el = formEl.current.elements.namedItem(name);
      if (el?.tagName === "INPUT") values[name] = el.value;
    }
    return values;
  }

  // Saving runs after render so hidden inputs driven by state hold their new value.
  useEffect(() => {
    if (!pending) return;
    setPending(false);
    const reverted = revertInvalidInputs();
    const fields = dirtyFields.filter((f) => !reverted.includes(f));
    if (reverted.length)
      setDirtyFields((current) => current.filter((f) => !reverted.includes(f)));
    if (!fields.length || !formEl.current.reportValidity()) return;
    const sentValues = inputValues(fields);
    onSave(formEl.current).then((success) => {
      if (!success) return;
      Object.assign(savedInputValues.current, sentValues);
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
        onFocus={(e) => {
          const { tagName, name, value } = e.target;
          if (tagName !== "INPUT" || !name) return;
          if (!(name in savedInputValues.current))
            savedInputValues.current[name] = value;
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
