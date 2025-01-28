import { Warning, X } from "@phosphor-icons/react";

export default function ChangeWarningModal({
  warningText = "",
  onClose,
  onConfirm,
}) {
  return (
    <div className="relative w-[650px] max-w-2xl max-h-full">
      <div className="relative bg-theme-bg-secondary rounded-lg shadow border-2 border-gray-500/50">
        <div
          className="flex justify-end px-4 pt-4 cursor-pointer"
          onClick={onClose}
        >
          <X className="text-lg text-white w-6 h-6" />
        </div>
        <div className="flex items-start justify-between px-4 pb-4 border-b rounded-t border-gray-500/50">
          <div className="flex items-center gap-2">
            <Warning className="text-red-500 text-lg w-6 h-6" weight="fill" />
            <h3 className="text-xl font-semibold text-red-500">
              WARNING - This action is irreversible
            </h3>
          </div>
        </div>
        <div className="p-6 text-white">
          <p>
            {warningText}
            <br />
            <br />
            Are you sure you want to proceed?
          </p>
        </div>

        <div className="flex w-full justify-end items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300 border-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="transition-all duration-300 border-2 border-slate-200 px-4 py-2 rounded-lg text-white items-center flex gap-x-2 bg-red-500 hover:bg-red-400 focus:ring-gray-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
