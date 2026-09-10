import { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

/**
 * `hasChanges` state that also saves the form once editing pauses or the
 * form unmounts, so navigating away does not drop a pending save.
 * @param {React.RefObject<HTMLFormElement>} formEl - form to validate before saving
 * @param {() => void} save - submits the form's current values
 * @returns {{ hasChanges: boolean, setHasChanges: (changed: boolean) => void }}
 */
export default function useAutosaveForm(formEl, save) {
  const [hasChanges, setHasChanges] = useState(false);
  const saveRef = useRef(save);
  const submitRef = useRef(null);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  // Layout cleanup runs while the form ref is still attached, so a pending
  // save can still run when the user leaves the page.
  useLayoutEffect(() => {
    const submit = debounce(() => {
      if (formEl.current?.reportValidity()) saveRef.current();
    }, 1000);
    submitRef.current = submit;
    return () => submit.flush();
  }, [formEl]);

  return {
    hasChanges,
    setHasChanges: (changed) => {
      setHasChanges(changed);
      if (changed) submitRef.current?.();
    },
  };
}
