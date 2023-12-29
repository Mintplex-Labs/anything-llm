import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect } from "react";
const TITLE = "LLM Preference";
const DESCRIPTION =
  "AnythingLLM can work with many LLM providers. This will be the service which handles chatting.";

import ChromaLogo from "@/media/vectordbs/chroma.png";
import VectorDBItem from "./VectorDBItem";

export default function LLMPreference({ setHeader, setForwardBtn }) {
  function handleForward() {
    console.log("Go forward");
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
  }, []);

  return (
    <div className="w-full border-slate-300/40 shadow border-2 rounded-lg p-4 text-white">
      <div className="relative flex items-center">
        <MagnifyingGlass
          size={16}
          weight="bold"
          className="absolute left-4 z-10 text-white"
        />
        <input
          type="text"
          placeholder="Chroma"
          className="bg-white/10 pl-10 rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
        />
      </div>
      <div className="mt-4 flex flex-col gap-y-4">
        <VectorDBItem image={ChromaLogo} title="Chroma" description="Chroma" />
        <VectorDBItem image={ChromaLogo} title="Chroma" description="Chroma" />
        <VectorDBItem image={ChromaLogo} title="Chroma" description="Chroma" />
      </div>
    </div>
  );
}
