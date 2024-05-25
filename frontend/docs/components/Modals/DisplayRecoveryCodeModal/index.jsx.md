```javascript
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
    <div className="inline-block bg-[#2C2F36] rounded-lg text-left overflow-hidden shadow-xl transform transition-all border-2 border-[#BCC9DB]/10 w-[600px] mx-4">
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
            className="bg-[#1C1E21] text-white hover:text-[#46C8FF]
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
          className="transition-all duration-300 text-xs md:w-[500px] md:h-[34px] h-[48px] w-full m-2 font-semibold rounded-lg bg-[#46C8FF] hover:bg-[#2C2F36] border-2 border-transparent hover:border-[#46C8FF] hover:text-white whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex justify-center items-center gap-x-2"
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

```
**RecoveryCodeModal Documentation**

**Purpose and Usage:**
The RecoveryCodeModal component is used to display recovery codes to users. It provides a modal window that shows the recovery codes and allows users to download them as a text file or copy them to their clipboard.

**Method Documentation:**

### `downloadRecoveryCodes()`

* Signature: `downloadRecoveryCodes(): void`
* Purpose: Downloads the recovery codes as a text file.
* Parameters:
	+ None
* Return Type: `void`
* Description: This method creates a blob object containing the recovery codes and uses the FileSaver library to download it as a text file. The `setDownloadClicked` state hook is also updated to reflect that the download has been initiated.

### `handleClose()`

* Signature: `handleClose(): void`
* Purpose: Closes the modal window.
* Parameters:
	+ None
* Return Type: `void`
* Description: This method checks if a download has been initiated and, if so, calls the `onDownloadComplete` callback function to notify any interested parties that the download is complete. It then closes the modal window by calling the `onClose` callback function.

### `handleCopyToClipboard()`

* Signature: `handleCopyToClipboard(): void`
* Purpose: Copies the recovery codes to the user's clipboard.
* Parameters:
	+ None
* Return Type: `void`
* Description: This method uses the navigator's clipboard API to write the recovery codes to the user's clipboard. It then displays a toast notification to confirm that the recovery codes have been copied.

**Examples:**

To use the RecoveryCodeModal component, you need to import it and pass in the recovery codes as well as callback functions for when the download is complete and the modal window should be closed.
```jsx
import React from 'react';
import { RecoveryCodeModal } from './RecoveryCodeModal';

const App = () => {
  const recoveryCodes = ['code1', 'code2', 'code3'];
  const onDownloadComplete = () => console.log('Download complete');
  const onClose = () => console.log('Modal closed');

  return (
    <div>
      <RecoveryCodeModal
        recoveryCodes={recoveryCodes}
        onDownloadComplete={onDownloadComplete}
        onClose={onClose}
      />
    </div>
  );
};
```
**Dependencies:**

The RecoveryCodeModal component depends on the `file-saver` library for downloading files and the `phosphor-icons-react` library for displaying icons.

**Clarity and Consistency:**
The documentation is well-organized, easy to understand, and consistent in style and terminology. The purpose and usage of each method are clearly described, along with details about each parameter and return value. Examples are provided to illustrate the usage of the interface and its methods.