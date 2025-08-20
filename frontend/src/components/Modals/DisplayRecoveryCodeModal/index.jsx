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
    <ModalWrapper isOpen={true} onClose={handleClose}>
      <div className="onenew-card p-5 shadow-2xl max-w-lg w-[90vw]">
        <div className="flex gap-x-2 items-center mb-5">
          <Key size={24} className="text-foreground" weight="bold" />
          <h3 className="text-xl font-semibold text-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
            Recovery Codes
          </h3>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="space-y-2 flex-col">
            <p className="text-sm text-foreground flex flex-col">
              In order to reset your password in the future, you will need these
              recovery codes. Download or copy your recovery codes to save them{" "}
              <br />
              <b className="mt-4">These recovery codes are only shown once!</b>
            </p>
            <div
              className="border-none bg-theme-settings-input-bg text-foreground hover:text-primary-button flex items-center justify-center rounded-md mt-6 cursor-pointer"
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
          <div className="flex w-full justify-end items-center mt-6">
            <button
              type="button"
              className="onenew-btn flex items-center gap-x-2"
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
