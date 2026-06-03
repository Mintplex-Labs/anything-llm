import { useState, useEffect } from "react";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalDangerButton,
  ModalInput,
  ModalTextarea,
} from "@/components/lib/Modal";
import { CMD_REGEX } from "./constants";

export default function EditPresetModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  preset,
}) {
  const [command, setCommand] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (preset && isOpen) {
      setCommand(preset.command?.slice(1) || "");
    }
  }, [preset, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const sanitizedCommand = command.replace(CMD_REGEX, "");
    onSave({
      id: preset.id,
      command: `/${sanitizedCommand}`,
      prompt: form.get("prompt"),
      description: form.get("description"),
    });
  };

  const handleCommandChange = (e) => {
    const value = e.target.value.replace(CMD_REGEX, "");
    setCommand(value);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this preset?")) return;

    setDeleting(true);
    await onDelete(preset.id);
    setDeleting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
        <ModalHeader title="Edit Preset" onClose={onClose} />
        <ModalBody>
          <ModalInput
            label="Command"
            name="command"
            id="command"
            leading="/"
            placeholder="your-command"
            value={command}
            onChange={handleCommandChange}
            required={true}
          />
          <ModalTextarea
            label="Prompt"
            name="prompt"
            id="prompt"
            placeholder="This is a test prompt. Please respond with a poem about LLMs."
            defaultValue={preset.prompt}
            required={true}
          />
          <ModalInput
            label="Description"
            name="description"
            id="description"
            defaultValue={preset.description}
            placeholder="Responds with a poem about LLMs."
            required={true}
          />
        </ModalBody>
        <ModalFooter>
          <ModalDangerButton
            disabled={deleting}
            onClick={handleDelete}
            type="button"
          >
            {deleting ? "Deleting..." : "Delete Preset"}
          </ModalDangerButton>
          <div className="flex gap-x-2">
            <ModalSecondaryButton onClick={onClose} type="button">
              Cancel
            </ModalSecondaryButton>
            <ModalPrimaryButton type="submit">Save</ModalPrimaryButton>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
