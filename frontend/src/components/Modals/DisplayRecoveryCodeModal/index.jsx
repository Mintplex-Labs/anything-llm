import showToast from "@/utils/toast";
import { DownloadSimple, Key } from "@phosphor-icons/react";
import { saveAs } from "file-saver";
import { useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";

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
    <ModalWrapper isOpen={true}>
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <Key size={24} className="text-white" weight="bold" />
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Recovery Codes
            </h3>
          </div>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="py-7 px-9 space-y-2 flex-col">
            <p className="text-sm text-white flex flex-col">
              In order to reset your password in the future, you will need these
              recovery codes. Download or copy your recovery codes to save them.{" "}
              <br />
              <b className="mt-4">These recovery codes are only shown once!</b>
            </p>
            <div
              className="border-none bg-theme-settings-input-bg text-white hover:text-primary-button
                   flex items-center justify-center rounded-md mt-6 cursor-pointer"
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
          </div>
          <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
            <button
              type="button"
              className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm flex items-center gap-x-2"
              onClick={downloadClicked ? handleClose : downloadRecoveryCodes}
            >
              {downloadClicked ? (
                "Close"
              ) : (
                <>
                  <DownloadSimple weight="bold" size={18} />
                  <p>Download</p>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
