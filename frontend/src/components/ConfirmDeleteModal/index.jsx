import { useState } from "react";
import { X, Warning } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";

const CONFIRM_WORD = "LÖSCHEN";

/**
 * Confirmation modal that requires typing a codeword before destructive actions.
 * Similar to GitHub's repository deletion confirmation.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {function} props.onClose - Called when modal is dismissed
 * @param {function} props.onConfirm - Called when codeword is entered and confirmed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Warning message
 * @param {string} [props.confirmWord] - Custom codeword (default: "LÖSCHEN")
 * @param {boolean} [props.loading] - Show loading state on confirm button
 */
export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmWord = CONFIRM_WORD,
  loading = false,
}) {
  const [input, setInput] = useState("");
  const isMatch = input === confirmWord;

  const handleConfirm = () => {
    if (!isMatch || loading) return;
    onConfirm();
    setInput("");
  };

  const handleClose = () => {
    setInput("");
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="relative w-full max-w-md">
        <div className="bg-theme-bg-secondary rounded-lg shadow border-2 border-red-500/30 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-2">
              <Warning size={22} weight="fill" className="text-red-400" />
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <p className="text-sm text-theme-text-secondary leading-relaxed">
              {message}
            </p>

            <div className="space-y-2">
              <label className="text-sm text-theme-text-secondary">
                Zur Bestätigung{" "}
                <span className="font-bold text-red-400">{confirmWord}</span>{" "}
                eingeben:
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                placeholder={confirmWord}
                autoFocus
                className="w-full px-3 py-2 rounded-lg border border-red-500/30 bg-theme-bg-primary text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm rounded-lg text-theme-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isMatch || loading}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isMatch && !loading
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-red-500/20 text-red-300/40 cursor-not-allowed"
              }`}
            >
              {loading ? "Wird gelöscht..." : "Endgültig löschen"}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
