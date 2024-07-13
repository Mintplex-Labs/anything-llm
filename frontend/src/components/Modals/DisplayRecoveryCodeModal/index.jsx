import showToast from "@/utils/toast";
import { DownloadSimple, Key } from "@phosphor-icons/react";
import { saveAs } from "file-saver";
import { useState } from "react";

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
    <div className="inline-block bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all border-2 border-[#BCC9DB]/10 w-[600px] mx-4">
      <div className="md:py-[35px] md:px-[50px] py-[28px] px-[20px]">
        <div className="flex gap-x-2">
          <Key size={24} className="text-white" weight="bold" />
          <h3
            className="text-lg leading-6 font-medium text-white"
            id="modal-headline"
          >
            Recovery Codes
          </h3>
        </div>
        <div className="mt-4">
          <p className="text-sm text-white flex flex-col">
            In order to reset your password in the future, you will need these
            recovery codes. Download or copy your recovery codes to save them.{" "}
            <br />
            <b className="mt-4">These recovery codes are only shown once!</b>
          </p>
          <div
            className="bg-dark-highlight text-white hover:text-primary-button
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
      </div>
      <div className="flex w-full justify-center items-center p-3 space-x-2 rounded-b border-gray-500/50 -mt-4 mb-4">
        <button
          type="button"
          className="transition-all duration-300 text-xs md:w-[500px] md:h-[34px] h-[48px] w-full m-2 font-semibold rounded-lg bg-primary-button hover:bg-secondary border-2 border-transparent hover:border-primary-button hover:text-white whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex justify-center items-center gap-x-2"
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
  );
}
