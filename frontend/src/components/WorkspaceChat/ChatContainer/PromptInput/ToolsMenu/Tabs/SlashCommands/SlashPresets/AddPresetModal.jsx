import { useState } from "react";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalInput,
  ModalTextarea,
} from "@/components/lib/Modal";
import { CMD_REGEX } from "./constants";
import { useTranslation } from "react-i18next";

export default function AddPresetModal({ isOpen, onClose, onSave }) {
  const [command, setCommand] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const sanitizedCommand = command.replace(CMD_REGEX, "");
    const saved = await onSave({
      command: `/${sanitizedCommand}`,
      prompt: form.get("prompt"),
      description: form.get("description"),
    });
    if (saved) setCommand("");
  };

  const handleCommandChange = (e) => {
    const value = e.target.value.replace(CMD_REGEX, "");
    setCommand(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
        <ModalHeader
          title={t("chat_window.add_new_preset")}
          onClose={onClose}
        />
        <ModalBody>
          <ModalInput
            label={t("chat_window.command")}
            name="command"
            id="command"
            leading="/"
            placeholder={t("chat_window.your_command")}
            value={command}
            onChange={handleCommandChange}
            maxLength={25}
            autoComplete="off"
            required={true}
          />
          <ModalTextarea
            label="Prompt"
            name="prompt"
            id="prompt"
            autoComplete="off"
            placeholder={t("chat_window.placeholder_prompt")}
            required={true}
          />
          <ModalInput
            label={t("chat_window.description")}
            name="description"
            id="description"
            placeholder={t("chat_window.placeholder_description")}
            maxLength={80}
            autoComplete="off"
            required={true}
          />
        </ModalBody>
        <ModalFooter>
          <ModalSecondaryButton onClick={onClose} type="button">
            {t("chat_window.cancel")}
          </ModalSecondaryButton>
          <ModalPrimaryButton type="submit">
            {t("chat_window.save")}
          </ModalPrimaryButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}
