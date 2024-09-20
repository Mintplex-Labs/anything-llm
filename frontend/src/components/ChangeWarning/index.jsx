import { Warning } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function ChangeWarningModal({
  warningText = "",
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation();

  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <div className="flex items-center gap-2">
            <Warning
              className="text-yellow-300 text-lg w-6 h-6"
              weight="fill"
            />
            <h3 className="text-xl font-semibold text-yellow-300">
              {t("modal.warning.title")}
            </h3>
          </div>
        </div>
        <div className="w-[550px] p-6 text-white">
          <p>
            {warningText}
            <br />
            <br />
            {t("modal.warning.confirmQuestion")}
          </p>
        </div>

        <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-all duration-300"
          >
            {t("modal.warning.cancelButton")}
          </button>
          <button
            onClick={onConfirm}
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            {t("modal.warning.confirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
