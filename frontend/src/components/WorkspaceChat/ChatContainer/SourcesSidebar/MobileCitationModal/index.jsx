import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ModalWrapper from "@/components/ModalWrapper";
import { combineLikeSources } from "../../ChatHistory/Citation";
import SourceDetailView from "./SourceDetailView";
import SourceItem from "../SourceItem";

export default function MobileCitationModal({
  sources: rawSources,
  isOpen,
  selectedSource,
  setSelectedSource,
  onClose,
}) {
  const sources = combineLikeSources(rawSources);
  const { t } = useTranslation();

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-[calc(100%-40px)] max-h-[70vh] rounded-[16px] bg-zinc-800 light:bg-white light:border-2 light:border-slate-300 p-4 flex flex-col gap-4">
        {selectedSource ? (
          <SourceDetailView
            source={selectedSource}
            onBack={() => setSelectedSource(null)}
            onClose={onClose}
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-base leading-6 text-white light:text-slate-900">
                {t("chat_window.sources")}
              </p>
              <button
                onClick={onClose}
                type="button"
                className="text-white/60 light:text-slate-400 hover:text-white light:hover:text-slate-900 transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto no-scroll">
              {sources.map((source, idx) => (
                <SourceItem
                  key={source.title || idx}
                  source={source}
                  onClick={() => setSelectedSource(source)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </ModalWrapper>
  );
}
