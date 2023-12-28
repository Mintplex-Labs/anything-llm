import { useEffect } from "react";
const TITLE = "LLM Preference";
const DESCRIPTION =
  "AnythingLLM can work with many LLM providers. This will be the service which handles chatting.";

export default function LLMPreference({ setHeader, setForwardBtn }) {
  function handleForward() {
    console.log("Go forward");
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
  }, []);

  return <div className="w-full border border-zinc-300 rounded-lg p-4"></div>;
}
