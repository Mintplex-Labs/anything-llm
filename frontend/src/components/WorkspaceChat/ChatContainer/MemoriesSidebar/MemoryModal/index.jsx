import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalTextarea,
} from "@/components/lib/Modal";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onSubmit - Called with (content)
 * @param {string} [props.initialContent] - Pre-filled content for editing
 * @param {"create"|"edit"} [props.mode]
 */
export default function MemoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialContent = "",
  mode = "create",
}) {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialContent);
  const isCreate = mode === "create";
  const [title, submitLabel, description] = useMemo(() => {
    if (isCreate) {
      return [
        t("chat_window.memories.modal.create_title"),
        t("chat_window.memories.modal.create"),
        t("chat_window.memories.modal.create_description"),
      ];
    } else {
      return [
        t("chat_window.memories.modal.edit_title"),
        t("chat_window.memories.modal.save"),
        t("chat_window.memories.modal.edit_description"),
      ];
    }
  }, [isCreate, t]);

  useEffect(() => {
    if (isOpen) setContent(initialContent);
  }, [isOpen, initialContent]);

  function handleSubmit() {
    if (!content.trim()) return;
    onSubmit(content.trim());
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader title={title} subtitle={description} onClose={onClose} />
      <ModalBody>
        <ModalTextarea
          label={t("chat_window.memories.modal.label")}
          autoFocus
          onFocus={(e) => {
            const len = e.currentTarget.value.length;
            e.currentTarget.setSelectionRange(len, len);
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("chat_window.memories.modal.placeholder")}
          rows={4}
        />
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton type="button" onClick={onClose}>
          {t("chat_window.memories.modal.cancel")}
        </ModalSecondaryButton>
        <ModalPrimaryButton
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          {submitLabel}
        </ModalPrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
