import { createContext, useContext, useState } from "react";
import { isMobile } from "react-device-detect";
import { X } from "@phosphor-icons/react";
import {
  combineLikeSources,
  CitationDetailModal,
} from "../ChatHistory/Citation";
import MobileCitationModal from "./MobileCitationModal";
import SourceItem from "./SourceItem";

export const SourcesSidebarContext = createContext();

export function SourcesSidebarProvider({ children }) {
  const [openSources, setOpenSources] = useState(null);
  return (
    <SourcesSidebarContext.Provider value={{ openSources, setOpenSources }}>
      {children}
    </SourcesSidebarContext.Provider>
  );
}

export function useSourcesSidebar() {
  return useContext(SourcesSidebarContext);
}

export default function SourcesSidebar() {
  const { openSources, setOpenSources } = useSourcesSidebar();
  const [selectedSource, setSelectedSource] = useState(null);

  const isOpen = !!openSources;
  const combined = isOpen ? combineLikeSources(openSources) : [];

  if (isMobile) {
    return (
      <MobileCitationModal
        openSources={openSources}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        onClose={() => {
          setSelectedSource(null);
          setOpenSources(null);
        }}
      />
    );
  }

  return (
    <>
      <div
        className="h-full overflow-hidden transition-all duration-500 flex-shrink-0"
        style={{
          width: isOpen ? "350px" : "0px",
          marginLeft: isOpen ? "16px" : "0px",
        }}
      >
        <div className="w-[350px] h-full bg-zinc-900 light:bg-white light:border-2 light:border-slate-300 md:rounded-[16px] p-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-start justify-between">
            <p className="font-medium text-base leading-6 text-white light:text-slate-900">
              Sources
            </p>
            <button
              onClick={() => setOpenSources(null)}
              type="button"
              className="text-white/60 light:text-slate-400 hover:text-white light:hover:text-slate-900 transition-colors"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto no-scroll">
            {combined.map((source, idx) => (
              <SourceItem
                key={source.title || idx}
                source={source}
                onClick={() => setSelectedSource(source)}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedSource && (
        <CitationDetailModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </>
  );
}
