import showToast from "@/utils/toast";
import { DownloadSimple, Key } from "@phosphor-icons/react";
import { saveAs } from "file-saver";
import { useState } from "react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
} from "@/components/lib/Modal";

export default function RecoveryCodeModal({
  recoveryCodes,
  onDownloadComplete,
  onClose,
}) {
  const [downloadClicked, setDownloadClicked] = useState(false);

  const downloadRecoveryCodes = () => {
    const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    saveAs(blob, "recovery_codes.txt");
    setDownloadClicked(true);
  };

  const handleClose = () => {
    if (downloadClicked) {
      onDownloadComplete();
      onClose();
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(recoveryCodes.join(",\n")).then(() => {
      showToast("Recovery codes copied to clipboard", "success", {
        clear: true,
      });
    });
  };

  return (
    <div className="flex flex-col gap-y-5">
      <ModalHeader
        title={
          <span className="flex items-center gap-x-2">
            <Key size={20} weight="bold" />
            Recovery Codes
          </span>
        }
      />
      <ModalBody>
        <p className="text-sm text-zinc-300 light:text-slate-700 flex flex-col">
          In order to reset your password in the future, you will need these
          recovery codes. Download or copy your recovery codes to save them.{" "}
          <br />
          <b className="mt-4">These recovery codes are only shown once!</b>
        </p>
        <div
          className="border-none bg-zinc-800 light:bg-white text-zinc-100 light:text-slate-900 hover:opacity-80 flex items-center justify-center rounded-lg cursor-pointer"
          onClick={handleCopyToClipboard}
        >
          <ul className="space-y-2 md:p-6 p-4">
            {recoveryCodes.map((code, index) => (
              <li key={index} className="md:text-sm text-xs">
                {code}
              </li>
            ))}
          </ul>
        </div>
      </ModalBody>
      <ModalFooter className="justify-end">
        <ModalPrimaryButton
          type="button"
          onClick={downloadClicked ? handleClose : downloadRecoveryCodes}
        >
          {downloadClicked ? (
            "Close"
          ) : (
            <span className="flex items-center gap-x-2">
              <DownloadSimple weight="bold" size={18} />
              Download
            </span>
          )}
        </ModalPrimaryButton>
      </ModalFooter>
    </div>
  );
}
