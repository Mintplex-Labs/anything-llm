import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";
import EmbeddingFileRow from "@/components/EmbeddingFileRow";
import { useEmbeddingProgress } from "@/EmbeddingProgressContext";

export default function EmbeddingProgressModal({
  show,
  onClose,
  workspaceSlug,
}) {
  const { embeddingProgressMap, removeQueuedFile } = useEmbeddingProgress();
  const embeddingProgress = embeddingProgressMap[workspaceSlug];
  if (!show || !embeddingProgress) return null;

  return (
    <Modal isOpen={show} onClose={onClose} size="lg">
      <ModalHeader
        title="Embedding files"
        subtitle="You can close this window, embedding will continue in the background."
        onClose={onClose}
      />
      <ModalBody>
        <div className="max-h-[300px] overflow-y-auto">
          {Object.entries(embeddingProgress).map(([filename, fileStatus]) => (
            <EmbeddingFileRow
              key={filename}
              filename={filename}
              status={fileStatus}
              onRemove={
                fileStatus.status === "pending"
                  ? () => removeQueuedFile(workspaceSlug, filename)
                  : null
              }
            />
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
}
