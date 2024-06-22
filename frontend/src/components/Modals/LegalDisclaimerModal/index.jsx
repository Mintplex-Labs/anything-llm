import showToast from "@/utils/toast";
import { useEffect, useState } from "react";

export default function LegalDisclaimerModal(
  { onClose, }
) {
  const [modalText, setModalText] = useState('');

  const showLegalDisclaimer = () => {
    // Load the modal text from the file
    fetch('/public/legal_disclaimer.txt')
      .then(response => response.text())
      .then(text => setModalText(text))
      .catch(error => console.error('Error fetching legal disclaimer text:', error));
  };

  useEffect(() => {
    showLegalDisclaimer();
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="inline-block bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all border-2 border-[#BCC9DB]/10 w-[600px] mx-8">
      <div className="md:py-[35px] md:px-[50px] py-[28px] px-[20px]">
        <div className="flex gap-x-2">
          <h3
            className="text-lg leading-6 font-medium text-white"
            id="modal-headline"
          >
            Correctness Info
          </h3>
        </div>
        <div className="mt-8 max-h-[400px] overflow-y-auto">
          <div
            className="bg-dark-highlight text-white 
                 flex items-center justify-center rounded-md mt-6"
          >
            <p className="text-sm text-white whitespace-pre-wrap
                      font-size: 0.8rem  line-height: 1.5 letter-spacing: 1.5px">{modalText}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center p-3 space-x-2 rounded-b border-gray-500/50 -mt-4 mb-4">
        <button
          type="button"
          className="transition-none duration-300 text-xs md:w-[500px] md:h-[34px] h-[48px] w-full m-2 font-semibold rounded-lg bg-primary-button hover:bg-secondary border-2 border-transparent hover:border-[#46C8FF] hover:text-white whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex justify-center items-center gap-x-2"
          onClick={handleClose}
        >
          <>
            <p>I  Understand</p>
          </>
        </button>
      </div>
    </div>
  );
}
