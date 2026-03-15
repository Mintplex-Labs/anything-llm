import { createContext, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { X } from "@phosphor-icons/react";
import {
  combineLikeSources,
  CitationDetailModal,
} from "../ChatHistory/Citation";
import MobileCitationModal from "./MobileCitationModal";
import SourceItem from "./SourceItem";

export const SourcesSidebarContext = createContext();

export function SourcesSidebarProvider({
  children,
  workspaceSlug = null,
  threadSlug = null,
}) {
  const [sources, setSources] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCitationId, setActiveCitationId] = useState(null);

  function openSidebar(newSources, citationId = null) {
    setSources(newSources);
    setActiveCitationId(citationId);
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
    setActiveCitationId(null);
  }

  return (
    <SourcesSidebarContext.Provider
      value={{
        sources,
        sidebarOpen,
        activeCitationId,
        workspaceSlug,
        threadSlug,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SourcesSidebarContext.Provider>
  );
}

export function useSourcesSidebar() {
  return useContext(SourcesSidebarContext);
}

export default function SourcesSidebar() {
  const { sources, sidebarOpen, closeSidebar, workspaceSlug, threadSlug } =
    useSourcesSidebar();
  const { t } = useTranslation();
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    setSelectedSource(null);
  }, [sources, sidebarOpen]);

  const combined = combineLikeSources(sources);

  if (isMobile) {
    return (
      <MobileCitationModal
        sources={sources}
        isOpen={sidebarOpen}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        workspaceSlug={workspaceSlug}
        threadSlug={threadSlug}
        onClose={() => {
          setSelectedSource(null);
          closeSidebar();
        }}
      />
    );
  }

  return (
    <>
      <div
        className="h-full overflow-hidden transition-all duration-500 flex-shrink-0"
        style={{ width: sidebarOpen ? "366px" : "0px" }}
      >
        <div
          className="ml-4 w-[350px] bg-zinc-900 light:bg-white light:border-2 light:border-slate-300 md:rounded-[16px] p-4 flex flex-col gap-4 overflow-hidden mt-[72px]"
          style={{ maxHeight: "calc(100% - 88px)" }}
        >
          <div className="flex items-start justify-between">
            <p className="font-medium text-base leading-6 text-white light:text-slate-900">
              {t("chat_window.sources")}
            </p>
            <button
              onClick={closeSidebar}
              type="button"
              className="text-white/60 light:text-[rgba(7,16,55,0.40)] hover:text-white light:hover:text-slate-900 transition-colors"
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
          workspaceSlug={workspaceSlug}
          threadSlug={threadSlug}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </>
  );
}
