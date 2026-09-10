import { useMemo, useState } from "react";
import debounce from "lodash.debounce";

/**
 * `hasChanges` state that also submits the form once editing pauses.
 * @param {React.RefObject<HTMLFormElement>} formEl - form to submit
 * @param {number} [wait=1000] - ms of inactivity before submitting
 * @returns {{ hasChanges: boolean, setHasChanges: (changed: boolean) => void }}
 */
export default function useAutosaveForm(formEl, wait = 1000) {
  const [hasChanges, setHasChanges] = useState(false);
  const submit = useMemo(
    () => debounce(() => formEl.current?.requestSubmit(), wait),
    [formEl, wait]
  );

  return {
    hasChanges,
    setHasChanges: (changed) => {
      setHasChanges(changed);
      if (changed) submit();
    },
  };
}
