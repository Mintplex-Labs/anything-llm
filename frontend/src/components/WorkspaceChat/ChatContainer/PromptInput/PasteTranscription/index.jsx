import { useState } from "react";
import { TextAlignLeft, X } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import ModalWrapper from "@/components/ModalWrapper";

/**
 * PasteTranscription component allows users to paste meeting transcription text
 * directly instead of using the microphone for speech-to-text.
 * @param {Object} props - The component props
 * @param {(command: {text: string, autoSubmit?: boolean, writeMode?: string}) => void} props.sendCommand - The function to send the command
 * @returns {React.ReactElement} The PasteTranscription component
 */
export default function PasteTranscription({ sendCommand }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleSubmit(transcription) {
    if (!transcription?.trim()) return;
    sendCommand({
      text: transcription,
      writeMode: "replace",
    });
    handleClose();
  }

  return (
    <>
      <div
        data-tooltip-id="tooltip-paste-transcription-btn"
        data-tooltip-content={t("chat_window.paste_transcription")}
        aria-label={t("chat_window.paste_transcription")}
        onClick={handleOpen}
        className="border-none relative flex justify-center items-center opacity-60 hover:opacity-100 light:opacity-100 light:hover:opacity-60 cursor-pointer"
      >
        <TextAlignLeft
          weight="fill"
          color="var(--theme-sidebar-footer-icon-fill)"
          className="w-[22px] h-[22px] pointer-events-none text-theme-text-primary"
        />
        <Tooltip
          id="tooltip-paste-transcription-btn"
          place="top"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
      </div>
      {isOpen && (
        <PasteTranscriptionModal
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}

function PasteTranscriptionModal({ onClose, onSubmit }) {
  const [transcription, setTranscription] = useState("");
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(transcription);
  }

  return (
    <ModalWrapper isOpen={true}>
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("chat_window.paste_transcription_title")}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="py-7 px-9 space-y-2 flex-col">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="transcription"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    {t("chat_window.paste_transcription_label")}
                  </label>
                  <p className="text-xs text-white/60 mb-3">
                    {t("chat_window.paste_transcription_description")}
                  </p>
                  <textarea
                    name="transcription"
                    id="transcription"
                    rows={12}
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 resize-none"
                    placeholder={t("chat_window.paste_transcription_placeholder")}
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    autoFocus={true}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
              <button
                type="button"
                onClick={onClose}
                className="transition-all duration-300 bg-transparent text-white hover:opacity-60 px-4 py-2 rounded-lg text-sm border border-white/20"
              >
                {t("chat_window.paste_transcription_cancel")}
              </button>
              <button
                type="submit"
                disabled={!transcription?.trim()}
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("chat_window.paste_transcription_insert")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}
