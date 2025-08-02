import { X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";

export default function FileUploadWarningModal({
  show,
  onClose,
  onContinue,
  onEmbed,
  tokenCount,
  maxTokens,
  fileCount = 1,
}) {
  if (!show) return null;

  return (
    <ModalWrapper isOpen={show}>
      <div className="relative max-w-[600px] bg-theme-bg-primary rounded-lg shadow border border-theme-modal-border">
        <div className="relative p-6 border-b border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {fileCount === 1 ? "File" : "Files"} exceed
              {fileCount === 1 ? "s" : ""} context window
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
            >
              <X size={18} weight="bold" className="text-white" />
            </button>
          </div>
        </div>

        <div className="py-7 px-9 space-y-4">
          <p className="text-white text-sm">
            This document exceeds 80% of your context window ({tokenCount} &gt;{" "}
            {maxTokens} tokens). Choose how you would like to proceed:
          </p>
        </div>

        <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
          <button
            onClick={onClose}
            type="button"
            className="transition-all duration-300 bg-theme-modal-border text-white hover:opacity-60 px-4 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            type="button"
            className="transition-all duration-300 bg-theme-modal-border text-white hover:opacity-60 px-4 py-2 rounded-lg text-sm"
          >
            Continue Anyway
          </button>
          <button
            onClick={onEmbed}
            type="button"
            className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
          >
            Embed {fileCount === 1 ? "File" : "Files"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
