import { useEffect, useState } from "react";

export default function useUnsavedChanges(initialState) {
  const [state, setState] = useState(initialState);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState(initialState);

  useEffect(() => {
    setState(initialState);
    setInitialSettings(initialState);
  }, [initialState]);

  const resetToInitialState = () => {
    setState(initialSettings);
    setUnsavedChanges(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  return {
    state,
    setState,
    unsavedChanges,
    setUnsavedChanges,
    resetToInitialState,
  };
}
