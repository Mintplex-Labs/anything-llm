import { CircleNotch } from "@phosphor-icons/react";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/lib/Modal";
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
      <Modal isOpen={show} onClose={onClose} size="lg">
        <div className="flex flex-col items-center justify-center">
          <p className="text-slate-50 light:text-slate-900 text-lg font-semibold mb-4">
            Embedding {embedProgress + 1} of {fileCount}{" "}
            {pluralize("file", fileCount)}
          </p>
          <CircleNotch
            size={32}
            className="animate-spin text-slate-50 light:text-slate-900"
          />
          <p className="text-zinc-400 light:text-slate-600 text-sm mt-2">
            Please wait while we embed your files...
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={show} onClose={onClose} size="lg">
      <ModalHeader title="Context Window Warning" onClose={onClose} />
      <ModalBody>
        <p className="text-zinc-300 light:text-slate-700 text-sm">
          Your workspace is using {numberWithCommas(tokenCount)} of{" "}
          {numberWithCommas(maxTokens)} available tokens. We recommend keeping
          usage below {(Workspace.maxContextWindowLimit * 100).toFixed(0)}% to
          ensure the best chat experience. Adding {fileCount} more{" "}
          {pluralize("file", fileCount)} would exceed this limit.{" "}
          <Link
            target="_blank"
            to={Paths.documentation.contextWindows()}
            className="text-zinc-400 light:text-slate-500 text-sm underline"
          >
            Learn more about context windows &rarr;
          </Link>
        </p>
        <p className="text-zinc-300 light:text-slate-700 text-sm">
          Choose how you would like to proceed with these uploads.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={onClose} type="button">
          Cancel
        </ModalSecondaryButton>
        <div className="flex items-center gap-x-2">
          <ModalSecondaryButton onClick={onContinue} type="button">
            Continue Anyway
          </ModalSecondaryButton>
          {canEmbed && (
            <ModalPrimaryButton
              onClick={onEmbed}
              disabled={isEmbedding || !canEmbed}
              type="button"
            >
              Embed {pluralize("File", fileCount)}
            </ModalPrimaryButton>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}
