import { Warning } from "@phosphor-icons/react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalSecondaryButton,
  ModalDangerButton,
} from "@/components/lib/Modal";

export default function ChangeWarningModal({
  warningText = "",
  onClose,
  onConfirm,
}) {
  return (
    <div className="flex flex-col gap-y-5">
      <ModalHeader
        title={
          <span className="flex items-center gap-x-2 text-red-500">
            <Warning className="w-6 h-6 shrink-0" weight="fill" />
            WARNING - This action is irreversible
          </span>
        }
        onClose={onClose}
      />
      <ModalBody>
        <p className="text-zinc-300 light:text-slate-700">
          {warningText.split("\\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
          <br />
          <br />
          Are you sure you want to proceed?
        </p>
      </ModalBody>
      <ModalFooter className="justify-end">
        <ModalSecondaryButton onClick={onClose} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalDangerButton onClick={onConfirm} type="submit">
          Confirm
        </ModalDangerButton>
      </ModalFooter>
    </div>
  );
}
