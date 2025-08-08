import { CircleNotch } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import pluralize from "pluralize";
import { numberWithCommas } from "@/utils/numbers";
import useUser from "@/hooks/useUser";
import { Link } from "react-router-dom";
import Paths from "@/utils/paths";
import Workspace from "@/models/workspace";

export default function FileUploadWarningModal({
  show,
  onClose,
  onContinue,
  onEmbed,
  tokenCount,
  maxTokens,
  fileCount = 1,
  isEmbedding = false,
  embedProgress = 0,
}) {
  const { user } = useUser();
  const canEmbed = !user || user.role !== "default";
  if (!show) return null;

  if (isEmbedding) {
    return (
      <ModalWrapper isOpen={show}>
        <div className="relative max-w-[600px] bg-theme-bg-primary rounded-lg shadow border border-theme-modal-border">
          <div className="p-6 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-semibold mb-4">
              Embedding {embedProgress + 1} of {fileCount}{" "}
              {pluralize("file", fileCount)}
            </p>
            <CircleNotch size={32} className="animate-spin text-white" />
            <p className="text-white/60 text-sm mt-2">
              Please wait while we embed your files...
            </p>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper isOpen={show}>
      <div className="relative max-w-[600px] bg-theme-bg-primary rounded-lg shadow border border-theme-modal-border">
        <div className="relative p-6 border-b border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Context Window Warning
            </h3>
          </div>
        </div>

        <div className="py-7 px-9 space-y-4">
          <p className="text-theme-text-primary text-sm">
            Your workspace is using {numberWithCommas(tokenCount)} of{" "}
            {numberWithCommas(maxTokens)} available tokens. We recommend keeping
            usage below {(Workspace.maxContextWindowLimit * 100).toFixed(0)}% to
            ensure the best chat experience. Adding {fileCount} more{" "}
            {pluralize("file", fileCount)} would exceed this limit.{" "}
            <Link
              target="_blank"
              to={Paths.documentation.contextWindows()}
              className="text-theme-text-secondary text-sm underline"
            >
              Learn more about context windows &rarr;
            </Link>
          </p>
          <p className="text-theme-text-primary text-sm">
            Choose how you would like to proceed with these uploads.
          </p>
        </div>

        <div className="flex w-full justify-between items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
          <button
            onClick={onClose}
            type="button"
            className="border-none transition-all duration-300 bg-theme-modal-border text-white hover:opacity-60 px-4 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
          <div className="flex w-full justify-end items-center space-x-2">
            <button
              onClick={onContinue}
              type="button"
              className="border-none transition-all duration-300 bg-theme-modal-border text-white hover:opacity-60 px-4 py-2 rounded-lg text-sm"
            >
              Continue Anyway
            </button>
            {canEmbed && (
              <button
                onClick={onEmbed}
                disabled={isEmbedding || !canEmbed}
                type="button"
                className="border-none transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                Embed {pluralize("File", fileCount)}
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
